'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Phone, Menu, X, ShieldCheck, Facebook, Lock,
  ChevronDown, ChevronRight, HardHat, FileText,
  Building2, Layers, Briefcase, Mail
} from 'lucide-react';

export default function Navbar() {
  const { jekyllConfig, pages } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileFreshConcreteOpen, setMobileFreshConcreteOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);

  // Dynamic pages marked as inMenu from admin
  const customMenuPages = (pages || []).filter(
    (p) => p.status === 'published' && p.inMenu && !['/', '/about', '/du-an', '/blog', '/tuyen-dung', '/lien-he'].includes(p.slug)
  );

  // Sync Favicon dynamically from website configuration
  useEffect(() => {
    if (jekyllConfig?.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = jekyllConfig.favicon;
    }
  }, [jekyllConfig?.favicon]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Bar */}
      {jekyllConfig?.showHeaderTopBar !== false && (
        <div className="bg-slate-100 text-slate-700 text-xs py-1.5 px-3 sm:px-4 border-b border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-amber-800 font-bold truncate">
                {jekyllConfig?.title || "Trạm Trộn Bê Tông Tươi An Gia Bình"}
              </span>
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="hidden md:inline text-slate-600 truncate">
                {jekyllConfig?.headerNotice || "Trạm 1: KCN Khánh Phú • Trạm 2: Kim Sơn • 35+ Xe bồn"}
              </span>
            </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <a
              href="https://www.facebook.com/betongangiabinh/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium py-1 px-1.5 rounded transition"
              id="nav-fanpage-link"
              aria-label="Truy cập Fanpage Facebook Bê Tông An Gia Bình"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">fb.com/betongangiabinh</span>
              <span className="xs:hidden sm:hidden">Fanpage</span>
            </a>
            <span className="text-slate-300">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-amber-700 font-medium py-1 px-1.5 rounded transition"
              id="nav-admin-link"
              aria-label="Đăng nhập trang quản trị"
            >
              <Lock className="w-3 h-3" />
              <span>Quản Trị</span>
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-1 mr-1 sm:mr-2" id="nav-brand-logo">
            {jekyllConfig?.logo ? (
              <img
                src={jekyllConfig.logo}
                alt={jekyllConfig.title || 'Bê Tông An Gia Bình'}
                width={120}
                height={44}
                className="h-9 sm:h-11 w-auto max-w-[100px] sm:max-w-[130px] rounded-lg sm:rounded-xl object-contain shadow-xs group-hover:scale-105 transition shrink-0"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-lg sm:text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition shrink-0">
                AGB
              </div>
            )}
            <div className="min-w-0">
              <div className="font-extrabold text-sm sm:text-xl tracking-tight text-slate-900 leading-tight truncate">
                {jekyllConfig?.title || 'BÊ TÔNG AN GIA BÌNH'}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-amber-600 tracking-wider uppercase mt-0.5 truncate max-w-[170px] xs:max-w-[260px] sm:max-w-none">
                {jekyllConfig?.slogan || 'Bê Tông Tươi Ninh Bình • Uy Tín Số 1'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold text-slate-700">
            {/* 1. Trang chủ */}
            <Link href="/" className="hover:text-amber-600 transition py-2" id="nav-home">
              Trang chủ
            </Link>

            {/* 2. Giới thiệu (Dropdown with ChevronDown) */}
            <div className="relative group py-2">
              <Link
                href="/about"
                className="hover:text-amber-600 transition inline-flex items-center gap-1"
                id="nav-about"
              >
                <span>Giới thiệu</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition group-hover:rotate-180" />
              </Link>

              {/* Submenu Dropdown */}
              <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:block transition-all animate-in fade-in duration-150 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 divide-y divide-slate-100">
                  <Link
                    href="/about/thu-ngo"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Thư ngỏ
                  </Link>
                  <Link
                    href="/about#tamnhin"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Tầm nhìn
                  </Link>
                  <Link
                    href="/about#sumenh"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Sứ mệnh
                  </Link>
                  <Link
                    href="/about#giatri"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Giá trị cốt lõi
                  </Link>
                  <Link
                    href="/about#doitac"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Đối tác chiến lược
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Lĩnh vực hoạt động (Nested Submenu with ChevronDown) */}
            <div className="relative group py-2">
              <Link
                href="/linh-vuc-hoat-dong"
                className="hover:text-amber-600 transition inline-flex items-center gap-1"
                id="nav-services"
              >
                <span>Lĩnh vực hoạt động</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition group-hover:rotate-180" />
              </Link>

              {/* Main Dropdown */}
              <div className="absolute top-full left-0 pt-2 w-72 hidden group-hover:block transition-all animate-in fade-in duration-150 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 divide-y divide-slate-100">
                  {/* Nested Submenu: Bê tông tươi (arrow right) */}
                  {/* Bê tông tươi flyout with 4 sub-items */}
                  <div className="relative group/nested">
                    <Link
                      href="/be-tong-tuoi"
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-800 hover:bg-amber-50 hover:text-amber-600 font-bold transition cursor-pointer"
                    >
                      <span>Bê tông tươi</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/nested:text-amber-600 transition" />
                    </Link>

                    {/* 4-level child submenu flies out to right */}
                    <div className="absolute top-0 left-full pl-2 w-64 hidden group-hover/nested:block animate-in fade-in duration-150 z-50">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 divide-y divide-slate-100">
                        <Link
                          href="/be-tong-tuoi/be-tong-thuong"
                          className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                        >
                          + Bê tông thường
                        </Link>
                        <Link
                          href="/be-tong-tuoi/be-tong-chong-tham"
                          className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                        >
                          + Bê tông chống thấm
                        </Link>
                        <Link
                          href="/be-tong-tuoi/be-tong-chat-luong-cao"
                          className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                        >
                          + Bê tông chất lượng cao
                        </Link>
                        <Link
                          href="/be-tong-tuoi/be-tong-ninh-ket-cham"
                          className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                        >
                          + Bê tông ninh kết chậm
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/be-tong-thuong-pham"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Bê tông thương phẩm
                  </Link>
                  <Link
                    href="/bom-be-tong"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Bơm bê tông (cần 37m-56m & tĩnh)
                  </Link>
                  <Link
                    href="/be-tong-sieu-nhe"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Bê tông siêu nhẹ
                  </Link>
                  <Link
                    href="/be-tong-nhua"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Bê tông nhựa
                  </Link>
                  <Link
                    href="/be-tong-khi-chung-ap"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Bê tông khí chưng áp
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. Dự án */}
            <Link href="/du-an" className="hover:text-amber-600 transition py-2" id="nav-projects">
              Dự án
            </Link>

            {/* 5. Blog (Dropdown with ChevronDown) */}
            <div className="relative group py-2">
              <Link
                href="/blog"
                className="hover:text-amber-600 transition inline-flex items-center gap-1"
                id="nav-blog"
              >
                <span>Blog</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition group-hover:rotate-180" />
              </Link>

              {/* Blog Submenu */}
              <div className="absolute top-full left-0 pt-2 w-48 hidden group-hover:block transition-all animate-in fade-in duration-150 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 divide-y divide-slate-100">
                  <Link
                    href="/blog/tin-tuc"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Tin Tức
                  </Link>
                  <Link
                    href="/blog/kinh-nghiem"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Kinh Nghiệm
                  </Link>
                  <Link
                    href="/blog/kien-thuc"
                    className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition font-medium"
                  >
                    Kiến Thức
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. Tuyển dụng */}
            <Link href="/tuyen-dung" className="hover:text-amber-600 transition py-2" id="nav-recruitment">
              Tuyển dụng
            </Link>

            {/* Dynamic Pages in Menu */}
            {customMenuPages.map((p) => (
              <Link
                key={p.id}
                href={p.slug}
                className="hover:text-amber-600 transition py-2"
                title={p.seoTitle || p.title}
              >
                {p.title}
              </Link>
            ))}

            {/* 7. Liên hệ */}
            <Link href="/lien-he" className="hover:text-amber-600 transition py-2" id="nav-contact">
              Liên hệ
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${(jekyllConfig?.phone || '0988 2662 93').replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition hover:shadow-md"
              id="nav-call-hotline"
            >
              <Phone className="w-4 h-4 animate-pulse" />
              <span>{jekyllConfig?.phone || '0988 2662 93'}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <a
              href={`tel:${(jekyllConfig?.phone || '0988 2662 93').replace(/\s+/g, '')}`}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-400 active:scale-95 transition shadow-xs"
              id="nav-mobile-call-icon"
              aria-label={`Gọi hotline ${jekyllConfig?.phone || '0988 2662 93'}`}
            >
              <Phone className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">Gọi Ngay</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center border border-slate-200"
              aria-label={mobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
              id="nav-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-3 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-1 text-sm font-semibold">
            {/* Trang chủ */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-amber-50 text-slate-800"
            >
              Trang chủ
            </Link>

            {/* Giới thiệu Accordion */}
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between p-3 text-slate-800 hover:bg-amber-50 transition"
              >
                <span>Giới thiệu</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileAboutOpen && (
                <div className="bg-slate-50 px-4 py-2 space-y-1.5 text-xs font-normal border-t border-slate-100">
                  <Link href="/about/thu-ngo" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Thư ngỏ
                  </Link>
                  <Link href="/about#tamnhin" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Tầm nhìn
                  </Link>
                  <Link href="/about#sumenh" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Sứ mệnh
                  </Link>
                  <Link href="/about#giatri" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Giá trị cốt lõi
                  </Link>
                  <Link href="/about#doitac" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Đối tác chiến lược
                  </Link>
                </div>
              )}
            </div>

            {/* Lĩnh vực hoạt động Accordion */}
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between p-3 text-slate-800 hover:bg-amber-50 transition"
              >
                <span>Lĩnh vực hoạt động</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileServicesOpen && (
                <div className="bg-slate-50 px-4 py-2 space-y-2 text-xs font-normal border-t border-slate-100">
                  <Link
                    href="/linh-vuc-hoat-dong"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 font-bold text-amber-700 hover:text-amber-800 border-b border-slate-200/60"
                  >
                    → Xem tổng quan Lĩnh vực hoạt động
                  </Link>

                  {/* Nested Bê tông tươi */}
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                    <button
                      onClick={() => setMobileFreshConcreteOpen(!mobileFreshConcreteOpen)}
                      className="w-full flex items-center justify-between font-bold text-slate-900"
                    >
                      <span>Bê tông tươi (4 loại)</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${mobileFreshConcreteOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {mobileFreshConcreteOpen && (
                      <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5 pl-2">
                        <Link href="/be-tong-tuoi/be-tong-thuong" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-600 hover:text-amber-600">
                          + Bê tông thường
                        </Link>
                        <Link href="/be-tong-tuoi/be-tong-chong-tham" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-600 hover:text-amber-600">
                          + Bê tông chống thấm
                        </Link>
                        <Link href="/be-tong-tuoi/be-tong-chat-luong-cao" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-600 hover:text-amber-600">
                          + Bê tông chất lượng cao
                        </Link>
                        <Link href="/be-tong-tuoi/be-tong-ninh-ket-cham" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-600 hover:text-amber-600">
                          + Bê tông ninh kết chậm
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link href="/be-tong-thuong-pham" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Bê tông thương phẩm
                  </Link>
                  <Link href="/bom-be-tong" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Bơm bê tông (cần & tĩnh)
                  </Link>
                  <Link href="/be-tong-sieu-nhe" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Bê tông siêu nhẹ
                  </Link>
                  <Link href="/be-tong-nhua" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Bê tông nhựa
                  </Link>
                  <Link href="/be-tong-khi-chung-ap" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Bê tông khí chưng áp
                  </Link>
                </div>
              )}
            </div>

            {/* Dự án */}
            <Link
              href="/du-an"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-amber-50 text-slate-800"
            >
              Dự án
            </Link>

            {/* Blog Accordion */}
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                className="w-full flex items-center justify-between p-3 text-slate-800 hover:bg-amber-50 transition"
              >
                <span>Blog</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileBlogOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileBlogOpen && (
                <div className="bg-slate-50 px-4 py-2 space-y-1.5 text-xs font-normal border-t border-slate-100">
                  <Link href="/blog/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Tin Tức
                  </Link>
                  <Link href="/blog/kinh-nghiem" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Kinh Nghiệm
                  </Link>
                  <Link href="/blog/kien-thuc" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700 hover:text-amber-600">
                    • Kiến Thức
                  </Link>
                </div>
              )}
            </div>

            {/* Tuyển dụng */}
            <Link
              href="/tuyen-dung"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-amber-50 text-slate-800"
            >
              Tuyển dụng
            </Link>

            {/* Dynamic Pages in Mobile Menu */}
            {customMenuPages.map((p) => (
              <Link
                key={p.id}
                href={p.slug}
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3 rounded-xl hover:bg-amber-50 text-slate-800 font-medium"
              >
                {p.title}
              </Link>
            ))}

            {/* Liên hệ */}
            <Link
              href="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-amber-50 text-slate-800"
            >
              Liên hệ
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <a
              href={`tel:${(jekyllConfig?.phone || '0988 2662 93').replace(/\s+/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold p-3 rounded-xl text-sm"
              id="nav-mobile-call-full"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Trực Tiếp: {jekyllConfig?.phone || '0988 2662 93'} (24/7)</span>
            </a>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <a
                href="https://www.facebook.com/betongangiabinh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold flex items-center gap-1"
              >
                <Facebook className="w-3.5 h-3.5" /> Fanpage Bê Tông An Gia Bình
              </a>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-amber-600 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Trang Quản Trị
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
