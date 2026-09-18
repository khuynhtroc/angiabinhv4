'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import {
  ChevronRight, Phone, ShieldCheck, CheckCircle2, Factory, Truck,
  Layers, HardHat, Award, ArrowRight, Sparkles, Clock, Check, HelpCircle,
  FileText, ExternalLink
} from 'lucide-react';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import { SERVICES_DATABASE, SLUG_ALIASES, type ServiceDetail } from '@/lib/services-data';

export { SERVICES_DATABASE, SLUG_ALIASES, type ServiceDetail };

const RELATED_SERVICES = [
  { title: 'Bê Tông Tươi', link: '/be-tong-tuoi', badge: 'M150 - M600' },
  { title: 'Bê Tông Thương Phẩm', link: '/be-tong-thuong-pham', badge: 'TCVN' },
  { title: 'Bơm Bê Tông', link: '/bom-be-tong', badge: '37m - 56m' },
  { title: 'Bê Tông Siêu Nhẹ', link: '/be-tong-sieu-nhe', badge: 'Cách Nhiệt' },
  { title: 'Bê Tông Nhựa Nóng', link: '/be-tong-nhua', badge: 'Asphalt' },
  { title: 'Bê Tông Khí Chưng Áp', link: '/be-tong-khi-chung-ap', badge: 'AAC / ALC' },
];

