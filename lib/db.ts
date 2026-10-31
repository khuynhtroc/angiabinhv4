import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsServer } from './server-data';
import { getSupabaseClient } from './supabase-client';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const SOCIAL_SETTINGS_FILE = path.join(DATA_DIR, 'social-settings.json');

export const db = {
  async findOne(table: string, query?: Record<string, any>) {
    // 1. Try Supabase
    const sb = getSupabaseClient();
    if (sb) {
      try {
        if (table === 'settings' || table === 'social_settings') {
          const { data, error } = await sb
            .from('social_settings')
            .select('data')
            .eq('id', query?.id || 'main')
            .maybeSingle();

          if (!error && data?.data) {
            return data.data;
          }
        }
      } catch (err) {
        console.warn('[db] Supabase findOne error:', err);
      }
    }

    // 2. Fallback to local filesystem if available
    if (table === 'settings' || table === 'social_settings') {
      try {
        if (typeof fs !== 'undefined' && fs.existsSync && fs.existsSync(SOCIAL_SETTINGS_FILE)) {
          const raw = fs.readFileSync(SOCIAL_SETTINGS_FILE, 'utf8');
          return JSON.parse(raw);
        }
      } catch (err) {
        console.warn('[db] Failed to read social settings:', err);
      }
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
          console.warn('[db] Supabase find posts error:', e);
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
    // 1. Try Supabase
    const sb = getSupabaseClient();
    if (sb) {
      try {
        if (table === 'settings' || table === 'social_settings') {
          const id = typeof idOrQuery === 'string' ? idOrQuery : idOrQuery?.id || 'main';
          await sb.from('social_settings').upsert({
            id,
            data,
            updated_at: new Date().toISOString(),
          });
        } else if (table === 'posts' && data?.id) {
          await sb.from('posts').upsert(data, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('[db] Supabase update error:', err);
      }
    }

    // 2. Local filesystem fallback
    if (table === 'settings' || table === 'social_settings') {
      try {
        if (typeof fs !== 'undefined' && fs.writeFileSync) {
          if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
          }
          fs.writeFileSync(SOCIAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
        }
      } catch (err) {
        console.error('[db] Failed to save social settings locally:', err);
      }
    }
    return data;
  },

  async insert(table: string, data: any) {
    return this.update(table, null, data);
  },

  async getSetting(key: string) {
    const s = await this.findOne('settings', { id: key });
    return s ? (s[key] ?? s) : null;
  },

  async setSetting(key: string, val: any) {
    const s = (await this.findOne('settings', { id: key })) || {};
    s[key] = val;
    return this.update('settings', { id: key }, s);
  }
};
