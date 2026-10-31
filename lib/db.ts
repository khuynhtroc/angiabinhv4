import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsServer } from './server-data';
import { getSupabaseClient } from './supabase-client';
import { commitFilesViaGitHubApi } from './github-api';
import defaultSocialSettings from '@/public/data/social-settings.json';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const SOCIAL_SETTINGS_FILE = path.join(DATA_DIR, 'social-settings.json');

// In-memory cache across serverless requests in the same isolate
const memorySettingsCache: Record<string, any> = {
  social_settings: defaultSocialSettings,
  main: defaultSocialSettings,
  settings: defaultSocialSettings,
};

export const db = {
  async findOne(table: string, query?: Record<string, any>) {
    const id = query?.id || 'main';

    if (table === 'settings' || table === 'social_settings') {
      // 1. Try memory cache first
      if (memorySettingsCache[id]) {
        return memorySettingsCache[id];
      }
      if (id === 'social_settings' && memorySettingsCache['main']) {
        return memorySettingsCache['main'];
      }

      // 2. Try Supabase
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('social_settings')
            .select('data')
            .eq('id', id)
            .maybeSingle();

          if (!error && data?.data) {
            memorySettingsCache[id] = data.data;
            return data.data;
          }
        } catch (err) {
          // Ignore missing table error
        }
      }

      // 3. Fallback to local filesystem if available
      try {
        if (typeof fs !== 'undefined' && fs.existsSync && fs.existsSync(SOCIAL_SETTINGS_FILE)) {
          const raw = fs.readFileSync(SOCIAL_SETTINGS_FILE, 'utf8');
          const parsed = JSON.parse(raw);
          memorySettingsCache[id] = parsed;
          return parsed;
        }
      } catch (err) {
        console.warn('[db] Failed to read social settings:', err);
      }

      // 4. Bundled fallback
      return defaultSocialSettings;
    }

    if (table === 'posts') {
      const targetId = query?.id || query?.slug;
      if (!targetId) return null;

      // 1. Try Supabase
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('posts')
            .select('*')
            .or(`id.eq.${targetId},slug.eq.${targetId}`)
            .maybeSingle();

          if (!error && data) {
            return data;
          }
        } catch (err) {}
      }

      // 2. Local / bundled posts fallback
      try {
        const posts = getAllPostsServer();
        const found = posts.find((p) => p.id === targetId || p.slug === targetId);
        if (found) return found;
      } catch {}
      return null;
    }

    return null;
  },

  async find(table: string, query?: any) {
    if (table === 'posts') {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb.from('posts').select('*').order('date', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            return { rows: data, total: data.length };
          }
        } catch (e) {
          // ignore
        }
      }

      try {
        const posts = getAllPostsServer();
        return { rows: posts, total: posts.length };
      } catch {
        return { rows: [], total: 0 };
      }
    }
    return { rows: [], total: 0 };
  },

  async update(table: string, idOrQuery: any, data: any) {
    const id = typeof idOrQuery === 'string' ? idOrQuery : idOrQuery?.id || 'main';

    if (table === 'settings' || table === 'social_settings') {
      // 1. Update in-memory cache immediately
      memorySettingsCache[id] = data;
      memorySettingsCache['social_settings'] = data;
      memorySettingsCache['main'] = data;

      // 2. Try Supabase safely
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('social_settings').upsert({
            id,
            data,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          // safe catch if table doesn't exist
        }
      }

      // 3. Local filesystem fallback if writable
      try {
        if (typeof fs !== 'undefined' && fs.writeFileSync) {
          if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
          }
          fs.writeFileSync(SOCIAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
        }
      } catch (err) {
        // Cloudflare worker read-only filesystem is expected
      }

      // 4. Asynchronously commit to GitHub via GitHub Git Database API
      try {
        commitFilesViaGitHubApi(
          [{ path: 'public/data/social-settings.json', content: JSON.stringify(data, null, 2) }],
          'chore(settings): auto-persist social settings'
        ).catch(() => { });
      } catch { }

      return data;
    }

    if (table === 'posts' && data?.id) {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('posts').upsert(data, { onConflict: 'id' });
        } catch { }
      }
    }

    return data;
  },

  async insert(table: string, data: any) {
    return this.update(table, null, data);
  },

  async getSetting(key: string) {
    const s = await this.findOne('settings', { id: key });
    if (!s) return null;
    return s[key] !== undefined ? s[key] : s;
  },

  async setSetting(key: string, val: any) {
    let s = (await this.findOne('settings', { id: key })) || {};
    if (typeof s !== 'object' || s === null) s = {};
    s[key] = val;
    if (typeof val === 'object' && val !== null) {
      s = { ...s, ...val };
    }
    return this.update('settings', { id: key }, s);
  }
};
