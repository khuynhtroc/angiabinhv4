'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { formatNumber, resolveMediaUrl, handleImageFallback } from '@/lib/utils';
import { MapPin, Building2, ChevronRight, Search } from 'lucide-react';

interface ProjectsShowcaseProps {
  showAll?: boolean;
  limit?: number;
}

export default function ProjectsShowcase({ showAll = false, limit }: ProjectsShowcaseProps) {
  const { projects } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tất Cả', 'Khu công nghiệp', 'Giao thông & Hạ tầng', 'Dân dụng & Biệt thự', 'Công trình Công cộng'];

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCategory === 'Tất Cả' || p.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.concreteGrade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const displayedProjects = showAll ? filtered : filtered.slice(0, limit || 6);

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200" id="projects-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-100/70 px-3 py-1 rounded-full">
              Hồ Sơ Năng Lực Thực Tế
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Các Dự Án Tiêu Biểu Đã Thi Công
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Minh chứng thực tế cho năng lực cung ứng của Bê Tông An Gia Bình đối với các chủ đầu tư cá nhân, doanh nghiệp FDI và dự án công tại Ninh Bình.
            </p>
          </div>

          {!showAll && (
            <Link
              href="/du-an"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 hover:border-amber-500 px-4 py-2.5 rounded-xl transition shadow-2xs"
            >
              <span>Xem Toàn Bộ {projects.length}+ Dự Án</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </Link>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box for projects */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm dự án, địa điểm, chủ đầu tư..."
              className="w-full bg-white border border-slate-200 text-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">Không tìm thấy dự án phù hợp</p>
            <p className="text-slate-400 text-xs mt-1">Thử đổi từ khóa hoặc chọn chuyên mục Tất Cả</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((proj) => {
              const projectSlug = proj.slug || proj.id;
              const projectUrl = `/du-an/${projectSlug}`;

              return (
                <Link
                  key={proj.id}
                  href={projectUrl}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Image with Tag */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={resolveMediaUrl(proj.image, proj.title)}
                      alt={proj.title}
                      width={400}
                      height={208}
                      onError={(e) => handleImageFallback(e, proj.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {proj.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {formatNumber(proj.volumeM3)} m³
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition line-clamp-2">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Mác Bê Tông:</span>
                        <span className="font-bold text-slate-900 truncate max-w-[170px]">{proj.concreteGrade}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Thiết bị bơm:</span>
                        <span className="font-semibold text-slate-800">{proj.pumpService}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chủ đầu tư:</span>
                        <span className="font-medium text-slate-600 truncate max-w-[170px]">{proj.client}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-1 transition">
                      <span>Xem Chi Tiết Công Trình</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* If limited and has more projects */}
        {!showAll && filtered.length > (limit || 6) && (
          <div className="text-center mt-10">
            <Link
              href="/du-an"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 px-6 py-3 rounded-xl font-bold text-xs shadow-md transition"
            >
              <span>Xem Thêm {filtered.length - (limit || 6)} Dự Án Khác</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
