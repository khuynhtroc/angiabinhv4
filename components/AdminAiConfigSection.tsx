'use client';

import React, { useState } from 'react';
import { AiSettingsConfig, AiProviderType } from '@/lib/types';
import {
  Sparkles, CheckCircle2, Sliders, Key, Cpu, Zap, Shield,
  RefreshCw, Check, AlertCircle, Play, Settings, Bot, ExternalLink
} from 'lucide-react';

interface AdminAiConfigSectionProps {
  aiSettings: AiSettingsConfig;
  onSaveSettings: (settings: Partial<AiSettingsConfig>) => void;
  onSetActiveProvider: (provider: AiProviderType) => void;
}

const PROVIDERS: {
  id: AiProviderType;
  name: string;
  badge: string;
  color: string;
  defaultModel: string;
  models: string[];
  docUrl: string;
}[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Khuyên Dùng (Miễn Phí/Tốc Độ Cao)',
    color: 'amber',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
    docUrl: 'https://aistudio.google.com/'
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    badge: 'GPT-4o & GPT-4o-mini',
    color: 'emerald',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    docUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'grok',
    name: 'xAI Grok',
    badge: 'Grok-2 & Grok-beta',
    color: 'blue',
    defaultModel: 'grok-beta',
    models: ['grok-beta', 'grok-2', 'grok-2-mini'],
    docUrl: 'https://console.x.ai/'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    badge: 'Claude 3.5 Sonnet',
    color: 'purple',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    docUrl: 'https://console.anthropic.com/'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'Chi Phí Tối Ưu',
    color: 'rose',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
    docUrl: 'https://platform.deepseek.com/'
  }
];

