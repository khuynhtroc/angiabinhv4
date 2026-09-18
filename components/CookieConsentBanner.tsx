'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cookie, ShieldCheck, Check, X, Settings2,
  ChevronDown, ChevronUp, Lock, BarChart3, Sliders
} from 'lucide-react';

const STORAGE_KEY = 'angiabinh_cookie_consent_v1';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Preference state if customized
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [allowPreferences, setAllowPreferences] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      const savedConsent = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : 'done';
      if (!savedConsent) {
        timer = setTimeout(() => {
          setMounted(true);
          setIsVisible(true);
        }, 800);
      }
    } catch {
      // Storage unavailable or disabled
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!mounted || !isVisible) return null;

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: 'accepted_all',
          essential: true,
          analytics: true,
          preferences: true,
          timestamp: new Date().toISOString()
        })
      );
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  const handleAcceptEssentialOnly = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: 'essential_only',
          essential: true,
          analytics: false,
          preferences: false,
          timestamp: new Date().toISOString()
        })
      );
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: 'customized',
          essential: true,
          analytics: allowAnalytics,
          preferences: allowPreferences,
          timestamp: new Date().toISOString()
        })
      );
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Thông báo chấp nhận cookie và chính sách quyền riêng tư"
      className="fixed bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-auto sm:max-w-md md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-2xl text-slate-900 space-y-4">
        {/* Banner Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                  Quyền Riêng Tư &amp; Dữ Liệu
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-950">
                Thông Báo Sử Dụng Cookie
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcceptEssentialOnly}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            title="Đóng thông báo (Chỉ dùng cookie thiết yếu)"
            aria-label="Đóng thông báo cookie"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Short Informative Text */}
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Website Bê Tông An Gia Bình sử dụng cookie và công nghệ lưu trữ cục bộ nhằm đảm bảo hệ thống máy tính dự toán số khối, lưu cấu hình và tối ưu hóa hiệu suất truyền tải trang theo quy định tại{' '}
          <Link
            href="/chinh-sach-bao-mat"
            className="text-amber-800 font-bold underline hover:text-amber-900 transition"
          >
            Chính Sách Bảo Mật
          </Link>.
        </p>

        {/* Expandable Details Section */}
        {showDetails && (
          <div className="pt-2 border-t border-slate-200/80 space-y-2.5 text-xs animate-in fade-in duration-200">
            {/* Category 1: Essential */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Cookie Cần Thiết (Bắt Buộc)</div>
                  <div className="text-[11px] text-slate-500">Giữ phiên làm việc, máy tính dự toán bê tông, an toàn biểu mẫu.</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Luôn Bật
              </span>
            </div>

            {/* Category 2: Analytics */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Cookie Phân Tích (Analytics)</div>
                  <div className="text-[11px] text-slate-500">Đo lường lưu lượng (Google Analytics G-6J50BRBSZS).</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowAnalytics}
                onChange={(e) => setAllowAnalytics(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {/* Category 3: Preferences */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Cookie Cá Nhân Hóa</div>
                  <div className="text-[11px] text-slate-500">Ghi nhớ mác bê tông quan tâm và tùy chọn trang.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowPreferences}
                onChange={(e) => setAllowPreferences(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Buttons & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 transition cursor-pointer py-1 px-1.5"
          >
            <Settings2 className="w-3 h-3 text-amber-600" />
            <span>{showDetails ? 'Thu gọn' : 'Tùy chỉnh cài đặt'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {showDetails ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                Lưu Tùy Chọn
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAcceptEssentialOnly}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Chỉ Thiết Yếu
              </button>
            )}

            <button
              type="button"
              onClick={handleAcceptAll}
              className="bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Chấp Nhận Tất Cả</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
