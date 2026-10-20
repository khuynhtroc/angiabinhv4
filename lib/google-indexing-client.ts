/**
 * Client-side helper for submitting URLs to Google Indexing API & IndexNow.
 */
export async function submitPostUrlToGoogleClient(postSlugOrUrl: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    let url = postSlugOrUrl;
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

    const res = await fetch('/api/admin/google-indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit-single',
        url,
        type
      })
    });

    if (!res.ok) {
      const err: any = await res.json().catch(() => ({}));
      return { success: false, message: err?.message || `HTTP ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    console.warn('[Google Indexing Client] Failed to submit URL:', err);
    return { success: false, message: err?.message || 'Lỗi mạng khi submit URL' };
  }
}

export async function submitBulkUrlsClient(urls?: string[], limit: number = 20) {
  try {
    const res = await fetch('/api/admin/google-indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit-bulk',
        urls,
        limit
      })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Lỗi mạng khi submit hàng loạt' };
  }
}

export async function testGoogleIndexingClient(serviceAccountJson?: string, testUrl?: string) {
  try {
    const res = await fetch('/api/admin/google-indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test-credentials',
        serviceAccountJson,
        testUrl
      })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Lỗi mạng khi kiểm tra kết nối' };
  }
}
