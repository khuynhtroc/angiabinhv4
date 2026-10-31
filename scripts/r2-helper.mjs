import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const DEFAULT_R2_CONFIG = {
  accountId: '2e901a592cf5f497b7b446745cce98fd',
  accessKeyId: 'dc17895411931434dc806460b19e7473',
  secretAccessKey: '2d9712bfb69c14de896d456771f0f20bee6047a0f7669f284c7a0d22228946cc',
  bucketName: 'an-gia-binh-media',
  publicDomain: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev'
};

export function getR2Config() {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || DEFAULT_R2_CONFIG.accountId).trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || DEFAULT_R2_CONFIG.accessKeyId).trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || DEFAULT_R2_CONFIG.secretAccessKey).trim();
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || DEFAULT_R2_CONFIG.bucketName).trim();
  const publicDomain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || DEFAULT_R2_CONFIG.publicDomain).trim().replace(/\/+$/, '');

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicDomain };
}

let cachedS3 = null;
export function getR2Client() {
  if (cachedS3) return cachedS3;
  const cfg = getR2Config();
  cachedS3 = new S3Client({
    region: 'auto',
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey
    }
  });
  return cachedS3;
}

export function isAlreadyInternalR2Url(url) {
  if (!url) return false;
  const clean = String(url).trim().toLowerCase();
  return (
    clean.startsWith('/') ||
    clean.includes('pub-199a7c334ba049fa93207322cf9ac698.r2.dev') ||
    clean.includes('betongangiabinh.vn') ||
    clean.includes('an-gia-binh-media')
  );
}

function cleanSlug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export async function uploadBufferToR2(buffer, key, contentType = 'image/jpeg') {
  const cfg = getR2Config();
  const s3 = getR2Client();
  const cleanKey = key.replace(/^\/+/, '');

  await s3.send(
    new PutObjectCommand({
      Bucket: cfg.bucketName,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    })
  );

  return `${cfg.publicDomain}/${cleanKey}`;
}

export async function downloadAndUploadToR2(imageUrl, options = {}) {
  if (!imageUrl || isAlreadyInternalR2Url(imageUrl)) {
    return imageUrl || null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: new URL(imageUrl).origin
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[R2] Tải ảnh thất bại từ ${imageUrl}: HTTP ${res.status}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      console.warn(`[R2] Phản hồi không phải là ảnh (${contentType}): ${imageUrl}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 500) {
      return null;
    }

    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('gif')) ext = 'gif';
    else if (contentType.includes('svg')) ext = 'svg';

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const slugPart = cleanSlug(options.slug || 'news-image');
    const idxPart = options.index !== undefined ? `-${options.index}` : `-${Date.now().toString().slice(-4)}`;
    const sub = options.subfolder || 'news';

    const key = `images/${sub}/${year}/${month}/${slugPart}${idxPart}.${ext}`;
    const r2Url = await uploadBufferToR2(buffer, key, contentType);
    console.log(`✓ Đã lưu ảnh R2: ${imageUrl.slice(0, 50)}... -> ${r2Url}`);
    return r2Url;
  } catch (err) {
    console.warn(`[R2] Lỗi tải & upload R2 cho ảnh ${imageUrl}:`, err.message);
    return null;
  }
}

export async function processPostImagesToR2(post) {
  let coverImage = post.coverImage || '';
  let content = post.content || '';
  let replacedCount = 0;
  const postSlug = post.slug || cleanSlug(post.title || 'post');

  // 1. Process cover image
  if (coverImage && !isAlreadyInternalR2Url(coverImage)) {
    const r2Cover = await downloadAndUploadToR2(coverImage, {
      slug: `${postSlug}-cover`,
      subfolder: 'news/covers'
    });
    if (r2Cover) {
      coverImage = r2Cover;
      replacedCount++;
    }
  }

  // 2. Find all markdown images: ![alt](url)
  const mdRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g;
  const mdMatches = [...content.matchAll(mdRegex)];

  let imgIndex = 1;
  const urlMap = new Map();

  for (const match of mdMatches) {
    const rawUrl = match[2];
    if (rawUrl && !isAlreadyInternalR2Url(rawUrl) && !urlMap.has(rawUrl)) {
      const r2Url = await downloadAndUploadToR2(rawUrl, {
        slug: postSlug,
        index: imgIndex++,
        subfolder: 'news/content'
      });
      if (r2Url) {
        urlMap.set(rawUrl, r2Url);
        replacedCount++;
      }
    }
  }

  // 3. Find all HTML img: <img ... src="url" ...>
  const htmlRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  const htmlMatches = [...content.matchAll(htmlRegex)];

  for (const match of htmlMatches) {
    const rawUrl = match[1];
    if (rawUrl && !isAlreadyInternalR2Url(rawUrl) && !urlMap.has(rawUrl)) {
      const r2Url = await downloadAndUploadToR2(rawUrl, {
        slug: postSlug,
        index: imgIndex++,
        subfolder: 'news/content'
      });
      if (r2Url) {
        urlMap.set(rawUrl, r2Url);
        replacedCount++;
      }
    }
  }

  // Replace occurrences in content
  for (const [externalUrl, r2Url] of urlMap.entries()) {
    content = content.split(externalUrl).join(r2Url);
  }

  return { coverImage, content, replacedCount };
}

