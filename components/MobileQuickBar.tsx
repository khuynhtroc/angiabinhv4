'use client';

import React from 'react';
import { Phone, MessageCircle, Bot, Calculator } from 'lucide-react';

interface MobileQuickBarProps {
  onOpenChat: () => void;
  onOpenCalculator?: () => void;
}

export default function MobileQuickBar({ onOpenChat, onOpenCalculator }: MobileQuickBarProps) {
  const handleCalculator = () => {
    if (onOpenCalculator) {
      onOpenCalculator();
    } else {
      const calcEl = document.getElementById('volume-calculator');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#calculator';
      }
    }
  };
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 text-xs shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-center">
        {/* Call Hotline */}
        <a
          href="tel:0988266293"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-amber-500 text-slate-950 font-bold active:scale-95 transition shadow-xs"
          id="mobile-quick-call"
          aria-label="Gọi điện trực tiếp tới hotline 0988 2662 93"
        >
          <Phone className="w-4 h-4 mb-0.5 animate-bounce" />
          <span className="text-[11px] leading-tight font-bold">Gọi Điện</span>
        </a>

        {/* Fanpage / Zalo */}
        <a
          href="https://www.facebook.com/betongangiabinh/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-blue-600 text-white font-semibold active:scale-95 transition"
          id="mobile-quick-fanpage"
          aria-label="Truy cập trang Fanpage Facebook Bê Tông An Gia Bình"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] leading-tight">Fanpage</span>
        </a>

        {/* AI Chatbot 24/7 */}
        <button
          type="button"
          onClick={() => {
            onOpenChat();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-ai-chat'));
            }
          }}
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold active:scale-95 transition"
          id="mobile-quick-chat"
          aria-label="Mở trợ lý AI tư vấn mác bê tông 24/7"
        >
          <Bot className="w-4 h-4 mb-0.5 text-amber-600" />
          <span className="text-[11px] leading-tight">AI Tư Vấn</span>
        </button>

        {/* Concrete Calculator */}
        <button
          type="button"
          onClick={handleCalculator}
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-semibold active:scale-95 transition"
          id="mobile-quick-calc"
          aria-label="Công cụ tính thể tích bê tông móng dầm sàn"
        >
          <Calculator className="w-4 h-4 mb-0.5 text-slate-600" />
          <span className="text-[11px] leading-tight">Tính Khối</span>
        </button>
      </div>
    </div>
  );
}
