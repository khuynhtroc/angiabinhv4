'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { useAppStore } from '@/lib/store';
import { getPostUrl, getCategoryUrl, resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import PageSeoHead from '@/components/PageSeoHead';
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Layers,
  Search,
  Phone,
  Flame,
  ArrowLeft
} from 'lucide-react';

interface CategoryDetailClientProps {
  cleanSlug: string;
}

const CANONICAL_CATEGORY_NAMES: Record<string, string> = {
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

export default function CategoryDetailClient({ cleanSlug }: CategoryDetailClientProps) {
  const { posts, categories } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất Cả');
  const [chatOpen, setChatOpen] = useState(false);

  // Match category from store or canonical dictionary
  const currentCategory = useMemo(() => {
    return categories.find((c) => {
      if (c.slug === cleanSlug || c.id === cleanSlug) return true;
      const normalizedName = (c.name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return normalizedName === cleanSlug;
    });
  }, [categories, cleanSlug]);

  const categoryTitle = useMemo(() => {
    if (currentCategory?.name) return currentCategory.name;
    if (CANONICAL_CATEGORY_NAMES[cleanSlug]) return CANONICAL_CATEGORY_NAMES[cleanSlug];
    return cleanSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }, [currentCategory, cleanSlug]);

  const categoryDesc = useMemo(() => {
    if (currentCategory?.description) return currentCategory.description;
    return `Tổng hợp các bài viết chuyên môn kỹ thuật, tiêu chuẩn chất lượng và bảng giá liên quan đến chuyên mục ${categoryTitle} từ đội ngũ kỹ sư Bê Tông An Gia Bình Ninh Bình.`;
  }, [currentCategory, categoryTitle]);

  // Filter posts belonging to this category
  const categoryPosts = useMemo(() => {
    return posts.filter((p) => {
      const postCatLower = (p.category || '').toLowerCase();
      const targetTitleLower = categoryTitle.toLowerCase();

      // Direct exact or partial match
      if (postCatLower === targetTitleLower) return true;
      if (postCatLower.includes(targetTitleLower) || targetTitleLower.includes(postCatLower)) return true;

      // Check against category slug or store name
      if (currentCategory && postCatLower.includes(currentCategory.name.toLowerCase())) return true;

      // Smart semantic mapping for unified 3 categories
      if (cleanSlug === 'tin-tuc' && (postCatLower.includes('báo giá') || postCatLower.includes('thị trường') || postCatLower.includes('tin') || postCatLower.includes('dự án'))) return true;
      if (cleanSlug === 'kinh-nghiem' && (postCatLower.includes('kinh nghiệm') || postCatLower.includes('thi công') || postCatLower.includes('cẩm nang') || postCatLower.includes('đổ bê tông'))) return true;
      if (cleanSlug === 'kien-thuc' && (postCatLower.includes('kỹ thuật') || postCatLower.includes('tiêu chuẩn') || postCatLower.includes('mác') || postCatLower.includes('thí nghiệm') || postCatLower.includes('kiến thức'))) return true;

      return false;
    });
  }, [posts, categoryTitle, currentCategory, cleanSlug]);

  // Sub-filter by search & tags
  const filteredPosts = useMemo(() => {
    return categoryPosts.filter((post) => {
      const matchesSearch =
        !searchTerm.trim() ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.focusKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTag = selectedTag === 'Tất Cả' || (post.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [categoryPosts, searchTerm, selectedTag]);

  // Tags in this category
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    categoryPosts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ['Tất Cả', ...Array.from(set)];
  }, [categoryPosts]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug={`/blog/${cleanSlug}`}
        title={`${categoryTitle} | Chuyên Mục Bê Tông Ninh Bình`}
        description={categoryDesc}
        type="website"
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Blog & Cẩm Nang', item: '/blog' },
          { name: categoryTitle, item: `/blog/${cleanSlug}` }
        ]}
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/blog" className="hover:text-slate-900 transition">
            Blog &amp; Cẩm Nang
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Chuyên mục</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-600 font-bold">{categoryTitle}</span>
        </div>
      </div>

      {/* Category Hero Banner */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Chuyên Mục Bê Tông Ninh Bình</span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-slate-600 lowercase">/blog/{cleanSlug}/</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {categoryTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
              {categoryDesc}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Chuyên mục chính:</span>
              <Link
                href="/blog"
                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Tất Cả ({posts.length})
              </Link>
              <Link
                href="/blog/tin-tuc"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  cleanSlug === 'tin-tuc'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tin Tức
              </Link>
              <Link
                href="/blog/kinh-nghiem"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  cleanSlug === 'kinh-nghiem'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Kinh Nghiệm
              </Link>
              <Link
                href="/blog/kien-thuc"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  cleanSlug === 'kien-thuc'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Kiến Thức
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Search & Tag filter bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Tìm bài trong chuyên mục ${categoryTitle}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:bg-white"
            />
          </div>

          {availableTags.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto text-xs">
              <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Chủ đề:</span>
              {availableTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap text-xs font-medium ${
                    selectedTag === tag
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tag === 'Tất Cả' ? 'Tất Cả' : `#${tag}`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Listing */}
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  Chưa có bài viết nào trong chuyên mục &ldquo;{categoryTitle}&rdquo;
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hiện chuyên mục này đang được cập nhật các bài viết kỹ thuật mới nhất. Quý khách vui lòng khám phá các chuyên mục khác hoặc xem tất cả bài viết.
                </p>
                <div className="pt-2">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Xem Tất Cả Bài Viết</span>
                  </Link>
                </div>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition duration-300 grid grid-cols-1 sm:grid-cols-12 group"
                >
                  <div className="sm:col-span-5 relative h-48 sm:h-auto overflow-hidden bg-slate-100">
                    <img
                      src={resolveMediaUrl(post.coverImage)}
                      alt={post.title}
                      onError={(e) => handleImageFallback(e, post.title || 'bê tông')}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-3 text-slate-400 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug mb-2">
                        <Link href={getPostUrl(post)}>{post.title}</Link>
                      </h2>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        /{post.slug || post.id}.html
                      </span>

                      <Link
                        href={getPostUrl(post)}
                        className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        <span>Chi tiết bài viết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Consultation Card */}
            <div className="bg-amber-50 text-slate-900 rounded-2xl p-6 border border-amber-200 space-y-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Phone className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Tư Vấn &amp; Báo Giá Bê Tông Ninh Bình 24/7
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ sư trạm trộn An Gia Bình (Trạm 1 KCN Khánh Phú &amp; Trạm 2 Kim Sơn) hỗ trợ đo đạc đường bồn, tính toán khối lượng và chiết khấu tốt nhất.
              </p>
              <a
                href="tel:0988266293"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <span>Gọi Ngay: 0988 2662 93</span>
              </a>
            </div>

            {/* Category Stats */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Thống Kê Chuyên Mục</span>
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">Tên chuyên mục:</span>
                  <strong className="text-slate-900">{categoryTitle}</strong>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">Đường dẫn chuẩn:</span>
                  <span className="font-mono text-amber-600 text-[11px]">/blog/{cleanSlug}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">Số lượng bài viết:</span>
                  <strong className="text-slate-900">{categoryPosts.length} bài</strong>
                </div>
              </div>
            </div>

            {/* Other Popular Articles */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Bài Viết Mới Nhất</span>
              </h4>
              <div className="space-y-2 text-xs">
                {posts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={getPostUrl(p)}
                    className="block p-2 rounded-lg hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition font-medium line-clamp-2"
                  >
                    • {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
