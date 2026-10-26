import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import {
  getActiveIndexingCredentials,
  submitUrlToGoogleIndexing,
  submitUrlToIndexNow,
  recordIndexingLog,
  parseServiceAccount
} from '@/lib/google-indexing';
import { getAdminConfigServer, saveAdminConfigServer, getAllPostsServer } from '@/lib/server-data';
import { IndexingLogItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getAdminConfigServer() || {};
    const integrations = config.integrations || {};
    const active = getActiveIndexingCredentials();

    return NextResponse.json({
      success: true,
      config: {
        googleIndexingEnabled: integrations.googleIndexingEnabled !== false,
        autoSubmitNewPosts: integrations.autoSubmitNewPosts !== false,
        hasCredentials: Boolean(active.credentials),
        clientEmail: active.credentials?.client_email || '',
        indexNowKey: integrations.indexNowKey || '',
        indexNowEnabled: Boolean(integrations.indexNowEnabled),
        lastIndexedAt: integrations.lastIndexedAt || null,
        totalIndexedSubmitted: integrations.totalIndexedSubmitted || 0
      },
      logs: integrations.indexingLogs || []
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Lỗi tải cấu hình Google Indexing: ' + err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'submit-single';
    const config = getAdminConfigServer() || {};
    const integrations = config.integrations || {};

    // 1. SAVE CONFIGURATION
    if (action === 'save-config') {
      const {
        serviceAccountJson,
        googleIndexingEnabled,
        autoSubmitNewPosts,
        indexNowKey,
        indexNowEnabled
      } = body;

      const updatedIntegrations = { ...integrations };

      if (serviceAccountJson !== undefined) {
        updatedIntegrations.googleServiceAccountJson = serviceAccountJson.trim();
        const parsed = parseServiceAccount(serviceAccountJson);
        if (parsed) {
          updatedIntegrations.googleServiceAccountEmail = parsed.client_email;
          updatedIntegrations.googlePrivateKey = parsed.private_key;
        }
      }

      if (googleIndexingEnabled !== undefined) {
        updatedIntegrations.googleIndexingEnabled = Boolean(googleIndexingEnabled);
      }

      if (autoSubmitNewPosts !== undefined) {
        updatedIntegrations.autoSubmitNewPosts = Boolean(autoSubmitNewPosts);
      }

      if (indexNowKey !== undefined) {
        const cleanKey = indexNowKey.trim();
        updatedIntegrations.indexNowKey = cleanKey;
        if (cleanKey && /^[a-zA-Z0-9_-]+$/.test(cleanKey)) {
          try {
            const keyFilePath = path.join(process.cwd(), 'public', `${cleanKey}.txt`);
            fs.writeFileSync(keyFilePath, cleanKey, 'utf-8');
          } catch (writeErr) {
            console.warn('[Google Indexing] Could not write IndexNow verification file:', writeErr);
          }
        }
      }

      if (indexNowEnabled !== undefined) {
        updatedIntegrations.indexNowEnabled = Boolean(indexNowEnabled);
      }

      saveAdminConfigServer({
        integrations: updatedIntegrations
      });

      return NextResponse.json({
        success: true,
        message: 'Đã lưu cấu hình Google Indexing thành công!',
        hasCredentials: Boolean(updatedIntegrations.googleServiceAccountEmail || updatedIntegrations.googleServiceAccountJson)
      });
    }

    // 2. TEST CREDENTIALS
    if (action === 'test-credentials') {
      const customJson = body.serviceAccountJson;
      const testUrl = body.testUrl || 'https://www.betongangiabinh.vn/';
      const active = getActiveIndexingCredentials(customJson);

      if (!active.credentials) {
        return NextResponse.json({
          success: false,
          status: 'error',
          message: 'Không tìm thấy thông tin Service Account hợp lệ. Vui lòng dán file JSON đầy đủ chứa client_email và private_key.'
        });
      }

      const result = await submitUrlToGoogleIndexing(testUrl, {
        clientEmail: active.credentials.client_email,
        privateKey: active.credentials.private_key,
        type: 'URL_UPDATED'
      });

      return NextResponse.json({
        ...result,
        clientEmail: active.credentials.client_email
      });
    }

    // 3. SUBMIT SINGLE URL
    if (action === 'submit-single') {
      let url = body.url;
      if (!url) {
        return NextResponse.json({ success: false, message: 'Thiếu URL bài viết cần submit' }, { status: 400 });
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const clean = url
          .trim()
          .replace(/^\/?(blog\/)?/, '')
          .replace(/\/+\.html$/, '')
          .replace(/\.html$/, '')
          .replace(/\/+$/, '')
          .trim();
        url = `https://www.betongangiabinh.vn/${clean}.html`;
      }

      const active = getActiveIndexingCredentials();
      const results: { google?: any; indexnow?: any } = {};

      if (active.googleEnabled) {
        const gResult = await submitUrlToGoogleIndexing(url, {
          clientEmail: active.credentials?.client_email,
          privateKey: active.credentials?.private_key,
          type: body.type || 'URL_UPDATED'
        });
        results.google = gResult;

        recordIndexingLog({
          url,
          type: body.type || 'URL_UPDATED',
          engine: 'google',
          status: gResult.status,
          httpStatus: gResult.httpStatus,
          message: gResult.message
        });
      }

      if (active.indexNowEnabled && active.indexNowKey) {
        const inResult = await submitUrlToIndexNow(url, active.indexNowKey);
        results.indexnow = inResult;

        recordIndexingLog({
          url,
          type: body.type || 'URL_UPDATED',
          engine: 'indexnow',
          status: inResult.status,
          httpStatus: inResult.httpStatus,
          message: inResult.message
        });
      }

      return NextResponse.json({
        success: true,
        url,
        results
      });
    }

    // 4. SUBMIT BULK / ALL POSTS
    if (action === 'submit-bulk') {
      let urls: string[] = Array.isArray(body.urls) ? body.urls : [];

      // If no urls passed, get all posts from database
      if (urls.length === 0) {
        const posts = getAllPostsServer();
        const limit = typeof body.limit === 'number' ? body.limit : 20; // default to first 20 to respect quota
        urls = posts
          .slice(0, limit)
          .map(p => `https://www.betongangiabinh.vn/${(p.slug || p.id).replace(/\.html$/, '')}.html`);
      }

      const active = getActiveIndexingCredentials();
      const summary = {
        total: urls.length,
        success: 0,
        failed: 0,
        skipped: 0,
        items: [] as any[]
      };

      for (const targetUrl of urls) {
        let gResult: any = { status: 'skipped', message: 'Google Indexing tắt hoặc chưa cấu hình' };
        if (active.googleEnabled && active.credentials) {
          gResult = await submitUrlToGoogleIndexing(targetUrl, {
            clientEmail: active.credentials.client_email,
            privateKey: active.credentials.private_key,
            type: 'URL_UPDATED'
          });

          recordIndexingLog({
            url: targetUrl,
            type: 'URL_UPDATED',
            engine: 'google',
            status: gResult.status,
            httpStatus: gResult.httpStatus,
            message: gResult.message
          });
        }

        if (gResult.status === 'success') summary.success++;
        else if (gResult.status === 'error') summary.failed++;
        else summary.skipped++;

        summary.items.push({ url: targetUrl, result: gResult });

        // Small delay to prevent API burst limits
        await new Promise(r => setTimeout(r, 100));
      }

      return NextResponse.json({
        success: true,
        summary
      });
    }

    return NextResponse.json({ success: false, message: `Hành động ${action} không hợp lệ` }, { status: 400 });
  } catch (err: any) {
    console.error('[API /api/admin/google-indexing] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý Google Indexing: ' + (err?.message || 'Internal Error') },
      { status: 500 }
    );
  }
}
