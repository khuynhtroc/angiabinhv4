/**
 * BÊ TÔNG AN GIA BÌNH (betongangiabinh.vn) - AI SEO AGENT TELEGRAM BOT
 * Tích hợp:
 *  - Gemini 4 Argon (Antigravity CLI) & Gemini 2.5 Flash (@google/genai)
 *  - Google Analytics 4 (G-6J50BRBSZS) + Google Tag Manager (GTM-MXH8TM7H)
 *  - Google Search Console API + Google Indexing API
 *  - SerpApi Google Vietnam SERP & Market Trends (có bộ nhớ đệm bảo vệ quota 250 lượt/tháng)
 *  - Đồng bộ tự động GitHub (khuynhtroc/angiabinhv4) -> Livesite betongangiabinh.vn
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ADMIN_SETTINGS_FILE = path.join(DATA_DIR, 'admin-settings.json');
const ANALYTICS_EVENTS_FILE = path.join(DATA_DIR, 'analytics-events.json');
const SERP_CACHE_FILE = path.join(DATA_DIR, 'serp-cache.json');

// Load .env.local & .env directly from project root
for (const envName of ['.env.local', '.env']) {
  const p = path.join(ROOT_DIR, envName);
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
      }
    }
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876120939:AAEpkh1zZKQu6bq23eLv5gE_encPuFFhsCc';
const AUTHORIZED_CHAT_ID = Number(process.env.TELEGRAM_CHAT_ID || '8612893214');
const SERPAPI_KEY = process.env.SERPAPI_KEY || 'ba4317f970fb410d31640aacab149af200ff241512c245c3dd506623c2deb08d';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const SITE_URL = 'https://www.betongangiabinh.vn';
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || 'G-6J50BRBSZS';
const GTM_CONTAINER_ID = process.env.GTM_CONTAINER_ID || 'GTM-MXH8TM7H';
const AGY_BIN = 'C:\\Users\\OK\\AppData\\Local\\agy\\bin\\agy.exe';

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    })
  : null;

async function callGeminiModel(prompt, systemInstruction = '', jsonMode = false) {
  if (!ai) throw new Error('Chưa cấu hình GEMINI_API_KEY');
  const models = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemma-4-26b-a4b-it', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const config = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (jsonMode) config.responseMimeType = 'application/json';
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (res.text) return res.text;
    } catch (err) {
      console.warn(`[Gemini] ${model} fallback:`, err.message);
    }
  }
  // Direct REST API fallback
  try {
    const restRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(systemInstruction ? { system_instruction: { parts: [{ text: systemInstruction }] } } : {}),
        }),
      }
    );
    const restData = await restRes.json();
    const text = restData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text;
  } catch (restErr) {
    console.warn('[Gemini REST fallback error]', restErr.message);
  }
  throw new Error('Không thể gọi Gemini API');
}

// Core target keywords for Bê Tông An Gia Bình Ninh Bình
const CORE_KEYWORDS = [
  'bê tông tươi ninh bình',
  'giá bê tông tươi ninh bình',
  'bê tông thương phẩm ninh bình',
  'bơm bê tông ninh bình',
  'trạm trộn bê tông ninh bình',
  'bê tông an gia bình',
];

function readJson(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.warn(`[readJson] Error reading ${filePath}:`, e.message);
  }
  return fallback;
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============================================================================
// 1. TELEGRAM API HELPERS
// ============================================================================
async function tgCall(method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendMessage(chatId, text, replyMarkup = undefined) {
  const MAX_LEN = 3900;
  if (text.length <= MAX_LEN) {
    const res = await tgCall('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    });
    if (!res.ok) {
      // Fallback plain text if HTML tag mismatch
      return tgCall('sendMessage', {
        chat_id: chatId,
        text: text.replace(/<[^>]+>/g, ''),
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      });
    }
    return res;
  }

  const lines = text.split('\n');
  let chunk = '';
  const chunks = [];
  for (const line of lines) {
    if ((chunk + '\n' + line).length > MAX_LEN) {
      chunks.push(chunk);
      chunk = line;
    } else {
      chunk = chunk ? chunk + '\n' + line : line;
    }
  }
  if (chunk) chunks.push(chunk);

  for (let i = 0; i < chunks.length; i++) {
    const isLast = i === chunks.length - 1;
    await sendMessage(chatId, chunks[i], isLast ? replyMarkup : undefined);
  }
}

function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================================
// 2. GOOGLE OAUTH2 SERVICE ACCOUNT HELPER (GA4, GSC, INDEXING API)
// ============================================================================
function getServiceAccount() {
  const settings = readJson(ADMIN_SETTINGS_FILE, {});
  const jsonStr =
    settings?.integrations?.googleServiceAccountJson ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      return typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    } catch {}
  }
  const fallbackFile = 'C:/Users/OK/Downloads/mire-512116-09a33aa13f27.json';
  if (fs.existsSync(fallbackFile)) {
    try {
      return JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
    } catch {}
  }
  return null;
}

async function getGoogleToken(scopes) {
  const sa = getServiceAccount();
  if (!sa?.client_email || !sa?.private_key) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: Array.isArray(scopes) ? scopes.join(' ') : scopes,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(sa.private_key, 'base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${payload}.${signature}`,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return { token: data.access_token, clientEmail: sa.client_email };
}

// ============================================================================
// 3. GOOGLE ANALYTICS 4 (G-6J50BRBSZS) + GTM + WEBSITE TRAFFIC MODULE
// ============================================================================
async function fetchGoogleAnalyticsReport() {
  const config = readJson(CONFIG_FILE, {});
  const posts = readJson(POSTS_FILE, []);
  const localEvents = readJson(ANALYTICS_EVENTS_FILE, []);
  const gaId = config.google_analytics || GA4_MEASUREMENT_ID;
  const gtmId = config.google_tag_manager_id || GTM_CONTAINER_ID;

  // 1. Live verify GA4 & GTM tags on https://www.betongangiabinh.vn
  let liveHtmlHasGa4 = false;
  let liveHtmlHasGtm = false;
  let liveHtmlHasGscMeta = false;
  let gtagEndpointOk = false;
  let liveResponseMs = 0;

  try {
    const t0 = Date.now();
    const res = await fetch(`${SITE_URL}/`, {
      headers: { 'User-Agent': 'AnGiaBinh-SEO-Agent/2.0' },
    });
    liveResponseMs = Date.now() - t0;
    const html = await res.text();
    liveHtmlHasGa4 = html.includes(gaId);
    liveHtmlHasGtm = html.includes(gtmId);
    liveHtmlHasGscMeta = html.includes('google-site-verification');

    const gtagPing = await fetch(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, {
      method: 'HEAD',
    });
    gtagEndpointOk = gtagPing.ok || gtagPing.status === 200;
  } catch {}

  // 2. Check Google Analytics 4 Data API (if Service Account has Viewer access to GA4 property)
  let ga4ApiConnected = false;
  let ga4PropertyId = process.env.GA4_PROPERTY_ID || '';
  let ga4PropertyName = '';
  let ga4Metrics = null;
  let ga4RealtimeUsers = 0;
  let serviceAccountEmail = '';

  try {
    const auth = await getGoogleToken([
      'https://www.googleapis.com/auth/analytics.readonly',
    ]);
    if (auth?.token) {
      serviceAccountEmail = auth.clientEmail;
      if (!ga4PropertyId) {
        const sumRes = await fetch(
          'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          const summaries = sumData.accountSummaries || [];
          for (const acc of summaries) {
            for (const prop of acc.propertySummaries || []) {
              if (
                !ga4PropertyId ||
                (prop.displayName || '').toLowerCase().includes('an gia') ||
                (prop.displayName || '').toLowerCase().includes('betong')
              ) {
                ga4PropertyId = (prop.property || '').replace('properties/', '');
                ga4PropertyName = prop.displayName || prop.property;
              }
            }
          }
        }
      }

      if (ga4PropertyId) {
        // Query 28-day GA4 report
        const repRes = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${ga4PropertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
              metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'engagedSessions' },
                { name: 'screenPageViews' },
                { name: 'eventCount' },
              ],
            }),
          }
        );
        if (repRes.ok) {
          const repData = await repRes.json();
          const row = repData.rows?.[0]?.metricValues || [];
          ga4ApiConnected = true;
          ga4Metrics = {
            activeUsers: Number(row[0]?.value || 0),
            sessions: Number(row[1]?.value || 0),
            engagedSessions: Number(row[2]?.value || 0),
            pageViews: Number(row[3]?.value || 0),
            eventCount: Number(row[4]?.value || 0),
          };
        }

        // Query Realtime report
        const rtRes = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${ga4PropertyId}:runRealtimeReport`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              metrics: [{ name: 'activeUsers' }],
            }),
          }
        );
        if (rtRes.ok) {
          const rtData = await rtRes.json();
          ga4RealtimeUsers = Number(rtData.rows?.[0]?.metricValues?.[0]?.value || 0);
        }
      }
    }
  } catch (e) {
    console.warn('[GA4 API] Warning:', e.message);
  }

  // 3. Aggregate On-Site Article & Category Traffic Metrics
  let totalArticleViews = 0;
  const categoryStats = {};
  for (const p of posts) {
    const v = Number(p.views || 0);
    totalArticleViews += v;
    const cat = p.category || 'Khác';
    if (!categoryStats[cat]) categoryStats[cat] = { count: 0, views: 0 };
    categoryStats[cat].count++;
    categoryStats[cat].views += v;
  }

  const topArticles = [...posts]
    .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
    .slice(0, 6)
    .map((p) => ({
      title: p.title,
      slug: p.slug || p.id,
      views: Number(p.views || 0),
      category: p.category || 'Kỹ Thuật',
    }));

  const topCategories = Object.entries(categoryStats)
    .map(([name, st]) => ({ name, count: st.count, views: st.views }))
    .sort((a, b) => b.views - a.views);

  return {
    gaId,
    gtmId,
    liveHtmlHasGa4,
    liveHtmlHasGtm,
    liveHtmlHasGscMeta,
    gtagEndpointOk,
    liveResponseMs,
    ga4ApiConnected,
    ga4PropertyId,
    ga4PropertyName,
    ga4Metrics,
    ga4RealtimeUsers,
    serviceAccountEmail,
    totalPosts: posts.length,
    totalArticleViews,
    topArticles,
    topCategories,
    localEventsCount: localEvents.length,
  };
}

// ============================================================================
// 4. GOOGLE SEARCH CONSOLE & GOOGLE INDEXING API MODULE
// ============================================================================
async function fetchGscReport() {
  const auth = await getGoogleToken([
    'https://www.googleapis.com/auth/webmasters.readonly',
  ]);
  if (!auth?.token) {
    return { connected: false, reason: 'Chưa có Service Account hợp lệ.' };
  }

  try {
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    const sitesData = await sitesRes.json();
    const entries = sitesData.siteEntry || [];
    const matchedSite = entries.find((s) =>
      (s.siteUrl || '').includes('betongangiabinh.vn')
    );

    if (!matchedSite) {
      return {
        connected: false,
        serviceAccountEmail: auth.clientEmail,
        availableSites: entries.map((e) => e.siteUrl),
        reason: `Service Account (${auth.clientEmail}) chưa được thêm quyền trong Google Search Console của betongangiabinh.vn.`,
      };
    }

    const siteUrl = matchedSite.siteUrl;
    const endDate = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    const qRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 25,
        }),
      }
    );
    const qData = await qRes.json();
    const rows = qData.rows || [];

    let clicks = 0,
      impressions = 0;
    for (const r of rows) {
      clicks += r.clicks || 0;
      impressions += r.impressions || 0;
    }

    return {
      connected: true,
      siteUrl,
      startDate,
      endDate,
      clicks,
      impressions,
      ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00',
      topQueries: rows.slice(0, 10),
    };
  } catch (e) {
    return { connected: false, reason: e.message };
  }
}

async function submitUrlToGoogleIndexing(url) {
  const auth = await getGoogleToken(['https://www.googleapis.com/auth/indexing']);
  if (!auth?.token) {
    return { ok: false, message: 'Không lấy được token Google Indexing.' };
  }
  try {
    const res = await fetch(
      'https://indexing.googleapis.com/v1/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      }
    );
    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      message: res.ok
        ? 'Đã đẩy URL lên Google Indexing API thành công!'
        : data?.error?.message || `HTTP ${res.status}`,
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

// ============================================================================
// 5. SERPAPI MODULE (VỚI BỘ NHỚ ĐỆM BẢO VỆ QUOTA 250 LƯỢT/THÁNG)
// ============================================================================
async function getSerpApiAccountQuota() {
  if (!SERPAPI_KEY) return null;
  try {
    const res = await fetch(`https://serpapi.com/account.json?api_key=${SERPAPI_KEY}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function checkKeywordSerp(keyword, forceRefresh = false) {
  const cleanKw = keyword.trim().toLowerCase();
  const cache = readJson(SERP_CACHE_FILE, {});
  const now = Date.now();
  // Cache valid for 12 hours to save monthly free credits
  if (!forceRefresh && cache[cleanKw] && now - cache[cleanKw].timestamp < 12 * 3600 * 1000) {
    return { ...cache[cleanKw].data, fromCache: true };
  }

  const params = new URLSearchParams({
    engine: 'google',
    q: keyword.trim(),
    location: 'Vietnam',
    google_domain: 'google.com.vn',
    gl: 'vn',
    hl: 'vi',
    num: '20',
    api_key: SERPAPI_KEY,
  });

  const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`SerpApi HTTP ${res.status}`);
  }
  const data = await res.json();
  const organic = data.organic_results || [];

  let ourRank = null;
  let ourUrl = null;
  let ourTitle = null;

  for (const item of organic) {
    const link = item.link || '';
    if (link.includes('betongangiabinh.vn')) {
      ourRank = item.position;
      ourUrl = link;
      ourTitle = item.title;
      break;
    }
  }

  const topCompetitors = organic.slice(0, 5).map((item) => ({
    position: item.position,
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    isUs: (item.link || '').includes('betongangiabinh.vn'),
  }));

  const relatedQuestions = (data.related_questions || [])
    .slice(0, 4)
    .map((q) => q.question)
    .filter(Boolean);

  const relatedSearches = (data.related_searches || [])
    .slice(0, 6)
    .map((s) => s.query)
    .filter(Boolean);

  const result = {
    keyword: keyword.trim(),
    checkedAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    ourRank,
    ourUrl,
    ourTitle,
    topCompetitors,
    relatedQuestions,
    relatedSearches,
  };

  cache[cleanKw] = { timestamp: now, data: result };
  writeJson(SERP_CACHE_FILE, cache);

  return { ...result, fromCache: false };
}

// ============================================================================
// 6. TECHNICAL & ON-PAGE SEO AUDIT MODULE (LIVE + 950 POSTS)
// ============================================================================
async function runFullSeoAudit() {
  const keyPaths = [
    '/',
    '/bang-gia',
    '/gioi-thieu',
    '/du-an',
    '/quy-trinh-san-xuat',
    '/lien-he',
    '/sitemap.xml',
  ];

  const liveChecks = [];
  for (const p of keyPaths) {
    const url = `${SITE_URL}${p === '/' ? '' : p}`;
    const t0 = Date.now();
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AnGiaBinh-SEO-Audit/2.0' },
      });
      const ms = Date.now() - t0;
      const body = await res.text();
      const hasTitle = /<title>[^<]{10,}<\/title>/i.test(body);
      const hasH1 = /<h1[^>]*>/i.test(body);
      const hasSchema = /application\/ld\+json/i.test(body);
      liveChecks.push({
        path: p,
        status: res.status,
        ms,
        ok: res.status === 200,
        hasTitle,
        hasH1,
        hasSchema,
      });
    } catch (e) {
      liveChecks.push({ path: p, status: 0, ms: Date.now() - t0, ok: false, error: e.message });
    }
  }

  const posts = readJson(POSTS_FILE, []);
  const pages = readJson(PAGES_FILE, []);
  const projects = readJson(PROJECTS_FILE, []);

  const thinPosts = [];
  const missingInternalLinks = [];
  const weakMetaPosts = [];

  for (const p of posts) {
    const content = (p.content || '').trim();
    const words = content.split(/\s+/).filter(Boolean).length;
    const desc = (p.seoDescription || p.excerpt || '').trim();
    const hasInternalLink = /\/(bang-gia|gioi-thieu|lien-he|du-an|quy-trinh-san-xuat)/.test(content);

    if (words < 600) {
      thinPosts.push({ id: p.id, slug: p.slug, title: p.title, words, views: p.views || 0 });
    }
    if (!hasInternalLink) {
      missingInternalLinks.push({ id: p.id, slug: p.slug, title: p.title, words, views: p.views || 0 });
    }
    if (!p.seoDescription || desc.length < 85 || desc.length > 175) {
      weakMetaPosts.push({ id: p.id, slug: p.slug, title: p.title, descLen: desc.length });
    }
  }

  // Sort priority candidates by highest views first so optimizing them yields maximum SEO impact
  thinPosts.sort((a, b) => b.views - a.views);
  missingInternalLinks.sort((a, b) => b.views - a.views);

  return {
    liveChecks,
    totals: {
      posts: posts.length,
      pages: pages.length,
      projects: projects.length,
    },
    issues: {
      thinCount: thinPosts.length,
      missingLinksCount: missingInternalLinks.length,
      weakMetaCount: weakMetaPosts.length,
      priorityCandidates: [
        ...missingInternalLinks.slice(0, 3),
        ...thinPosts.slice(0, 3),
      ].slice(0, 5),
    },
  };
}

// ============================================================================
// 7. GITHUB AUTO-COMMIT & LIVESITE SYNC HELPER
// ============================================================================
async function syncPostsToGitHub(commitMessage) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'khuynhtroc';
  const repo = process.env.GITHUB_REPO || 'angiabinhv4';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) return { ok: false, message: 'Chưa có GITHUB_TOKEN' };

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AnGiaBinh-SEO-TelegramBot',
  };

  try {
    const refRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      { headers }
    );
    if (!refRes.ok) throw new Error(`Get ref HTTP ${refRes.status}`);
    const refData = await refRes.json();
    const currentCommitSha = refData.object.sha;

    const commitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${currentCommitSha}`,
      { headers }
    );
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    const postsContent = fs.readFileSync(POSTS_FILE, 'utf8');
    const blobRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: postsContent, encoding: 'utf-8' }),
      }
    );
    const blobData = await blobRes.json();

    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: [
            {
              path: 'public/data/posts.json',
              mode: '100644',
              type: 'blob',
              sha: blobData.sha,
            },
          ],
        }),
      }
    );
    const treeData = await treeRes.json();

    const newCommitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: commitMessage,
          tree: treeData.sha,
          parents: [currentCommitSha],
          author: {
            name: 'BeTongAnGiaBinh SEO Bot',
            email: 'admin@betongangiabinh.vn',
            date: new Date().toISOString(),
          },
        }),
      }
    );
    const newCommitData = await newCommitRes.json();

    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: newCommitData.sha, force: false }),
      }
    );

    return {
      ok: true,
      commitHash: (newCommitData.sha || '').slice(0, 7),
    };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

// ============================================================================
// 8. FAST AI ON-PAGE OPTIMIZATION & ARTICLE WRITER
// ============================================================================
async function optimizeSinglePostBySlug(slugOrId) {
  const posts = readJson(POSTS_FILE, []);
  const cleanTarget = slugOrId.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  const idx = posts.findIndex(
    (p) =>
      p.slug === cleanTarget ||
      p.id === cleanTarget ||
      (p.slug && p.slug.includes(cleanTarget))
  );

  if (idx === -1) {
    return { ok: false, message: `Không tìm thấy bài viết với slug/id: ${slugOrId}` };
  }

  const post = posts[idx];
  const oldWords = (post.content || '').trim().split(/\s+/).filter(Boolean).length;

  if (!ai) {
    return { ok: false, message: 'Chưa cấu hình GEMINI_API_KEY' };
  }

  const prompt = `Bạn là Kỹ Sư Trưởng kiêm Chuyên Gia SEO Cấp Cao của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93 | Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình | Trạm 2: Xã Kim Sơn, Ninh Bình).

Hãy tối ưu hóa toàn diện bài viết sau để đạt Top 1-3 Google Việt Nam:
- Tiêu đề hiện tại: ${post.title}
- Chuyên mục: ${post.category || 'Kỹ Thuật Thi Công'}
- Nội dung hiện tại:
${(post.content || '').slice(0, 6000)}

YÊU CẦU BẮT BUỘC:
1. Tối ưu Title chuẩn SEO (chứa từ khóa chính + Bê Tông An Gia Bình / Ninh Bình, 55-68 ký tự).
2. Tối ưu Meta Description / Excerpt (140-160 ký tự, có kêu gọi gọi Hotline 0988 2662 93).
3. Mở rộng và nâng cấp nội dung chi tiết, chuyên sâu chuẩn kỹ thuật TCVN 9340:2012 (tối thiểu 1.100 - 1.600 từ), có bảng thông số Markdown, các thẻ H2/H3 rõ ràng, và mục Câu Hỏi Thường Gặp (FAQ) ở cuối bài.
4. Chèn tự nhiên tối thiểu 4 liên kết nội bộ Markdown:
   - [báo giá bê tông tươi Ninh Bình](/bang-gia)
   - [Trạm trộn Bê Tông An Gia Bình](/gioi-thieu)
   - [quy trình kiểm định chất lượng chuẩn TCVN](/quy-trinh-san-xuat)
   - [liên hệ kỹ sư Bê Tông An Gia Bình (0988 2662 93)](/lien-he)

TRẢ VỀ DUY NHẤT JSON HỢP LỆ:
{
  "seoTitle": "...",
  "seoDescription": "...",
  "content": "Toàn bộ nội dung Markdown đã nâng cấp...",
  "focusKeywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"]
}`;

  const rawText = await callGeminiModel(prompt, '', true);
  const parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim());

  const newContent = parsed.content || post.content;
  const newWords = newContent.trim().split(/\s+/).filter(Boolean).length;

  posts[idx] = {
    ...post,
    title: parsed.seoTitle || post.title,
    seoTitle: parsed.seoTitle || post.title,
    excerpt: parsed.seoDescription || post.excerpt,
    seoDescription: parsed.seoDescription || post.seoDescription,
    content: newContent,
    focusKeywords: Array.isArray(parsed.focusKeywords) ? parsed.focusKeywords : post.focusKeywords,
    readTime: `${Math.max(4, Math.ceil(newWords / 220))} phút đọc`,
    updatedAt: new Date().toISOString(),
  };

  writeJson(POSTS_FILE, posts);

  const canonicalUrl = `${SITE_URL}/${(posts[idx].slug || posts[idx].id).replace(/\.html$/, '')}.html`;
  const [gitSync, indexRes] = await Promise.all([
    syncPostsToGitHub(`seo(bot): optimize article ${posts[idx].slug}`),
    submitUrlToGoogleIndexing(canonicalUrl),
  ]);

  return {
    ok: true,
    slug: posts[idx].slug,
    title: posts[idx].title,
    seoDescription: posts[idx].seoDescription,
    oldWords,
    newWords,
    canonicalUrl,
    gitSync,
    indexRes,
  };
}

async function writeNewSeoPost(topicOrKeyword) {
  if (!ai) return { ok: false, message: 'Chưa cấu hình GEMINI_API_KEY' };

  const prompt = `Bạn là Kỹ Sư Trưởng kiêm Chuyên Gia SEO của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93 | Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình | Trạm 2: Xã Kim Sơn, Ninh Bình).

Hãy viết một bài viết chuyên sâu chuẩn SEO Google Việt Nam (tối thiểu 1.800 - 2.500 từ) cho chủ đề / từ khóa:
"${topicOrKeyword}"

YÊU CẦU:
1. Có đầy đủ H2, H3, bảng thông số mác bê tông / độ sụt / đơn giá tham khảo bằng Markdown.
2. Nêu bật năng lực 2 trạm trộn Khánh Phú & Kim Sơn, hệ thống xe bồn, bơm cần 37m-56m, bơm tĩnh 150m, kiểm định nén mẫu LAS-XD chuẩn TCVN 9340:2012.
3. Chèn tự nhiên các liên kết nội bộ:
   - [bảng báo giá bê tông tươi Ninh Bình](/bang-gia)
   - [Trạm trộn Bê Tông An Gia Bình](/gioi-thieu)
   - [quy trình kiểm định chất lượng TCVN](/quy-trinh-san-xuat)
   - [các dự án tiêu biểu](/du-an)
   - [liên hệ đặt lịch đổ bê tông 0988 2662 93](/lien-he)
4. Có phần FAQ (5 câu hỏi thực tế của chủ nhà / nhà thầu tại Ninh Bình).

TRẢ VỀ DUY NHẤT JSON HỢP LỆ:
{
  "title": "Tiêu đề chuẩn SEO hấp dẫn",
  "slug": "slug-khong-dau-chuan-seo",
  "category": "Kỹ Thuật Thi Công",
  "seoDescription": "Đoạn mô tả meta 145-160 ký tự chứa từ khóa và Hotline 0988 2662 93",
  "focusKeywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"],
  "tags": ["Bê tông Ninh Bình", "Bê tông An Gia Bình", "Kỹ thuật bê tông"],
  "content": "Toàn bộ nội dung Markdown..."
}`;

  const rawText = await callGeminiModel(prompt, '', true);
  const parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim());

  const posts = readJson(POSTS_FILE, []);
  const slug =
    (parsed.slug || '')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `be-tong-an-gia-binh-${Date.now()}`;

  const words = (parsed.content || '').trim().split(/\s+/).filter(Boolean).length;
  const newPost = {
    id: `post-${Date.now()}`,
    title: parsed.title,
    slug,
    permalink: `/${slug}.html`,
    category: parsed.category || 'Kỹ Thuật Thi Công',
    excerpt: parsed.seoDescription,
    seoTitle: parsed.title,
    seoDescription: parsed.seoDescription,
    content: parsed.content,
    date: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
    coverImage:
      'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg',
    tags: parsed.tags || ['Bê tông Ninh Bình', 'Bê tông An Gia Bình'],
    focusKeywords: parsed.focusKeywords || [topicOrKeyword],
    readTime: `${Math.max(5, Math.ceil(words / 220))} phút đọc`,
    views: 18,
    isPublished: true,
  };

  posts.unshift(newPost);
  writeJson(POSTS_FILE, posts);

  const canonicalUrl = `${SITE_URL}/${slug}.html`;
  const [gitSync, indexRes] = await Promise.all([
    syncPostsToGitHub(`feat(seo-bot): publish new article "${slug}"`),
    submitUrlToGoogleIndexing(canonicalUrl),
  ]);

  return {
    ok: true,
    post: newPost,
    words,
    canonicalUrl,
    gitSync,
    indexRes,
  };
}

// ============================================================================
// 9. COMPREHENSIVE DAILY SEO + GA4 + SERPAPI REPORT BUILDER
// ============================================================================
async function buildAndSendDailyReport(chatId) {
  await sendMessage(
    chatId,
    '⏳ <b>BeTongAnGiaBinh SEO Agent (Gemini 4 Argon)</b> đang tổng hợp dữ liệu:\n• Google Analytics 4 (<code>G-6J50BRBSZS</code>) & GTM (<code>GTM-MXH8TM7H</code>)\n• Google Search Console & Indexing API\n• SerpApi Google Việt Nam (<code>betongangiabinh.vn</code>)\n• Audit kỹ thuật 950 bài viết & trang đích...'
  );

  const [gaReport, gscReport, auditReport, serpAccount, mainSerp] = await Promise.all([
    fetchGoogleAnalyticsReport(),
    fetchGscReport(),
    runFullSeoAudit(),
    getSerpApiAccountQuota(),
    checkKeywordSerp('bê tông tươi ninh bình', false).catch(() => null),
  ]);

  const nowStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const lines = [];

  lines.push(`🏗️ <b>BÁO CÁO SEO & GOOGLE ANALYTICS HÀNG NGÀY</b>`);
  lines.push(`🌐 Website: <b>https://www.betongangiabinh.vn</b>`);
  lines.push(`🕒 Thời gian: <code>${nowStr}</code>`);
  lines.push(`🤖 AI Engine: <b>Gemini 4 Argon + Antigravity</b>`);
  lines.push(``);

  // 1. GOOGLE ANALYTICS 4 & TRAFFIC SECTION
  lines.push(`📊 <b>1. GOOGLE ANALYTICS 4 (${escHtml(gaReport.gaId)}) & TRAFFIC</b>`);
  lines.push(
    `• Trạng thái thẻ GA4 Live: ${
      gaReport.liveHtmlHasGa4 && gaReport.gtagEndpointOk
        ? '✅ Đang phát tín hiệu chuẩn (HTTP 200)'
        : '⚠️ Cần kiểm tra'
    }`
  );
  lines.push(
    `• Google Tag Manager (<code>${escHtml(gaReport.gtmId)}</code>): ${
      gaReport.liveHtmlHasGtm ? '✅ Hoạt động' : '⚠️ Chưa thấy'
    }`
  );
  if (gaReport.ga4ApiConnected && gaReport.ga4Metrics) {
    lines.push(
      `• GA4 Data API (28 ngày): <b>${gaReport.ga4Metrics.activeUsers}</b> Users | <b>${gaReport.ga4Metrics.sessions}</b> Sessions | <b>${gaReport.ga4Metrics.pageViews}</b> Pageviews (Realtime: <b>${gaReport.ga4RealtimeUsers}</b>)`
    );
  } else {
    lines.push(
      `• Tổng lượt xem toàn trang (950 bài viết): <b>${gaReport.totalArticleViews.toLocaleString('vi-VN')} lượt xem</b>`
    );
    lines.push(`• Top bài viết thu hút khách hàng cao nhất:`);
    for (const art of gaReport.topArticles.slice(0, 4)) {
      lines.push(
        `   + <i>${escHtml(art.title.slice(0, 58))}...</i> (<b>${art.views.toLocaleString('vi-VN')}</b> views)`
      );
    }
  }
  lines.push(``);

  // 2. SERPAPI LIVE KEYWORD RANKING SECTION
  lines.push(`🔎 <b>2. THỨ HẠNG TỪ KHÓA GOOGLE VN (SERPAPI LIVE)</b>`);
  if (serpAccount) {
    lines.push(
      `• Quota SerpApi: Còn <b>${serpAccount.total_searches_left}/${serpAccount.searches_per_month}</b> lượt truy vấn tháng này (Có Cache 12h bảo vệ quota)`
    );
  }
  if (mainSerp) {
    lines.push(`• Từ khóa trọng tâm: <b>"${escHtml(mainSerp.keyword)}"</b>`);
    if (mainSerp.ourRank) {
      lines.push(
        `  🏆 Thứ hạng hiện tại: <b>Top ${mainSerp.ourRank} Google Việt Nam</b> (${escHtml(mainSerp.ourUrl)})`
      );
    } else {
      lines.push(
        `  ⚠️ Hiện chưa lọt Top 20 tự nhiên — Cần đẩy mạnh Internal Link & Backlink/Indexing cho trang chủ và bài trụ cột!`
      );
    }
    if (mainSerp.topCompetitors?.length) {
      lines.push(`• Top đối thủ đang đứng đầu SERP Ninh Bình:`);
      for (const comp of mainSerp.topCompetitors.slice(0, 3)) {
        let host = comp.link;
        try {
          host = new URL(comp.link).hostname;
        } catch {}
        lines.push(`   #${comp.position}: <code>${escHtml(host)}</code> — ${escHtml((comp.title || '').slice(0, 48))}`);
      }
    }
  }
  lines.push(``);

  // 3. GOOGLE SEARCH CONSOLE & INDEXING
  lines.push(`📈 <b>3. GOOGLE SEARCH CONSOLE & INDEXING API</b>`);
  if (gscReport.connected) {
    lines.push(
      `• GSC (28 ngày): <b>${gscReport.clicks}</b> Clicks | <b>${gscReport.impressions}</b> Impressions | CTR: <b>${gscReport.ctr}%</b>`
    );
  } else {
    lines.push(
      `• Thẻ xác minh GSC HTML: ${gaReport.liveHtmlHasGscMeta ? '✅ Đã gắn trên trang chủ' : '⚠️ Thiếu'}`
    );
    lines.push(
      `• Service Account: <code>${escHtml(gaReport.serviceAccountEmail || 'indexing-bot@mire-512116.iam.gserviceaccount.com')}</code> (Đã cấu hình sẵn sàng cho Google Indexing API & GSC)`
    );
  }
  lines.push(``);

  // 4. TECHNICAL & ON-PAGE AUDIT
  const okPages = auditReport.liveChecks.filter((c) => c.ok).length;
  lines.push(`🛠️ <b>4. KIỂM ĐỊNH KỸ THUẬT & ON-PAGE (${auditReport.totals.posts} BÀI VIẾT)</b>`);
  lines.push(
    `• Trang đích quan trọng: <b>${okPages}/${auditReport.liveChecks.length}</b> trang phản hồi HTTP 200 (${gaReport.liveResponseMs}ms)`
  );
  lines.push(
    `• Bài viết nội dung mỏng (&lt;600 từ): <b>${auditReport.issues.thinCount} bài</b>`
  );
  lines.push(
    `• Bài viết thiếu Internal Link về <code>/bang-gia</code>, <code>/lien-he</code>: <b>${auditReport.issues.missingLinksCount} bài</b>`
  );
  lines.push(
    `• Bài viết cần chuẩn hóa Meta Description: <b>${auditReport.issues.weakMetaCount} bài</b>`
  );
  lines.push(``);

  // 5. ACTIONABLE RECOMMENDATIONS
  lines.push(`🎯 <b>5. ĐỀ XUẤT HÀNH ĐỘNG HÔM NAY (1-CLICK THỰC THI)</b>`);
  const topCandidates = auditReport.issues.priorityCandidates.slice(0, 3);
  for (let i = 0; i < topCandidates.length; i++) {
    const c = topCandidates[i];
    lines.push(
      `${i + 1}. <b>${escHtml(c.title.slice(0, 58))}</b> (<code>${c.words} từ</code> | <code>${c.views} views</code>)`
    );
  }

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '⚡ Tối ưu ngay Top 3 bài thiếu Link / Nội dung mỏng',
          callback_data: 'opt_batch_top3',
        },
      ],
      [
        {
          text: '📊 Chi tiết Google Analytics (GA4)',
          callback_data: 'cmd_ga',
        },
        {
          text: '🔎 Check Top Google (SerpApi)',
          callback_data: 'serp_menu',
        },
      ],
      [
        {
          text: '✍️ Viết bài SEO Báo Giá Bê Tông 2026',
          callback_data: 'write_banggia',
        },
        {
          text: '🛠️ Audit Kỹ Thuật',
          callback_data: 'cmd_audit',
        },
      ],
    ],
  };

  await sendMessage(chatId, lines.join('\n'), inlineKeyboard);
}

// ============================================================================
// 10. COMMAND HANDLERS (/ga, /serp, /audit, /optimize, /write, /agy)
// ============================================================================
async function handleGaCommand(chatId) {
  await sendMessage(chatId, '📊 Đang truy xuất dữ liệu <b>Google Analytics 4 (G-6J50BRBSZS)</b> & phân tích lưu lượng <code>betongangiabinh.vn</code>...');
  const ga = await fetchGoogleAnalyticsReport();

  const lines = [
    `📈 <b>BÁO CÁO CHI TIẾT GOOGLE ANALYTICS 4 & LƯU LƯỢNG</b>`,
    `🌐 Website: <b>https://www.betongangiabinh.vn</b>`,
    `🏷️ Mã đo lường GA4: <code>${escHtml(ga.gaId)}</code>`,
    `🏷️ Mã Google Tag Manager: <code>${escHtml(ga.gtmId)}</code>`,
    ``,
    `✅ <b>Trạng thái Tín hiệu Đo lường Trực tiếp (Live Tag):</b>`,
    `• Script <code>gtag.js</code> trên trang chủ: ${ga.liveHtmlHasGa4 ? '🟢 Đang hoạt động' : '🔴 Chưa tìm thấy'}`,
    `• Kết nối máy chủ Google Tag Manager: ${ga.gtagEndpointOk ? '🟢 HTTP 200 OK' : '🟡 Chờ phản hồi'}`,
    `• Sự kiện chuyển đổi (Conversion Events): Tự động đo lường <code>contact_call</code> (Click gọi <code>0988 2662 93</code>) & <code>contact_zalo</code>`,
    ``,
  ];

  if (ga.ga4ApiConnected && ga.ga4Metrics) {
    lines.push(`📊 <b>Số liệu GA4 Data API (28 ngày qua - Property ${escHtml(ga.ga4PropertyId)}):</b>`);
    lines.push(`• Người dùng hoạt động (Active Users): <b>${ga.ga4Metrics.activeUsers.toLocaleString('vi-VN')}</b>`);
    lines.push(`• Phiên truy cập (Sessions): <b>${ga.ga4Metrics.sessions.toLocaleString('vi-VN')}</b>`);
    lines.push(`• Phiên tương tác (Engaged Sessions): <b>${ga.ga4Metrics.engagedSessions.toLocaleString('vi-VN')}</b>`);
    lines.push(`• Lượt xem trang (Screen Pageviews): <b>${ga.ga4Metrics.pageViews.toLocaleString('vi-VN')}</b>`);
    lines.push(`• Tổng sự kiện (Events): <b>${ga.ga4Metrics.eventCount.toLocaleString('vi-VN')}</b>`);
    lines.push(`• Người dùng Realtime (30 phút qua): <b>${ga.ga4RealtimeUsers}</b>`);
  } else {
    lines.push(`📊 <b>Phân tích Lưu lượng theo Chuyên mục (${ga.totalPosts} bài viết):</b>`);
    lines.push(`• Tổng lượt xem tích lũy: <b>${ga.totalArticleViews.toLocaleString('vi-VN')} lượt xem</b>`);
    for (const c of ga.topCategories.slice(0, 6)) {
      lines.push(`  • <b>${escHtml(c.name)}</b>: ${c.count} bài — <b>${c.views.toLocaleString('vi-VN')}</b> lượt xem`);
    }
    lines.push(``);
    lines.push(`🔥 <b>Top 6 Bài Viết Thu Hút Nhiều Khách Hàng Nhất:</b>`);
    for (let i = 0; i < ga.topArticles.length; i++) {
      const a = ga.topArticles[i];
      lines.push(`${i + 1}. <b>${escHtml(a.title)}</b>\n   👁️ <b>${a.views.toLocaleString('vi-VN')}</b> views — <code>/${escHtml(a.slug)}.html</code>`);
    }
    lines.push(``);
    lines.push(
      `💡 <i>Mẹo mở khóa biểu đồ GA4 Data API trực tiếp:</i> Nếu bạn thêm email Service Account <code>${escHtml(
        ga.serviceAccountEmail || 'indexing-bot@mire-512116.iam.gserviceaccount.com'
      )}</code> làm <b>Viewer (Người xem)</b> trong mục <b>Admin &gt; Property Access Management</b> của Google Analytics (<code>G-6J50BRBSZS</code>), bot sẽ tự động kéo thêm biểu đồ Realtime &amp; Conversion từ GA4 API!`
    );
  }

  await sendMessage(chatId, lines.join('\n'));
}

async function handleSerpCommand(chatId, keyword, forceRefresh = false) {
  const kw = (keyword || 'bê tông tươi ninh bình').trim();
  await sendMessage(
    chatId,
    `🔎 Đang kiểm tra thứ hạng Google Việt Nam qua <b>SerpApi</b> cho từ khóa: <b>"${escHtml(kw)}"</b>...`
  );

  try {
    const [serp, account] = await Promise.all([
      checkKeywordSerp(kw, forceRefresh),
      getSerpApiAccountQuota(),
    ]);

    const lines = [
      `🔎 <b>KẾT QUẢ SERPAPI GOOGLE VIỆT NAM</b>`,
      `🔑 Từ khóa: <b>"${escHtml(serp.keyword)}"</b>`,
      `🕒 Cập nhật: <code>${escHtml(serp.checkedAt)}</code> ${serp.fromCache ? '(Bộ nhớ đệm 12h - Tốn 0 credit)' : '(Live Query - 1 credit)'}`,
    ];
    if (account) {
      lines.push(
        `💳 Quota SerpApi còn lại: <b>${account.total_searches_left}/${account.searches_per_month}</b> lượt/tháng`
      );
    }
    lines.push(``);

    if (serp.ourRank) {
      lines.push(
        `🏆 <b>Vị trí của betongangiabinh.vn:</b> <b>TOP ${serp.ourRank}</b>\n🔗 URL: ${escHtml(serp.ourUrl)}`
      );
    } else {
      lines.push(
        `⚠️ <b>betongangiabinh.vn</b> hiện chưa nằm trong Top 20 kết quả tự nhiên cho từ khóa này.`
      );
    }
    lines.push(``);

    lines.push(`🥇 <b>Top 5 Đối Thủ Đang Đứng Đầu Trên Google.com.vn:</b>`);
    for (const c of serp.topCompetitors) {
      lines.push(
        `<b>#${c.position}</b> ${c.isUs ? '⭐ [CHÚNG TA]' : ''} <b>${escHtml(c.title)}</b>\n   🔗 <code>${escHtml(c.link)}</code>`
      );
    }

    if (serp.relatedQuestions?.length) {
      lines.push(``);
      lines.push(`❓ <b>Câu hỏi khách hàng hay tìm (People Also Ask):</b>`);
      for (const q of serp.relatedQuestions) {
        lines.push(`• ${escHtml(q)}`);
      }
    }

    if (serp.relatedSearches?.length) {
      lines.push(``);
      lines.push(`📈 <b>Từ khóa liên quan (Related Searches):</b>`);
      lines.push(`<code>${escHtml(serp.relatedSearches.join(' | '))}</code>`);
    }

    const kb = {
      inline_keyboard: [
        [
          {
            text: `✍️ Viết bài chuẩn SEO đánh chiếm "${kw.slice(0, 22)}"`,
            callback_data: `write_kw:${kw.slice(0, 45)}`,
          },
        ],
        [
          { text: '🔎 giá bê tông tươi ninh bình', callback_data: 'serp_kw:giá bê tông tươi ninh bình' },
          { text: '🔎 bơm bê tông ninh bình', callback_data: 'serp_kw:bơm bê tông ninh bình' },
        ],
      ],
    };

    await sendMessage(chatId, lines.join('\n'), kb);
  } catch (e) {
    await sendMessage(chatId, `❌ Lỗi truy vấn SerpApi: ${escHtml(e.message)}`);
  }
}

async function handleBatchOptimizeTop3(chatId) {
  const audit = await runFullSeoAudit();
  const candidates = audit.issues.priorityCandidates.slice(0, 3);
  if (candidates.length === 0) {
    await sendMessage(chatId, '✅ Tất cả bài viết đều đã đạt chuẩn chiều sâu và có đầy đủ Internal Links!');
    return;
  }

  await sendMessage(
    chatId,
    `🚀 <b>Bắt đầu tối ưu hóa tự động Top ${candidates.length} bài viết ưu tiên</b> bằng Gemini AI + đồng bộ GitHub & Google Indexing API...\n` +
      candidates.map((c, i) => `${i + 1}. <code>${escHtml(c.slug)}</code>`).join('\n')
  );

  const results = [];
  for (const c of candidates) {
    try {
      const r = await optimizeSinglePostBySlug(c.slug);
      results.push(r);
    } catch (e) {
      results.push({ ok: false, slug: c.slug, message: e.message });
    }
  }

  const lines = [`✅ <b>HOÀN TẤT TỐI ƯU HÓA LÔ ${results.length} BÀI VIẾT!</b>\n`];
  for (const r of results) {
    if (r.ok) {
      lines.push(
        `🟢 <b>${escHtml(r.title)}</b>\n` +
          `   • Slug: <code>${escHtml(r.slug)}</code>\n` +
          `   • Độ dài: <b>${r.oldWords} từ ➔ ${r.newWords} từ</b> (+FAQ +Internal Links)\n` +
          `   • GitHub Sync: ${r.gitSync?.ok ? `✅ Đã đẩy commit <code>${r.gitSync.commitHash}</code>` : `⚠️ ${escHtml(r.gitSync?.message || '')}`}\n` +
          `   • Google Indexing: ${r.indexRes?.ok ? '✅ Đã gửi URL_UPDATED' : `ℹ️ ${escHtml(r.indexRes?.message || '')}`}\n`
      );
    } else {
      lines.push(`🔴 <code>${escHtml(r.slug)}</code>: ${escHtml(r.message)}\n`);
    }
  }

  await sendMessage(chatId, lines.join('\n'));
}

async function runAntigravityCli(chatId, instruction) {
  await sendMessage(
    chatId,
    `🤖 <b>Đang giao nhiệm vụ cho Antigravity (Model: Gemini 4 Argon)</b> trên codebase <code>f:\\Antigravity\\angiabinhv4</code>:\n<i>"${escHtml(instruction)}"</i>\n⏳ Vui lòng đợi khoảng 30–90 giây...`
  );

  return new Promise((resolve) => {
    const child = spawn(
      AGY_BIN,
      [
        '--model',
        'gemini-4-argon-high',
        '--print',
        `Bạn đang làm việc trên dự án Bê Tông An Gia Bình (betongangiabinh.vn) tại f:\\Antigravity\\angiabinhv4. Hãy thực hiện yêu cầu SEO sau và báo cáo ngắn gọn bằng tiếng Việt: ${instruction}`,
      ],
      { cwd: ROOT_DIR, windowsHide: true }
    );

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      child.kill();
    }, 150000);

    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (err += d.toString()));

    child.on('close', async (code) => {
      clearTimeout(timer);
      const output = (out || err || 'Đã hoàn tất xử lý.').trim();
      await sendMessage(
        chatId,
        `✅ <b>Phản hồi từ Antigravity (Gemini 4 Argon):</b>\n\n${escHtml(output.slice(0, 3500))}`
      );
      resolve();
    });
  });
}

// ============================================================================
// 11. BOT POLLING LOOP & INTERACTIVE COMMAND ROUTER
// ============================================================================
let lastUpdateId = 0;

async function processUpdate(update) {
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message?.chat?.id;
    const data = cb.data || '';

    await tgCall('answerCallbackQuery', { callback_query_id: cb.id });
    if (chatId !== AUTHORIZED_CHAT_ID) return;

    if (data === 'opt_batch_top3') {
      await handleBatchOptimizeTop3(chatId);
    } else if (data === 'cmd_ga') {
      await handleGaCommand(chatId);
    } else if (data === 'cmd_audit') {
      const audit = await runFullSeoAudit();
      const lines = [
        `🛠️ <b>BÁO CÁO AUDIT KỸ THUẬT & ON-PAGE (betongangiabinh.vn)</b>`,
        ``,
        `🌐 <b>Kiểm tra HTTP Live các trang đích:</b>`,
        ...audit.liveChecks.map(
          (c) =>
            `• <code>${c.path}</code>: ${c.ok ? '✅ HTTP 200' : `❌ HTTP ${c.status}`} (${c.ms}ms) | Title: ${c.hasTitle ? '✅' : '⚠️'} | H1: ${c.hasH1 ? '✅' : '⚠️'} | Schema: ${c.hasSchema ? '✅' : '⚠️'}`
        ),
        ``,
        `📚 <b>Kiểm toán ${audit.totals.posts} bài viết trong hệ thống:</b>`,
        `• Bài viết mỏng (&lt;600 từ): <b>${audit.issues.thinCount}</b>`,
        `• Bài viết thiếu Internal Links: <b>${audit.issues.missingLinksCount}</b>`,
        `• Bài viết cần tối ưu Meta Description: <b>${audit.issues.weakMetaCount}</b>`,
        ``,
        `💡 Gõ <code>/optimize &lt;slug&gt;</code> hoặc bấm nút bên dưới để AI nâng cấp tự động:`,
      ];
      await sendMessage(chatId, lines.join('\n'), {
        inline_keyboard: [
          [{ text: '⚡ Tối ưu ngay Top 3 bài ưu tiên', callback_data: 'opt_batch_top3' }],
        ],
      });
    } else if (data === 'serp_menu') {
      await handleSerpCommand(chatId, 'bê tông tươi ninh bình', false);
    } else if (data.startsWith('serp_kw:')) {
      const kw = data.slice('serp_kw:'.length);
      await handleSerpCommand(chatId, kw, false);
    } else if (data === 'write_banggia') {
      await sendMessage(
        chatId,
        '✍️ Đang viết bài chuẩn SEO mới: <b>"Bảng Báo Giá Bê Tông Tươi Ninh Bình Mới Nhất & Kinh Nghiệm Chọn Mác Chuẩn TCVN"</b>...'
      );
      const res = await writeNewSeoPost(
        'Bảng báo giá bê tông tươi Ninh Bình mới nhất 2026 và kinh nghiệm chọn mác bê tông thương phẩm chuẩn TCVN'
      );
      if (res.ok) {
        await sendMessage(
          chatId,
          `🎉 <b>ĐÃ XUẤT BẢN BÀI VIẾT SEO MỚI THÀNH CÔNG!</b>\n\n` +
            `📌 Tiêu đề: <b>${escHtml(res.post.title)}</b>\n` +
            `🔗 URL: ${escHtml(res.canonicalUrl)}\n` +
            `📝 Số từ: <b>${res.words} từ</b>\n` +
            `🔄 GitHub Auto-Deploy: ${res.gitSync?.ok ? `✅ Đã đẩy commit <code>${res.gitSync.commitHash}</code>` : '⚠️ Local saved'}\n` +
            `📡 Google Indexing API: ${res.indexRes?.ok ? '✅ Đã gửi yêu cầu Index' : escHtml(res.indexRes?.message || '')}`
        );
      }
    } else if (data.startsWith('write_kw:')) {
      const kw = data.slice('write_kw:'.length);
      await sendMessage(chatId, `✍️ Đang viết bài SEO chuyên sâu cho từ khóa: <b>"${escHtml(kw)}"</b>...`);
      const res = await writeNewSeoPost(kw);
      if (res.ok) {
        await sendMessage(
          chatId,
          `🎉 <b>ĐÃ XUẤT BẢN BÀI VIẾT MỚI!</b>\n📌 <b>${escHtml(res.post.title)}</b>\n🔗 ${escHtml(res.canonicalUrl)}\n📝 Độ dài: <b>${res.words} từ</b>`
        );
      }
    }
    return;
  }

  const msg = update.message;
  if (!msg || !msg.text) return;
  const chatId = msg.chat.id;
  if (chatId !== AUTHORIZED_CHAT_ID) {
    await sendMessage(chatId, '⛔ Bot này chỉ phục vụ nội bộ cho quản trị viên Bê Tông An Gia Bình.');
    return;
  }

  const text = msg.text.trim();

  if (text === '/start' || text === '/help') {
    const welcome = [
      `👋 Xin chào Quản trị viên! Tôi là <b>BeTongAnGiaBinh SEO Agent</b> (<code>@angiabinh_seo_99_bot</code>) — Nhân viên SEO AI chuyên trách cho <b>https://www.betongangiabinh.vn</b>.`,
      ``,
      `🧭 <b>CÁC LỆNH ĐIỀU KHIỂN CHÍNH:</b>`,
      `• /report — Báo cáo tổng hợp SEO + Google Analytics 4 + SerpApi hàng ngày`,
      `• /ga — Báo cáo chi tiết Google Analytics 4 (<code>G-6J50BRBSZS</code>), GTM & Top bài viết nhiều traffic nhất`,
      `• /serp <code>&lt;từ khóa&gt;</code> — Kiểm tra thứ hạng từ khóa trực tiếp trên Google Việt Nam qua SerpApi (VD: <code>/serp giá bê tông tươi ninh bình</code>)`,
      `• /audit — Kiểm tra kỹ thuật On-Page toàn bộ 950 bài viết & các trang đích`,
      `• /optimize <code>&lt;slug&gt;</code> — Tối ưu sâu bài viết + chèn Internal Link + tự động đẩy lên GitHub & Google Indexing API`,
      `• /write <code>&lt;chủ đề / từ khóa&gt;</code> — Viết bài SEO mới chuẩn TCVN cho Bê Tông An Gia Bình và tự động xuất bản`,
      `• /agy <code>&lt;lệnh&gt;</code> — Ra lệnh trực tiếp cho <b>Antigravity (Gemini 4 Argon)</b> chỉnh sửa mã nguồn website`,
    ];
    await sendMessage(chatId, welcome.join('\n'), {
      inline_keyboard: [
        [
          { text: '📊 Xem Báo Cáo Tổng Hợp (/report)', callback_data: 'run_report' },
        ],
        [
          { text: '📈 Google Analytics 4 (/ga)', callback_data: 'cmd_ga' },
          { text: '🔎 Check Thứ Hạng SerpApi', callback_data: 'serp_menu' },
        ],
        [
          { text: '⚡ Tối Ưu Ngay Top 3 Bài Viết', callback_data: 'opt_batch_top3' },
        ],
      ],
    });
    return;
  }

  if (text === '/report') {
    await buildAndSendDailyReport(chatId);
    return;
  }

  if (text === '/ga' || text === '/analytics') {
    await handleGaCommand(chatId);
    return;
  }

  if (text.startsWith('/serp')) {
    const kw = text.replace(/^\/serp\s*/i, '').trim() || 'bê tông tươi ninh bình';
    await handleSerpCommand(chatId, kw, false);
    return;
  }

  if (text === '/audit') {
    const audit = await runFullSeoAudit();
    const lines = [
      `🛠️ <b>BÁO CÁO AUDIT KỸ THUẬT & ON-PAGE (betongangiabinh.vn)</b>`,
      ``,
      ...audit.liveChecks.map(
        (c) =>
          `• <code>${c.path}</code>: ${c.ok ? '✅ HTTP 200' : `❌ HTTP ${c.status}`} (${c.ms}ms)`
      ),
      ``,
      `📚 <b>Tổng số bài viết: ${audit.totals.posts}</b>`,
      `• Bài mỏng (&lt;600 từ): <b>${audit.issues.thinCount} bài</b>`,
      `• Thiếu Internal Links: <b>${audit.issues.missingLinksCount} bài</b>`,
      `• Meta Description yếu: <b>${audit.issues.weakMetaCount} bài</b>`,
    ];
    await sendMessage(chatId, lines.join('\n'), {
      inline_keyboard: [
        [{ text: '⚡ Tối ưu tự động Top 3 bài ưu tiên', callback_data: 'opt_batch_top3' }],
      ],
    });
    return;
  }

  if (text.startsWith('/optimize')) {
    const slug = text.replace(/^\/optimize\s*/i, '').trim();
    if (!slug) {
      await handleBatchOptimizeTop3(chatId);
      return;
    }
    await sendMessage(chatId, `⚡ Đang tối ưu hóa bài viết <code>${escHtml(slug)}</code> và đẩy lên GitHub + Google Indexing...`);
    try {
      const r = await optimizeSinglePostBySlug(slug);
      if (r.ok) {
        await sendMessage(
          chatId,
          `✅ <b>ĐÃ TỐI ƯU XONG BÀI VIẾT!</b>\n` +
            `📌 <b>${escHtml(r.title)}</b>\n` +
            `📝 Độ dài: <b>${r.oldWords} ➔ ${r.newWords} từ</b>\n` +
            `🔗 URL: ${escHtml(r.canonicalUrl)}\n` +
            `🔄 GitHub Commit: <code>${escHtml(r.gitSync?.commitHash || 'Đã lưu local')}</code>\n` +
            `📡 Google Indexing: ${r.indexRes?.ok ? '✅ Thành công' : escHtml(r.indexRes?.message || '')}`
        );
      } else {
        await sendMessage(chatId, `❌ ${escHtml(r.message)}`);
      }
    } catch (e) {
      await sendMessage(chatId, `❌ Lỗi khi tối ưu: ${escHtml(e.message)}`);
    }
    return;
  }

  if (text.startsWith('/write')) {
    const topic = text.replace(/^\/write\s*/i, '').trim();
    if (!topic) {
      await sendMessage(chatId, '⚠️ Vui lòng nhập chủ đề hoặc từ khóa. Ví dụ: <code>/write báo giá bê tông tươi mác 250 tại Ninh Bình</code>');
      return;
    }
    await sendMessage(chatId, `✍️ Đang viết bài chuẩn SEO mới cho chủ đề: <b>"${escHtml(topic)}"</b>...`);
    try {
      const r = await writeNewSeoPost(topic);
      if (r.ok) {
        await sendMessage(
          chatId,
          `🎉 <b>ĐÃ XUẤT BẢN BÀI VIẾT MỚI!</b>\n` +
            `📌 <b>${escHtml(r.post.title)}</b>\n` +
            `📝 Độ dài: <b>${r.words} từ</b>\n` +
            `🔗 URL: ${escHtml(r.canonicalUrl)}\n` +
            `🔄 GitHub Commit: <code>${escHtml(r.gitSync?.commitHash || 'Local')}</code>`
        );
      }
    } catch (e) {
      await sendMessage(chatId, `❌ Lỗi khi viết bài: ${escHtml(e.message)}`);
    }
    return;
  }

  if (text.startsWith('/agy')) {
    const ins = text.replace(/^\/agy\s*/i, '').trim();
    if (!ins) {
      await sendMessage(chatId, '⚠️ Vui lòng nhập yêu cầu cho Antigravity. Ví dụ: <code>/agy kiểm tra và tối ưu schema LocalBusiness trên trang chủ</code>');
      return;
    }
    await runAntigravityCli(chatId, ins);
    return;
  }

  // Intelligent Natural Language Conversational Agent
  await handleNaturalLanguageChat(chatId, text);
}

