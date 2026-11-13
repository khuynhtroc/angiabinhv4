#!/usr/bin/env node
/**
 * scripts/run-social-backfill.mjs
 * Tự động đăng lại bài viết cũ lên Mạng Xã Hội (Facebook Fanpage, Telegram) theo lịch hàng đợi.
 * Thực thi trực tiếp, lưu cursor bền vững vào public/data/social-settings.json, Cloudflare R2 và GitHub main!
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { uploadBufferToR2 } from './r2-helper.mjs';

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
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://msxqrdaklnfpqwhxwjlc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHFyZGFrbG5mcHF3aHh3amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDMxNjYsImV4cCI6MjEwODk3OTE2Nn0.QIa6Zq6cTFr08kjaZdIq5cwVPzVvy4eXXh2DnL5967M';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876120939:AAEpkh1zZKQu6bq23eLv5gE_encPuFFhsCc';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8612893214';

const SETTINGS_FILE = path.join(ROOT_DIR, 'public', 'data', 'social-settings.json');
const POSTS_FILE = path.join(ROOT_DIR, 'public', 'data', 'posts.json');

function getCanonicalPostUrl(post) {
  const cat = String(post.category || '').toLowerCase();
  const isNews =
    cat === 'tin-tuc' ||
    cat === 'tin tức & thị trường' ||
    cat.includes('tin tức') ||
    post.isTrendingNews ||
    (post.permalink && post.permalink.includes('/blog/tin-tuc/'));

  const raw = post.slug || post.permalink || post.id || '';
  const clean = String(raw)
    .trim()
    .replace(/^\/?(blog\/)?/, '')
    .replace(/^tin-tuc\//, '')
    .replace(/\/+\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '')
    .trim();

  if (isNews) {
    return `${SITE_URL}/blog/tin-tuc/${clean}.html`;
  }
  return `${SITE_URL}/${clean}.html`;
}

function toHashtagSlug(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function formatVietnamesePhone(numStr) {
  let digits = String(numStr || '').replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length >= 11) {
    digits = '0' + digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 11 && digits.startsWith('02')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return null;
}

function extractAndDeduplicatePhones(text, explicitPhone) {
  const candidates = [];
  if (explicitPhone) candidates.push(explicitPhone);
  if (text) {
    const matches = String(text).match(/(?:(?:\+84|84|0)[1-9][0-9\s.\-]{7,12}[0-9])/g);
    if (matches) candidates.push(...matches);
  }
  const uniquePhones = [];
  for (const raw of candidates) {
    for (const part of String(raw).split(/hoặc|\/|-|\bvà\b|;|•|,/i)) {
      const formatted = formatVietnamesePhone(part);
      if (formatted && !uniquePhones.includes(formatted)) {
        uniquePhones.push(formatted);
      }
    }
  }
  const defaultHotline = '0988 266 293';
  if (!uniquePhones.includes(defaultHotline)) {
    uniquePhones.unshift(defaultHotline);
  }
  return uniquePhones.slice(0, 2).join(' • ');
}

function extractCleanIntro(text) {
  if (!text) return '';
  return String(text)
    .replace(/(?:Điện thoại|Hotline|Số điện thoại|ĐT|SĐT)[\s:]*[0-9\s.hoặc/,-]{9,60}/gi, '')
    .replace(/Trạm trộn Bê Tông An Gia Bình đạt chuẩn TCVN.*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,;–—\-\s]+|[.,;–—\-\s]+$/g, '')
    .trim();
}

function detectTopic(title, category, excerpt) {
  const combined = `${title} ${category} ${excerpt}`.toLowerCase();
  if (/cao tốc|quốc lộ|đường tỉnh|đt\d+|ql\d+|cầu |sân bay|hạ tầng|giao thông|ùn tắc|thông xe|khởi công|nâng cấp|đầu tư công|dự án khẩn cấp|tuyến đường/i.test(combined)) {
    return 'infrastructure';
  }
  if (/bảng giá|báo giá|đơn giá|giá bê tông|chi phí|ép cọc|mác 200|mác 250|mác 300|mác 350|m200|m250|m300|m350|m400/i.test(combined)) {
    return 'pricing';
  }
  if (/bê tông nhẹ|sàn panel|bê tông nhựa|khí chưng áp|panel|vật liệu mới|tấm tường/i.test(combined)) {
    return 'material';
  }
  if (/xe bơm|bơm cần|bơm tĩnh|xe bồn|trạm trộn|cụm trạm|công suất trạm|vận chuyển bê tông/i.test(combined)) {
    return 'pump';
  }
  if (/bảo dưỡng|độ sụt|nứt sàn|cấp phối|mác bê tông|cường độ|r28|phụ gia|chống thấm|đổ móng|đổ sàn|đổ dầm|đầm dùi|kỹ thuật|tcvn|sức chịu tải|so sánh/i.test(combined)) {
    return 'technical';
  }
  if (/thị trường|bất động sản|thời sự|quy hoạch|xây dựng/i.test(combined)) {
    return 'market';
  }
  return 'general';
}

/**
 * Sinh nội dung bài đăng Facebook chuẩn 5 phần SEO GEO cho Bê Tông An Gia Bình
 */
