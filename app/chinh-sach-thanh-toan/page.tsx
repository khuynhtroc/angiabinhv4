'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { CreditCard, ChevronRight, ShieldCheck, CheckCircle2, Phone, FileText } from 'lucide-react';

export default function PaymentPolicyPage() {
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
            <span className="text-slate-300">Chính sách thanh toán</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            Minh Bạch & Pháp Lý Rõ Ràng
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Chính Sách Thanh Toán & Đối Soát Khối Lượng
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Quy định các hình thức thanh toán, tạm ứng hợp đồng và quy trình nghiệm thu đối soát khối lượng bê tông tươi tại An Gia Bình.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full space-y-8">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          * <strong>Lưu ý quan trọng:</strong> Mọi bảng giá và tỷ lệ thanh toán trên website đều mang tính chất tham khảo tại thời điểm hiện tại. Điều khoản thanh toán cụ thể được quy định chi tiết trong Hợp đồng kinh tế được ký kết giữa hai bên.
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              1. Phương Thức Thanh Toán Áp Dụng
            </h2>
            <p>
              Khách hàng và đối tác của <strong>Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình</strong> có thể lựa chọn một trong các hình thức thanh toán sau:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li><strong>Chuyển khoản qua ngân hàng:</strong> Thanh toán vào tài khoản doanh nghiệp chính thức của Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình (chi tiết số tài khoản và ngân hàng được ghi rõ trên hợp đồng và hóa đơn điện tử).</li>
              <li><strong>Thanh toán tiền mặt:</strong> Thực hiện trực tiếp tại văn phòng trạm trộn hoặc thanh toán cho cán bộ kinh doanh/điều vận có phiếu thu và giấy giới thiệu đóng dấu của công ty.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              2. Quy Trình Tạm Ứng & Thanh Quyết Toán
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-xs uppercase text-amber-700 mb-1">Đối với công trình nhà ở dân dụng:</h3>
                <p className="text-xs text-slate-600">
                  - Đặt cọc tạm ứng từ 30% - 50% tổng giá trị dự kiến trước thời điểm ca xe bồn xuất trạm.<br />
                  - Thanh toán phần còn lại ngay sau khi kết thúc ca đổ và hai bên ký kết biên bản bàn giao, xác nhận khối lượng thực tế tại công trường.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-xs uppercase text-amber-700 mb-1">Đối với công trình dự án, nhà thầu công nghiệp:</h3>
                <p className="text-xs text-slate-600">
                  - Tiến hành theo tiến độ và các đợt thanh toán được thỏa thuận cụ thể trong hợp đồng mua bán bê tông thương phẩm.<br />
                  - Biên bản đối soát khối lượng và chứng từ phiếu cân điện tử được tập hợp theo chu kỳ tuần hoặc tháng kèm hóa đơn giá trị gia tăng (VAT).
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              3. Đối Soát Khối Lượng Dựa Trên Chứng Từ Điện Tử
            </h2>
            <p>
              Khối lượng bê tông tính toán thanh toán dựa trên tổng số mét khối (m³) ghi trên Phiếu Giao Nhận Cân Điện Tử có chữ ký xác nhận của đại diện hai bên tại hiện trường. Mỗi xe bồn xuất trạm đều có tem niêm phong và phiếu in khối lượng tự động từ trạm trộn.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Cần hỗ trợ về hợp đồng và thanh toán? Liên hệ phòng tài chính:
            </div>
            <a
              href="tel:0988266293"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline Kế Toán: 0988 2662 93</span>
            </a>
          </div>
        </div>

        <TodaySearchKeywords
          category="Chính sách thanh toán"
          extraKeywords={[
            'hợp đồng mua bán bê tông tươi ninh bình',
            'quy trình thanh toán bê tông thương phẩm',
            'phiếu cân điện tử trạm trộn bê tông',
            'báo giá bê tông an gia bình hôm nay'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}
