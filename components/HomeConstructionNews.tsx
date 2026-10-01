'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Newspaper, Calendar, ArrowRight, ExternalLink, Sparkles, Building2, CheckCircle2, X, PhoneCall } from 'lucide-react';
import { IndustryNews } from '@/lib/types';

export default function HomeConstructionNews() {
  const { industryNews, jekyllConfig } = useAppStore();
  const [selectedNews, setSelectedNews] = useState<IndustryNews | null>(null);

  const phoneDisplay = jekyllConfig?.phone || '0988 2662 93';
  const phoneCall = phoneDisplay.replace(/\s+/g, '');

  // Take the 5 latest news items
  const displayNews = (industryNews && industryNews.length > 0)
    ? industryNews.slice(0, 5)
    : [];

  return (
    <section id="construction-news-section" className="py-16 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cập Nhật Hàng Ngày
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Nguồn Tin Tức &amp; Ý Tưởng Xây Dựng
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Tổng hợp 5 thông tin mới nhất về tiêu chuẩn cấp phối bê tông TCVN, kinh nghiệm đổ móng - sàn mái không nứt và giải pháp thi công hạ tầng thực tế.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={`tel:${phoneCall}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tư Vấn Kỹ Thuật: {phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* 5 Latest News Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Item (Item 1) */}
          {displayNews[0] && (
            <div className="lg:col-span-7 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition group shadow-xl">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    {displayNews[0].source}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {displayNews[0].publishedAt}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedNews(displayNews[0])}
                  className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition cursor-pointer leading-snug mb-4"
                >
                  {displayNews[0].title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4 mb-6">
                  {displayNews[0].summary}
                </p>

                {displayNews[0].targetKeywords && displayNews[0].targetKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {displayNews[0].targetKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-900/80 text-slate-400 border border-slate-700">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedNews(displayNews[0])}
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>Xem Chi Tiết Kỹ Thuật</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-xs text-slate-400">Tin Tiêu Điểm</span>
              </div>
            </div>
          )}

          {/* 4 Supporting News Items (Items 2-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {displayNews.slice(1, 5).map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setSelectedNews(item)}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 rounded-xl p-4 sm:p-5 transition group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-amber-400 truncate max-w-[200px]">
                    {item.source}
                  </span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {item.publishedAt}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-400 transition line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Guarantee Note */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Kiểm định LAS-XD hợp chuẩn
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Đo độ sụt tại chân công trình
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Trạm trộn tự động ISO 9001
            </span>
          </div>
          <div className="text-slate-400">
            Nguồn tin tổng hợp từ Viện Bê Tông, Tạp chí Xây Dựng &amp; Sở Xây Dựng Ninh Bình
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                {selectedNews.source}
              </span>
              <span className="text-xs text-slate-400">
                {selectedNews.publishedAt}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
              {selectedNews.title}
            </h3>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 mb-5 text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-400 block mb-1">Tóm Tắt Giải Pháp:</strong>
              {selectedNews.summary}
            </div>

            {selectedNews.rawContent && (
              <div className="text-sm text-slate-300 leading-relaxed space-y-3 mb-6 whitespace-pre-line">
                {selectedNews.rawContent}
              </div>
            )}

            {selectedNews.targetKeywords && selectedNews.targetKeywords.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Từ khóa liên quan:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedNews.targetKeywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedNews.sourceUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
              >
                <span>Nguồn tham chiếu gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${phoneCall}`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Liên Hệ Trạm Trộn: {phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
