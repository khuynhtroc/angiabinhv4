'use client';

import React, { useState } from 'react';
import { BlogPost, SitePage } from '@/lib/types';
import {
  Sparkles, Check, RefreshCw, ArrowRight, ShieldCheck, Link2, FileText,
  AlertCircle, CheckCircle2, Sliders, Layers, Eye, Tag, Trash2, X
} from 'lucide-react';

interface AdminPostOptimizerModalProps {
  post: BlogPost;
  pages: SitePage[];
  otherPosts: BlogPost[];
  onClose: () => void;
  onApplyOptimized: (updatedPost: Partial<BlogPost>) => void;
}

export default function AdminPostOptimizerModal({
  post,
  pages,
  otherPosts,
  onClose,
  onApplyOptimized
}: AdminPostOptimizerModalProps) {
  const [primaryKeyword, setPrimaryKeyword] = useState(
    post.focusKeywords?.[0] || 'bê tông tươi ninh bình'
  );
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    post.focusKeywords?.slice(1).join(', ') || 'bê tông an gia bình, trạm trộn bê tông ninh bình, giá bê tông tươi'
  );

  // Default internal links options
  const defaultLinks = [
    { title: "Báo giá bê tông tươi Ninh Bình", url: "/bang-gia" },
    { title: "Giới thiệu trạm trộn An Gia Bình", url: "/gioi-thieu" },
    { title: "Quy trình kiểm định và sản xuất", url: "/quy-trinh-san-xuat" },
    { title: "Dự án công trình tiêu biểu", url: "/du-an" },
    { title: "Liên hệ đặt lịch đổ bê tông", url: "/lien-he" },
    { title: "Trang chủ Bê Tông An Gia Bình", url: "/" }
  ];

  // Also include 3 other related posts as internal links
  const postLinks = otherPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)
    .map(p => ({ title: p.title, url: `/blog/${p.slug}` }));

  const allAvailableLinks = [...defaultLinks, ...postLinks];

  const [selectedLinks, setSelectedLinks] = useState<Array<{ title: string; url: string }>>(
    defaultLinks.slice(0, 4)
  );

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(post.title);
  const [editableMetaDescription, setEditableMetaDescription] = useState(post.excerpt || '');
  const [optimizationResult, setOptimizationResult] = useState<{
    optimizedTitle: string;
    optimizedExcerpt: string;
    optimizedMetaDescription?: string;
    optimizedContent: string;
    wordCount: number;
    primaryKeyword: string;
    secondaryKeywords: string;
    seoScore: number;
    optimizationsApplied: string[];
  } | null>(null);

  const [previewTab, setPreviewTab] = useState<'optimized' | 'original' | 'diff'>('optimized');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLink = (linkItem: { title: string; url: string }) => {
    const exists = selectedLinks.some(l => l.url === linkItem.url);
    if (exists) {
      setSelectedLinks(selectedLinks.filter(l => l.url !== linkItem.url));
    } else {
      setSelectedLinks([...selectedLinks, linkItem]);
    }
  };

  const handleRunOptimize = async () => {
    if (!primaryKeyword.trim()) {
      setErrorMsg('Vui lòng nhập từ khóa chính để tối ưu!');
      return;
    }

    try {
      setIsOptimizing(true);
      setErrorMsg(null);

      const res = await fetch('/api/ai/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
          primaryKeyword: primaryKeyword.trim(),
          secondaryKeywords: secondaryKeywords.trim(),
          internalLinks: selectedLinks
        })
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối API tối ưu bài viết.');
      }

      const data = await res.json();
      setOptimizationResult(data);
      const metaDesc = data.optimizedMetaDescription || data.optimizedExcerpt || '';
      setEditableTitle(data.optimizedTitle || post.title);
      setEditableMetaDescription(metaDesc);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi tối ưu bài viết. Hãy thử lại!');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApply = () => {
    if (!optimizationResult) return;

    const keywordsArray = [
      optimizationResult.primaryKeyword,
      ...optimizationResult.secondaryKeywords.split(',').map(s => s.trim()).filter(Boolean)
    ];

    onApplyOptimized({
      title: editableTitle || optimizationResult.optimizedTitle,
      excerpt: editableMetaDescription || optimizationResult.optimizedExcerpt,
      content: optimizationResult.optimizedContent,
      focusKeywords: keywordsArray
    });

    onClose();
  };

  const originalWords = (post.content || '').trim().split(/\s+/).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  SEO Power-Up
                </span>
                <span className="text-xs text-slate-400">Tối Ưu Chuẩn On-Page Google</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Tối Ưu Hóa Bài Viết Bằng AI: Từ Khóa, Internal Link &amp; Lọc Rườm Rà
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Active Post Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-500 block">Bài viết đang xử lý:</span>
              <span className="font-extrabold text-slate-900 text-sm truncate block">{post.title}</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[11px] text-slate-500 block">Độ dài hiện tại:</span>
              <span className={`font-mono font-bold text-xs ${originalWords >= 1000 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {originalWords} từ {originalWords < 1000 && '(Cần mở rộng ≥ 1000 từ)'}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Config Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Keyword */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Từ Khóa Chính (Primary Keyword) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                placeholder="Ví dụ: bê tông tươi ninh bình"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Sẽ được đưa vào Tiêu đề, H2 đầu tiên, phần mở đầu và kết bài.
              </span>
            </div>

            {/* Secondary Keywords */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Các Từ Khóa Phụ (Secondary Keywords)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="Phân cách bởi dấu phẩy, ví dụ: mác bê tông, trạm trộn an gia bình"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Phân bổ đều vào các phần giải thích kỹ thuật và ví dụ thực tế.
              </span>
            </div>
          </div>

          {/* Internal Links Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-amber-600" />
                <span>Chọn Trang &amp; Bài Viết Cần Tự Động Chèn Internal Link:</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">
                Đã chọn: {selectedLinks.length} liên kết
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {allAvailableLinks.map((link) => {
                const isSelected = selectedLinks.some(l => l.url === link.url);
                return (
                  <div
                    key={link.url}
                    onClick={() => toggleLink(link)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs truncate">{link.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{link.url}</div>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-transparent'
                    }`}>
                      ✓
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              disabled={isOptimizing}
              onClick={handleRunOptimize}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs transition shadow-md disabled:opacity-60 cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang Tối Ưu Hóa &amp; Lồng Ghép Internal Links...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt Đầu Tối Ưu Hóa Bài Viết Ngay Bây Giờ</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {optimizationResult && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in">
              {/* Score & Summary Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                    {optimizationResult.seoScore}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-sm">
                      Điểm SEO On-Page Đạt Xuất Sắc!
                    </h4>
                    <p className="text-emerald-800 text-[11px]">
                      Độ dài sau tối ưu: <strong className="font-mono">{optimizationResult.wordCount} từ</strong> (Tăng +{optimizationResult.wordCount - originalWords} từ so với bản gốc)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApply}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Áp Dụng Bản Tối Ưu Này</span>
                </button>
              </div>

              {/* Optimizations Applied */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">Các cải tiến đã thực hiện tự động:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {optimizationResult.optimizationsApplied.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tối Ưu Thẻ Meta Description & Google SERP Preview */}
              <div className="p-4 bg-amber-50/50 border-2 border-amber-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      SEO
                    </span>
                    <h5 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                      Tối Ưu Thẻ Meta Description &amp; Google Snippet
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      editableMetaDescription.length >= 120 && editableMetaDescription.length <= 165
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {editableMetaDescription.length} / 160 ký tự ({
                        editableMetaDescription.length >= 120 && editableMetaDescription.length <= 165
                          ? 'Độ dài lý tưởng'
                          : editableMetaDescription.length < 120
                          ? 'Hơi ngắn'
                          : 'Hơi dài'
                      })
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nội dung thẻ Meta Description (Hiển thị trực tiếp trên kết quả tìm kiếm Google):
                  </label>
                  <textarea
                    rows={2}
                    value={editableMetaDescription}
                    onChange={(e) => setEditableMetaDescription(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-amber-500 font-medium leading-relaxed"
                    placeholder="Mô tả tóm tắt chuẩn SEO (120-160 ký tự)..."
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Xem trước kết quả tìm kiếm trên Google (SERP Preview):
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700">
                    <span className="text-emerald-700 font-medium">https://betongangiabinh.vn</span>
                    <span className="text-slate-400">› blog ›</span>
                    <span className="text-slate-500 font-mono text-[11px]">{post.slug}</span>
                  </div>
                  <div className="text-sm font-bold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                    {editableTitle || post.title}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {editableMetaDescription || 'Chưa có thẻ mô tả meta description.'}
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('optimized')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        previewTab === 'optimized' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Bản Tối Ưu Mới ({optimizationResult.wordCount} từ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('original')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                        previewTab === 'original' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Bản Gốc ({originalWords} từ)
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">Định dạng Markdown</span>
                </div>

                <div className="p-4 max-h-72 overflow-y-auto bg-slate-50 font-mono text-slate-800 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {previewTab === 'optimized' ? optimizationResult.optimizedContent : post.content}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs"
          >
            Đóng Lại
          </button>

          {optimizationResult && (
            <button
              type="button"
              onClick={handleApply}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Lưu &amp; Cập Nhật Vào Bài Viết</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
