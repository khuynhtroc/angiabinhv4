import fs from 'node:fs';
import path from 'node:path';
import { getAllPostsServer, savePostsServer } from './server-data';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const SOCIAL_SETTINGS_FILE = path.join(DATA_DIR, 'social-settings.json');

export const db = {
  async findOne(table: string, query?: Record<string, any>) {
    if (table === 'settings' || table === 'social_settings') {
      try {
        if (fs.existsSync(SOCIAL_SETTINGS_FILE)) {
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
    if (table === 'settings' || table === 'social_settings') {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(SOCIAL_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
        return data;
      } catch (err) {
        console.error('[db] Failed to save social settings:', err);
      }
    }
    return data;
  },

  async insert(table: string, data: any) {
    return this.update(table, null, data);
  },

  async getSetting(key: string) {
    const s = await this.findOne('settings');
    return s ? s[key] : null;
  },

  async setSetting(key: string, val: any) {
    const s = (await this.findOne('settings')) || {};
    s[key] = val;
    return this.update('settings', null, s);
  }
};
