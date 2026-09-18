'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import {
  Layers, HardHat, Truck, ShieldCheck, CheckCircle2, ChevronRight, Phone,
  Award, TrendingUp, Sparkles, Clock, Flame, Zap, ArrowRight, Building2
} from 'lucide-react';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  image: string;
  summary: string;
  link: string;
  features: string[];
  subServices?: { title: string; link: string }[];
}

const PRIMARY_SERVICES: ServiceItem[] = [
  {
    id: 'be-tong-tuoi',
    title: 'BÊ TÔNG TƯƠI',
    subtitle: 'Your Property in Good Hands',
    category: 'Vật Liệu Cốt Lõi',
    badge: 'Phổ Biến Nhất',
    image: '/images/dich-vu/be-tong-an-gia-binh-3.jpg',
    summary: 'Bê tông tươi luôn là lựa chọn hàng đầu của các chủ đầu tư và nhà thầu xây dựng ngày nay nhờ độ đồng nhất tuyệt đối, tốc độ cấp bồn nhanh và chất lượng được kiểm định nghiêm ngặt theo tiêu chuẩn TCVN.',
    link: '/be-tong-tuoi',
    features: [
      'Trộn tự động vi tính hóa từ 2 trạm (450m³/h)',
      'Độ sụt ổn định, kiểm tra độ sụt tận chân công trình',
      'Đầy đủ các cấp mác từ M150, M200, M250 đến M500, M600'
    ],
    subServices: [
      { title: 'Bê tông thường (M150 - M350)', link: '/be-tong-tuoi/be-tong-thuong' },
      { title: 'Bê tông chống thấm (B6 - B12)', link: '/be-tong-tuoi/be-tong-chong-tham' },
      { title: 'Bê tông chất lượng cao (R7 & Mác cao)', link: '/be-tong-tuoi/be-tong-chat-luong-cao' },
      { title: 'Bê tông ninh kết chậm (Đổ khối lớn)', link: '/be-tong-tuoi/be-tong-ninh-ket-cham' }
    ]
  },
  {
    id: 'be-tong-thuong-pham',
    title: 'BÊ TÔNG THƯƠNG PHẨM',
    subtitle: 'Construction Process Organized',
    category: 'Công Nghệ Sản Xuất',
    badge: 'Tiêu Chuẩn TCVN',
    image: '/images/dich-vu/be-tong-an-gia-binh-2.jpg',
    summary: 'Chuyên cung cấp bê tông thương phẩm chất lượng cao cho các dự án công nghiệp, nhà xưởng, khu dân cư với báo giá cạnh tranh nhất thị trường. Hệ thống phòng thí nghiệm LAS-XD đúc và nén mẫu minh bạch.',
    link: '/be-tong-thuong-pham',
    features: [
      'Công suất 450m³/h tại KCN Khánh Phú và Kim Sơn',
      'Hơn 35 xe bồn chuyên dụng bồn quay 10-12m³ cơ động',
      'Niêm phong kẹp chì từng xe trước khi rời trạm cân'
    ]
  },
  {
    id: 'bom-be-tong',
    title: 'BƠM BÊ TÔNG',
    subtitle: 'We Have Got You Covered',
    category: 'Thiết Bị Cơ Giới',
    badge: 'Đội Xe Hùng Hậu',
    image: '/images/dich-vu/be-tong-an-gia-binh-1.jpg',
    summary: 'Dịch vụ bơm bê tông chuyên nghiệp với đầy đủ thiết bị hiện đại: Bơm cần tầm với cao từ 37m đến 56m, bơm tĩnh áp lực cao vươn xa 300m luồn lách vào mọi ngõ ngách chật hẹp tại Ninh Bình.',
    link: '/bom-be-tong',
    features: [
      'Bơm cần 37m, 42m, 48m, 52m, 56m thế hệ mới',
      'Bơm tĩnh áp lực cực đại đẩy cao 120m, đẩy xa 300m',
      'Đội ngũ thợ bơm lành nghề, khảo sát đường điện an toàn'
    ]
  },
  {
    id: 'be-tong-sieu-nhe',
    title: 'BÊ TÔNG SIÊU NHẸ',
    subtitle: 'Your Property in Good Hands',
    category: 'Vật Liệu Tiên Tiến',
    badge: 'Cách Nhiệt & Giảm Tải',
    image: '/images/dich-vu/be-tong-an-gia-binh-5.jpg',
    summary: 'Sử dụng bê tông nhẹ không chỉ tiết kiệm chi phí kết cấu nền móng hơn, bền hơn mà còn có chức năng cách âm, chống nóng cách nhiệt xuất sắc cho sàn mái, tôn nền và vách ngăn nhẹ chống cháy.',
    link: '/be-tong-sieu-nhe',
    features: [
      'Khối lượng thể tích chỉ 600 - 1200 kg/m³ (giảm 55% tải trọng)',
      'Hệ số cách nhiệt gấp 6 lần bê tông thông thường',
      'Chống ẩm mốc, kháng cháy đạt chuẩn quốc gia'
    ]
  },
  {
    id: 'be-tong-nhua',
    title: 'BÊ TÔNG NHỰA NÓNG (ASPHALT)',
    subtitle: 'Construction Process Organized',
    category: 'Hạ Tầng Giao Thông',
    badge: 'Hạt Mịn & Hạt Trung',
    image: '/images/dich-vu/be-tong-an-gia-binh-6.jpg',
    summary: 'Chuyên sản xuất và thi công rải thảm bê tông nhựa nóng Asphalt (C9.5, C12.5, C19) cho các tuyến giao thông, đường nội bộ khu công nghiệp, bãi đỗ xe và sân bãi logistic khắp miền Bắc.',
    link: '/be-tong-nhua',
    features: [
      'Nhiệt độ thảm tiêu chuẩn 140°C - 165°C đảm bảo độ liên kết',
      'Bề mặt êm thuận, thoát nước tốt, độ bám dính lốp xe cao',
      'Đội ngũ máy lu rung, máy rải Dynapac, Vogele hiện đại'
    ]
  },
  {
    id: 'be-tong-khi-chung-ap',
    title: 'BÊ TÔNG KHÍ CHƯNG ÁP (AAC / ALC)',
    subtitle: 'We Have Got You Covered',
    category: 'Vật Liệu Xanh Không Nung',
    badge: 'Công Nghệ Hấp Áp Suất',
    image: '/images/dich-vu/be-tong-an-gia-binh-4.jpg',
    summary: 'Bê tông khí chưng áp AAC và tấm panel ALC với nhiều ưu điểm thi công tiện lợi, chất liệu liên kết tốt, bề mặt phẳng dễ dàng khoan cắt, rút ngắn 60% thời gian thi công hoàn thiện tường vách.',
    link: '/be-tong-khi-chung-ap',
    features: [
      'Chống cháy lan 4 - 8 giờ liên tục ở nhiệt độ 1200°C',
      'Tấm panel ALC có lõi thép bảo vệ chống ăn mòn 2 lớp',
      'Tiết kiệm vữa xây trát, phẳng mịn tuyệt đối'
    ]
  }
];

