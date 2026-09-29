'use client';

import React, { useState } from 'react';
import { SitePage, PageSection, AiSettingsConfig } from '@/lib/types';
import { initialPages } from '@/lib/initial-data';
import {
  Globe, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Eye, CheckCircle2,
  Sparkles, Search, Layers, Settings, FileText, Check, Copy, ExternalLink,
  ChevronRight, RefreshCw, AlertCircle, LayoutTemplate, Tag, AlignLeft,
  X, Compass, ShieldCheck, Home, Sliders, Zap
} from 'lucide-react';

interface AdminPagesManagerProps {
  pages: SitePage[];
  aiSettings: AiSettingsConfig;
  onSavePages: (pages: SitePage[]) => void;
  onAddPage: (page: Omit<SitePage, 'id'> & { id?: string }) => void;
  onUpdatePage: (id: string, updates: Partial<SitePage>) => void;
  onDeletePage: (id: string) => void;
  onReorderPages: (orderedIds: string[]) => void;
}

export default function AdminPagesManager({
  pages,
  aiSettings,
  onSavePages,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onReorderPages
}: AdminPagesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [menuFilter, setMenuFilter] = useState<'all' | 'in_menu' | 'hidden'>('all');
  const [seoFilter, setSeoFilter] = useState<'all' | 'ready' | 'missing'>('all');
  const [sortBy, setSortBy] = useState<'menuOrder' | 'title_asc' | 'title_desc' | 'sections_desc'>('menuOrder');
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'info' | 'layout' | 'seo'>('info');

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiPromptCustom, setAiPromptCustom] = useState('');
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Form State for editing
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formShowInMenu, setFormShowInMenu] = useState(true);
  const [formMenuOrder, setFormMenuOrder] = useState(1);
  const [formHeroImage, setFormHeroImage] = useState('');
  const [formHeroCtaText, setFormHeroCtaText] = useState('');
  const [formHeroCtaLink, setFormHeroCtaLink] = useState('');
  const [formSections, setFormSections] = useState<PageSection[]>([]);
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formFocusKeywords, setFormFocusKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [formMetaRobots, setFormMetaRobots] = useState('index, follow');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');

  // Open modal to add or edit
  const handleOpenAddPage = () => {
    setEditingPage(null);
    setFormTitle('');
    setFormSlug('');
    setFormSubtitle('');
    setFormStatus('published');
    setFormShowInMenu(true);
    setFormMenuOrder(pages.length + 1);
    setFormHeroImage('https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80');
    setFormHeroCtaText('Liên Hệ Báo Giá');
    setFormHeroCtaLink('/lien-he');
    setFormSections([
      {
        id: `sec-${Date.now()}-1`,
        type: 'hero',
        title: 'Tiêu đề trang giới thiệu',
        content: 'Nội dung tóm tắt dịch vụ chất lượng từ trạm trộn Bê Tông An Gia Bình Ninh Bình.',
        badge: 'Bê Tông An Gia Bình'
      },
      {
        id: `sec-${Date.now()}-2`,
        type: 'rich_text',
        title: 'Nội dung chi tiết',
        content: 'Cung cấp bê tông thương phẩm đạt chuẩn TCVN, đo đạc mặt bằng miễn phí, phục vụ 24/7 hotline 0988 2662 93.'
      }
    ]);
    setFormSeoTitle('');
    setFormSeoDescription('');
    setFormFocusKeywords(['bê tông tươi ninh bình', 'an gia bình']);
    setFormMetaRobots('index, follow');
    setFormCanonicalUrl('');
    setActiveEditTab('info');
    setShowEditModal(true);
  };

  const handleOpenEditPage = (page: SitePage) => {
    setEditingPage(page);
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormSubtitle(page.subtitle || '');
    setFormStatus(page.status || (page.isPublished ? 'published' : 'draft'));
    setFormShowInMenu(!!page.showInMenu);
    setFormMenuOrder(page.menuOrder ?? 1);
    setFormHeroImage(page.heroImage || '');
    setFormHeroCtaText(page.heroCtaText || 'Tư Vấn Ngay');
    setFormHeroCtaLink(page.heroCtaLink || '/lien-he');
    setFormSections(page.sections ? JSON.parse(JSON.stringify(page.sections)) : []);
    setFormSeoTitle(page.seoTitle || page.title);
    setFormSeoDescription(page.seoDescription || page.subtitle || '');
    setFormFocusKeywords(page.focusKeywords || []);
    setFormMetaRobots(page.metaRobots || 'index, follow');
    const pageSlug = page.slug === 'gioi-thieu' ? 'about' : page.slug;
    const initialCanonical = (page.canonicalUrl || `https://betongangiabinh.vn/${pageSlug}`)
      .replace('betongangiabinh.vn/trang/', 'betongangiabinh.vn/')
      .replace('/gioi-thieu', '/about');
    setFormCanonicalUrl(initialCanonical);
    setActiveEditTab('info');
    setShowEditModal(true);
  };

  // Move page menu order Up / Down
  const handleMovePageOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Recalculate menuOrder
    const updated = newPages.map((p, i) => ({ ...p, menuOrder: i + 1 }));
    onSavePages(updated);
  };

  // Toggle page visibility in menu
  const handleToggleMenu = (page: SitePage) => {
    onUpdatePage(page.id, { showInMenu: !page.showInMenu });
  };

  // Add section
  const handleAddSection = (type: PageSection['type']) => {
    const newSec: PageSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title: type === 'features' ? 'Ưu Điểm Vượt Trội' : type === 'cta' ? 'Liên Hệ Đặt Bê Tông' : 'Tiêu Đề Khối',
      content: 'Nội dung chi tiết của khối này...',
      badge: type === 'hero' ? 'Bê Tông An Gia Bình' : undefined,
      items: type === 'features' ? ['Trạm đôi 450m³/h KCN Khánh Phú & Kim Sơn', 'Đội xe 35+ xe bồn', 'Kiểm định nén mẫu TCVN'] : undefined
    };
    setFormSections(prev => [...prev, newSec]);
  };

  // Move section Up / Down
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= formSections.length) return;
    const newSecs = [...formSections];
    const temp = newSecs[index];
    newSecs[index] = newSecs[target];
    newSecs[target] = temp;
    setFormSections(newSecs);
  };

  const handleDeleteSection = (index: number) => {
    setFormSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, updates: Partial<PageSection>) => {
    setFormSections(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  // Add keyword
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !formFocusKeywords.includes(trimmed)) {
      setFormFocusKeywords(prev => [...prev, trimmed]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormFocusKeywords(prev => prev.filter(k => k !== kw));
  };

  // Save Page
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập tên trang.');
      return;
    }

    const cleanSlug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const rawCanonical = formCanonicalUrl.trim() || `https://betongangiabinh.vn/${cleanSlug}`;
    const sanitizedCanonical = rawCanonical
      .replace('betongangiabinh.vn/trang/', 'betongangiabinh.vn/')
      .replace('/gioi-thieu', '/about');

    const payload: Omit<SitePage, 'id'> = {
      title: formTitle.trim(),
      slug: cleanSlug,
      subtitle: formSubtitle.trim(),
      status: formStatus,
      showInMenu: formShowInMenu,
      menuOrder: Number(formMenuOrder) || 1,
      heroImage: formHeroImage.trim(),
      heroCtaText: formHeroCtaText.trim(),
      heroCtaLink: formHeroCtaLink.trim(),
      sections: formSections,
      seoTitle: formSeoTitle.trim() || `${formTitle.trim()} | Bê Tông An Gia Bình`,
      seoDescription: formSeoDescription.trim() || formSubtitle.trim(),
      focusKeywords: formFocusKeywords,
      metaRobots: formMetaRobots,
      canonicalUrl: sanitizedCanonical,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingPage) {
      onUpdatePage(editingPage.id, payload);
    } else {
      onAddPage(payload);
    }

    setShowEditModal(false);
  };

  // AI Content & SEO Writer
  const handleRunAiWriter = async () => {
    if (!formTitle.trim()) {
      alert('Vui lòng nhập Tên Trang trước khi viết bằng AI.');
      return;
    }

    setIsGeneratingAi(true);
    setAiSuccessMessage('');

    try {
      const res = await fetch('/api/ai/page-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: formTitle,
          slug: formSlug,
          prompt: aiPromptCustom,
          targetKeywords: formFocusKeywords.join(', '),
          activeProvider: aiSettings?.activeProvider || 'gemini',
          aiConfigs: aiSettings
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.seoTitle) setFormSeoTitle(d.seoTitle);
        if (d.seoDescription) setFormSeoDescription(d.seoDescription);
        if (Array.isArray(d.focusKeywords) && d.focusKeywords.length > 0) {
          setFormFocusKeywords(d.focusKeywords);
        }
        if (d.subtitle) setFormSubtitle(d.subtitle);
        if (d.heroCtaText) setFormHeroCtaText(d.heroCtaText);
        if (d.heroCtaLink) setFormHeroCtaLink(d.heroCtaLink);
        if (Array.isArray(d.sections) && d.sections.length > 0) {
          setFormSections(d.sections);
        }
        setAiSuccessMessage(`AI (${aiSettings?.activeProvider?.toUpperCase() || 'GEMINI'}) đã tạo nội dung và tối ưu SEO thành công!`);
        setTimeout(() => setAiSuccessMessage(''), 4000);
      } else {
        alert(json.error || 'Lỗi khi tạo nội dung với AI');
      }
    } catch (err: any) {
      alert(`Lỗi gọi AI: ${err.message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filtered and sorted pages
  const filteredPages = pages
    .filter(p => {
      // Search
      const matchesSearch =
        !searchTerm.trim() ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.seoTitle && p.seoTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Menu filter
      if (menuFilter === 'in_menu' && !p.showInMenu) return false;
      if (menuFilter === 'hidden' && p.showInMenu) return false;

      // SEO Readiness
      const hasSeo = Boolean(p.seoTitle && p.seoDescription && p.focusKeywords && p.focusKeywords.length > 0);
      if (seoFilter === 'ready' && !hasSeo) return false;
      if (seoFilter === 'missing' && hasSeo) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title, 'vi');
      if (sortBy === 'title_desc') return b.title.localeCompare(a.title, 'vi');
      if (sortBy === 'sections_desc') return (b.sections?.length || 0) - (a.sections?.length || 0);
      return (a.menuOrder || 0) - (b.menuOrder || 0);
    });

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || menuFilter !== 'all' || seoFilter !== 'all';

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMenuFilter('all');
    setSeoFilter('all');
    setSortBy('menuOrder');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-2">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>Hệ Thống Quản Lý Trang &amp; Điều Hướng Menu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản Lý Các Trang &amp; Tối Ưu SEO
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chỉnh sửa thông tin, thay đổi bố cục, quản lý menu website và tối ưu hóa SEO bằng trí tuệ nhân tạo AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddPage}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Trang Mới</span>
          </button>
        </div>
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trang theo tên, đường dẫn slug: gioi-thieu, bang-gia, ho-so-nang-luc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap">
            <span>Đang hiển thị: <strong className="text-slate-900 font-mono">{filteredPages.length}</strong> / {pages.length} trang</span>
            <span>•</span>
            <span>Trên menu: <strong className="text-amber-600 font-mono">{pages.filter(p => p.showInMenu).length}</strong></span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-500 font-semibold">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="all">Tất cả ({pages.length})</option>
              <option value="published">Đã xuất bản ({pages.filter(p => p.status === 'published').length})</option>
              <option value="draft">Bản nháp ({pages.filter(p => p.status === 'draft').length})</option>
            </select>
          </div>

          {/* Menu filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-500 font-semibold">Menu:</span>
            <select
              value={menuFilter}
              onChange={(e) => setMenuFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="in_menu">Có trên Menu ({pages.filter(p => p.showInMenu).length})</option>
              <option value="hidden">Ẩn khỏi Menu ({pages.filter(p => !p.showInMenu).length})</option>
            </select>
          </div>

          {/* SEO readiness filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-500 font-semibold">Điểm SEO:</span>
            <select
              value={seoFilter}
              onChange={(e) => setSeoFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="all">Tất cả trang</option>
              <option value="ready">Đã chuẩn SEO</option>
              <option value="missing">Cần tối ưu thêm</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 ml-auto">
            <span className="text-slate-500 font-semibold">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="menuOrder">Thứ tự Menu</option>
              <option value="title_asc">Tên trang (A → Z)</option>
              <option value="title_desc">Tên trang (Z → A)</option>
              <option value="sections_desc">Nhiều khối nội dung nhất</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold transition"
            >
              Đặt lại bộ lọc ✕
            </button>
          )}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Thứ Tự</th>
                <th className="py-3.5 px-4">Tên Trang &amp; Đường Dẫn</th>
                <th className="py-3.5 px-4">Menu Chính</th>
                <th className="py-3.5 px-4">Bố Cục (Khối)</th>
                <th className="py-3.5 px-4">Điểm SEO</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map((page, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredPages.length - 1;
                const sectionCount = page.sections?.length || 0;
                const hasSeo = Boolean(page.seoTitle && page.seoDescription);

                return (
                  <tr key={page.id} className="hover:bg-slate-50/80 transition">
                    {/* Order buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono font-bold text-slate-500 w-5">
                          {page.menuOrder || index + 1}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMovePageOrder(index, 'up')}
                            className="p-0.5 text-slate-400 hover:text-amber-600 disabled:opacity-20"
                            title="Di chuyển lên trên"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMovePageOrder(index, 'down')}
                            className="p-0.5 text-slate-400 hover:text-amber-600 disabled:opacity-20"
                            title="Di chuyển xuống dưới"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{page.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        /{page.slug}
                      </div>
                      {page.subtitle && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-sm">
                          {page.subtitle}
                        </div>
                      )}
                    </td>

                    {/* Show in menu toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleMenu(page)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          page.showInMenu
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {page.showInMenu ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{page.showInMenu ? 'Hiển thị' : 'Ẩn'}</span>
                      </button>
                    </td>

                    {/* Sections count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[11px]">
                        <Layers className="w-3 h-3 text-amber-600" />
                        <span>{sectionCount} khối bố cục</span>
                      </span>
                    </td>

                    {/* SEO badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        hasSeo
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{hasSeo ? 'Chuẩn SEO' : 'Chưa tối ưu'}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        page.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {page.status === 'published' ? 'Đã Đăng' : 'Bản Nháp'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`/${page.slug === 'home' ? '' : page.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          title="Xem trang thực tế"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPage(page)}
                          className="px-3 py-1.5 text-slate-900 bg-amber-100 hover:bg-amber-200 rounded-lg font-bold text-xs transition flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Chỉnh Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa trang "${page.title}" không?`)) {
                              onDeletePage(page.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                          title="Xóa trang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Page Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingPage ? `Chỉnh Sửa Trang: ${editingPage.title}` : 'Thêm Trang Mới'}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Cấu hình thông tin, bố cục các khối và tối ưu SEO cho trang web
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Nút Viết Bằng AI */}
                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleRunAiWriter}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  title="Sử dụng AI tự động viết nội dung và tối ưu SEO"
                >
                  {isGeneratingAi ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  )}
                  <span>{isGeneratingAi ? 'AI Đang Viết...' : 'Viết Bằng AI ✨'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Success Notification */}
            {aiSuccessMessage && (
              <div className="bg-emerald-50 text-emerald-800 px-6 py-3 text-xs font-bold border-b border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            {/* Sub-Tabs: Info, Layout, SEO */}
            <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-white text-xs font-bold pt-2">
              <button
                type="button"
                onClick={() => setActiveEditTab('info')}
                className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
                  activeEditTab === 'info'
                    ? 'border-amber-500 text-amber-900 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>1. Thông Tin Cơ Bản</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('layout')}
                className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
                  activeEditTab === 'layout'
                    ? 'border-amber-500 text-amber-900 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Bố Cục &amp; Các Khối ({formSections.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('seo')}
                className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
                  activeEditTab === 'seo'
                    ? 'border-amber-500 text-amber-900 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Tối Ưu SEO Cho Trang</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePage} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: BASIC INFO */}
              {activeEditTab === 'info' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tên Trang *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!editingPage) {
                            setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                          }
                        }}
                        placeholder="Ví dụ: Giới Thiệu, Bảng Báo Giá..."
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Đường dẫn tĩnh (Slug) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">/</span>
                        <input
                          type="text"
                          required
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                          placeholder="gioi-thieu"
                          className="w-full bg-white border border-slate-300 text-slate-900 pl-6 pr-3.5 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Lời Tựa / Slogan Trang
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Thông điệp chính hiển thị dưới tiêu đề trang..."
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Trạng Thái Xuất Bản
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 font-semibold"
                      >
                        <option value="published">Đã Xuất Bản (Hiển thị ngoài web)</option>
                        <option value="draft">Bản Nháp (Chỉ admin thấy)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Thứ Tự Trên Menu
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={formMenuOrder}
                        onChange={(e) => setFormMenuOrder(parseInt(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="show-in-menu-check"
                        checked={formShowInMenu}
                        onChange={(e) => setFormShowInMenu(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="show-in-menu-check" className="text-xs font-bold text-slate-700 cursor-pointer">
                        Hiển thị trang trên Menu chính
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ảnh Bìa Hero (URL)
                    </label>
                    <input
                      type="text"
                      value={formHeroImage}
                      onChange={(e) => setFormHeroImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                    />
                    {formHeroImage && (
                      <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200">
                        <img src={formHeroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nút Kêu Gọi Hành Động (Hero CTA Text)
                      </label>
                      <input
                        type="text"
                        value={formHeroCtaText}
                        onChange={(e) => setFormHeroCtaText(e.target.value)}
                        placeholder="Tư Vấn & Báo Giá"
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Đường Dẫn Nút CTA (Hero CTA Link)
                      </label>
                      <input
                        type="text"
                        value={formHeroCtaLink}
                        onChange={(e) => setFormHeroCtaLink(e.target.value)}
                        placeholder="/lien-he"
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LAYOUT & SECTIONS */}
              {activeEditTab === 'layout' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Bố Cục Các Khối Nội Dung</h4>
                      <p className="text-xs text-slate-500">
                        Thêm, bớt và sắp xếp các khối hiển thị trên trang theo ý muốn.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddSection('hero')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition"
                      >
                        + Khối Hero
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSection('features')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition"
                      >
                        + Khối Ưu Điểm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSection('rich_text')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition"
                      >
                        + Khối Văn Bản
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSection('cta')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition"
                      >
                        + Khối Kêu Gọi (CTA)
                      </button>
                    </div>
                  </div>

                  {/* List of sections */}
                  <div className="space-y-4">
                    {formSections.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                        Chưa có khối nào. Hãy bấm thêm khối bên trên hoặc bấm &quot;Viết Bằng AI&quot; để tự động tạo.
                      </div>
                    ) : (
                      formSections.map((sec, idx) => (
                        <div key={sec.id || idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-slate-100 font-bold text-[11px] flex items-center justify-center text-slate-600">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                {sec.type}
                              </span>
                              <input
                                type="text"
                                value={sec.title || ''}
                                onChange={(e) => handleUpdateSection(idx, { title: e.target.value })}
                                placeholder="Tiêu đề khối..."
                                className="font-bold text-xs text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-amber-500 px-1 py-0.5 outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveSection(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Lên trên"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formSections.length - 1}
                                onClick={() => handleMoveSection(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Xuống dưới"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(idx)}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Xóa khối này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <textarea
                              rows={3}
                              value={sec.content || ''}
                              onChange={(e) => handleUpdateSection(idx, { content: e.target.value })}
                              placeholder="Nội dung chi tiết của khối..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-amber-500"
                            />
                          </div>

                          {sec.items && (
                            <div className="space-y-1.5 pt-2">
                              <span className="text-[11px] font-bold text-slate-500">Các điểm nổi bật (Items):</span>
                              {sec.items.map((it, itemIdx) => (
                                <div key={itemIdx} className="flex items-center gap-2">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <input
                                    type="text"
                                    value={typeof it === 'string' ? it : (it.title || '')}
                                    onChange={(e) => {
                                      const newItems = [...(sec.items || [])];
                                      if (typeof it === 'string') {
                                        newItems[itemIdx] = e.target.value;
                                      } else {
                                        newItems[itemIdx] = { ...it, title: e.target.value };
                                      }
                                      handleUpdateSection(idx, { items: newItems });
                                    }}
                                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SEO OPTIMIZATION */}
              {activeEditTab === 'seo' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Google Snippet Live Preview */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      Xem Trước Hiển Thị Trên Google Tìm Kiếm (SERP Snippet)
                    </span>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 max-w-2xl">
                      <div className="text-xs text-slate-700 flex items-center gap-1 mb-1">
                        <span className="font-semibold text-slate-800">betongangiabinh.vn</span>
                        <span className="text-slate-400">&gt;</span>
                        <span className="text-slate-500">{formSlug || 'trang'}</span>
                      </div>
                      <h4 className="text-blue-800 hover:underline font-medium text-base line-clamp-1 cursor-pointer">
                        {formSeoTitle || `${formTitle} | Bê Tông An Gia Bình Ninh Bình`}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {formSeoDescription || formSubtitle || 'Trạm trộn bê tông tươi, bê tông thương phẩm công nghệ cao tại Ninh Bình. Phục vụ 24/7 hotline 0988 2662 93.'}
                      </p>
                    </div>
                  </div>

                  {/* SEO Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tiêu Đề SEO (Meta Title)
                      </label>
                      <span className={`text-[11px] font-mono ${
                        formSeoTitle.length > 65 ? 'text-red-500 font-bold' : 'text-slate-400'
                      }`}>
                        {formSeoTitle.length}/60 ký tự
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      placeholder="Báo Giá Bê Tông Tươi Ninh Bình | An Gia Bình Mác 200-400"
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Đoạn Mô Tả SEO (Meta Description)
                      </label>
                      <span className={`text-[11px] font-mono ${
                        formSeoDescription.length > 165 ? 'text-red-500 font-bold' : 'text-slate-400'
                      }`}>
                        {formSeoDescription.length}/160 ký tự
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formSeoDescription}
                      onChange={(e) => setFormSeoDescription(e.target.value)}
                      placeholder="Tổng hợp báo giá bê tông tươi tại Ninh Bình từ trạm trộn An Gia Bình. Cung cấp đúng mác, đủ khối lượng, phục vụ 24/7 hotline 0988 2662 93."
                      className="w-full bg-white border border-slate-300 text-slate-900 p-3.5 rounded-xl text-xs focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Focus Keywords */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Từ Khóa Trọng Tâm (Focus Keywords)
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="Nhập từ khóa rồi bấm Enter hoặc Thêm..."
                        className="flex-1 bg-white border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl text-xs focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        Thêm Từ Khóa
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {formFocusKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          <span>#{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="hover:text-red-700 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Robots & Canonical */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Chỉ Thị Robots (Meta Robots)
                      </label>
                      <select
                        value={formMetaRobots}
                        onChange={(e) => setFormMetaRobots(e.target.value)}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500 font-semibold"
                      >
                        <option value="index, follow">index, follow (Cho phép Google lập chỉ mục)</option>
                        <option value="noindex, nofollow">noindex, nofollow (Không lập chỉ mục trang này)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Thẻ Canonical URL
                      </label>
                      <input
                        type="text"
                        value={formCanonicalUrl}
                        onChange={(e) => setFormCanonicalUrl(e.target.value)}
                        placeholder={`https://betongangiabinh.vn/${formSlug || ''}`}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPage ? 'Lưu Thay Đổi Trang' : 'Tạo Trang Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
