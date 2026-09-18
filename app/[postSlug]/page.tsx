import type { Metadata } from 'next';
import { getPostBySlugServer, getPageBySlugServer } from '@/lib/server-data';
import { SERVICES_DATABASE, SLUG_ALIASES } from '@/components/ServiceDetailView';
import DynamicPostClient from '@/components/DynamicPostClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ postSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const rawSlug = postSlug || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');

  // 1. Check if it's a Blog Post
  const post = getPostBySlugServer(cleanSlug) || getPostBySlugServer(rawSlug);
  if (post) {
    const rawTitle = post.seoTitle || post.title;
    const finalTitle = rawTitle.includes('An Gia Bình') || rawTitle.includes('Bê Tông')
      ? rawTitle
      : `${rawTitle} | Bê Tông An Gia Bình`;
    const finalDesc = post.seoDescription || post.excerpt || 'Bê tông tươi, bê tông thương phẩm chất lượng cao Ninh Bình.';
    const canonicalUrl = `https://betongangiabinh.vn/${cleanSlug}.html`;

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: post.focusKeywords || ['bê tông tươi ninh bình', 'bê tông an gia bình'],
      alternates: {
        canonical: canonicalUrl,
      },
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

  // 2. Check if it's a Service Page (from SERVICES_DATABASE)
  const serviceKey = SLUG_ALIASES[cleanSlug] || cleanSlug;
  const service = SERVICES_DATABASE[serviceKey];
  if (service) {
    const finalTitle = `${service.title} | Bê Tông An Gia Bình Ninh Bình`;
    const finalDesc = service.description;
    const canonicalUrl = `https://betongangiabinh.vn/${cleanSlug}.html`;
    return {
      title: finalTitle,
      description: finalDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        url: canonicalUrl,
      }
    };
  }

  // 3. Check if it's a Dynamic Custom Page
  const page = getPageBySlugServer(cleanSlug);
  if (page) {
    const rawTitle = page.seoTitle || page.title;
    const finalTitle = rawTitle.includes('An Gia Bình') ? rawTitle : `${rawTitle} | Bê Tông An Gia Bình`;
    const finalDesc = page.seoDescription || page.summary || page.subtitle || '';
    return {
      title: finalTitle,
      description: finalDesc,
      alternates: { canonical: `https://betongangiabinh.vn/${cleanSlug}.html` },
    };
  }

  return {
    title: `${cleanSlug.replace(/-/g, ' ')} | Bê Tông An Gia Bình`,
    description: 'Công ty TNHH Bê Tông An Gia Bình - Cung cấp bê tông tươi, bê tông thương phẩm tại Ninh Bình.',
  };
}

export default async function DynamicPostHtmlPage({ params }: PageProps) {
  const { postSlug } = await params;
  const cleanSlug = decodeURIComponent(postSlug || '').replace(/\.html$/, '');

  const initialPost = getPostBySlugServer(cleanSlug) || getPostBySlugServer(postSlug);
  const initialPage = !initialPost ? getPageBySlugServer(cleanSlug) : null;

  return (
    <DynamicPostClient
      postSlug={postSlug}
      initialPost={initialPost}
      initialPage={initialPage}
    />
  );
}