const CORE_ADVANTAGES = [
  {
    title: 'Chất lượng hàng đầu',
    desc: 'Chất Lượng Luôn Là Tiêu Chí Hàng Đầu Mà Tất Cả Các Bên Hướng Đến. Tại An Gia Bình, Chúng Tôi Hiểu Rằng Chìa Khóa Tạo Nên Và Duy Trì Thành Công Chính Là Chất Lượng Của Sản Phẩm.',
    icon: ShieldCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    title: 'Giá cả cạnh tranh',
    desc: 'Giá Cả Là Một Trong Những Yếu Tố Quyết Định Thành Bại Của Một Sự Hợp Tác. Chúng Tôi Luôn Cung Cấp Mức Giá Hợp Lý, Minh Bạch Tương Xứng Với Chất Lượng Bê Tông Và Dịch Vụ Cung Ứng.',
    icon: TrendingUp,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    title: 'Hậu mãi hoàn hảo',
    desc: 'Với Đội Ngũ Kỹ Thuật Viên Dày Dặn Kinh Nghiệm Và Nhân Viên Chăm Sóc Khách Hàng Tận Tình, Chu Đáo, An Gia Bình Luôn Nỗ Lực Để Mỗi Khách Hàng Đều Trở Thành Đối Tác Gắn Kết Bền Vững.',
    icon: Award,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    title: 'Tiến độ nhanh chóng',
    desc: 'Trong Tất Cả Mọi Công Việc, Tiến Độ Luôn Là Điều Kiện Cần Để Đánh Giá Hiệu Quả. Đội Ngũ Điều Vận Luôn Nỗ Lực Tối Đa Nhằm Đảm Bảo Tiến Độ Giao Hàng Cũng Như Thi Công Cho Các Dự Án.',
    icon: Clock,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    title: 'Thiết kế & cấp phối tối ưu',
    desc: 'Một Thiết Kế Rắc Rối, Phức Tạp Sẽ Ảnh Hưởng Đến Chi Phí Của Khách Hàng. Tại An Gia Bình, Đội Ngũ Kỹ Sư Đã Miệt Mài Nghiên Cứu Để Thống Nhất Phương Án Cấp Phối Tối Ưu Nhất Về Kỹ Thuật Và Kinh Tế.',
    icon: Sparkles,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    title: 'Nguyên vật liệu chất lượng cao',
    desc: 'Với Hệ Thống Nhà Cung Cấp Chọn Lọc Kỹ Càng, An Gia Bình Sử Dụng Những Nguồn Nguyên Vật Liệu Chất Lượng Cao Có Nguồn Gốc Xuất Xứ Rõ Ràng, Đảm Bảo Sự Ổn Định Và Tuổi Thọ Công Trình Cao.',
    icon: Zap,
    color: 'text-rose-600 bg-rose-50 border-rose-200'
  }
];

