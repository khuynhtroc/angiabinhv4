'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Phone, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotWidgetProps {
  isOpen?: boolean;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  externalOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export default function ChatbotWidget({ 
  isOpen: propIsOpen, 
  isOpenExternal, 
  onCloseExternal, 
  externalOpen, 
  onClose,
  onOpen 
}: ChatbotWidgetProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);

  // Derive active open state from external props or internal state
  const isExternalActive = Boolean(propIsOpen || externalOpen || isOpenExternal);
  const isOpen = isExternalActive || isOpenInternal;

  // Listen to global open event
  useEffect(() => {
    const handleGlobalOpen = () => {
      setIsOpenInternal(true);
      if (onOpen) onOpen();
    };
    window.addEventListener('open-ai-chat', handleGlobalOpen);
    return () => window.removeEventListener('open-ai-chat', handleGlobalOpen);
  }, [onOpen]);

  const effectiveOnClose = onClose || onCloseExternal;

  const handleOpen = () => {
    setIsOpenInternal(true);
    if (onOpen) onOpen();
  };

  const handleClose = () => {
    setIsOpenInternal(false);
    if (effectiveOnClose) effectiveOnClose();
  };

  const { logRealtimeEvent } = useAppStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là Trợ Lý Kỹ Thuật AI 24/7 của Bê Tông An Gia Bình (Ninh Bình). Quý khách cần tư vấn mác bê tông (M200, M250, M300...), tính toán số khối m³, báo giá hay chọn xe bơm cần cho công trình nào ạ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Track event
    logRealtimeEvent({
      type: 'chat_inquiry',
      details: text.slice(0, 80),
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      location: 'Ninh Bình',
      path: window.location.pathname
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Cảm ơn quý khách. Kỹ sư Bê Tông An Gia Bình luôn trực máy 24/7 tại Hotline 0988 2662 93 để hỗ trợ quý khách ngay lập tức!' }
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Hệ thống đang bận. Quý khách vui lòng gọi trực tiếp Hotline 0988 2662 93 để được kỹ sư Bê Tông An Gia Bình hỗ trợ 24/7!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Báo giá mác 250 đổ sàn',
    'Tính khối lượng móng 10x8m',
    'Cần thuê xe bơm cần 43m',
    'Trạm trộn ở đâu tại Ninh Bình?'
  ];

  return (
    <>
      {/* Floating trigger button on desktop (mobile uses bottom quick bar) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="hidden sm:flex fixed bottom-6 right-6 z-40 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-3.5 sm:p-4 rounded-full shadow-2xl items-center gap-2.5 transition hover:scale-105 active:scale-95 group border-2 border-white/60"
          id="chatbot-floating-trigger"
          aria-label="Mở Chatbot AI 24/7"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="font-bold text-xs pr-1">
            AI Tư Vấn Bê Tông 24/7
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed inset-x-2 bottom-16 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 h-[520px] max-h-[82vh] z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5"
          id="chatbot-window"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                AGB
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>Trợ Lý Bê Tông An Gia Bình</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                </div>
                <div className="text-[10px] text-amber-400 font-medium">
                  AI Trực Tuyến 24/7 • Hotline: 0988 2662 93
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="tel:0988266293"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                title="Gọi Hotline"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Đóng Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-8">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-200" />
                <span className="text-[11px] font-medium">Kỹ sư AI đang soạn phản hồi...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 font-medium transition shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi cần tư vấn bê tông..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
