'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Send,
  RefreshCw,
  Key,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  History,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { IndexingLogItem } from '@/lib/types';
import { testGoogleIndexingClient, submitBulkUrlsClient } from '@/lib/google-indexing-client';

export default function AdminGoogleIndexingCard() {
  const { integrations, updateIntegrations, posts } = useAppStore();

  const [serviceAccountJson, setServiceAccountJson] = useState('');
  const [googleIndexingEnabled, setGoogleIndexingEnabled] = useState(true);
  const [autoSubmitNewPosts, setAutoSubmitNewPosts] = useState(true);
  const [indexNowKey, setIndexNowKey] = useState('');
  const [indexNowEnabled, setIndexNowEnabled] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; clientEmail?: string } | null>(null);
  const [bulkResult, setBulkResult] = useState<{ total: number; success: number; failed: number } | null>(null);
  const [logs, setLogs] = useState<IndexingLogItem[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [clientEmailDisplay, setClientEmailDisplay] = useState('');

  // Fetch current server config on mount
  useEffect(() => {
    fetch('/api/admin/google-indexing')
      .then(r => r.json())
      .then((data: any) => {
        if (data.success && data.config) {
          setGoogleIndexingEnabled(data.config.googleIndexingEnabled !== false);
          setAutoSubmitNewPosts(data.config.autoSubmitNewPosts !== false);
          setClientEmailDisplay(data.config.clientEmail || '');
          setIndexNowKey(data.config.indexNowKey || '');
          setIndexNowEnabled(Boolean(data.config.indexNowEnabled));
        }
        if (Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch(err => console.warn('[Google Indexing Card] Init error:', err));
  }, []);

  // Sync from store if present
  useEffect(() => {
    if (integrations?.googleServiceAccountJson && !serviceAccountJson) {
      setServiceAccountJson(integrations.googleServiceAccountJson);
    }
    if (integrations?.googleServiceAccountEmail) {
      setClientEmailDisplay(integrations.googleServiceAccountEmail);
    }
    if (integrations?.indexNowKey) {
      setIndexNowKey(integrations.indexNowKey);
    }
    if (Array.isArray(integrations?.indexingLogs) && integrations.indexingLogs.length > 0) {
      setLogs(integrations?.indexingLogs || []);
    }
  }, [integrations]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setServiceAccountJson(val);
    try {
      const parsed = JSON.parse(val);
      if (parsed.client_email) {
        setClientEmailDisplay(parsed.client_email);
      }
    } catch {
      // not JSON yet
    }
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/google-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-config',
          serviceAccountJson,
          googleIndexingEnabled,
          autoSubmitNewPosts,
          indexNowKey,
          indexNowEnabled
        })
      });

      const data: any = await res.json();
      if (data.success) {
        updateIntegrations({
          googleServiceAccountJson: serviceAccountJson,
          googleServiceAccountEmail: clientEmailDisplay,
          googleIndexingEnabled,
          autoSubmitNewPosts,
          indexNowKey,
          indexNowEnabled
        });
        alert('✅ Đã lưu cấu hình Google Indexing API thành công!');
      } else {
        alert('⚠️ Không thể lưu cấu hình: ' + (data.message || 'Lỗi server'));
      }
    } catch (err: any) {
      alert('⚠️ Lỗi kết nối: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result: any = await testGoogleIndexingClient(
        serviceAccountJson || undefined,
        'https://www.betongangiabinh.vn/'
      );

      setTestResult(result);

      if (result.clientEmail) {
        setClientEmailDisplay(result.clientEmail);
      }

      // Refresh logs
      fetch('/api/admin/google-indexing')
        .then(r => r.json())
        .then((data: any) => {
          if (Array.isArray(data.logs)) setLogs(data.logs);
        });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Lỗi kiểm tra kết nối: ' + err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!clientEmailDisplay && !serviceAccountJson) {
      alert('⚠️ Vui lòng cấu hình Google Service Account JSON trước khi Submit hàng loạt.');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn submit 20 bài viết mới nhất lên Google Indexing API ngay bây giờ?')) {
      return;
    }

    setIsSubmittingBulk(true);
    setBulkResult(null);

    try {
      const result: any = await submitBulkUrlsClient(undefined, 20);
      if (result.success && result.summary) {
        setBulkResult(result.summary);
        alert(`✅ Đã gửi thành công ${result.summary.success}/${result.summary.total} bài viết lên Google Indexing API!`);
      } else {
        alert('⚠️ Lỗi khi submit hàng loạt: ' + (result.message || 'Không rõ nguyên nhân'));
      }

      // Refresh logs
      fetch('/api/admin/google-indexing')
        .then(r => r.json())
        .then((data: any) => {
          if (Array.isArray(data.logs)) setLogs(data.logs);
        });
    } catch (err: any) {
      alert('⚠️ Lỗi mạng: ' + err.message);
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleCopyEmail = () => {
    if (clientEmailDisplay) {
      navigator.clipboard.writeText(clientEmailDisplay);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleGenerateIndexNowKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setIndexNowKey(randomKey);
  };

  const hasConfiguredCredentials = Boolean(clientEmailDisplay || serviceAccountJson);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-lg text-slate-900 tracking-tight">
                Tự Động Submit URL Lên Google Indexing API &amp; IndexNow
              </h3>
              {hasConfiguredCredentials ? (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã cấu hình Service Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Chờ dán JSON Service Account
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mỗi khi bài viết mới được đăng hoặc do AI Scheduler tự xuất bản, URL chuẩn <code>/{'{slug}'}.html</code> sẽ tự động được gửi tới Googlebot để lập chỉ mục trong vài phút.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white text-xs font-bold text-slate-700 hover:text-amber-700 flex items-center gap-1.5 transition shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Hướng Dẫn 3 Bước</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guide Accordion */}
      {showGuide && (
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Quy Trình Cài Đặt Google Indexing API (Hoàn Toàn Miễn Phí)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-amber-700 flex items-center justify-between">
                <span>1. Bật API trên Google Cloud</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">Bước 1</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Truy cập <a href="https://console.cloud.google.com/apis/library/indexing.googleapis.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">Google Cloud Library <ExternalLink className="w-2.5 h-2.5" /></a>, chọn hoặc tạo dự án mới rồi nhấn <strong>Bật (Enable) Web Search Indexing API</strong>.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-amber-700 flex items-center justify-between">
                <span>2. Tạo Service Account &amp; Tải JSON</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">Bước 2</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Vào mục <strong>IAM &amp; Quản trị &gt; Tài khoản dịch vụ (Service Accounts)</strong> &gt; Tạo tài khoản mới &gt; Tab <strong>Khoá (Keys) &gt; Thêm khoá &gt; Tạo khoá mới (JSON)</strong>. Tải tệp <code>.json</code> về máy.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-amber-700 flex items-center justify-between">
                <span>3. Cấp Quyền Search Console</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">Bước 3</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Mở <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">Google Search Console <ExternalLink className="w-2.5 h-2.5" /></a> &gt; Cài đặt &gt; <strong>Người dùng và quyền &gt; Thêm người dùng</strong>. Dán email của Service Account và chọn quyền <strong>Chủ sở hữu (Owner)</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
            💡 <strong>Mẹo:</strong> Sau khi hoàn thành Bước 3, chỉ cần mở file JSON vừa tải về, copy toàn bộ nội dung và dán vào ô bên dưới rồi bấm <strong>&quot;Lưu Cấu Hình&quot;</strong> và <strong>&quot;Kiểm Tra Kết Nối&quot;</strong>.
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveConfig} className="p-5 sm:p-6 space-y-6">
        {/* Toggle Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={autoSubmitNewPosts}
              onChange={(e) => setAutoSubmitNewPosts(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                ⚡ Tự Động Push URL Lên Google Khi Có Bài Mới
              </span>
              <span className="text-[11px] text-slate-500 block">
                Tự động gửi thông báo indexing ngay khi bạn tạo bài trên Admin hoặc AI Scheduler xuất bản bài mới.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={googleIndexingEnabled}
              onChange={(e) => setGoogleIndexingEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                🌐 Kích Hoạt Google Indexing API
              </span>
              <span className="text-[11px] text-slate-500 block">
                Sử dụng giao thức chính thức từ Google (RS256 JWT) để thông báo cập nhật URL bài viết.
              </span>
            </div>
          </label>
        </div>

        {/* Service Account Email badge if detected */}
        {clientEmailDisplay && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Key className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-600 shrink-0 font-medium">Service Account Email:</span>
              <code className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded truncate border border-amber-200/60" title={clientEmailDisplay}>
                {clientEmailDisplay}
              </code>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-2.5 py-1 rounded-lg border border-slate-300 hover:border-amber-400 bg-white text-[11px] font-bold text-slate-700 hover:text-amber-800 flex items-center gap-1 transition shrink-0 shadow-2xs"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEmail ? 'Đã sao chép' : 'Copy Email Gán Vào Search Console'}</span>
            </button>
          </div>
        )}

        {/* Service Account JSON Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="service-account-json" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Nội Dung File Google Service Account JSON Key</span>
              <span className="text-[11px] text-slate-400 font-normal">(Chứa client_email và private_key)</span>
            </label>
            {serviceAccountJson && (
              <button
                type="button"
                onClick={() => setServiceAccountJson('')}
                className="text-[11px] text-rose-600 hover:underline font-medium"
              >
                Xoá nội dung ô nhập
              </button>
            )}
          </div>

          <textarea
            id="service-account-json"
            rows={4}
            value={serviceAccountJson}
            onChange={handleJsonChange}
            placeholder='Dán toàn bộ nội dung file JSON vào đây:&#10;{&#10;  "type": "service_account",&#10;  "project_id": "...",&#10;  "private_key": "-----BEGIN PRIVATE KEY-----\n...",&#10;  "client_email": "angiabinh-indexing@....iam.gserviceaccount.com"&#10;}'
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
          />
        </div>

        {/* IndexNow Config */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={indexNowEnabled}
                onChange={(e) => setIndexNowEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-900">
                🚀 Đồng thời kích hoạt IndexNow (Bing, Yandex, Naver, Seznam)
              </span>
            </label>

            <button
              type="button"
              onClick={handleGenerateIndexNowKey}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 self-start sm:self-auto underline"
            >
              Tự động tạo Key ngẫu nhiên
            </button>
          </div>

          {indexNowEnabled && (
            <div className="pt-2">
              <input
                type="text"
                value={indexNowKey}
                onChange={(e) => setIndexNowKey(e.target.value)}
                placeholder="Nhập IndexNow API Key (32 ký tự hex)"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tệp khoá sẽ được xác thực tại: <code>https://www.betongangiabinh.vn/{indexNowKey || '[key]'}.txt</code>
              </p>
            </div>
          )}
        </div>

        {/* Test Result Alert */}
        {testResult && (
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold">
                {testResult.success ? '🎉 Kết Nối Google Indexing API Thành Công!' : '⚠️ Kiểm Tra Kết Nối Thất Bại'}
              </div>
              <p className="leading-relaxed">
                {testResult.message}
              </p>
              {!testResult.success && testResult.message.includes('403') && (
                <p className="text-[11px] text-rose-700 font-semibold mt-1">
                  👉 <strong>Cách khắc phục:</strong> Bạn chưa thêm email <code>{testResult.clientEmail || clientEmailDisplay}</code> vào Google Search Console với quyền <strong>Chủ sở hữu (Owner)</strong>. Vui lòng mở Search Console &gt; Cài đặt &gt; Người dùng và quyền &gt; Thêm người dùng để cấp quyền.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? 'Đang Lưu...' : 'Lưu Cấu Hình Indexing'}</span>
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || (!serviceAccountJson && !clientEmailDisplay)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-amber-400 bg-white text-slate-800 font-bold text-xs flex items-center gap-2 transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Đang Kiểm Tra Google...' : 'Kiểm Tra Kết Nối (Test Submit)'}</span>
          </button>

          <button
            type="button"
            onClick={handleBulkSubmit}
            disabled={isSubmittingBulk || (!serviceAccountJson && !clientEmailDisplay)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 text-amber-400 ${isSubmittingBulk ? 'animate-pulse' : ''}`} />
            <span>{isSubmittingBulk ? 'Đang Submit...' : '⚡ Submit 20 Bài Mới Nhất Lên Google'}</span>
          </button>
        </div>
      </form>

      {/* Recent Submissions Logs */}
      <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
            <History className="w-4 h-4 text-amber-600" />
            <span>Nhật Ký Submit URLs Gần Đây ({logs.length})</span>
          </div>

          <button
            type="button"
            onClick={() => {
              fetch('/api/admin/google-indexing')
                .then(r => r.json())
                .then((data: any) => { if (Array.isArray(data.logs)) setLogs(data.logs); });
            }}
            className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Làm mới</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            Chưa có lịch sử submit URL nào. Sau khi bài viết mới được xuất bản hoặc bấm Kiểm tra kết nối, lịch sử sẽ xuất hiện tại đây.
          </p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">URL Bài Viết</th>
                  <th className="py-2.5 px-3">Công cụ</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Phản hồi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-2 px-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit' }) : 'Vừa xong'}
                    </td>
                    <td className="py-2 px-3 max-w-[240px] truncate font-mono text-[11px] text-slate-800">
                      <a href={log.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 underline" title={log.url}>
                        {log.url.replace('https://www.betongangiabinh.vn', '')}
                      </a>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                        log.engine === 'google' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {log.engine}
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Thành công</span>
                        </span>
                      ) : log.status === 'error' ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Lỗi ({log.httpStatus || 'Fail'})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                          <span>Bỏ qua</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 max-w-[280px] truncate text-[11px] text-slate-500" title={log.message}>
                      {log.message || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
