'use client';

import React, { useState } from 'react';
import { SiteMenu, MenuItem, SitePage, CategoryItem } from '@/lib/types';
import {
  Menu as MenuIcon, Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink,
  RotateCcw, Check, Sparkles, Link2, Globe, Layers, Eye, FolderTree, AlertCircle
} from 'lucide-react';

interface AdminMenuManagerProps {
  menus: SiteMenu[];
  pages: SitePage[];
  categories: CategoryItem[];
  onSaveMenus: (menus: SiteMenu[]) => void;
  onAddMenuItem: (menuId: string, item: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem: (menuId: string, item: MenuItem) => void;
  onDeleteMenuItem: (menuId: string, itemId: string) => void;
  onResetDefaultMenus: () => void;
}

export default function AdminMenuManager({
  menus,
  pages,
  categories,
  onSaveMenus,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onResetDefaultMenus
}: AdminMenuManagerProps) {
  const [activeMenuId, setActiveMenuId] = useState<string>(menus[0]?.id || 'main-menu');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  // Form states for item
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formTarget, setFormTarget] = useState<'_self' | '_blank'>('_self');
  const [formBadge, setFormBadge] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [quickLinkType, setQuickLinkType] = useState<'custom' | 'page' | 'category'>('custom');

  const currentMenu = menus.find(m => m.id === activeMenuId) || menus[0];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormUrl('/');
    setFormOrder((currentMenu?.items.length || 0) + 1);
    setFormTarget('_self');
    setFormBadge('');
    setFormIcon('');
    setQuickLinkType('custom');
    setShowItemModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormTitle(item.title || item.label || '');
    setFormUrl(item.url);
    setFormOrder(item.order);
    setFormTarget(item.target || '_self');
    setFormBadge(item.badge || '');
    setFormIcon(item.icon || '');
    setQuickLinkType('custom');
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) {
      alert('Vui lòng nhập tên hiển thị và đường dẫn URL.');
      return;
    }

    if (editingItem) {
      onUpdateMenuItem(currentMenu.id, {
        ...editingItem,
        label: formTitle.trim(),
        title: formTitle.trim(),
        url: formUrl.trim(),
        order: Number(formOrder) || 1,
        target: formTarget,
        badge: formBadge.trim() || undefined,
        icon: formIcon.trim() || undefined,
        isActive: editingItem.isActive ?? true,
      });
    } else {
      onAddMenuItem(currentMenu.id, {
        label: formTitle.trim(),
        title: formTitle.trim(),
        url: formUrl.trim(),
        order: Number(formOrder) || (currentMenu.items.length + 1),
        target: formTarget,
        badge: formBadge.trim() || undefined,
        icon: formIcon.trim() || undefined,
        isActive: true,
      });
    }

    setShowItemModal(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!currentMenu) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentMenu.items.length) return;

    const items = [...currentMenu.items];
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;

    // Recalculate order numbers
    const updatedItems = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    const updatedMenus = menus.map(m => m.id === currentMenu.id ? { ...m, items: updatedItems } : m);
    onSaveMenus(updatedMenus);
  };

  const handleQuickSelectPage = (pageSlug: string, pageTitle: string) => {
    setFormTitle(pageTitle);
    setFormUrl(`/${pageSlug.replace(/^\//, '')}`);
  };

  const handleQuickSelectCategory = (catSlug: string, catName: string) => {
    setFormTitle(catName);
    setFormUrl(`/blog/${catSlug}`);
  };

  const handleSyncPagesToMenu = () => {
    if (!confirm('Bạn có muốn tự động thêm tất cả các Trang đang bật "Hiển thị trên menu" vào Menu chính không?')) return;
    const existingUrls = new Set(currentMenu.items.map(i => i.url));
    const activePages = pages.filter(p => p.showInMenu && !existingUrls.has(`/${p.slug}`));

    if (activePages.length === 0) {
      alert('Tất cả các trang bật hiển thị đã có sẵn trong menu!');
      return;
    }

    let nextOrder = currentMenu.items.length + 1;
    activePages.forEach(p => {
      onAddMenuItem(currentMenu.id, {
        label: p.title,
        title: p.title,
        url: `/${p.slug}`,
        order: nextOrder++,
        target: '_self',
        isActive: true,
      });
    });

    alert(`Đã thêm thành công ${activePages.length} trang vào ${currentMenu.name || currentMenu.title || 'menu'}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase mb-2">
            <MenuIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>Hệ Thống Quản Trị Menu &amp; Điều Hướng Điều Phối</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản Lý Menu Điều Hướng Website
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý thanh điều hướng Header chính, Top Bar và Chân trang Footer. Kéo thả hoặc thay đổi thứ tự menu linh hoạt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncPagesToMenu}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl text-xs transition border border-slate-300"
            title="Tự động đồng bộ các trang đã tạo vào menu"
          >
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>Nhập Trang Tự Động</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Khôi phục toàn bộ các Menu về cấu trúc tiêu chuẩn ban đầu của Bê Tông An Gia Bình?')) {
                onResetDefaultMenus();
              }
            }}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs transition border border-slate-300"
            title="Khôi phục menu gốc"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Mục Menu Mới</span>
          </button>
        </div>
      </div>

      {/* Menu Selector Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveMenuId(menu.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
              activeMenuId === menu.id
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{menu.title}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeMenuId === menu.id ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
            }`}>
              {menu.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Menu Preview Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Eye className="w-4 h-4" />
            <span>Xem Trước Trực Quan Thanh Điều Hướng: {currentMenu?.title}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Vị trí: {currentMenu?.location}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 overflow-x-auto text-xs py-1">
          {currentMenu?.items.map((it) => (
            <div
              key={it.id}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{it.title}</span>
              {it.badge && (
                <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                  {it.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <MenuIcon className="w-4 h-4 text-amber-600" />
            <span>Danh Sách Các Liên Kết Trong &ldquo;{currentMenu?.title}&rdquo;</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Tổng: {currentMenu?.items.length} liên kết</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-20 text-center">Thứ Tự</th>
                <th className="py-3 px-4">Tên Hiển Thị (Title)</th>
                <th className="py-3 px-4">Đường Dẫn (URL)</th>
                <th className="py-3 px-4 text-center">Huy Hiệu (Badge)</th>
                <th className="py-3 px-4 text-center">Mở Tab</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentMenu?.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                        title="Di chuyển lên"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs w-4">{item.order}</span>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === currentMenu.items.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {item.url}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {item.badge ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase border border-amber-200">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                    {item.target === '_blank' ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                        <ExternalLink className="w-2.5 h-2.5" />
                        Tab mới
                      </span>
                    ) : (
                      <span className="text-slate-400">Tab hiện tại</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        title="Chỉnh sửa mục menu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa mục "${item.title}" khỏi menu?`)) {
                            onDeleteMenuItem(currentMenu.id, item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa mục menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!currentMenu?.items || currentMenu.items.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có liên kết nào trong menu này. Nhấn &ldquo;+ Thêm Mục Menu Mới&rdquo; để bắt đầu!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <MenuIcon className="w-4 h-4 text-amber-600" />
                <span>{editingItem ? 'Chỉnh Sửa Mục Menu' : 'Thêm Mục Mới Vào Menu'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Quick Pick Links */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Chọn nhanh từ Trang hoặc Chuyên Mục có sẵn:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    onChange={(e) => {
                      const p = pages.find(page => page.slug === e.target.value);
                      if (p) handleQuickSelectPage(p.slug, p.title);
                    }}
                    className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-700 focus:bg-white"
                  >
                    <option value="">-- Chọn Trang Có Sẵn --</option>
                    {pages.map(p => (
                      <option key={p.id} value={p.slug}>{p.title} (/{p.slug})</option>
                    ))}
                  </select>

                  <select
                    onChange={(e) => {
                      const cat = categories.find(c => c.slug === e.target.value);
                      if (cat) handleQuickSelectCategory(cat.slug, cat.name);
                    }}
                    className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-700 focus:bg-white"
                  >
                    <option value="">-- Chọn Chuyên Mục Blog --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tên hiển thị trên Menu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo Giá, Giới Thiệu, Hồ Sơ Năng Lực..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Đường dẫn (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: /bang-gia hoặc https://..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Huy hiệu nổi bật (Badge)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: HOT, MỚI, BÁO GIÁ"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-amber-800 font-bold uppercase focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Cách mở liên kết</label>
                <select
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value as '_self' | '_blank')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white"
                >
                  <option value="_self">Mở trong cùng tab (_self) - Khuyên dùng cho trang nội bộ</option>
                  <option value="_blank">Mở tab mới (_blank) - Dành cho link ngoài</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Lưu Thay Đổi' : 'Thêm Vào Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
