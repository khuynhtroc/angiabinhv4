import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsServer } from './server-data';
import { getSupabaseClient } from './supabase-client';
import { commitFilesViaGitHubApi } from './github-api';
import defaultSocialSettings from '@/public/data/social-settings.json';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const SOCIAL_SETTINGS_FILE = path.join(DATA_DIR, 'social-settings.json');
const R2_SETTINGS_URL = 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/data/social-settings.json';
const GITHUB_RAW_SETTINGS_URL = 'https://raw.githubusercontent.com/khuynhtroc/angiabinhv4/main/public/data/social-settings.json';

// Short-lived in-memory cache (10 seconds TTL) to avoid stale cursor across cron runs
let cachedSettings: any = null;
let cachedAt = 0;
const CACHE_TTL_MS = 10 * 1000;

export const db = {
  async findOne(table: string, query?: Record<string, any>) {
    const id = query?.id || 'main';

    if (table === 'settings' || table === 'social_settings') {
      const now = Date.now();
      if (cachedSettings && now - cachedAt < CACHE_TTL_MS) {
        return cachedSettings;
      }

      // 1. Try local filesystem first when running in Node/CLI/Dev
      try {
        if (typeof fs !== 'undefined' && fs.existsSync && fs.existsSync(SOCIAL_SETTINGS_FILE)) {
          const raw = fs.readFileSync(SOCIAL_SETTINGS_FILE, 'utf8');
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            cachedSettings = parsed;
            cachedAt = now;
            // On Cloudflare Workers, fs.readFileSync may return the static build-time asset;
            // so we still check live R2 / GitHub Raw below if we are in a worker environment.
          }
        }
      } catch {}

      // 2. Try live Cloudflare R2 (updated immediately by GitHub Actions & Admin)
      try {
        const r2Res = await fetch(`${R2_SETTINGS_URL}?t=${now}`, { cache: 'no-store' });
        if (r2Res.ok) {
          const r2Data = await r2Res.json();
          if (r2Data && typeof r2Data === 'object' && r2Data.facebook_backfill) {
            // Pick whichever has the higher cursor between local and R2
            const localCursor = cachedSettings?.facebook_backfill?.cursor || 0;
            const r2Cursor = r2Data?.facebook_backfill?.cursor || 0;
            if (!cachedSettings || r2Cursor >= localCursor) {
              cachedSettings = r2Data;
              cachedAt = now;
              return r2Data;
            }
          }
        }
      } catch {}

      // 3. Try GitHub Raw (always reflects latest git commit on main)
      try {
        const ghRes = await fetch(`${GITHUB_RAW_SETTINGS_URL}?t=${now}`, { cache: 'no-store' });
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          if (ghData && typeof ghData === 'object' && ghData.facebook_backfill) {
            const currentCursor = cachedSettings?.facebook_backfill?.cursor || 0;
            const ghCursor = ghData?.facebook_backfill?.cursor || 0;
            if (!cachedSettings || ghCursor >= currentCursor) {
              cachedSettings = ghData;
              cachedAt = now;
              return ghData;
            }
          }
        }
      } catch {}

      // 4. Try Supabase
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('social_settings')
            .select('data')
            .eq('id', id)
            .maybeSingle();

          if (!error && data?.data) {
            cachedSettings = data.data;
            cachedAt = now;
            return data.data;
          }
        } catch {}
      }

      if (cachedSettings) {
        return cachedSettings;
      }

      // 5. Bundled fallback
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
        } catch {}
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

  async find(table: string, _query?: any) {
    if (table === 'posts') {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb.from('posts').select('*').order('date', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            return { rows: data, total: data.length };
          }
        } catch {}
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
      cachedSettings = data;
      cachedAt = Date.now();

      // 2. Try Supabase safely
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('social_settings').upsert({
            id,
            data,
            updated_at: new Date().toISOString(),
          });
        } catch {}
      }

      // 3. Local filesystem fallback if writable
      try {
        if (typeof fs !== 'undefined' && fs.writeFileSync) {
          if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
          }
          fs.writeFileSync(SOCIAL_SETTINGS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
        }
      } catch {}

      // 4. Commit to GitHub via GitHub API (awaited so serverless workers don't terminate early)
      try {
        await commitFilesViaGitHubApi(
          [{ path: 'public/data/social-settings.json', content: JSON.stringify(data, null, 2) + '\n' }],
          'chore(settings): auto-persist social settings'
        );
      } catch {}

      return data;
    }

    if (table === 'posts' && data?.id) {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('posts').upsert(data, { onConflict: 'id' });
        } catch {}
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
