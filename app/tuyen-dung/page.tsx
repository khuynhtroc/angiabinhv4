'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import MobileQuickBar from '@/components/MobileQuickBar';
import RealtimeAnalyticsTracker from '@/components/RealtimeAnalyticsTracker';
import PageSeoHead from '@/components/PageSeoHead';
import {
  ChevronRight, Users, Briefcase, MapPin, DollarSign, Clock,
  Phone, CheckCircle2, Award, Mail
} from 'lucide-react';

const JOBS_LIST = [
  {
    id: 'job-1',
    title: 'Kỹ Sư Trưởng Trạm Trộn Bê Tông (Vận Hành Phần Mềm Tự Động)',
    salary: '18 - 25 Triệu / Tháng',
    location: 'KCN Khánh Phú & Xã Kim Sơn, Ninh Bình',
    type: 'Toàn thời gian cố định',
    experience: 'Từ 2 năm kinh nghiệm trạm bê tông',
    requirements: [
      'Tốt nghiệp Cao đẳng / Đại học chuyên ngành Xây dựng, Vật liệu, Cơ điện',
      'Thành thạo vận hành hệ thống phần mềm điều khiển trạm trộn Silo',
      'Hiểu rõ cấp phối cát, đá, xi măng, phụ gia theo từng mác bê tông',
      'Có tinh thần trách nhiệm cao, chịu được áp lực tiến độ công trình'
    ],
    benefits: [
      'Lương cứng + Thưởng năng suất mét khối xuất xưởng',
      'Đóng BHXH, BHYT đầy đủ theo quy định nhà nước',
      'Hỗ trợ nhà ở công vụ và phụ cấp ăn ca tại trạm'
    ]
  },
  {
    id: 'job-2',
    title: 'Lái Xe Bồn Bê Tông Chuyên Dụng (Bằng C Hoặc FC)',
    salary: '15 - 22 Triệu / Tháng',
    location: 'TP. Ninh Bình & Các Huyện',
    type: 'Toàn thời gian (Làm theo ca đổ bê tông)',
    experience: 'Có bằng lái xe hạng C trở lên, kinh nghiệm lái xe tải nặng',
    requirements: [
      'Có bằng lái C hoặc FC còn hạn',
      'Thông thạo các tuyến đường giao thông tại Ninh Bình và các huyện',
      'Cẩn thận, giữ gìn xe tốt, kiểm tra nước bồn quay trước khi xuất xưởng',
      'Tuân thủ tuyệt đối an toàn giao thông và quy định công trường'
    ],
    benefits: [
      'Lương tính theo chuyến bồn giao hàng + thưởng chuyên cần',
      'Phụ cấp xăng xe, điện thoại, ăn ca',
      'Được cấp đồng phục và đồ bảo hộ lao động đạt chuẩn'
    ]
  },
  {
    id: 'job-3',
    title: 'Thợ Vận Hành Xe Bơm Cần Bê Tông (Cần 37m - 56m)',
    salary: '16 - 24 Triệu / Tháng',
    location: 'Ninh Bình',
    type: 'Toàn thời gian',
    experience: 'Tối thiểu 1 năm điều khiển bơm cần hoặc bơm tĩnh',
    requirements: [
      'Nắm vững quy tắc an toàn vươn cần, quan sát đường dây điện và mặt bằng chân chống',
      'Bảo dưỡng hệ thống thủy lực, piston bơm và đường ống định kỳ',
      'Phối hợp nhịp nhàng với đội thợ cào đầm tại công trình'
    ],
    benefits: [
      'Thu nhập cạnh tranh theo ca bơm',
      'Thưởng lễ tết, thưởng thâm niên hấp dẫn',
      'Môi trường làm việc năng động, trang thiết bị đời mới'
    ]
  },
  {
    id: 'job-4',
    title: 'Kỹ Thuật Viên Phòng Thí Nghiệm LAS-XD (Nén Mẫu & Đo Độ Sụt)',
    salary: '10 - 15 Triệu / Tháng',
    location: 'Phòng Thí Nghiệm Trạm KCN Khánh Phú',
    type: 'Toàn thời gian',
    experience: 'Ưu tiên ứng viên có chứng chỉ thí nghiệm viên',
    requirements: [
      'Lấy mẫu bê tông tại trạm và công trường, đo độ sụt nón côn',
      'Đúc mẫu lập phương 15x15x15 cm, bảo dưỡng mẫu trong bể dưỡng',
      'Thực hiện nén mẫu thử R7, R28 và lập biên bản kết quả thí nghiệm'
    ],
    benefits: [
      'Được đào tạo nâng cao chuyên môn kiểm định vật liệu',
      'Lương thưởng xứng đáng với năng lực',
      'Cơ hội thăng tiến lên Kỹ sư kiểm soát chất lượng (QC Manager)'
    ]
  }
];

export default function RecruitmentPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSeoHead
        slug="/tuyen-dung"
        defaultTitle="Tuyển Dụng Nhân Sự Trạm Trộn | Bê Tông An Gia Bình"
        defaultDescription="Bê Tông An Gia Bình tuyển dụng kỹ sư vận hành trạm trộn, lái xe bồn bê tông, thợ bơm cần và kỹ thuật viên thí nghiệm tại Ninh Bình."
      />
      <Navbar />
      <RealtimeAnalyticsTracker />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-amber-600">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600 font-bold">Tuyển dụng</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase">
              Gia Nhập Đội Ngũ An Gia Bình
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cơ Hội Nghề Nghiệp Tại Bê Tông An Gia Bình Ninh Bình
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Chúng tôi luôn chào đón những nhân sự tài năng, nhiệt huyết và có tinh thần trách nhiệm cao cùng xây dựng thương hiệu bê tông tươi hàng đầu Ninh Bình.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Ninh Bình (KCN Khánh Phú & Xã Kim Sơn)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>ketoan.angiabinh@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Hotline Nhân Sự: 0988 2662 93</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-amber-600" />
            <span>Vị Trí Đang Tuyển Dụng Mới Nhất (2025 - 2026)</span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {JOBS_LIST.map((job) => (
              <div key={job.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href="tel:0988266293"
                    className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Nộp Hồ Sơ / Gọi Ngay</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">Yêu Cầu Công Việc:</span>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="leading-relaxed">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">Chế Độ & Quyền Lợi:</span>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      {job.benefits.map((ben, i) => (
                        <li key={i} className="leading-relaxed">{ben}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileQuickBar onOpenChat={() => setChatOpen(true)} />
      <ChatbotWidget isOpenExternal={chatOpen} onCloseExternal={() => setChatOpen(false)} />
    </div>
  );
}
