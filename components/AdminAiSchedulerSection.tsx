'use client';

import React, { useState } from 'react';
import { AiSchedulerConfig, IndustryNewsItem, BlogPost, SitePage } from '@/lib/types';
import {
  Clock, Play, CheckCircle2, AlertCircle, RefreshCw, Calendar, Sparkles,
  Link2, BookOpen, FileText, Check, ArrowRight, ShieldCheck, ListOrdered, Tag
} from 'lucide-react';

interface AdminAiSchedulerSectionProps {
  config: AiSchedulerConfig;
  industryNews: IndustryNewsItem[];
  pages: SitePage[];
  posts: BlogPost[];
  onSaveScheduler: (config: Partial<AiSchedulerConfig>) => void;
  onExecuteSchedulerNow: (candidateNews: IndustryNewsItem) => Promise<BlogPost | null>;
}

export default function AdminAiSchedulerSection({
  config,
  industryNews,
  pages,
  posts,
  onSaveScheduler,
  onExecuteSchedulerNow
}: AdminAiSchedulerSectionProps) {
  const [formData, setFormData] = useState<AiSchedulerConfig>(config);
  const [isRunningNow, setIsRunningNow] = useState(false);
  const [runMessage, setRunMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available internal links for selection
  const defaultPageLinks = [
    { title: "Bảng Báo Giá Bê Tông Ninh Bình", url: "/bang-gia" },
    { title: "Giới Thiệu Trạm Trộn An Gia Bình", url: "/gioi-thieu" },
    { title: "Quy Trình Sản Xuất & Thí Nghiệm LAS", url: "/quy-trinh-san-xuat" },
    { title: "Dự Án Công Trình Tiêu Biểu", url: "/du-an" },
    { title: "Liên Hệ Khảo Sát & Đặt Xe Bồn", url: "/lien-he" },
    { title: "Trang Chủ Bê Tông An Gia Bình", url: "/" }
  ];

  const handleUpdate = (updates: Partial<AiSchedulerConfig>) => {
    const updated = { ...formData, ...updates };
    setFormData(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveScheduler(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const toggleInternalLink = (linkItem: { title: string; url: string }) => {
    const current = formData.selectedInternalLinks || [];
    const exists = current.some(l => l.url === linkItem.url);
    const updated = exists
      ? current.filter(l => l.url !== linkItem.url)
      : [...current, linkItem];

    handleUpdate({ selectedInternalLinks: updated });
  };

  const handleRunNow = async () => {
    // Find first unwritten or latest news item
    const unwrittenNews = industryNews.find(n => !n.rewrittenPostId) || industryNews[0];
    if (!unwrittenNews) {
      setRunMessage({
        type: 'error',
        text: 'Không tìm thấy tin tức ngành nào trong danh sách quét. Hãy quét tin trước!'
      });
      return;
    }

    try {
      setIsRunningNow(true);
      setRunMessage(null);
      const generated = await onExecuteSchedulerNow(unwrittenNews);
      if (generated) {
        setRunMessage({
          type: 'success',
          text: `Đã chạy lập lịch thành công! Đã tự động tạo & xuất bản bài viết chuẩn SEO: "${generated.title}"`
        });
      }
    } catch (err) {
      setRunMessage({
        type: 'error',
        text: 'Có lỗi xảy ra khi thực thi lập lịch. Vui lòng kiểm tra lại kết nối API.'
      });
    } finally {
      setIsRunningNow(false);
    }
  };

  const unwrittenCount = industryNews.filter(n => !n.rewrittenPostId).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-900 font-bold text-xs uppercase mb-2">
            <Clock className="w-3.5 h-3.5 text-violet-700" />
            <span>AI Auto-Scheduler &amp; Content Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Lập Lịch Tự Động &amp; Xuất Bản Bài Viết Định Kỳ
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tự động lấy tin tức ngành quét được, viết lại thành bài viết chuyên sâu chuẩn SEO tối thiểu 1.000 từ, tự động lồng ghép từ khóa chính/phụ và liên kết nội bộ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isRunningNow}
            onClick={handleRunNow}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black px-4 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-60 cursor-pointer"
          >
            {isRunningNow ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang Phân Tích &amp; Viết Bài (1000+ từ)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Kích Hoạt Chạy Ngay Bây Giờ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {runMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
          runMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {runMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{runMessage.text}</span>
        </div>
      )}

      {/* Info Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-slate-500 text-xs font-semibold">Trạng Thái Tự Động</span>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-sm font-black ${(formData.enabled ?? formData.isEnabled) ? 'text-emerald-600' : 'text-slate-400'}`}>
              {(formData.enabled ?? formData.isEnabled) ? 'ĐANG KÍCH HOẠT' : 'ĐANG TẠM DỪNG'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.enabled ?? formData.isEnabled)}
                onChange={(e) => handleUpdate({ enabled: e.target.checked, isEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-xs font-semibold">Kho Tin Quét Sẵn Sàng</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{unwrittenCount}</span>
            <span className="text-xs text-slate-500">tin chưa viết lại / tổng {industryNews.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-xs font-semibold">Yêu Cầu Độ Dài</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-violet-600">≥ {formData.minWordCount || 1000}</span>
            <span className="text-xs text-slate-500">từ / bài viết</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-xs font-semibold">Tần Suất &amp; Khung Giờ</span>
          <div className="mt-2 text-xs font-bold text-slate-900">
            {formData.frequency === 'daily' ? 'Hằng Ngày' : formData.frequency === 'every_2_days' ? 'Mỗi 2 Ngày' : 'Hằng Tuần'} vào lúc {formData.publishTime || '07:30'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Settings Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Timing & Category */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              <span>1. Cấu Hình Chu Kỳ &amp; Lịch Trình</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tần Suất Xuất Bản</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleUpdate({ frequency: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-semibold"
                >
                  <option value="daily">Hằng ngày (Mỗi ngày 1 bài)</option>
                  <option value="every_2_days">Mỗi 2 ngày (Cách nhật)</option>
                  <option value="weekly">Hằng tuần (Mỗi tuần 1 bài)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giờ Xuất Bản (Giờ Vàng)</label>
                <input
                  type="time"
                  value={formData.publishTime}
                  onChange={(e) => handleUpdate({ publishTime: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-bold font-mono"
                >
                </input>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chuyên Mục Mặc Định Lưu Bài Viết</label>
              <select
                value={formData.targetCategory}
                onChange={(e) => handleUpdate({ targetCategory: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-medium"
              >
                <option value="Kinh Nghiệm">Kinh Nghiệm (Kỹ thuật thi công, mẹo đổ sàn)</option>
                <option value="Tin Tức">Tin Tức (Thị trường vật liệu &amp; xây dựng Ninh Bình)</option>
                <option value="Kiến Thức Bê Tông">Kiến Thức Bê Tông (Mác bê tông, tiêu chuẩn TCVN)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Yêu Cầu Độ Dài Tối Thiểu</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1000}
                  step={100}
                  value={formData.minWordCount || 1000}
                  onChange={(e) => handleUpdate({ minWordCount: Number(e.target.value) })}
                  className="w-36 bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-bold text-center"
                />
                <span className="text-slate-500 font-semibold">từ (Từ 1.000 từ trở lên theo tiêu chuẩn bài viết dài chuyên sâu)</span>
              </div>
            </div>
          </div>

          {/* Right: SEO Keywords & Focus Topic */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <Tag className="w-4 h-4 text-violet-600" />
              <span>2. Định Hướng Chủ Đề &amp; Bộ Từ Khóa SEO</span>
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chủ Đề Trọng Tâm AI Tập Trung Viết (Focus Topic)
              </label>
              <textarea
                rows={2}
                value={formData.focusTopic}
                onChange={(e) => handleUpdate({ focusTopic: e.target.value })}
                placeholder="Ví dụ: Ứng dụng công nghệ trạm trộn tự động, kiểm soát cấp phối mác 200-350 và bảo dưỡng bê tông thương phẩm chuẩn TCVN tại Ninh Bình"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Từ Khóa Chính Bắt Buộc (Primary Keyword) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.primaryKeyword}
                onChange={(e) => handleUpdate({ primaryKeyword: e.target.value })}
                placeholder="bê tông tươi ninh bình"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-bold text-violet-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                AI sẽ tự động đưa từ khóa chính vào Tiêu đề (H1), đoạn mở đầu, H2/H3 và kết luận với mật độ 1.5% - 2.5%.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Từ Khóa Phụ Liên Quan (Secondary Keywords)
              </label>
              <input
                type="text"
                value={formData.secondaryKeywords}
                onChange={(e) => handleUpdate({ secondaryKeywords: e.target.value })}
                placeholder="bê tông an gia bình, trạm trộn bê tông ninh bình, giá bê tông tươi, kỹ thuật đổ bê tông"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Internal Links Selector */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4 text-violet-600" />
              <span>3. Khai Báo Liên Kết Nội Bộ (Internal Links) Để AI Tự Động Lồng Ghép</span>
            </h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoInsertInternalLinks}
                onChange={(e) => handleUpdate({ autoInsertInternalLinks: e.target.checked })}
                className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
              />
              <span className="font-bold text-slate-800 text-xs">Tự động chèn liên kết vào các đoạn văn phù hợp</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Đánh dấu chọn các trang đích quan trọng dưới đây. AI sẽ tự động phân tích ngữ cảnh bài viết và chèn liên kết dạng <code>[từ khóa neo](/duong-dan)</code> để tăng sức mạnh SEO On-Page cho toàn bộ website.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {defaultPageLinks.map((link) => {
              const isSelected = (formData.selectedInternalLinks || []).some(l => l.url === link.url);
              return (
                <div
                  key={link.url}
                  onClick={() => toggleInternalLink(link)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-violet-50/80 border-violet-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-slate-900 text-xs truncate">{link.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">{link.url}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs font-black shrink-0 ${
                    isSelected
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'bg-white border-slate-300 text-transparent'
                  }`}>
                    ✓
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: History Logs */}
        {formData.historyLogs && formData.historyLogs.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-violet-600" />
              <span>Nhật Ký Chạy Lập Lịch Gần Đây ({formData.historyLogs.length})</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Thời Điểm</th>
                    <th className="py-2.5 px-3">Tin Gốc</th>
                    <th className="py-2.5 px-3">Bài Viết Tự Động Tạo</th>
                    <th className="py-2.5 px-3 text-center">Độ Dài</th>
                    <th className="py-2.5 px-3 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white transition">
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium max-w-xs truncate">
                        {log.newsTitle}
                      </td>
                      <td className="py-2.5 px-3 text-violet-900 font-bold max-w-sm truncate">
                        {log.generatedTitle}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono">
                        <span className="bg-violet-100 text-violet-900 px-2 py-0.5 rounded text-[11px]">
                          {log.wordCount} từ
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <Check className="w-3 h-3" />
                          Đã xuất bản
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Đã lưu cấu hình Lập Lịch &amp; Tự Động Xuất Bản thành công!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Cấu Hình Lập Lịch AI</span>
          </button>
        </div>
      </form>
    </div>
  );
}