function buildOptimizedFacebookStatus(post, fullUrl) {
  const rawTitle = String(post.title || 'Bê Tông An Gia Bình').trim();
  const rawCategory = String(post.category || 'Kiến Thức Kỹ Thuật').trim();
  const rawExcerpt = String(post.excerpt || post.seoDescription || post.seo_description || '').trim();

  const topic = detectTopic(rawTitle, rawCategory, rawExcerpt);
  const address = 'Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình • Trạm 2: Kim Sơn, Ninh Bình';
  const phone = extractAndDeduplicatePhones(rawExcerpt, post.phone || post.hotline);
  const cleanIntro = extractCleanIntro(rawExcerpt);

  // 1. Hook Headline
  const hookMap = {
    infrastructure: `🛣️ [TIẾN ĐỘ HẠ TẦNG & GIAO THÔNG] • ${rawTitle.toUpperCase()}`,
    pricing: `📊 [BẢNG GIÁ BÊ TÔNG TƯƠI MỚI NHẤT] • ${rawTitle.toUpperCase()}`,
    technical: `⚙️ [KỸ THUẬT & TIÊU CHUẨN ĐỔ BÊ TÔNG] • ${rawTitle.toUpperCase()}`,
    pump: `🚛 [CỤM TRẠM TRỘN & DỊCH VỤ XE BƠM 24/7] • ${rawTitle.toUpperCase()}`,
    material: `🧱 [VẬT LIỆU XÂY DỰNG CÔNG NGHỆ MỚI] • ${rawTitle.toUpperCase()}`,
    market: `📰 [THỊ TRƯỜNG XÂY DỰNG & VẬT LIỆU 24H] • ${rawTitle.toUpperCase()}`,
    general: `🏗️ [BÊ TÔNG AN GIA BÌNH - VỮNG BỀN MỌI CÔNG TRÌNH] • ${rawTitle.toUpperCase()}`,
  };
  const hookTitle = hookMap[topic] || hookMap.general;

  // 2. Storytelling Hook
  const introMap = {
    infrastructure: 'Các dự án hạ tầng giao thông và công trình trọng điểm luôn đòi hỏi tiêu chuẩn khắt khe về chất lượng mác bê tông, tiến độ cấp hàng liên tục và kiểm soát chặt chẽ quy trình thử mẫu nghiệm thu. Đội ngũ kỹ sư Bê Tông An Gia Bình luôn sẵn sàng đồng hành cùng các nhà thầu thi công đạt chuẩn chất lượng và vượt tiến độ.',
    pricing: 'Bê Tông An Gia Bình cập nhật bảng báo giá bê tông tươi thương phẩm mới nhất, tối ưu chi phí vật tư cho các chủ đầu tư, nhà thầu và hộ gia đình tại Ninh Bình và các vùng lân cận. Cam kết đủ khối lượng, đúng mác thiết kế và niêm phong kẹp chì từng xe bồn xuất trạm.',
    technical: 'Quy trình thi công và dưỡng hộ đúng kỹ thuật là yếu tố then chốt quyết định 90% độ bền và khả năng chống nứt, chống thấm của kết cấu bê tông. Cùng chuyên gia kỹ thuật An Gia Bình tìm hiểu các giải pháp thi công tối ưu đảm bảo tuổi thọ công trình bền vững cùng thời gian.',
    pump: 'Hệ thống trạm trộn tự động hóa công suất cao cùng dàn xe bồn chuyên dụng và xe bơm cần hiện đại (37m - 56m, bơm tĩnh vươn xa) của An Gia Bình đáp ứng mọi yêu cầu cấp bê tông liên tục ngày đêm, kể cả các vị trí ngõ hẹp và nhà cao tầng.',
    material: 'Ứng dụng các dòng vật liệu xây dựng công nghệ mới giúp giảm tải trọng kết cấu, cách âm, cách nhiệt vượt trội và đẩy nhanh tiến độ thi công. Giải pháp xây dựng hiện đại cho các công trình xanh và thông minh.',
    market: 'Cập nhật những diễn biến mới nhất về thị trường vật liệu xây dựng, chính sách quy hoạch và tiến độ các dự án xây dựng trọng điểm. Góc nhìn chuyên sâu từ các kỹ sư xây dựng Bê Tông An Gia Bình.',
    general: 'Bê Tông An Gia Bình tự hào là đối tác tin cậy cung cấp bê tông thương phẩm chất lượng cao cho hàng nghìn công trình dân dụng và dự án công nghiệp trọng điểm tại Ninh Bình và các tỉnh lân cận.',
  };
  const narrativeIntro =
    cleanIntro && cleanIntro.length >= 50 && cleanIntro.toLowerCase() !== rawTitle.toLowerCase()
      ? cleanIntro
      : introMap[topic] || introMap.general;

  // 3. Địa chỉ & Hotline khử trùng lặp
  const infoSection = [
    '📌 THÔNG TIN LIÊN HỆ & NĂNG LỰC CUNG ỨNG:',
    `📍 Trạm trộn & Nhà máy: ${address}`,
    `📞 Hotline tư vấn & đặt dịch vụ 24/7: ${phone}`,
    `🏷️ Chuyên mục: ${rawCategory}`,
  ].join('\n');

  // 4. Mẹo bỏ túi & CTA
  const tipMap = {
    infrastructure: '💡 Lời khuyên cho nhà thầu: Với các hạng mục đổ bê tông khối lớn, nên phối hợp chặt chẽ với trạm trộn để điều tiết tần suất xe bồn 10-15 phút/xe, tránh tình trạng chờ lâu làm suy giảm độ sụt thiết kế!',
    pricing: '💡 Lời khuyên cho chủ đầu tư: Hãy liên hệ sớm trước 24h - 48h để kỹ sư trạm khảo sát mặt bằng, tư vấn cấp phối mác tối ưu chi phí và nhận chính sách chiết khấu trực tiếp tốt nhất!',
    technical: "💡 Lời khuyên kỹ thuật: 7 ngày đầu tiên sau khi đổ là 'thời gian vàng' phát triển cường độ; hãy duy trì tưới nước dưỡng ẩm liên tục ngày 3-4 lần để phòng tránh tối đa hiện tượng rạn nứt bề mặt!",
    pump: '💡 Lời khuyên cho công trình: Bố trí trước khoảng trống tối thiểu 4m cho xe bơm đỗ và đường vào thông thoáng cho xe bồn quay đầu để quá trình bơm bê tông diễn ra nhịp nhàng, an toàn!',
    material: '💡 Lời khuyên: Khi thi công các dòng bê tông nhẹ và panel, nên sử dụng vữa dán chuyên dụng và xử lý mối nối chống thấm kỹ càng theo đúng khuyến cáo của nhà sản xuất!',
    general: '💡 Lời khuyên: Luôn yêu cầu nhân viên kỹ thuật thử độ sụt bằng côn chuẩn tại công trình và giữ lại biên bản giao nhận có kẹp chì niêm phong xe bồn.',
  };
  const tipText = tipMap[topic] || tipMap.general;
  const ctaSection = `👉 Xem chi tiết bài viết, phân tích kỹ thuật và nhận báo giá ưu đãi tại:\n🔗 ${fullUrl}`;

  // 5. Cụm 8-12 Hashtags chuẩn SEO Facebook & SEO GEO
  const tagList = [
    '#BeTongAnGiaBinh',
    '#AnGiaBinh',
    '#BeTongTuoi',
    '#BeTongThuongPham',
    '#TramTronBeTong',
    '#BeTongNinhBinh',
    '#BeTongTuoiNinhBinh',
    '#XayDungNinhBinh',
  ];
  if (topic === 'pricing') tagList.push('#BaoGiaBeTong', '#GiaBeTongTuoi');
  else if (topic === 'infrastructure') tagList.push('#HaTangGiaoThong', '#TienDoCongTrinh');
  else if (topic === 'technical') tagList.push('#KyThuatBeTong', '#BaoDuongBeTong');
  else if (topic === 'pump') tagList.push('#XeBomBeTong', '#XeBonBeTong');
  else tagList.push('#VatLieuXayDung', '#DoBeTong');

  const titleTag = toHashtagSlug(rawTitle);
  if (titleTag && titleTag.length > 3) tagList.push(`#${titleTag}`);

  const uniqueTags = [...new Set(tagList)].slice(0, 12);

  return [
    hookTitle,
    '',
    narrativeIntro,
    '',
    infoSection,
    '',
    tipText,
    '',
    ctaSection,
    '',
    uniqueTags.join(' '),
  ].join('\n').trim();
}

