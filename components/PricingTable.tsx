'use client';

import React from 'react';
import { ShieldCheck, Phone, CheckCircle, Info, Sparkles } from 'lucide-react';

export default function PricingTable() {
  const priceData = [
    {
      grade: 'Bê tông Mác 150 (M150)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '870.000',
      application: 'Bê tông lót móng, sàn phụ, nền sân chống thấm nhẹ',
      recommended: false
    },
    {
      grade: 'Bê tông Mác 200 (M200)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '940.000',
      application: 'Nền nhà xưởng tải nhẹ, đường bê tông nông thôn, sân thượng',
      recommended: false
    },
    {
      grade: 'Bê tông Mác 250 (M250)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '1.000.000',
      application: 'Móng, dầm, cột, sàn nhà dân dụng 2 - 4 tầng (Lựa chọn phổ biến nhất)',
      recommended: true
    },
    {
      grade: 'Bê tông Mác 300 (M300)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '1.080.000',
      application: 'Biệt thự, nhà phố từ 4 tầng, sàn xưởng công nghiệp, dầm vượt nhịp',
      recommended: true
    },
    {
      grade: 'Bê tông Mác 350 (M350)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '1.160.000',
      application: 'Bể nước ngầm, hồ bơi, cột vách chịu tải trọng lớn, công trình ven biển',
      recommended: false
    },
    {
      grade: 'Bê tông Mác 400 (M400)',
      slump: '12 ± 2 cm',
      aggregate: 'Đá 1x2',
      price: '1.240.000',
      application: 'Đài cọc khoan nhồi, trụ cầu vượt cao tốc, kết cấu bê tông dự ứng lực',
      recommended: false
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white" id="pricing-table-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full">
            Bảng Giá Tham Khảo 2025 - 2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
            Báo Giá Bê Tông Thương Phẩm Ninh Bình
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Định lượng nguyên vật liệu theo phiếu cân điện tử tự động, kiểm tra độ sụt tại hiện trường và hỗ trợ đúc mẫu kiểm định R7, R28 theo TCVN 3105.
          </p>
          <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
            * <strong>Lưu ý:</strong> Mọi bảng giá trên website đều mang tính chất tham khảo tại thời điểm hiện tại. Đơn giá thực tế có thể thay đổi tùy thuộc vào biến động nguyên vật liệu (cát vàng, xi măng, đá 1x2), cự ly cung ứng và điều kiện thi công cụ thể. Vui lòng liên hệ hotline để nhận báo giá chính xác.
          </div>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white mb-10 max-w-full">
          <div className="sm:hidden bg-slate-100/90 px-3 py-1.5 text-[11px] text-slate-600 border-b border-slate-200 flex items-center justify-between font-medium">
            <span>Bảng giá niêm yết</span>
            <span className="text-amber-700 font-semibold">Vuốt ngang để xem ➔</span>
          </div>
          <table className="min-w-[620px] sm:w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                <th className="p-4 sm:p-5">Mác Bê Tông</th>
                <th className="p-4 sm:p-5">Cốt Liệu & Độ Sụt</th>
                <th className="p-4 sm:p-5">Đơn Giá Tham Khảo (VNĐ/m³)</th>
                <th className="p-4 sm:p-5 hidden md:table-cell">Khuyến Nghị Ứng Dụng</th>
                <th className="p-4 sm:p-5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priceData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-amber-50/50 transition ${
                    row.recommended ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="p-4 sm:p-5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{row.grade}</span>
                      {row.recommended && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Phổ Biến
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">
                    <div>{row.aggregate}</div>
                    <div className="text-xs text-slate-400">Độ sụt: {row.slump}</div>
                  </td>
                  <td className="p-4 sm:p-5">
                    <span className="text-base sm:text-lg font-black text-amber-600">
                      {row.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium"> đ/m³</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600 hidden md:table-cell text-xs leading-relaxed">
                    {row.application}
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <a
                      href="tel:0988266293"
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs transition shadow-2xs"
                      aria-label={`Đặt mua ngay ${row.grade}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Đặt Ngay</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additives & Pumps Sub-cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Đơn Giá Phụ Gia Đặc Chủng Theo Yêu Cầu
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Phụ gia chống thấm B6 (Sàn mái, sân phơi):</span>
                <strong className="text-slate-900">+35.000 đ/m³</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Phụ gia chống thấm B8 / B10 (Hồ bơi, hầm ngầm):</span>
                <strong className="text-slate-900">+50.000 đ/m³</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Phụ gia đông kết nhanh R7 (Đạt mác sau 7 ngày):</span>
                <strong className="text-slate-900">+45.000 đ/m³</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Phụ gia đông kết siêu nhanh R3:</span>
                <strong className="text-slate-900">Liên hệ kỹ thuật</strong>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              Chính Sách Vận Chuyển & Ca Xe Bơm
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Ca bơm cần 37m - 43m (nhà dưới 5 tầng):</span>
                <strong className="text-slate-900">Từ 2.800.000 đ/ca</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Ca bơm cần dài 52m - 56m (sàn xưởng rộng):</span>
                <strong className="text-slate-900">Từ 4.200.000 đ/ca</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <span>Bơm tĩnh áp lực cao (hẻm sâu &gt; 50m):</span>
                <strong className="text-slate-900">3.200.000 đ/ca</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Vận chuyển bán kính &lt; 15km từ trạm KCN Khánh Phú/Kim Sơn:</span>
                <strong className="text-emerald-600 font-bold">Hỗ trợ tối đa</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
