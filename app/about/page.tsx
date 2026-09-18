'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import {
  Eye, Target, Award, Handshake, ChevronRight, Phone, ShieldCheck,
  CheckCircle2, Factory, Truck, Users, HeartHandshake, Building2, Quote, ArrowRight
} from 'lucide-react';
import { resolveMediaUrl, handleImageFallback } from '@/lib/utils';

export default function AboutPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <RealtimeAnalyticsTracker />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-amber-600 transition">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600 font-bold">Giới thiệu công ty</span>
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="max-w-4xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Về Chúng Tôi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
            </h1>
            <p className="text-lg font-bold text-amber-600">
              Bê Tông An Gia Bình – Đối tác đáng tin cậy trên mỗi công trình, góp phần xây dựng tương lai bền vững.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              An Gia Bình không chỉ là một cái tên trong ngành sản xuất bê tông tại Việt Nam, mà còn là biểu tượng của sự vững chắc, uy tín và chất lượng. Với kinh nghiệm nhiều năm trong ngành, An Gia Bình không ngừng phát triển và mở rộng, nâng cao năng lực cung ứng trên thị trường bê tông xây dựng.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="/about/thu-ngo"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm transition"
              >
                <span>Đọc Thư Ngỏ Ban Lãnh Đạo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quy-trinh-san-xuat"
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition"
              >
                <span>Xem Quy Trình Sản Xuất</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:0988266293"
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>0988 2662 93</span>
              </a>
            </div>
          </div>
        </section>

        {/* Video Giới Thiệu Cụm Trạm Trộn & Đoàn Xe Bê Tông An Gia Bình */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Thước Phim Tư Liệu</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Toàn Cảnh Cụm Trạm Trộn &amp; Đoàn Xe An Gia Bình</h2>
              <p className="text-xs sm:text-sm text-slate-400">Trực tiếp ghi hình tại trạm trộn KCN Khánh Phú &amp; dàn xe bồn, xe bơm cần tại Ninh Bình</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
              <Factory className="w-4 h-4 text-amber-400" />
              <span>450m³/h • 35+ Xe Bồn</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-[500px] w-full">
            <video
              controls
              autoPlay
              muted
              loop
              playsInline
              poster="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/videos/be-tong-an-gia-binh.jpg"
              className="w-full h-full object-cover"
            >
              <source
                src="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/videos/be-tong-an-gia-binh.webm"
                type="video/webm"
              />
              <source
                src="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev/images/videos/be-tong-an-gia-binh.MP4"
                type="video/mp4"
              />
            </video>
          </div>
          <p className="text-xs text-slate-400 text-center italic">
            * Hệ thống tự động hóa khép kín đáp ứng nghiêm ngặt tiêu chuẩn TCVN 3105 &amp; TCVN 3118.
          </p>
        </section>

        {/* 1. TỔ CHỨC VÀ UY TÍN BÊ TÔNG AN GIA BÌNH */}
        <section id="to-chuc" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Factory className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Hạ Tầng Năng Lực</span>
              <h2 className="text-2xl font-black text-slate-900">Tổ Chức Và Uy Tín Bê Tông An Gia Bình</h2>
            </div>
          </div>
          <div className="text-slate-700 text-base leading-relaxed pl-2 sm:pl-16 space-y-4">
            <p>
              Tọa lạc tại trung tâm khu vực phát triển xây dựng sôi động của tỉnh Ninh Bình, <strong>An Gia Bình</strong> được biết đến với cụm nhà máy sản xuất hiện đại bậc nhất, ứng dụng dây chuyền công nghệ điều khiển điện tử tự động hóa hoàn toàn trong phối trộn và kiểm định chất lượng bê tông.
            </p>
            <p>
              Uy tín của công ty được xây dựng dựa trên chất lượng sản phẩm vượt trội theo tiêu chuẩn quốc gia TCVN, dịch vụ chăm sóc khách hàng chuyên nghiệp, tư vấn kỹ thuật tận tâm và khả năng đáp ứng nhanh chóng, linh hoạt theo từng yêu cầu đặc thù của dự án.
            </p>

            {/* 2 Trạm Trộn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-amber-600" />
                  <span>Trạm 1: KCN Khánh Phú, Ninh Bình</span>
                </div>
                <div className="text-xs text-amber-700 font-bold mb-2">Công suất: 300 m³/h • Điều khiển số hóa</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trạm trộn công suất lớn với 2 nhánh trộn độc lập, đáp ứng cấp hàng liên tục hàng nghìn mét khối cho các dự án công nghiệp trọng điểm, nhà xưởng và cao tốc.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-blue-600" />
                  <span>Trạm 2: Xã Kim Sơn, Ninh Bình</span>
                </div>
                <div className="text-xs text-blue-700 font-bold mb-2">Công suất: 150 m³/h • Cơ động cao</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Phục vụ các khu vực phía Nam tỉnh Ninh Bình, huyện Kim Sơn, Yên Mô và vùng ven biển, giảm thiểu tối đa thời gian vận chuyển bồn quay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DỊCH VỤ BÊ TÔNG CUNG CẤP */}
        <section id="dich-vu-cung-cap" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Danh Mục Giải Pháp</span>
              <h2 className="text-2xl font-black text-slate-900">Dịch Vụ Bê Tông Cung Cấp</h2>
            </div>
          </div>
          <div className="text-slate-700 text-base leading-relaxed pl-2 sm:pl-16 space-y-4">
            <p>
              Bê Tông An Gia Bình cung cấp đa dạng các loại bê tông, từ bê tông thương phẩm tiêu chuẩn đến bê tông đặc chủng công nghệ cao, phù hợp với mọi loại công trình từ dân dụng nhà phố đến các siêu dự án công nghiệp:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[
                { title: 'Bê Tông Tươi', desc: 'Bê tông thường, chống thấm B6-B12, cường độ sớm R7, ninh kết chậm đổ khối lớn.', link: '/be-tong-tuoi/be-tong-thuong' },
                { title: 'Bê Tông Thương Phẩm', desc: 'Sản xuất công nghiệp chuẩn TCVN, cấp phối chuẩn xác, niêm phong kẹp chì từng xe.', link: '/be-tong-thuong-pham' },
                { title: 'Bơm Bê Tông', desc: 'Dàn xe bơm cần 37m - 56m và bơm tĩnh áp lực cao vươn xa 300m vào mọi ngõ ngách.', link: '/bom-be-tong' },
                { title: 'Bê Tông Siêu Nhẹ', desc: 'Bê tông bọt xốp EPS cách nhiệt, cách âm, giảm 50% tải trọng nền móng và sàn mái.', link: '/be-tong-sieu-nhe' },
                { title: 'Bê Tông Nhựa Nóng', desc: 'Rải thảm bê tông Asphalt hạt mịn C9.5, hạt trung C12.5, hạ tầng đường KCN.', link: '/be-tong-nhua' },
                { title: 'Bê Tông Khí Chưng Áp', desc: 'Gạch AAC và tấm panel ALC chống cháy, thi công lắp ghép siêu tốc cho nhà xưởng.', link: '/be-tong-khi-chung-ap' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition group space-y-2 block"
                >
                  <div className="font-extrabold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>

            <p className="text-sm text-slate-600 italic">
              Đội ngũ kỹ thuật giàu kinh nghiệm của An Gia Bình luôn sẵn sàng tư vấn và hỗ trợ khách hàng lựa chọn loại bê tông tối ưu nhất, đồng thời đảm bảo việc vận chuyển an toàn, chuẩn thời gian và thông suốt.
            </p>
          </div>
        </section>

        {/* 3. TẦM NHÌN VÀ SỨ MỆNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tầm nhìn */}
          <section id="tamnhin" className="scroll-mt-28 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Định Hướng Chiến Lược</span>
                <h2 className="text-2xl font-black text-slate-900">Tầm Nhìn Chiến Lược</h2>
              </div>
            </div>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                An Gia Bình không chỉ hướng đến việc trở thành nhà cung cấp bê tông hàng đầu tại Việt Nam, mà còn đặt mục tiêu mở rộng thị trường ra toàn khu vực.
              </p>
              <p>
                AN GIA BÌNH sẽ không ngừng đầu tư, đổi mới sáng tạo để trở thành một trong những Tập đoàn kinh tế đa ngành hàng đầu, nâng tầm thương hiệu Việt, thể hiện tầm vóc trí tuệ và niềm tự hào Việt Nam trên thị trường quốc tế.
              </p>
            </div>
          </section>

          {/* Sứ mệnh */}
          <section id="sumenh" className="scroll-mt-28 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Mục Tiêu Hành Động</span>
                <h2 className="text-2xl font-black text-slate-900">Sứ Mệnh Thương Hiệu</h2>
              </div>
            </div>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                Sứ mệnh của Bê Tông An Gia Bình là tạo ra những sản phẩm bê tông chất lượng cao, góp phần xây dựng nền móng vững chắc cho mọi công trình.
              </p>
              <p>
                Chúng tôi luôn hướng tới sự bền vững, an toàn và chuẩn mực kỹ thuật trong từng sản phẩm, đồng thời không ngừng cải tiến công nghệ để tối ưu hóa hiệu quả cho khách hàng, đối tác và cộng đồng xã hội.
              </p>
            </div>
          </section>
        </div>

        {/* 4. GIÁ TRỊ CỐT LÕI */}
        <section id="giatri" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kim Chỉ Nam Hoạt Động</span>
              <h2 className="text-2xl font-black text-slate-900">Giá Trị Cốt Lõi</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span>UY TÍN</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Luôn đặt chữ <strong>Tín</strong> lên hàng đầu trong mọi hoạt động hợp tác kinh doanh với khách hàng, đối tác trong và ngoài nước.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>CHẤT LƯỢNG</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Luôn cung cấp sản phẩm bê tông và dịch vụ bơm, vận chuyển với chất lượng tốt nhất, đạt chuẩn TCVN và kiểm định minh bạch.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>HIỆU QUẢ</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tối ưu mọi nguồn lực, quy trình để phục vụ khách hàng nhanh nhất và chất lượng nhất. Đảm bảo sự hiệu quả trong đầu tư của khách hàng là ưu tiên hàng đầu.
              </p>
            </div>
          </div>
        </section>

        {/* 5. ĐỊNH HƯỚNG PHÁT TRIỂN */}
        <section id="khat-vong" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Định Hướng Hợp Tác</span>
              <h2 className="text-2xl font-black text-slate-900">Định Hướng Nâng Tầm</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base text-amber-700">1. Đối với thị trường</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cung cấp các sản phẩm, dịch vụ chất lượng với tiêu chuẩn kiểm soát nghiêm ngặt nhằm thỏa mãn tốt nhất nhu cầu của khách hàng.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base text-blue-700">2. Đối với đối tác</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Đề cao tinh thần hợp tác cùng phát triển, đồng hành tin cậy và minh bạch cùng các đối tác chiến lược.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base text-emerald-700">3. Đối với nhân viên</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Xây dựng môi trường làm việc chuyên nghiệp, năng động, sáng tạo và nhân văn, tạo điều kiện thu nhập thỏa đáng và cơ hội phát triển công bằng cho tất cả nhân viên.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base text-purple-700">4. Đối với xã hội</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hài hòa lợi ích doanh nghiệp với lợi ích xã hội, đóng góp tích cực vào các hoạt động hướng về cộng đồng, thể hiện tinh thần trách nhiệm công dân.
              </p>
            </div>
          </div>
        </section>

        {/* 6. ĐỘI NGŨ NHÂN SỰ & HÌNH ẢNH */}
        <section id="doi-ngu" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tài Sản Quý Giá Nhất</span>
              <h2 className="text-2xl font-black text-slate-900">Đội Ngũ Nhân Sự Chuyên Nghiệp</h2>
            </div>
          </div>

          <div className="text-slate-700 text-base leading-relaxed pl-2 sm:pl-16 space-y-4">
            <p>
              Với tiêu chí nhân lực là tài sản quý giá nhất tạo nên sự phát triển mạnh mẽ và bền vững cho công ty, An Gia Bình luôn luôn quan tâm và dành sự ưu tiên cao nhất để đầu tư vào nguồn lực con người.
            </p>
            <p>
              Chúng tôi tự hào rằng đội ngũ kỹ sư, nhân viên kỹ thuật và vận hành của chúng tôi là những người được đào tạo bài bản nhất, có trình độ chuyên môn cao với phương châm làm việc <strong>Trách nhiệm – Nhiệt tình – Sáng tạo</strong>.
            </p>
            <p>
              Kết hợp với các đối tác trong và ngoài nước, Công ty định kỳ tổ chức các kỳ đào tạo chuyên sâu về quy chuẩn an toàn, vận hành thiết bị xe tải nặng, xe bơm bê tông thế hệ mới, công nghệ vật liệu xây dựng tiên tiến và quản lý dịch vụ khách hàng.
            </p>

            {/* Team photo from original site */}
            <div className="pt-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={resolveMediaUrl('/images/doi-ngu-nhan-su-be-tong-an-gia-binh-1.jpg', 'Đội ngũ nhân sự Bê Tông An Gia Bình')}
                alt="Đội ngũ nhân sự Bê Tông An Gia Bình"
                onError={(e) => handleImageFallback(e, 'Đội ngũ nhân sự Bê Tông An Gia Bình')}
                className="w-full h-auto object-cover max-h-[450px]"
              />
              <div className="p-3 bg-white text-center text-xs text-slate-500 italic">
                Đội ngũ cán bộ kỹ thuật và nhân viên Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình
              </div>
            </div>
          </div>
        </section>

        {/* 7. TÍNH CỘNG ĐỒNG */}
        <section id="cong-dong" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Trách Nhiệm Xã Hội</span>
              <h2 className="text-2xl font-black text-slate-900">Tính Cộng Đồng Của An Gia Bình</h2>
            </div>
          </div>
          <div className="text-slate-700 text-base leading-relaxed pl-2 sm:pl-16 space-y-3">
            <p>
              An Gia Bình không chỉ là một doanh nghiệp kinh doanh, mà còn là một thành viên tích cực trong cộng đồng. Công ty thường xuyên tham gia vào các hoạt động xã hội, từ việc tài trợ cho các dự án hạ tầng cộng đồng địa phương đến việc thực hiện các chương trình sản xuất sạch hơn, bảo vệ môi trường sinh thái Ninh Bình.
            </p>
            <p>
              Chúng tôi tin rằng sự phát triển bền vững của doanh nghiệp luôn gắn liền mật thiết với trách nhiệm đối với xã hội và môi trường sống.
            </p>
          </div>
        </section>

        {/* 8. ĐỐI TÁC HỢP TÁC CHIẾN LƯỢC */}
        <section id="doitac" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Handshake className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Đồng Hành Vững Chắc</span>
              <h2 className="text-2xl font-black text-slate-900">Đối Tác Hợp Tác Chiến Lược</h2>
            </div>
          </div>
          <p className="text-slate-600 text-sm pl-2 sm:pl-16">
            Bê Tông An Gia Bình tự hào hợp tác chặt chẽ cùng các nhà sản xuất nguyên vật liệu, xi măng, phụ gia hàng đầu và các tổng thầu xây dựng quy mô lớn:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              'Xi Măng The Vissai Ninh Bình',
              'Xi Măng Duyên Hà Tam Điệp',
              'Tập Đoàn Hóa Chất Sika Việt Nam',
              'Xi Măng Xuân Thành',
              'Tổng Thầu Xây Dựng Coteccons',
              'Doanh Nghiệp Xây Dựng Xuân Trường',
              'Phụ Gia Xây Dựng Grace',
              'Ban Quản Lý Các KCN Tỉnh Ninh Bình'
            ].map((partner, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 flex items-center justify-center min-h-[70px]">
                {partner}
              </div>
            ))}
          </div>
        </section>

        {/* 9. KHÁCH HÀNG NÓI VỀ BÊ TÔNG AN GIA BÌNH */}
        <section id="danh-gia" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Quote className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Ý Kiến Đánh Giá</span>
              <h2 className="text-2xl font-black text-slate-900">Khách Hàng Nói Về Bê Tông An Gia Bình</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;Là khách hàng thân thiết của công ty từ những ngày đầu, tôi thực sự hài lòng về cách mà công ty phục vụ, quan tâm chăm sóc khách hàng và mang những giá trị đích thực tới cho doanh nghiệp chúng tôi. Cảm ơn các bạn.&rdquo;
              </p>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">Anh Lê Gia</div>
                  <div className="text-xs text-slate-500">Đại diện Công ty Công Hà</div>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-white px-2.5 py-1 rounded-full border border-amber-200">
                  Đối tác thân thiết
                </span>
              </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4">
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;Công ty làm việc rất hiệu quả và chuyên nghiệp, tôi rất hài lòng với cách làm việc của nhân viên công ty. Rất vui khi được hợp tác cùng Bê Tông An Gia Bình trong các công trình nhà xưởng.&rdquo;
              </p>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">Anh Thanh Anh</div>
                  <div className="text-xs text-slate-500">Giám đốc Chang Xin</div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded-full border border-blue-200">
                  Khách hàng doanh nghiệp
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 10. THÔNG TIN DOANH NGHIỆP PHÁP LÝ */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden space-y-6">
          <div className="relative z-10 space-y-4">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Thông Tin Pháp Lý Doanh Nghiệp</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block mb-1">Mã Số Thuế (Tax ID)</span>
                <strong className="text-white text-base font-mono">2700870972</strong>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block mb-1">Hotline Kỹ Thuật & Đặt Bê Tông</span>
                <strong className="text-amber-400 text-base">0988 2662 93</strong>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block mb-1">Email Công Ty</span>
                <strong className="text-white">ketoan.angiabinh@gmail.com</strong>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-2">
              <p>• <strong>Trạm trộn 1:</strong> Lô CN-08, Khu Công Nghiệp Khánh Phú, Phường Đông Hoa Lư, Tỉnh Ninh Bình (Công suất 300 m³/h)</p>
              <p>• <strong>Trạm trộn 2:</strong> Xã Kim Sơn, Tỉnh Ninh Bình (Công suất 150 m³/h)</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
