'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import { Building2, Layers, Truck, Award } from 'lucide-react';

export default function ProjectsPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug="/du-an"
        title="Dự Án Đã Thi Công | Bê Tông An Gia Bình Ninh Bình"
        description="Tổng hợp hơn 1.200 dự án tiêu biểu: Cao tốc Mai Sơn - QL45, KCN Khánh Phú, KCN Gián Khẩu, nhà xưởng và biệt thự dân dụng do Bê Tông An Gia Bình cấp bê tông."
        type="website"
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Dự Án', item: '/du-an' }
        ]}
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-500/30">
              <Building2 className="w-3.5 h-3.5" />
              Công Trình Thực Tế Tại Ninh Bình
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hồ Sơ Dự Án Đã Thi Công
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Minh chứng thuyết phục cho chất lượng và độ tin cậy của Bê Tông An Gia Bình: Hơn 1.200 công trình nhà xưởng KCN, cao tốc, cầu cảng và biệt thự dân dụng khắp các huyện thị tỉnh Ninh Bình.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <ProjectsShowcase showAll={true} />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} onOpenCalculator={() => { window.location.href = '/#concrete-calculator-section'; }} />
    </div>
  );
}
