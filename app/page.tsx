'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ConcreteCalculator from '@/components/ConcreteCalculator';
import AboutCompany from '@/components/AboutCompany';
import PricingTable from '@/components/PricingTable';
import CapabilityProfile from '@/components/CapabilityProfile';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import HomeBlogSection from '@/components/HomeBlogSection';
import HomeConstructionNews from '@/components/HomeConstructionNews';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import JekyllExportModal from '@/components/JekyllExportModal';

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
