#!/usr/bin/env node
/**
 * scripts/seed-supabase.mjs
 * Đồng bộ toàn bộ dữ liệu từ public/data/ (posts.json, projects.json, categories.json, etc.) lên Supabase.
 * Chạy lệnh: node scripts/seed-supabase.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msxqrdaklnfpqwhxwjlc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHFyZGFrbG5mcHF3aHh3amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDMxNjYsImV4cCI6MjEwODk3OTE2Nn0.QIa6Zq6cTFr08kjaZdIq5cwVPzVvy4eXXh2DnL5967M';

console.log(`[Seed Supabase] Connecting to ${SUPABASE_URL}...`);
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function seedTable(tableName, items, primaryKey = 'id') {
  if (!items || !items.length) {
    console.log(`[Seed] Không có dữ liệu cho bảng ${tableName}. Bỏ qua.`);
    return;
  }
  console.log(`[Seed] Đang đẩy ${items.length} bản ghi vào bảng "${tableName}"...`);
  
  // Try batch upsert
  const batchSize = 100;
  let successCount = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const { error } = await sb.from(tableName).upsert(batch, { onConflict: primaryKey });
    if (error) {
      console.warn(`[Seed Warning] Bảng ${tableName} gặp lỗi: ${error.message} (mã: ${error.code})`);
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        console.warn(`   => Bảng "${tableName}" chưa được tạo trong Supabase. Hãy chạy supabase_schema.sql trong SQL Editor trước.`);
      }
      return false;
    }
    successCount += batch.length;
    process.stdout.write(`\r   Tiến độ ${tableName}: ${Math.min(i + batchSize, items.length)}/${items.length}`);
  }
  console.log(`\n✓ Đã đồng bộ thành công ${successCount} bản ghi vào "${tableName}".`);
  return true;
}

async function seedDataStore(key, data) {
  const { error } = await sb.from('site_data_store').upsert({
    id: key,
    data: data,
    updated_at: new Date().toISOString()
  });
  if (error) {
    console.warn(`[Seed site_data_store] Lỗi khi lưu key "${key}":`, error.message);
  } else {
    console.log(`✓ Đã lưu dự phòng key "${key}" vào site_data_store.`);
  }
}

async function main() {
  const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');

  // 1. Posts
  const postsPath = path.join(DATA_DIR, 'posts.json');
  if (fs.existsSync(postsPath)) {
    const raw = fs.readFileSync(postsPath, 'utf8');
    try {
      const posts = JSON.parse(raw);
      if (Array.isArray(posts) && posts.length > 0) {
        await seedTable('posts', posts, 'id');
        await seedDataStore('posts', posts);
      }
    } catch (e) {
      console.error('Lỗi đọc posts.json:', e);
    }
  }

  // 2. Projects
  const projectsPath = path.join(DATA_DIR, 'projects.json');
  if (fs.existsSync(projectsPath)) {
    const raw = fs.readFileSync(projectsPath, 'utf8');
    try {
      const projects = JSON.parse(raw);
      if (Array.isArray(projects) && projects.length > 0) {
        await seedTable('projects', projects, 'id');
        await seedDataStore('projects', projects);
      }
    } catch (e) {}
  }

  // 3. Categories
  const categoriesPath = path.join(DATA_DIR, 'categories.json');
  if (fs.existsSync(categoriesPath)) {
    const raw = fs.readFileSync(categoriesPath, 'utf8');
    try {
      const cats = JSON.parse(raw);
      if (Array.isArray(cats) && cats.length > 0) {
        await seedTable('categories', cats, 'id');
      }
    } catch (e) {}
  }

  // 4. Config & Settings
  const configPath = path.join(DATA_DIR, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      await seedDataStore('config', config);
    } catch (e) {}
  }

  console.log('\n======================================================');
  console.log('HOÀN THÀNH ĐỒNG BỘ SUPABASE CHO BETONGANGIABINH.VN!');
  console.log('Nếu bảng chưa tồn tại, hãy nhớ chạy file supabase_schema.sql trong Supabase SQL Editor.');
  console.log('======================================================\n');
}

main().catch(err => console.error('Lỗi khi seed Supabase:', err));
