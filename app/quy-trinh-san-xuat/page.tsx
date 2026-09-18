'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import {
  ShieldCheck, CheckCircle2, ChevronRight, Phone, Award,
  Cpu, Truck, Scale, FlaskConical, Droplets, Flame, Clock,
  ArrowRight, FileText, Check
} from 'lucide-react';
import { resolveMediaUrl, handleImageFallback, AGB_PLANT_IMAGE } from '@/lib/utils';

export default function ManufacturingProcessPage() {
  const [chatOpen, setChatOpen] = useState(false);

  const steps = [
    {
      step: '01',
      title: 'Kiểm Soát & Tuyển Chọn Vật Liệu Đầu Vào',
      badge: 'Tiêu Chuẩn TCVN 7570:2006',
      icon: FlaskConical,
      color: 'from-blue-500 to-cyan-500',
      desc: 'Mọi cốt liệu nhập về kho bãi đều trải qua kiểm tra cảm quan và thí nghiệm sàng lọc cơ lý tính nghiêm ngặt trước khi nhập silo và phễu cấp liệu.',
      details: [
        'Cát vàng hạt trung - thô tuyển chọn, mô đun độ lớn từ 2.3 - 2.8, hàm lượng bùn sét < 1.5%.',
        'Đá dăm 1x2 sạch, đá vôi xanh cường độ chịu nén đá gốc > 800 kg/cm², sàng rửa bụi bẩn.',
        'Xi măng PCB40, PC40 Vicem Bút Sơn / Vicem Tam Điệp chính hãng, có chứng chỉ xuất xưởng.',
        'Hệ phụ gia hóa học thế hệ mới (Sika, BASF, Silkroad) đạt chuẩn ASTM C494 giúp tăng độ dẻo, giảm tỷ lệ N/X.',
        'Nguồn nước ngầm qua hệ thống lắng lọc kiểm tra pH, không nhiễm mặn, không tạp chất hữu cơ (TCVN 4506:2012).'
      ]
    },
    {
      step: '02',
      title: 'Thiết Kế Cấp Phối Mix Design Số Hóa',
      badge: 'Công Nghệ PLC Tự Động',
      icon: Cpu,
      color: 'from-amber-500 to-orange-500',
      desc: 'Công thức cấp phối cho từng mác bê tông (M150, M200, M250, M300, M350, M400, M450) được kỹ sư phòng thí nghiệm tính toán tối ưu và nạp vào máy tính điều khiển trung tâm.',
      details: [
        'Phần mềm trạm trộn tự động điều chỉnh tỷ lệ bù trừ độ ẩm của cát đá tại thời điểm thực tế.',
        'Tối ưu hóa độ sụt theo từng cấu kiện đổ (đổ móng, đổ sàn, đổ cột, đổ vách hầm).',
        'Lưu trữ dữ liệu từng mẻ trộn lên đám mây, cho phép truy xuất lịch sử cấp phối trong suốt 20 năm.'
      ]
    },
    {
      step: '03',
      title: 'Định Lượng Điện Tử & Trộn Cưỡng Bức 2 Trục Xoắn',
      badge: 'Sai Số < 1%',
      icon: Scale,
      color: 'from-emerald-500 to-teal-500',
      desc: 'Hệ thống cân Loadcell điện tử độ chính xác cao nạp liệu tuần tự vào cối trộn cưỡng bức SICOMA (Ý) công suất lớn.',
      details: [
        'Trạm 1 KCN Khánh Phú công suất 300m³/h (2 cối trộn 3m³/mẻ) đáp ứng công trình công nghiệp lớn.',
        'Trạm 2 Kim Sơn công suất 150m³/h phục vụ mạng lưới huyện Kim Sơn, Yên Mô, Tam Điệp.',
        'Thời gian trộn tiêu chuẩn từ 45 - 60 giây đảm bảo hỗn hợp đồng nhất, bọc kín cốt liệu bằng màng hồ xi măng.'
      ]
    },
    {
      step: '04',
      title: 'Thử Sụt Trạm & Kẹp Chì Niêm Phong Xe Bồn',
      badge: 'Niêm Phong Phễu Xả',
      icon: Truck,
      color: 'from-indigo-500 to-violet-500',
      desc: 'Trước khi xe bồn rời trạm, kỹ thuật viên trạm tiến hành thử độ sụt mẻ đầu và đóng kẹp chì niêm phong tại phễu xả.',
      details: [
        'Xuất phiếu giao nhận điện tử ghi rõ: Biển số xe, giờ xuất trạm, mác bê tông, độ sụt, khối lượng m³.',
        'Kẹp chì cáp xoắn niêm phong phễu xả bảo đảm lái xe tuyệt đối không thể tự ý pha thêm nước dọc đường.',
        'Đội xe 35+ xe bồn gắn định vị GPS giám sát hành trình di chuyển và tốc độ quay của bồn trộn.'
      ]
    },
    {
      step: '05',
      title: 'Thử Côn Độ Sụt & Đúc Mẫu Kiểm Định Tại Công Trường',
      badge: 'Tiêu Chuẩn TCVN 3105 & 3118',
      icon: ShieldCheck,
      color: 'from-rose-500 to-pink-500',
      desc: 'Tại chân công trình, kỹ thuật viên của An Gia Bình phối hợp cùng tư vấn giám sát và chủ đầu tư kiểm tra trước khi bơm.',
      details: [
        'Cắt kẹp chì niêm phong trước sự chứng kiến trực tiếp của đại diện công trình.',
        'Thử côn độ sụt theo TCVN 3106:1993, đo chiều cao hạ thấp của khối bê tông hình nón cụt.',
        'Đúc tổ mẫu lập phương 150x150x150 mm (gồm 3 viên mẫu lưu R7, R28) có ký tên niêm phong trên mặt mẫu.',
        'Chỉ xả bê tông vào máng bơm khi kết quả kiểm tra độ sụt nằm trong dung sai cho phép (±2 cm).'
      ]
    },
    {
      step: '06',
      title: 'Bơm Bê Tông Cơ Giới & Hướng Dẫn Bảo Dưỡng Thủy Hóa',
      badge: 'Xe Bơm Cần 37m - 56m',
      icon: Droplets,
      color: 'from-amber-600 to-yellow-500',
      desc: 'Đưa hỗn hợp bê tông vào đúng vị trí cấu kiện bằng dàn xe bơm hiện đại và bàn giao quy trình dưỡng hộ ẩm chống nứt.',
      details: [
        'Vận hành xe bơm cần vươn xa từ 37m đến 56m và bơm tĩnh áp lực cao luồn sâu vào ngõ hẹp.',
        'Khuyến nghị đầm dùi kỹ thuật theo khoảng cách 1.5 bán kính tác dụng, không đầm quá lâu gây phân tầng.',
        'Hướng dẫn phủ bao tải ẩm / nilon hoặc tưới nước dưỡng ẩm liên tục trong 7 ngày đầu để thủy hóa xi măng hoàn toàn.'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">Quy trình sản xuất</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              Tiêu Chuẩn Quản Lý Kỹ Thuật TCVN & ISO
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Quy Trình Kiểm Định & Sản Xuất Bê Tông Thương Phẩm
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Chi tiết 6 bước từ khâu sàng lọc cát đá, xi măng, lập trình Mix Design tự động, định lượng điện tử tại trạm trộn đến đúc mẫu kiểm định R7, R28 và thi công bơm cần tại hiện trường.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full space-y-12">
        {/* Notice banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 leading-relaxed">
          <strong>Lưu ý:</strong> Toàn bộ quy trình và thông số định mức kỹ thuật trên website mang tính chất tham khảo tiêu chuẩn tại thời điểm hiện tại. Mọi mẻ trộn thực tế đều được điều chỉnh theo thiết kế kỹ thuật của dự án và điều kiện thời tiết thực tế.
        </div>

        {/* Steps Grid / Timeline */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Chu Trình Khép Kín</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              6 Bước Kiểm Soát Kỹ Thuật Tại Bê Tông An Gia Bình
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Đảm bảo sự đồng đều tuyệt đối của mác bê tông và tiến độ cấp hàng liên tục cho mọi công trình tại Ninh Bình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-300 group-hover:text-amber-600 transition font-mono">
                        {item.step}
                      </span>
                      <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {item.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plant & Quality Control Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Hạ Tầng Kỹ Thuật</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Hệ Thống Trạm Trộn Đôi Công Suất 450m³/h Tại Ninh Bình
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Trạm 1 đặt tại KCN Khánh Phú quy mô 2 cối trộn 300m³/h và Trạm 2 tại Xã Kim Sơn 150m³/h, kết nối trực tiếp với các trục đường giao thông huyết mạch của tỉnh Ninh Bình (Quốc lộ 1A, Quốc lộ 10, cao tốc Bắc Nam).
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-600">35+</div>
                <div className="text-xs text-slate-600 font-medium mt-1">Xe Bồn 10-12m³</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-600">56m</div>
                <div className="text-xs text-slate-600 font-medium mt-1">Xe Bơm Cần Vươn Xa</div>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="tel:0988266293"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Liên Hệ Đặt Bê Tông: 0988 2662 93</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 relative aspect-video bg-slate-100">
            <img
              src={resolveMediaUrl(AGB_PLANT_IMAGE)}
              alt="Trạm trộn Bê tông An Gia Bình Ninh Bình"
              onError={(e) => handleImageFallback(e, 'Trạm trộn Bê tông An Gia Bình')}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Dynamic Today Search Keywords Section */}
        <TodaySearchKeywords
          category="Quy trình sản xuất"
          extraKeywords={[
            'quy trình sản xuất bê tông tươi ninh bình',
            'tiêu chuẩn đúc mẫu r7 r28',
            'kiểm tra độ sụt bê tông tcvn 3106',
            'trạm trộn an gia bình khánh phú kim sơn',
            'cấp phối mix design bê tông mác 250 mác 300',
            'báo giá xe bơm cần 56m ninh bình'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}
