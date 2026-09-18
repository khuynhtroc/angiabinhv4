'use client';

import React, { useState } from 'react';
import { SchemaSettings } from '@/lib/types';
import {
  Code, Check, Copy, ExternalLink, Globe, FileText, Building2,
  Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Info, RefreshCw
} from 'lucide-react';

interface AdminSchemaSettingsSectionProps {
  settings: SchemaSettings;
  onSaveSchemaSettings: (settings: Partial<SchemaSettings>) => void;
}

export default function AdminSchemaSettingsSection({
  settings,
  onSaveSchemaSettings
}: AdminSchemaSettingsSectionProps) {
  const [formData, setFormData] = useState<SchemaSettings>(settings);
  const [previewType, setPreviewType] = useState<'organization' | 'post' | 'page'>('organization');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = (updates: Partial<SchemaSettings>) => {
    const updated = { ...formData, ...updates };
    setFormData(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchemaSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Generate Sample JSON-LD based on user settings
  const generatePreviewJsonLd = () => {
    if (previewType === 'organization') {
      return JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": formData.businessType || "LocalBusiness",
          "name": formData.organizationName || "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
          "legalName": formData.legalName || "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
          "taxID": formData.taxId || "2700870972",
          "vatID": formData.vatID || "2700870972",
          "url": "https://betongangiabinh.vn",
          "logo": formData.publisherLogo || "https://betongangiabinh.vn/images/logo.png",
          "telephone": formData.telephone || "0988 2662 93",
          "email": formData.email || "ketoan.angiabinh@gmail.com",
          "priceRange": formData.priceRange || "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": formData.streetAddress || "KCN Khánh Phú, Xã Khánh Phú",
            "addressLocality": formData.addressLocality || "Huyện Yên Khánh",
            "addressRegion": formData.addressRegion || "Ninh Bình",
            "postalCode": formData.postalCode || "430000",
            "addressCountry": "VN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": formData.latitude || "20.2506",
            "longitude": formData.longitude || "105.9745"
          },
          "openingHours": formData.openingHours || "Mo-Su 00:00-24:00",
          "areaServed": (formData.areaServed || "Ninh Bình, Nam Định, Hà Nam").split(',').map(s => s.trim())
        },
        null,
        2
      );
    }

    if (previewType === 'post') {
      return JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": formData.postDefaultType || "BlogPosting",
          "headline": "Báo Giá Bê Tông Tươi Tại Ninh Bình Đạt Chuẩn TCVN Mới Nhất",
          "description": "Bảng báo giá bê tông tươi thương phẩm mác 200, 250, 300 từ trạm trộn Bê Tông An Gia Bình.",
          "image": "https://betongangiabinh.vn/images/blog/bao-gia-be-tong-ninh-binh.jpg",
          "datePublished": "2026-03-20T08:00:00+07:00",
          "dateModified": "2026-03-25T10:30:00+07:00",
          "author": {
            "@type": formData.authorType || "Organization",
            "name": formData.defaultAuthorName || "Kỹ Sư Kết Cấu An Gia Bình"
          },
          "publisher": {
            "@type": "Organization",
            "name": formData.organizationName || "Bê Tông An Gia Bình",
            "logo": {
              "@type": "ImageObject",
              "url": formData.publisherLogo || "https://betongangiabinh.vn/images/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://betongangiabinh.vn/blog/bao-gia-be-tong-ninh-binh"
          }
        },
        null,
        2
      );
    }

    // previewType === 'page'
    return JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": formData.pageDefaultType || "WebPage",
        "name": "Giới Thiệu Trạm Trộn Bê Tông An Gia Bình",
        "url": "https://betongangiabinh.vn/gioi-thieu",
        "description": "Năng lực trạm trộn bê tông tươi tự động công suất 450m3/h tại Ninh Bình.",
        "breadcrumb": formData.enableBreadcrumbSchema ? {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Trang Chủ", "item": "https://betongangiabinh.vn" },
            { "@type": "ListItem", "position": 2, "name": "Giới Thiệu", "item": "https://betongangiabinh.vn/gioi-thieu" }
          ]
        } : undefined
      },
      null,
      2
    );
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(generatePreviewJsonLd());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <Code className="w-3.5 h-3.5 text-emerald-700" />
            <span>Khai Báo Dữ Liệu Cấu Trúc Schema.org (JSON-LD)</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Cấu Hình Schema Cho Bài Viết (Post) &amp; Trang (Page)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Khai báo cấu trúc dữ liệu chuẩn Google Rich Snippets để hiển thị ngôi sao đánh giá, địa chỉ địa phương và tiêu đề tác giả trên kết quả tìm kiếm Google.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => handleUpdate({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2.5 text-xs font-bold text-slate-700">
              {formData.enabled ? 'Đang Bật Schema' : 'Tắt Schema'}
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Doanh nghiệp / Tổ chức */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>1. Khai Báo Thực Thể Doanh Nghiệp Địa Phương (Organization / LocalBusiness)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Loại Hình Doanh Nghiệp (Schema Type)</label>
              <select
                value={formData.businessType}
                onChange={(e) => handleUpdate({ businessType: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-medium"
              >
                <option value="LocalBusiness">LocalBusiness (Doanh Nghiệp Địa Phương)</option>
                <option value="GeneralContractor">GeneralContractor (Tổng Thầu Xây Dựng)</option>
                <option value="Corporation">Corporation (Tập Đoàn / Công Ty Cổ Phần)</option>
                <option value="Organization">Organization (Tổ Chức Chung)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Thương Hiệu (Brand Name)</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleUpdate({ organizationName: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Pháp Lý Đầy Đủ (Legal Name)</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleUpdate({ legalName: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa Chỉ Đường Phố (Street Address)</label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => handleUpdate({ streetAddress: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tỉnh / Thành Phố (Address Region)</label>
              <input
                type="text"
                value={formData.addressRegion}
                onChange={(e) => handleUpdate({ addressRegion: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã Bưu Chính (Postal Code)</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleUpdate({ postalCode: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tọa Độ Vĩ Độ (Latitude)</label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleUpdate({ latitude: e.target.value })}
                placeholder="20.2506"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tọa Độ Kinh Độ (Longitude)</label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleUpdate({ longitude: e.target.value })}
                placeholder="105.9745"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Khu Vực Phục Vụ (Area Served)</label>
              <input
                type="text"
                value={formData.areaServed}
                onChange={(e) => handleUpdate({ areaServed: e.target.value })}
                placeholder="Ninh Bình, Nam Định, Hà Nam"
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cấu trúc Schema cho Bài viết & Trang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Post Schema */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>2. Cấu Trúc Schema Cho Bài Viết (Post Schema)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Định Dạng Bài Viết Mặc Định</label>
              <select
                value={formData.postDefaultType}
                onChange={(e) => handleUpdate({ postDefaultType: e.target.value as any })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              >
                <option value="BlogPosting">BlogPosting (Bài viết Blog / Kiến thức)</option>
                <option value="NewsArticle">NewsArticle (Tin tức thời sự / Báo chí)</option>
                <option value="TechArticle">TechArticle (Bài viết hướng dẫn kỹ thuật chuyên sâu)</option>
                <option value="Article">Article (Bài báo tổng hợp chung)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Tác Giả Mặc Định</label>
              <input
                type="text"
                value={formData.defaultAuthorName}
                onChange={(e) => handleUpdate({ defaultAuthorName: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Loại Hình Tác Giả</label>
              <select
                value={formData.authorType}
                onChange={(e) => handleUpdate({ authorType: e.target.value as 'Person' | 'Organization' })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              >
                <option value="Organization">Organization (Đại diện công ty)</option>
                <option value="Person">Person (Chuyên gia cá nhân)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">URL Logo Nhà Xuất Bản (Publisher Logo)</label>
              <input
                type="text"
                value={formData.publisherLogo}
                onChange={(e) => handleUpdate({ publisherLogo: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Page Schema */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>3. Cấu Trúc Schema Cho Trang Tĩnh (Page Schema)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Loại Trang Mặc Định</label>
              <select
                value={formData.pageDefaultType}
                onChange={(e) => handleUpdate({ pageDefaultType: e.target.value as any })}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl"
              >
                <option value="WebPage">WebPage (Trang thông tin thông dụng)</option>
                <option value="AboutPage">AboutPage (Trang giới thiệu công ty)</option>
                <option value="ContactPage">ContactPage (Trang liên hệ)</option>
                <option value="ItemPage">ItemPage (Trang danh mục / dịch vụ)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableBreadcrumbSchema}
                  onChange={(e) => handleUpdate({ enableBreadcrumbSchema: e.target.checked })}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800">Bật BreadcrumbList Schema (Thanh điều hướng phân cấp)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableSiteNavigationSchema}
                  onChange={(e) => handleUpdate({ enableSiteNavigationSchema: e.target.checked })}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800">Bật SiteNavigationElement Schema (Điều hướng Menu)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableFaqSchema}
                  onChange={(e) => handleUpdate({ enableFaqSchema: e.target.checked })}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800">Tự động phát hiện &amp; sinh FAQPage Schema</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Live Preview JSON-LD */}
        <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-emerald-400">Xem Trước Mã Nhúng JSON-LD Trực Tiếp</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewType('organization')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    previewType === 'organization' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Doanh Nghiệp
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewType('post')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    previewType === 'post' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bài Viết (Post)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewType('page')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    previewType === 'page' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Trang (Page)
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyJsonLd}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1.5"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Đã Sao Chép!' : 'Sao Chép JSON-LD'}</span>
              </button>

              <a
                href="https://validator.schema.org/"
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Kiểm Tra Schema</span>
              </a>
            </div>
          </div>

          <pre className="text-[11px] font-mono leading-relaxed bg-slate-900/90 p-4 rounded-xl text-emerald-300/95 overflow-x-auto border border-slate-800/80 max-h-56">
            {generatePreviewJsonLd()}
          </pre>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Đã lưu cấu hình Schema &amp; Dữ liệu cấu trúc thành công!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Khai Báo Schema &amp; SEO</span>
          </button>
        </div>
      </form>
    </div>
  );
}
