'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Project } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Code,
  AlertCircle,
  UploadCloud,
  Files,
  FileCode,
  Check,
  RefreshCw,
  Building2,
  Truck,
  MapPin,
  Calendar,
  Sparkles,
  DownloadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
  initialMode?: 'files' | 'form' | 'markdown';
}

interface UploadedProjectFile {
  id: string;
  fileName: string;
  fileSize: string;
  title: string;
  slug: string;
  permalink?: string;
  category: string;
  location: string;
  volumeM3: number;
  concreteGrade: string;
  pumpService: string;
  year: number;
  client: string;
  image: string;
  description: string;
  highlights: string[];
  date?: string;
  isSelected: boolean;
  isValid: boolean;
  validationErrors: string[];
}

const DEFAULT_CATEGORIES = [
  'Khu công nghiệp',
  'Giao thông & Hạ tầng',
  'Dân dụng & Biệt thự',
  'Công trình Công cộng'
];

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80';

// Pre-packaged 9 projects from user for instant 1-click loading/testing
const SAMPLE_9_PROJECTS_MD = [
  {
    fileName: '2024-05-20-du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh.md',
    raw: `---
layout: post
title: "Dự Án Trường THCS thị trấn Ninh – Yên Khánh – Ninh Bình"
category: "Công trình Công cộng"
location: "Thị trấn Ninh, huyện Yên Khánh, tỉnh Ninh Bình"
volume: 6800
concreteGrade: "Mác 250, Mác 300 R28"
pumpService: "Xe Bơm Cần 42m & Bơm Tĩnh"
year: 2024
client: "BQLXD Yên Khánh (Tổng thầu: Công ty CP XD Hà Linh)"
image: "/images/du-an/du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh-betongangiabinh.jpg"
date: "2024-05-20"
permalink: "/du-an/du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh/"
---
Cung cấp bê tông thương phẩm mác 250 và 300 chuẩn TCVN cho khối nhà học 3 tầng, nhà hiệu bộ và khu giáo dục thể chất trường THCS thị trấn Ninh, Yên Khánh. Bê tông đảm bảo chất lượng, kiểm định nén mẫu LAS-XD đạt 100% yêu cầu thiết kế.

- 6.800 m³ bê tông đạt chuẩn kiểm định
- Đổ bê tông móng và sàn liên tục đúng tiến độ
- Chủ đầu tư BQLXD Yên Khánh đánh giá cao`
  },
  {
    fileName: '2024-05-21-du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu.md',
    raw: `---
layout: post
title: "Dự Án Công Ty TNHH May Áo Cưới Thời Trang Chuyên Nghiệp"
category: "Khu công nghiệp"
location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình"
volume: 15200
concreteGrade: "Mác 300 Sika Floor, Mác 350 Sàn Siêu Phẳng"
pumpService: "Xe Bơm Cần 52m & 2 Bơm Tĩnh"
year: 2024
client: "Công Ty TNHH May Áo Cưới (Tổng thầu: Công ty TNHH XD Xuân Huy)"
image: "/images/du-an/du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh-betongangiabinh.jpg"
date: "2024-05-21"
permalink: "/du-an/du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh/"
---
Cung cấp bê tông thương phẩm cho nhà máy may áo cưới xuất khẩu Hàn Quốc quy mô 1.000 công nhân tại KCN Khánh Phú. Bê tông sàn sử dụng phụ gia Sika Floor chống nứt, độ phẳng laser screed chuẩn mực đáp ứng dây chuyền may hiện đại.

- 15.200 m³ sàn nhà xưởng công nghiệp siêu phẳng
- Cung ứng trực tiếp từ Trạm trộn KCN Khánh Phú
- Bảo dưỡng ẩm liên tục chống rạn nứt bề mặt`
  },
  {
    fileName: '2024-05-22-du-an-nha-xuong-cong-ty-chang-xin-viet-nam.md',
    raw: `---
layout: post
title: "Dự án Nhà Xưởng Công Ty Chang Xin Việt Nam"
category: "Khu công nghiệp"
location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình"
volume: 28500
concreteGrade: "Mác 350 Chống Thấm B8, Mác 400 Móng Bệ Lò"
pumpService: "Xe Bơm Cần 56m & 3 Xe Bơm Cần 45m"
year: 2024
client: "Công ty TNHH Chang Xin VN (Tổng thầu: Công ty TNHH MTV ĐT & XD Hoàng Dân)"
image: "/images/du-an/du-an-nha-may-padmac-khu-cong-nghiep-bao-minh-betongangiabinh.jpg"
date: "2024-05-22"
permalink: "/du-an/du-an-nha-xuong-cong-ty-chang-xin-viet-nam/"
---
Dự án nhà xưởng nấu chảy và đúc nhôm công suất 4.000 - 5.000 tấn/tháng diện tích hơn 7 ha tại KCN Khánh Phú. Cung cấp bê tông mác 350 và 400 khối lớn cho móng lò luyện nhôm, bệ máy chịu rung chấn lớn.

- 28.500 m³ bê tông mác cao chịu tải trọng nặng
- Đổ bê tông khối lớn móng lò kiểm soát nhiệt
- Tiến độ cấp liên tục 48 giờ không gián đoạn mạch đổ`
  },
  {
    fileName: '2024-05-23-du-an-duong-lien-xa-yen-khanh.md',
    raw: `---
layout: post
title: "Dự án Đường Liên Xã Yên Khánh"
category: "Giao thông & Hạ tầng"
location: "Huyện Yên Khánh, tỉnh Ninh Bình"
volume: 18000
concreteGrade: "Mác 250, Mác 300 Mặt Đường Nông Thôn Mới"
pumpService: "Xe Bồn Xả Trực Tiếp & Xe Bơm Tự Hành"
year: 2024
client: "BQL Dự Án Huyện Yên Khánh (Tổng thầu: Công ty CP XD Xuân Luyện)"
image: "/images/du-an/du-an-duong-quoc-lo-12b-betongangiabinh.jpg"
date: "2024-05-23"
permalink: "/du-an/du-an-duong-lien-xa-yen-khanh/"
---
Cung cấp 18.000 m³ bê tông tươi đổ mặt đường liên xã theo tiêu chuẩn giao thông nông thôn mới nâng cao tại huyện Yên Khánh. Bê tông được cán phẳng, tạo nhám chống trơn trượt, bảo đảm độ bền vững chịu tải trọng xe tải lớn.

- 18.000 m³ bê tông mặt đường nông thôn mới
- Tuyến đường kiểu mẫu nông thôn mới nâng cao
- Cắt khe co giãn và tạo nhám bề mặt tiêu chuẩn`
  },
  {
    fileName: '2024-05-24-du-an-truong-tieu-hoc-tran-quoc-toan.md',
    raw: `---
layout: post
title: "Dự án Trường Tiểu Học Trần Quốc Toản"
category: "Công trình Công cộng"
location: "Thị trấn Ninh, huyện Yên Khánh, tỉnh Ninh Bình"
volume: 5400
concreteGrade: "Mác 250, Mác 300 R28"
pumpService: "Xe Bơm Cần 37m & Bơm Tĩnh Áp Lực Cao"
year: 2024
client: "BQL Dự Án Huyện Yên Khánh (Tổng thầu: Công ty CP XD Đức Quân)"
image: "/images/du-an/du-an-truong-mam-non-xa-khanh-thanh-huyen-yen-khanh-betongangiabinh.jpg"
date: "2024-05-24"
permalink: "/du-an/du-an-truong-tieu-hoc-tran-quoc-toan/"
---
Cung cấp bê tông thương phẩm xây dựng dãy nhà học 3 tầng kiên cố và khuôn viên trường Tiểu học Trần Quốc Toản. Đạt chuẩn quốc gia mức độ 2, toàn bộ mẫu nén R28 kiểm định LAS-XD đều vượt chỉ tiêu thiết kế.

- 5.400 m³ bê tông mác 250 - 300 chuẩn TCVN
- Đảm bảo an toàn tuyệt đối trong khu dân cư
- Tiến độ hoàn thành trước thềm năm học mới`
  },
  {
    fileName: '2024-05-25-du-an-nha-may-san-xuat-phan-bon-npk-binh-dien.md',
    raw: `---
layout: post
title: "Dự Án Nhà máy sản xuất phân bón NPK Bình Điền – Ninh Bình"
category: "Khu công nghiệp"
location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình"
volume: 32000
concreteGrade: "Mác 300, Mác 350 Kháng Sunfat & Chống Thấm B10"
pumpService: "Cụm Xe Bơm Cần 52m & Bơm Phễu Công Suất Lớn"
year: 2024
client: "Công ty CP Bình Điền - Ninh Bình (Tổng thầu: Liên danh CP ĐT & XD Định Tân – Đại Dũng & Đông Đô)"
image: "/images/du-an/du-an-nha-may-phan-lan-binh-dien-ninh-binh-betongangiabinh.jpg"
date: "2024-05-25"
permalink: "/du-an/du-an-nha-may-san-xuat-phan-bon-npk-binh-dien-ninh-binh/"
---
Dự án tổng mức đầu tư 495 tỷ đồng, công suất 400.000 tấn/năm trên diện tích gần 8 ha tại KCN Khánh Phú. Bê tông An Gia Bình cung cấp cấp phối đặc biệt kháng sunfat, chống ăn mòn hóa chất cho kho chứa nguyên liệu và móng silo phối trộn phân bón.

- 32.000 m³ bê tông kháng ăn mòn hóa chất và sunfat
- Thi công móng sâu và sàn kho chứa tải trọng lớn
- Kiểm định chất lượng nghiêm ngặt bởi tổng thầu Đại Dũng - Đông Đô`
  },
  {
    fileName: '2024-05-25-du-an-duong-cao-toc-ninh-binh-thanh-hoa.md',
    raw: `---
layout: post
title: "Dự Án Đường cao tốc Ninh Bình - Thanh Hóa"
category: "Giao thông & Hạ tầng"
location: "Xã Cao Mồ & Xã Mai Sơn, Huyện Yên Mô, Tỉnh Ninh Bình"
volume: 45000
concreteGrade: "Mác 350, Mác 400 Cọc Khoan Nhồi & Dầm Chữ I"
pumpService: "Dàn Xe Bơm Cần 56m Áp Lực Cao"
year: 2024
client: "Ban QLDA Thăng Long - Bộ GTVT (Tổng thầu: Liên danh Công ty CP ĐT Vĩnh Thịnh & Doanh Nghiệp Xuân Trường)"
image: "/images/du-an/du-an-duong-cao-toc-ninh-binh-cai-dong-thinh-betongangiabinh-2.jpg"
date: "2024-05-25"
permalink: "/du-an/du-an-duong-cao-toc-ninh-binh-thanh-hoa/"
---
Cung ứng 45.000 m³ bê tông cường độ cao cho các gói thầu xây dựng cầu vượt nút giao Mai Sơn, cống hộp dân sinh và cọc khoan nhồi thuộc tuyến cao tốc huyết mạch Bắc - Nam đoạn Mai Sơn - Quốc Lộ 45 qua địa phận tỉnh Ninh Bình.

- 45.000 m³ phục vụ hạ tầng cao tốc huyết mạch quốc gia
- 100% tổ mẫu nén đạt và vượt cường độ thiết kế
- Cung cấp ngày đêm xuyên lễ tết giữ vững tiến độ`
  },
  {
    fileName: '2024-05-27-du-an-nha-may-mcnex.md',
    raw: `---
layout: post
title: "Dự Án Nhà máy MCNEX VINA"
category: "Khu công nghiệp"
location: "KCN Phúc Sơn, TP. Ninh Bình, Tỉnh Ninh Bình"
volume: 22000
concreteGrade: "Mác 300, Mác 350 Chống Rung Động Phòng Sạch"
pumpService: "2 Xe Bơm Cần 52m & 2 Bơm Tĩnh"
year: 2024
client: "Công ty MCNEX (Tổng thầu: Công ty TNHH XD Công Hà)"
image: "/images/du-an/du-an-nha-may-MCNEX-betongangiabinh.jpg"
date: "2024-05-27"
permalink: "/du-an/du-an-nha-may-mcnex/"
---
Cung cấp bê tông thương phẩm xây dựng mở rộng nhà máy linh kiện camera module điện thoại và ô tô MCNEX VINA tại KCN Phúc Sơn. Sàn xưởng yêu cầu độ phẳng laser tuyệt đối và khả năng chống rung chấn cao để lắp đặt dàn máy SMT chính xác.

- 22.000 m³ sàn phòng sạch công nghệ cao
- Đảm bảo độ phẳng tuyệt đối cho robot lắp ráp linh kiện
- Tổng thầu Công Hà khen ngợi tiến độ xuất sắc`
  },
  {
    fileName: '2024-05-28-du-an-nha-may-vietenergy.md',
    raw: `---
layout: post
title: "Dự án Nhà máy VIETENERGY"
category: "Khu công nghiệp"
location: "KCN Phúc Sơn, TP. Ninh Bình, Tỉnh Ninh Bình"
volume: 16500
concreteGrade: "Mác 350 R7, Mác 400 Bệ Đỡ Máy Phát Điện 1400KVA"
pumpService: "Xe Bơm Cần 48m & Bơm Tĩnh Áp Lực Cao"
year: 2024
client: "Công ty TNHH Vienergy (Tổng thầu: Công ty CP Xây Dựng Hợp Lực)"
image: "/images/du-an/du-an-nha-may-vienergi-betongangiabinh.jpg"
date: "2024-05-28"
permalink: "/du-an/du-an-nha-may-vietenergy/"
---
Cung ứng 16.500 m³ bê tông thương phẩm mác cao, đặc biệt cho khối bệ máy 2 tổ máy phát điện công suất lớn 1400KVA và móng trạm biến áp của nhà máy sản xuất giày xuất khẩu Vienergy tại KCN Phúc Sơn. Kết cấu móng khối lớn được kiểm soát nhiệt độ chống nứt chặt chẽ.

- 16.500 m³ móng khối lớn không nứt nhiệt
- Bệ đỡ 2 tổ máy phát điện 1400KVA vững chắc
- Hợp tác thành công cùng tổng thầu xây dựng Hợp Lực`
  }
];

