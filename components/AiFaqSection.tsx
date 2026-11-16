'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Sparkles, Phone, CheckCircle2, Calculator } from 'lucide-react';
import { MASTER_CONCRETE_FAQS, FaqItem } from '@/lib/ai-seo-faq';

interface AiFaqSectionProps {
  faqs?: FaqItem[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function AiFaqSection({
  faqs = MASTER_CONCRETE_FAQS,
  title = 'Hỏi Đáp Chuyên Gia Về Bê Tông Tươi Tại Ninh Bình',
  subtitle = 'Giải đáp chi tiết đơn giá 1m³ bê tông thương phẩm M150 – M400, chi phí thuê xe bơm cần 37m – 56m, bơm tĩnh ngõ hẹp và tiêu chuẩn nghiệm thu TCVN từ đội ngũ kỹ sư Trạm trộn An Gia Bình.',
  compact = false
}: AiFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[]))];
  const filteredFaqs =
    selectedCategory === 'Tất cả' ? faqs : faqs.filter((f) => f.category === selectedCategory);

  return (
    <section
      id="hoi-dap-be-tong-ninh-binh"
      className={`${compact ? 'py-8' : 'py-16 sm:py-20'} bg-slate-50 border-t border-slate-200/80`}
      aria-labelledby="faq-heading"
    >
      <div className={compact ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {/* Header */}
        <div className={compact ? 'mb-6' : 'text-center max-w-3xl mx-auto mb-10'}>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Thông Tin Tổng Quan &amp; Hỏi Đáp Chuẩn TCVN</span>
          </div>
          <h2
            id="faq-heading"
            className={`${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-4xl'
            } font-black text-slate-900 tracking-tight leading-tight`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* AI Overview Quick Summary Card (Direct Answer Box for SGE & Crawlers) */}
        {!compact && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/70 shadow-sm mb-10">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-700 font-black text-xs sm:text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Tóm Tắt Nhanh Dịch Vụ Bê Tông Tươi Ninh Bình (Cập Nhật 2026)</span>
              </div>
              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                Nguồn: Trạm Trộn Bê Tông An Gia Bình
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <h3 className="font-extrabold text-slate-900 mb-1.5">1. Đơn giá 1m³ bê tông tươi Ninh Bình</h3>
                <p>
                  Dao động từ <strong>870.000 đ/m³</strong> (Mác 150 lót móng), <strong>940.000 đ/m³</strong> (Mác 200),{' '}
                  <strong>1.000.000 đ/m³</strong> (Mác 250 đổ móng/mái nhà phố), <strong>1.080.000 đ/m³</strong> (Mác 300) đến{' '}
                  <strong>1.160.000 – 1.240.000 đ/m³</strong> (Mác 350 – Mác 400).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-extrabold text-slate-900 mb-1.5">2. Dịch vụ xe bồn &amp; bơm bê tông</h3>
                <p>
                  Đội xe <strong>35+ xe bồn (6m³ – 12m³)</strong> có kẹp chì niêm phong; xe <strong>bơm cần 37m – 56m</strong>{' '}
                  (từ 2.800.000 đ/ca) và <strong>bơm tĩnh luồn ngõ hẹp sâu 150m</strong> (từ 3.200.000 đ/ca).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-extrabold text-slate-900 mb-1.5">3. Hệ thống 2 trạm trộn 450m³/h</h3>
                <p>
                  <strong>Trạm 1:</strong> KCN Khánh Phú (Đông Hoa Lư) &amp; <strong>Trạm 2:</strong> Xã Kim Sơn. Cung ứng 24/7 tại Hoa Lư, TP. Ninh Bình, Tam Điệp, Yên Khánh, Kim Sơn, Gia Viễn, Yên Mô, Nho Quan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        {!compact && categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion Grid (All answers rendered in DOM for SEO/AI Crawlers) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                    : 'border-slate-200/90 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 itemProp="name" className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {/* Keep answer always in DOM (using hidden attribute only visually) so Googlebot & AI crawlers index 100% of Q&A text */}
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className={`px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 ${
                    isOpen ? 'block' : 'hidden print:block'
                  }`}
                >
                  <div itemProp="text" className="pt-3 text-justify [text-align-last:left]">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {!compact && (
          <div className="mt-10 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Cần tư vấn kỹ thuật riêng cho công trình của bạn?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Kỹ sư trưởng An Gia Bình hỗ trợ khảo sát mặt bằng &amp; báo giá miễn phí 24/7
              </h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:0988266293"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Ngay: 0988 2662 93</span>
              </a>
              <Link
                href="/bang-gia"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/15 transition"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Tính Khối Lượng &amp; Báo Giá</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

