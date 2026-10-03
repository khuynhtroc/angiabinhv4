'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import { useAppStore } from '@/lib/store';
import { BlogPost } from '@/lib/types';
import { getPostUrl, getCategorySlug, getPostBlogUrl, resolveMediaUrl, handleImageFallback, cleanExcerptText } from '@/lib/utils';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Flame,
  Phone,
  Folder,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Sparkles
} from 'lucide-react';

interface PostVisualVariant {
  imageHeight: string;
  imageAspect: string;
  titleSize: string;
  titleClamp: string;
  descSize: string;
  descClamp: string;
  badgeBg: string;
  accentBorder: string;
}

const VARIANTS: PostVisualVariant[] = [
  {
    imageHeight: 'h-44 sm:h-48',
    imageAspect: 'aspect-[16/10]',
    titleSize: 'text-base sm:text-lg font-bold leading-snug',
    titleClamp: 'line-clamp-2',
    descSize: 'text-xs text-slate-600 leading-relaxed',
    descClamp: 'line-clamp-3',
    badgeBg: 'bg-amber-500 text-slate-950',
    accentBorder: 'hover:border-amber-400',
  },
  {
    imageHeight: 'h-60 sm:h-64',
    imageAspect: 'aspect-[4/3]',
    titleSize: 'text-lg sm:text-xl font-black leading-tight tracking-tight',
    titleClamp: 'line-clamp-2',
    descSize: 'text-sm text-slate-600 leading-relaxed font-normal',
    descClamp: 'line-clamp-2',
    badgeBg: 'bg-emerald-600 text-white',
    accentBorder: 'hover:border-emerald-400',
  },
  {
    imageHeight: 'h-36 sm:h-40',
    imageAspect: 'aspect-[16/9]',
    titleSize: 'text-sm sm:text-base font-extrabold leading-snug',
    titleClamp: 'line-clamp-3',
    descSize: 'text-xs text-slate-500 leading-normal',
    descClamp: 'line-clamp-4',
    badgeBg: 'bg-blue-600 text-white',
    accentBorder: 'hover:border-blue-400',
  },
  {
    imageHeight: 'h-52 sm:h-56',
    imageAspect: 'aspect-[5/4]',
    titleSize: 'text-xl sm:text-2xl font-black leading-tight tracking-tight',
    titleClamp: 'line-clamp-2',
    descSize: 'text-[13px] text-slate-600 leading-relaxed',
    descClamp: 'line-clamp-3',
    badgeBg: 'bg-indigo-600 text-white',
    accentBorder: 'hover:border-indigo-400',
  },
  {
    imageHeight: 'h-48 sm:h-52',
    imageAspect: 'aspect-[3/2]',
    titleSize: 'text-base sm:text-lg font-extrabold leading-tight',
    titleClamp: 'line-clamp-2',
    descSize: 'text-xs text-slate-500 leading-relaxed italic',
    descClamp: 'line-clamp-2',
    badgeBg: 'bg-rose-600 text-white',
    accentBorder: 'hover:border-rose-400',
  },
  {
    imageHeight: 'h-64 sm:h-72',
    imageAspect: 'aspect-[1/1]',
    titleSize: 'text-lg sm:text-xl font-bold leading-snug',
    titleClamp: 'line-clamp-3',
    descSize: 'text-sm text-slate-600 leading-normal',
    descClamp: 'line-clamp-3',
    badgeBg: 'bg-amber-600 text-white',
    accentBorder: 'hover:border-amber-500',
  },
  {
    imageHeight: 'h-40 sm:h-44',
    imageAspect: 'aspect-[2/1]',
    titleSize: 'text-base sm:text-lg font-black leading-tight',
    titleClamp: 'line-clamp-2',
    descSize: 'text-xs text-slate-600 leading-relaxed',
    descClamp: 'line-clamp-4',
    badgeBg: 'bg-teal-600 text-white',
    accentBorder: 'hover:border-teal-400',
  },
];

function getVariantForPost(post: BlogPost, index: number): PostVisualVariant {
  const seed = (post.id + (post.slug || '')).split('').reduce((acc, c) => acc + c.charCodeAt(0), index * 31);
  return VARIANTS[seed % VARIANTS.length];
}

