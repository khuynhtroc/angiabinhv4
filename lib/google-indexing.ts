import { getAdminConfigServer, saveAdminConfigServer } from '@/lib/server-data';
import { IndexingLogItem } from '@/lib/types';

export interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  project_id?: string;
}

/**
 * Base64URL encoder compatible with both Node.js and Cloudflare Workers Edge runtime.
 */
function base64url(input: Uint8Array | string): string {
  let base64 = '';
  if (typeof input === 'string') {
    base64 = btoa(unescape(encodeURIComponent(input)));
  } else {
    let binary = '';
    const bytes = input;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Parse PEM private key string into Uint8Array for Web Crypto API PKCS#8 import.
 */
function pemToBinary(pem: string): Uint8Array {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '')
    .replace(/-----END RSA PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');
  const raw = atob(clean);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

/**
 * Extract and parse Service Account credentials from JSON string or object.
 */
export function parseServiceAccount(input?: string | null): ServiceAccountCredentials | null {
  if (!input) return null;
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    if (parsed && parsed.client_email && parsed.private_key) {
      return {
        client_email: parsed.client_email.trim(),
        private_key: parsed.private_key.trim(),
        project_id: parsed.project_id
      };
    }
  } catch {
    // not valid JSON
  }
  return null;
}

/**
 * Get active credentials from argument, admin-settings.json, or environment variables.
 */
export function getActiveIndexingCredentials(customJson?: string): {
  credentials: ServiceAccountCredentials | null;
  googleEnabled: boolean;
  autoSubmit: boolean;
  indexNowKey: string;
  indexNowEnabled: boolean;
} {
  // 1. Direct customJson passed
  if (customJson) {
    const creds = parseServiceAccount(customJson);
    if (creds) {
      return {
        credentials: creds,
        googleEnabled: true,
        autoSubmit: true,
        indexNowKey: '',
        indexNowEnabled: false
      };
    }
  }

  // 2. Load from admin-settings.json
  const config = getAdminConfigServer();
  const integrations = config?.integrations || {};

  const jsonStr = integrations.googleServiceAccountJson || process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT;
  let creds = parseServiceAccount(jsonStr);

  if (!creds && integrations.googleServiceAccountEmail && integrations.googlePrivateKey) {
    creds = {
      client_email: integrations.googleServiceAccountEmail.trim(),
      private_key: integrations.googlePrivateKey.trim()
    };
  }

  if (!creds && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    creds = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim(),
      private_key: process.env.GOOGLE_PRIVATE_KEY.trim()
    };
  }

  return {
    credentials: creds,
    googleEnabled: integrations.googleIndexingEnabled !== false,
    autoSubmit: integrations.autoSubmitNewPosts !== false,
    indexNowKey: integrations.indexNowKey || process.env.INDEXNOW_KEY || '',
    indexNowEnabled: Boolean(integrations.indexNowEnabled)
  };
}

/**
 * Exchange Google Service Account credentials for an OAuth2 Access Token via RS256 JWT.
 */
export async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const binaryKey = pemToBinary(privateKey);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const toSign = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, enc.encode(toSign));
  const jwt = `${toSign}.${base64url(new Uint8Array(signature))}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google OAuth token request failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData: any = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error('Google OAuth response did not contain access_token');
  }

  return tokenData.access_token;
}

/**
 * Submit URL to Google Indexing API (https://indexing.googleapis.com/v3/urlNotifications:publish)
 */
export async function submitUrlToGoogleIndexing(
  url: string,
  options?: {
    clientEmail?: string;
    privateKey?: string;
    serviceAccountJson?: string;
    type?: 'URL_UPDATED' | 'URL_DELETED';
  }
): Promise<{ success: boolean; status: 'success' | 'error' | 'skipped'; httpStatus?: number; message: string; data?: any }> {
  try {
    let clientEmail = options?.clientEmail;
    let privateKey = options?.privateKey;

    if (!clientEmail || !privateKey) {
      const active = getActiveIndexingCredentials(options?.serviceAccountJson);
      if (!active.credentials) {
        return {
          success: false,
          status: 'skipped',
          message: 'Chưa cấu hình Google Service Account JSON trong Quản trị / Admin.'
        };
      }
      clientEmail = active.credentials.client_email;
      privateKey = active.credentials.private_key;
    }

    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);

    const publishRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        type: options?.type || 'URL_UPDATED'
      })
    });

    const resText = await publishRes.text();
    let resData: any = null;
    try {
      resData = JSON.parse(resText);
    } catch {
      resData = { raw: resText };
    }

    if (publishRes.ok) {
      return {
        success: true,
        status: 'success',
        httpStatus: publishRes.status,
        message: 'Google Indexing API đã tiếp nhận URL thành công.',
        data: resData
      };
    } else {
      const errMsg = resData?.error?.message || resText || `HTTP ${publishRes.status}`;
      return {
        success: false,
        status: 'error',
        httpStatus: publishRes.status,
        message: `Google Indexing API báo lỗi (${publishRes.status}): ${errMsg}`,
        data: resData
      };
    }
  } catch (err: any) {
    return {
      success: false,
      status: 'error',
      message: `Lỗi kết nối Google Indexing: ${err?.message || 'Unknown error'}`
    };
  }
}

/**
 * Submit URL to Bing / IndexNow
 */
export async function submitUrlToIndexNow(
  url: string,
  key?: string,
  host: string = 'www.betongangiabinh.vn'
): Promise<{ success: boolean; status: 'success' | 'error' | 'skipped'; httpStatus?: number; message: string }> {
  try {
    const activeKey = key || getActiveIndexingCredentials().indexNowKey;
    if (!activeKey) {
      return {
        success: false,
        status: 'skipped',
        message: 'Chưa cấu hình IndexNow Key.'
      };
    }

    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: activeKey,
        keyLocation: `https://${host}/${activeKey}.txt`,
        urlList: [url]
      })
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      return {
        success: true,
        status: 'success',
        httpStatus: res.status,
        message: 'IndexNow đã tiếp nhận URL thành công.'
      };
    } else {
      return {
        success: false,
        status: 'error',
        httpStatus: res.status,
        message: `IndexNow báo lỗi HTTP ${res.status}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      status: 'error',
      message: `Lỗi kết nối IndexNow: ${err?.message || 'Unknown error'}`
    };
  }
}

/**
 * Helper to record and persist indexing logs to admin-settings.json.
 */
export function recordIndexingLog(item: Omit<IndexingLogItem, 'id' | 'timestamp'>): IndexingLogItem {
  const config = getAdminConfigServer() || {};
  const integrations = config.integrations || {};
  const currentLogs: IndexingLogItem[] = Array.isArray(integrations.indexingLogs) ? integrations.indexingLogs : [];

  const newLog: IndexingLogItem = {
    id: `idx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...item
  };

  const updatedLogs = [newLog, ...currentLogs].slice(0, 50); // keep last 50
  const totalSubmitted = (integrations.totalIndexedSubmitted || 0) + (item.status === 'success' ? 1 : 0);

  saveAdminConfigServer({
    integrations: {
      ...integrations,
      indexingLogs: updatedLogs,
      lastIndexedAt: new Date().toISOString(),
      totalIndexedSubmitted: totalSubmitted
    }
  });

  return newLog;
}

