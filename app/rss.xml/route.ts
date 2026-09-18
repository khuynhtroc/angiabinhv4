import { NextResponse } from 'next/server';
import { getAllPostsServer } from '@/lib/server-data';

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

export async function GET() {
  const baseUrl = 'https://betongangiabinh.vn';
  const buildDate = new Date().toUTCString();

  // Load all posts from the unified server data source
  const allPosts = getAllPostsServer();

  // Sort posts by date descending so the newest posts always appear first
  const sortedPosts = [...allPosts].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  const itemsXml = sortedPosts
    .map((post) => {
      // Canonical article URL: betongangiabinh.vn/bai-viet.html
      const cleanSlug = (post.slug || post.id || '').replace(/\.html$/, '');
      const postUrl = `${baseUrl}/${cleanSlug}.html`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate;
      const cleanExcerpt = post.excerpt || '';
      const cleanContent = post.content || cleanExcerpt;
      const author = post.author || 'Kỹ Sư Bê Tông An Gia Bình';
      const category = post.category || 'Kiến Thức Kỹ Thuật';
      const imageUrl = post.coverImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80';

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${category}]]></category>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <description><![CDATA[${cleanExcerpt}]]></description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      <enclosure url="${escapeXml(imageUrl)}" length="102400" type="image/jpeg" />
      <media:content url="${escapeXml(imageUrl)}" medium="image">
        <media:title><![CDATA[${post.title}]]></media:title>
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
      <url>https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=400&amp;auto=format&amp;fit=crop&amp;q=80</url>
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
