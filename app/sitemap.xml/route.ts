import { NextResponse } from 'next/server';
import {
  getAllPostsServer,
  getAllProjectsServer,
  getAllPagesServer,
  getAllCategoriesServer
} from '@/lib/server-data';
import { SERVICES_DATABASE } from '@/lib/services-data';
import { getCategorySlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://betongangiabinh.vn';
  const nowIso = new Date().toISOString().split('T')[0];

  interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: string;
    type: 'page' | 'cat' | 'blog' | 'project' | 'policy';
  }

  const entries: SitemapEntry[] = [];
  const addedUrls = new Set<string>();

  const addUrl = (
    rawPath: string,
    lastmod: string,
    changefreq: SitemapEntry['changefreq'],
    priority: string,
    type: SitemapEntry['type'] = 'page'
  ) => {
    if (!rawPath) return;
    let cleanPath = rawPath.trim();
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      try {
        const u = new URL(cleanPath);
        cleanPath = u.pathname;
      } catch {
        return;
      }
    }
    cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const fullUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
    if (!addedUrls.has(fullUrl)) {
      addedUrls.add(fullUrl);
      entries.push({
        loc: fullUrl,
        lastmod: lastmod || nowIso,
        changefreq,
        priority,
        type
      });
    }
  };

  // 1. Core Landing & Company Pages
  addUrl('/', nowIso, 'daily', '1.0', 'page');
  addUrl('/bang-gia', nowIso, 'daily', '0.95', 'page');
  addUrl('/gioi-thieu', nowIso, 'weekly', '0.85', 'page');
  addUrl('/du-an', nowIso, 'weekly', '0.85', 'page');
  addUrl('/quy-trinh-san-xuat', nowIso, 'monthly', '0.85', 'page');
  addUrl('/ho-so-nang-luc', nowIso, 'monthly', '0.85', 'page');
  addUrl('/lien-he', nowIso, 'monthly', '0.90', 'page');
  addUrl('/tuyen-dung', nowIso, 'monthly', '0.60', 'page');
  addUrl('/dich-vu', nowIso, 'weekly', '0.85', 'page');
  addUrl('/linh-vuc-hoat-dong', nowIso, 'monthly', '0.80', 'page');

  // 2. Concrete Product & Pump Services
  Object.keys(SERVICES_DATABASE).forEach((serviceKey) => {
    addUrl(`/${serviceKey}`, nowIso, 'weekly', '0.90', 'page');
    addUrl(`/${serviceKey}.html`, nowIso, 'weekly', '0.85', 'page');
  });

  addUrl('/be-tong-tuoi', nowIso, 'weekly', '0.90', 'page');
  addUrl('/be-tong-thuong-pham', nowIso, 'weekly', '0.90', 'page');
  addUrl('/bom-be-tong', nowIso, 'weekly', '0.85', 'page');
  addUrl('/be-tong-sieu-nhe', nowIso, 'weekly', '0.80', 'page');
  addUrl('/be-tong-khi-chung-ap', nowIso, 'weekly', '0.80', 'page');
  addUrl('/be-tong-nhua', nowIso, 'weekly', '0.80', 'page');

  // 3. Blog Hub & Category Index Pages
  addUrl('/blog', nowIso, 'daily', '0.90', 'cat');
  const categories = getAllCategoriesServer();
  categories.forEach((cat) => {
    addUrl(`/blog/chuyen-muc/${cat.slug}`, nowIso, 'daily', '0.85', 'cat');
    addUrl(`/blog/${cat.slug}`, nowIso, 'daily', '0.85', 'cat');
  });

  // 4. Resolve ALL Blog Posts (Unified Server Storage)
  // Canonical URL structure requested by user: betongangiabinh.vn/bai-viet.html
  const allPosts = getAllPostsServer();
  allPosts.forEach((post) => {
    const postDate = post.date || nowIso;
    const cleanSlug = (post.slug || post.id || '').replace(/\.html$/, '');
    if (!cleanSlug) return;

    // Single Canonical URL for all articles: https://betongangiabinh.vn/bai-viet.html
    addUrl(`/${cleanSlug}.html`, postDate, 'weekly', '0.85', 'blog');
  });

  // 5. Resolve Projects (Unified Server Storage)
  const allProjects = getAllProjectsServer();
  allProjects.forEach((proj) => {
    const projDate = proj.date || nowIso;
    const slug = proj.slug || proj.id;
    if (slug) {
      addUrl(`/du-an/${slug}`, projDate, 'monthly', '0.75', 'project');
      addUrl(`/du-an/${slug}.html`, projDate, 'monthly', '0.70', 'project');
    }
  });

  // 6. Dynamic Site Pages (Unified Server Storage)
  const allPages = getAllPagesServer();
  allPages.forEach((p) => {
    if (p.slug && p.slug !== '/' && !p.slug.startsWith('http')) {
      const cleanSlug = p.slug.replace(/^\//, '').replace(/\.html$/, '');
      const isPolicy = cleanSlug.includes('chinh-sach') || cleanSlug.includes('dieu-khoan');
      const pageType = isPolicy ? 'policy' : 'page';
      addUrl(`/${cleanSlug}`, p.updatedAt || nowIso, 'weekly', '0.80', pageType);
      addUrl(`/${cleanSlug}.html`, p.updatedAt || nowIso, 'weekly', '0.75', pageType);
    }
  });

  const xmlEntries = entries
    .map((e) => {
      return `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
    <type>${e.type}</type>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
