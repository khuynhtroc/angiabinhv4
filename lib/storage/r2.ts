import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
}

export const DEFAULT_R2_CONFIG: R2Config = {
  accountId: '2e901a592cf5f497b7b446745cce98fd',
  accessKeyId: 'dc17895411931434dc806460b19e7473',
  secretAccessKey: '2d9712bfb69c14de896d456771f0f20bee6047a0f7669f284c7a0d22228946cc',
  bucketName: 'an-gia-binh-media',
  publicDomain: 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev'
};

export function getR2Config(): R2Config {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || DEFAULT_R2_CONFIG.accountId).trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || DEFAULT_R2_CONFIG.accessKeyId).trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || DEFAULT_R2_CONFIG.secretAccessKey).trim();
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || DEFAULT_R2_CONFIG.bucketName).trim();
  const publicDomain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || DEFAULT_R2_CONFIG.publicDomain).trim().replace(/\/+$/, '');

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicDomain };
}

let cachedS3Client: S3Client | null = null;
export function getR2Client(): S3Client {
  if (cachedS3Client) return cachedS3Client;
  const cfg = getR2Config();
  cachedS3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey
    }
  });
  return cachedS3Client;
}

/**
 * Upload a raw Buffer or Uint8Array directly to Cloudflare R2
 */
export async function uploadBufferToR2(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType = 'image/jpeg'
): Promise<string> {
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

/**
 * Checks if an image URL is already hosted on our own R2 bucket or local domain
 */
export function isAlreadyInternalR2Url(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.startsWith('/') ||
    clean.includes('pub-199a7c334ba049fa93207322cf9ac698.r2.dev') ||
    clean.includes('betongangiabinh.vn') ||
    clean.includes('an-gia-binh-media')
  );
}

/**
 * Helper to slugify a string
 */
function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

/**
 * Downloads an external image from URL and uploads it to Cloudflare R2
 */
export async function downloadAndUploadToR2(
  imageUrl: string,
  options?: {
    slug?: string;
    index?: number;
    subfolder?: string;
  }
): Promise<string | null> {
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
      console.warn(`[R2] Failed to download image from ${imageUrl}: HTTP ${res.status}`);
      return null;
    }

    const rawContentType = res.headers.get('content-type') || 'image/jpeg';
    const isImageByExt = /\.(jpe?g|png|webp|avif|gif)(\?.*)?$/i.test(imageUrl);
    if (!rawContentType.startsWith('image/') && !isImageByExt) {
      console.warn(`[R2] Phản hồi không phải là ảnh (${rawContentType}): ${imageUrl}`);
      return null;
    }
    let ext = 'jpg';
    if (rawContentType.includes('png') || imageUrl.includes('.png')) ext = 'png';
    else if (rawContentType.includes('webp') || imageUrl.includes('.webp')) ext = 'webp';
    else if (rawContentType.includes('avif') || imageUrl.includes('.avif')) ext = 'avif';
    else if (rawContentType.includes('gif') || imageUrl.includes('.gif')) ext = 'gif';

    const contentType = rawContentType.startsWith('image/') ? rawContentType : (ext === 'jpg' ? 'image/jpeg' : `image/${ext}`);

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 500) {
      // Too small, likely empty or tracker pixel
      return null;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const slugPart = cleanSlug(options?.slug || 'news-image');
    const idxPart = options?.index !== undefined ? `-${options.index}` : `-${Date.now().toString().slice(-4)}`;
    const sub = options?.subfolder || 'news';

    const key = `images/${sub}/${year}/${month}/${slugPart}${idxPart}.${ext}`;
    const r2Url = await uploadBufferToR2(buffer, key, contentType);
    return r2Url;
  } catch (err: any) {
    console.warn(`[R2] Error uploading image ${imageUrl} to R2:`, err?.message);
    return null;
  }
}

/**
 * Processes both cover image and all content images of a blog post,
 * downloading external images, uploading them to Cloudflare R2, and replacing URLs.
 */
export async function processPostImagesToR2(post: {
  title?: string;
  slug?: string;
  coverImage?: string;
  content?: string;
}): Promise<{
  coverImage: string;
  content: string;
  replacedCount: number;
}> {
  let coverImage = post.coverImage || '';
  let content = post.content || '';
  let replacedCount = 0;
  const postSlug = post.slug || cleanSlug(post.title || 'post');

  // 1. Process Cover Image
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
  const urlMap: Map<string, string> = new Map();

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

  // 3. Find all HTML img src: <img ... src="url" ...>
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

  // Replace all occurrences in content
  for (const [externalUrl, r2Url] of urlMap.entries()) {
    content = content.split(externalUrl).join(r2Url);
  }

  return { coverImage, content, replacedCount };
}

export interface CrawledMediaItem {
  r2Url: string;
  originalUrl: string;
  caption: string;
  alt: string;
}

export interface CrawledArticleMediaResult {
  coverImage: string | null;
  media: CrawledMediaItem[];
}

/**
 * Cào toàn bộ media (ảnh đại diện và ảnh trong nội dung bài viết gốc) từ URL tin tức
 * và tải trực tiếp lên Cloudflare R2 bucket an-gia-binh-media
 */