async function publishToFacebook(post, settings) {
  const pageId = String(process.env.FACEBOOK_PAGE_ID || settings.facebook_page_id || '217910354731480').trim();
  let token = String(process.env.FACEBOOK_ACCESS_TOKEN || settings.facebook_access_token || '').trim();

  if (!pageId || !token) {
    throw new Error('Thiếu Facebook Page ID hoặc Access Token');
  }

  // Auto-resolve Page Access Token if input token is a User token
  try {
    const pageInfoRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=access_token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const pageInfoData = await pageInfoRes.json();
    if (pageInfoData?.access_token) {
      token = pageInfoData.access_token;
    }
  } catch {}

  const postUrl = getCanonicalPostUrl(post);
  const message = buildOptimizedFacebookStatus(post, postUrl);

  const DEFAULT_COVER = 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg';
  const R2_BASE = 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev';
  let rawCover = String(post.coverImage || post.og_image || post.hero_image || post.image || '')
    .replace(/["'`]/g, '')
    .split('#')[0]
    .trim()
    .split(/\s+/)[0];

  if (!rawCover && post.content) {
    const mdImgMatch = String(post.content).match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    const htmlImgMatch = String(post.content).match(/<img[^>]+src=["']([^"']+)["']/i);
    rawCover = (mdImgMatch && mdImgMatch[1]) || (htmlImgMatch && htmlImgMatch[1]) || '';
  }

  let photoUrl = rawCover || DEFAULT_COVER;
  if (photoUrl.startsWith('/images/')) {
    photoUrl = `${R2_BASE}${photoUrl}`;
  } else if (photoUrl.startsWith('/')) {
    photoUrl = `${SITE_URL}${photoUrl}`;
  }

  if (/\.webp(\?|$)/i.test(photoUrl)) {
    photoUrl = `https://wsrv.nl/?url=${encodeURIComponent(photoUrl)}&output=jpg&q=90`;
  }

  const sendPhotoRequest = async (targetImgUrl) => {
    const params = new URLSearchParams({
      url: targetImgUrl,
      caption: message,
    });
    const r = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: params.toString(),
    });
    return { res: r, data: await r.json() };
  };

  let { res, data } = await sendPhotoRequest(photoUrl);
  if ((!res.ok || data.error) && photoUrl !== DEFAULT_COVER) {
    console.warn(`⚠️ Ảnh gốc (${photoUrl}) không tải được lên FB, chuyển sang ảnh đại diện chuẩn R2...`);
    ({ res, data } = await sendPhotoRequest(DEFAULT_COVER));
  }

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  const fbPostId = data.post_id || data.id;
  return {
    post_id: fbPostId,
    url: `https://facebook.com/${fbPostId}`,
    postUrl,
    photoUrl,
  };
}

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

