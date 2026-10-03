import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPostBySlugServer, getAllCategoriesServer } from '@/lib/server-data';
import BlogPostDetailClient from '@/components/BlogPostDetailClient';
import CategoryDetailClient from '@/components/CategoryDetailClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const CATEGORY_MAP: Record<string, string> = {
  'tin-tuc': 'Tin Tức & Thị Trường',
  'kinh-nghiem': 'Kinh Nghiệm Thi Công',
  'kien-thuc': 'Kiến Thức Kỹ Thuật',
  'bao-gia': 'Báo Giá & Thị Trường',
  'bao-gia-thi-truong': 'Báo Giá & Thị Trường',
  'ky-thuat-thi-cong': 'Kỹ Thuật Thi Công',
  'tieu-chuan-chat-luong': 'Tiêu Chuẩn Chất Lượng',
  'cam-nang-xay-dung': 'Cẩm Nang Xây Dựng',
  'du-an-tieu-bieu': 'Dự Án Tiêu Biểu'
};

function isCategorySlug(slug: string): boolean {
  const clean = slug.toLowerCase().replace(/\.html$/, '');
  if (CATEGORY_MAP[clean]) return true;
  const categories = getAllCategoriesServer();
  return categories.some((c) => c.slug === clean || c.id === clean);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugSegments } = await params;
  const segments = Array.isArray(slugSegments) ? slugSegments : [slugSegments];
  const rawSlug = segments[segments.length - 1] || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');

  // 1. Check if category
  if (isCategorySlug(cleanSlug)) {
    const categories = getAllCategoriesServer();
    const matchedCategory = categories.find((c) => c.slug === cleanSlug || c.id === cleanSlug);
    const catName = matchedCategory?.name || CATEGORY_MAP[cleanSlug] || cleanSlug;
    const catDesc = matchedCategory?.description || `Tổng hợp các bài viết chuyên môn kỹ thuật, tiêu chuẩn chất lượng và bảng giá liên quan đến ${catName} từ đội ngũ kỹ sư Bê Tông An Gia Bình Ninh Bình.`;
    const canonicalUrl = `https://www.betongangiabinh.vn/blog/${cleanSlug}`;

    return {
      title: `${catName} | Chuyên Mục Bê Tông Ninh Bình - An Gia Bình`,
      description: catDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${catName} | Chuyên Mục Bê Tông Ninh Bình`,
        description: catDesc,
        url: canonicalUrl,
        type: 'website',
      }
    };
  }

  const post = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (post) {
    const rawTitle = post.seoTitle || post.title;
    const finalTitle = rawTitle.includes('An Gia Bình') || rawTitle.includes('Bê Tông')
      ? rawTitle
      : `${rawTitle} | Bê Tông An Gia Bình`;
    const finalDesc = post.seoDescription || post.excerpt;
    const canonicalUrl = `https://www.betongangiabinh.vn/${post.slug || post.id}.html`;

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

  if (isCategorySlug(cleanSlug)) {
    return <CategoryDetailClient cleanSlug={cleanSlug} />;
  }

  const initialPost = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (initialPost) {
    const targetSlug = (initialPost.slug || initialPost.id || cleanSlug).replace(/\.html$/, '');
    redirect(`/${targetSlug}.html`);
  }

  return <BlogPostDetailClient rawSlug={rawSlug} initialPost={initialPost} />;
}
