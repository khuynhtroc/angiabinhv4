'use client';

import React, { useState } from 'react';
import { MediaFolderItem } from '@/lib/types';
import { Link, Image, Check, X, Folder, AlertCircle } from 'lucide-react';

interface AdminAddMediaUrlModalProps {
  folders: MediaFolderItem[];
  defaultFolder: string;
  onClose: () => void;
  onSubmit: (url: string, name: string, folder: string, alt?: string) => void;
}

export default function AdminAddMediaUrlModal({
  folders,
  defaultFolder,
  onClose,
  onSubmit
}: AdminAddMediaUrlModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [folder, setFolder] = useState(defaultFolder || '/images/blog');
  const [alt, setAlt] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setPreviewError(false);
    if (!name) {
      // Auto deduce a readable name from URL
      try {
        const urlObj = new URL(newUrl);
        const segments = urlObj.pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        if (last) {
          setName(decodeURIComponent(last).replace(/[-_]/g, ' '));
        }
      } catch (e) {
        // Not a full URL yet
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const finalName = name.trim() || 'Tệp tải từ liên kết URL';
    onSubmit(url.trim(), finalName, folder, alt.trim() || finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Link className="w-5 h-5 text-amber-600" />
            <span>Thêm Tệp Tin Qua Liên Kết URL</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Đường Dẫn URL Trực Tiếp Của Tệp <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/... hoặc link CDN"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:border-amber-500 focus:bg-white"
            />
          </div>

          {url && (
            <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-center">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Xem trước tệp:</span>
              {!previewError ? (
                <img
                  src={url}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="max-h-36 mx-auto rounded-lg object-contain bg-white border border-slate-200"
                />
              ) : (
                <div className="text-amber-700 text-xs py-3 flex items-center justify-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Không thể tải bản xem trước (URL có thể là tệp tài liệu hoặc video)</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1">Tên Tệp Tin Hiển Thị</label>
            <input
              type="text"
              placeholder="Ví dụ: be-tong-tuoi-tram-khDefault-phu.jpg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Thư Mục Chứa Tệp</label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
              <Folder className="w-4 h-4 text-amber-600 shrink-0" />
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full bg-transparent font-mono text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.path}>{f.name} ({f.path})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Văn Bản Thay Thế (Alt Text chuẩn SEO)</label>
            <input
              type="text"
              placeholder="Ví dụ: Xe bồn bê tông An Gia Bình đổ móng tại Ninh Bình"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Thêm Vào Thư Viện</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
