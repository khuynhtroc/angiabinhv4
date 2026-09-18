'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { Truck, ChevronRight, MapPin, Clock, AlertTriangle, Phone } from 'lucide-react';

export default function DeliveryPolicyPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <RealtimeAnalyticsTracker />
      <Navbar />

      <div className="bg-slate-900 text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">Chính sách vận chuyển</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            Điều Vận 24/7 Toàn Tỉnh Ninh Bình
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Chính Sách Vận Chuyển & Điều Vận Xe Bơm, Xe Bồn
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Quy định về thời gian di chuyển, cự ly cung ứng, điều kiện tiếp cận mặt bằng công trình và an toàn cơ giới.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full space-y-8">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          * <strong>Lưu ý:</strong> Mọi chi phí ca bơm và hỗ trợ cự ly vận chuyển trên website đều mang tính chất tham khảo tại thời điểm hiện tại. Đơn vị điều vận sẽ báo giá chính xác sau khi khảo sát thực tế đường vào công trình.
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              1. Địa Bàn & Bán Kính Phục Vụ Của 2 Cụm Trạm Trộn
            </h2>
            <p>
              Với 2 cụm trạm trộn tự động hóa tại KCN Khánh Phú và Xã Kim Sơn, An Gia Bình bảo đảm phủ kín toàn bộ địa bàn tỉnh Ninh Bình:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li><strong>Trạm KCN Khánh Phú (300m³/h):</strong> Phục vụ trung tâm TP. Ninh Bình, Huyện Hoa Lư, Huyện Yên Khánh, Huyện Gia Viễn và các cụm công nghiệp phía Bắc tỉnh.</li>
              <li><strong>Trạm Xã Kim Sơn (150m³/h):</strong> Phục vụ Huyện Kim Sơn, Huyện Yên Mô, TP. Tam Điệp và khu vực duyên hải lân cận.</li>
              <li><strong>Cự ly vận chuyển tiêu chuẩn:</strong> Khuyến nghị trong bán kính 30km để hỗn hợp bê tông giữ vững độ sụt và tính công tác tốt nhất.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              2. Thời Gian Vận Chuyển & Đổ Bê Tông
            </h2>
            <p>
              - Thời gian lưu giữ bê tông trong bồn quay từ lúc xuất xưởng đến khi kết thúc xả không vượt quá 120 phút (hoặc theo quy định thời gian bắt đầu đông kết của phụ gia).<br />
              - Phục vụ cấp hàng liên tục 24/7 bao gồm cả ca đêm và các ngày nghỉ lễ theo kế hoạch đăng ký trước của khách hàng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              3. Điều Kiện Tiếp Cận & An Toàn Hiện Trường
            </h2>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li>Khách hàng có trách nhiệm chuẩn bị đường vào đủ rộng (tối thiểu 3.5m đối với xe bồn và xe bơm) và nền đường chịu được tải trọng từ 25 - 40 tấn.</li>
              <li>Khoảng cách an toàn hành lang lưới điện: Xe bơm cần tuyệt đối không vươn cần dưới đường dây điện cao thế hoặc trung thế không có biện pháp bọc cách điện bảo vệ.</li>
              <li>Nếu đường vào quá hẹp hoặc không thuận lợi, kỹ thuật viên An Gia Bình sẽ tư vấn chuyển đổi sang phương án bơm tĩnh đường dài (ống dài đến 200m).</li>
            </ul>
          </section>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Cần khảo sát đường vào và đặt lịch xe bơm?
            </div>
            <a
              href="tel:0988266293"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Đội Điều Vận Xe: 0988 2662 93</span>
            </a>
          </div>
        </div>

        <TodaySearchKeywords
          category="Chính sách vận chuyển"
          extraKeywords={[
            'xe bơm bê tông tươi ninh bình',
            'thuê ca bơm bê tông 37m 52m',
            'bán kính trạm trộn bê tông khánh phú',
            'vận chuyển xe bồn bê tông ninh bình'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}
