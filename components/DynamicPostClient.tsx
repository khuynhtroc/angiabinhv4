'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { useAppStore } from '@/lib/store';
import { getPostUrl, resolveMediaUrl } from '@/lib/utils';
import ArticleContentWithToc from '@/components/ArticleContentWithToc';
import PageSeoHead from '@/components/PageSeoHead';
import ServiceDetailView, { SERVICES_DATABASE, SLUG_ALIASES } from '@/components/ServiceDetailView';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { BlogPost, SitePage } from '@/lib/types';
import {
  Calendar, Clock, Tag, ArrowLeft, Phone, Share2, Check,
  ChevronRight, BookOpen, CheckCircle, Sparkles, HelpCircle,
  Mail, MapPin, Layers
} from 'lucide-react';

import NotFoundRedirect from '@/components/NotFoundRedirect';

interface DynamicPostClientProps {
  postSlug: string;
  initialPost?: BlogPost | null;
  initialPage?: SitePage | null;
}

export default function DynamicPostClient({
  postSlug: rawSlug,
  initialPost,
  initialPage
}: DynamicPostClientProps) {
  const { posts, pages, jekyllConfig } = useAppStore();

  const [chatOpen, setChatOpen] = useState(false);

  // Match by id, slug, or with .html
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');

  const storePost = posts.find(
    (p) =>
      p.id === cleanSlug ||
      p.slug === cleanSlug ||
      p.id === rawSlug ||
      p.slug === rawSlug ||
      `${p.id}.html` === rawSlug ||
      `${p.slug}.html` === rawSlug
  );
  const post = storePost || initialPost || null;

  // If not a blog post, check if it matches a custom SitePage created in Admin
  const storeCustomPage = !post
    ? pages?.find(
        (p) =>
          p.slug === `/${cleanSlug}` ||
          p.slug === cleanSlug ||
          p.id === cleanSlug ||
          p.slug === `/${rawSlug}` ||
          p.slug === rawSlug
      )
    : null;
  const customPage = storeCustomPage || initialPage || null;

  // Check if it matches a Service page (e.g. /be-tong-tuoi.html or /be-tong-thuong)
  const isServiceSlug = !post && !customPage && (SERVICES_DATABASE[cleanSlug] || SLUG_ALIASES[cleanSlug]);
  if (isServiceSlug) {
    return <ServiceDetailView slugKey={cleanSlug} />;
  }

  // Render Custom SitePage if matched
  if (customPage) {
    const pageTitle = customPage.seoTitle || customPage.title;
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <PageSeoHead
          slug={customPage.slug}
          title={pageTitle.includes('An Gia Bình') ? pageTitle : `${pageTitle} | Bê Tông An Gia Bình`}
          description={customPage.seoDescription || customPage.summary || customPage.subtitle || ''}
        />
        <RealtimeAnalyticsTracker />
        <Navbar />

        {/* Page Hero Header */}
        <div className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-500/30">
                <Layers className="w-3.5 h-3.5" />
                <span>Trang Thông Tin Website</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {customPage.title}
              </h1>
              {customPage.seoDescription && (
                <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                  {customPage.seoDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Page Sections Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full space-y-12">
          {customPage.sections && customPage.sections.length > 0 ? (
            customPage.sections.map((section) => {
              if (section.type === 'hero') {
                return (
                  <div key={section.id} className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">{section.title}</h2>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{section.content}</p>
                  </div>
                );
              }
              if (section.type === 'features') {
                return (
                  <div key={section.id} className="space-y-6">
                    {section.title && (
                      <h2 className="text-2xl font-black text-slate-900 border-l-4 border-amber-500 pl-4">{section.title}</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(section.items || []).map((item, idx) => {
                        const itemTitle = typeof item === 'string' ? item : item.title;
                        const itemDesc = typeof item === 'string' ? '' : item.description;
                        return (
                          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-3" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{itemTitle}</h3>
                            {itemDesc && <p className="text-sm text-slate-600 leading-relaxed">{itemDesc}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              if (section.type === 'cta') {
                return (
                  <div key={section.id} className="bg-linear-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black">{section.title}</h3>
                      <p className="text-sm sm:text-base font-medium text-slate-900 mt-2">{section.content}</p>
                    </div>
                    <a
                      href="tel:0988266293"
                      className="bg-slate-950 text-amber-400 font-black px-8 py-4 rounded-2xl text-base shadow-lg hover:bg-slate-900 transition flex items-center gap-3 shrink-0"
                    >
                      <Phone className="w-5 h-5 text-amber-400" />
                      <span>0988 2662 93</span>
                    </a>
                  </div>
                );
              }
              return (
                <div key={section.id} className="prose prose-slate max-w-none bg-white p-8 rounded-3xl border border-slate-200">
                  {section.title && <h2>{section.title}</h2>}
                  <div className="whitespace-pre-line text-slate-700">{section.content}</div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: customPage.content || '<p>Nội dung trang đang được cập nhật...</p>' }}
              />
            </div>
          )}
        </main>

        <Footer />
        <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
        <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      </div>
    );
  }

  // Not found fallback
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <PageSeoHead
          slug={`/${rawSlug}`}
          title="Không tìm thấy bài viết | Bê Tông An Gia Bình"
          description="Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật đường dẫn mới."
        />
        <Navbar />
        <NotFoundRedirect
          itemType="bài viết"
          slug={rawSlug}
          targetUrl="/"
          targetName="Trang Chủ"
        />
        <Footer />
      </div>
    );
  }

  // Related posts (expanded to 6 to strengthen internal link mesh and prevent orphan pages)
  const relatedPosts = posts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.category))
    .slice(0, 6);

  // Article Title & SEO Title
  const articleTitle = post.title;
  const seoTitle = post.seoTitle || post.title;
  const finalTitle = seoTitle.includes('An Gia Bình') || seoTitle.includes('Bê Tông')
    ? seoTitle
    : `${seoTitle} | Bê Tông An Gia Bình`;

  const canonicalUrl = `https://www.betongangiabinh.vn/${cleanSlug}.html`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug={`/${cleanSlug}.html`}
        title={finalTitle}
        description={post.seoDescription || post.excerpt}
        image={post.coverImage}
        type="article"
        publishedTime={post.date}
        author={post.author || 'Kỹ Sư Bê Tông An Gia Bình'}
        category={post.category}
        keywords={post.focusKeywords || ['bê tông tươi ninh bình', 'bê tông an gia bình']}
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Tin Tức & Kỹ Thuật', item: '/blog' },
          { name: post.category || 'Bài Viết', item: `/blog` },
          { name: post.title, item: `/${cleanSlug}.html` }
        ]}
      />

      <RealtimeAnalyticsTracker />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-amber-600 transition">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/blog" className="hover:text-amber-600 transition">Tin Tức &amp; Kỹ Thuật</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-amber-700 font-semibold">{post.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-medium truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Back Link & Category Badge */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh mục bài viết</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              .html
            </span>
          </div>
        </div>

        {/* Article Headline - H1 */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          {articleTitle}
        </h1>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pb-6 border-b border-slate-200 mb-6">
          {post.author && (
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              {post.author}
            </span>
          )}
          {post.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {post.readTime || '5 phút đọc'}
          </span>
          {post.views !== undefined && (
            <span className="text-slate-400">
              {post.views.toLocaleString('vi-VN')} lượt xem
            </span>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm border border-slate-200 bg-slate-100 aspect-16/9 sm:aspect-21/9 relative">
            <img
              src={resolveMediaUrl(post.coverImage)}
              alt={post.title}
              width={1200}
              height={514}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Lead Paragraph */}
        {post.excerpt && (
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-xl mb-8 text-slate-800 text-sm sm:text-base font-medium leading-relaxed italic">
            {post.excerpt}
          </div>
        )}

        {/* Dynamic Table of Contents + Body Content */}
        <ArticleContentWithToc content={post.content} />

        {/* Focus Keywords / Tags */}
        {(post.focusKeywords?.length || post.tags?.length) ? (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Từ khóa tra cứu liên quan:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...(post.focusKeywords || []), ...(post.tags || [])]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((kw, idx) => (
                  <Link
                    key={idx}
                    href={`/blog?tag=${encodeURIComponent(kw)}`}
                    className="bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs px-3 py-1 rounded-full transition"
                  >
                    #{kw}
                  </Link>
                ))}
            </div>
          </div>
        ) : null}

        {/* Trending Keywords Component */}
        <TodaySearchKeywords />

        {/* Concrete Order Call-to-Action Bar */}
        <div className="mt-10 bg-linear-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <span className="text-amber-400 font-extrabold uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {jekyllConfig?.title || "Bê Tông An Gia Bình Ninh Bình"}
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white mt-1">
              {jekyllConfig?.ctaHeading || "Cần Báo Giá & Khảo Sát Bê Tông Mác 200 - 450?"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {jekyllConfig?.ctaSubheading || "Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Kim Sơn (150m³/h) sẵn sàng phục vụ 24/7."}
            </p>
          </div>
          <a
            href={jekyllConfig?.ctaButtonLink || "tel:0988266293"}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-sm flex items-center gap-2 shrink-0 transition shadow-sm"
          >
            <Phone className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>{jekyllConfig?.ctaButtonText || "0988 2662 93"}</span>
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Bài Viết Kỹ Thuật Liên Quan</h3>
              <Link href="/blog" className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                <span>Xem tất cả bài viết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={getPostUrl(r)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition group flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={resolveMediaUrl(r.coverImage)}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition line-clamp-2 leading-snug">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {r.excerpt}
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span>{r.date}</span>
                      <span className="text-amber-700 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                        Đọc tiếp &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
