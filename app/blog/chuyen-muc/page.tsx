'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { useAppStore } from '@/lib/store';
import { getCategoryUrl, getPostUrl } from '@/lib/utils';
import { Layers, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

export default function AllCategoriesPage() {
  const { categories, posts } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/blog" className="hover:text-slate-900 transition">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-600 font-bold">Chuyên Mục Bài Viết</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-3">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Hệ Thống Chuyên Mục Nội Dung</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Chuyên Mục Bê Tông Ninh Bình
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Khám phá các chuyên mục kiến thức xây dựng, báo giá bê tông tươi và kỹ thuật trạm trộn từ Công ty TNHH Bê Tông An Gia Bình Ninh Bình.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catPosts = posts.filter(p => 
              (p.category || '').toLowerCase().includes(cat.name.toLowerCase()) ||
              cat.name.toLowerCase().includes((p.category || '').toLowerCase())
            );

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-md hover:border-amber-400 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                      /blog/{cat.slug || cat.id}/
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {catPosts.length} bài viết
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
                    <Link href={getCategoryUrl(cat)}>{cat.name}</Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cat.description || 'Tổng hợp các bài viết kỹ thuật, cẩm nang và báo giá chi tiết trong chuyên mục.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={getCategoryUrl(cat)}
                    className="text-xs font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>Xem bài viết trong mục</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