export default function ServiceDetailView({ slugKey }: { slugKey: string }) {
  const [chatOpen, setChatOpen] = useState(false);

  // Normalize slug
  const normalizedKey = SLUG_ALIASES[slugKey] || slugKey;
  const service = SERVICES_DATABASE[normalizedKey] || SERVICES_DATABASE['be-tong-thuong-pham'];

  // SEO FAQ Schema
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': service.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSeoHead
        slug={`/${slugKey}`}
        title={`${service.title} | Bê Tông An Gia Bình Ninh Bình`}
        description={service.description || `Dịch vụ ${service.title} chất lượng cao, trạm trộn tự động chuẩn TCVN tại Ninh Bình. Hotline: 0988 2662 93.`}
        image={service.heroImage}
        type="website"
        breadcrumbs={[
          { name: 'Trang chủ', item: '/' },
          { name: 'Lĩnh vực hoạt động', item: '/linh-vuc-hoat-dong' },
          { name: service.title, item: `/${slugKey}` }
        ]}
      />
      <Navbar />
      <RealtimeAnalyticsTracker />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 lg:pb-12 w-full space-y-8 sm:space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-amber-600 transition">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/linh-vuc-hoat-dong" className="hover:text-amber-600 transition">Lĩnh vực hoạt động</Link>
          {service.parentSlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href={service.parentSlug} className="hover:text-amber-600 transition">
                {service.parentTitle || 'Chuyên mục'}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-600 font-bold">{service.title}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-3">
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                <span>{service.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {service.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="tel:0988266293"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition active:scale-95"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Đặt Lịch / Báo Giá: 0988 2662 93</span>
              </a>
              <Link
                href="/bang-gia"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3.5 rounded-xl font-bold text-sm transition"
              >
                <span>Xem Bảng Giá Chi Tiết</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full bg-slate-100">
            <img
              src={resolveMediaUrl(service.heroImage, service.title)}
              alt={service.title}
              onError={(e) => handleImageFallback(e, service.title || 'bê tông')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Detailed Content Sections from Source */}
        {service.sections && service.sections.length > 0 && (
          <div className="space-y-6">
            {service.sections.map((sec, idx) => (
              <section
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
                  {sec.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {sec.content}
                </p>

                {sec.points && sec.points.length > 0 && (
                  <ul className="space-y-2.5 pt-2">
                    {sec.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.table && (
                  <div className="pt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-2xl overflow-hidden border border-slate-200">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                          {sec.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3.5 sm:p-4 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="bg-white even:bg-slate-50/60 hover:bg-amber-50/40 transition">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3.5 sm:p-4 text-slate-700 font-medium">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Technical Specs & Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Specifications Table */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Thông Số & Tiêu Chuẩn Kỹ Thuật</h2>
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-sm">
              {service.specifications.map((spec, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between p-3.5 bg-white even:bg-slate-50/70 gap-1">
                  <span className="font-semibold text-slate-600">{spec.label}</span>
                  <span className="font-bold text-slate-900 sm:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advantages */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Ưu Điểm Vượt Trội</h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {service.advantages.map((adv, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{adv}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Trạm trộn An Gia Bình thực hiện kiểm định chất lượng mác bê tông bằng văn bản kiểm định hợp chuẩn LAS-XD.
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Phạm Vi Ứng Dụng Thực Tế</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {service.applications.map((app, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-semibold leading-relaxed">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contextual Internal Links Between Solutions */}
        {service.internalLinks && service.internalLinks.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50/60 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Giải Pháp &amp; Dịch Vụ Đồng Bộ Khuyên Dùng</h2>
                  <p className="text-xs text-slate-600">Lồng ghép giải pháp tối ưu cho công trình của bạn</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {service.internalLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="p-4 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 transition block space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    {link.badge && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {link.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition ml-auto" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700 leading-snug">
                    {link.title}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Câu Hỏi Thường Gặp (FAQs)</h2>
                <p className="text-xs text-slate-500">Giải đáp kỹ thuật và quy trình thi công</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {service.faqs.map((faq, i) => (
                <div key={i} className="py-4 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                    <span className="text-amber-600 font-black">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6 Core Service Commitments from An Gia Bình */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Cam Kết Dịch Vụ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              6 Tiêu Chí Vàng Tại Bê Tông An Gia Bình
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Nguyên tắc hoạt động cốt lõi mang lại sự an tâm tuyệt đối cho mọi chủ đầu tư và nhà thầu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">01</span>
                <span>Chất Lượng Hàng Đầu</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chất lượng luôn là tiêu chí hàng đầu. Chìa khóa tạo nên và duy trì thành công của An Gia Bình chính là chất lượng chuẩn TCVN trong từng khối bê tông.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">02</span>
                <span>Giá Cả Cạnh Tranh</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Không cam kết mang đến giá rẻ nhất nhưng luôn cam kết mức giá tối ưu và phù hợp nhất tương xứng với chất lượng nguyên vật liệu và tiến độ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">03</span>
                <span>Hậu Mãi Hoàn Hảo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ thuật viên dày dặn kinh nghiệm, hỗ trợ lấy mẫu nén, đo độ sụt tận công trường và đồng hành chăm sóc chu đáo như người nhà.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">04</span>
                <span>Tiến Độ Nhanh Chóng</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tiến độ là điều kiện cần để đánh giá hiệu quả. Cam kết điều phối xe bồn và xe bơm liên tục, không để khách hàng thất vọng hay chờ đợi bê tông.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">05</span>
                <span>Phương Án Tối Ưu</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ thuật khảo sát đường đi, mặt bằng, đường dây điện trước ngày đổ để thống nhất phương án chọn loại xe bồn và cần bơm tiết kiệm chi phí nhất.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">06</span>
                <span>Nguyên Vật Liệu Tuyển Chọn</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống nhà cung cấp chọn lọc: cát vàng sông Lô sàng sạch, đá 1x2 tuyển rửa, xi măng PCB40 uy tín giúp công trình đạt tuổi thọ bền vững trọn đời.
              </p>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Tất Cả Các Lĩnh Vực Hoạt Động</h2>
            <Link href="/linh-vuc-hoat-dong" className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1">
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {RELATED_SERVICES.map((rs, idx) => (
              <Link
                key={idx}
                href={rs.link}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition text-center space-y-1 block group"
              >
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-amber-700 truncate">
                  {rs.title}
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-amber-600">
                  {rs.badge}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