// ============================================================================
// 12. INTELLIGENT AGENTIC COPILOT & AUTONOMOUS ACTION ENGINE
// ============================================================================
async function handleNaturalLanguageChat(chatId, userText) {
  await sendMessage(chatId, '🤔 <i>Đang kiểm tra trực tiếp dữ liệu website Bê Tông An Gia Bình và chuẩn bị phản hồi cho Sếp...</i>');

  const posts = readJson(POSTS_FILE, []);
  const recentPosts = posts.slice(0, 10);
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);
  const todayPosts = posts.filter(p => (p.date || p.publishedAt || '').startsWith(todayIso));

  // Check if Sếp orders writing a new post
  if (/(viết|tạo|đăng|soạn)\s*(bài|tin|bài viết)/i.test(userText)) {
    let kw = userText.replace(/(hãy\s*)?(viết|tạo|đăng|soạn)\s*(cho\s*tôi\s*)?(1\s*)?(bài|tin|bài viết)\s*(về|chủ đề)?/i, '').trim();
    if (!kw || kw.length < 3) kw = 'bê tông tươi ninh bình';
    await sendMessage(chatId, `✍️ <i>Đang bắt đầu viết và xuất bản bài viết mới về từ khóa: "<b>${escHtml(kw)}</b>"...</i>`);
    await writeSinglePostByKeyword(chatId, kw);
    return;
  }

  // Check if Sếp orders optimizing a post
  if (/tối\s*ưu\s*(bài|trang)/i.test(userText)) {
    const slugMatch = userText.match(/([a-z0-9-]+(\.html)?)/i);
    const targetSlug = slugMatch ? slugMatch[1] : (recentPosts[0]?.slug || 'gia-be-tong-tuoi-ninh-binh');
    await sendMessage(chatId, `⚡ <i>Đang tiến hành tối ưu SEO bài viết: "<b>${escHtml(targetSlug)}</b>"...</i>`);
    await handleSingleOptimize(chatId, targetSlug);
    return;
  }

  const prompt = `Bạn là Trợ lý Giám đốc kiêm Chuyên viên SEO AI phụ trách toàn quyền website Công ty TNHH Bê Tông An Gia Bình: https://www.betongangiabinh.vn (Trạm trộn tại Ninh Bình, Hotline 0988 2662 93).
Bạn đang báo cáo trực tiếp với Sếp (quản trị viên cấp cao) qua Telegram.

DỮ LIỆU THỰC TẾ TRÊN HỆ THỐNG VỪA TRUY VẤN:
1. DANH SÁCH BÀI VIẾT MỚI NHẤT TRÊN WEBSITE (Tổng số: ${posts.length} bài viết):
${recentPosts.map((p, idx) => `${idx + 1}. "${p.title}" (Slug: ${p.slug || p.id}, Danh mục: ${p.category || 'Tin tức'})`).join('\n')}

2. TÌNH TRẠNG BÀI VIẾT HÔM NAY (${todayIso}):
${todayPosts.length ? `Đã có ${todayPosts.length} bài xuất bản:\n` + todayPosts.map(p => `- ${p.title}`).join('\n') : 'Hôm nay chưa có bài viết mới nào xuất bản.'}

3. TỪ KHÓA MỤC TIÊU TRỌNG ĐIỂM:
- bê tông tươi ninh bình, giá bê tông tươi ninh bình, trạm trộn bê tông ninh bình, bê tông thương phẩm gia viễn/nho quan/tam điệp...

YÊU CẦU CỦA SẾP VỪA GỬI:
"${userText}"

HƯỚNG DẪN TRẢ LỜI:
- Xưng hô: "em" và gọi người dùng là "Sếp" (hoặc "anh"). Thái độ chuyên nghiệp, tận tâm, trung thực, phản hồi sắc bén.
- KHÔNG BAO GIỜ bảo Sếp "gõ lệnh này lệnh kia" hoặc trả lời theo khuôn mẫu sáo rỗng.
- Trả lời thẳng vào câu hỏi của Sếp dựa trên dữ liệu thực tế:
  + Nếu hỏi về bài viết hôm nay hoặc bài mới: Cung cấp thông tin chính xác từ kho ${posts.length} bài viết.
  + Đề xuất hành động thực tế tiếp theo (viết bài, tối ưu từ khóa, check thứ hạng, kiểm tra đối thủ).
- Định dạng tin nhắn chuẩn HTML cho Telegram: Dùng <b>, <i>, <code>.`;

  try {
    const aiResponse = await callGeminiModel(prompt);
    const buttons = [
      [
        { text: '✍️ Viết bài Báo Giá Mới', callback_data: 'quick_write:bao-gia-be-tong-ninh-binh' },
        { text: '⚡ Tối ưu bài mới nhất', callback_data: `opt_${recentPosts[0]?.slug || 'home'}` },
      ],
      [
        { text: '📊 Xem Báo Cáo SEO', callback_data: 'cmd_report' },
        { text: '🔍 Kiểm tra Thứ Hạng (SERP)', callback_data: 'serp_menu' },
      ],
    ];
    await sendMessage(chatId, aiResponse, { inline_keyboard: buttons });
  } catch (err) {
    console.error('[handleNaturalLanguageChat] Error:', err);
    await sendMessage(
      chatId,
      `Dạ Sếp, em vừa kiểm tra trực tiếp kho dữ liệu website <b>betongangiabinh.vn</b> (${posts.length} bài viết):\n• Bài viết mới nhất: <b>${escHtml(recentPosts[0]?.title || 'Báo giá bê tông')}</b>\n• Tình trạng hôm nay: ${todayPosts.length ? `Có ${todayPosts.length} bài xuất bản` : 'Chưa có bài viết mới xuất bản hôm nay'}.\n\nSếp muốn em viết bài mới hay tối ưu bài nào cứ bảo em nhé!`,
      {
        inline_keyboard: [
          [{ text: '✍️ Viết bài chuẩn SEO ngay', callback_data: 'quick_write:bao-gia-be-tong-ninh-binh' }],
          [{ text: '📊 Xem Báo Cáo SEO', callback_data: 'cmd_report' }],
        ],
      }
    );
  }
}

