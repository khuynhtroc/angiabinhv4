'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Terminal,
  Copy,
  Check,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GitStatus {
  branch: string;
  lastCommit: string;
  clean: boolean;
  uncommittedFiles: string[];
  totalCommits?: number;
  remoteUrl?: string | null;
  recentCommits?: Array<{ hash: string; date: string; message: string }>;
}

interface AdminGitSyncCardProps {
  onSyncComplete?: (commitHash?: string) => void;
}

export default function AdminGitSyncCard({ onSyncComplete }: AdminGitSyncCardProps) {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [customCommitMessage, setCustomCommitMessage] = useState('');
  const [remoteUrlInput, setRemoteUrlInput] = useState('');
  const [showRemoteConfig, setShowRemoteConfig] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fetchGitStatus = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_git_status' })
      });
      const data = await res.json();
      if (data.success && data.gitStatus) {
        setGitStatus(data.gitStatus);
        if (data.gitStatus.remoteUrl) {
          setRemoteUrlInput(data.gitStatus.remoteUrl);
        }
      }
    } catch (err) {
      console.warn('[AdminGitSyncCard] Failed to fetch git status:', err);
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      try {
        const res = await fetch('/api/admin/persist-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_git_status' })
        });
        const data = await res.json();
        if (isMounted && data.success && data.gitStatus) {
          setGitStatus(data.gitStatus);
          if (data.gitStatus.remoteUrl) {
            setRemoteUrlInput(data.gitStatus.remoteUrl);
          }
        }
      } catch (err) {
        console.warn('[AdminGitSyncCard] Initial git status fetch:', err);
      }
    };
    initFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSyncToCodeAndCommit = async () => {
    try {
      setSyncing(true);
      setActionMessage(null);

      const msg = customCommitMessage.trim() || 'chore(admin): synchronize full website settings and content to codebase';
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_all_to_code',
          commitMessage: msg
        })
      });
      const data = await res.json();

      if (data.success) {
        if (data.gitStatus) setGitStatus(data.gitStatus);
        const commitHash = data.gitResult?.commitHash || '';
        setActionMessage({
          text: data.message || `Đã đồng bộ toàn bộ dữ liệu vào code và tạo commit mới [${commitHash}] thành công!`,
          type: 'success'
        });
        setCustomCommitMessage('');
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {}
        if (onSyncComplete) onSyncComplete(commitHash);
      } else {
        setActionMessage({
          text: data.error || 'Có lỗi khi đồng bộ vào mã nguồn code.',
          type: 'error'
        });
      }
    } catch (err: any) {
      setActionMessage({
        text: err?.message || 'Lỗi kết nối khi gửi yêu cầu đồng bộ.',
        type: 'error'
      });
    } finally {
      setSyncing(false);
    }
  };

  const handlePushToGitHub = async () => {
    try {
      setPushing(true);
      setActionMessage(null);

      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'git_push',
          remoteUrl: remoteUrlInput.trim() || undefined
        })
      });
      const data = await res.json();

      if (data.success) {
        if (data.gitStatus) setGitStatus(data.gitStatus);
        setActionMessage({
          text: data.message || 'Đã đẩy commit lên GitHub thành công!',
          type: 'success'
        });
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else {
        setActionMessage({
          text: data.message || data.error || 'Lỗi khi đẩy lên GitHub. Vui lòng kiểm tra URL/Token hoặc dùng Export to GitHub.',
          type: 'error'
        });
      }
    } catch (err: any) {
      setActionMessage({
        text: err?.message || 'Lỗi kết nối khi đẩy lên GitHub.',
        type: 'error'
      });
    } finally {
      setPushing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Đồng Bộ Mã Nguồn Git &amp; Kho Lưu Trữ GitHub
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Git Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tất cả thay đổi cài đặt, SEO, mã nhúng Header/Footer và bài viết trong /admin được lưu thẳng vào mã nguồn và tạo commit Git tự động.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchGitStatus()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition self-start sm:self-auto"
          title="Làm mới trạng thái Git"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : actionMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 whitespace-pre-wrap">{actionMessage.text}</div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-sm leading-none font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Branch */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
            <span>Nhánh Git Hiện Tại</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 flex items-center gap-2">
            <span>{gitStatus?.branch || 'main'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Nhánh hoạt động" />
          </div>
        </div>

        {/* Card 2: Latest Commit */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <GitCommit className="w-3.5 h-3.5 text-purple-600" />
            <span>Commit Gần Nhất</span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 truncate" title={gitStatus?.lastCommit || 'Chưa có'}>
            {gitStatus?.lastCommit || 'Chưa có thông tin'}
          </div>
        </div>

        {/* Card 3: Working Tree Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trạng Thái Cây Thư Mục</span>
          </div>
          <div className="text-xs font-bold flex items-center gap-1.5">
            {gitStatus?.clean ? (
              <span className="text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                100% Đồng bộ (Clean)
              </span>
            ) : (
              <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                Có {gitStatus?.uncommittedFiles?.length || 0} tệp cần commit
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Total Commits */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Tổng Số Commit Trong Git</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {gitStatus?.totalCommits || 1} bản ghi commit
          </div>
        </div>
      </div>

      {/* Main Action Form */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-slate-200 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Đồng Bộ Ngay Toàn Bộ Dữ Liệu Vào Mã Nguồn &amp; Tạo Commit</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Ghi đè tất cả cấu hình website, logo, thẻ custom head/body/footer, chuyên mục và bài viết vào tệp <code className="text-amber-300 font-mono">lib/initial-data.ts</code> và <code className="text-amber-300 font-mono">public/data/</code>, đồng thời tạo một Git commit mới sẵn sàng để push.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={customCommitMessage}
              onChange={(e) => setCustomCommitMessage(e.target.value)}
              placeholder="Thông điệp commit (mặc định: chore(admin): synchronize full website settings...)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleSyncToCodeAndCommit}
              disabled={syncing}
              className="w-full h-full min-h-[40px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang đồng bộ...' : 'Đồng Bộ Vào Code & Tạo Commit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Remote Configuration & Direct Push */}
      <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">
              Đẩy Trực Tiếp Lên Kho Lưu Trữ GitHub (Git Push)
            </span>
            {gitStatus?.remoteUrl ? (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Đã kết nối Remote
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Chưa có Remote
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowRemoteConfig(!showRemoteConfig)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            {showRemoteConfig ? 'Thu gọn cấu hình' : 'Tùy chỉnh Remote URL'}
          </button>
        </div>

        {showRemoteConfig && (
          <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                URL Kho Lưu Trữ GitHub (kèm Token nếu là repo riêng tư):
              </label>
              <input
                type="text"
                value={remoteUrlInput}
                onChange={(e) => setRemoteUrlInput(e.target.value)}
                placeholder="https://<GITHUB_TOKEN>@github.com/phamthihuong2603/be-tong-an-gia-binh.git"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ví dụ: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://ghp_xxx@github.com/user/repo.git</code> hoặc <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://github.com/user/repo.git</code>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-600">
            <strong>2 cách đẩy mã nguồn lên GitHub:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11px] text-slate-500">
              <li>
                <strong>Cách 1 (Nhanh nhất trong AI Studio):</strong> Sau khi nhấn &quot;Đồng Bộ Vào Code &amp; Tạo Commit&quot;, chỉ cần chọn menu <strong>Export to GitHub</strong> ở thanh trên cùng của AI Studio.
              </li>
              <li>
                <strong>Cách 2 (Đẩy trực tiếp):</strong> Nhấn nút &quot;Đẩy Lên GitHub Ngay&quot; bên cạnh nếu bạn đã điền URL kèm GitHub Personal Access Token.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handlePushToGitHub}
            disabled={pushing}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <UploadCloud className={`w-4 h-4 ${pushing ? 'animate-bounce' : ''}`} />
            <span>{pushing ? 'Đang đẩy lên GitHub...' : 'Đẩy Lên GitHub Ngay'}</span>
          </button>
        </div>
      </div>

      {/* Recent Commits Log */}
      {gitStatus?.recentCommits && gitStatus.recentCommits.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Lịch Sử Commit Gần Đây Trong Mã Nguồn:</span>
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {gitStatus.recentCommits.map((c, idx) => (
              <div
                key={c.hash || idx}
                className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                    {c.hash}
                  </span>
                  <span className="text-slate-700 truncate font-sans text-xs">{c.message}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-sans">{c.date}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(c.hash, c.hash)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Sao chép hash"
                  >
                    {copiedHash === c.hash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
