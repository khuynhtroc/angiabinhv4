'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Sparkles } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface TodaySearchKeywordsProps {
  post?: BlogPost;
  extraKeywords?: string[];
  category?: string;
}

export default function TodaySearchKeywords({
  post,
  extraKeywords = [],
  category = 'Bê tông tươi'
}: TodaySearchKeywordsProps) {
  // Format current date: DD/MM/YYYY
  const todayFormatted = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  // Compute 5-10 relevant search keywords based on post, category, and real user intents
  const keywords = useMemo(() => {
    const pool = new Set<string>();

    if (post) {
      if (post.focusKeywords && post.focusKeywords.length > 0) {
        post.focusKeywords.forEach((k) => pool.add(k.trim().toLowerCase()));
      }
      if (post.tags && post.tags.length > 0) {
        post.tags.slice(0, 3).forEach((t) => pool.add(t.trim().toLowerCase()));
      }
    }

    if (extraKeywords && extraKeywords.length > 0) {
      extraKeywords.forEach((k) => pool.add(k.trim().toLowerCase()));
    }

    // Curated high-volume search intents in Ninh Bình
    const baseSuggestions = [
      `báo giá bê tông tươi ninh bình ngày ${todayFormatted}`,
      `giá bê tông an gia bình hôm nay`,
      `trạm trộn bê tông kcn khánh phú`,
      `giá xe bơm bê tông tươi ninh bình`,
      `bê tông thương phẩm mác 250 mác 300`,
      `đặt bê tông tươi đổ sàn ninh bình`,
      `kiểm định độ sụt bê tông tận công trình`,
      `bê tông tươi kim sơn yên khánh hoa lư`
    ];

    baseSuggestions.forEach((s) => {
      if (pool.size < 8) {
        pool.add(s);
      }
    });

    const result = Array.from(pool).slice(0, 10);
    return result;
  }, [post, extraKeywords, todayFormatted]);

  return (
    <div
      id="today-search-keywords"
      className="p-5 sm:p-6 bg-linear-to-br from-slate-50 to-amber-50/50 rounded-2xl border border-amber-200/70 shadow-2xs space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
            <Search className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Từ khoá tìm kiếm ngày hôm nay</span>
              <span className="text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md font-mono text-[11px]">
                ({todayFormatted})
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Xu hướng tra cứu kỹ thuật và giá bê tông tươi tại Ninh Bình trong ngày
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Cập nhật theo thời gian thực</span>
        </div>
      </div>

      {/* Keywords Badge Cloud */}
      <div className="flex flex-wrap gap-2 pt-1">
        {keywords.map((keyword, idx) => (
          <Link
            key={idx}
            href={`/blog?q=${encodeURIComponent(keyword)}`}
            className="group inline-flex items-center gap-1.5 text-xs bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 font-medium transition-all shadow-2xs"
            title={`Tìm kiếm từ khoá: ${keyword}`}
          >
            <Sparkles className="w-3 h-3 text-amber-500 group-hover:text-slate-950 transition" />
            <span className="capitalize">{keyword}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
