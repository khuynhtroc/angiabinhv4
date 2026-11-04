#!/usr/bin/env node
/**
 * scripts/run-social-backfill.mjs
 * Tự động đăng lại bài viết cũ lên Mạng Xã Hội (Facebook, Telegram) theo lịch hàng đợi.
 * Chạy tự động 24/7 qua GitHub Actions hoặc Cron Job.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables if available locally
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

const SITE_URL = process.env.APP_URL || 'https://www.betongangiabinh.vn';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876120939:AAEpkh1zZKQu6bq23eLv5gE_encPuFFhsCc';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8612893214';

async function sendTelegramAlert(title, lines) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const message = `📢 <b>${title}</b>\n\n` + lines.join('\n');
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      console.log('✓ Đã gửi thông báo Telegram thành công!');
    } else {
      console.warn('⚠️ Lỗi Telegram:', data.description);
    }
  } catch (err) {
    console.warn('⚠️ Không thể gửi Telegram:', err.message);
  }
}

async function main() {
  console.log(`[Backfill Cron] Bắt đầu kích hoạt tiến trình đăng lại bài cũ...`);
  console.log(`[Backfill Cron] Target Endpoint: ${SITE_URL}/api/cron/social-backfill?force=true`);

  try {
    const res = await fetch(`${SITE_URL}/api/cron/social-backfill?force=true`, {
      method: 'POST',
      headers: {
        'User-Agent': 'AnGiaBinh-Backfill-Cron/1.0',
        'Accept': 'application/json',
      },
    });

    const status = res.status;
    let data;
    try {
      data = await res.json();
    } catch {
      data = { raw: await res.text() };
    }

    console.log(`[Backfill Cron] Phản hồi HTTP ${status}:`, JSON.stringify(data, null, 2));

    if (!res.ok) {
      console.error(`[Backfill Cron] Thất bại với mã HTTP ${status}`);
      process.exit(1);
    }

    if (data.posted && data.post_title) {
      console.log(`🎉 ĐÃ ĐĂNG BÀI VIẾT THÀNH CÔNG: "${data.post_title}"`);
      const details = [
        `📌 <b>Tiêu đề:</b> ${data.post_title}`,
        `🔗 <b>Đường dẫn:</b> <a href="${SITE_URL}/blog/${data.post_slug}.html">${SITE_URL}/blog/${data.post_slug}.html</a>`,
        `📱 <b>Kênh thành công:</b> ${(data.succeeded_channels || []).join(', ') || 'Facebook'}`,
      ];

      if (data.facebook_url) {
        details.push(`🌐 <b>Link Facebook:</b> <a href="${data.facebook_url}">Xem trên Fanpage</a>`);
      }

      if (data.cursor !== undefined && data.total_posts !== undefined) {
        details.push(`📊 <b>Tiến trình hàng đợi:</b> ${data.cursor}/${data.total_posts} bài (${Math.round((data.cursor / data.total_posts) * 100)}%)`);
      }

      if (data.next_post_at) {
        const nextTime = new Date(data.next_post_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        details.push(`⏰ <b>Lượt đăng kế tiếp:</b> ${nextTime}`);
      }

      await sendTelegramAlert('ĐĂNG LẠI BÀI CŨ THEO LỊCH (MULTI-CHANNEL BACKFILL)', details);
    } else {
      console.log(`ℹ️ Trạng thái: ${data.message || data.status || 'Không có bài cần đăng'}`);
    }
  } catch (err) {
    console.error(`[Backfill Cron] Lỗi nghiêm trọng:`, err);
    process.exit(1);
  }
}

main();
