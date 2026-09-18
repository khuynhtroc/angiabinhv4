'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { Scale, ChevronRight, ShieldCheck, CheckCircle2, Phone, FileCheck } from 'lucide-react';

export default function TermsOfServicePage() {
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
            <span className="text-slate-300">Điều khoản dịch vụ</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            Quyền Lợi & Trách Nhiệm Hợp Pháp
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Điều Khoản Sử Dụng Dịch Vụ Cung Cấp Bê Tông Thương Phẩm
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Hợp đồng nguyên tắc, quyền và nghĩa vụ giữa An Gia Bình và Quý khách hàng khi đặt mua bê tông tươi tại Ninh Bình.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full space-y-8">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          * <strong>Thông báo miễn trừ:</strong> Mọi thông tin, bảng giá và điều khoản công bố trên website mang tính chất tham khảo tại thời điểm hiện tại. Quyền và nghĩa vụ pháp lý chính thức được ràng buộc theo Hợp đồng kinh tế được ký kết và đóng dấu của người đại diện pháp luật hai bên.
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              1. Trách Nhiệm Của Bên Cung Cấp (An Gia Bình)
            </h2>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li>Cung cấp bê tông thương phẩm đúng chủng loại mác (từ M150 đến M450), đúng loại đá (1x2 sàng tuyển) và độ sụt ghi trên phiếu giao nhận.</li>
              <li>Hỗ trợ kỹ thuật viên kiểm tra độ sụt côn và đúc mẫu thử nén lưu kho R7, R28 theo yêu cầu của tư vấn giám sát.</li>
              <li>Điều động xe bồn và thiết bị xe bơm đến công trình theo khung thời gian đã đăng ký trước.</li>
              <li>Cung cấp đầy đủ hồ sơ kiểm định vật liệu đầu vào và kết quả nén mẫu thí nghiệm LAS-XD hợp chuẩn.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              2. Trách Nhiệm Của Bên Tiếp Nhận (Khách Hàng)
            </h2>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li>Chuẩn bị đường giao thông và mặt bằng đậu xe bồn, xe bơm an toàn, không có chướng ngại vật dễ gây nguy hiểm.</li>
              <li>Bố trí nhân sự thi công đầm dùi, san gạt và cán phẳng kịp thời để tránh thời gian lưu xe bồn quá lâu tại công trình.</li>
              <li><strong>Tuyệt đối không tự ý đổ thêm nước vào bồn trộn</strong> làm thay đổi tỷ lệ nước/xi măng (N/X), gây suy giảm mác bê tông sau khi đóng rắn. An Gia Bình không chịu trách nhiệm đối với các trường hợp khách hàng tự ý thêm nước trái quy định.</li>
              <li>Ký nhận đầy đủ phiếu giao hàng điện tử và biên bản xác nhận khối lượng của từng chuyến xe.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Scale className="w-5 h-5 text-amber-600" />
              3. Xử Lý Khiếu Nại & Trọng Tài
            </h2>
            <p>
              Mọi sự cố hoặc nghi ngờ về cường độ bê tông sẽ được giải quyết căn cứ vào kết quả nén mẫu lưu R28 tại phòng thí nghiệm độc lập được hai bên thống nhất lựa chọn theo đúng quy định của pháp luật xây dựng Việt Nam.
            </p>
          </section>
        </div>

        <TodaySearchKeywords
          category="Điều khoản dịch vụ"
          extraKeywords={[
            'hợp đồng bê tông thương phẩm ninh bình',
            'tiêu chuẩn nghiệm thu bê tông tươi tcvn',
            'mác bê tông m250 m300 ninh bình',
            'bê tông tươi an gia bình'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}
