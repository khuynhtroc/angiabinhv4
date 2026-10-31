'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log client error for debugging
    console.error('[App Error Boundary Caught]:', error);
  }, [error]);

  const handleClearCacheAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear potential corrupted store caches
        const keysToRemove = [
          'agiabinh_app_storage_version',
          'agiabinh_analytics',
          'agiabinh_social_listening_config',
          'agiabinh_industry_news',
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn('Error clearing cache:', e);
    }
    window.location.reload();
  };

  const handleCopyError = () => {
    const errorText = `[Bê Tông An Gia Bình Error]\nMessage: ${error?.message || 'Unknown'}\nDigest: ${error?.digest || 'N/A'}\nStack: ${error?.stack || 'N/A'}\nURL: ${typeof window !== 'undefined' ? window.location.href : ''}`;
    navigator.clipboard?.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl mb-4 shadow-sm">
        !
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        Đã Xảy Ra Sự Cố
      </h1>
      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        Hệ thống đang gặp sự cố tạm thời khi tải nội dung trang này. Vui lòng nhấn thử lại hoặc quay về trang chủ.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-sm cursor-pointer"
        >
          Thử Lại
        </button>

        <button
          onClick={handleClearCacheAndReload}
          className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm transition shadow-2xs cursor-pointer"
          title="Xóa bộ nhớ đệm tạm thời bị xung đột và làm mới trang"
        >
          Khôi Phục &amp; Xóa Cache
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition shadow-sm"
        >
          Về Trang Chủ
        </Link>
      </div>

      {/* Technical details toggle for admin debugging */}
      <div className="max-w-xl w-full text-left">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline mx-auto block mb-2 cursor-pointer"
        >
          {showDetails ? '▲ Ẩn chi tiết kỹ thuật' : '▼ Chi tiết sự cố kỹ thuật (Dành cho Quản Trị Viên)'}
        </button>

        {showDetails && (
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono space-y-2 border border-slate-800 shadow-lg animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold">Lỗi Kỹ Thuật (Client Error)</span>
              <button
                type="button"
                onClick={handleCopyError}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 transition"
              >
                {copied ? '✓ Đã sao chép' : 'Sao chép lỗi'}
              </button>
            </div>
            <div className="text-rose-400 font-bold break-words">
              {error?.message || 'Không có mô tả lỗi cụ thể'}
            </div>
            {error?.digest && (
              <div className="text-slate-400 text-[11px]">
                Digest ID: <span className="text-slate-300">{error.digest}</span>
              </div>
            )}
            {error?.stack && (
              <div className="text-slate-500 text-[10px] max-h-40 overflow-y-auto whitespace-pre-wrap break-all pt-2 border-t border-slate-800/60">
                {error.stack}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
