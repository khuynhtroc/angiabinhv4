import type { Metadata } from 'next';
import { getPostBySlugServer, getAllCategoriesServer } from '@/lib/server-data';
import BlogPostDetailClient from '@/components/BlogPostDetailClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const CATEGORY_MAP: Record<string, string> = {
  'tin-tuc': 'Tin Tức & Thị Trường',
  'kinh-nghiem': 'Kinh Nghiệm Thi Công',
  'kien-thuc': 'Kiến Thức Kỹ Thuật'
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugSegments } = await params;
  const segments = Array.isArray(slugSegments) ? slugSegments : [slugSegments];
  const rawSlug = segments[segments.length - 1] || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');

  const post = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (post) {
    const rawTitle = post.seoTitle || post.title;
    const finalTitle = rawTitle.includes('An Gia Bình') || rawTitle.includes('Bê Tông')
      ? rawTitle
      : `${rawTitle} | Bê Tông An Gia Bình`;
    const finalDesc = post.seoDescription || post.excerpt;
    const canonicalUrl = `https://betongangiabinh.vn/${post.slug || post.id}.html`;

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: post.focusKeywords,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        url: canonicalUrl,
        type: 'article',
        publishedTime: post.date,
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
        images: post.coverImage ? [post.coverImage] : undefined,
      }
    };
  }

  // Check category
  const categories = getAllCategoriesServer();
  const matchedCategory = categories.find((c) => c.slug === cleanSlug || c.id === cleanSlug);
  if (matchedCategory || CATEGORY_MAP[cleanSlug]) {
    const catName = matchedCategory?.name || CATEGORY_MAP[cleanSlug];
    return {
      title: `${catName} | Chuyên Mục Bê Tông Ninh Bình - An Gia Bình`,
      description: matchedCategory?.description || `Tổng hợp các bài viết chuyên sâu về ${catName} tại Ninh Bình.`,
    };
  }

  return {
    title: `${cleanSlug.replace(/-/g, ' ')} | Blog Bê Tông An Gia Bình`,
    description: 'Chuyên trang chia sẻ kinh nghiệm, báo giá và kỹ thuật đổ bê tông tươi tại Ninh Bình.',
  };
}

export default async function BlogPostCatchAllPage({ params }: PageProps) {
  const { slug: slugSegments } = await params;
  const segments = Array.isArray(slugSegments) ? slugSegments : [slugSegments];
  const rawSlug = segments[segments.length - 1] || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');
  const initialPost = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);

  return <BlogPostDetailClient rawSlug={rawSlug} initialPost={initialPost} />;
}
