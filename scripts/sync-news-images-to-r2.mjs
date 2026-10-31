#!/usr/bin/env node
/**
 * scripts/sync-news-images-to-r2.mjs
 * Tải toàn bộ ảnh đại diện và ảnh trong nội dung bài viết tin tức/trends về,
 * tải ngược lên Cloudflare R2 bucket an-gia-binh-media,
 * cập nhật posts.json & Supabase, rồi submit lại Google Indexing & IndexNow.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { processPostImagesToR2 } from './r2-helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load .env.local
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

const POSTS_FILE = path.join(ROOT_DIR, 'public', 'data', 'posts.json');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msxqrdaklnfpqwhxwjlc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHFyZGFrbG5mcHF3aHh3amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDMxNjYsImV4cCI6MjEwODk3OTE2Nn0.QIa6Zq6cTFr08kjaZdIq5cwVPzVvy4eXXh2DnL5967M';

async function submitGoogleIndexing(url) {
  try {
    const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';
    if (!rawJson) return { ok: false, message: 'Chưa cấu hình GOOGLE_SERVICE_ACCOUNT_JSON' };

    const creds = JSON.parse(rawJson);
    const email = creds.client_email;
    const privateKey = creds.private_key;
    if (!email || !privateKey) return { ok: false, message: 'Google credentials không hợp lệ' };

    const crypto = await import('node:crypto');
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const claimSet = Buffer.from(
      JSON.stringify({
        iss: email,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
      })
    ).toString('base64url');

    const signature = crypto
      .createSign('RSA-SHA256')
      .update(`${header}.${claimSet}`)
      .sign(privateKey, 'base64url');

    const jwt = `${header}.${claimSet}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return { ok: false, message: 'Lỗi lấy Google token: ' + JSON.stringify(tokenData) };
    }

    const indexRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' })
    });

    const indexData = await indexRes.json();
    return { ok: indexRes.ok, data: indexData };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function submitIndexNow(url) {
  try {
    const key = '68f6a9788d4444ff94d4ee1bf5df05e0';
    const host = 'www.betongangiabinh.vn';
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList: [url]
      })
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function main() {
  console.log('🚀 Bắt đầu tiến trình đồng bộ ảnh toàn bộ bài viết Tin Tức/Trends sang Cloudflare R2...');

  if (!fs.existsSync(POSTS_FILE)) {
    console.error('Không tìm thấy tệp posts.json');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  const newsPosts = posts.filter(
    (p) =>
      p.isTrendingNews ||
      p.category === 'Tin Tức & Thị Trường' ||
      (p.permalink && p.permalink.includes('tin-tuc'))
  );

  console.log(`📋 Tìm thấy ${newsPosts.length} bài viết tin tức cần kiểm tra ảnh.`);

  let totalUpdated = 0;
  const canonicalUrls = [];

  for (let i = 0; i < newsPosts.length; i++) {
    const post = newsPosts[i];
    console.log(`\n[${i + 1}/${newsPosts.length}] Đang xử lý: ${post.title.slice(0, 60)}...`);

    const originalCover = post.coverImage;
    const originalContent = post.content;

    const r2Result = await processPostImagesToR2({
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage,
      content: post.content
    });

    const changed =
      r2Result.coverImage !== originalCover ||
      r2Result.content !== originalContent ||
      r2Result.replacedCount > 0;

    if (changed) {
      post.coverImage = r2Result.coverImage;
      post.content = r2Result.content;
      post.updatedAt = new Date().toISOString();
      totalUpdated++;
      console.log(`  ✓ Đã cập nhật ${r2Result.replacedCount} ảnh sang R2!`);
      console.log(`    Cover mới: ${post.coverImage}`);

      // Sync Supabase
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content || '',
            coverImage: post.coverImage || '',
            author: post.author || 'Ban Kỹ Thuật An Gia Bình',
            date: post.date || '',
            category: post.category || 'Tin Tức & Thị Trường',
            tags: post.tags || [],
            views: post.views || 0,
            readTime: post.readTime || '6 phút',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            focusKeywords: post.focusKeywords || [],
            isPublished: true,
            permalink: post.permalink || '',
            updatedAt: post.updatedAt,
            isTrendingNews: true,
            sourceUrl: post.sourceUrl || '',
            trendScore: post.trendScore || 0,
            newsType: post.newsType || ''
          })
        });
      } catch (sbErr) {
        // silent
      }
    } else {
      console.log(`  ℹ️ Ảnh bài viết đã ở Cloudflare R2: ${post.coverImage}`);
    }

    const canonicalUrl = `https://www.betongangiabinh.vn${post.permalink || `/blog/tin-tuc/${post.slug}.html`}`;
    canonicalUrls.push(canonicalUrl);
  }

  // Save posts.json
  if (totalUpdated > 0) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`\n💾 Đã lưu bài viết với ảnh R2 mới vào public/data/posts.json.`);
  }

  // Submit index for all news articles
  console.log('\n📡 Đang submit Index các bài viết tin tức sang Google Indexing & IndexNow...');
  for (const url of canonicalUrls) {
    const [gRes, inRes] = await Promise.all([submitGoogleIndexing(url), submitIndexNow(url)]);
    console.log(`- ${url}:`);
    console.log(`  • Google Indexing: ${gRes.ok ? '✅ Thành công' : '⚠️ ' + (gRes.message || JSON.stringify(gRes.data))}`);
    console.log(`  • Bing IndexNow: ${inRes.ok ? `✅ Thành công (HTTP ${inRes.status})` : '⚠️ ' + inRes.message}`);
  }

  console.log(`\n🎉 Hoàn thành kiểm tra & xử lý ảnh R2! Tổng bài cập nhật: ${totalUpdated}/${newsPosts.length}`);
}

main().catch((err) => {
  console.error('Lỗi nghiêm trọng:', err);
  process.exit(1);
});
