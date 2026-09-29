'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
// Dynamic imports for below-the-fold and interactive widgets to achieve 100/100 Mobile PageSpeed
const ConcreteCalculator = dynamic(() => import('@/components/ConcreteCalculator'), {
  ssr: true,
});

const AboutCompany = dynamic(() => import('@/components/AboutCompany'), {
  ssr: true,
});

const PricingTable = dynamic(() => import('@/components/PricingTable'), {
  ssr: true,
});

const CapabilityProfile = dynamic(() => import('@/components/CapabilityProfile'), {
  ssr: true,
});

const ProjectsShowcase = dynamic(() => import('@/components/ProjectsShowcase'), {
  ssr: true,
});

const HomeBlogSection = dynamic(() => import('@/components/HomeBlogSection'), {
  ssr: true,
});

const HomeConstructionNews = dynamic(() => import('@/components/HomeConstructionNews'), {
  ssr: true,
});

const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), {
  ssr: false,
});

const MobileQuickBar = dynamic(() => import('@/components/MobileQuickBar'), {
  ssr: true,
});

const RealtimeAnalyticsTracker = dynamic(() => import('@/components/RealtimeAnalyticsTracker'), {
  ssr: false,
});

const JekyllExportModal = dynamic(() => import('@/components/JekyllExportModal'), {
  ssr: false,
});

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [jekyllModalOpen, setJekyllModalOpen] = useState(false);

  const scrollToCalculator = () => {
    const el = document.getElementById('concrete-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-amber-400 selection:text-slate-950 font-sans">
      <RealtimeAnalyticsTracker />
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection onScrollToCalculator={scrollToCalculator} />

        {/* 2. Concrete Volume & Pricing Calculator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
          <ConcreteCalculator />
        </div>

        {/* 3. About Company & Capacity */}
        <AboutCompany />

        {/* 4. Pricing Table 2025 */}
        <PricingTable />

        {/* 5. Capability Profile */}
        <CapabilityProfile />

        {/* 6. Projects Showcase (Dự án đã thi công) */}
        <ProjectsShowcase />

        {/* 7. Knowledge & SEO Blog Section */}
        <HomeBlogSection />

        {/* 8. Construction News & Ideas (Ninh Bình & Nationwide) */}
        <HomeConstructionNews />
      </main>

      <Footer />

      {/* 24/7 AI Chatbot */}
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />

      {/* Mobile Sticky Action Bar */}
      <MobileQuickBar
        onOpenChat={() => setChatOpen(true)}
        onOpenCalculator={scrollToCalculator}
      />

      {/* Jekyll Source Code Modal */}
      <JekyllExportModal
        isOpen={jekyllModalOpen}
        onClose={() => setJekyllModalOpen(false)}
      />
    </div>
  );
}
