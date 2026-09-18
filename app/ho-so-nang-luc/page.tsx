'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CapabilityProfile from '@/components/CapabilityProfile';
import AboutCompany from '@/components/AboutCompany';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import { Award, ShieldCheck, FileCheck2, Cpu, Factory } from 'lucide-react';

export default function CapabilityPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <PageSeoHead
        slug="/ho-so-nang-luc"
        defaultTitle="Hồ Sơ Năng Lực Trạm Trộn | Bê Tông An Gia Bình"
        defaultDescription="Hồ sơ năng lực trạm trộn bê tông thương phẩm An Gia Bình: Thiết bị hiện đại, công suất lớn, chứng chỉ chất lượng ISO."
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Năng Lực Pháp Lý & Kỹ Thuật Đạt Chuẩn Đấu Thầu
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hồ Sơ Năng Lực Doanh Nghiệp
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Cung cấp đầy đủ thông tin pháp lý doanh nghiệp, danh mục thiết bị trạm trộn, xe bồn, chứng chỉ chất lượng ISO 9001 và phòng thí nghiệm LAS-XD phục vụ các chủ đầu tư, tổng thầu và ban quản lý dự án.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <CapabilityProfile />
        <AboutCompany />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} onOpenCalculator={() => { window.location.href = '/#concrete-calculator-section'; }} />
    </div>
  );
}
