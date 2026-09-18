'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { ChevronRight, ShieldCheck, CheckCircle2, Phone, Building2, Quote } from 'lucide-react';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';

export default function ThuNgoPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <RealtimeAnalyticsTracker />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/about" className="hover:text-amber-600">Giới thiệu</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600 font-bold">Thư ngỏ</span>
        </div>

        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thư Ngỏ
            </h1>
            <p className="text-sm font-semibold text-amber-600 mt-2">
              Bê Tông An Gia Bình - Nền Móng Vững Chắc Cho Mọi Công Trình
            </p>
          </div>

          {/* Core Quote */}
          <div className="relative p-6 sm:p-8 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-center">
            <Quote className="w-8 h-8 text-amber-500/30 mx-auto mb-2" />
            <blockquote className="text-base sm:text-lg font-bold text-slate-800 italic leading-relaxed">
              &ldquo;Nhạy bén và quyết liệt, An Gia Bình lựa chọn hợp tác với những đối tác uy tín, phân phối các sản phẩm chất lượng và đồng hành hỗ trợ kỹ thuật tận tâm cho mọi Quý khách hàng tại Việt Nam.&rdquo;
            </blockquote>
          </div>

          {/* Letter Body */}
          <div className="text-slate-700 leading-relaxed text-base space-y-5">
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                Kính gửi: Quý Khách Hàng! Quý Đối Tác Thân Mến!
              </h2>
            </div>

            <p>
              Xin được trân trọng cám ơn tình cảm, niềm tin và thiện chí hợp tác của Quý khách hàng dành cho <strong>An Gia Bình</strong>.
            </p>

            <p>
              Thị trường bê tông tươi / bê tông thương phẩm tại Việt Nam rộng lớn và nhiều thách thức, An Gia Bình với hành trình nhiều năm thành lập và phát triển đã gây dựng được sự tin tưởng với những công ty, tập đoàn hàng đầu thị trường,… điều đó là niềm tự hào và thêm động lực cho An Gia Bình trên con đường phát triển doanh nghiệp!
            </p>

            <p>
              An Gia Bình được Khách hàng yêu quý, được đối tác tin cậy bởi An Gia Bình là những người trẻ, tâm huyết với thị trường, tận tâm với khách hàng và đề cao hợp tác bền vững với đối tác.
            </p>

            <p>
              An Gia Bình đồng hành cùng nhau để vững bước vượt mọi khó khăn và tạo dựng một tập thể hạnh phúc.
            </p>

            <p>
              Nhạy bén và quyết liệt, An Gia Bình lựa chọn hợp tác với những đối tác uy tín, phân phối các sản phẩm chất lượng và duy trì dịch vụ kỹ thuật hàng đầu cho mọi Quý khách hàng tại Việt Nam.
            </p>

            <p>
              Với các yếu tố định hướng tiên quyết, lãnh đạo sáng suốt, bộ máy đồng lòng quyết tâm, An Gia Bình không ngừng nỗ lực để phát triển mạnh mẽ.
            </p>

            <div className="my-6 p-6 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>3 Trụ Cột Hoạt Động Cốt Lõi Của Bê Tông An Gia Bình:</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Đúng mác & Chuẩn cấp phối TCVN:</strong> 100% nguyên vật liệu sàng tuyển rửa sạch, xi măng chính hãng và hệ phụ gia cao cấp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Đủ khối lượng 100%:</strong> Cân điện tử tự động, niêm phong kẹp chì xuất xưởng minh bạch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Giao hàng chuẩn tiến độ 24/7:</strong> 2 cụm trạm trộn KCN Khánh Phú (300m³/h) & Kim Sơn (150m³/h), cùng 35+ xe bồn và bơm cần 37m - 56m.</span>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left pt-2 font-bold text-slate-900 text-lg">
              Hợp tác với An Gia Bình và chúng ta cùng tạo dựng giá trị bền vững!
            </div>

            {/* Team Photo from original website */}
            <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={resolveMediaUrl('/images/doi-ngu-nhan-su-be-tong-an-gia-binh-1.jpg', 'Đội ngũ nhân sự Bê Tông An Gia Bình')}
                alt="Đội ngũ nhân sự Bê Tông An Gia Bình"
                onError={(e) => handleImageFallback(e, 'Đội ngũ nhân sự Bê Tông An Gia Bình')}
                className="w-full h-auto object-cover"
              />
              <div className="p-3 bg-white text-center text-xs text-slate-500 italic">
                Đội ngũ cán bộ kỹ thuật và nhân sự Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình
              </div>
            </div>

            {/* Company Footer Info in letter */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Ban Lãnh Đạo</div>
                <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Mã số thuế: <strong>2700870972</strong> | Hotline: <strong>0988 2662 93</strong>
                </div>
                <div className="text-xs text-slate-500">
                  Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình • Trạm 2: Xã Kim Sơn, Ninh Bình
                </div>
              </div>
              <a
                href="tel:0988266293"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition shrink-0"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Liên Hệ: 0988 2662 93</span>
              </a>
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
