import { NextResponse } from 'next/server';
import { getAllPostsServer, getConfigServer } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Ensures safe content inside XML CDATA blocks.
 * 1. Filters out XML 1.0 invalid control characters (0x00-0x08, 0x0B-0x0C, 0x0E-0x1F)
 * 2. Escapes any accidental ]]> occurrences so it cannot prematurely close CDATA
 */
function safeCdata(content: string): string {
  if (!content) return '';
  const clean = content.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
  return clean.replace(/\]\]>/g, ']]]]><![CDATA[>');
}

/**
 * Creates a clean, concise excerpt for RSS readers
 */
function cleanExcerptText(raw: string, fallback = ''): string {
  const source = raw || fallback || '';
  const text = source
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\{%[^%]*%\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 320 ? `${text.substring(0, 317)}...` : text;
}

export async function GET() {
  const baseUrl = 'https://betongangiabinh.vn';
  const buildDate = new Date().toUTCString();

  // Load config to dynamically synchronize website logo and favicon
  const config = getConfigServer();
  const rawLogo = config.logo || '/logo.png';
  const logoUrl = rawLogo.startsWith('http') ? rawLogo : `${baseUrl}${rawLogo}`;

  // Load all posts from unified server data source
  const allPosts = getAllPostsServer();

  // Sort posts by date descending so newest posts always appear first
  const sortedPosts = [...allPosts].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  const itemsXml = sortedPosts
    .filter((post) => {
      const cleanSlug = (post.slug || post.id || '').replace(/\.html$/, '');
      return cleanSlug && cleanSlug !== 'bai-viet';
    })
    .map((post) => {
      // Canonical article URL: betongangiabinh.vn/[slug].html
      const cleanSlug = (post.slug || post.id || '').replace(/\.html$/, '');
      const postUrl = `${baseUrl}/${cleanSlug}.html`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate;
      const cleanExcerpt = cleanExcerptText(post.excerpt, post.content);
      const cleanContent = post.content || post.excerpt || '';
      const author = post.author || 'Kỹ Sư Bê Tông An Gia Bình';
      const category = post.category || 'Kiến Thức Kỹ Thuật';
      const imageUrl = post.coverImage || `${baseUrl}/logo.png`;

      return `    <item>
      <title><![CDATA[${safeCdata(post.title)}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${safeCdata(category)}]]></category>
      <dc:creator><![CDATA[${safeCdata(author)}]]></dc:creator>
      <description><![CDATA[${safeCdata(cleanExcerpt)}]]></description>
      <content:encoded><![CDATA[${safeCdata(cleanContent)}]]></content:encoded>
      <enclosure url="${escapeXml(imageUrl)}" length="102400" type="image/jpeg" />
      <media:content url="${escapeXml(imageUrl)}" medium="image">
        <media:title><![CDATA[${safeCdata(post.title)}]]></media:title>
      </media:content>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Bê Tông An Gia Bình - Tin Tức &amp; Kỹ Thuật Bê Tông Tươi Ninh Bình</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Kênh thông tin cập nhật liên tục tất cả các bài viết mới nhất: bảng giá bê tông thương phẩm, cẩm nang thi công móng dầm sàn, tiêu chuẩn kiểm định TCVN và tiến độ các dự án tại Ninh Bình.</description>
    <language>vi-VN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>ketoan.angiabinh@gmail.com (Bê Tông An Gia Bình)</managingEditor>
    <webMaster>ketoan.angiabinh@gmail.com (Bộ Phận Kỹ Thuật)</webMaster>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>An Gia Bình Concrete Next.js Engine</generator>
    <image>
      <url>${escapeXml(logoUrl)}</url>
      <title>Bê Tông An Gia Bình</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
