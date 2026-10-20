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
  const validSegments = segments.filter(s => s && s !== '.html' && s !== 'html');

  // Case 1: Subfolder article /blog/tin-tuc/[slug].html
  if (validSegments.length >= 2 && validSegments[0] === 'tin-tuc') {
    const rawPostSlug = validSegments[1];
    const cleanPostSlug = decodeURIComponent(rawPostSlug).replace(/\/+\.html$/, '').replace(/\.html$/, '');
    const post = getPostBySlugServer(cleanPostSlug) || getPostBySlugServer(rawPostSlug);
    if (post) {
      const rawTitle = post.seoTitle || post.title;
      let finalTitle = rawTitle.includes('An Gia Bình') || rawTitle.includes('Bê Tông')
        ? rawTitle
        : `${rawTitle} | Bê Tông An Gia Bình`;
      if (finalTitle.length > 60) {
        finalTitle = finalTitle.substring(0, 57).trim() + '...';
      }
      let finalDesc = post.seoDescription || post.excerpt;
      if (finalDesc && finalDesc.length > 158) {
        finalDesc = finalDesc.substring(0, 155).trim() + '...';
      }
      const canonicalUrl = `https://www.betongangiabinh.vn/blog/tin-tuc/${post.slug || cleanPostSlug}.html`;

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
  }

  const rawSlug = validSegments[validSegments.length - 1] || segments[segments.length - 1] || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\/+\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '');

  // Case 2: Category listing /blog/[category]
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

  // Case 3: Single post legacy /blog/[slug].html
  const post = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (post) {
    const isNews = post.category === 'Tin Tức & Thị Trường' || post.category === 'tin-tuc' || post.isTrendingNews || post.permalink?.includes('/blog/tin-tuc/');
    const canonicalUrl = isNews
      ? `https://www.betongangiabinh.vn/blog/tin-tuc/${post.slug || post.id}.html`
      : `https://www.betongangiabinh.vn/${post.slug || post.id}.html`;

    const rawTitle = post.seoTitle || post.title;
    let finalTitle = rawTitle.includes('An Gia Bình') || rawTitle.includes('Bê Tông')
      ? rawTitle
      : `${rawTitle} | Bê Tông An Gia Bình`;
    if (finalTitle.length > 60) {
      finalTitle = finalTitle.substring(0, 57).trim() + '...';
    }

    return {
      title: finalTitle,
      description: post.seoDescription || post.excerpt,
      keywords: post.focusKeywords,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: finalTitle,
        description: post.seoDescription || post.excerpt,
        url: canonicalUrl,
        type: 'article',
        publishedTime: post.date,
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
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
  const validSegments = segments.filter(s => s && s !== '.html' && s !== 'html');

  // Case 1: Subfolder article /blog/tin-tuc/[slug].html -> Render directly without redirect!
  if (validSegments.length >= 2 && validSegments[0] === 'tin-tuc') {
    const rawPostSlug = validSegments[1];
    const cleanPostSlug = decodeURIComponent(rawPostSlug).replace(/\/+\.html$/, '').replace(/\.html$/, '');
    const initialPost = getPostBySlugServer(cleanPostSlug) || getPostBySlugServer(rawPostSlug);
    return <BlogPostDetailClient rawSlug={rawPostSlug} initialPost={initialPost} />;
  }

  const rawSlug = validSegments[validSegments.length - 1] || segments[segments.length - 1] || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\/+\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '');

  // Case 2: Category route (/blog/tin-tuc, /blog/kinh-nghiem, etc.)
  if (isCategorySlug(cleanSlug)) {
    return <CategoryDetailClient cleanSlug={cleanSlug} />;
  }

  // Case 3: Other blog posts visited via /blog/[slug].html
  const initialPost = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (initialPost) {
    const isNews = initialPost.category === 'Tin Tức & Thị Trường' || initialPost.category === 'tin-tuc' || initialPost.isTrendingNews || initialPost.permalink?.includes('/blog/tin-tuc/');
    if (isNews) {
      redirect(`/blog/tin-tuc/${initialPost.slug || cleanSlug}.html`);
    } else {
      const targetSlug = (initialPost.slug || initialPost.id || cleanSlug).replace(/\.html$/, '');
      redirect(`/${targetSlug}.html`);
    }
  }

  return <BlogPostDetailClient rawSlug={rawSlug} initialPost={initialPost} />;
}
