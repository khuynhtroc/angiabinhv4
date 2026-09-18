'use client';

import React, { useState } from 'react';
import { FolderPlus, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddFolder: (folderPath: string) => void;
}

export default function AdminNewFolderModal({ isOpen, onClose, onAddFolder }: Props) {
  const [folderName, setFolderName] = useState('');
  const [parentDir, setParentDir] = useState('/images');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = folderName
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-_]/g, '-');

    if (!cleanName) {
      alert('Vui lòng nhập tên thư mục hợp lệ.');
      return;
    }

    const fullPath = `${parentDir}/${cleanName}`.replace(/\/+/g, '/');
    onAddFolder(fullPath);
    setFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Tạo Thư Mục Con Mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Thư mục gốc (Parent Directory)
            </label>
            <select
              value={parentDir}
              onChange={(e) => setParentDir(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
            >
              <option value="/images">/images (Hình ảnh)</option>
              <option value="/images/blog">/images/blog (Ảnh bài viết)</option>
              <option value="/images/du-an">/images/du-an (Ảnh công trình)</option>
              <option value="/documents">/documents (Tài liệu)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Tên thư mục con mới (slug) *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="ví dụ: tram-tron, xe-may, ky-thuat..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Đường dẫn sẽ là:{' '}
              <strong className="text-amber-700 font-mono">
                {parentDir}/{folderName || 'ten-thu-muc'}
              </strong>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tạo Thư Mục</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
