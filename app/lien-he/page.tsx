'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import { MapPin, Phone, Mail, Clock, Facebook, Send, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import PageSeoHead from '@/components/PageSeoHead';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const { addLead } = useAppStore();
  const [chatOpen, setChatOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !name) return;

    addLead({
      name,
      phone,
      address: address || 'Ninh Bình',
      notes: notes || 'Yêu cầu liên hệ khảo sát từ trang Liên Hệ'
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setAddress('');
      setNotes('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug="/lien-he"
        defaultTitle="Hệ Thống Trạm Trộn & Liên Hệ | Bê Tông An Gia Bình"
        defaultDescription="Hệ thống 2 trạm trộn bê tông tươi tự động tại Ninh Bình: KCN Khánh Phú và Kim Sơn. Liên hệ báo giá và điều phối xe bồn 24/7."
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Header Banner - Light Theme */}
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-200">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              Mạng Lưới Phục Vụ Toàn Tỉnh Ninh Bình
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Hệ Thống Trạm Trộn & Liên Hệ
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Hai cụm trạm trộn tự động tại KCN Khánh Phú (Đông Hoa Lư) và Xã Kim Sơn giúp rút ngắn cự ly giao hàng dưới 45 phút, giữ trọn vẹn chất lượng và độ sụt của bê tông tươi.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: 2 Batching Plants info & Contact channels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Plant 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-2.5 py-1 rounded-md uppercase">
                  Trạm 1 - Công Suất 300m³/h
                </span>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Đang hoạt động
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Trạm Trộn Bê Tông KCN Khánh Phú
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Địa chỉ:</strong> KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình.
                <br />
                <strong>Địa bàn phục vụ chính:</strong> TP. Ninh Bình, Huyện Hoa Lư, Gia Viễn, Yên Khánh, KCN Phúc Sơn, KCN Khánh Phú và các công trình trọng điểm.
              </p>
            </div>

            {/* Plant 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-2.5 py-1 rounded-md uppercase">
                  Trạm 2 - Công Suất 150m³/h
                </span>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Đang hoạt động
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Trạm Trộn Bê Tông Xã Kim Sơn
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Địa chỉ:</strong> Xã Kim Sơn, Tỉnh Ninh Bình.
                <br />
                <strong>Địa bàn phục vụ chính:</strong> Huyện Kim Sơn, Huyện Yên Mô, Huyện Yên Khánh, TP. Tam Điệp và khu vực ven biển, đê kè kè chắn sóng.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl border border-amber-200 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Tổng Đài 24/7</span>
                </div>
                <a href="tel:0988266293" className="text-xl font-extrabold text-slate-900 block hover:text-amber-700">
                  0988 2662 93
                </a>
                <p className="text-slate-600 text-[11px]">Trực hotline tiếp nhận lịch đổ ngày đêm</p>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-amber-200/60">
                  Email: <a href="mailto:ketoan.angiabinh@gmail.com" className="font-semibold text-slate-800 hover:underline">ketoan.angiabinh@gmail.com</a>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Facebook className="w-4 h-4" />
                  <span>Fanpage Chính Thức</span>
                </div>
                <a
                  href="https://www.facebook.com/betongangiabinh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline block truncate"
                >
                  facebook.com/betongangiabinh
                </a>
                <p className="text-slate-500 text-[11px]">Cập nhật hình ảnh thi công thực tế mỗi ngày</p>
              </div>
            </div>
          </div>

          {/* Right: Contact / Booking form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Gửi Yêu Cầu Tư Vấn & Khảo Sát
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Kỹ sư Bê Tông An Gia Bình sẽ liên hệ lại trong vòng 10 phút để xác nhận thông tin.
            </p>

            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-base">Đã Gửi Thành Công!</h4>
                <p className="text-xs text-slate-600">
                  Cảm ơn quý khách. Chúng tôi sẽ gọi lại theo số điện thoại đã cung cấp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Họ và Tên của bạn / Tên Công Ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Anh Hoàng (Chủ đầu tư)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0988 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa Chỉ Công Trình Tại Ninh Bình
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phường Ninh Khánh, TP. Ninh Bình"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nội Dung Cần Hỗ Trợ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Đổ móng 30m³ mác 250, đường rộng 6m xe bồn vào tốt..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Ngay</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} onOpenCalculator={() => { window.location.href = '/#concrete-calculator-section'; }} />
    </div>
  );
}