function BlogListInner() {
  const { posts, categories } = useAppStore();
  const searchParams = useSearchParams();
  const catParam = searchParams?.get('category') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất Cả');
  const [overrideCategory, setOverrideCategory] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'views' | 'title'>('latest');

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);

  const selectedCategory = overrideCategory !== null ? overrideCategory : (catParam || 'Tất Cả');

  const allTags = ['Tất Cả', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  // Helper to extract timestamp from post (checks updatedAt, id timestamp, or publish date)
  const getPostTimestamp = (p: BlogPost): number => {
    if (p.updatedAt) {
      const t = new Date(p.updatedAt).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const match = (p.id || '').match(/post-(\d{10,13})/);
    if (match) {
      const idTime = parseInt(match[1], 10);
      if (!isNaN(idTime) && idTime > 0) return idTime;
    }
    if (p.date) {
      const t = new Date(p.date).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    return 0;
  };

  // Sắp xếp bài viết theo tuỳ chọn (Mặc định: Ngày đăng & thời gian tạo MỚI NHẤT)
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'latest') {
      const timeA = getPostTimestamp(a);
      const timeB = getPostTimestamp(b);
      if (timeB !== timeA) return timeB - timeA;
      return (b.date || '').localeCompare(a.date || '');
    }
    if (sortBy === 'oldest') {
      const timeA = getPostTimestamp(a);
      const timeB = getPostTimestamp(b);
      if (timeA !== timeB) return timeA - timeB;
      return (a.date || '').localeCompare(b.date || '');
    }
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '', 'vi');
    }
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (Array.isArray(post.focusKeywords) && post.focusKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTag = selectedTag === 'Tất Cả' || post.tags.includes(selectedTag);
    const matchesCategory = selectedCategory === 'Tất Cả' || 
                            post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                            categories.some(c => (c.slug === selectedCategory || c.name === selectedCategory) && c.name.toLowerCase() === post.category.toLowerCase()) ||
                            (selectedCategory === 'tin-tuc' && (post.category.toLowerCase().includes('tin tức') || post.category.toLowerCase().includes('thị trường'))) ||
                            (selectedCategory === 'kinh-nghiem' && (post.category.toLowerCase().includes('kinh nghiệm') || post.category.toLowerCase().includes('kỹ thuật'))) ||
                            (selectedCategory === 'kien-thuc' && (post.category.toLowerCase().includes('kiến thức') || post.category.toLowerCase().includes('tiêu chuẩn')));
    return matchesSearch && matchesTag && matchesCategory;
  });

  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const page = Math.round(scrollLeft / (clientWidth || 1));
    setCurrentSlide(page);
    const total = Math.max(1, Math.ceil(scrollWidth / (clientWidth || 1)));
    setTotalSlides(total);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, filteredPosts.length, viewMode]);

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
  };

  const goToSlide = (pageIndex: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: pageIndex * carouselRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  const renderPostCard = (post: BlogPost, idx: number) => {
    const variant = getVariantForPost(post, idx);
    const subfolderUrl = getPostBlogUrl(post);
    const subfolderSlug = getCategorySlug(post.category);
    const isLatest = idx === 0;

    return (
      <article
        key={post.id}
        className={`bg-white rounded-2xl border border-slate-200/90 ${variant.accentBorder} overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between h-full group`}
      >
        {/* Top Section: Khung hình ngẫu nhiên */}
        <div>
          <div className={`relative ${variant.imageHeight} w-full overflow-hidden bg-slate-100`}>
            <img
              src={resolveMediaUrl(post.coverImage)}
              alt={post.title}
              width={400}
              height={220}
              onError={(e) => handleImageFallback(e, post.title || 'bê tông tươi')}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <Link
                href={`/blog/${subfolderSlug}`}
                className={`pointer-events-auto ${variant.badgeBg} text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider transition shadow-xs hover:opacity-90`}
              >
                📁 {post.category}
              </Link>
              {isLatest && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" /> Mới Nhất
                </span>
              )}
            </div>
          </div>

          {/* Body Section: Title và Description ngẫu nhiên */}
          <div className="p-5 flex flex-col space-y-3">
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h2 className={`${variant.titleSize} ${variant.titleClamp} text-slate-900 group-hover:text-amber-600 transition`}>
              <Link href={subfolderUrl}>
                {post.title}
              </Link>
            </h2>

            <p className={`${variant.descSize} ${variant.descClamp}`}>
              {cleanExcerptText(post.excerpt)}
            </p>
          </div>
        </div>

        {/* Bottom Metadata & Link */}
        <div className="p-5 pt-0 mt-auto">
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded truncate max-w-[160px]" title={subfolderUrl}>
              {subfolderUrl}
            </span>

            <Link
              href={subfolderUrl}
              className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug="/blog"
        title="Cẩm Nang Kỹ Thuật Bê Tông & Blog Xây Dựng | Bê Tông An Gia Bình Ninh Bình"
        description="Tổng hợp kiến thức kỹ thuật thi công bê tông tươi, hướng dẫn chọn mác bê tông, tiêu chuẩn TCVN, nén mẫu LAS-XD và cập nhật báo giá vật liệu xây dựng Ninh Bình."
        type="website"
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Kiến Thức & Blog', item: '/blog' }
        ]}
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              Cẩm Nang Kỹ Thuật & SEO Bê Tông Ninh Bình
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Kiến Thức Chuyên Môn & Tiêu Chuẩn Bê Tông
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Tổng hợp kinh nghiệm thực chiến từ kỹ sư Bê Tông An Gia Bình: Hướng dẫn chọn mác bê tông đổ móng, sàn mái, định lượng phụ gia chống thấm và quy trình kiểm định nén mẫu TCVN tại Ninh Bình.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết: mác 250, đổ mái, chống thấm, ninh bình..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
              <label htmlFor="blog-sort" className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Sắp xếp:
              </label>
              <select
                id="blog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white shadow-2xs cursor-pointer"
                title="Tuỳ chọn sắp xếp bài viết theo ngày đăng mới nhất hoặc lượt xem"
              >
                <option value="latest">⚡ Mới nhất (Ngày đăng)</option>
                <option value="oldest">📅 Cũ nhất</option>
                <option value="views">👁️ Xem nhiều nhất</option>
                <option value="title">🔤 Tiêu đề (A-Z)</option>
              </select>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
              <button
                onClick={() => setOverrideCategory('Tất Cả')}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap font-bold ${
                  selectedCategory === 'Tất Cả'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất Cả
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setOverrideCategory(c.name)}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap font-bold ${
                    selectedCategory === c.name || selectedCategory === c.slug
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-400 text-[11px] font-semibold mr-1">Chủ đề:</span>
            {allTags.slice(0, 7).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap text-xs font-medium ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Subfolders Navigation Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/blog/tin-tuc"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">/blog/tin-tuc</span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition">
                  Tin Tức
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 line-clamp-2">
              Báo giá bê tông tươi Ninh Bình mới nhất, hoạt động trạm trộn Khánh Phú & Kim Sơn, tin tức ngành xây dựng.
            </p>
            <div className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Xem bài viết mục Tin Tức</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/blog/kinh-nghiem"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">/blog/kinh-nghiem</span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition">
                  Kinh Nghiệm
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 line-clamp-2">
              Kinh nghiệm đổ bê tông móng, sàn, dầm cột, kỹ thuật cào cán mặt và quy trình bảo dưỡng chống nứt nhà dân.
            </p>
            <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Xem bài viết mục Kinh Nghiệm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/blog/kien-thuc"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">/blog/kien-thuc</span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition">
                  Kiến Thức
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 line-clamp-2">
              Tiêu chuẩn kỹ thuật TCVN, thí nghiệm ép nén mẫu R7/R28, tỷ lệ cấp phối mác 200 - 450 và chứng chỉ LAS-XD.
            </p>
            <div className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Xem bài viết mục Kiến Thức</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Carousel / Grid Posts Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-grow w-full space-y-8">
        {/* Section Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Danh Sách Bài Viết Mới Nhất
              </h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {filteredPosts.length} bài viết
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sắp xếp theo thứ tự mới nhất từ trên xuống dưới • Bố cục Carousel 4 bài / hàng
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  viewMode === 'carousel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bố cục dạng Carousel (1 hàng 4 bài)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bố cục dạng Lưới (4 cột toàn bộ)"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                <span>Lưới 4 Cột</span>
              </button>
            </div>

            {/* Carousel Navigation Arrows */}
            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={scrollPrev}
                  disabled={!canScrollLeft}
                  aria-label="Bài viết trước"
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                    canScrollLeft
                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400 shadow-xs cursor-pointer'
                      : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={!canScrollRight}
                  aria-label="Bài viết tiếp theo"
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                    canScrollRight
                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400 shadow-xs cursor-pointer'
                      : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Display */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng thử tìm với từ khóa khác hoặc bấm xem tất cả bài viết.
            </p>
            <button
              onClick={() => { setOverrideCategory('Tất Cả'); setSelectedTag('Tất Cả'); setSearchTerm(''); }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-xs hover:bg-amber-400 transition"
            >
              Xem Tất Cả Bài Viết
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          /* CAROUSEL MODE: 1 hàng gồm 4 post trên màn hình lớn */
          <div className="space-y-4">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2 px-0.5"
            >
              {filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col"
                >
                  {renderPostCard(post, idx)}
                </div>
              ))}
            </div>

            {/* Carousel Pagination Indicator Dots */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Chuyển đến trang ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === i
                        ? 'w-8 bg-amber-500'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* GRID MODE: 4 cột toàn bộ sắp xếp từ trên xuống dưới */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post, idx) => (
              <div key={post.id} className="flex flex-col">
                {renderPostCard(post, idx)}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Highlights & Contact CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Consultation Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-amber-50 to-amber-100/60 text-slate-900 rounded-2xl p-6 sm:p-8 border border-amber-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Tư Vấn Mác Bê Tông & Đặt Lịch Đổ 24/7
                  </h3>
                  <p className="text-xs text-slate-600">
                    Trạm trộn KCN Khánh Phú & Kim Sơn, Ninh Bình
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
                Đội ngũ kỹ sư kết cấu Bê Tông An Gia Bình sẵn sàng hỗ trợ khảo sát mặt bằng, đo đạc đường xe bồn và báo giá chiết khấu trực tiếp tại Ninh Bình.
              </p>
            </div>
            <a
              href="tel:0988266293"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Kỹ Sư Ngay: 0988 2662 93</span>
            </a>
          </div>

          {/* Popular Topics List */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Flame className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-900 text-base">
                  Chủ Đề Được Tìm Kiếm Nhiều Nhất
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {posts.slice(0, 6).map((p) => (
                  <Link
                    key={p.id}
                    href={getPostUrl(p)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition font-medium line-clamp-2 border border-slate-100 hover:border-amber-200"
                  >
                    • {p.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Cập nhật liên tục 2026</span>
              <span className="font-bold text-amber-600">Bê Tông An Gia Bình</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}

export default function BlogListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>}>
      <BlogListInner />
    </Suspense>
  );
}