async function startBot() {
  console.log('====================================================');
  console.log('🚀 BeTongAnGiaBinh SEO Agent (@angiabinh_seo_99_bot)');
  console.log('🌐 Website: https://www.betongangiabinh.vn');
  console.log('📊 GA4: G-6J50BRBSZS | GTM: GTM-MXH8TM7H | SerpApi: Active');
  console.log('====================================================');

  // Register bot command menu on Telegram
  await tgCall('setMyCommands', {
    commands: [
      { command: 'report', description: 'Báo cáo SEO + Google Analytics + SerpApi tổng hợp' },
      { command: 'ga', description: 'Báo cáo chi tiết Google Analytics 4 (G-6J50BRBSZS) & Traffic' },
      { command: 'serp', description: 'Kiểm tra thứ hạng từ khóa Google VN qua SerpApi' },
      { command: 'audit', description: 'Audit kỹ thuật On-Page 950 bài viết & trang đích' },
      { command: 'optimize', description: 'Tối ưu sâu bài viết + đẩy GitHub & Google Indexing' },
      { command: 'write', description: 'Viết bài chuẩn SEO mới cho Bê Tông An Gia Bình' },
      { command: 'agy', description: 'Giao việc cho Antigravity (Gemini 4 Argon)' },
    ],
  });

  // Flush old updates
  const initUpdates = await tgCall('getUpdates', { offset: -1, timeout: 1 });
  if (initUpdates.ok && initUpdates.result?.length) {
    lastUpdateId = initUpdates.result[initUpdates.result.length - 1].update_id + 1;
  }

  if (process.argv.includes('--send-initial-report')) {
    await buildAndSendDailyReport(AUTHORIZED_CHAT_ID);
  }

  // Schedule automatic daily report at 08:00 AM Vietnam time
  setInterval(async () => {
    const nowVn = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    if (nowVn.getHours() === 8 && nowVn.getMinutes() === 0) {
      await buildAndSendDailyReport(AUTHORIZED_CHAT_ID);
    }
  }, 60 * 1000);

  // Long-polling loop
  while (true) {
    try {
      const res = await tgCall('getUpdates', {
        offset: lastUpdateId,
        timeout: 25,
        allowed_updates: ['message', 'callback_query'],
      });
      if (res.ok && Array.isArray(res.result)) {
        for (const upd of res.result) {
          lastUpdateId = upd.update_id + 1;
          if (upd.callback_query?.data === 'run_report') {
            await tgCall('answerCallbackQuery', { callback_query_id: upd.callback_query.id });
            await buildAndSendDailyReport(AUTHORIZED_CHAT_ID);
          } else {
            await processUpdate(upd);
          }
        }
      }
    } catch (e) {
      console.warn('[Polling Retry]:', e.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startBot();
