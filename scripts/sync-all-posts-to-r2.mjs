import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadBufferToR2 } from './r2-helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT_DIR, 'public', 'data', 'posts.json');

async function sync() {
  const raw = fs.readFileSync(POSTS_FILE, 'utf8');
  const posts = JSON.parse(raw);
  console.log(`Starting sync of ${posts.length} posts to Cloudflare R2...`);

  // 1. Upload full posts.json
  const mainUrl = await uploadBufferToR2(Buffer.from(raw, 'utf8'), 'data/posts.json', 'application/json');
  console.log('✓ Uploaded data/posts.json to R2:', mainUrl);

  // 2. Upload latest 50 posts as individual JSONs for ultra-fast single post lookup
  const latestPosts = posts.slice(0, 50);
  let count = 0;
  for (const post of latestPosts) {
    const slug = post.slug || post.id;
    if (!slug) continue;
    const clean = slug.replace(/\.html$/, '').replace(/^\/?(blog\/)?(tin-tuc\/)?/, '');
    const jsonStr = JSON.stringify(post);
    await uploadBufferToR2(Buffer.from(jsonStr, 'utf8'), `data/posts/${clean}.json`, 'application/json');
    count++;
  }
  console.log(`✓ Uploaded ${count} latest individual post JSON files to R2!`);
}

sync().catch(e => console.error('Sync error:', e));
