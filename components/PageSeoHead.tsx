'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export interface PageSeoHeadProps {
  slug?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  author?: string;
  category?: string;
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

const SITE_NAME = 'Bê Tông An Gia Bình';
const BASE_URL = 'https://betongangiabinh.vn';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80';

export default function PageSeoHead({
  slug = '',
  defaultTitle,
  defaultDescription,
  title,
  description,
  keywords,
  image,
  canonicalUrl,
  type = 'website',
  author = 'Kỹ Sư Bê Tông An Gia Bình',
  category,
  publishedTime,
  modifiedTime,
  breadcrumbs
}: PageSeoHeadProps) {
  const { pages, jekyllConfig } = useAppStore();

  useEffect(() => {
    // 1. Resolve matching Custom SitePage if slug provided
    const normalizedSlug = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '';
    const matchedPage = normalizedSlug
      ? pages?.find((p) => p.slug === normalizedSlug || p.slug === slug || p.id === slug)
      : null;

    // 2. Resolve final Title
    let rawTitle =
      title ||
      defaultTitle ||
      matchedPage?.seoTitle ||
      matchedPage?.title ||
      jekyllConfig?.title ||
      SITE_NAME;

    // Append brand if not already present
    let finalTitle = rawTitle;
    if (!finalTitle.includes('An Gia Bình') && !finalTitle.includes('Bê Tông')) {
      finalTitle = `${rawTitle} | ${SITE_NAME}`;
    }
    if (finalTitle.length > 60) {
      finalTitle = finalTitle.substring(0, 57).trim() + '...';
    }

    // 3. Resolve final Description
    let finalDescription =
      description ||
      defaultDescription ||
      matchedPage?.seoDescription ||
      jekyllConfig?.description ||
      'Bê Tông An Gia Bình - Cung ứng bê tông tươi, bê tông thương phẩm, xe bơm cần 37m-56m tại Ninh Bình. Hotline: 0988 2662 93.';

    // Clamp between 120 and 158 chars to eliminate "Meta description too long" & "Meta description too short"
    if (finalDescription.length > 158) {
      finalDescription = finalDescription.substring(0, 155).trim() + '...';
    }

    // 4. Resolve Canonical URL & OG:URL
    // Luôn chuẩn hóa URL hiện tại của trang, tuyệt đối không thêm tiền tố thừa như /trang/
    let fullCanonicalUrl = canonicalUrl;
    if (fullCanonicalUrl) {
      // Loại bỏ tiền tố /trang/ nếu có trong dữ liệu cũ
      fullCanonicalUrl = fullCanonicalUrl.replace('betongangiabinh.vn/trang/', 'betongangiabinh.vn/');
      if (fullCanonicalUrl.endsWith('/gioi-thieu')) {
        fullCanonicalUrl = fullCanonicalUrl.replace('/gioi-thieu', '/about');
      }
    } else {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const cleanPath = path.replace(/^\/trang\//, '/');
        fullCanonicalUrl = `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
      } else if (normalizedSlug) {
        const cleanSlug = normalizedSlug.replace(/^\/trang\//, '/');
        fullCanonicalUrl = `${BASE_URL}${cleanSlug}`;
      } else {
        fullCanonicalUrl = BASE_URL;
      }
    }

    // 5. Resolve Image
    let finalImage = image || matchedPage?.ogImage || DEFAULT_IMAGE;
    if (finalImage && !finalImage.startsWith('http://') && !finalImage.startsWith('https://')) {
      finalImage = `${BASE_URL}${finalImage.startsWith('/') ? '' : '/'}${finalImage}`;
    }

    // 6. Resolve Keywords
    let finalKeywords = '';
    if (keywords) {
      finalKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    } else if (matchedPage?.seoKeywords) {
      finalKeywords = Array.isArray(matchedPage.seoKeywords)
        ? matchedPage.seoKeywords.join(', ')
        : matchedPage.seoKeywords;
    } else {
      finalKeywords = 'bê tông tươi ninh bình, trạm trộn an gia bình, giá bê tông tươi ninh bình, xe bơm bê tông ninh bình';
    }

    // --- APPLY TO DOM ---

    // Update document title
    if (finalTitle) {
      document.title = finalTitle;
    }

    // Helper to safely set meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to safely set link tags
    const setLinkTag = (rel: string, href: string) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard Meta
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'author', author);
    setLinkTag('canonical', fullCanonicalUrl);

    // Favicon & Logo Sync from Site Config
    if (jekyllConfig?.favicon) {
      setLinkTag('icon', jekyllConfig.favicon);
      setLinkTag('shortcut icon', jekyllConfig.favicon);
    }
    if (jekyllConfig?.logo) {
      setLinkTag('apple-touch-icon', jekyllConfig.logo);
    }

    // OpenGraph
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'vi_VN');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);
    setMetaTag('name', 'twitter:url', fullCanonicalUrl);

    // Article Specific Meta
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('property', 'article:published_time', publishedTime);
      }
      const finalModTime = modifiedTime || publishedTime;
      if (finalModTime) {
        setMetaTag('property', 'article:modified_time', finalModTime);
      }
      setMetaTag('property', 'article:author', author);
      setMetaTag('property', 'article:section', 'Xây Dựng & Bê Tông');
    }

    // JSON-LD Structured Data
    try {
      const jsonLdId = 'page-seo-jsonld';
      let scriptTag = document.getElementById(jsonLdId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = jsonLdId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const schemaData: any[] = [];

      // Article Schema if article
      if (type === 'article') {
        schemaData.push({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: finalTitle,
          description: finalDescription,
          image: [finalImage],
          datePublished: publishedTime || new Date().toISOString(),
          dateModified: modifiedTime || publishedTime || new Date().toISOString(),
          articleSection: category || 'Tin tức & Kỹ thuật',
          author: {
            '@type': 'Person',
            name: author,
            url: BASE_URL
          },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: `${BASE_URL}/images/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullCanonicalUrl
          }
        });
      }

      // BreadcrumbList Schema
      if (breadcrumbs && breadcrumbs.length > 0) {
        schemaData.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((bc, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: bc.name,
            item: bc.item.startsWith('http') ? bc.item : `${BASE_URL}${bc.item}`
          }))
        });
      }

      if (schemaData.length > 0) {
        scriptTag.text = JSON.stringify(schemaData.length === 1 ? schemaData[0] : schemaData);
      }
    } catch {}

  }, [
    slug,
    title,
    description,
    defaultTitle,
    defaultDescription,
    keywords,
    image,
    canonicalUrl,
    type,
    author,
    category,
    publishedTime,
    modifiedTime,
    breadcrumbs,
    pages,
    jekyllConfig
  ]);

  return null;
}
