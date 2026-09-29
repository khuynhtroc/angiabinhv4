'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, RefreshCw, Compass, Search, PhoneCall, BookOpen } from 'lucide-react';

interface NotFoundRedirectProps {
  itemType?: string;
  slug?: string;
  targetUrl?: string;
  targetName?: string;
}

export default function NotFoundRedirect({
  itemType = 'nội dung',
  slug,
  targetUrl = '/',
  targetName = 'Trang Chủ'
}: NotFoundRedirectProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      router.push(targetUrl);
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, router, targetUrl]);

  return (
    <div className="max-w-xl mx-auto py-16 sm:py-20 px-4 text-center font-sans">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-2xl mx-auto mb-4">
          404
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Không Tìm Thấy {itemType.toUpperCase()}
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
          {slug ? (
            <>
              Đường dẫn <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-semibold">{slug}</span> có thể đã được thay đổi hoặc tạm gỡ xuống.
            </>
          ) : (
            'Nội dung bạn đang tìm kiếm hiện không tồn tại hoặc đã được cập nhật đường dẫn mới.'
          )}
        </p>

        {/* 5-second countdown banner */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-6 text-xs text-slate-700">
          <div className="flex items-center justify-center gap-2 font-bold text-amber-900 mb-2">
            <RefreshCw className={`w-4 h-4 text-amber-600 ${!isPaused ? 'animate-spin' : ''}`} />
            <span>
              {isPaused ? (
                'Đã tạm dừng chuyển hướng'
              ) : (
                <>Tự động chuyển về {targetName} sau <span className="text-amber-600 font-black text-base px-1">{countdown}</span> giây</>
              )}
            </span>
          </div>

          <div className="w-full bg-amber-200/60 rounded-full h-1.5 mb-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline transition font-medium"
          >
            {isPaused ? 'Tiếp tục đếm ngược' : 'Tạm dừng chuyển hướng để ở lại trang'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href={targetUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Về {targetName} Ngay</span>
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Xem Danh Sách Bài Viết</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-4 border-t border-slate-100 text-xs">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Liên kết hữu ích
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 font-medium text-slate-600">
            <Link href="/bang-gia" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Bảng Báo Giá
            </Link>
            <Link href="/du-an" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Dự Án
            </Link>
            <Link href="/lien-he" className="hover:text-amber-600 transition px-2 py-1 bg-slate-50 rounded-lg">
              Liên Hệ
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
        <span>Hotline tư vấn kỹ thuật & giao hàng: <a href="tel:0988266293" className="font-bold text-slate-700 hover:text-amber-600">0988 2662 93</a></span>
      </div>
    </div>
  );
}
