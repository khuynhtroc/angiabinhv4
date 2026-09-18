'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Search, Replace, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export default function AdminSearchReplaceModal({ isOpen, onClose, posts }: Props) {
  const { batchReplaceInPosts } = useAppStore();

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [inTitle, setInTitle] = useState(true);
  const [inExcerpt, setInExcerpt] = useState(true);
  const [inContent, setInContent] = useState(true);
  const [inKeywords, setInKeywords] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Calculate live matching preview
  const previewMatches = useMemo(() => {
    if (!findText.trim() || findText.length < 1) {
      return { totalOccurrences: 0, matchingPosts: [] };
    }

    const flags = caseSensitive ? 'g' : 'gi';
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex: RegExp;
    try {
      regex = new RegExp(escaped, flags);
    } catch {
      return { totalOccurrences: 0, matchingPosts: [] };
    }

    let totalOccurrences = 0;
    const matchingPosts: Array<{
      post: BlogPost;
      count: number;
      titleMatches: number;
      contentSnippet: string | null;
    }> = [];

    posts.forEach(post => {
      let count = 0;
      let titleMatches = 0;

      if (inTitle && post.title) {
        const m = post.title.match(regex);
        if (m) {
          count += m.length;
          titleMatches += m.length;
        }
      }

      if (inExcerpt && post.excerpt) {
        const m = post.excerpt.match(regex);
        if (m) count += m.length;
      }

      let contentSnippet: string | null = null;
      if (inContent && post.content) {
        const m = post.content.match(regex);
        if (m) {
          count += m.length;
          const firstIndex = post.content.toLowerCase().indexOf(findText.toLowerCase());
          if (firstIndex > -1) {
            const start = Math.max(0, firstIndex - 40);
            const end = Math.min(post.content.length, firstIndex + findText.length + 50);
            contentSnippet = (start > 0 ? '...' : '') + post.content.slice(start, end) + (end < post.content.length ? '...' : '');
          }
        }
      }

      if (inKeywords && post.focusKeywords) {
        post.focusKeywords.forEach(kw => {
          const m = kw.match(regex);
          if (m) count += m.length;
        });
      }

      if (count > 0) {
        totalOccurrences += count;
        matchingPosts.push({
          post,
          count,
          titleMatches,
          contentSnippet
        });
      }
    });

    return { totalOccurrences, matchingPosts };
  }, [findText, inTitle, inExcerpt, inContent, inKeywords, caseSensitive, posts]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findText.trim()) {
      alert('Vui lòng nhập từ khóa hoặc ký tự cần tìm.');
      return;
    }

    if (previewMatches.totalOccurrences === 0) {
      alert(`Không tìm thấy từ khóa "${findText}" trong bất kỳ bài viết nào.`);
      return;
    }

    const confirmMsg = `Bạn có chắc chắn muốn thay thế "${findText}" bằng "${replaceText}" ở ${previewMatches.totalOccurrences} vị trí trong ${previewMatches.matchingPosts.length} bài viết?`;
    if (!confirm(confirmMsg)) return;

    const result = batchReplaceInPosts(findText, replaceText, {
      inTitle,
      inExcerpt,
      inContent,
      inKeywords,
      caseSensitive
    });

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    alert(`Đã hoàn tất! Đã thay thế thành công ${result.totalReplaced} lần trên ${result.modifiedPostsCount} bài viết.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Replace className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Tìm Kiếm &amp; Thay Thế Từ Khóa Trong Bài Viết
              </h3>
              <p className="text-xs text-slate-500">
                Quét toàn bộ {posts.length} bài viết và tự động cập nhật số điện thoại, địa danh, mã TCVN, hoặc từ khóa SEO
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

        {/* Modal Form */}
        <form onSubmit={handleExecute} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Từ khóa / ký tự cần tìm *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gián Khẩu, 098.xxx..."
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-semibold focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Thay thế bằng
              </label>
              <div className="relative">
                <Replace className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ví dụ: KCN Khánh Phú, 0988 2662 93..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-semibold focus:border-amber-500 text-amber-900"
                />
              </div>
            </div>
          </div>

          {/* Scope Checkboxes */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-slate-800 block text-xs">
              Phạm vi tìm kiếm &amp; thay thế:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inTitle}
                  onChange={(e) => setInTitle(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Tiêu đề bài viết</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inExcerpt}
                  onChange={(e) => setInExcerpt(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Đoạn tóm tắt (Excerpt)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inContent}
                  onChange={(e) => setInContent(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Toàn bộ nội dung bài</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inKeywords}
                  onChange={(e) => setInKeywords(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Từ khóa SEO Tags</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Phân biệt hoa / thường</span>
              </label>
            </div>
          </div>

          {/* Live Preview List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Kết quả tìm kiếm trực tiếp:
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                previewMatches.totalOccurrences > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
              }`}>
                Tìm thấy {previewMatches.totalOccurrences} lần trong {previewMatches.matchingPosts.length} bài
              </span>
            </div>

            {findText.trim() && previewMatches.matchingPosts.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500">
                {`Không tìm thấy bài viết nào chứa từ khóa "${findText}".`}
              </div>
            ) : null}

            {previewMatches.matchingPosts.length > 0 && (
              <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-2 bg-slate-50">
                {previewMatches.matchingPosts.map(({ post, count, contentSnippet }, idx) => (
                  <div key={post.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <div className="truncate max-w-md">
                        {idx + 1}. {post.title}
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                        {count} lần xuất hiện
                      </span>
                    </div>

                    {contentSnippet && (
                      <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg leading-relaxed">
                        {contentSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-slate-500 text-[11px]">
              Tác vụ sẽ cập nhật vĩnh viễn vào bộ nhớ lưu trữ hệ thống.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={previewMatches.totalOccurrences === 0}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <Replace className="w-4 h-4" />
                <span>
                  Thay Thế Tất Cả ({previewMatches.totalOccurrences} Vị Trí)
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
