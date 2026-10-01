'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Calculator, ShieldCheck, Truck, Clock, CheckCircle2, ChevronRight, Award, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface HeroSectionProps {
  onScrollToCalculator: () => void;
}

export default function HeroSection({ onScrollToCalculator }: HeroSectionProps) {
  const { jekyllConfig } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const phoneDisplay = jekyllConfig?.phone || '0988 2662 93';
  const phoneCall = phoneDisplay.replace(/\s+/g, '');
  const brandTitle = jekyllConfig?.title?.replace(/\s*-\s*Ninh\s*Bình/i, '') || 'BÊ TÔNG AN GIA BÌNH';
  const brandSlogan = jekyllConfig?.slogan || 'NỀN MÓNG VỮNG BỀN';

  useEffect(() => {
    // Only load video on desktop screens (>= 768px) to protect mobile LCP & network
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop, { passive: true });
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-slate-50 text-slate-900 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
      {/* Subtle Ambient Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>Trạm Trộn Bê Tông Tươi Chuẩn TCVN Tại Ninh Bình</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-950">
              {brandTitle}
              <span className="block text-amber-600 mt-1 sm:mt-2">
                {brandSlogan}
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 block mt-2">
                Đồng Hành Mọi Công Trình Trọng Điểm
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {jekyllConfig?.description || 'Cung ứng bê tông thương phẩm mác 150 – 450, hệ thống 2 cụm trạm trộn tự động tổng công suất 450m³/h (Trạm KCN Khánh Phú 300m³/h & Trạm Xã Kim Sơn 150m³/h), đội xe 35+ xe bồn và dàn xe bơm cần vươn xa 37m - 56m. Đo nén mẫu R7, R28 kiểm định LAS-XD trực tiếp tại hiện trường.'}
            </p>

            {/* Value bullets without absolute assertions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-1 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cân điện tử sai số &lt;1%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cấp phối chuẩn TCVN</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Điều vận xe bồn 24/7</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-4 w-full">
              <a
                href={`tel:${phoneCall}`}
                className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-md shadow-amber-500/20 active:scale-95 text-center"
                id="hero-call-now"
              >
                <Phone className="w-4 h-4 animate-pulse shrink-0" />
                <span>Gọi Báo Giá Tham Khảo: {phoneDisplay}</span>
              </a>

              <button
                onClick={onScrollToCalculator}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-4 sm:px-5 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-xs text-center"
                id="hero-scroll-calc"
              >
                <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Dự Toán &amp; Tính Số Khối</span>
              </button>

              <Link
                href="/du-an"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-amber-700 font-semibold py-2 px-3 transition text-center"
              >
                <span>Xem các dự án đã cung cấp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Video / Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-96 w-full">
              {/* Desktop View: Full Video (Only mounted if isDesktop) */}
              {isDesktop ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg"
                    className="w-full h-full object-cover"
                  >
                    <source
                      src="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/videos/be-tong-an-gia-binh.webm"
                      type="video/webm"
                    />
                    <source
                      src="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/videos/be-tong-an-gia-binh.MP4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              ) : (
                /* Mobile & SSR View: High performance LCP Image */
                <div className="w-full h-full relative">
                  <img
                    src="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/tram-be-tong-an-gia-binh.jpg"
                    alt="Trạm trộn bê tông tươi An Gia Bình Ninh Bình"
                    width={600}
                    height={375}
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* Video Player Action Controls - Desktop only */}
              {isDesktop && (
                <div className="flex absolute top-3 right-3 items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20 shadow-xs"
                    title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Play className="w-4 h-4 sm:w-3.5 sm:h-3.5 ml-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20 shadow-xs"
                    title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
                  </button>
                </div>
              )}

              {/* Floating Highlight Card on Video */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between text-amber-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Toàn Cảnh Cụm Trạm &amp; Đội Xe Bồn
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold">
                    VIDEO TRẠM TRỘN
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  2 cụm trạm tại KCN Khánh Phú (300m³/h) &amp; Xã Kim Sơn (150m³/h) phục vụ xuyên suốt ngày đêm, cung ứng chuẩn phẩm cấp cho mọi công trình Ninh Bình.
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute top-3 left-3 sm:-top-4 sm:-left-6 bg-amber-500 text-slate-950 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xl font-black text-xs flex items-center gap-2 border border-amber-300 z-10">
              <Award className="w-4 h-4 shrink-0" />
              <span>CỤM TRẠM 450m³/h HIỆN ĐẠI</span>
            </div>
          </div>
        </div>

        {/* 4 Key Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-slate-200 text-center sm:text-left">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">450 m³/h</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Tổng công suất 2 trạm trộn</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">35+ Xe</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Xe bồn chuyên dụng 10 - 12m³</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">56 mét</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Xe bơm cần vươn xa tối đa</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">TCVN 3105</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Quy chuẩn đúc nén mẫu R7, R28</div>
          </div>
        </div>
      </div>
    </section>
  );
}
