'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { getPostUrl, formatNumber, resolveMediaUrl, cleanExcerptText } from '@/lib/utils';
import { BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export default function HomeBlogSection() {
  const { posts } = useAppStore();

  // Sort posts by date descending (newest first)
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      const timeA = new Date(a.date || '').getTime() || 0;
      const timeB = new Date(b.date || '').getTime() || 0;
      return timeB - timeA;
    });
  }, [posts]);

  return (
    <section className="py-16 sm:py-24 bg-white" id="home-blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Chuyên Mục Kiến Thức & Chuẩn SEO Top Google
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Kinh Nghiệm & Cẩm Nang Bê Tông Ninh Bình
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Tổng hợp các bài viết chuyên môn sâu từ các kỹ sư trưởng Bê Tông An Gia Bình, hướng dẫn chi tiết từ chọn mác, bảo dưỡng đến nghiệm thu công trình.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-amber-50 border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs"
          >
            <span>Xem Tất Cả Bài Viết</span>
            <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>

        {/* 3 Featured Articles (Newest First) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sortedPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resolveMediaUrl(post.coverImage)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-5">
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

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition line-clamp-2 mb-2">
                    <Link href={getPostUrl(post)}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cleanExcerptText(post.excerpt)}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-amber-600">
                <Link href={getPostUrl(post)} className="flex items-center gap-1 hover:underline">
                  <span>Đọc bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400 font-normal">
                  {formatNumber(post.views)} lượt xem
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
