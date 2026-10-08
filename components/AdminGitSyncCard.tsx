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
  Copy,
  Check,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  ShieldCheck,
  Zap
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
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900">
                Tự Động Đồng Bộ Livesite (betongangiabinh.vn)
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Auto-Sync Hoạt Động</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kết nối trực tiếp qua GitHub REST API. Bạn chỉ cần nhấn nút <strong>Lưu</strong>, hệ thống tự động đẩy lên GitHub và Vercel tự động xuất bản lên website!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchGitStatus()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition self-start sm:self-auto"
          title="Kiểm tra trạng thái đồng bộ mới nhất"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Kiểm Tra Lại</span>
        </button>
      </div>

      {/* Prominent Auto-Sync Explanation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-slate-800 space-y-2">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Cơ Chế Lưu 1-Click Tự Động Hoàn Toàn</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white font-mono font-semibold rounded-md">Không cần thao tác Git thủ công</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Mỗi khi bạn nhấn nút <strong>&quot;Lưu Bài Viết&quot;</strong>, <strong>&quot;Lưu Dự Án&quot;</strong>, hoặc <strong>&quot;Lưu Cài Đặt&quot;</strong>, hệ thống sẽ tự động:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 font-medium">
              <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-0.5">1. Ghi Dữ Liệu</span>
                Lưu vào cơ sở dữ liệu và mã nguồn website.
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60 shadow-2xs">
                <span className="font-bold text-teal-800 block mb-0.5">2. Tạo Commit GitHub</span>
                Đẩy trực tiếp vào repo <code className="text-teal-700 font-mono text-[11px]">khuynhtroc/angiabinhv4</code>.
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200/60 shadow-2xs">
                <span className="font-bold text-blue-800 block mb-0.5">3. Vercel Tự Động Build</span>
                Livesite <span className="text-blue-700 font-semibold">betongangiabinh.vn</span> cập nhật sau 1-2 phút!
              </div>
            </div>
          </div>
        </div>
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
        {/* Card 1: GitHub Repository */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
            <span>Kho Lưu Trữ GitHub</span>
          </div>
          <div className="text-xs font-bold font-mono text-slate-900 flex items-center gap-1.5 truncate">
            <span>khuynhtroc/angiabinhv4</span>
            <a
              href="https://github.com/khuynhtroc/angiabinhv4"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 p-0.5"
              title="Mở GitHub"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: Livesite */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tên Miền Livesite</span>
          </div>
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 truncate">
            <span>betongangiabinh.vn</span>
            <a
              href="https://www.betongangiabinh.vn"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 p-0.5"
              title="Mở Livesite"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 3: Latest Commit */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <GitCommit className="w-3.5 h-3.5 text-purple-600" />
            <span>Commit Gần Nhất</span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 truncate" title={gitStatus?.lastCommit || 'Chưa có'}>
            {gitStatus?.lastCommit || 'Đã đồng bộ main'}
          </div>
        </div>

        {/* Card 4: Working Tree Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trạng Thái Đồng Bộ</span>
          </div>
          <div className="text-xs font-bold flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
              100% Sẵn Sàng &amp; Tự Động
            </span>
          </div>
        </div>
      </div>

      {/* Recent Commits Log */}
      {gitStatus?.recentCommits && gitStatus.recentCommits.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Lịch Sử Cập Nhật &amp; Xuất Bản Gần Đây:</span>
            </span>
            <span className="text-[11px] text-slate-400">
              (Mỗi lần bấm &quot;Lưu&quot; đều ghi lại tại đây)
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {gitStatus.recentCommits.slice(0, 5).map((c, idx) => (
              <div
                key={c.hash || idx}
                className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200 text-[11px]">
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

      {/* Advanced / Manual Controls Accordion (Hidden by default so user doesn't have to deal with manual git) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Tùy chọn nâng cao &amp; Đồng bộ thủ công (Không bắt buộc)</span>
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-4 pt-1 space-y-4 border-t border-slate-200 bg-white">
            <p className="text-xs text-slate-500">
              Chỉ sử dụng phần này khi bạn muốn ép hệ thống quét lại toàn bộ dữ liệu hoặc đẩy thủ công một commit riêng biệt:
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ép buộc đồng bộ lại toàn bộ mã nguồn &amp; Tạo Commit</span>
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={customCommitMessage}
                    onChange={(e) => setCustomCommitMessage(e.target.value)}
                    placeholder="Thông điệp commit tùy chỉnh..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSyncToCodeAndCommit}
                    disabled={syncing}
                    className="w-full h-full min-h-[34px] inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>{syncing ? 'Đang chạy...' : 'Đồng Bộ Thủ Công'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-500">
                <span>Kho GitHub đích: </span>
                <code className="text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                  khuynhtroc/angiabinhv4 (nhánh main)
                </code>
              </div>
              <button
                type="button"
                onClick={handlePushToGitHub}
                disabled={pushing}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${pushing ? 'animate-bounce' : ''}`} />
                <span>{pushing ? 'Đang đẩy...' : 'Đẩy Trực Tiếp (Push)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
