'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileDown, CheckCircle2, Factory, Truck, Sparkles, Award, Cpu, FileText } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CapabilityProfile() {
  const { logRealtimeEvent } = useAppStore();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    logRealtimeEvent({
      type: 'download_profile',
      details: 'Khách hàng tải Hồ Sơ Năng Lực CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH (PDF)',
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      location: 'Ninh Bình',
      path: window.location.pathname
    });

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);

    // Create and trigger download of a generated Company Profile text/PDF summary
    const content = `=====================================================
HỒ SƠ NĂNG LỰC CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
TRẠM TRỘN BÊ TÔNG THƯƠNG PHẨM TIÊU CHUẨN TCVN TẠI NINH BÌNH
Mã số thuế: 2700870972
Fanpage: https://www.facebook.com/betongangiabinh/
Hotline 24/7: 0988 2662 93
Email: ketoan.angiabinh@gmail.com
=====================================================

1. THÔNG TIN DOANH NGHIỆP:
- Tên công ty: CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
- Mã số thuế: 2700870972
- Địa bàn hoạt động: Tỉnh Ninh Bình và các vùng lân cận.
- Sản phẩm chính: Bê tông thương phẩm (M150 - M450), Bê tông cọc khoan nhồi, Bê tông chống thấm B6-B12, Bê tông đông kết nhanh R3/R7, Dịch vụ xe bơm cần 37m-56m, Xe bơm tĩnh.

2. NĂNG LỰC THIẾT BỊ & TRẠM TRỘN:
- Trạm trộn 1: KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình (Công suất: 300 m³/h).
- Trạm trộn 2: Xã Kim Sơn, tỉnh Ninh Bình (Công suất: 150 m³/h).
- Tổng công suất: 450 m³/h.
- Hệ thống xe bồn vận chuyển: 35+ xe bồn loại 10m³ - 12m³ (Hyundai, Howo, Chenglong).
- Hệ thống xe bơm bê tông:
  + 03 Xe bơm cần 37m - 43m (Zoomlion, Sany, Putzmeister)
  + 03 Xe bơm cần 52m - 56m (Putzmeister, Schwing)
  + 04 Máy bơm tĩnh áp lực cao (chiều dài đường ống tới 200m).
- Hệ thống cân điện tử: Cân tự động hóa 100%, sai số < 1%.

3. TIÊU CHUẨN CHẤT LƯỢNG & PHÒNG THÍ NGHIỆM:
- Hệ thống quản lý chất lượng ISO 9001:2015.
- Phòng thí nghiệm hợp chuẩn LAS-XD thực hiện đúc nén mẫu R7, R28 theo TCVN 3105:1993 và TCVN 3118:1993.
- Cốt liệu đầu vào: Cát vàng sông Lô hạt lớn, đá 1x2 tuyển chọn, xi măng PC40 / PCB40 chuẩn, phụ gia Sika / Basf.

4. CÁC DỰ ÁN TIÊU BIỂU ĐÃ THI CÔNG:
- Nhà máy sản xuất KCN Khánh Phú & KCN Phúc Sơn
- Cầu vượt Nút giao Mai Sơn - Cao tốc Bắc Nam
- Cụm Cảng Thủy Nội Địa Ninh Phúc
- Các công trình trọng điểm tại huyện Kim Sơn, Hoa Lư, Yên Khánh
- Hơn 1.200 công trình nhà xưởng, trường học, bệnh viện và biệt thự dân dụng.

Hotline Tư Vấn Kỹ Thuật 24/7: 0988 2662 93
Email: ketoan.angiabinh@gmail.com
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ho-So-Nang-Luc-Be-Tong-An-Gia-Binh-Ninh-Binh.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 text-slate-900 border-y border-slate-200" id="capability-profile-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-amber-800 font-extrabold text-xs tracking-wider uppercase bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full shadow-2xs">
              Hồ Sơ Năng Lực Doanh Nghiệp
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
              Quy Mô Thiết Bị & Năng Lực Cung Ứng
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Được đầu tư bài bản với dàn máy móc hiện đại, 2 cụm trạm tổng công suất 450m³/h tại KCN Khánh Phú & Xã Kim Sơn, Bê Tông An Gia Bình tự tin đáp ứng mọi yêu cầu khắt khe nhất của các tổng thầu xây dựng.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs transition shadow-md shrink-0"
            id="download-company-profile"
          >
            <FileDown className="w-4 h-4" />
            <span>{downloaded ? 'Đã Tải Hồ Sơ Năng Lực' : 'Tải Hồ Sơ Năng Lực (PDF/TXT)'}</span>
          </button>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2 Cụm Trạm Trộn Tự Động</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tổng công suất 450m³/h (Trạm 1: KCN Khánh Phú 300m³/h & Trạm 2: Xã Kim Sơn 150m³/h) với cối trộn cưỡng bức đạt tiêu chuẩn ISO 9001:2015.
            </p>
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              • Cân điện tử định lượng tự động sai số &lt; 1%
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">35+ Xe Bồn Chuyên Dụng</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đội xe bồn dung tích 10m³ - 12m³ vận hành liên tục ngày đêm, được định vị GPS để theo dõi thời gian vận chuyển đảm bảo độ tươi ngon nhất.
            </p>
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              • Niêm phong kẹp chì từng chuyến xe
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Dàn Xe Bơm 37m - 56m</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sở hữu 6 xe bơm cần vươn xa 37m, 43m, 52m, 56m và 4 máy bơm tĩnh áp lực cao với chiều dài ống bơm lên tới 200m cho các ngõ hẹp.
            </p>
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              • Bơm cao tầng và diện tích sàn lớn vượt trội
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Kiểm Định Phòng Thí Nghiệm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đúc mẫu thử và kiểm định nén mẫu R7, R28 theo TCVN 3118:1993 trực tiếp tại công trường. Cung cấp đầy đủ chứng chỉ chất lượng xuất xưởng.
            </p>
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              • Biên bản nghiệm thu đạt chuẩn thanh quyết toán
            </div>
          </div>
        </div>

        {/* Technical Standard Banner */}
        <div className="mt-12 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Tiêu Chuẩn Kiểm Soát Kỹ Thuật Bê Tông An Gia Bình
            </h4>
            <p className="text-xs text-slate-600">
              Quy trình kiểm tra độ sụt, đúc mẫu tại hiện trường và nén thí nghiệm R7, R28 theo đúng hồ sơ thiết kế và tiêu chuẩn TCVN hiện hành.
            </p>
          </div>
          <a
            href="tel:0988266293"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition whitespace-nowrap shrink-0 shadow-xs"
          >
            Đường Dây Nóng Kỹ Thuật: 0988 2662 93
          </a>
        </div>
      </div>
    </section>
  );
}
