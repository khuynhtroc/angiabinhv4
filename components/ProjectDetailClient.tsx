'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import { useAppStore } from '@/lib/store';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import { Project } from '@/lib/types';
import {
  Building2, MapPin, Calendar, ChevronRight, Phone, ArrowLeft,
  CheckCircle2, ShieldCheck
} from 'lucide-react';

interface ProjectDetailClientProps {
  rawSlug: string;
  initialProject?: Project | null;
}

export default function ProjectDetailClient({
  rawSlug,
  initialProject
}: ProjectDetailClientProps) {
  const cleanSlug = decodeURIComponent(rawSlug || '').replace(/\.html$/, '');
  const { projects } = useAppStore();
  const [chatOpen, setChatOpen] = useState(false);

  const storeProject = projects.find(
    (p) => p.slug === cleanSlug || p.id === cleanSlug || p.slug === rawSlug || p.id === rawSlug
  );
  const project = storeProject || initialProject || null;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto py-24 px-4 text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900">Không tìm thấy dự án</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6">Dự án này có thể đã được cập nhật hoặc thay đổi đường dẫn.</p>
          <Link href="/du-an" className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang danh sách Dự Án</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProjects = projects.filter((p) => p.id !== project.id).slice(0, 3);
  const finalTitle = `${project.title} | Dự Án Bê Tông An Gia Bình`;
  const finalDesc = project.description || `Dự án ${project.title} tại ${project.location}, sử dụng cấp phối bê tông ${project.concreteGrade || 'chất lượng cao'} do Bê Tông An Gia Bình cung ứng.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug={`/du-an/${cleanSlug}`}
        title={finalTitle}
        description={finalDesc}
        image={project.image}
        type="website"
        breadcrumbs={[
          { name: 'Trang Chủ', item: '/' },
          { name: 'Dự Án', item: '/du-an' },
          { name: project.title, item: `/du-an/${cleanSlug}` }
        ]}
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 text-xs py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-slate-900">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/du-an" className="hover:text-slate-900">Dự Án</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">{project.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full space-y-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
              {project.category || 'Công Trình Trọng Điểm'}
            </span>
            {project.volumeM3 && (
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                Khối lượng: {project.volumeM3.toLocaleString()} m³
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{project.location || 'Ninh Bình'}</span>
            </span>
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Năm thi công: {project.year}</span>
              </span>
            )}
            {project.concreteGrade && (
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mác bê tông: {project.concreteGrade}</span>
              </span>
            )}
          </div>

          {/* Featured Image */}
          {project.image && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[500px]">
              <img
                src={resolveMediaUrl(project.image)}
                alt={project.title}
                onError={(e) => handleImageFallback(e, project.title)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-4">
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {project.description}
            </p>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/80 my-6">
              <h3 className="font-bold text-amber-950 text-base mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                Thông tin cung ứng từ Trạm Trộn Bê Tông An Gia Bình
              </h3>
              <p className="text-sm text-amber-900 leading-relaxed">
                Dự án được cấp phối trực tiếp từ cụm trạm trộn tự động công suất lớn của An Gia Bình, đảm bảo độ sụt chuẩn xác, vận chuyển bằng đội xe bồn chuyên dụng và bơm cần hiện đại, rút ngắn 30% thời gian thi công cho nhà thầu.
              </p>
            </div>
          </div>

          {/* Hotline CTA Card */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Cần tư vấn cấp bê tông cho dự án tương tự?</h3>
              <p className="text-xs sm:text-sm text-slate-400">Đội ngũ kỹ sư kết cấu An Gia Bình hỗ trợ khảo sát mặt bằng và báo giá tận chân công trình.</p>
            </div>
            <a
              href="tel:0988266293"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-6 py-3 rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Hotline Kỹ Thuật: 0988 2662 93</span>
            </a>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Các Dự Án Tiêu Biểu Khác</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/du-an/${p.slug || p.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={resolveMediaUrl(p.image)}
                      alt={p.title}
                      onError={(e) => handleImageFallback(e, p.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                      {p.location}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
