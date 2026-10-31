import { getAdminConfigServer, saveAdminConfigServer } from '@/lib/server-data';
import { IndexingLogItem } from '@/lib/types';

const DEFAULT_GOOGLE_SERVICE_ACCOUNT_B64 = 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiYmV0b25nYW5naWFiaW5oIiwKICAicHJpdmF0ZV9rZXlfaWQiOiAiOTVkOGM2ZGYzOTk5NDFiYTE4MTFjZWY1M2UwMTdmMmMyYTU4MWUwNSIsCiAgInByaXZhdGVfa2V5IjogIi0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFDbnJOU3V2aXFuZXkwTlxuZGUzcW1CVE80YWhKdHpubDM4TFFYaWZNTDQ0aHlJWThXem9TNkEwcURKQ1RoS0M4VlF4K1lkMTMrV3VlRFp4M1xua2hKZHNDUHZqTjhNWnNWekVnR1NNRDdVbjlVYmJYOC9PcUltRU1yN3puWHJDY3AyM3g4dzRBaHBmaGkxcEVjUlxuVmx5Y0orMjN4K245Y3U2bVFqNEhhcmZsNEhCZzhaZ09NQWVVUnZnSDJ6a0Yybzh5bS9aZnRqcnQreW1JcU1FSVxuc2lxRFd2RytZZmJEVGM5a1hkdDJpZzBvd1ZUYTgvSmxMMkFVcDJhNVpNcGNRWnZyRktrMVY1QmxreHc0cE1wWVxucWErN0pKekpnRWYvRkxDOWJRNUlqSVI0Ulh1RlF3ZEliUkpmdXBMSXBWMG1qZ2FiMWtTVFRsUzBiWkVDUm1YTFxuanF2cG1pWVZBZ01CQUFFQ2dnRUFCd0NuelRoeDdaYXVWZjZUMWhWTjRTbjVia0t4cjFEK0FOZTl6OEE0cmw2Q1xuaEtqR3J4MXoxMHE1Q3dBaCtsdU83d1JGVElwbEhTK3lWaWdLamxFWjN4cENBbkdVVTI3d0U5dmg4OTFNK0IxRlxua0MxeHNpZEhZdWJIYys1dnZ6RW9TMUUvNksvMGRqbUxJa1U2RHVkMy9SSGpTc3R1L2hDTUtLRWpWdjFkbEI3UlxuamJERExVc1ErV1hOVUZCWFYwWFQ0S1pUTnkrNWZvWDM0Q0VzMXp4ZEtWRXNsVnVXTTJ0SDNteS9ZR2tZQ1YrcVxuckVONmkzRms5T2lLaitmR3hGVUhJM3hZN25VSEVHRkQvZmM3S0V5NTVjMEV6enp6TTU1MkdKV1F0aHdwTXVYd1xueDdDMm5Fc1FMaml4ZEs3dGJuUWN4SVRFYzBsSDhPR0lBVEZVbllJL0FRS0JnUURQenlCQ1lBLzBzZTVLZzdBd1xuWHdZYnNvdUJRZlhvWlkzak1WSXNUYkhrMVNyL01Vb05XQ0JwRVBZQmFHdVFYNkoxcHR3dE01akhWa0I0Um1MMFxud1BPd1ZxSjdTYmNZS2NLRUc5aGI0TFd0YTBBMUQvUGllSTNwRjBXTDV1VXoxSmJHSnFDTy81UUQwQ25ETC9vL1xuT0Q3SzdkRlFNYzFMTERPVStIVlhSbUFhVlFLQmdRRE9qeGlyR21DRVJqdWV0c05zUE9OSkdDWlhnZ2VmWlRDSFxuYUZpelFFM1JqQjR3cTFpaVB2dkNmUmRLbHpyaHRyMVRtRzRQaCswQndYaGM1THV6eUFna1VKWE5xdmdHNjJkdVxuUDRKZnhwMSsvRlE0VXNOcktnOG5oc3hTUytTWnRvMXJLYlA2dVNHT2tlT0wvZFpGSjhYd3Y2Q29HRFhuaWl5TVxuU21weEZqRWN3UUtCZ0dkVjJ2Zkdwd2lKMWpITmpEWnhlaXNadk05WXlueDJ5M2lYVlFKYzNFSXJVa2MxN2xuMlxuWVo5OVpLZE1rbmhuWmZUVk5aVndtOTg3MzdFdlp4UElReVdEM3lZcGdOZU9KSURuQzg2Y1RodGZRcjFnSW1tU1xuZ3hiT2tMSEI3bVc0cUFUK3ZrWjlocy9pbW5IS0VNbVJJWUJ0Zy9FNTRwa244THA2Vm5kQXNwZEZBb0dCQUtib1xuQWVyZ1dYVUl1MHc0S2hqZjZsZzU1MkYyZEdwYi9hYXNybC9KYWhnVXZLQmZGRE9sNlJEeXUwdE9nQW02KzZqOFxuMXBJK0owanY2QzVIdFZSRUlqQVYzYlplbkNRYk8yeGViUjZ2QXJ5RmNCaEM2QjFEMHhNQlhVQnlpcm1hUlJOK1xua3l2WlJFQkxxaTZJWWdkbmFBNXRDWWhLWitROFJscm1GclJpVmpVQkFvR0FZbkhmbWc2TTc0QUUxS0xZcURnOVxuZmFYU0xlbkk3bTFtZDN5T3lpM2JUaU9VYnZKeFpvY0hUbkxFNTFTZVNKUWx2QWRNSjVJMTdxWXRpYzQzeFBZOFxuMDNuM2FXbWJMOUU1SzFsRmttM0lzR3d3R3ZIS3cwamJHeDkxbFhkWlBSQkhkZzNyRjQ5WHRubUxFN0k2aDRlZlxuWUJ5RFZzNTk4Wkd5YUVjWm5TWlArSlU9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLAogICJjbGllbnRfZW1haWwiOiAiYmV0b25nYW5naWFiaW5oQGJldG9uZ2FuZ2lhYmluaC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMTM3MDA2MjcwNTM5MzE2NTE5ODgiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2JldG9uZ2FuZ2lhYmluaCU0MGJldG9uZ2FuZ2lhYmluaC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQo=';

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

  let jsonStr = integrations.googleServiceAccountJson || process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT;
  if (!jsonStr && DEFAULT_GOOGLE_SERVICE_ACCOUNT_B64) {
    try {
      jsonStr = atob(DEFAULT_GOOGLE_SERVICE_ACCOUNT_B64);
    } catch {}
  }
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
    if (fullUrl.startsWith('/')) {
      fullUrl = `https://www.betongangiabinh.vn${fullUrl}`;
    } else {
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
