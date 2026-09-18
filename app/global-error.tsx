'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error boundary caught:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center font-sans antialiased text-slate-900">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl mb-4">
          !
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          Đã Xảy Ra Lỗi Hệ Thống
        </h1>
        <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
          Giao diện ứng dụng gặp sự cố ngoài dự kiến. Vui lòng tải lại hoặc quay về trang chủ.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-sm cursor-pointer"
          >
            Tải Lại Trang
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition shadow-sm"
          >
            Về Trang Chủ
          </Link>
        </div>
      </body>
    </html>
  );
}
