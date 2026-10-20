'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio, TrendingUp, Flame, Sparkles, Globe, RefreshCw, CheckCircle2,
  ExternalLink, Send, Calendar, Filter, Zap, ShieldCheck, AlertCircle,
  Newspaper, Clock, ArrowRight, Check, Search
} from 'lucide-react';
import { TrendingNewsItem, SocialListeningConfig, DEFAULT_SOCIAL_LISTENING_CONFIG } from '@/lib/social-listening';

interface AdminSocialListeningSectionProps {
  onPostPublished?: (newPost: any) => void;
  onSubmitGoogleIndex?: (url: string) => Promise<any>;
}

export default function AdminSocialListeningSection({
  onPostPublished,
  onSubmitGoogleIndex
}: AdminSocialListeningSectionProps) {
  const [trends, setTrends] = useState<TrendingNewsItem[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [config, setConfig] = useState<SocialListeningConfig>(DEFAULT_SOCIAL_LISTENING_CONFIG);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [writingTrendId, setWritingTrendId] = useState<string | null>(null);
  const [autoPilotRunning, setAutoPilotRunning] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [pushingIndexUrl, setPushingIndexUrl] = useState<string | null>(null);
  const [pushIndexSuccess, setPushIndexSuccess] = useState<string | null>(null);

  // Load config & trends on mount
  useEffect(() => {
    loadConfig();
    fetchTrends();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/ai/social-listening/config');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (err) {
      console.warn('Failed to load social listening config:', err);
    }
  };

  const fetchTrends = async () => {
    setLoadingTrends(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/ai/social-listening/trends');
      const data = await res.json();
      if (data.success && Array.isArray(data.trends)) {
        setTrends(data.trends);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Không thể quét danh sách xu hướng.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Lỗi kết nối khi quét xu hướng: ' + (err?.message || '') });
    } finally {
      setLoadingTrends(false);
    }
  };

  const saveConfig = async (newConfig: Partial<SocialListeningConfig>) => {
    setSavingConfig(true);
    try {
      const updated = { ...config, ...newConfig };
      const res = await fetch('/api/ai/social-listening/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigSavedToast(true);
        setTimeout(() => setConfigSavedToast(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleWriteArticle = async (trend: TrendingNewsItem) => {
    setWritingTrendId(trend.id);
    setActionMessage(null);
    try {
      const res = await fetch('/api/ai/social-listening/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setActionMessage({
          type: 'success',
          text: `Xuất bản thành công: "${data.post.title}" (${data.wordCount} từ). Đã tự động bắn URL lên Google Indexing API!`
        });

        // Mark trend as written locally
        setTrends(prev => prev.map(t => t.id === trend.id ? { ...t, hasBeenWritten: true, writtenPostSlug: data.post.slug } : t));

        if (onPostPublished) {
          onPostPublished(data.post);
        }

        // Refresh config to get new logs
        loadConfig();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Lỗi khi tạo bài viết.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Lỗi thực thi: ' + (err?.message || '') });
    } finally {
      setWritingTrendId(null);
    }
  };

  const handleRunAutoPilotNow = async () => {
    setAutoPilotRunning(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/ai/social-listening/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPick: true })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setActionMessage({
          type: 'success',
          text: `Auto-Pilot hoàn tất: "${data.post.title}" (${data.wordCount} từ) đã xuất bản tại ${data.canonicalUrl}`
        });
        if (onPostPublished) {
          onPostPublished(data.post);
        }
        fetchTrends();
        loadConfig();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Không tìm thấy tin phù hợp.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: 'Lỗi chạy Auto-Pilot: ' + (err?.message || '') });
    } finally {
      setAutoPilotRunning(false);
    }
  };

  const handlePushIndexNow = async (url: string) => {
    setPushingIndexUrl(url);
    try {
      if (onSubmitGoogleIndex) {
        await onSubmitGoogleIndex(url);
      } else {
        const res = await fetch('/api/admin/google-indexing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, action: 'submit_single' })
        });
        await res.json();
      }
      setPushIndexSuccess(url);
      setTimeout(() => setPushIndexSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit indexing:', err);
    } finally {
      setPushingIndexUrl(null);
    }
  };

  // Filtered trends
  const filteredTrends = trends.filter(t => {
    if (activeCategoryFilter !== 'all' && t.category !== activeCategoryFilter) {
      return false;
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const match = t.title.toLowerCase().includes(kw) ||
        t.snippet.toLowerCase().includes(kw) ||
        t.focusKeywords.some(k => k.toLowerCase().includes(kw));
      if (!match) return false;
    }
    return true;
  });

  const categoriesList = [
    { id: 'all', label: 'Tất Cả Điểm Nóng' },
    { id: 'Vật Liệu Xây Dựng', label: 'Vật Liệu & Giá Cả' },
    { id: 'Hạ Tầng Giao Thông', label: 'Hạ Tầng & Cao Tốc' },
    { id: 'Thời Tiết & Khí Hậu Xây Dựng', label: 'Thời Tiết & Bão Lũ' },
    { id: 'Thị Trường BĐS & Tài Chính', label: 'BĐS & Tài Chính' },
    { id: 'Chính Sách & Quy Chuẩn', label: 'Quy Chuẩn TCVN' },
    { id: 'Thời Sự Thị Trường', label: 'Thời Sự Chung' }
  ];

  const highestScoreTrend = trends.length > 0 ? trends[0] : null;
  const unwrittenCount = trends.filter(t => !t.hasBeenWritten).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Auto-Pilot Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span>Social Listening Real-time (4h - 24h)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Điểm Nóng Thị Trường &amp; Auto-Pilot Tin Tức 24h
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Tự động bắt trọn các xu hướng bùng nổ tìm kiếm từ <strong className="text-amber-400">Google Trends Việt Nam</strong>, VnExpress, CafeF, Báo Giao Thông &amp; Báo Xây Dựng. Áp dụng kỹ thuật <em>Newsjacking</em> để viết bài thời sự 1.500 - 2.500 từ kết nối góc nhìn kỹ sư Bê Tông An Gia Bình, lưu vào thư mục <code className="bg-black/40 text-amber-300 px-2 py-0.5 rounded text-xs">/blog/tin-tuc/[slug].html</code> và tự động push Google Indexing API!
            </p>
          </div>

          {/* Auto-Pilot Toggle Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 shrink-0 lg:w-80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-5 h-5 ${config.autoPilotEnabled ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                <span className="font-bold text-sm">Chế Độ Auto-Pilot 24/7</span>
              </div>
              <button
                type="button"
                onClick={() => saveConfig({ autoPilotEnabled: !config.autoPilotEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.autoPilotEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.autoPilotEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span>Ngưỡng điểm tối thiểu:</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                  &ge; {config.minTrendScore || 65} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Chu kỳ quét:</span>
                <span className="font-bold text-slate-200">{config.checkIntervalHours || 4} giờ / lần</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Đã xuất bản tự động:</span>
                <span className="font-bold text-emerald-400">{config.autoPublishedCount || 0} bài</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={handleRunAutoPilotNow}
                disabled={autoPilotRunning}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-current" />
                <span>{autoPilotRunning ? 'Đang Chạy Auto-Pilot...' : 'Kích Hoạt Viết 1 Bài Ngay'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Messages */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold leading-relaxed">{actionMessage.text}</span>
        </div>
      )}

      {configSavedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công cấu hình Social Listening Auto-Pilot!</span>
        </div>
      )}

      {/* 2. Stats Quick Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Xu Hướng Đang Quét</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
            <span>{trends.length}</span>
            <span className="text-xs font-semibold text-slate-500">chủ đề</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {unwrittenCount} chủ đề chưa khai thác
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm Xu Hướng Cao Nhất</div>
          <div className="text-2xl font-black text-rose-600 mt-1 flex items-baseline gap-2">
            <span>{highestScoreTrend?.trendScore || 0}</span>
            <span className="text-xs font-semibold text-slate-400">/ 100 đ</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate mt-1">
            {highestScoreTrend?.title || 'Chưa có'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thư Mục Đích URL</div>
          <div className="text-base font-black text-amber-700 mt-1 truncate">
            /blog/tin-tuc/[slug].html
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Chuẩn Google News &amp; Discover
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tự Động Bắn Google Index</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Kích Hoạt</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Đồng bộ Google &amp; IndexNow
          </div>
        </div>
      </div>

      {/* 3. Settings Drawer / Collapsible Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tinh Chỉnh Thông Số Auto-Pilot</span>
          </h3>
          <span className="text-xs text-slate-500">Tự động chọn đề tài và viết bài khi có trend nóng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ngưỡng điểm tối thiểu (Trend Score)
            </label>
            <select
              value={config.minTrendScore || 65}
              onChange={(e) => saveConfig({ minTrendScore: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500"
            >
              <option value={50}>50 điểm (Bắt tất cả tin tức có liên quan)</option>
              <option value={60}>60 điểm (Tin tức khá nóng)</option>
              <option value={65}>65 điểm (Khuyên dùng - Cân bằng &amp; chuẩn SEO)</option>
              <option value={75}>75 điểm (Chỉ viết các sự kiện bùng nổ tìm kiếm)</option>
              <option value={85}>85 điểm (Chỉ viết các đại tin chấn động)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Chu kỳ quét và tự động xuất bản
            </label>
            <select
              value={config.checkIntervalHours || 4}
              onChange={(e) => saveConfig({ checkIntervalHours: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500"
            >
              <option value={2}>2 giờ / lần (Đón đầu tốc độ cao)</option>
              <option value={4}>4 giờ / lần (Khuyên dùng - Chu kỳ chuẩn)</option>
              <option value={6}>6 giờ / lần</option>
              <option value={12}>12 giờ / lần (Sáng và tối)</option>
              <option value={24}>24 giờ / lần (1 bài mỗi ngày)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Thao tác trực tiếp
            </label>
            <button
              onClick={fetchTrends}
              disabled={loadingTrends}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTrends ? 'animate-spin text-amber-600' : ''}`} />
              <span>{loadingTrends ? 'Đang Quét Lại Nguồn Tin...' : 'Quét Lại Xu Hướng Ngay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Category Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategoryFilter === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Lọc từ khóa, địa danh..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-amber-500"
          />
        </div>
      </div>

      {/* 5. Live Trends Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-amber-500" />
            <span>Danh Sách Điểm Nóng Đang Diễn Ra ({filteredTrends.length} kết quả)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Cập nhật liên tục 4h - 24h
          </span>
        </div>

        {loadingTrends && (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-bold text-amber-700">Đang quét RSS Google Trends VN, VnExpress, CafeF, Báo Giao Thông...</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hệ thống đang đối chiếu dữ liệu thời gian thực và phân tích góc nhìn kỹ sư Bê Tông An Gia Bình...
            </p>
          </div>
        )}

        {!loadingTrends && filteredTrends.length === 0 && (
          <div className="py-20 text-center space-y-2 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            <Radio className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Không có xu hướng nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}

        {!loadingTrends && filteredTrends.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrends.map(trend => {
              const isWritingThis = writingTrendId === trend.id;

              return (
                <div
                  key={trend.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3.5 transition hover:shadow-md relative flex flex-col justify-between ${
                    trend.hasBeenWritten
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : trend.trendScore >= 75
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header meta */}
                    <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                          {trend.source}
                        </span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{trend.ageHours} giờ trước</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
                            trend.trendScore >= 75
                              ? 'bg-rose-100 text-rose-700'
                              : trend.trendScore >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{trend.trendScore} đ</span>
                        </span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                          {trend.category}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug hover:text-amber-600 transition">
                      <a href={trend.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1 group">
                        <span>{trend.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 mt-0.5" />
                      </a>
                    </h4>

                    {/* Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {trend.snippet}
                    </p>

                    {/* Newsjacking Concrete Angle */}
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl space-y-1">
                      <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Góc Nhìn Kỹ Sư Bê Tông An Gia Bình:</span>
                      </div>
                      <p className="text-[11px] text-slate-800 leading-relaxed font-medium">
                        {trend.concreteAngle}
                      </p>
                    </div>

                    {/* Focus keywords tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {trend.focusKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    {trend.hasBeenWritten ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã xuất bản bài viết</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {trend.writtenPostSlug && (
                            <a
                              href={`/blog/tin-tuc/${trend.writtenPostSlug}.html`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition"
                            >
                              <span>Xem bài</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-slate-400 italic">
                          Chưa có bài viết
                        </span>
                        <button
                          onClick={() => handleWriteArticle(trend)}
                          disabled={isWritingThis || autoPilotRunning}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
                        >
                          {isWritingThis ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>Đang Viết Báo &amp; Index...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>1-Click Viết Bài Báo Này</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Publication History Log */}
      {config.logs && config.logs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Nhật Ký Xuất Bản Tin Tức Trending Gần Đây ({config.logs.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Đã lưu trong /blog/tin-tuc/[slug].html</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {config.logs.map((log: any) => {
              const fullCanonical = log.permalink?.startsWith('http')
                ? log.permalink
                : `https://www.betongangiabinh.vn${log.permalink}`;

              const isPushing = pushingIndexUrl === fullCanonical;
              const isPushed = pushIndexSuccess === fullCanonical;

              return (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.generatedTitle}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {log.wordCount} từ
                      </span>
                      {log.trendScore && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                          {log.trendScore} đ
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{log.permalink}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={log.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <span>Xem Bài</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handlePushIndexNow(fullCanonical)}
                      disabled={isPushing}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                        isPushed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPushed ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã Bắn Index</span>
                        </>
                      ) : (
                        <>
                          <Send className={`w-3 h-3 ${isPushing ? 'animate-pulse text-amber-600' : ''}`} />
                          <span>{isPushing ? 'Đang gửi...' : 'Bắn Google Index'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