function gitPersistSettings(commitMsg) {
  try {
    execSync('git add public/data/social-settings.json', { cwd: ROOT_DIR, stdio: 'pipe' });
    const diff = execSync('git diff --cached --name-only', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    if (!diff) {
      console.log('ℹ️ Không có thay đổi git cần commit.');
      return;
    }
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, stdio: 'pipe' });
    const hash = execSync('git rev-parse --short HEAD', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();

    if (GITHUB_TOKEN) {
      const remoteUrl = `https://${GITHUB_TOKEN}@github.com/khuynhtroc/angiabinhv4.git`;
      execSync(`git pull --rebase --autostash -X ours ${remoteUrl} main`, { cwd: ROOT_DIR, stdio: 'pipe' });
      execSync(`git push ${remoteUrl} main`, { cwd: ROOT_DIR, stdio: 'pipe' });
      console.log(`✓ Đã push tiến trình hàng đợi (commit ${hash}) lên GitHub main!`);
    } else {
      execSync('git pull --rebase --autostash -X ours origin main', { cwd: ROOT_DIR, stdio: 'pipe' });
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'pipe' });
      console.log(`✓ Đã push tiến trình hàng đợi (commit ${hash}) lên origin main!`);
    }
  } catch (err) {
    console.warn('⚠️ Cảnh báo khi git push social-settings.json:', err.message);
  }
}

