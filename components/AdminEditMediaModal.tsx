'use client';

import React, { useState } from 'react';
import { MediaFile } from '@/lib/types';
import { Edit3, FileText, CheckCircle2, Copy, Check } from 'lucide-react';

interface Props {
  file: MediaFile | null;
  isOpen: boolean;
  availableFolders: string[];
  onClose: () => void;
  onSave: (updatedFile: MediaFile) => void;
}

function EditMediaContent({
  file,
  availableFolders,
  onClose,
  onSave
}: {
  file: MediaFile;
  availableFolders: string[];
  onClose: () => void;
  onSave: (updatedFile: MediaFile) => void;
}) {
  const [name, setName] = useState(file.name || '');
  const [folder, setFolder] = useState(file.folder || '/images/blog');
  const [path, setPath] = useState(file.path || `${file.folder || '/images/blog'}/${file.name}`);
  const [url, setUrl] = useState(file.url || '');
  const [copiedTag, setCopiedTag] = useState(false);

  const handleFolderChange = (newFolder: string) => {
    setFolder(newFolder);
    if (!path || path.startsWith('/images/')) {
      const cleanName = name || file.name;
      setPath(`${newFolder}/${cleanName}`);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!path || path.startsWith('/images/')) {
      setPath(`${folder}/${newName}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên tệp tin.');
      return;
    }

    const updated: MediaFile = {
      ...file,
      name: name.trim(),
      folder: folder.trim(),
      path: path.trim() || `${folder.trim()}/${name.trim()}`,
      url: url.trim() || file.url
    };

    onSave(updated);
    alert('Đã cập nhật thông tin và đường dẫn tệp tin thành công!');
    onClose();
  };

  const jekyllMarkdownTag = `![${name || file.name}]({{ site.url }}${path || file.path || file.url})`;

  const handleCopyTag = () => {
    navigator.clipboard.writeText(jekyllMarkdownTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
      {/* File Preview */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
          {file.type === 'image' ? (
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <FileText className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-slate-900 truncate">{file.name}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">Dung lượng: {file.size} • Loại: {file.type}</div>
          <div className="text-[10px] text-amber-700 font-mono mt-0.5 truncate">{file.path || file.url}</div>
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-800 mb-1">
          Tên tệp tin (File Name) *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="be-tong-thuong-pham-an-gia-binh.jpg"
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-800 mb-1">
            Thư mục con (Subfolder)
          </label>
          <select
            value={folder}
            onChange={(e) => handleFolderChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:border-amber-500"
          >
            {availableFolders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1">
            Đường dẫn tĩnh tương đối (Static Path) *
          </label>
          <input
            type="text"
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/images/blog/be-tong-thuong-pham-an-gia-binh.jpg"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-amber-900 font-bold focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-800 mb-1">
          URL Nguồn Thực Tế (Source CDN / Base64 / Local URL)
        </label>
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-mono text-[11px] focus:border-amber-500"
        />
      </div>

      {/* Jekyll Markdown Syntax Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-900 text-xs">
            Cú pháp chèn Markdown trong bài viết:
          </span>
          <button
            type="button"
            onClick={handleCopyTag}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs"
          >
            {copiedTag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedTag ? 'Đã sao chép' : 'Sao chép mã'}</span>
          </button>
        </div>
        <code className="block bg-white p-2.5 rounded-xl border border-amber-200 font-mono text-[11px] text-amber-950 break-all select-all">
          {jekyllMarkdownTag}
        </code>
        <p className="text-[10px] text-amber-800 italic">
          Khi chèn vào bài viết, hệ thống sẽ tự động hiển thị hình ảnh chuẩn xác thay vì để dòng code.
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Lưu Cập Nhật Tệp Tin</span>
        </button>
      </div>
    </form>
  );
}

export default function AdminEditMediaModal({
  file,
  isOpen,
  availableFolders,
  onClose,
  onSave
}: Props) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Sửa Đổi URL &amp; Đường Dẫn Tệp Tin
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật URL tĩnh, thư mục con hoặc liên kết nguồn của tệp tin tải lên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        <EditMediaContent
          key={file.id}
          file={file}
          availableFolders={availableFolders}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