export default function AdminAiConfigSection({
  aiSettings,
  onSaveSettings,
  onSetActiveProvider
}: AdminAiConfigSectionProps) {
  const [activeTab, setActiveTab] = useState<AiProviderType>(aiSettings.activeProvider || 'gemini');
  const [formData, setFormData] = useState<AiSettingsConfig>(aiSettings);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testStatus, setTestStatus] = useState<Record<string, { loading?: boolean; success?: boolean; message?: string; latency?: string }>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle key visibility
  const toggleShowKey = (prov: string) => {
    setShowKeys(prev => ({ ...prev, [prov]: !prev[prov] }));
  };

  // Test provider connection
  const handleTestConnection = async (provider: AiProviderType) => {
    setTestStatus(prev => ({ ...prev, [provider]: { loading: true } }));
    try {
      const config = formData[provider];
      const res = await fetch('/api/ai/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: config?.apiKey || '',
          model: config?.model || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus(prev => ({
          ...prev,
          [provider]: {
            loading: false,
            success: true,
            message: data.sampleResponse || 'Kết nối thành công!',
            latency: data.responseTime
          }
        }));
      } else {
        setTestStatus(prev => ({
          ...prev,
          [provider]: {
            loading: false,
            success: false,
            message: data.error || 'Kiểm tra thất bại'
          }
        }));
      }
    } catch (err: any) {
      setTestStatus(prev => ({
        ...prev,
        [provider]: {
          loading: false,
          success: false,
          message: err?.message || 'Lỗi mạng'
        }
      }));
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentActiveProvider = formData.activeProvider || 'gemini';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-2">
            <Bot className="w-3.5 h-3.5 text-amber-700" />
            <span>Cấu Hình Đa Trí Tuệ Nhân Tạo (Multi-AI Engine)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản Lý API Cho AI &amp; Lựa Chọn AI Hoạt Động
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thiết lập API Key, chọn mô hình AI (GPT, Gemini, Grok, Claude, DeepSeek) và chỉ định AI nào đang hoạt động trên website.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span>{savedSuccess ? 'Đã Lưu Cấu Hình AI!' : 'Lưu Cấu Hình AI'}</span>
        </button>
      </div>

      {/* Active AI Status Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">AI Đang Hoạt Động Trên Website:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ĐANG HOẠT ĐỘNG
              </span>
            </div>
            <div className="text-lg font-black text-amber-400 mt-0.5 uppercase tracking-wide">
              {PROVIDERS.find(p => p.id === currentActiveProvider)?.name || currentActiveProvider}
              <span className="text-xs font-normal text-slate-300 ml-2">
                (Model: {formData[currentActiveProvider]?.model || 'Mặc định'})
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Mọi chức năng tự động viết bài, tạo tóm tắt SEO và chatbot sẽ ưu tiên sử dụng AI này.
        </div>
      </div>

      {/* Providers Selector Grid */}
      <div className="space-y-4">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
          Chọn Nhà Cung Cấp AI Cần Cấu Hình Hoặc Kích Hoạt
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PROVIDERS.map(prov => {
            const isCurrentlyActive = currentActiveProvider === prov.id;
            const isTabOpen = activeTab === prov.id;
            return (
              <div
                key={prov.id}
                onClick={() => setActiveTab(prov.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col justify-between relative ${
                  isTabOpen
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {isCurrentlyActive && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                    Hoạt động
                  </span>
                )}
                <div>
                  <div className="text-sm font-black text-slate-900">{prov.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{prov.badge}</div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${isCurrentlyActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isCurrentlyActive ? '● Đang chạy' : '○ Chưa chọn'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, activeProvider: prov.id }));
                      onSetActiveProvider(prov.id);
                    }}
                    className={`text-[10px] font-extrabold px-2 py-1 rounded-lg transition ${
                      isCurrentlyActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-slate-950'
                    }`}
                  >
                    {isCurrentlyActive ? 'Đã chọn' : 'Đặt làm AI chính'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Provider Configuration Panel */}
      {(() => {
        const prov = PROVIDERS.find(p => p.id === activeTab) || PROVIDERS[0];
        const config = formData[prov.id] || { apiKey: '', model: prov.defaultModel, temperature: 0.7, maxTokens: 2000 };
        const isShowKey = !!showKeys[prov.id];
        const isCurrentlyActive = currentActiveProvider === prov.id;
        const testRes = testStatus[prov.id];

        return (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  {prov.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Cấu hình {prov.name}</span>
                    {isCurrentlyActive && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        AI Hoạt Động Trên Website
                      </span>
                    )}
                  </h3>
                  <a
                    href={prov.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold"
                  >
                    <span>Lấy API Key từ trang chủ {prov.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {!isCurrentlyActive && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, activeProvider: prov.id }));
                    onSetActiveProvider(prov.id);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kích Hoạt {prov.name} Làm AI Hoạt Động</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* API Key */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  API Key {prov.name} {prov.id === 'gemini' && '(Có thể dùng GEMINI_API_KEY hệ thống)'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={isShowKey ? "text" : "password"}
                    placeholder={`Nhập API Key của ${prov.name}...`}
                    value={config.apiKey || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        [prov.id]: { ...prev[prov.id], apiKey: val }
                      }));
                    }}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-24 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(prov.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    {isShowKey ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              {/* Model selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mô Hình (Model Name)
                </label>
                <div className="relative">
                  <Cpu className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    list={`models-${prov.id}`}
                    placeholder={prov.defaultModel}
                    value={config.model || prov.defaultModel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        [prov.id]: { ...prev[prov.id], model: val }
                      }));
                    }}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                  />
                  <datalist id={`models-${prov.id}`}>
                    {prov.models.map(m => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto text-[11px] text-slate-500">
                  <span>Gợi ý:</span>
                  {prov.models.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          [prov.id]: { ...prev[prov.id], model: m }
                        }));
                      }}
                      className="text-amber-700 hover:underline font-mono"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Tokens (Độ dài tối đa)
                </label>
                <div className="relative">
                  <Sliders className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="256"
                    max="8192"
                    step="256"
                    value={config.maxTokens || 2048}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 2048;
                      setFormData(prev => ({
                        ...prev,
                        [prov.id]: { ...prev[prov.id], maxTokens: val }
                      }));
                    }}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                disabled={testRes?.loading}
                onClick={() => handleTestConnection(prov.id)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 self-start disabled:opacity-50"
              >
                {testRes?.loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Kiểm Tra Kết Nối API ({prov.name})</span>
              </button>

              {testRes && (
                <div className={`text-xs p-3 rounded-xl flex items-center gap-2 ${
                  testRes.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {testRes.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">{testRes.success ? 'Thành công!' : 'Thất bại:'}</span> {testRes.message}
                    {testRes.latency && <span className="ml-1 text-[11px] font-mono opacity-80">({testRes.latency})</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Global System Prompt */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          System Prompt Định Hướng Nội Dung (Áp dụng cho mọi AI)
        </label>
        <textarea
          rows={3}
          value={formData.systemPrompt || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
          placeholder="Bạn là chuyên gia tư vấn kỹ thuật và SEO của Bê Tông An Gia Bình Ninh Bình..."
          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:border-amber-500"
        />
        <p className="text-[11px] text-slate-500">
          Chỉ dẫn này sẽ được gửi kèm trong các lần gọi AI để đảm bảo câu trả lời luôn đúng thương hiệu Bê Tông An Gia Bình Ninh Bình.
        </p>
      </div>
    </div>
  );
}