export default function AdminBulkProjectModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'files'
}: Props) {
  const { batchAddProjects } = useAppStore();
  const [activeMode, setActiveMode] = useState<'files' | 'form' | 'markdown'>(initialMode);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  // Files mode state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedProjectFile[]>([]);
  const [batchCategory, setBatchCategory] = useState<string>('');
  const [batchYear, setBatchYear] = useState<number>(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  // Raw Markdown mode state
  const [rawText, setRawText] = useState('');

  // Form mode state
  const [formProjects, setFormProjects] = useState<Array<Omit<Project, 'id'>>>([
    {
      title: '',
      category: 'Khu công nghiệp',
      location: 'Ninh Bình',
      volumeM3: 10000,
      concreteGrade: 'Mác 300',
      pumpService: 'Xe Bơm Cần 45m',
      year: new Date().getFullYear(),
      client: '',
      image: DEFAULT_PROJECT_IMAGE,
      description: '',
      highlights: ['Tiến độ chuẩn xác', 'Bê tông đạt chuẩn TCVN']
    }
  ]);

  // Helper to parse single markdown file or text block into a project
  const parseSingleProjectMarkdown = (
    raw: string,
    fileName: string = 'du-an.md',
    fileSizeBytes: number = 0
  ): UploadedProjectFile => {
    const cleanRaw = (raw || '').replace(/^\uFEFF/, '').trim();
    const fmMatch = cleanRaw.match(/^---\s*?\r?\n([\s\S]*?)\r?\n---\s*?\r?\n?([\s\S]*)$/);

    let title = '';
    let category = 'Khu công nghiệp';
    let location = 'Ninh Bình';
    let volumeM3 = 10000;
    let concreteGrade = 'Mác 250, Mác 300';
    let pumpService = 'Xe Bơm Cần 45m';
    let year = new Date().getFullYear();
    let client = 'Chủ đầu tư Ninh Bình';
    let image = DEFAULT_PROJECT_IMAGE;
    let description = '';
    let highlights: string[] = [];
    let permalink = '';
    let slug = '';
    let date = new Date().toISOString().split('T')[0];
    let content = cleanRaw;

    // Date from filename pattern
    const ymdMatch = fileName.match(/(\d{4})[-_.](\d{2})[-_.](\d{2})/);
    if (ymdMatch) {
      date = `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
      year = parseInt(ymdMatch[1], 10) || year;
    }

    if (fmMatch) {
      const fm = fmMatch[1];
      content = fmMatch[2].trim();

      fm.split(/\r?\n/).forEach((line) => {
        const colon = line.indexOf(':');
        if (colon > -1) {
          const k = line.slice(0, colon).trim().toLowerCase();
          let v = line.slice(colon + 1).trim();
          v = v.replace(/^["']|["']$/g, '');

          if (['title', 'tieude', 'name', 'du_an', 'ten_du_an'].includes(k)) {
            title = v;
          } else if (['category', 'chuyen_muc', 'hang_muc', 'loai_du_an'].includes(k)) {
            const cleanCat = v.replace(/[\[\]"']/g, '').split(',')[0]?.trim();
            if (cleanCat) {
              const lower = cleanCat.toLowerCase();
              if (lower.includes('công nghiệp') || lower.includes('kcn') || lower.includes('nhà xưởng') || lower.includes('nhà máy')) {
                category = 'Khu công nghiệp';
              } else if (lower.includes('giao thông') || lower.includes('hạ tầng') || lower.includes('cầu') || lower.includes('đường') || lower.includes('cao tốc')) {
                category = 'Giao thông & Hạ tầng';
              } else if (lower.includes('công cộng') || lower.includes('trường') || lower.includes('bệnh viện')) {
                category = 'Công trình Công cộng';
              } else if (lower.includes('dân dụng') || lower.includes('biệt thự') || lower.includes('nhà dân')) {
                category = 'Dân dụng & Biệt thự';
              } else {
                category = cleanCat;
              }
            }
          } else if (['location', 'dia_diem', 'dia_chi', 'address'].includes(k)) {
            location = v;
          } else if (['volume', 'volumem3', 'khoi_luong', 'm3'].includes(k)) {
            const num = parseFloat(v.replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && num > 0) volumeM3 = num;
          } else if (['concretegrade', 'mac_be_tong', 'mac', 'grade'].includes(k)) {
            concreteGrade = v;
          } else if (['pumpservice', 'thiet_bi_bom', 'xe_bom', 'bom', 'pump'].includes(k)) {
            pumpService = v;
          } else if (['year', 'nam', 'nam_thi_cong'].includes(k)) {
            const y = parseInt(v, 10);
            if (!isNaN(y) && y > 2000 && y < 2050) year = y;
          } else if (['client', 'chu_dau_tu', 'khach_hang', 'tong_thau', 'nha_thau'].includes(k)) {
            client = v;
          } else if (['image', 'thumbnail', 'hinh_anh', 'cover_image'].includes(k)) {
            const cleanImg = v.replace(/\{\{\s*site\.url\s*\}\}/g, '').replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
            if (cleanImg) image = cleanImg;
          } else if (['description', 'mo_ta', 'summary', 'excerpt'].includes(k)) {
            description = v;
          } else if (['permalink', 'url', 'duong_dan'].includes(k)) {
            permalink = v;
          } else if (['slug'].includes(k)) {
            slug = v;
          } else if (['date', 'ngay'].includes(k)) {
            const cleanDate = v.split(' ')[0].replace(/^["']|["']$/g, '');
            if (cleanDate) date = cleanDate;
          }
        }
      });
    }

    // Fallback title from markdown heading or filename
    if (!title) {
      const headingMatch = content.match(/^#+\s+(.*)$/m);
      if (headingMatch) {
        title = headingMatch[1].trim();
      } else {
        title = fileName
          .replace(/\.md$/i, '')
          .replace(/^\d{4}-\d{2}-\d{2}-/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // Auto-derive slug
    if (!slug) {
      slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Extract bullet points from content as highlights
    const bulletMatches = content.match(/^[-*+]\s+(.*)$/gm);
    if (bulletMatches && bulletMatches.length > 0) {
      highlights = bulletMatches.map((b) => b.replace(/^[-*+]\s+/, '').trim()).slice(0, 5);
    } else {
      highlights = [
        `${formatNumber(volumeM3)} m³ bê tông đạt chuẩn kiểm định`,
        `Cung ứng đúng tiến độ công trình`,
        `Phục vụ chu đáo với thiết bị ${pumpService}`
      ];
    }

    // Fallback description from first paragraph of content
    if (!description) {
      const paragraphs = content
        .split(/\r?\n\r?\n/)
        .map((p) => p.replace(/^#+.*$/gm, '').trim())
        .filter((p) => p.length > 20 && !p.startsWith('-') && !p.startsWith('*'));
      if (paragraphs.length > 0) {
        description = paragraphs[0].slice(0, 320);
      } else {
        description = `Cung cấp bê tông thương phẩm ${concreteGrade} phục vụ thi công công trình ${title} tại ${location}. Đảm bảo chất lượng, đúng tiến độ và tiêu chuẩn kiểm định nghiệm thu.`;
      }
    }

    // Check validation
    const validationErrors: string[] = [];
    if (!title || title.length < 5) validationErrors.push('Tiêu đề quá ngắn');
    if (!location) validationErrors.push('Chưa có địa điểm');
    if (!client) validationErrors.push('Chưa có chủ đầu tư/nhà thầu');
    if (volumeM3 <= 0) validationErrors.push('Khối lượng m³ không hợp lệ');

    const fileSizeStr =
      fileSizeBytes > 0
        ? fileSizeBytes < 1024
          ? `${fileSizeBytes} B`
          : `${(fileSizeBytes / 1024).toFixed(1)} KB`
        : '1.5 KB';

    return {
      id: `up-proj-${Math.random().toString(36).substring(2, 9)}`,
      fileName,
      fileSize: fileSizeStr,
      title,
      slug,
      permalink: permalink || `/du-an/${slug}/`,
      category,
      location,
      volumeM3,
      concreteGrade,
      pumpService,
      year,
      client,
      image,
      description,
      highlights,
      date,
      isSelected: true,
      isValid: validationErrors.length === 0,
      validationErrors
    };
  };

  // Handle multiple file upload
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsReadingFiles(true);

    const newParsedList: UploadedProjectFile[] = [];
    const readPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith('.md') && !file.name.toLowerCase().endsWith('.markdown')) {
        continue;
      }

      const p = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target?.result as string) || '';
          const parsed = parseSingleProjectMarkdown(text, file.name, file.size);
          newParsedList.push(parsed);
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsText(file);
      });
      readPromises.push(p);
    }

    await Promise.all(readPromises);
    setIsReadingFiles(false);

    if (newParsedList.length > 0) {
      setUploadedFiles((prev) => [...newParsedList, ...prev]);
    }
  };

  // Load the 9 user sample projects
  const handleLoadSample9Projects = () => {
    const parsed = SAMPLE_9_PROJECTS_MD.map((item) =>
      parseSingleProjectMarkdown(item.raw, item.fileName, item.raw.length)
    );
    setUploadedFiles(parsed);
    setActiveMode('files');
  };

  // Parse pasted raw markdown text
  const handleParseRawText = () => {
    if (!rawText.trim()) return;

    // Check if multiple markdown blocks are separated by --- or # Project
    const blocks = rawText
      .split(/\n(?=---\s*\nlayout:|\n#+\s+Dự án|\n#+\s+Công trình)/i)
      .map((b) => b.trim())
      .filter((b) => b.length > 30);

    const itemsToParse = blocks.length > 1 ? blocks : [rawText];
    const parsed = itemsToParse.map((block, idx) =>
      parseSingleProjectMarkdown(block, `du-an-nhap-${idx + 1}.md`, block.length)
    );

    setUploadedFiles((prev) => [...parsed, ...prev]);
    setActiveMode('files');
    setRawText('');
  };

  // Batch updates on uploaded files
  const handleApplyBatchCategory = () => {
    if (!batchCategory) return;
    setUploadedFiles((prev) =>
      prev.map((f) => (f.isSelected ? { ...f, category: batchCategory } : f))
    );
  };

  const handleApplyBatchYear = () => {
    if (!batchYear) return;
    setUploadedFiles((prev) =>
      prev.map((f) => (f.isSelected ? { ...f, year: batchYear } : f))
    );
  };

  const handleToggleSelectAll = (select: boolean) => {
    setUploadedFiles((prev) => prev.map((f) => ({ ...f, isSelected: select })));
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Save all selected projects
  const handleImportProjects = () => {
    const targetFiles = uploadedFiles.filter((f) => f.isSelected);
    if (targetFiles.length === 0) {
      alert('Vui lòng chọn ít nhất một dự án để nhập.');
      return;
    }

    const projectsToSave: Omit<Project, 'id'>[] = targetFiles.map((f) => ({
      title: f.title,
      category: f.category,
      location: f.location,
      volumeM3: f.volumeM3,
      concreteGrade: f.concreteGrade,
      pumpService: f.pumpService,
      year: f.year,
      client: f.client,
      image: f.image,
      description: f.description,
      highlights: f.highlights,
      slug: f.slug,
      permalink: f.permalink,
      date: f.date
    }));

    batchAddProjects(projectsToSave);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onSuccess) {
      onSuccess(projectsToSave.length);
    }
    onClose();
  };

  // Filtered files for display
  const filteredFiles = useMemo(() => {
    if (!searchTerm.trim()) return uploadedFiles;
    const term = searchTerm.toLowerCase();
    return uploadedFiles.filter(
      (f) =>
        f.title.toLowerCase().includes(term) ||
        f.location.toLowerCase().includes(term) ||
        f.client.toLowerCase().includes(term) ||
        f.fileName.toLowerCase().includes(term)
    );
  }, [uploadedFiles, searchTerm]);

  const selectedCount = uploadedFiles.filter((f) => f.isSelected).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Files className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Nhập Nhiều File .md Vào Hồ Sơ Dự Án
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Bulk Projects
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tự động trích xuất thông tin, khối lượng m³, mác bê tông, chủ đầu tư và hình ảnh từ file Markdown/Jekyll
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveMode('files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeMode === 'files'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
              <span>Tải Lên File .md ({uploadedFiles.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeMode === 'markdown'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Dán Nội Dung Markdown</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample9Projects}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-amber-100/90 hover:bg-amber-200/90 px-3 py-1.5 rounded-lg border border-amber-300 transition"
              title="Tải sẵn dữ liệu 9 dự án tiêu biểu tại Ninh Bình"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Nạp 9 Dự Án Ninh Bình Mẫu</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-6">
          {/* TAB 1: FILES UPLOAD & PREVIEW */}
          {activeMode === 'files' && (
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".md,.markdown,text/markdown"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-sm font-black text-slate-800">
                    Kéo thả nhiều file <span className="text-amber-600 font-mono">.md</span> vào đây, hoặc click để chọn từ máy tính
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Hỗ trợ file Markdown Jekyll dự án, trích xuất tự động: Tên công trình, mác bê tông, khối lượng, xe bơm, chủ đầu tư
                  </div>
                </div>

                {isReadingFiles && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang đọc và phân tích cấu trúc file...</span>
                  </div>
                )}
              </div>

              {/* Action Bar when files are loaded */}
              {uploadedFiles.length > 0 && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span>Đã nạp {uploadedFiles.length} file</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-700 font-extrabold">
                      Đã chọn {selectedCount} / {uploadedFiles.length}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handleToggleSelectAll(true)}
                        className="text-amber-600 hover:underline text-[11px]"
                      >
                        Chọn tất cả
                      </button>
                      <span className="text-slate-300">/</span>
                      <button
                        onClick={() => handleToggleSelectAll(false)}
                        className="text-slate-500 hover:underline text-[11px]"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>

                  {/* Batch Tools */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category quick assign */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={batchCategory}
                        onChange={(e) => setBatchCategory(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
                      >
                        <option value="">Gán Hạng Mục Hàng Loạt</option>
                        {DEFAULT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleApplyBatchCategory}
                        disabled={!batchCategory}
                        className="bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 px-2.5 py-1.5 rounded-lg font-bold"
                      >
                        Áp dụng
                      </button>
                    </div>

                    {/* Search input */}
                    <input
                      type="text"
                      placeholder="Tìm theo tên/địa điểm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 w-44"
                    />

                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                      title="Xóa danh sách đang chờ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Table Preview */}
              {uploadedFiles.length > 0 ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto max-h-[420px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={uploadedFiles.length > 0 && selectedCount === uploadedFiles.length}
                              onChange={(e) => handleToggleSelectAll(e.target.checked)}
                              className="rounded text-amber-600 focus:ring-amber-500"
                            />
                          </th>
                          <th className="p-3">Tên Dự Án / File</th>
                          <th className="p-3">Hạng Mục</th>
                          <th className="p-3">Địa Điểm</th>
                          <th className="p-3 text-right">Khối Lượng</th>
                          <th className="p-3">Mác & Bơm</th>
                          <th className="p-3">Chủ Đầu Tư</th>
                          <th className="p-3 text-center">Năm</th>
                          <th className="p-3 text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFiles.map((file) => (
                          <tr
                            key={file.id}
                            className={`hover:bg-amber-50/40 transition ${
                              file.isSelected ? 'bg-amber-50/20' : 'opacity-60 bg-slate-50/30'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={file.isSelected}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, isSelected: checked } : f))
                                  );
                                }}
                                className="rounded text-amber-600 focus:ring-amber-500"
                              />
                            </td>

                            {/* Title & File Info */}
                            <td className="p-3 min-w-[220px]">
                              <input
                                type="text"
                                value={file.title}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, title: v } : f))
                                  );
                                }}
                                className="font-bold text-slate-900 w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400 focus:outline-hidden"
                              />
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1.5 mt-0.5">
                                <span className="font-mono">{file.fileName}</span>
                                <span>({file.fileSize})</span>
                                {file.image && (
                                  <span className="text-blue-600 truncate max-w-[120px]" title={file.image}>
                                    • {file.image.split('/').pop()}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Category Select */}
                            <td className="p-3 min-w-[140px]">
                              <select
                                value={file.category}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, category: v } : f))
                                  );
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium"
                              >
                                {DEFAULT_CATEGORIES.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Location */}
                            <td className="p-3 min-w-[160px]">
                              <input
                                type="text"
                                value={file.location}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, location: v } : f))
                                  );
                                }}
                                className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400 text-slate-700 text-xs"
                              />
                            </td>

                            {/* Volume m3 */}
                            <td className="p-3 text-right min-w-[100px]">
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  value={file.volumeM3}
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value) || 0;
                                    setUploadedFiles((prev) =>
                                      prev.map((f) => (f.id === file.id ? { ...f, volumeM3: v } : f))
                                    );
                                  }}
                                  className="w-20 text-right font-black text-slate-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400"
                                />
                                <span className="text-slate-400 font-bold text-[11px]">m³</span>
                              </div>
                            </td>

                            {/* Grade & Pump */}
                            <td className="p-3 min-w-[160px]">
                              <input
                                type="text"
                                value={file.concreteGrade}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, concreteGrade: v } : f))
                                  );
                                }}
                                placeholder="Mác bê tông"
                                className="font-semibold text-slate-900 w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400 text-xs"
                              />
                              <input
                                type="text"
                                value={file.pumpService}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, pumpService: v } : f))
                                  );
                                }}
                                placeholder="Thiết bị bơm"
                                className="text-[11px] text-slate-500 w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400"
                              />
                            </td>

                            {/* Client */}
                            <td className="p-3 min-w-[160px]">
                              <input
                                type="text"
                                value={file.client}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, client: v } : f))
                                  );
                                }}
                                className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-amber-400 text-slate-700 text-xs"
                              />
                            </td>

                            {/* Year */}
                            <td className="p-3 text-center min-w-[70px]">
                              <input
                                type="number"
                                value={file.year}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value, 10) || 2024;
                                  setUploadedFiles((prev) =>
                                    prev.map((f) => (f.id === file.id ? { ...f, year: v } : f))
                                  );
                                }}
                                className="w-14 text-center font-bold text-slate-800 bg-transparent hover:bg-white focus:bg-white px-1 py-0.5 rounded border border-transparent focus:border-amber-400"
                              />
                            </td>

                            {/* Delete single */}
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveUploadedFile(file.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                title="Xóa khỏi danh sách"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-8 text-center">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    Chưa có file nào được nạp. Nhấn nút <strong className="text-slate-800 font-bold">&quot;Nạp 9 Dự Án Ninh Bình Mẫu&quot;</strong> phía trên hoặc kéo thả file .md để bắt đầu.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RAW MARKDOWN TEXT */}
          {activeMode === 'markdown' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Dán Nội Dung Markdown / YAML Frontmatter
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Bạn có thể dán 1 hoặc nhiều dự án liên tiếp (phân cách bằng khối --- YAML hoặc tiêu đề # Dự Án)
                  </p>
                </div>

                <button
                  onClick={handleLoadSample9Projects}
                  className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Dán thử 9 dự án mẫu</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`---
layout: post
title: "Dự Án Nhà Máy Điện Tử FDI - KCN Gián Khẩu"
category: "Khu công nghiệp"
location: "KCN Gián Khẩu, Gia Viễn, Ninh Bình"
volume: 18500
concreteGrade: "Mác 300, Mác 350 Sika Floor"
pumpService: "Xe Bơm Cần 52m"
year: 2024
client: "Tập Đoàn Doosan"
image: "/images/du-an/du-an-kcn-gian-khau.jpg"
---
Nội dung mô tả công trình bê tông tươi tại Ninh Bình...
- Điểm nổi bật 1
- Điểm nổi bật 2`}
                className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 focus:border-amber-400 focus:outline-hidden"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleParseRawText}
                  disabled={!rawText.trim()}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition disabled:opacity-40 shadow-xs"
                >
                  <Files className="w-4 h-4" />
                  <span>Phân Tích &amp; Chuyển Thành Dự Án</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            {selectedCount > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Sẵn sàng thêm {selectedCount} công trình vào hồ sơ năng lực website
              </span>
            ) : (
              <span className="text-slate-400">Chọn ít nhất 1 dự án để lưu vào hệ thống</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
            >
              Đóng
            </button>

            <button
              onClick={handleImportProjects}
              disabled={selectedCount === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition shadow-sm disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Nhập {selectedCount} Dự Án Vào Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