export async function crawlAndUploadArticleMedia(
  articleUrl: string,
  options: { slug?: string } = {}
): Promise<CrawledArticleMediaResult> {
  if (!articleUrl || !articleUrl.startsWith('http')) {
    return { coverImage: null, media: [] };
  }

  const postSlug = cleanSlug(options.slug || 'news');
  console.log(`[R2 Crawler] Đang cào dữ liệu media từ trang tin: ${articleUrl}...`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[R2 Crawler] Không thể truy cập bài gốc: HTTP ${res.status}`);
      return { coverImage: null, media: [] };
    }

    const html = await res.text();

    // 1. Trích xuất og:image hoặc twitter:image
    const ogMatch =
      html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i) ||
      html.match(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    let ogImage = ogMatch?.[1] ? ogMatch[1].trim().replace(/&amp;/g, '&') : null;
    if (ogImage && !ogImage.startsWith('http')) {
      try {
        ogImage = new URL(ogImage, articleUrl).href;
      } catch {}
    }

    // 2. Tìm kiếm các khối hình ảnh chuyên biệt (PhotoCMS, figure, picture, v.v.)
    const rawPhotoBlocks = [
      ...html.matchAll(
        /(?:<figure[\s\S]*?<\/figure>|<div[^>]*type=["']Photo["'][\s\S]*?<\/div>[\s\S]*?<\/div>|<div[^>]*class=["'][^"']*PhotoCMS_Quote[^"']*["'][\s\S]*?<\/div>[\s\S]*?<\/div>|<table[^>]*class=["'][^"']*picture[^"']*["'][\s\S]*?<\/table>|<div[^>]*class=["'][^"']*VCSortableInPreviewMode[^"']*["'][\s\S]*?<\/div>[\s\S]*?<\/div>)/gi
      )
    ];

    const rawCandidates: Array<{ url: string; caption: string; alt: string }> = [];
    const seenUrls = new Set<string>();

    function addCandidate(rawUrl?: string | null, captionText?: string | null, altText?: string | null) {
      if (!rawUrl) return;
      let cleanUrl = rawUrl.trim().replace(/&amp;/g, '&');
      if (!cleanUrl.startsWith('http')) {
        try {
          cleanUrl = new URL(cleanUrl, articleUrl).href;
        } catch {
          return;
        }
      }
      const lower = cleanUrl.toLowerCase();
      if (
        lower.includes('.svg') ||
        lower.includes('avatar') ||
        lower.includes('logo') ||
        lower.includes('icon') ||
        lower.includes('button') ||
        lower.includes('pixel') ||
        lower.includes('tracking') ||
        lower.includes('banner') ||
        lower.includes('enduser_avartar') ||
        lower.includes('100_100') ||
        lower.includes('data:image')
      ) {
        return;
      }
      if (seenUrls.has(cleanUrl)) return;
      seenUrls.add(cleanUrl);

      const cap = (captionText || altText || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .trim();

      rawCandidates.push({
        url: cleanUrl,
        caption: cap,
        alt: altText || cap
      });
    }

    // A. Quét từ các khối photo
    for (const block of rawPhotoBlocks) {
      const bHtml = block[0];
      const srcMatch = bHtml.match(/(?:data-original|data-src|data-lazy|src)=["']([^"']+)["']/i);
      const capMatch = bHtml.match(
        /(?:<div[^>]*class=["'][^"']*PhotoCMS_Caption[^"']*["'][^>]*>([\s\S]*?)<\/div>|<figcaption[^>]*>([\s\S]*?)<\/figcaption>|<p[^>]*class=["'][^"']*Image[^"']*["'][^>]*>([\s\S]*?)<\/p>|<td[^>]*class=["'][^"']*caption[^"']*["'][^>]*>([\s\S]*?)<\/td>)/i
      );
      const altMatch = bHtml.match(/alt=["']([^"']*)["']/i);
      const cap = capMatch ? capMatch[1] || capMatch[2] || capMatch[3] || capMatch[4] : '';
      addCandidate(srcMatch?.[1], cap, altMatch?.[1] || '');
    }

    // B. Quét thêm thẻ <img> có thuộc tính bài viết
    const imgTags = [...html.matchAll(/<img[^>]+>/gi)];
    for (const imgTag of imgTags) {
      const tag = imgTag[0];
      const srcMatch = tag.match(/(?:data-original|data-src|data-lazy|src)=["']([^"']+)["']/i);
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);
      const titleMatch = tag.match(/title=["']([^"']*)["']/i);
      if (srcMatch?.[1] && (altMatch?.[1] || titleMatch?.[1] || tag.includes('data-original') || tag.includes('data-src'))) {
        addCandidate(srcMatch[1], altMatch?.[1] || titleMatch?.[1] || '', altMatch?.[1] || '');
      }
    }

    console.log(`[R2 Crawler] Đã trích xuất ${rawCandidates.length} ứng viên ảnh thực tế từ bài gốc.`);

    // 3. Tải và upload từng ảnh lên Cloudflare R2
    const uploadedMedia: CrawledMediaItem[] = [];
    let r2CoverUrl: string | null = null;

    if (ogImage && !seenUrls.has(ogImage)) {
      const up = await downloadAndUploadToR2(ogImage, {
        slug: `${postSlug}-cover`,
        subfolder: 'news/covers'
      });
      if (up) {
        r2CoverUrl = up;
        console.log(`✓ Đã upload og:image làm ảnh cover R2: ${up}`);
      }
    }

    let mediaIdx = 1;
    for (const item of rawCandidates.slice(0, 6)) {
      const uploaded = await downloadAndUploadToR2(item.url, {
        slug: `${postSlug}`,
        index: mediaIdx++,
        subfolder: 'news/content'
      });
      if (uploaded) {
        uploadedMedia.push({
          r2Url: uploaded,
          originalUrl: item.url,
          caption: item.caption,
          alt: item.alt || item.caption
        });
        if (!r2CoverUrl) {
          r2CoverUrl = uploaded;
        }
      }
    }

    return {
      coverImage: r2CoverUrl,
      media: uploadedMedia
    };
  } catch (err: any) {
    console.warn('[R2 Crawler] Lỗi khi cào media bài gốc:', err?.message || err);
    return { coverImage: null, media: [] };
  }
}


