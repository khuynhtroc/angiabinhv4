'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Factory, Truck, CheckCircle2, Award, FileCheck2, ArrowRight } from 'lucide-react';

export default function AboutCompany() {
  return (
    <section className="py-16 sm:py-24 bg-white" id="about-company-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual & Facility */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80"
                alt="Trạm trộn bê tông thương phẩm An Gia Bình Ninh Bình"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Hệ Thống Trạm Trộn Tự Động Hóa 100%
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold mt-1">
                    Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn (150m³/h)
                  </h3>
                </div>
              </div>
            </div>

            {/* Sub-grid of trust stamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <FileCheck2 className="w-5 h-5 text-amber-600 mb-1.5" />
                <div className="font-bold text-slate-900 text-sm">Phòng Thí Nghiệm LAS-XD</div>
                <p className="text-slate-500 mt-1">
                  Đúc mẫu, nén ép kiểm tra cường độ R7, R28 theo TCVN 3118:1993 trực tiếp trước sự chứng kiến của chủ nhà/tư vấn giám sát.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <Award className="w-5 h-5 text-amber-600 mb-1.5" />
                <div className="font-bold text-slate-900 text-sm">Hồ Sơ Năng Lực Chuẩn</div>
                <p className="text-slate-500 mt-1">
                  Đáp ứng trọn vẹn tiêu chí đấu thầu các dự án vốn nhà nước, công trình FDI, khu công nghiệp và dự án dân dụng quy mô lớn.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full">
                Về Chúng Tôi • Bê Tông An Gia Bình
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3 leading-snug">
                Đối Tác Cung Ứng Bê Tông Uy Tín Hàng Đầu Tại Ninh Bình
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH</strong> (Mã số thuế: <strong>2700870972</strong>) được thành lập với mục tiêu mang đến giải pháp vật liệu bê tông thương phẩm đạt chuẩn chất lượng quốc gia cho các công trình trọng điểm tại tỉnh Ninh Bình và khu vực lân cận.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Chúng tôi hiểu rằng bê tông là xương sống của mọi công trình. Một mẻ bê tông kém chất lượng sẽ ảnh hưởng đến sự an toàn suốt hàng chục năm. Vì vậy, từ nguồn cát vàng tuyển chọn, đá dăm 1x2 sàng lọc sạch sẽ, đến xi măng chất lượng cao (PC40, PCB40) và phụ gia thế hệ mới Sika, Basf – tất cả đều được định lượng bằng hệ thống cân điện tử tự động đạt chuẩn sai số dưới 1%.
            </p>

            {/* 4 Pillars of Excellence */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Định lượng chuẩn mác, đủ khối lượng</h4>
                  <p className="text-xs text-slate-500">Mỗi xe bồn xuất xưởng đều có phiếu cân điện tử và kẹp chì niêm phong tại phễu xả.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tiến độ thần tốc, đổ liên tục không đứt mạch</h4>
                  <p className="text-xs text-slate-500">Đội ngũ hơn 35 xe bồn luân chuyển liên tục, điều phối bằng GPS thông minh.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Xe bơm đa năng vươn xa từ 37m đến 56m</h4>
                  <p className="text-xs text-slate-500">Bơm cần và bơm tĩnh áp lực cao giải quyết mọi địa hình ngõ hẹp hoặc tầng cao.</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/ho-so-nang-luc"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs transition"
              >
                <span>Xem Chi Tiết Hồ Sơ Năng Lực</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
              <a
                href="tel:0988266293"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline"
              >
                <span>Tư vấn kỹ thuật: 0988 2662 93</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
