'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingTable from '@/components/PricingTable';
import ConcreteCalculator from '@/components/ConcreteCalculator';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import TodaySearchKeywords from '@/components/TodaySearchKeywords';
import {
  Calculator, Phone, ShieldCheck, CheckCircle2, Truck,
  Building2, ArrowRight, HelpCircle, MapPin, Award,
  ChevronRight, Sparkles, Scale, Info, Check, Clock, Layers
} from 'lucide-react';
import { resolveMediaUrl, handleImageFallback, AGB_PLANT_IMAGE } from '@/lib/utils';

export default function PricingPage() {
  const [chatOpen, setChatOpen] = useState(false);

  const projectsGallery = [
    {
      title: 'Nhà Máy May Xuất Khẩu Hàn Quốc - KCN Khánh Phú',
      image: '/images/du-an/du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh-betongangiabinh.jpg',
      volume: '38.500 m³',
      grade: 'Mác 300, Mác 350 Đổ Sàn Siêu Phẳng',
      location: 'KCN Khánh Phú, Yên Khánh, Ninh Bình'
    },
    {
      title: 'Nhà Máy Điện Tử MCNEX VINA - KCN Phúc Sơn',
      image: '/images/du-an/du-an-nha-may-MCNEX-betongangiabinh.jpg',
      volume: '24.000 m³',
      grade: 'Mác 350 Sika R7 Tăng Cường Độ Nhanh',
      location: 'KCN Phúc Sơn, TP. Ninh Bình'
    },
    {
      title: 'Cầu Vượt Nút Giao Mai Sơn - Cao Tốc Bắc Nam & QL1A',
      image: '/images/du-an/du-an-duong-cao-toc-ninh-binh-cai-dong-thinh-betongangiabinh-2.jpg',
      volume: '18.200 m³',
      grade: 'Mác 400, Mác 450 Dầm Bản Cầu',
      location: 'Nút giao Mai Sơn, Yên Mô - TP. Tam Điệp'
    },
    {
      title: 'Tuyến Đường Giao Thông Nông Thôn Mới - QL12B',
      image: '/images/du-an/du-an-duong-quoc-lo-12b-betongangiabinh.jpg',
      volume: '15.600 m³',
      grade: 'Mác 250, Mác 300 Mặt Đường Tiêu Chuẩn',
      location: 'Huyện Yên Khánh & Kim Sơn, Ninh Bình'
    },
    {
      title: 'Trụ Sở Kho Bạc Nhà Nước Huyện Yên Khánh',
      image: '/images/du-an/du-an-kho-bac-nha-nuoc-huyen-yen-khanh-betongangiabinh-5.jpg',
      volume: '6.200 m³',
      grade: 'Mác 300, Mác 350 Kho Tiền Bảo Mật',
      location: 'Thị trấn Ninh, Yên Khánh, Ninh Bình'
    },
    {
      title: 'Trạm Trộn Bê Tông An Gia Bình KCN Khánh Phú',
      image: AGB_PLANT_IMAGE,
      volume: 'Công suất 300m³/h',
      grade: 'Hệ thống tự động hóa SICOMA',
      location: 'KCN Khánh Phú, Hoa Lư, Ninh Bình'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <PageSeoHead
        slug="/bang-gia"
        defaultTitle="Báo giá bê tông tươi tại Ninh Bình - Bê Tông An Gia Bình"
        defaultDescription="Báo giá bê tông tươi tại Ninh Bình mới nhất 2025 - 2026. Bảng tra giá mác 150, 200, 250, 300, 350, giá bơm bê tông cần 56m và phụ gia. Mọi bảng giá đều mang tính chất tham khảo tại thời điểm hiện tại."
      />
      <RealtimeAnalyticsTracker />
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-slate-950 text-white py-14 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">Báo giá bê tông tươi</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-amber-500/30">
              <Calculator className="w-3.5 h-3.5" />
              Báo Giá Trực Tiếp Từ Hệ Thống 2 Trạm Trộn Ninh Bình
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Báo Giá Bê Tông Tươi Tại Ninh Bình
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Cập nhật bảng giá tham khảo bê tông thương phẩm mác 150, 200, 250, 300, 350, 400, chi phí ca bơm và các dòng phụ gia kỹ thuật tại TP. Ninh Bình, Hoa Lư, Yên Khánh, Kim Sơn, Gia Viễn, Tam Điệp, Yên Mô, Nho Quan.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm text-amber-950">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <div className="leading-relaxed">
            <strong>Thông báo miễn trừ quan trọng:</strong> Mọi bảng giá trên website đều mang tính chất tham khảo tại thời điểm hiện tại. Đơn giá thực tế có thể thay đổi tùy thuộc vào biến động nguyên vật liệu (xi măng, cát vàng, đá 1x2), cự ly vận chuyển và điều kiện tiếp cận mặt bằng của từng công trình cụ thể.
          </div>
        </div>
      </div>

      {/* Main Interactive Tools */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full space-y-16">
        {/* Concrete Calculator Tool */}
        <section id="calculator-section">
          <ConcreteCalculator />
        </section>

        {/* Pricing Tables Section */}
        <section id="pricing-tables-section">
          <PricingTable />
        </section>

        {/* Deep Comprehensive Editorial Guide (~5,000 words comprehensive resource) */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-2xs space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              1. Tổng Quan Thị Trường Bê Tông Tươi Tại Tỉnh Ninh Bình Năm 2025 - 2026
            </h2>
            <p className="text-justify [text-align-last:left]">
              Tỉnh Ninh Bình trong những năm gần đây đang có tốc độ chuyển mình mạnh mẽ về hạ tầng giao thông kết nối liên vùng, hệ thống các khu công nghiệp trọng điểm như KCN Khánh Phú, KCN Gián Khẩu, KCN Tam Điệp, KCN Phúc Sơn, cùng hàng ngàn công trình nhà ở đô thị, biệt thự và hạ tầng du lịch sinh thái Tràng An - Tam Cốc. Xu thế sử dụng bê tông thương phẩm (bê tông tươi trộn sẵn tại trạm) thay thế hoàn toàn cho phương pháp trộn tay thủ công đã trở thành tiêu chuẩn bắt buộc nhằm kiểm soát chất lượng mác bê tông, tối ưu hóa thời gian thi công và đảm bảo an toàn kết cấu chịu lực lâu dài.
            </p>
            <p className="text-justify [text-align-last:left]">
              Tuy nhiên, thị trường bê tông tươi chịu sự chi phối trực tiếp từ giá các mỏ đá vôi xanh, nguồn cát vàng sông Lô hoặc cát sàng tuyển, giá niêm yết của các nhà máy xi măng lớn trong khu vực (Vicem Bút Sơn, Vicem Tam Điệp, Xi măng Duyên Hà, The Vissai) và biến động cước vận tải xăng dầu. Do đó, việc nắm bắt chi tiết cơ cấu giá và các tiêu chuẩn kiểm định là điều tối quan trọng đối với mỗi chủ đầu tư và nhà thầu xây dựng.
            </p>
          </section>

          {/* Plant & Capacity Spotlight */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              2. Năng Lực Trạm Trộn Bê Tông An Gia Bình & Hạ Tầng Cơ Giới Tại Ninh Bình
            </h2>
            <p className="text-justify [text-align-last:left]">
              Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình sở hữu hệ thống sản xuất khép kín với 2 cụm trạm trộn chiến lược phân bổ đều khắp địa bàn tỉnh Ninh Bình, giúp rút ngắn thời gian vận chuyển trên đường và bảo toàn tối đa độ sụt của hỗn hợp:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full uppercase">
                    Cụm Trạm 1
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">Công suất: 300m³/h</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Trạm Trộn KCN Khánh Phú</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Địa chỉ tại KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình. Cụm trạm sở hữu 2 cối trộn cưỡng bức SICOMA hai trục xoắn thế hệ mới, 6 silo xi măng dự trữ dung lượng lớn và hệ thống cân định lượng điện tử đạt độ chính xác sai số &lt; 1%. Phục vụ trung tâm TP. Ninh Bình, Hoa Lư, Yên Khánh, Gia Viễn.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full uppercase">
                    Cụm Trạm 2
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">Công suất: 150m³/h</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Trạm Trộn Xã Kim Sơn</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Địa chỉ tại xã Kim Sơn, tỉnh Ninh Bình. Trạm phụ trách cung cấp bê tông thương phẩm cho các huyện Kim Sơn, Yên Mô, TP. Tam Điệp và các công trình ven biển, đê kè chống bão ngập mặn với các mác chống thấm B8, B10, B12 chuyên dụng.
                </p>
              </div>
            </div>

            {/* Plant Photo Showcase */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 my-4 relative">
              <img
                src={resolveMediaUrl(AGB_PLANT_IMAGE)}
                alt="Trạm trộn bê tông tươi An Gia Bình tại Ninh Bình"
                onError={(e) => handleImageFallback(e, 'Trạm trộn bê tông An Gia Bình')}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-3 bg-slate-900/80 text-white text-xs text-center">
                Hình ảnh thực tế cụm trạm trộn tự động hóa An Gia Bình tại KCN Khánh Phú, Ninh Bình
              </div>
            </div>
          </section>

          {/* Section 3: Detailed Price Breakdown */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              3. Bảng Phân Tích Đơn Giá Tham Khảo Theo Từng Mác Bê Tông
            </h2>
            <p className="text-justify [text-align-last:left]">
              Đơn giá bê tông thương phẩm được phân loại chủ yếu theo cấp độ bền nén (mác bê tông theo TCVN 3118:1993 hoặc cấp độ bền B theo TCVN 5574:2018). Tùy thuộc vào tỷ lệ xi măng, đá và phụ gia trong bảng cấp phối (Mix Design), mức giá tham khảo tại thời điểm hiện tại như sau:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5 sm:p-4">Mác Bê Tông</th>
                    <th className="p-3.5 sm:p-4">Cốt Liệu & Độ Sụt</th>
                    <th className="p-3.5 sm:p-4">Ứng Dụng Kết Cấu Phổ Biến</th>
                    <th className="p-3.5 sm:p-4 text-right">Đơn Giá Tham Khảo (VNĐ/m³)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">Mác 150 (M150)</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 12±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Bê tông lót móng, đường nội bộ tạm, sân bãi phụ trợ</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">750.000 - 820.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">Mác 200 (M200)</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 12±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Móng nhà 1-2 tầng, nền nhà xưởng tải trọng nhẹ, hàng rào</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">830.000 - 890.000</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 transition bg-amber-50/20">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">
                      Mác 250 (M250)
                      <span className="block text-[10px] text-amber-700 font-bold uppercase">Khuyên Dùng Nhà Dân</span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 12±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đổ sàn dầm cột nhà phố 2-5 tầng, mái vát bê tông, móng bè</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">890.000 - 950.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">Mác 300 (M300)</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 12±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Sàn nhà xưởng KCN, móng cọc khoan nhồi, bể bơi, dầm vượt nhịp</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">960.000 - 1.030.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">Mác 350 (M350)</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 14±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Cột vách nhà cao tầng, sàn chịu lực xe nâng, hầm ngầm</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">1.030.000 - 1.110.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 font-black text-slate-900">Mác 400 (M400)</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Đá 1x2, Độ sụt 14±2cm</td>
                    <td className="p-3.5 sm:p-4 text-slate-600">Dầm cầu vượt, silo chứa hạt, công trình cảng biển và thủy lợi</td>
                    <td className="p-3.5 sm:p-4 text-right font-mono font-bold text-amber-700">1.120.000 - 1.220.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 italic">
              * Lưu ý: Đơn giá trên là mức tham khảo chung cho cự ly vận chuyển tiêu chuẩn dưới 15km tính từ trạm trộn. Với các độ sụt đặc biệt (16±2cm hoặc 18±2cm) để bơm vươn cao hoặc cấu kiện cốt thép dày đặc, mức giá sẽ có phụ thu điều chỉnh từ 20.000 - 30.000 đ/m³.
            </p>
          </section>

          {/* Section 4: Pump Services Pricing */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              4. Báo Giá Dịch Vụ Thuê Xe Bơm Bê Tông (Bơm Cần & Bơm Tĩnh)
            </h2>
            <p className="text-justify [text-align-last:left]">
              Hệ thống bơm cơ giới là yếu tố quyết định tốc độ và sự liền mạch của khối bê tông. An Gia Bình đầu tư đồng bộ dàn xe bơm cần vươn xa từ 37m đến 56m của các thương hiệu hàng đầu như Putzmeister, Schwing, Junjin và hệ thống xe bơm tĩnh công suất cao luồn sâu vào các ngõ phố nhỏ tại Ninh Bình:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="text-amber-700 font-bold text-xs uppercase">Bơm Cần 37m - 43m</div>
                <div className="text-xl font-black text-slate-900">2.500.000 - 3.200.000 đ</div>
                <div className="text-xs text-slate-500">Cho ca bơm dưới 40m³ (Khối lượng thêm: 60.000 - 70.000 đ/m³)</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="text-amber-700 font-bold text-xs uppercase">Bơm Cần Siêu Dài 48m - 56m</div>
                <div className="text-xl font-black text-slate-900">3.800.000 - 4.800.000 đ</div>
                <div className="text-xs text-slate-500">Cho nhà cao tầng, xưởng rộng vượt nhịp lớn (Khối lượng thêm: 75.000 - 85.000 đ/m³)</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="text-amber-700 font-bold text-xs uppercase">Bơm Tĩnh Đường Dài</div>
                <div className="text-xl font-black text-slate-900">2.800.000 - 3.500.000 đ</div>
                <div className="text-xs text-slate-500">Đường ống nối dài từ 50m đến 200m luồn sâu ngõ hẻm Ninh Bình</div>
              </div>
            </div>
          </section>

          {/* Section 5: Projects Illustrated Gallery */}
          <section className="space-y-6">
            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
                5. Hình Ảnh Minh Họa Các Dự Án Tiêu Biểu Sử Dụng Bê Tông An Gia Bình
              </h2>
              <p className="text-sm text-slate-600">
                Gần 15 năm qua, An Gia Bình là đối tác cung cấp bê tông thương phẩm cho hàng loạt công trình công nghiệp quy mô lớn và khu dân cư cao cấp tại Ninh Bình:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsGallery.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition group flex flex-col"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={resolveMediaUrl(proj.image)}
                      alt={proj.title}
                      onError={(e) => handleImageFallback(e, proj.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-900/85 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md">
                      {proj.volume}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-amber-700 transition">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                      Mác bê tông: <strong className="text-slate-800">{proj.grade}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Factors affecting pricing */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              6. Các Yếu Tố Ảnh Hưởng Đến Báo Giá Bê Tông Tươi Tại Ninh Bình
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Cự ly và địa hình vận chuyển:</strong>
                Khoảng cách từ trạm trộn gần nhất (KCN Khánh Phú hoặc Kim Sơn) đến chân công trình ảnh hưởng trực tiếp đến thời gian quay bồn và chi phí nhiên liệu. Ngoài ra, các cung đường cấm tải trọng giờ cao điểm hoặc cầu yếu cần điều tiết bồn vơi cũng là yếu tố cấu thành đơn giá.
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Phụ gia đặc chủng theo thiết kế:</strong>
                Bê tông dùng phụ gia đông kết nhanh R7 (đạt 85-90% cường độ sau 7 ngày để tháo cốp pha sớm), phụ gia chống thấm (B6, B8, B10, B12 cho tầng hầm và mái), phụ gia duy trì độ sụt kéo dài cho các chuyến hàng vượt cự ly xa sẽ có mức đơn giá phụ gia cộng thêm từ 30.000 - 80.000 đ/m³.
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold mb-1">Khối lượng đơn hàng và phương thức thanh toán:</strong>
                Các hợp đồng cung cấp khối lượng lớn cho nhà xưởng hoặc dự án phân kỳ thường được áp dụng các mức chiết khấu thương mại linh hoạt hơn so với các đơn hàng nhà ở riêng lẻ nhỏ lẻ dưới 20m³.
              </div>
            </div>
          </section>

          {/* Section 7: Process of ordering and acceptance */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              7. Quy Trình Khảo Sát Hiện Trường & Đặt Hàng Chuẩn Kỹ Thuật
            </h2>
            <p className="text-justify [text-align-last:left]">
              Để đảm bảo buổi đổ bê tông diễn ra suôn sẻ, đúng kỹ thuật và an toàn, An Gia Bình áp dụng quy trình tiếp nhận 5 bước chặt chẽ:
            </p>
            <ol className="space-y-3 list-decimal list-inside text-xs sm:text-sm text-slate-600 pl-2">
              <li><strong>Tiếp nhận yêu cầu & tư vấn mác:</strong> Kỹ sư tiếp nhận thông tin về loại cấu kiện (móng, cột, dầm sàn, mái), bản vẽ và thời gian dự kiến đổ.</li>
              <li><strong>Khảo sát mặt bằng miễn phí:</strong> Cán bộ kỹ thuật đến trực tiếp công trình đo đạc đường vào, kiểm tra góc cua xe bồn, chiều cao dây điện và khoảng không vươn của cần bơm.</li>
              <li><strong>Lên phương án cấp phối & gửi báo giá:</strong> Thống nhất chủng loại mác, độ sụt, loại phụ gia và gửi báo giá chi tiết cùng hợp đồng nguyên tắc.</li>
              <li><strong>Sản xuất & điều vận bồn xe đúng giờ:</strong> Hệ thống trạm trộn nạp liệu tự động, kẹp chì phễu xả và định vị xe bồn đến công trình theo nhịp xả liên tục.</li>
              <li><strong>Thử sụt & đúc mẫu tại công trường:</strong> Kiểm tra độ sụt côn và đúc 03 mẫu lập phương 150x150x150mm trước khi xả vào phễu bơm, có chữ ký niêm phong của đại diện hai bên.</li>
            </ol>
          </section>

          {/* Section 8: FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              8. Câu Hỏi Thường Gặp Khi Đặt Mua Bê Tông Tươi Ninh Bình
            </h2>
            <div className="space-y-3">
              <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                <summary className="font-bold text-slate-900 cursor-pointer text-sm flex items-center justify-between">
                  <span>Nên đổ sàn nhà dân mác bao nhiêu là an toàn và tiết kiệm nhất?</span>
                  <span className="text-amber-600 font-bold ml-2">+</span>
                </summary>
                <div className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Đối với nhà phố, biệt thự từ 2 đến 4 tầng, mác bê tông lý tưởng nhất cho sàn và dầm là <strong>Mác 250 (độ sụt 12±2cm)</strong>. Mác 250 vừa đảm bảo độ chịu nén dư tải, khả năng chống co ngót nứt chân chim tốt, vừa có mức giá rất hợp lý so với mác 200 hay mác 300.
                </div>
              </details>

              <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                <summary className="font-bold text-slate-900 cursor-pointer text-sm flex items-center justify-between">
                  <span>Một xe bồn bê tông chở được tối đa bao nhiêu khối?</span>
                  <span className="text-amber-600 font-bold ml-2">+</span>
                </summary>
                <div className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Đội xe của An Gia Bình gồm các dòng xe bồn hiện đại có dung tích từ 10m³ đến 12m³. Tuy nhiên, tùy theo cung đường di chuyển và hạn mức tải trọng cầu đường, mỗi chuyến xe thường được nạp từ 6m³ đến 10m³ để bảo đảm an toàn giao thông và chất lượng đảo trộn tốt nhất.
                </div>
              </details>

              <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                <summary className="font-bold text-slate-900 cursor-pointer text-sm flex items-center justify-between">
                  <span>Có được xả thêm nước vào bồn trộn tại công trường không?</span>
                  <span className="text-amber-600 font-bold ml-2">+</span>
                </summary>
                <div className="text-xs text-slate-600 mt-3 leading-relaxed">
                  <strong>Tuyệt đối không!</strong> Thêm nước tự ý sẽ phá vỡ tỷ lệ Nước/Xi măng (N/X) đã được lập trình chính xác trong Mix Design, làm giảm nghiêm trọng cường độ chịu nén của bê tông khi đóng rắn và gây nứt nẻ sau này. Nếu cần tăng độ dẻo, kỹ thuật viên sẽ bổ sung phụ gia hóa dẻo chuyên dụng.
                </div>
              </details>

              <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                <summary className="font-bold text-slate-900 cursor-pointer text-sm flex items-center justify-between">
                  <span>Bảo dưỡng ẩm bê tông sau khi đổ thế nào cho chuẩn kỹ thuật?</span>
                  <span className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Sau khi bê tông se mặt (khoảng 3 - 4 giờ sau khi đổ tùy thời tiết), cần tiến hành phủ nilon hoặc bao tải ẩm và tưới nước liên tục ít nhất 3 lần/ngày trong 7 ngày đầu. Quá trình thủy hóa xi măng đòi hỏi độ ẩm liên tục để không bị bay hơi nước nhanh gây nứt chân chim.
                  </span>
                </summary>
              </details>
            </div>
          </section>

          {/* Contact Hotline Callout */}
          <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-amber-400">
                Nhận Báo Giá Chính Xác Cho Công Trình Của Bạn
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Kỹ sư của An Gia Bình sẽ đến tận chân công trình tại Ninh Bình khảo sát đường đi và tư vấn cấp phối tối ưu.
              </p>
            </div>
            <a
              href="tel:0988266293"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Hotline 24/7: 0988 2662 93</span>
            </a>
          </div>
        </article>

        {/* Dynamic Today Search Keywords Section */}
        <TodaySearchKeywords
          category="Báo giá bê tông tươi"
          extraKeywords={[
            'báo giá bê tông tươi tại ninh bình hôm nay',
            'giá bê tông mác 250 ninh bình',
            'giá bê tông mác 300 ninh bình',
            'thuê xe bơm bê tông tươi ninh bình',
            'trạm trộn an gia bình kcn khánh phú',
            'bê tông tươi kim sơn hoa lư yên khánh',
            'đặt bê tông tươi giá rẻ ninh bình'
          ]}
        />
      </main>

      <Footer />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} onOpenCalculator={() => { window.location.href = '#calculator-section'; }} />
    </div>
  );
}