/**
 * High-level function: Automatically submit a canonical post URL to Google and IndexNow.
 * Called when a new post is created in Admin or by AI Scheduler.
 */
export async function autoSubmitPostUrlServer(
  postSlugOrUrl: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<{ google?: any; indexnow?: any }> {
  // Normalize URL
  let fullUrl = postSlugOrUrl;
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    const isNews = postSlugOrUrl.includes('tin-tuc/') || postSlugOrUrl.includes('/tin-tuc/');
    const clean = postSlugOrUrl
      .trim()
      .replace(/^\/?(blog\/)?/, '')
      .replace(/^tin-tuc\//, '')
      .replace(/\/+\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/+$/, '')
      .trim();
    if (isNews) {
      fullUrl = `https://www.betongangiabinh.vn/blog/tin-tuc/${clean}.html`;
    } else {
      fullUrl = `https://www.betongangiabinh.vn/${clean}.html`;
    }
  }

  const active = getActiveIndexingCredentials();
  const results: { google?: any; indexnow?: any } = {};

  // 1. Google Indexing API
  if (active.googleEnabled && active.autoSubmit && active.credentials) {
    const gResult = await submitUrlToGoogleIndexing(fullUrl, {
      clientEmail: active.credentials.client_email,
      privateKey: active.credentials.private_key,
      type
    });
    results.google = gResult;
    recordIndexingLog({
      url: fullUrl,
      type,
      engine: 'google',
      status: gResult.status,
      httpStatus: gResult.httpStatus,
      message: gResult.message
    });
  } else if (!active.credentials) {
    recordIndexingLog({
      url: fullUrl,
      type,
      engine: 'google',
      status: 'skipped',
      message: 'Chờ cấu hình Google Service Account JSON trong Quản trị.'
    });
  }

  // 2. IndexNow
  if (active.indexNowEnabled && active.indexNowKey) {
    const inResult = await submitUrlToIndexNow(fullUrl, active.indexNowKey);
    results.indexnow = inResult;
    recordIndexingLog({
      url: fullUrl,
      type,
      engine: 'indexnow',
      status: inResult.status,
      httpStatus: inResult.httpStatus,
      message: inResult.message
    });
  }

  return results;
}
