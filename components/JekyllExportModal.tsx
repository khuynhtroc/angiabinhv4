'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { generateJekyllZipBundle } from '@/lib/jekyll-generator';
import { Download, CheckCircle2, FileCode, FolderArchive, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JekyllExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JekyllExportModal({ isOpen, onClose }: JekyllExportModalProps) {
  const { posts, projects, jekyllConfig, updateJekyllConfig } = useAppStore();

  const [siteTitle, setSiteTitle] = useState(jekyllConfig.title);
  const [siteUrl, setSiteUrl] = useState(jekyllConfig.url);
  const [theme, setTheme] = useState(jekyllConfig.theme);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    updateJekyllConfig({
      title: siteTitle,
      url: siteUrl,
      theme: theme
    });

    try {
      await generateJekyllZipBundle(
        { ...jekyllConfig, title: siteTitle, url: siteUrl, theme },
        posts,
        projects
      );
      setExportedSuccess(true);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error('Error generating Jekyll zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const copyDeployCommand = () => {
    navigator.clipboard.writeText('bundle install\nbundle exec jekyll serve');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold p-2"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Xuất Bản Mã Nguồn Tĩnh Jekyll (Static Site Generator)
            </h3>
            <p className="text-xs text-slate-500">
              Biến toàn bộ website Bê Tông An Gia Bình thành mã nguồn tĩnh Jekyll siêu nhẹ, tải trang tức thì và bảo mật tuyệt đối.
            </p>
          </div>
        </div>

        {/* Benefits banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1 mb-6">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Lợi Ích Khi Triển Khai Jekyll Với Bê Tông An Gia Bình:
          </div>
          <p className="text-amber-800/90 leading-relaxed">
            • <strong>Tốc độ tải trang cực nhanh:</strong> File HTML/CSS tĩnh nén sẵn qua CDN (Cloudflare/GitHub Pages), điểm Google PageSpeed 100/100.
            <br />
            • <strong>Bảo mật tối ưu 100%:</strong> Không có cơ sở dữ liệu động để bị SQL Injection, hacker không thể thâm nhập server.
            <br />
            • <strong>Chuẩn SEO tuyệt đối:</strong> Markdown Frontmatter chuẩn hóa Schema.org và sitemap.xml.
          </p>
        </div>

        {/* Form Settings */}
        <div className="space-y-4 mb-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tiêu Đề Website (_config.yml)
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên Miền / CNAME
              </label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Giao Diện / Chủ Đề Jekyll
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900"
            />
          </div>

          {/* Included files summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Cấu trúc gói ZIP tạo ra:</span>
              <span className="text-[11px] font-semibold text-amber-600">
                {posts.length} bài viết Markdown + {projects.length} dự án
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 space-y-1">
              <div>📁 _posts/ (Tự động chuyển toàn bộ bài viết sang file .md với YAML Frontmatter)</div>
              <div>📁 _layouts/ (default.html, post.html, project.html)</div>
              <div>📁 _includes/ (header.html, footer.html, analytics.html)</div>
              <div>📁 _data/ (projects.yml, prices.yml)</div>
              <div>📄 _config.yml, Gemfile, CNAME, 404.html, README.md</div>
            </div>
          </div>
        </div>

        {/* Deploy Terminal Instructions */}
        <div className="bg-slate-950 rounded-xl p-3.5 text-xs font-mono text-slate-300 mb-6 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Lệnh chạy thử Jekyll trên máy chủ hoặc Local:
            </span>
            <button
              onClick={copyDeployCommand}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
          <div className="text-emerald-400"># Giải nén file zip và chạy:</div>
          <div className="text-slate-200">bundle install</div>
          <div className="text-slate-200">bundle exec jekyll serve</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Đóng
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center gap-2 disabled:opacity-50 transition"
            id="jekyll-download-zip-btn"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang Đóng Gói Bundle ZIP...' : 'Tải Trọn Gói Mã Nguồn Jekyll (.ZIP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