export default function ServicesPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <RealtimeAnalyticsTracker />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-amber-600 transition">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600 font-bold">Lĩnh vực hoạt động</span>
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden text-center sm:text-left">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Hệ Sinh Thái Toàn Diện</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Lĩnh Vực Hoạt Động Của An Gia Bình
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Cung cấp giải pháp vật liệu xây dựng toàn diện: Từ bê tông thương phẩm, bê tông tươi các cấp mác, dịch vụ xe bơm cơ giới hiện đại, đến các dòng vật liệu thế hệ mới như bê tông siêu nhẹ, bê tông nhựa nóng và bê tông khí chưng áp AAC/ALC.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="tel:0988266293"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Nhận Báo Giá: 0988 2662 93</span>
              </a>
              <Link
                href="/about"
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition"
              >
                <span>Tìm Hiểu Năng Lực Công Ty</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Core Services Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-600">Danh Mục Dịch Vụ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Các Lĩnh Vực Cung Cấp Chính</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">06 Lĩnh Vực Hoạt Động Cốt Lõi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRIMARY_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Service Image with fallback */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={resolveMediaUrl(srv.image, srv.title)}
                      alt={srv.title}
                      onError={(e) => handleImageFallback(e, srv.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                      {srv.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                        {srv.subtitle}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition">
                        <Link href={srv.link}>{srv.title}</Link>
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {srv.summary}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {srv.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Sub-services if any */}
                    {srv.subServices && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">Các chủng loại chuyên biệt:</span>
                        <div className="grid grid-cols-1 gap-1">
                          {srv.subServices.map((sub, sidx) => (
                            <Link
                              key={sidx}
                              href={sub.link}
                              className="text-xs text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 font-medium"
                            >
                              <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>{sub.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={srv.link}
                    className="w-full bg-slate-50 hover:bg-amber-500 text-slate-900 hover:text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 hover:border-amber-500 transition flex items-center justify-center gap-2"
                  >
                    <span>Xem Chi Tiết & Báo Giá</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Core Strengths (From original dich-vu.html) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Lý Do Chọn Chúng Tôi</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              6 Tiêu Chí Cốt Lõi Về Dịch Vụ Của An Gia Bình
            </h2>
            <p className="text-sm text-slate-600">
              Mỗi mét khối bê tông và mỗi dịch vụ cơ giới của An Gia Bình đều được kiểm chứng qua sự hài lòng của hàng nghìn công trình tại Ninh Bình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {CORE_ADVANTAGES.map((adv, idx) => {
              const IconComp = adv.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-start"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${adv.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Specification Table */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">Thông Số Kỹ Thuật Tham Khảo</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Bảng Phân Loại Mác Bê Tông Tiêu Chuẩn</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Bê tông tươi An Gia Bình được đúc mẫu tổ 3 viên theo TCVN 3118:1993, kiểm định độ sụt tại chỗ trước khi xả bồn.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 sm:p-4">Chủng Loại / Mác</th>
                  <th className="p-3 sm:p-4">Cường Độ (MPa)</th>
                  <th className="p-3 sm:p-4">Độ Sụt Chuẩn</th>
                  <th className="p-3 sm:p-4">Ứng Dụng Khuyến Nghị</th>
                  <th className="p-3 sm:p-4">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Mác 150 (M150)</td>
                  <td className="p-3 sm:p-4">15 MPa</td>
                  <td className="p-3 sm:p-4">12±2 cm</td>
                  <td className="p-3 sm:p-4">Lót móng, tôn nền nhà xưởng, vỉa hè</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-thuong" className="text-amber-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Mác 200 (M200)</td>
                  <td className="p-3 sm:p-4">20 MPa</td>
                  <td className="p-3 sm:p-4">12±2 / 14±2 cm</td>
                  <td className="p-3 sm:p-4">Móng đơn, móng băng nhà phố 1-3 tầng</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-thuong" className="text-amber-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-amber-700">Mác 250 (M250 - Chuẩn Dân Dụng)</td>
                  <td className="p-3 sm:p-4">25 MPa</td>
                  <td className="p-3 sm:p-4">14±2 cm</td>
                  <td className="p-3 sm:p-4">Cột, dầm, sàn tầng, mái nhà dân dụng & biệt thự</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-thuong" className="text-amber-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Mác 300 (M300)</td>
                  <td className="p-3 sm:p-4">30 MPa</td>
                  <td className="p-3 sm:p-4">14±2 cm</td>
                  <td className="p-3 sm:p-4">Sàn nhà xưởng chịu lực, móng bè, dầm khẩu độ lớn</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-thuong" className="text-amber-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-blue-700">Chống Thấm (B6, B8, B10, B12)</td>
                  <td className="p-3 sm:p-4">≥ 25 MPa</td>
                  <td className="p-3 sm:p-4">14±2 cm</td>
                  <td className="p-3 sm:p-4">Bể ngầm, tầng hầm, mái lộ thiên, hố pit thang máy</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-chong-tham" className="text-blue-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 sm:p-4 font-bold text-purple-700">Mác Cao & R7 (M400 - M500)</td>
                  <td className="p-3 sm:p-4">40 - 50 MPa</td>
                  <td className="p-3 sm:p-4">16±2 cm</td>
                  <td className="p-3 sm:p-4">Công trình vượt nhịp lớn, tháo cốp pha sau 7 ngày</td>
                  <td className="p-3 sm:p-4">
                    <Link href="/be-tong-tuoi/be-tong-chat-luong-cao" className="text-purple-600 hover:underline font-bold">Chi tiết</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Contact */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Tư Vấn Tận Tâm 24/7</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Cần Khảo Sát & Báo Giá Bê Tông Ngay Hôm Nay?
            </h3>
            <p className="text-sm text-slate-300">
              Đội ngũ kỹ sư An Gia Bình sẽ đến tận công trình đo đạc mặt bằng, kiểm tra đường vào xe bồn, tư vấn mác và hệ thống xe bơm phù hợp nhất hoàn toàn miễn phí.
            </p>
          </div>
          <a
            href="tel:0988266293"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-2xl font-black text-base shadow-lg transition shrink-0"
          >
            <Phone className="w-5 h-5 animate-bounce" />
            <span>Gọi Hotline: 0988 2662 93</span>
          </a>
        </section>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
