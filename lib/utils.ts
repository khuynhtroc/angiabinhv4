import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | string): string {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const parts = Number(num).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(',');
}

export function getPostUrl(idOrPost: { id?: string; slug?: string; permalink?: string } | string, slug?: string): string {
  if (typeof idOrPost === 'string') {
    const raw = slug || idOrPost;
    const clean = raw.replace(/^\//, '').replace(/\.html$/, '');
    return `/${clean}.html`;
  }
  if (idOrPost.permalink && idOrPost.permalink.trim()) {
    const p = idOrPost.permalink.trim();
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    const cleanP = p.replace(/^\//, '').replace(/\.html$/, '');
    return `/${cleanP}.html`;
  }
  const raw = idOrPost.slug || idOrPost.id || 'post-1';
  const clean = raw.replace(/^\//, '').replace(/\.html$/, '');
  return `/${clean}.html`;
}

// Fallback verified concrete and infrastructure images from Unsplash CDN
export const VERIFIED_FALLBACK_IMAGES = {
  default: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
  plant: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80',
  highway: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
  factory: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80',
  pump: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000&auto=format&fit=crop&q=80',
  testing: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000&auto=format&fit=crop&q=80',
  building: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=1000&auto=format&fit=crop&q=80'
};

export function getFallbackConcreteImage(hint?: string): string {
  if (!hint) return VERIFIED_FALLBACK_IMAGES.default;
  const lower = hint.toLowerCase();
  if (lower.includes('cao tốc') || lower.includes('cầu') || lower.includes('đường') || lower.includes('highway') || lower.includes('12b') || lower.includes('mai sơn')) {
    return VERIFIED_FALLBACK_IMAGES.highway;
  }
  if (lower.includes('nhà máy') || lower.includes('kcn') || lower.includes('mcnex') || lower.includes('bình điền') || lower.includes('chang xin') || lower.includes('xưởng')) {
    return VERIFIED_FALLBACK_IMAGES.factory;
  }
  if (lower.includes('trạm trộn') || lower.includes('khánh phú') || lower.includes('kim sơn') || lower.includes('cụm trạm')) {
    return VERIFIED_FALLBACK_IMAGES.plant;
  }
  if (lower.includes('xe bơm') || lower.includes('bơm cần') || lower.includes('bơm tĩnh') || lower.includes('xe bồn')) {
    return VERIFIED_FALLBACK_IMAGES.pump;
  }
  if (lower.includes('nén mẫu') || lower.includes('las') || lower.includes('r7') || lower.includes('r28') || lower.includes('tiêu chuẩn') || lower.includes('kiểm định')) {
    return VERIFIED_FALLBACK_IMAGES.testing;
  }
  if (lower.includes('trường') || lower.includes('kho bạc') || lower.includes('bệnh viện') || lower.includes('biệt thự') || lower.includes('dân dụng')) {
    return VERIFIED_FALLBACK_IMAGES.building;
  }
  return VERIFIED_FALLBACK_IMAGES.default;
}

// Official fallback image of An Gia Bình batching plant
export const AGB_PLANT_IMAGE = 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg';
export const AGB_R2_BASE_URL = 'https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev';

// Clean and normalize image URLs by removing HTML entities (&quot;, &amp;), comments (# Thay bằng...), and erroneous quotes
export function cleanMediaUrl(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let url = raw.trim();

  // Decode common HTML entities
  url = url
    .replace(/&quot;/gi, '')
    .replace(/&#34;/gi, '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  // Strip literal quotes or apostrophes surrounding or inside URL
  url = url.replace(/["'`]/g, '');

  // Strip any trailing comments starting with # (e.g. # Thay bằng đường dẫn ảnh thực tế)
  if (url.includes('#')) {
    const idx = url.indexOf('#');
    const hashPart = url.slice(idx);
    if (hashPart.includes(' ') || /thay|ảnh|duong|thực|thay bằng/i.test(hashPart)) {
      url = url.slice(0, idx).trim();
    }
  }

  // Strip trailing whitespace or leftover words
  url = url.split(/\s+/)[0] || '';

  // Clean Jekyll Liquid template tags if present
  url = url.replace(/\{\{\s*site\.(?:url|baseurl)\s*\}\}/g, '');

  return url.trim();
}

export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  hint?: string
) {
  const target = e.currentTarget;
  if (target.dataset.hasFallback === 'second') return;
  if (target.dataset.hasFallback === 'true') {
    target.dataset.hasFallback = 'second';
    target.src = getFallbackConcreteImage(hint);
    return;
  }
  target.dataset.hasFallback = 'true';
  // Fallback to authentic trạm trộn Bê tông An Gia Bình image
  target.src = AGB_PLANT_IMAGE;
}

export function resolveMediaUrl(src?: string, fallbackHint?: string): string {
  const cleaned = cleanMediaUrl(src);
  if (!cleaned) {
    return AGB_PLANT_IMAGE;
  }

  // Replace old broken unsplash photo id if present
  if (cleaned.includes('photo-1541888946425-d0fbb186156a')) {
    return AGB_PLANT_IMAGE;
  }

  // Map legacy or broken GitHub Pages asset URLs to Cloudflare R2 bucket where assets reside
  if (cleaned.startsWith('https://khuynhtroc.github.io/angiabinh/images/')) {
    const rel = cleaned.replace('https://khuynhtroc.github.io/angiabinh', '');
    return `${AGB_R2_BASE_URL}${rel}`;
  }

  // If already an absolute web url, return cleaned url
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:')) {
    return cleaned;
  }

  // Strip leading website domain if present
  let clean = cleaned.replace(/^https?:\/\/(www\.)?betongangiabinh\.vn/i, '');
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  // Look up configured R2 URL
  let r2Url = (process.env.NEXT_PUBLIC_R2_URL || '').replace(/\/+$/, '') || AGB_R2_BASE_URL;
  if (typeof window !== 'undefined') {
    try {
      const savedR2 = localStorage.getItem('agiabinh_r2_url') || localStorage.getItem('NEXT_PUBLIC_R2_URL');
      if (savedR2 && savedR2.trim()) {
        r2Url = savedR2.trim().replace(/\/+$/, '');
      }
      if (!r2Url || r2Url === AGB_R2_BASE_URL) {
        const jekyll = localStorage.getItem('agiabinh_jekyll_config_v2');
        if (jekyll) {
          const parsed = JSON.parse(jekyll);
          if (parsed?.r2_url) r2Url = parsed.r2_url.trim().replace(/\/+$/, '');
        }
      }
    } catch {}
  }

  if (clean.startsWith('/images/')) {
    return `${r2Url || AGB_R2_BASE_URL}${clean}`;
  }

  return clean;
}

export function getCategorySlug(categoryName?: string): 'tin-tuc' | 'kinh-nghiem' | 'kien-thuc' {
  if (!categoryName) return 'tin-tuc';
  const lower = categoryName.toLowerCase().trim();
  if (
    lower.includes('kinh nghiệm') ||
    lower.includes('kinh-nghiem') ||
    lower.includes('kỹ thuật') ||
    lower.includes('ky-thuat') ||
    lower.includes('thi công') ||
    lower.includes('cẩm nang') ||
    lower.includes('cam-nang') ||
    lower.includes('kinh nghiem')
  ) {
    return 'kinh-nghiem';
  }
  if (
    lower.includes('kiến thức') ||
    lower.includes('kien-thuc') ||
    lower.includes('tiêu chuẩn') ||
    lower.includes('tieu-chuan') ||
    lower.includes('chất lượng') ||
    lower.includes('nén mẫu') ||
    lower.includes('cấp phối') ||
    lower.includes('kien thuc')
  ) {
    return 'kien-thuc';
  }
  return 'tin-tuc';
}

export function getPostBlogUrl(post: { slug?: string; category?: string; id?: string } | string, category?: string): string {
  if (typeof post === 'string') {
    const folder = getCategorySlug(category);
    return `/blog/${folder}/${post}`;
  }
  const folder = getCategorySlug(post.category || category);
  return `/blog/${folder}/${post.slug || post.id || 'bai-viet'}`;
}

export function getCategoryUrl(categoryOrSlug: { slug?: string; id?: string; name?: string } | string): string {
  if (!categoryOrSlug) return '/blog';
  if (typeof categoryOrSlug === 'object' && categoryOrSlug.slug) {
    return `/blog/${categoryOrSlug.slug}`;
  }
  const nameOrSlug = typeof categoryOrSlug === 'string' ? categoryOrSlug : (categoryOrSlug.name || '');
  if (!nameOrSlug || nameOrSlug === 'Tất Cả' || nameOrSlug === 'all') return '/blog';
  const slug = getCategorySlug(nameOrSlug);
  return `/blog/${slug}`;
}

/**
 * Clean and sanitize excerpt text by stripping out inline CSS styles (.vnaicontent-wrapper...),
 * HTML tags, markdown images, and Jekyll/Liquid tags ({{{ site.url }}}).
 */
export function cleanExcerptText(raw?: string, maxLength: number = 180): string {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw;

  // Remove <style>...</style> and <script>...</script> blocks
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove CSS class definitions like .vnaicontent-wrapper img{...}
  text = text.replace(/\.[a-zA-Z0-9_-]+\s*\{[^}]*\}/g, '');
  text = text.replace(/\{[^}]*\}/g, '');

  // Remove Jekyll / Liquid tags: {{{ ... }}}, {{ ... }}, {% ... %}
  text = text.replace(/\{\{\{[\s\S]*?\}\}\}/g, '');
  text = text.replace(/\{\{[\s\S]*?\}\}/g, '');
  text = text.replace(/\{%[\s\S]*?%\}/g, '');

  // Remove markdown images: ![alt](url)
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  // Convert markdown links [text](url) to plain text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Remove any remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Remove markdown formatting characters
  text = text.replace(/^[#\*\-\>\s]+/gm, '');
  text = text.replace(/[\*\_\`\#]/g, '');

  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length > maxLength) {
    return text.slice(0, maxLength).trim() + '...';
  }
  return text;
}

