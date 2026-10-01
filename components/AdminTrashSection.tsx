'use client';

import React, { useState, useMemo } from 'react';
import { TrashItem } from '@/lib/types';
import {
  Trash2, RotateCcw, AlertTriangle, Search, Filter,
  FileText, Building2, Globe, Image as ImageIcon, Tag,
  Clock, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';

interface AdminTrashSectionProps {
  trash: TrashItem[];
  onRestore: (trashId: string) => Promise<boolean>;
  onDeletePermanently: (trashId: string) => Promise<void>;
  onEmptyTrash: () => Promise<void>;
}

export default function AdminTrashSection({
  trash,
  onRestore,
  onDeletePermanently,
  onEmptyTrash
}: AdminTrashSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'project' | 'page' | 'media' | 'category'>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTime] = useState(() => Date.now());

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Filtered trash items
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return trash.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch =
        !term ||
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.originalId?.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [trash, typeFilter, searchTerm]);

  // Count by type
  const counts = useMemo(() => {
    const res = { all: trash.length, post: 0, project: 0, page: 0, media: 0, category: 0 };
    trash.forEach((t) => {
      if (t.type in res) {
        (res as any)[t.type]++;
      }
    });
    return res;
  }, [trash]);

  // Helper to calculate days remaining
  const getDaysRemaining = (item: TrashItem, now = currentTime): { days: number; text: string; isExpiringSoon: boolean } => {
    const expTime = item.expiresAt
      ? new Date(item.expiresAt).getTime()
      : new Date(item.deletedAt).getTime() + 30 * 24 * 60 * 60 * 1000;
    const diffMs = expTime - now;
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    if (days <= 0) {
      return { days: 0, text: 'Hết hạn hôm nay', isExpiringSoon: true };
    }
    if (days === 1) {
      return { days: 1, text: 'Còn 1 ngày (Sắp xóa)', isExpiringSoon: true };
    }
    return {
      days,
      text: `Còn ${days} ngày`,
      isExpiringSoon: days <= 3
    };
  };

  const getTypeBadge = (type: TrashItem['type']) => {
    switch (type) {
      case 'post':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <FileText className="w-3 h-3" />
            <span>Bài viết</span>
          </span>
        );
      case 'project':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Building2 className="w-3 h-3" />
            <span>Dự án</span>
          </span>
        );
      case 'page':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Globe className="w-3 h-3" />
            <span>Trang tĩnh</span>
          </span>
        );
      case 'media':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ImageIcon className="w-3 h-3" />
            <span>Tệp hình ảnh / tài liệu</span>
          </span>
        );
      case 'category':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Tag className="w-3 h-3" />
            <span>Chuyên mục</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
            <span>Dữ liệu</span>
          </span>
        );
    }
  };

  const handleRestore = async (item: TrashItem) => {
    setIsProcessing(true);
    try {
      const ok = await onRestore(item.id);
      if (ok) {
        showToast(`Đã khôi phục thành công "${item.title || 'mục'}" về vị trí ban đầu!`);
      } else {
        alert('Khôi phục thất bại, vui lòng thử lại.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePermanently = async (item: TrashItem) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN "${item.title}"?\nHành động này không thể hoàn tác!`)) {
      return;
    }
    setIsProcessing(true);
    try {
      await onDeletePermanently(item.id);
      showToast(`Đã xóa vĩnh viễn "${item.title}" khỏi thùng rác!`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmptyTrash = async () => {
    if (trash.length === 0) return;
    if (
      !confirm(
        `CẢNH BÁO: Bạn sắp dọn sạch toàn bộ ${trash.length} mục trong thùng rác.\nTất cả dữ liệu đã xóa sẽ bị hủy vĩnh viễn và không thể khôi phục lại.\n\nBạn có chắc chắn muốn dọn sạch không?`
      )
    ) {
      return;
    }
    setIsProcessing(true);
    try {
      await onEmptyTrash();
      showToast('Đã dọn sạch thùng rác thành công!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold mb-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-700" />
            <span>Thùng Rác &amp; Bảo Vệ Dữ Liệu An Toàn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Quản Lý Thùng Rác</span>
            <span className="text-sm bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
              {trash.length} mục đã xóa
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu giữ toàn bộ bài viết, dự án, trang tĩnh, tệp tin media và chuyên mục đã xóa trong <strong>30 ngày</strong>.
            Dữ liệu quá hạn 30 ngày sẽ được hệ thống tự động xóa vĩnh viễn.
          </p>
        </div>

        {trash.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleEmptyTrash}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Dọn Sạch Thùng Rác</span>
            </button>
          </div>
        )}
      </div>

      {/* 30-Day Auto Purge Notification Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Chính sách bảo lưu &amp; Tự động dọn dẹp sau 30 ngày:</div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Mọi thao tác xóa trong trang quản trị sẽ được chuyển vào đây thay vì xóa ngay lập tức.
            Bạn có thể <strong>Khôi phục (Restore)</strong> bất kỳ lúc nào để đưa dữ liệu trở lại website ngay lập tức.
            Nếu không khôi phục, sau đúng 30 ngày kể từ lúc xóa, hệ thống sẽ tự động loại bỏ vĩnh viễn để bảo đảm dung lượng lưu trữ luôn gọn gàng.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, đường dẫn, ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({counts.all})
            </button>
            <button
              onClick={() => setTypeFilter('post')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'post'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Bài viết ({counts.post})
            </button>
            <button
              onClick={() => setTypeFilter('media')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'media'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              Tệp Media ({counts.media})
            </button>
            <button
              onClick={() => setTypeFilter('project')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'project'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Dự án ({counts.project})
            </button>
            <button
              onClick={() => setTypeFilter('page')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'page'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              Trang ({counts.page})
            </button>
            <button
              onClick={() => setTypeFilter('category')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                typeFilter === 'category'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Chuyên mục ({counts.category})
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Trash2 className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Thùng rác trống</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {trash.length === 0
                ? 'Tuyệt vời! Hiện tại không có bất kỳ dữ liệu nào bị xóa trong thùng rác.'
                : 'Không tìm thấy mục nào phù hợp với bộ lọc hiện tại.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const exp = getDaysRemaining(item);
            const isMedia = item.type === 'media';
            const mediaUrl = isMedia && item.data?.url ? item.data.url : null;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Media Thumbnail Preview if available */}
                  {mediaUrl && (
                    <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(item.type)}
                      <h4 className="font-bold text-sm text-slate-900 truncate" title={item.title}>
                        {item.title || '(Không có tiêu đề)'}
                      </h4>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="font-mono text-slate-400">ID gốc: {item.originalId}</span>
                      <span>•</span>
                      <span>
                        Xóa ngày: {new Date(item.deletedAt).toLocaleDateString('vi-VN')} {new Date(item.deletedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          exp.isExpiringSoon ? 'text-rose-600 font-bold' : 'text-amber-700'
                        }`}
                      >
                        ⏱ {exp.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleRestore(item)}
                    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition disabled:opacity-50 cursor-pointer"
                    title="Khôi phục lại dữ liệu này về trang web"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi Phục</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDeletePermanently(item)}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 px-3 py-2 rounded-xl font-semibold text-xs transition disabled:opacity-50 cursor-pointer"
                    title="Xóa vĩnh viễn ngay lập tức"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
