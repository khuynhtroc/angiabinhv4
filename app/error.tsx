'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error for debugging
    console.error('App Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl mb-4">
        !
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        Đã Xảy Ra Sự Cố
      </h1>
      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        Hệ thống đang gặp sự cố tạm thời khi tải nội dung trang này. Vui lòng nhấn thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-sm cursor-pointer"
        >
          Thử Lại
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition shadow-sm"
        >
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
