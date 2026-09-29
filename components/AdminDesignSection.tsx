'use client';

import React, { useState } from 'react';
import { JekyllConfig } from '@/lib/types';
import {
  Palette,
  Layout,
  Sliders,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Type,
  Maximize2,
  PanelLeft,
  Columns,
  MessageSquare,
  ShieldCheck,
  Phone,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDesignSectionProps {
  config: JekyllConfig;
  onSaveConfig: (updated: Partial<JekyllConfig>) => void;
}

const COLOR_PALETTES = [
  {
    name: 'Vàng Công Trình (Mặc định)',
    primary: '#f59e0b',
    secondary: '#0f172a',
    accent: '#d97706',
    desc: 'Tông màu vàng rực rỡ bê tông, khỏe khoắn, công nghiệp.'
  },
  {
    name: 'Cam Cơ Giới Hiện Đại',
    primary: '#ea580c',
    secondary: '#18181b',
    accent: '#c2410c',
    desc: 'Sắc cam nổi bật, kích thích hành động liên hệ mạnh mẽ.'
  },
  {
    name: 'Xanh Thép & Bê Tông',
    primary: '#2563eb',
    secondary: '#0f172a',
    accent: '#1d4ed8',
    desc: 'Tạo cảm giác uy tín, vững chãi, kỹ thuật chuẩn ISO.'
  },
  {
    name: 'Xanh Ngọc Công Nghiệp Xanh',
    primary: '#059669',
    secondary: '#064e3b',
    accent: '#047857',
    desc: 'Vật liệu xây dựng xanh, thân thiện môi trường, bền vững.'
  },
  {
    name: 'Đỏ Đô Năng Động',
    primary: '#dc2626',
    secondary: '#1e293b',
    accent: '#b91c1c',
    desc: 'Mạnh mẽ, thúc đẩy tỷ lệ chốt thầu và gọi hotline.'
  }
];

export default function AdminDesignSection({
  config,
  onSaveConfig
}: AdminDesignSectionProps) {
  const [formData, setFormData] = useState<Partial<JekyllConfig>>({
    primaryColor: config.primaryColor || '#f59e0b',
    secondaryColor: config.secondaryColor || '#0f172a',
    accentColor: config.accentColor || '#d97706',
    fontFamily: config.fontFamily || 'sans',
    layoutWidth: config.layoutWidth || 'wide',
    headerStyle: config.headerStyle || 'standard',
    headerNotice: config.headerNotice || 'Trạm Trộn Bê Tông Tươi An Gia Bình | Trạm 1: KCN Khánh Phú • Trạm 2: Kim Sơn • 35+ Xe bồn',
    showHeaderTopBar: config.showHeaderTopBar !== false,
    footerStyle: config.footerStyle || 'columns',
    footerNotice: config.footerNotice || 'Thương hiệu bê tông thương phẩm hàng đầu Ninh Bình. Hệ thống 2 cụm trạm trộn tự động hóa (KCN Khánh Phú 300m³/h & xã Kim Sơn 150m³/h), 35+ xe bồn và dàn xe bơm cần vươn xa 56m.',
    footerCopyright: config.footerCopyright || `© ${new Date().getFullYear()} Bê Tông An Gia Bình Ninh Bình. Bản quyền thuộc về Công ty CP TM & DV An Gia Bình.`,
    sidebarPosition: config.sidebarPosition || 'right',
    sidebarCtaTitle: config.sidebarCtaTitle || 'Khảo sát & Báo Giá Bê Tông',
    sidebarCtaPhone: config.sidebarCtaPhone || '0988 2662 93',
    sidebarCtaDesc: config.sidebarCtaDesc || 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn (150m³/h) sẵn sàng điều động 35+ xe bồn, xe bơm cần 37m - 56m.',
    ctaButtonText: config.ctaButtonText || 'Gọi 0988 2662 93 Báo Giá 24/7',
    ctaButtonLink: config.ctaButtonLink || 'tel:0988266293',
    ctaHeading: config.ctaHeading || 'Cần Báo Giá & Khảo Sát Bê Tông Mác 200 - 450?',
    ctaSubheading: config.ctaSubheading || 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Kim Sơn (150m³/h) sẵn sàng phục vụ 24/7.'
  });

  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'header' | 'footer' | 'sidebar' | 'cta' | 'layout'>('colors');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof JekyllConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig(formData);
    setIsSaved(true);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Khôi phục thiết lập giao diện về mặc định?')) {
      const defaults: Partial<JekyllConfig> = {
        primaryColor: '#f59e0b',
        secondaryColor: '#0f172a',
        accentColor: '#d97706',
        fontFamily: 'sans',
        layoutWidth: 'wide',
        headerStyle: 'standard',
        headerNotice: 'Trạm Trộn Bê Tông Tươi An Gia Bình | Trạm 1: KCN Khánh Phú • Trạm 2: Kim Sơn • 35+ Xe bồn',
        showHeaderTopBar: true,
        footerStyle: 'columns',
        footerNotice: 'Thương hiệu bê tông thương phẩm hàng đầu Ninh Bình. Hệ thống 2 cụm trạm trộn tự động hóa (KCN Khánh Phú 300m³/h & xã Kim Sơn 150m³/h), 35+ xe bồn và dàn xe bơm cần vươn xa 56m.',
        footerCopyright: `© ${new Date().getFullYear()} Bê Tông An Gia Bình Ninh Bình. Bản quyền thuộc về Công ty CP TM & DV An Gia Bình.`,
        sidebarPosition: 'right',
        sidebarCtaTitle: 'Khảo sát & Báo Giá Bê Tông',
        sidebarCtaPhone: '0988 2662 93',
        sidebarCtaDesc: 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn (150m³/h) sẵn sàng điều động 35+ xe bồn, xe bơm cần 37m - 56m.',
        ctaButtonText: 'Gọi 0988 2662 93 Báo Giá 24/7',
        ctaButtonLink: 'tel:0988266293',
        ctaHeading: 'Cần Báo Giá & Khảo Sát Bê Tông Mác 200 - 450?',
        ctaSubheading: 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Kim Sơn (150m³/h) sẵn sàng phục vụ 24/7.'
      };
      setFormData(defaults);
      onSaveConfig(defaults);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card with action buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Palette className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Quản Lý Giao Diện & Tùy Biến Website
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Điều chỉnh màu sắc chủ đạo, font chữ, bố cục header, footer, thanh sidebar và nút kêu gọi hành động (CTA). Mọi thay đổi đồng bộ trực tiếp lên máy chủ AI Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mặc định</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-xs flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Đã lưu thành công!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu & Áp Dụng Giao Diện</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('colors')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'colors'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Màu Sắc & Font Chữ</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('header')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'header'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-4 h-4 text-amber-400" />
          <span>Đầu Trang (Header)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'footer'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Columns className="w-4 h-4 text-amber-400" />
          <span>Chân Trang (Footer)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('sidebar')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'sidebar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PanelLeft className="w-4 h-4 text-amber-400" />
          <span>Thanh Bên (Sidebar)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('cta')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'cta'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Kêu Gọi Hành Động (CTA)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('layout')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'layout'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
          <span>Bố Cục & Độ Rộng</span>
        </button>
      </div>

      {/* Tab 1: Colors & Typography */}
      {activeSubTab === 'colors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Bảng Màu Định Hình Thương Hiệu
            </h3>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Bộ Màu Phối Sẵn Chuyên Nghiệp
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOR_PALETTES.map((palette) => (
                  <div
                    key={palette.name}
                    onClick={() => applyPalette(palette)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 cursor-pointer transition flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{palette.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{palette.desc}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <span className="w-4 h-4 rounded-full border border-white shadow-xs" style={{ backgroundColor: palette.primary }} />
                      <span className="w-4 h-4 rounded-full border border-white shadow-xs" style={{ backgroundColor: palette.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-white shadow-xs" style={{ backgroundColor: palette.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Màu Chủ Đạo (Primary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#f59e0b'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#f59e0b'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Màu Tối Phụ (Secondary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor || '#0f172a'}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || '#0f172a'}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Màu Điểm Nhấn (Accent)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor || '#d97706'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#d97706'}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Typography Selection */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Họ Font Chữ Toàn Website
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'sans', title: 'Plus Jakarta Sans (Mặc định)', desc: 'Hiện đại, chuyên nghiệp, hỗ trợ tiếng Việt hoàn hảo' },
                  { id: 'space', title: 'Space Grotesk + Sans', desc: 'Công nghệ, kỹ thuật cao, tiêu đề đậm chất xây dựng' },
                  { id: 'inter', title: 'Inter Tight UI', desc: 'Rõ nét, gọn gàng, tối ưu tuyệt đối cho thiết bị di động' },
                  { id: 'roboto', title: 'Roboto Standard', desc: 'Phổ biến, thân thiện, tương thích đa nền tảng tuyệt đối' }
                ].map((f) => (
                  <label
                    key={f.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      formData.fontFamily === f.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fontFamily"
                      checked={formData.fontFamily === f.id}
                      onChange={() => handleChange('fontFamily', f.id)}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{f.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{f.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Live Mini Preview Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Eye className="w-4 h-4 text-amber-600" />
                Mô Phỏng Trực Quan Giao Diện
              </div>

              {/* Sample Card */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: formData.primaryColor || '#f59e0b' }}
                  >
                    BÊ TÔNG MÁC 300
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">24/7</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Đổ Bê Tông Sàn Mái Tiêu Chuẩn TCVN Ninh Bình
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  Trạm trộn tự động định lượng, cung ứng liên tục bảo đảm kết cấu chịu lực tối đa.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: formData.accentColor || '#d97706' }}
                  >
                    {formData.ctaButtonText?.slice(0, 18) || 'Gọi Báo Giá'}
                  </button>
                  <span className="text-xs font-bold text-slate-800">
                    1.050.000 đ/m³
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Màu sắc này được áp dụng cho toàn bộ các nút bấm, thanh điều hướng, huy hiệu mác và liên kết trên website.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Header Customization */}
      {activeSubTab === 'header' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-500" />
            Cấu Hình Đầu Trang (Header & Topbar)
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Hiển Thị Thanh Thông Báo Đầu Trang (Topbar)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Thanh màu xám mỏng hiển thị hotline, thông tin trạm trộn và liên kết Fanpage
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.showHeaderTopBar !== false}
                onChange={(e) => handleChange('showHeaderTopBar', e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded-md focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nội Dung Thông Báo Trên Topbar
              </label>
              <input
                type="text"
                value={formData.headerNotice || ''}
                onChange={(e) => handleChange('headerNotice', e.target.value)}
                placeholder="Trạm Trộn Bê Tông Tươi An Gia Bình | Trạm 1: KCN Khánh Phú • Trạm 2: Kim Sơn • 35+ Xe bồn"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kiểu Bố Cục Header
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', name: 'Tiêu Chuẩn (Standard)', desc: 'Logo bên trái, menu ở giữa, nút hotline bên phải' },
                  { id: 'minimal', name: 'Tối Giản (Minimal)', desc: 'Gọn gàng, thanh mảnh, tối ưu hiển thị nội dung' },
                  { id: 'centered', name: 'Căn Giữa (Centered)', desc: 'Logo lớn căn giữa phong cách doanh nghiệp lớn' }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.headerStyle === s.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="headerStyle"
                      checked={formData.headerStyle === s.id}
                      onChange={() => handleChange('headerStyle', s.id)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Footer Customization */}
      {activeSubTab === 'footer' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Columns className="w-4 h-4 text-amber-500" />
            Cấu Hình Chân Trang (Footer)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Đoạn Giới Thiệu Ngắn Ở Cột Trái Chân Trang
              </label>
              <textarea
                rows={3}
                value={formData.footerNotice || ''}
                onChange={(e) => handleChange('footerNotice', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs leading-relaxed"
                placeholder="Thương hiệu bê tông thương phẩm hàng đầu Ninh Bình..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dòng Chữ Bản Quyền Chân Trang (Copyright)
              </label>
              <input
                type="text"
                value={formData.footerCopyright || ''}
                onChange={(e) => handleChange('footerCopyright', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                placeholder="© 2025 - 2026 Bê Tông An Gia Bình Ninh Bình..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kiểu Bố Cục Chân Trang
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'columns', name: '4 Cột Chi Tiết (Mặc định)', desc: 'Đầy đủ thông tin pháp lý, sản phẩm, trạm trộn và hotline' },
                  { id: 'compact', name: 'Thu Gọn (Compact)', desc: '2 cột chính, thích hợp cho website cần độ tập trung cao' },
                  { id: 'simple', name: 'Đơn Giản (Simple)', desc: 'Chỉ hiển thị liên kết nhanh và bản quyền' }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.footerStyle === s.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="footerStyle"
                      checked={formData.footerStyle === s.id}
                      onChange={() => handleChange('footerStyle', s.id)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sidebar Customization */}
      {activeSubTab === 'sidebar' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PanelLeft className="w-4 h-4 text-amber-500" />
            Cấu Hình Thanh Bên (Sidebar Trong Bài Viết & Blog)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vị Trí Cột Sidebar
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'right', name: 'Bên Phải (Khuyên dùng)', desc: 'Mục lục bài viết và khối báo giá đặt ở cột phải' },
                  { id: 'left', name: 'Bên Trái', desc: 'Mục lục bài viết đặt ở cột trái' },
                  { id: 'none', name: 'Ẩn Sidebar (Toàn Chiều Rộng)', desc: 'Bài viết trải rộng 100%, không hiển thị sidebar cố định' }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.sidebarPosition === s.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sidebarPosition"
                      checked={formData.sidebarPosition === s.id}
                      onChange={() => handleChange('sidebarPosition', s.id)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tiêu Đề Khối Báo Giá Sidebar
                </label>
                <input
                  type="text"
                  value={formData.sidebarCtaTitle || ''}
                  onChange={(e) => handleChange('sidebarCtaTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  placeholder="Khảo sát & Báo Giá Bê Tông"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Số Điện Thoại Trực Tiếp Trên Sidebar
                </label>
                <input
                  type="text"
                  value={formData.sidebarCtaPhone || ''}
                  onChange={(e) => handleChange('sidebarCtaPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  placeholder="0988 2662 93"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mô Tả Khối Báo Giá Sidebar
                </label>
                <textarea
                  rows={2}
                  value={formData.sidebarCtaDesc || ''}
                  onChange={(e) => handleChange('sidebarCtaDesc', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  placeholder="Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Call to Action (CTA) */}
      {activeSubTab === 'cta' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            Tùy Chỉnh Khối Kêu Gọi Hành Động (CTA Báo Giá)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tiêu Đề Lớn CTA (Heading)
              </label>
              <input
                type="text"
                value={formData.ctaHeading || ''}
                onChange={(e) => handleChange('ctaHeading', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                placeholder="Cần Báo Giá & Khảo Sát Bê Tông Mác 200 - 450?"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phụ Đề Nhỏ CTA (Subheading)
              </label>
              <input
                type="text"
                value={formData.ctaSubheading || ''}
                onChange={(e) => handleChange('ctaSubheading', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                placeholder="Trạm 1 KCN Khánh Phú và Trạm 2 Kim Sơn phục vụ 24/7..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chữ Trên Nút Bấm Chính (Button Text)
              </label>
              <input
                type="text"
                value={formData.ctaButtonText || ''}
                onChange={(e) => handleChange('ctaButtonText', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                placeholder="Gọi 0988 2662 93 Báo Giá 24/7"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Đường Dẫn Khi Bấm Nút (Link / Hotline)
              </label>
              <input
                type="text"
                value={formData.ctaButtonLink || ''}
                onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                placeholder="tel:0988266293 hoặc /bang-gia"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Layout & Width */}
      {activeSubTab === 'layout' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-amber-500" />
            Độ Rộng Khung Hình & Bố Cục Trang Web
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Độ Rộng Khung Hiển Thị Chính
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'wide', name: 'Rộng Cân Đối (max-w-7xl)', desc: 'Tối ưu độ đọc trên màn hình máy tính (1280px), không bị co cụm' },
                  { id: 'contained', name: 'Vừa Phải (max-w-6xl)', desc: 'Bố cục truyền thống (1152px), gọn gàng' },
                  { id: 'full', name: 'Trải Rộng (Full Fluid)', desc: 'Toàn màn hình với lề ngoài cân đối 32px' }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.layoutWidth === s.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="layoutWidth"
                      checked={formData.layoutWidth === s.id}
                      onChange={() => handleChange('layoutWidth', s.id)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    <div className="text-[11px] text-slate-500 mt-1">{s.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900">
                Lưu ý về kích thước bài viết máy tính:
              </div>
              <p>
                Giao diện bài viết chi tiết đã được nâng cấp từ chiều rộng hẹp (max-w-4xl ~896px) lên chuẩn <strong>max-w-7xl (~1280px)</strong> với hệ thống lưới 12 cột thông minh (8 cột nội dung bài viết và 4 cột mục lục cố định kèm khối báo giá trực tiếp), đảm bảo trải nghiệm đọc rộng rãi, cân xứng và thoáng đãng trên máy tính để bàn và laptop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300">
          Mọi cấu hình sau khi nhấn <strong>Lưu Giao Diện</strong> sẽ được ghi trực tiếp vào <code className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">public/data/config.json</code> và tệp máy chủ AI Studio.
        </div>
        <button
          type="button"
          onClick={() => handleSave()}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shrink-0 shadow-md flex items-center gap-2"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-950" />
              <span>Đã lưu thành công!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu & Đồng Bộ Ngay</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
