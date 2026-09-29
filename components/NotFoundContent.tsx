'use client';
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, RefreshCw, Compass, PhoneCall } from 'lucide-react';

export default function NotFoundContent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      router.push('/');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 text-center font-sans">
      <div className="max-w-lg w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {/* 404 Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 font-black text-3xl mb-5 shadow-xs">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Không Tìm Thấy Trang
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được cập nhật sang vị trí mới.
        </p>

        {/* Auto Redirect Countdown Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-6 text-xs text-slate-700">
          <div className="flex items-center justify-center gap-2 font-bold text-amber-900 mb-2">
            <RefreshCw className={`w-4 h-4 text-amber-600 ${!isPaused ? 'animate-spin' : ''}`} />
            <span>
              {isPaused ? (
                'Đã tạm dừng chuyển hướng'
              ) : (
                <>Tự động chuyển về trang chủ sau <span className="text-amber-600 font-black text-base px-1">{countdown}</span> giây</>
              )}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-amber-200/60 rounded-full h-1.5 mb-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline transition font-medium cursor-pointer"
          >
            {isPaused ? 'Tiếp tục đếm ngược' : 'Tạm dừng chuyển hướng để ở lại trang'}
          </button>
        </div>

        {/* Search quick bar */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, báo giá..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-20 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Tìm
          </button>
        </form>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ Ngay</span>
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Xem Danh Sách Bài Viết</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Hoặc truy cập nhanh
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/bang-gia" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Bảng Báo Giá
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/about" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Giới Thiệu
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/du-an" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Dự Án
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/lien-he" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Liên Hệ
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
        <span>Cần hỗ trợ kỹ thuật ngay? Hotline: <a href="tel:0988266293" className="font-bold text-slate-700 hover:text-amber-600">0988 2662 93</a></span>
      </div>
    </div>
  );
}