async function main() {
  console.log('===============================================================');
  console.log('[Backfill Cron] Bắt đầu kích hoạt tiến trình đăng lại bài cũ...');
  console.log('⏰ Thời gian:', new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }));
  console.log('===============================================================');

  // 1. Đọc social-settings.json cục bộ và so sánh với Cloudflare R2 để lấy cursor mới nhất
  let settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  try {
    const r2Res = await fetch(`https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/data/social-settings.json?t=${Date.now()}`);
    if (r2Res.ok) {
      const r2Settings = await r2Res.json();
      const r2Cursor = r2Settings?.facebook_backfill?.cursor || 0;
      const localCursor = settings?.facebook_backfill?.cursor || 0;
      if (r2Cursor > localCursor) {
        console.log(`[Backfill Cron] Đồng bộ cursor mới hơn từ R2: ${r2Cursor} (local: ${localCursor})`);
        settings.facebook_backfill = {
          ...settings.facebook_backfill,
          ...r2Settings.facebook_backfill,
          cursor: r2Cursor,
        };
      }
    }
  } catch {}

  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  const state = settings.facebook_backfill || {};
  const postIds = Array.isArray(state.post_ids) ? state.post_ids : [];
  const postedIds = new Set(Array.isArray(state.posted_ids) ? state.posted_ids : []);

  // Đảm bảo bài đầu tiên đã đăng trước đó (post-1789356202097-0-121o) luôn nằm trong danh sách đã đăng để không bao giờ lặp lại
  postedIds.add('post-1789356202097-0-121o');

  let cursor = typeof state.cursor === 'number' ? state.cursor : 0;
  let skippedCount = typeof state.skipped_count === 'number' ? state.skipped_count : 0;

  let targetPost = null;
  while (cursor < postIds.length) {
    const candidateId = postIds[cursor];
    if (postedIds.has(candidateId)) {
      console.log(`⏭️ Bỏ qua bài đã đăng trước đó ở vị trí ${cursor}: ${candidateId}`);
      cursor++;
      continue;
    }
    const found = posts.find((p) => p && p.id === candidateId && p.isPublished !== false);
    if (found) {
      targetPost = found;
      break;
    }
    cursor++;
    skippedCount++;
  }

  if (!targetPost) {
    console.log('🎉 Hàng đợi đã hoàn thành toàn bộ bài viết!');
    settings.facebook_backfill = {
      ...state,
      status: 'completed',
      cursor,
      posted_ids: Array.from(postedIds),
      skipped_count: skippedCount,
      next_post_at: null,
      lock_id: null,
      lock_until: null,
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2) + '\n', 'utf8');
    return;
  }

  console.log(`📌 Đang đăng bài ở vị trí #${cursor + 1}/${postIds.length}: "${targetPost.title}" (ID: ${targetPost.id})`);

  const fbResult = await publishToFacebook(targetPost, settings);
  console.log(`✓ Đã đăng lên Facebook Fanpage chuẩn 5 phần SEO GEO! Link: ${fbResult.url}`);

  // Cập nhật cursor sang bài tiếp theo và lưu vào posted_ids
  const nextCursor = cursor + 1;
  postedIds.add(targetPost.id);
  const intervalMs = (state.interval_minutes || 240) * 60 * 1000;
  const nextPostAt = new Date(Date.now() + intervalMs).toISOString();

  settings.facebook_template = '{auto_seo}';
  settings.telegram_template = '{auto_seo}';
  settings.facebook_backfill = {
    ...state,
    status: nextCursor >= postIds.length ? 'completed' : 'scheduled',
    cursor: nextCursor,
    posted_ids: Array.from(postedIds),
    skipped_count: skippedCount,
    last_posted_at: new Date().toISOString(),
    last_post_title: targetPost.title,
    last_error: null,
    next_post_at: nextCursor >= postIds.length ? null : nextPostAt,
    last_channels_posted: ['facebook'],
    lock_id: null,
    lock_until: null,
  };

  // 1. Lưu file cục bộ
  const serialized = JSON.stringify(settings, null, 2) + '\n';
  fs.writeFileSync(SETTINGS_FILE, serialized, 'utf8');
  console.log(`✓ Đã cập nhật cursor mới: ${nextCursor}/${postIds.length} vào social-settings.json`);

  // 2. Đồng bộ ngay lên Cloudflare R2
  try {
    await uploadBufferToR2(Buffer.from(serialized, 'utf8'), 'data/social-settings.json', 'application/json');
    console.log('✓ Đã đồng bộ social-settings.json lên Cloudflare R2!');
  } catch (r2Err) {
    console.warn('⚠️ Lỗi đồng bộ R2:', r2Err.message);
  }

  // 2b. Đồng bộ trạng thái hàng đợi & kích hoạt truy vấn PostgreSQL thực tế trên Supabase (giữ DB hoạt động 24/7 chống bị tạm dừng)
  try {
    const sbHeaders = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    };
    // Truy vấn trực tiếp vào các bảng hệ thống PostgreSQL (storage.buckets, auth.users, graphql) để Supabase ghi nhận hoạt động DB kể cả khi bảng public chưa tạo
    await Promise.allSettled([
      fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers: sbHeaders }),
      fetch(`${SUPABASE_URL}/graphql/v1`, {
        method: 'POST',
        headers: sbHeaders,
        body: JSON.stringify({ query: '{ __schema { queryType { name } } }' }),
      }),
      fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: sbHeaders,
        body: JSON.stringify({ email: 'keepalive@betongangiabinh.vn', password: 'KeepAlivePassword2026!@#' }),
      }),
      fetch(`${SUPABASE_URL}/rest/v1/social_settings`, {
        method: 'POST',
        headers: sbHeaders,
        body: JSON.stringify({
          id: 'main',
          data: settings,
          updated_at: new Date().toISOString(),
        }),
      }),
    ]);
    console.log('✓ Đã kích hoạt truy vấn PostgreSQL Keep-Alive & đồng bộ trạng thái lên Supabase Database!');
  } catch {}

  // 3. Commit & Push lên GitHub
  gitPersistSettings(`chore(backfill): advance queue cursor to ${nextCursor}/${postIds.length} (${targetPost.slug})`);

  // 4. Gửi báo cáo Telegram
  const nextTimeStr = new Date(nextPostAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const details = [
    `📌 <b>Tiêu đề:</b> ${targetPost.title}`,
    `🔗 <b>Đường dẫn:</b> <a href="${fbResult.postUrl}">${fbResult.postUrl}</a>`,
    `📱 <b>Kênh thành công:</b> Facebook Fanpage (Chuẩn 5 phần SEO GEO)`,
    `🌐 <b>Link Facebook:</b> <a href="${fbResult.url}">Xem trên Fanpage</a>`,
    `📊 <b>Tiến trình hàng đợi:</b> ${nextCursor}/${postIds.length} bài (${Math.round((nextCursor / postIds.length) * 100)}%)`,
    `⏰ <b>Lượt đăng kế tiếp:</b> ${nextTimeStr}`,
  ];
  await sendTelegramAlert('ĐĂNG LẠI BÀI CŨ THEO LỊCH (MULTI-CHANNEL BACKFILL)', details);
}

main().catch((err) => {
  console.error('❌ [Backfill Cron] Lỗi:', err.message);
  process.exit(1);
});
