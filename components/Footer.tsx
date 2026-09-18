'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Phone, Mail, MapPin, Facebook, ShieldCheck, Clock, Award, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  const { jekyllConfig } = useAppStore();
  return (
    <footer className="bg-slate-100 text-slate-600 pt-16 pb-20 lg:pb-12 border-t border-slate-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Bê Tông An Gia Bình",
            "legalName": "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
            "alternateName": "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
            "taxID": "2700870972",
            "vatID": "2700870972",
            "url": "https://betongangiabinh.vn",
            "logo": "https://betongangiabinh.vn/logo.png",
            "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
            "description": "Chuyên cung ứng bê tông tươi, bê tông thương phẩm, xe bơm cần 37m-56m, trạm trộn công nghệ cao tại Ninh Bình.",
            "telephone": "0988266293",
            "email": "ketoan.angiabinh@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "KCN Khánh Phú, phường Đông Hoa Lư",
              "addressLocality": "TP. Ninh Bình",
              "addressRegion": "Ninh Bình",
              "postalCode": "430000",
              "addressCountry": "VN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 20.2505,
              "longitude": 105.9752
            },
            "sameAs": [
              "https://www.facebook.com/betongangiabinh/"
            ],
            "priceRange": "$$"
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {jekyllConfig?.logo ? (
                <img
                  src={jekyllConfig.logo}
                  alt={jekyllConfig.title || 'Bê Tông An Gia Bình'}
                  className="h-10 w-auto max-w-[120px] rounded-xl object-contain shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-xs">
                  AGB
                </div>
              )}
              <span className="font-black text-lg text-slate-900 tracking-tight">
                {jekyllConfig?.title || 'BÊ TÔNG AN GIA BÌNH'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thương hiệu bê tông thương phẩm hàng đầu Ninh Bình. Hệ thống 2 cụm trạm trộn tự động hóa (KCN Khánh Phú 300m³/h & xã Kim Sơn 150m³/h), 35+ xe bồn và dàn xe bơm cần vươn xa 56m, định lượng chuẩn mác, đủ thể tích và đáp ứng tiến độ cho mọi công trình.
            </p>
            <div className="pt-2">
              <a
                href="https://www.facebook.com/betongangiabinh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                id="footer-fanpage-btn"
              >
                <Facebook className="w-4 h-4" />
                <span>Fanpage: @betongangiabinh</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Trạm Trộn & Địa Bàn */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Hệ Thống Trạm Trộn Ninh Bình
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <strong className="text-amber-700 block text-xs font-bold">Trạm 1: KCN Khánh Phú (300m³/h)</strong>
                KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình (Phục vụ TP. Ninh Bình, Hoa Lư, Yên Khánh, Gia Viễn).
              </li>
              <li className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <strong className="text-amber-700 block text-xs font-bold">Trạm 2: Xã Kim Sơn (150m³/h)</strong>
                Xã Kim Sơn, tỉnh Ninh Bình (Phục vụ huyện Kim Sơn, Yên Mô, Tam Điệp và khu vực lân cận).
              </li>
              <li className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Phục vụ đổ bê tông ngày đêm 24/7</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Danh Mục Nhanh & SEO */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase">
              Chuyên Mục & Báo Giá
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/bang-gia" className="text-slate-600 hover:text-amber-600 transition flex items-center justify-between font-medium">
                  <span>Báo Giá Bê Tông Tươi Ninh Bình</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">2025</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/bang-bao-gia-be-tong-tuoi-ninh-binh-moi-nhat" className="text-slate-600 hover:text-amber-600 transition">
                  Bảng giá mác 200, 250, 300, 350
                </Link>
              </li>
              <li>
                <Link href="/du-an" className="text-slate-600 hover:text-amber-600 transition">
                  Dự án nhà xưởng KCN & Biệt thự
                </Link>
              </li>
              <li>
                <Link href="/ho-so-nang-luc" className="text-slate-600 hover:text-amber-600 transition">
                  Hồ sơ năng lực & Kiểm định LAS-XD
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-amber-600 transition">
                  Cẩm nang kỹ thuật & Tiêu chuẩn R7, R28
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hotline & Tư Vấn Kỹ Thuật */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              Tổng Đài Đặt Bê Tông 24/7
            </h4>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Hotline Kỹ Sư Kinh Doanh:</div>
              <a href="tel:0988266293" className="text-xl font-extrabold text-amber-600 block hover:underline">
                0988 2662 93
              </a>
              <div className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Hỗ trợ khảo sát công trình, đo đạc đường vào xe bồn và thử mẫu tại hiện trường miễn phí.
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
              <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">ketoan.angiabinh@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Policy & Legal Links */}
        <div className="pt-8 pb-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-y-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/quy-trinh-san-xuat" className="hover:text-amber-600 transition font-medium">
              Quy trình kiểm định & sản xuất
            </Link>
            <Link href="/bang-gia" className="hover:text-amber-600 transition font-medium">
              Báo giá bê tông tươi
            </Link>
            <Link href="/chinh-sach-thanh-toan" className="hover:text-amber-600 transition">
              Chính sách thanh toán
            </Link>
            <Link href="/chinh-sach-van-chuyen" className="hover:text-amber-600 transition">
              Chính sách vận chuyển
            </Link>
            <Link href="/dieu-khoan" className="hover:text-amber-600 transition">
              Điều khoản dịch vụ
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-amber-600 transition">
              Chính sách bảo mật
            </Link>
            <Link href="/sitemap.xml" target="_blank" className="hover:text-amber-600 transition font-semibold text-slate-700">
              Sitemap.xml
            </Link>
            <Link href="/rss.xml" target="_blank" className="hover:text-amber-600 transition font-semibold text-slate-700">
              RSS Feed
            </Link>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('angiabinh_cookie_consent_v1');
                  window.location.reload();
                } catch {}
              }}
              className="hover:text-amber-600 transition cursor-pointer underline text-slate-500"
              title="Xem lại và chỉnh sửa cài đặt Cookie"
            >
              Cài đặt Cookie
            </button>
          </div>
          <div className="text-[11px] text-slate-400 italic">
            * Mọi bảng giá trên website đều mang tính chất tham khảo tại thời điểm hiện tại.
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="space-y-1">
            <div>
              © {new Date().getFullYear()} {jekyllConfig?.company_name || 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH'}. All rights reserved.
            </div>
            <div className="text-[11px] text-slate-400">
              Mã số thuế: <strong className="text-slate-600 font-semibold">{jekyllConfig?.tax_id || '2700870972'}</strong> • Đăng ký tại Sở Kế hoạch và Đầu tư tỉnh Ninh Bình
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Tiêu chuẩn ISO 9001 & TCVN 3105
            </span>
            <span>•</span>
            <Link href="/admin" className="hover:text-amber-600 transition flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Quản trị viên</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
