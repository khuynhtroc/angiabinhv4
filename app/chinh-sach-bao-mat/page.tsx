'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import { Lock, ChevronRight, ShieldCheck, CheckCircle2, Phone, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <span className="text-slate-300">Chính sách bảo mật</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            Bảo Mật Dữ Liệu Khách Hàng
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Chính Sách Bảo Mật Thông Tin Khách Hàng & Dự Án
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Cam kết bảo vệ dữ liệu liên hệ cá nhân, hồ sơ bản vẽ kết cấu và thông tin đấu thầu công trình của đối tác.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Database className="w-5 h-5 text-amber-600" />
              1. Mục Đích Thu Thập Dữ Liệu
            </h2>
            <p>
              Khi khách hàng gửi yêu cầu tư vấn, tính khối lượng hoặc đăng ký khảo sát trên website của <strong>Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình</strong>, chúng tôi chỉ thu thập các thông tin thiết yếu phục vụ công việc:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
              <li>Họ tên người liên hệ, số điện thoại, địa chỉ công trình tại tỉnh Ninh Bình.</li>
              <li>Loại công trình (nhà dân, xưởng KCN, móng trụ), mác bê tông và khối lượng m³ dự kiến.</li>
              <li>Thông tin phục vụ xuất hóa đơn giá trị gia tăng (VAT) và hợp đồng kinh tế.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              2. Bảo Vệ Hồ Sơ Bản Vẽ & Đấu Thầu
            </h2>
            <p>
              Mọi tài liệu thiết kế bản vẽ kỹ thuật kết cấu, dự toán chi phí và thông tin thương mại do đối tác chia sẻ được bảo mật nội bộ trong hệ thống máy chủ an toàn. Công ty tuyệt đối không chuyển giao, bán hoặc chia sẻ thông tin cho bất kỳ bên thứ ba nào vì mục đích thương mại ngoài phạm vi phục vụ đơn hàng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="w-5 h-5 text-amber-600" />
              3. Quyền Lợi Của Khách Hàng
            </h2>
            <p>
              Khách hàng có toàn quyền yêu cầu kiểm tra, cập nhật hoặc xóa bỏ thông tin cá nhân của mình khỏi cơ sở dữ liệu khách hàng bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua số điện thoại hoặc email chính thức:
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong>Email:</strong> ketoan.angiabinh@gmail.com</div>
              <div><strong>Hotline bảo mật & pháp lý:</strong> 0988 2662 93</div>
              <div><strong>Địa chỉ trạm điều hành:</strong> KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình</div>
            </div>
          </section>
        </div>

        <TodaySearchKeywords
          category="Chính sách bảo mật"
          extraKeywords={[
            'bảo mật thông tin khách hàng an gia bình',
            'liên hệ bê tông tươi ninh bình',
            'trạm trộn an gia bình kcn khánh phú'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}
