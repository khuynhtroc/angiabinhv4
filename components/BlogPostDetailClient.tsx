'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { useAppStore } from '@/lib/store';
import { getPostUrl, resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import ArticleContentWithToc from '@/components/ArticleContentWithToc';
import PageSeoHead from '@/components/PageSeoHead';
import { Calendar, Clock, ArrowLeft, Phone, ChevronRight, BookOpen, Layers } from 'lucide-react';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { BlogPost } from '@/lib/types';

const CATEGORY_MAP: Record<string, string> = {
  'tin-tuc': 'Tin Tức & Thị Trường',
  'kinh-nghiem': 'Kinh Nghiệm Thi Công',
  'kien-thuc': 'Kiến Thức Kỹ Thuật'
};

interface BlogPostDetailClientProps {
  rawSlug: string;
  initialPost?: BlogPost | null;
}

export default function BlogPostDetailClient({
  rawSlug,
  initialPost
}: BlogPostDetailClientProps) {
  const { posts, categories } = useAppStore();
  const [chatOpen, setChatOpen] = useState(false);

  const cleanSlug = (rawSlug || '').replace(/\.html$/, '');

  // 1. Check if an article post matches first
  const storePost = posts.find(
    (p) =>
      p.slug === cleanSlug ||
      p.id === cleanSlug ||
      p.slug === rawSlug ||
      p.id === rawSlug ||
      `${p.id}.html` === rawSlug ||
      `${p.slug}.html` === rawSlug
  );
  const post = storePost || initialPost || null;

  // 2. Category page check if no specific post matched
  const matchedCategory = categories.find(
    (c) => c.slug === cleanSlug || c.id === cleanSlug
  );
  const isCategory = !post && (
    Boolean(matchedCategory) ||
    ['tin-tuc', 'kinh-nghiem', 'kien-thuc'].includes(cleanSlug)
  );
  const categoryTitle = matchedCategory?.name || CATEGORY_MAP[cleanSlug] || 'Chuyên Mục';
  const categoryDesc = matchedCategory?.description || `Tổng hợp các bài viết chuyên sâu về ${categoryTitle.toLowerCase()} từ các kỹ sư trạm trộn và chuyên gia kết cấu Công ty TNHH Bê Tông An Gia Bình Ninh Bình.`;

  if (isCategory) {
    const categoryPosts = posts.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      if (matchedCategory) {
        if (pCat.includes(matchedCategory.name.toLowerCase()) || matchedCategory.name.toLowerCase().includes(pCat)) {
          return true;
        }
      }
      if (cleanSlug === 'tin-tuc') return pCat.includes('báo giá') || pCat.includes('thị trường') || pCat.includes('tin');
      if (cleanSlug === 'kinh-nghiem') return pCat.includes('kinh nghiệm') || pCat.includes('thi công');
      if (cleanSlug === 'kien-thuc') return pCat.includes('kỹ thuật') || pCat.includes('tiêu chuẩn');
      return false;
    });

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <PageSeoHead
          slug={`/blog/${cleanSlug}`}
          title={`${categoryTitle} | Chuyên Mục Bê Tông Ninh Bình`}
          description={categoryDesc}
          type="website"
          breadcrumbs={[
            { name: 'Trang Chủ', item: '/' },
            { name: 'Blog', item: '/blog' },
            { name: categoryTitle, item: `/blog/${cleanSlug}` }
          ]}
        />
        <Navbar />
        <RealtimeAnalyticsTracker />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-amber-600">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-amber-600">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-600 font-bold">{categoryTitle}</span>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Chuyên Mục Bê Tông Ninh Bình • /blog/{cleanSlug}/</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{categoryTitle}</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed text-justify [text-align-last:left]">
              {categoryDesc}
            </p>
            <div className="mt-4 text-xs font-semibold text-slate-500">
              Hiện có <span className="text-amber-600 font-bold">{categoryPosts.length}</span> bài viết trong chuyên mục này.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categoryPosts.length > 0 ? categoryPosts : posts).map((p) => (
              <article key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resolveMediaUrl(p.coverImage)}
                    alt={p.title}
                    onError={(e) => handleImageFallback(e, p.title || 'bê tông')}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    {p.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 mb-2 flex items-center gap-3">
                      <span>{p.date}</span>
                      <span>•</span>
                      <span>{p.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-2 mb-2">
                      <Link href={getPostUrl(p)}>{p.title}</Link>
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{p.excerpt}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={getPostUrl(p)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Đọc bài viết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
        <Footer />
        <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
        <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-24 px-4 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900">Không tìm thấy bài viết</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6">Bài viết này có thể đã được cập nhật hoặc thay đổi đường dẫn.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang danh sách Blog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = posts.filter((p) => p.id !== post.id).slice(0, 3);
  const articleTitle = post.title;
  const seoTitle = post.seoTitle || post.title;
  const finalTitle = seoTitle.includes('An Gia Bình') || seoTitle.includes('Bê Tông')
    ? seoTitle
    : `${seoTitle} | Bê Tông An Gia Bình`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug={`/blog/${cleanSlug}`}
        canonicalUrl={`https://betongangiabinh.vn/${post.slug || post.id}.html`}
        title={finalTitle}
        description={post.seoDescription || post.excerpt}
        keywords={post.focusKeywords}
        image={post.coverImage}
        type="article"
        author={post.author || 'Kỹ Sư Bê Tông An Gia Bình'}
        publishedTime={post.date}
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Kiến Thức & Blog', item: '/blog' },
          { name: post.title, item: `/blog/${cleanSlug}` }
        ]}
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 text-xs py-2.5 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2 text-slate-500 overflow-x-auto whitespace-nowrap text-[11px] sm:text-xs">
          <Link href="/" className="hover:text-slate-900 shrink-0">Trang Chủ</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/blog" className="hover:text-slate-900 shrink-0">Kiến Thức &amp; Blog</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-slate-900 font-medium truncate max-w-[180px] sm:max-w-none">{post.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow w-full">
        {/* Article Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 lg:p-10 border border-slate-200/90 shadow-2xs mb-6 sm:mb-8 space-y-4 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase shrink-0">
              {post.category}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight break-words">
            {articleTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Thời gian đọc: {post.readTime || '5 phút đọc'}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-700">Tác giả: {post.author || 'Kỹ Sư Bê Tông An Gia Bình'}</span>
          </div>

          {post.coverImage && (
            <div className="rounded-xl overflow-hidden pt-2">
              <img
                src={resolveMediaUrl(post.coverImage)}
                alt={post.title}
                onError={(e) => handleImageFallback(e, post.title || 'bê tông thương phẩm')}
                className="w-full h-72 sm:h-96 object-cover rounded-xl"
              />
            </div>
          )}

          {post.excerpt && (
            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-slate-800 text-sm font-medium leading-relaxed italic text-justify [text-align-last:left]">
              &ldquo;{post.excerpt}&rdquo;
            </div>
          )}
        </div>

        <ArticleContentWithToc content={post.content} />

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 mt-8">
          <div className="p-6 bg-amber-50 text-slate-900 rounded-2xl border border-amber-200 space-y-3">
            <div className="text-amber-800 font-extrabold text-sm uppercase tracking-wider">
              Liên Hệ Đặt Lịch Đổ Bê Tông Tươi Ninh Bình
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify [text-align-last:left]">
              Quý khách đang xây nhà hoặc thi công công trình tại Ninh Bình? Hãy liên hệ ngay với <strong>Bê Tông An Gia Bình</strong> để được kỹ sư đến tận nơi đo đạc và tư vấn mác bê tông tối ưu chi phí nhất!
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="tel:0988266293"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 animate-bounce" />
                <span>Hotline: 0988 2662 93 (24/7)</span>
              </a>
            </div>
          </div>

          {post.focusKeywords && post.focusKeywords.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-2">Từ khóa SEO bài viết:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {post.focusKeywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <TodaySearchKeywords post={post} />
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Bài Viết Kỹ Thuật Liên Quan</h3>
              <Link href="/blog" className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                <span>Xem tất cả bài viết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                      onError={(e) => handleImageFallback(e, r.title || 'bê tông')}
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
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} onOpenCalculator={() => { window.location.href = '/#concrete-calculator-section'; }} />
    </div>
  );
}
