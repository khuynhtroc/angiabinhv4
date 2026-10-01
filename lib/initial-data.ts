import { BlogPost, Project, Lead, RealtimeAnalytics, IndustryNews, JekyllConfig, IntegrationConfig, CategoryItem, SitePage, AiSettingsConfig, SiteMenu, SchemaSettings, AiSchedulerConfig, MediaFolder } from './types';

export const initialJekyllConfig: JekyllConfig = {
  title: "Bê Tông An Gia Bình - Ninh Bình",
  slogan: "Chất lượng vững bền - Đồng hành mọi công trình",
  tagline: "Chất lượng vững bền - Đồng hành mọi công trình",
  company_name: "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
  tax_id: "2700870972",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  allow_search_engine: true,
  google_verify: "",
  bing_verify: "",
  google_analytics: "G-6J50BRBSZS",
  google_tag_manager_id: "GTM-MXH8TM7H",
  google_plus: "",
  subcriber_url: "",
  email: "ketoan.angiabinh@gmail.com",
  phone: "0988 2662 93",
  address: "Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình | Trạm 2: Xã Kim Sơn, Ninh Bình",
  description: "Trạm trộn bê tông tươi, bê tông thương phẩm công nghệ cao tại Ninh Bình. Đội xe bồn, xe bơm cần 37m-56m, phòng thí nghiệm LAS nén mẫu R7, R28.",
  baseurl: "",
  url: "https://www.betongangiabinh.vn",
  twitter_username: "betongangiabinh",
  github_username: "angiabinh-concrete",
  facebook_page: "https://www.facebook.com/betongangiabinh/",
  markdown: "kramdown",
  permalink: "/:title.html",
  plugins: ["jekyll-feed", "jekyll-seo-tag", "jekyll-sitemap"],
  primaryColor: '#f59e0b',
  secondaryColor: '#0f172a',
  accentColor: '#d97706',
  fontFamily: 'sans',
  layoutWidth: 'wide',
  headerStyle: 'standard',
  headerNotice: 'Trạm Trộn Bê Tông Tươi An Gia Bình | Trạm 1: KCN Khánh Phú • Trạm 2: Kim Sơn • 35+ Xe bồn',
  showHeaderTopBar: true,
  footerStyle: 'columns',
  footerNotice: 'Thương hiệu bê tông thương phẩm hàng đầu Ninh Bình. Hệ thống 2 cụm trạm trộn tự động hóa (KCN Khánh Phú 300m³/h & xã Kim Sơn 150m³/h), 35+ xe bồn và dàn xe bơm cần vươn xa 56m.',
  footerCopyright: '© 2025 - 2026 Bê Tông An Gia Bình Ninh Bình. Bản quyền thuộc về Công ty CP TM & DV An Gia Bình.',
  sidebarPosition: 'right',
  sidebarCtaTitle: 'Khảo sát & Báo Giá Bê Tông',
  sidebarCtaPhone: '0988 2662 93',
  sidebarCtaDesc: 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Xã Kim Sơn (150m³/h) sẵn sàng điều động 35+ xe bồn, xe bơm cần 37m - 56m.',
  ctaButtonText: 'Gọi 0988 2662 93 Báo Giá 24/7',
  ctaButtonLink: 'tel:0988266293',
  ctaHeading: 'Cần Báo Giá & Khảo Sát Bê Tông Mác 200 - 450?',
  ctaSubheading: 'Trạm 1 KCN Khánh Phú (300m³/h) & Trạm 2 Kim Sơn (150m³/h) sẵn sàng phục vụ 24/7.',
};

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Bảng Báo Giá Bê Tông Tươi Ninh Bình Mới Nhất 2025 - 2026",
    slug: "bang-bao-gia-be-tong-tuoi-ninh-binh-moi-nhat",
    excerpt: "Cập nhật bảng giá bê tông thương phẩm mác 200, 250, 300, 350 và giá thuê ca bơm cần, bơm tĩnh tại Ninh Bình do trạm trộn An Gia Bình cung ứng.",
    author: "Kỹ Sư Trần Văn Hưng (Giám Đốc Kỹ Thuật An Gia Bình)",
    date: "2025-05-18",
    category: "Tin Tức",
    tags: ["báo giá bê tông ninh bình", "bê tông tươi", "mác 250", "mác 300", "xe bơm bê tông"],
    views: 4820,
    readTime: "5 phút",
    coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Báo Giá Bê Tông Tươi Ninh Bình 2025 Mới Nhất | An Gia Bình",
    seoDescription: "Báo giá bê tông tươi Ninh Bình từ mác 150 đến 450 (tham khảo). Cân điện tử chuẩn mác, đủ khối lượng, xe bồn giao tận chân công trình tại TP Ninh Bình, Tam Điệp, Hoa Lư, Gia Viễn.",
    focusKeywords: ["bê tông tươi ninh bình", "giá bê tông tươi ninh bình", "bê tông an gia bình"],
    isPublished: true,
    content: `## 1. Giới Thiệu Tổng Quan Thị Trường Bê Tông Tươi Ninh Bình

Ninh Bình là một trong những trung tâm phát triển hạ tầng và công nghiệp trọng điểm của khu vực Đồng bằng sông Hồng. Với sự mở rộng của các khu công nghiệp như KCN Khánh Phú, KCN Tam Điệp, KCN Gián Khẩu cùng hàng loạt dự án giao thông, khu đô thị và nhà xưởng, nhu cầu sử dụng **bê tông thương phẩm (bê tông tươi)** ngày càng tăng cao.

![Bê tông thương phẩm An Gia Bình]({{ site.url }}/images/blog/be-tong-thuong-pham-an-gia-binh.jpg)

Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình (MST: 2700870972) là đơn vị ứng dụng cụm trạm trộn tự động hóa (Trạm 1 KCN Khánh Phú 300m³/h & Trạm 2 Kim Sơn 150m³/h), cung cấp giải pháp bê tông tươi đúng quy chuẩn kỹ thuật, định lượng chính xác và giao hàng chuẩn tiến độ.

---

## 2. Bảng Giá Bê Tông Thương Phẩm An Gia Bình (Đá 1x2, Độ sụt 12±2)

*Lưu ý: Dưới đây là mức giá tham khảo tại các trạm trộn Ninh Bình tại thời điểm hiện tại (Giá chưa bao gồm VAT và có thể thay đổi tùy cự ly vận chuyển và biến động vật liệu):*

| Mác Bê Tông | Loại Đá | Độ Sụt Tiêu Chuẩn | Đơn Giá Tham Khảo (VNĐ/m³) | Ứng Dụng Khuyến Nghị |
| :--- | :--- | :--- | :--- | :--- |
| **Mác 150 (M150)** | Đá 1x2 | 12±2 cm | **850.000 - 890.000** | Lót móng, sân phụ, nền chống thấm nhẹ |
| **Mác 200 (M200)** | Đá 1x2 | 12±2 cm | **920.000 - 960.000** | Nền nhà dân dụng, sân thượng, đường ngõ |
| **Mác 250 (M250)** | Đá 1x2 | 12±2 cm | **980.000 - 1.030.000** | Móng, dầm, cột, sàn nhà phố 2-4 tầng |
| **Mác 300 (M300)** | Đá 1x2 | 12±2 cm | **1.050.000 - 1.110.000** | Biệt thự, nhà xưởng công nghiệp, dầm vượt nhịp |
| **Mác 350 (M350)** | Đá 1x2 | 12±2 cm | **1.120.000 - 1.190.000** | Cột tải trọng lớn, bể bơi, tầng hầm chống thấm |
| **Mác 400 (M400)** | Đá 1x2 | 12±2 cm | **1.210.000 - 1.280.000** | Trụ cầu, đài cọc khoan nhồi, kết cấu dự ứng lực |

> **Lưu ý:**
> - Mọi bảng giá đều mang tính chất tham khảo tại thời điểm hiện tại.
> - Nếu công trình sử dụng phụ gia chống thấm (B6, B8, B10, B12), cộng thêm từ 30.000 - 60.000 VNĐ/m³.
> - Phụ gia đông kết nhanh R7 (đạt cường độ sau 7 ngày): cộng thêm 40.000 VNĐ/m³.
> - Phụ gia đông kết nhanh R3: liên hệ kỹ thuật để phối trộn theo yêu cầu dự án.

---

## 3. Bảng Giá Dịch Vụ Xe Bơm Bê Tông Ninh Bình

Bên cạnh xe bồn vận chuyển 10m³ - 12m³, Bê Tông An Gia Bình sở hữu dàn xe bơm cần vươn xa từ 37m đến 56m và máy bơm tĩnh áp lực cao:

- **Bơm cần 37m - 43m:** Phù hợp nhà phố, công trình dân dụng dưới 5 tầng. Đơn giá tham khảo: 2.800.000 - 3.500.000 VNĐ/ca (dưới 40m³) hoặc 65.000 - 75.000 VNĐ/m³.
- **Bơm cần dài 52m - 56m:** Phù hợp sàn xưởng diện tích lớn, cầu cống, công trình cao tầng. Đơn giá tham khảo: thỏa thuận theo khối lượng.
- **Bơm tĩnh đường dài (ống dài đến 200m):** Dành cho công trình trong ngõ hẻm sâu hoặc tầng hầm xe bồn không thể tiếp cận trực tiếp.

---

## 4. Tại Sao Khách Hàng Tại Ninh Bình Lựa Chọn An Gia Bình?

1. **Cân đong chuẩn xác:** Hệ thống cân điện tử định lượng tự động sai số < 1%.
2. **Kẹp chì niêm phong xe bồn:** Đảm bảo bê tông từ trạm trộn đến chân công trình giữ nguyên tỷ lệ cấp phối, không pha nước ngoài trạm.
3. **Đầy đủ mẫu thử kiểm định:** Kỹ thuật viên đúc mẫu R7, R28 ngay tại hiện trường dưới sự chứng kiến của chủ nhà hoặc tư vấn giám sát.
4. **Hệ thống xe bồn 35+ chiếc:** Luân chuyển liên tục, hạn chế tối đa nguy cơ nứt giáp mối do ngắt quãng.
`
  },
  {
    id: "post-2",
    title: "Cách Chọn Mác Bê Tông Phù Hợp Cho Móng, Cột, Dầm Và Sàn Nhà Dân Dụng",
    slug: "cach-chon-mac-be-tong-phu-hop-mong-cot-dam-san",
    excerpt: "Hướng dẫn chi tiết từ kỹ sư An Gia Bình giúp chủ nhà và thầu thợ lựa chọn mác bê tông tối ưu chi phí, đảm bảo độ bền kết cấu trên 50 năm.",
    author: "Kỹ Sư Lê Hoàng Nam (Chuyên Gia Kết Cấu)",
    date: "2025-05-12",
    category: "Kinh Nghiệm",
    tags: ["mác bê tông", "kỹ thuật thi công", "đổ bê tông móng", "bê tông sàn", "ninh bình"],
    views: 3410,
    readTime: "6 phút",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Cách Chọn Mác Bê Tông Móng Cột Dầm Sàn Chuẩn Kỹ Thuật | An Gia Bình",
    seoDescription: "Chuyên gia Bê tông An Gia Bình tư vấn cách chọn mác bê tông 200, 250, 300 cho từng hạng mục móng, cột, dầm, sàn nhà dân dụng và biệt thự tại Ninh Bình.",
    focusKeywords: ["chọn mác bê tông", "mác bê tông sàn", "bê tông an gia bình"],
    isPublished: true,
    content: `## 1. Mác Bê Tông Là Gì? Ý Nghĩa Ký Hiệu M200, M250, M300

Mác bê tông (ký hiệu chữ M) biểu thị cường độ chịu nén của mẫu bê tông hình lập phương kích thước 15x15x15 cm được dưỡng hộ trong điều kiện tiêu chuẩn sau 28 ngày, đơn vị tính là kg/cm².

Ví dụ:
- **Bê tông Mác 250:** Có khả năng chịu ứng suất nén phá hủy là 250 kg/cm² (tương đương cấp độ bền B20).
- **Bê tông Mác 300:** Có khả năng chịu ứng suất nén phá hủy là 300 kg/cm² (tương đương cấp độ bền B22.5).

---

## 2. Tiêu Chí Chọn Mác Cho Từng Hạng Mục Công Trình

### 2.1. Đổ bê tông lót móng
- **Khuyến nghị:** Mác 100 hoặc Mác 150.
- **Mục đích:** Tạo mặt bằng sạch sẽ, phẳng phiu, ngăn chặn đất nền hút nước xi măng từ bê tông móng chính.

### 2.2. Đổ bê tông đài móng, giằng móng
- **Nhà 1 - 3 tầng:** Nên chọn **Mác 250**.
- **Nhà từ 4 tầng trở lên hoặc biệt thự có tầng hầm:** Chọn **Mác 300** có kết hợp phụ gia chống thấm B6 hoặc B8.

### 2.3. Đổ bê tông cột, vách chịu lực
- Cột là cấu kiện chịu nén uốn trực tiếp truyền tải trọng từ toàn bộ ngôi nhà xuống nền móng.
- Khuyến nghị dùng **Mác 250 hoặc Mác 300**. Đối với cột tiết diện hẹp hoặc cốt thép dày, nên yêu cầu trạm trộn An Gia Bình tăng độ sụt lên 14±2 hoặc dùng đá 1x1 để bê tông luồn lách đều, tránh rỗ chân cột.

### 2.4. Đổ dầm và sàn mái
- **Sàn tầng trung gian:** Mác 250 là lựa chọn kinh tế và an toàn nhất.
- **Sàn mái (sân thượng):** Thường xuyên chịu tác động nắng gắt, mưa rào gây co ngót nhiệt. Nên sử dụng **Mác 300** và bắt buộc dùng phụ gia chống thấm kèm bảo dưỡng phủ bạt giữ ẩm ngay sau khi cào cán mặt.
`
  },
  {
    id: "post-3",
    title: "Quy Trình Bảo Dưỡng Bê Tông Thương Phẩm Đúng Chuẩn TCVN Tránh Nứt Mặt",
    slug: "quy-trinh-bao-duong-be-tong-dung-chuan-tcvn-tranh-nut",
    excerpt: "90% hiện tượng rạn nứt chân chim trên mặt sàn sau khi đổ bê tông bắt nguồn từ khâu bảo dưỡng. Xem ngay cẩm nang bảo dưỡng từ Bê Tông An Gia Bình.",
    author: "Bộ Phận QA/QC An Gia Bình",
    date: "2025-05-02",
    category: "Kinh Nghiệm",
    tags: ["bảo dưỡng bê tông", "chống nứt sàn", "tcvn", "bê tông an gia bình"],
    views: 2950,
    readTime: "4 phút",
    coverImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Quy Trình Bảo Dưỡng Bê Tông Chuẩn TCVN Tránh Nứt | An Gia Bình",
    seoDescription: "Hướng dẫn chi tiết cách tưới nước, phủ nilon, ngâm nước bảo dưỡng bê tông thương phẩm trong 7 ngày đầu để đạt mác tối đa và triệt tiêu nứt mặt.",
    focusKeywords: ["bảo dưỡng bê tông", "chống nứt sàn bê tông"],
    isPublished: true,
    content: `## Vì Sao Phải Bảo Dưỡng Bê Tông Ngay Sau Khi Đổ?

Bê tông phát triển cường độ nhờ phản ứng thủy hóa giữa xi măng và nước. Quá trình này sinh nhiệt rất lớn. Nếu bề mặt bê tông bị mất nước nhanh do gió khô hoặc nắng gắt, thể tích co ngót đột ngột sẽ gây ra các vết nứt chân chim.

---

## 3 Giai Đoạn Bảo Dưỡng Vàng

### Giai đoạn 1: Bảo dưỡng ban đầu (4 - 6 giờ sau khi xoa mặt)
- Sau khi cán mặt và bê tông bắt đầu ninh kết (sờ tay không lún sâu), phủ ngay lớp nilon mỏng hoặc bao bố ướt để chống bốc hơi nước mặt.
- Tuyệt đối không tưới nước trực tiếp vòi mạnh lúc này vì sẽ làm tróc lớp vữa mặt.

### Giai đoạn 2: Bảo dưỡng tiếp theo (từ ngày thứ 2 đến ngày thứ 7)
- Tưới phun sương giữ ẩm liên tục. Với sàn mái, có thể đắp be quanh mép sàn rồi bơm nước ngập 2 - 3cm để ngâm nước bảo dưỡng.
- Thời gian tưới: Ban ngày cứ 2 - 3 giờ tưới 1 lần, ban đêm tưới ít nhất 1 lần.

### Giai đoạn 3: Bảo dưỡng sau 7 ngày
- Duy trì tưới ẩm ngày 2 lần sáng sớm và chiều mát cho đến ngày thứ 14.
`
  },
  {
    id: "post-4",
    title: "Tiêu Chuẩn Nén Mẫu Bê Tông R7, R28 Theo TCVN 3105 & TCVN 3118",
    slug: "tieu-chuan-nen-mau-be-tong-r7-r28-tcvn-3105-3118",
    excerpt: "Tìm hiểu quy trình đúc mẫu tại trạm trộn An Gia Bình, phòng thí nghiệm LAS-XD và cách đọc phiếu nén mẫu R7, R28 để nghiệm thu công trình.",
    author: "Phòng Kiểm Định Chất Lượng LAS An Gia Bình",
    date: "2025-04-20",
    category: "Kiến Thức",
    tags: ["nén mẫu bê tông", "tiêu chuẩn r7 r28", "tcvn 3118", "las ninh bình"],
    views: 1980,
    readTime: "7 phút",
    coverImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Quy Chuẩn Nén Mẫu Bê Tông R7 R28 Mới Nhất | Bê Tông An Gia Bình",
    seoDescription: "Quy định lấy mẫu, ép nén cường độ bê tông R7, R28 theo TCVN 3118. Hồ sơ nghiệm thu chất lượng bê tông thương phẩm An Gia Bình Ninh Bình.",
    focusKeywords: ["nén mẫu r7 r28", "tiêu chuẩn bê tông", "kiểm định las ninh bình"],
    isPublished: true,
    content: `## Tiêu Chuẩn Nén Mẫu R7 Và R28 Là Gì?

Trong thi công xây dựng, để xác định chất lượng bê tông có đạt mác thiết kế hay không, các tổ mẫu (mỗi tổ 3 viên lập phương 15x15x15cm) sẽ được lấy trực tiếp tại trạm hoặc tại máng xả xe bồn ở công trường.

- **Mẫu R7:** Nén sau 7 ngày dưỡng hộ chuẩn. Cường độ thông thường đạt từ **70% - 85%** mác thiết kế 28 ngày (đối với xi măng PC40 / PCB40 tiêu chuẩn).
- **Mẫu R28:** Nén sau 28 ngày dưỡng hộ. Đây là giá trị pháp lý chính thức để nghiệm thu kết cấu bê tông cốt thép theo TCVN 3118:1993.
`
  },
  {
    id: "post-5",
    title: "An Gia Bình Đưa Cụm Trạm Trộn Tự Động Hóa 300m³/h Vào Hoạt Động Tại KCN Khánh Phú",
    slug: "an-gia-binh-dua-cum-tram-tron-tu-dong-hoa-300m3-gio-kcn-khanh-phu",
    excerpt: "Nâng cao năng lực cung ứng phục vụ đồng loạt các dự án trọng điểm tại Ninh Bình với công nghệ cân định lượng điện tử nhập khẩu từ Châu Âu.",
    author: "Ban Truyền Thông An Gia Bình",
    date: "2025-06-01",
    category: "Tin Tức",
    tags: ["tin tức an gia bình", "trạm trộn kcn khánh phú", "bê tông ninh bình"],
    views: 3120,
    readTime: "4 phút",
    coverImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Cụm Trạm Trộn Tự Động 300m3/h An Gia Bình Đi Vào Hoạt Động | Bê Tông Ninh Bình",
    seoDescription: "An Gia Bình khánh thành cụm trạm trộn tự động 300m3/h tại KCN Khánh Phú Ninh Bình, đảm bảo cấp bê tông liên tục không gián đoạn cho các đại dự án hạ tầng.",
    focusKeywords: ["trạm trộn bê tông khánh phú", "an gia bình ninh bình"],
    isPublished: true,
    content: `## 1. Nâng Tầm Năng Lực Sản Xuất Bê Tông Tươi Ninh Bình

Nhằm đáp ứng nhu cầu xây dựng hạ tầng công nghiệp và đô thị ngày càng cao tại tỉnh Ninh Bình và các vùng lân cận, Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình chính thức đưa cụm trạm trộn bê tông thương phẩm tự động hóa công suất 300m³/h tại KCN Khánh Phú vào vận hành thương mại.

Cụm trạm được trang bị hệ thống cối trộn cưỡng bức hai trục xoắn thế hệ mới, silo xi măng dung tích lớn cùng hệ thống cân điện tử độ nhạy cao.

---

## 2. Năng Lực Cung Ứng Chuẩn Tiến Độ

Với đội ngũ hơn 35 xe bồn chuyên dụng và các dòng xe bơm cần từ 37m đến 56m, An Gia Bình tự tin đáp ứng các gói thầu đổ liên tục từ 1.000m³ đến 3.000m³/ngày đêm mà không gây tắc nghẽn hay đứt mạch đổ.
`
  },
  {
    id: "post-6",
    title: "Cấp Phối Bê Tông Mác 200, 250, 300: Tỷ Lệ Xi Măng, Cát, Đá & Nước Chuẩn Kỹ Thuật",
    slug: "cap-phoi-be-tong-mac-200-250-300-chuan-ky-thuat",
    excerpt: "Tổng hợp bảng tra cấp phối bê tông thương phẩm chuẩn theo định mức xây dựng và tiêu chuẩn TCVN, giúp kỹ sư công trường kiểm soát chất lượng mẻ trộn.",
    author: "Kỹ Sư Trần Văn Hưng",
    date: "2025-04-15",
    category: "Kiến Thức",
    tags: ["cấp phối bê tông", "tỷ lệ xi măng cát đá", "kiến thức xây dựng"],
    views: 4150,
    readTime: "6 phút",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Bảng Tra Cấp Phối Bê Tông M200 M250 M300 Chuẩn Kỹ Thuật | An Gia Bình",
    seoDescription: "Tra cứu cấp phối bê tông mác 200, 250, 300 sử dụng xi măng PC40, PCB40, cát vàng và đá 1x2 theo TCVN. Tỷ lệ cấp phối tại trạm trộn An Gia Bình.",
    focusKeywords: ["cấp phối bê tông", "mác 250 cấp phối", "tcvn bê tông"],
    isPublished: true,
    content: `## Cấp Phối Bê Tông Là Gì?

Cấp phối bê tông là tỷ lệ phối trộn hợp lý giữa các vật liệu cấu thành: Xi măng, Cát, Đá, Nước và Phụ gia tính cho 1m³ bê tông đặc chắc.

### Bảng tra cấp phối tham khảo cho xi măng PCB40 (Đá 1x2, độ sụt 12±2):

| Mác Bê Tông | Xi măng (kg) | Cát vàng (m³) | Đá 1x2 (m³) | Nước (lít) | Phụ gia giảm nước |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mác 200** | 305 | 0.48 | 0.88 | 185 | 1.8 lit |
| **Mác 250** | 350 | 0.46 | 0.86 | 185 | 2.2 lit |
| **Mác 300** | 395 | 0.44 | 0.85 | 180 | 2.5 lit |
| **Mác 350** | 440 | 0.42 | 0.84 | 175 | 3.0 lit |

Kiểm soát cấp phối bằng hệ thống cân điện tử tự động tại trạm là yếu tố quyết định giúp bê tông không bị bọt khí, không bị phân tầng và luôn đạt mác nghiệm thu R28.
`
  },
  {
    id: "post-nguon-goc-be-tong-thuong-pham",
    title: "Nguồn Gốc Xuất Xứ Bê Tông Thương Phẩm",
    slug: "nguon-goc-be-tong-thuong-pham",
    excerpt: "Khám phá lịch sử hình thành, nguồn gốc xuất xứ và quy trình chuẩn hóa bê tông thương phẩm từ thời La Mã cổ đại đến công nghệ trạm trộn bê tông tươi tự động hiện đại ngày nay.",
    author: "Kỹ Sư Kết Cấu - Bê Tông An Gia Bình",
    date: "2025-06-10",
    category: "Kiến Thức Kỹ Thuật",
    tags: ["nguồn gốc bê tông", "bê tông thương phẩm", "lịch sử bê tông", "kiến thức xây dựng", "bê tông ninh bình"],
    views: 3620,
    readTime: "7 phút",
    coverImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Nguồn Gốc Xuất Xứ Bê Tông Thương Phẩm | Lịch Sử & Tiêu Chuẩn Hiện Đại",
    seoDescription: "Tìm hiểu nguồn gốc xuất xứ bê tông thương phẩm, sự ra đời của bê tông trộn sẵn (Ready-Mix Concrete) và tiêu chuẩn chất lượng tại trạm trộn Bê Tông An Gia Bình Ninh Bình.",
    focusKeywords: ["nguồn gốc bê tông thương phẩm", "bê tông thương phẩm", "bê tông tươi an gia bình"],
    isPublished: true,
    content: `## 1. Nguồn Gốc Sơ Khai Của Bê Tông Trong Lịch Sử

Bê tông không phải là phát minh mới của thế kỷ 20 mà đã có lịch sử hàng ngàn năm. Từ thời La Mã cổ đại (khoảng năm 300 TCN), người La Mã đã biết trộn tro núi lửa Pozzolana với vôi sống, nước và đá vụn để tạo nên loại chất kết dính siêu bền vững. Đền Pantheon tại Rome với mái vòm bê tông không cốt thép lớn nhất thế giới sau hơn 2.000 năm vẫn đứng vững là minh chứng hùng hồn cho sức mạnh của vật liệu này.

---

## 2. Sự Ra Đời Của Xi Măng Portland Và Bê Tông Cốt Thép

- **Năm 1824:** Nhà phát minh người Anh Joseph Aspdin được cấp bằng sáng chế cho **xi măng Portland** – bước ngoặt then chốt đặt nền móng cho ngành công nghiệp bê tông hiện đại.
- **Giữa thế kỷ 19:** Kỹ sư Joseph Monier và François Hennebique tiên phong kết hợp bê tông với cốt thép chịu lực, mở ra kỷ nguyên xây dựng các tòa nhà chọc trời, cầu vượt và hạ tầng vĩ đại.

---

## 3. Bê Tông Thương Phẩm (Ready-Mix Concrete - RMC) Được Chuẩn Hóa Ra Sao?

Bê tông trộn thủ công tại công trường thường gặp các nhược điểm chí mạng:
- Sai lệch tỷ lệ cấp phối do đong đếm bằng xẻng/thùng sơn.
- Chất lượng không đồng đều giữa các mẻ trộn.
- Bụi bặm, ô nhiễm môi trường và kéo dài thời gian thi công.

Chính vì vậy, vào đầu thế kỷ 20 tại Đức và Hoa Kỳ, **mô hình trạm trộn bê tông thương phẩm tập trung** ra đời. Bê tông được phối trộn bằng hệ thống cân định lượng điện tử khép kín, sau đó chuyển lên các **xe bồn chuyên dụng có cánh khuấy quay liên tục** để vận chuyển đến công trường mà không bị phân tầng hay đông kết sớm.

---

## 4. Quy Chuẩn Nguồn Gốc Vật Liệu Tại Trạm Trộn An Gia Bình Ninh Bình

Tại Công ty TNHH Bê Tông An Gia Bình, mọi m³ bê tông thương phẩm xuất xưởng đều có nguồn gốc xuất xứ rõ ràng, minh bạch:

1. **Xi măng:** 100% sử dụng xi măng mác cao PCB40 từ các thương hiệu uy tín hàng đầu (Xi măng Duyên Hà, The Vissai, Tam Điệp, Hoàng Thạch) có chứng chỉ xuất xưởng từng lô.
2. **Cát vàng:** Cát thạch anh tự nhiên rửa sạch, mô đun độ lớn từ 2.6 - 3.0, không lẫn tạp chất bùn sét hữu cơ.
3. **Đá xây dựng:** Đá dăm 1x2 cm sàng tuyển kỹ lưỡng từ các mỏ đá gốc vôi cứng đạt cường độ kháng nén cao tại Ninh Bình.
4. **Nước và phụ gia:** Nước ngầm tinh lọc qua hệ thống xử lý, kết hợp phụ gia hóa học thế hệ mới (Sika, Grace) giúp tăng độ sụt, giảm nước và kháng thấm vượt trội.
5. **KCS hiện trường:** Đúc mẫu nghiệm thu R7, R28 và kẹp chì niêm phong bồn xe tuyệt đối.

Quý khách hàng và các nhà thầu tại Ninh Bình có nhu cầu tìm hiểu chi tiết hoặc nhận báo giá cung ứng bê tông thương phẩm, xin vui lòng liên hệ hotline kỹ thuật: **0988 2662 93**.
`
  }
];

export const initialProjects: Project[] = [
  {
    id: "proj-thcs-thi-tran-ninh",
    title: "Dự Án Trường THCS thị trấn Ninh – Yên Khánh – Ninh Bình",
    category: "Công trình Công cộng",
    location: "Thị trấn Ninh, huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 6800,
    concreteGrade: "Mác 250, Mác 300 R28",
    pumpService: "Xe Bơm Cần 42m & Bơm Tĩnh",
    year: 2024,
    client: "BQLXD Yên Khánh (Tổng thầu: Công ty CP XD Hà Linh)",
    image: "/images/du-an/du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm mác 250 và 300 chuẩn TCVN cho khối nhà học 3 tầng, nhà hiệu bộ và khu giáo dục thể chất trường THCS thị trấn Ninh, Yên Khánh. Bê tông đảm bảo chất lượng, kiểm định nén mẫu LAS-XD đạt 100% yêu cầu thiết kế.",
    highlights: ["6.800 m³ bê tông đạt chuẩn kiểm định", "Đổ bê tông móng và sàn liên tục đúng tiến độ", "Chủ đầu tư BQLXD Yên Khánh đánh giá cao"],
    slug: "du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh",
    permalink: "/du-an/du-an-truong-tieu-hoc-thi-tran-ninh-huyen-yen-khanh/",
    date: "2024-05-20"
  },
  {
    id: "proj-nha-may-ao-cuoi",
    title: "Dự Án Công Ty TNHH May Áo Cưới Thời Trang Chuyên Nghiệp",
    category: "Khu công nghiệp",
    location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 15200,
    concreteGrade: "Mác 300 Sika Floor, Mác 350 Sàn Siêu Phẳng",
    pumpService: "Xe Bơm Cần 52m & 2 Bơm Tĩnh",
    year: 2024,
    client: "Công Ty TNHH May Áo Cưới (Tổng thầu: Công ty TNHH XD Xuân Huy)",
    image: "/images/du-an/du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm cho nhà máy may áo cưới xuất khẩu Hàn Quốc quy mô 1.000 công nhân tại KCN Khánh Phú. Bê tông sàn sử dụng phụ gia Sika Floor chống nứt, độ phẳng laser screed chuẩn mực đáp ứng dây chuyền may hiện đại.",
    highlights: ["15.200 m³ sàn nhà xưởng công nghiệp siêu phẳng", "Cung ứng trực tiếp từ Trạm trộn KCN Khánh Phú", "Bảo dưỡng ẩm liên tục chống rạn nứt bề mặt"],
    slug: "du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh",
    permalink: "/du-an/du-an-nha-may-ao-cuoi-han-quoc-kcn-khanh-phu-huyen-yen-khanh/",
    date: "2024-05-21"
  },
  {
    id: "proj-nha-xuong-chang-xin",
    title: "Dự án Nhà Xưởng Công Ty Chang Xin Việt Nam",
    category: "Khu công nghiệp",
    location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 28500,
    concreteGrade: "Mác 350 Chống Thấm B8, Mác 400 Móng Bệ Lò",
    pumpService: "Xe Bơm Cần 56m & 3 Xe Bơm Cần 45m",
    year: 2024,
    client: "Công ty TNHH Chang Xin VN (Tổng thầu: Công ty TNHH MTV ĐT & XD Hoàng Dân)",
    image: "/images/du-an/du-an-nha-may-padmac-khu-cong-nghiep-bao-minh-betongangiabinh.jpg",
    description: "Dự án nhà xưởng nấu chảy và đúc nhôm công suất 4.000 - 5.000 tấn/tháng diện tích hơn 7 ha tại KCN Khánh Phú. Cung cấp bê tông mác 350 và 400 khối lớn cho móng lò luyện nhôm, bệ máy chịu rung chấn lớn.",
    highlights: ["28.500 m³ bê tông mác cao chịu tải trọng nặng", "Đổ bê tông khối lớn móng lò kiểm soát nhiệt", "Tiến độ cấp liên tục 48 giờ không gián đoạn mạch đổ"],
    slug: "du-an-nha-xuong-cong-ty-chang-xin-viet-nam",
    permalink: "/du-an/du-an-nha-xuong-cong-ty-chang-xin-viet-nam/",
    date: "2024-05-22"
  },
  {
    id: "proj-duong-lien-xa-yen-khanh",
    title: "Dự án Đường Liên Xã Yên Khánh",
    category: "Giao thông & Hạ tầng",
    location: "Huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 18000,
    concreteGrade: "Mác 250, Mác 300 Mặt Đường Nông Thôn Mới",
    pumpService: "Xe Bồn Xả Trực Tiếp & Xe Bơm Tự Hành",
    year: 2024,
    client: "BQL Dự Án Huyện Yên Khánh (Tổng thầu: Công ty CP XD Xuân Luyện)",
    image: "/images/du-an/du-an-duong-quoc-lo-12b-betongangiabinh.jpg",
    description: "Cung cấp 18.000 m³ bê tông tươi đổ mặt đường liên xã theo tiêu chuẩn giao thông nông thôn mới nâng cao tại huyện Yên Khánh. Bê tông được cán phẳng, tạo nhám chống trơn trượt, bảo đảm độ bền vững chịu tải trọng xe tải lớn.",
    highlights: ["18.000 m³ bê tông mặt đường nông thôn mới", "Tuyến đường kiểu mẫu nông thôn mới nâng cao", "Cắt khe co giãn và tạo nhám bề mặt tiêu chuẩn"],
    slug: "du-an-duong-lien-xa-yen-khanh",
    permalink: "/du-an/du-an-duong-lien-xa-yen-khanh/",
    date: "2024-05-23"
  },
  {
    id: "proj-tieu-hoc-tran-quoc-toan",
    title: "Dự án Trường Tiểu Học Trần Quốc Toản",
    category: "Công trình Công cộng",
    location: "Thị trấn Ninh, huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 5400,
    concreteGrade: "Mác 250, Mác 300 R28",
    pumpService: "Xe Bơm Cần 37m & Bơm Tĩnh Áp Lực Cao",
    year: 2024,
    client: "BQL Dự Án Huyện Yên Khánh (Tổng thầu: Công ty CP XD Đức Quân)",
    image: "/images/du-an/du-an-truong-mam-non-xa-khanh-thanh-huyen-yen-khanh-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm xây dựng dãy nhà học 3 tầng kiên cố và khuôn viên trường Tiểu học Trần Quốc Toản. Đạt chuẩn quốc gia mức độ 2, toàn bộ mẫu nén R28 kiểm định LAS-XD đều vượt chỉ tiêu thiết kế.",
    highlights: ["5.400 m³ bê tông mác 250 - 300 chuẩn TCVN", "Đảm bảo an toàn tuyệt đối trong khu dân cư", "Tiến độ hoàn thành trước thềm năm học mới"],
    slug: "du-an-truong-tieu-hoc-tran-quoc-toan",
    permalink: "/du-an/du-an-truong-tieu-hoc-tran-quoc-toan/",
    date: "2024-05-24"
  },
  {
    id: "proj-phan-bon-binh-dien",
    title: "Dự Án Nhà máy sản xuất phân bón NPK Bình Điền – Ninh Bình",
    category: "Khu công nghiệp",
    location: "KCN Khánh Phú, huyện Yên Khánh, tỉnh Ninh Bình",
    volumeM3: 32000,
    concreteGrade: "Mác 300, Mác 350 Kháng Sunfat & Chống Thấm B10",
    pumpService: "Cụm Xe Bơm Cần 52m & Bơm Phễu Công Suất Lớn",
    year: 2024,
    client: "Công ty CP Bình Điền - Ninh Bình (Tổng thầu: Liên danh CP ĐT & XD Định Tân – Đại Dũng & Đông Đô)",
    image: "/images/du-an/du-an-nha-may-phan-lan-binh-dien-ninh-binh-betongangiabinh.jpg",
    description: "Dự án tổng mức đầu tư 495 tỷ đồng, công suất 400.000 tấn/năm trên diện tích gần 8 ha tại KCN Khánh Phú. Bê tông An Gia Bình cung cấp cấp phối đặc biệt kháng sunfat, chống ăn mòn hóa chất cho kho chứa nguyên liệu và móng silo phối trộn phân bón.",
    highlights: ["32.000 m³ bê tông kháng ăn mòn hóa chất và sunfat", "Thi công móng sâu và sàn kho chứa tải trọng lớn", "Kiểm định chất lượng nghiêm ngặt bởi tổng thầu Đại Dũng - Đông Đô"],
    slug: "du-an-nha-may-san-xuat-phan-bon-npk-binh-dien-ninh-binh",
    permalink: "/du-an/du-an-nha-may-san-xuat-phan-bon-npk-binh-dien-ninh-binh/",
    date: "2024-05-25"
  },
  {
    id: "proj-cao-toc-ninh-binh-thanh-hoa",
    title: "Dự Án Đường cao tốc Ninh Bình - Thanh Hóa",
    category: "Giao thông & Hạ tầng",
    location: "Xã Cao Mồ & Xã Mai Sơn, Huyện Yên Mô, Tỉnh Ninh Bình",
    volumeM3: 45000,
    concreteGrade: "Mác 350, Mác 400 Cọc Khoan Nhồi, Dầm Cầu Chữ I & Mác 450",
    pumpService: "Dàn Xe Bơm Cần 56m & Bơm Tĩnh Siêu Cao Áp",
    year: 2024,
    client: "Ban QLDA Thăng Long - Bộ GTVT (Tổng thầu: Liên danh Công ty CP ĐT Vĩnh Thịnh & Doanh Nghiệp Xuân Trường)",
    image: "/images/du-an/du-an-duong-cao-toc-ninh-binh-cai-dong-thinh-betongangiabinh-2.jpg",
    description: "Cung ứng 45.000 m³ bê tông cường độ cao cho các gói thầu xây dựng cầu vượt nút giao Mai Sơn, cống hộp dân sinh và cọc khoan nhồi thuộc tuyến cao tốc huyết mạch Bắc - Nam đoạn Mai Sơn - Quốc Lộ 45 qua địa phận tỉnh Ninh Bình.",
    highlights: ["45.000 m³ phục vụ hạ tầng cao tốc huyết mạch quốc gia", "100% tổ mẫu nén đạt và vượt cường độ thiết kế", "Cung cấp ngày đêm xuyên lễ tết giữ vững tiến độ"],
    slug: "du-an-duong-cao-toc-ninh-binh-thanh-hoa",
    permalink: "/du-an/du-an-duong-cao-toc-ninh-binh-thanh-hoa/",
    date: "2024-05-25"
  },
  {
    id: "proj-nha-may-mcnex",
    title: "Dự Án Nhà máy MCNEX VINA",
    category: "Khu công nghiệp",
    location: "KCN Phúc Sơn, TP. Ninh Bình, Tỉnh Ninh Bình",
    volumeM3: 22000,
    concreteGrade: "Mác 300, Mác 350 Chống Rung Động Phòng Sạch",
    pumpService: "2 Xe Bơm Cần 52m & 2 Bơm Tĩnh",
    year: 2024,
    client: "Công ty MCNEX (Tổng thầu: Công ty TNHH XD Công Hà)",
    image: "/images/du-an/du-an-nha-may-MCNEX-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm xây dựng mở rộng nhà máy linh kiện camera module điện thoại và ô tô MCNEX VINA tại KCN Phúc Sơn. Sàn xưởng yêu cầu độ phẳng laser tuyệt đối và khả năng chống rung chấn cao để lắp đặt dàn máy SMT chính xác.",
    highlights: ["22.000 m³ sàn phòng sạch công nghệ cao", "Đảm bảo độ phẳng tuyệt đối cho robot lắp ráp linh kiện", "Tổng thầu Công Hà khen ngợi tiến độ xuất sắc"],
    slug: "du-an-nha-may-mcnex",
    permalink: "/du-an/du-an-nha-may-mcnex/",
    date: "2024-05-27"
  },
  {
    id: "proj-nha-may-vietenergy",
    title: "Dự án Nhà máy VIETENERGY",
    category: "Khu công nghiệp",
    location: "KCN Phúc Sơn, TP. Ninh Bình, Tỉnh Ninh Bình",
    volumeM3: 16500,
    concreteGrade: "Mác 350 R7, Mác 400 Bệ Đỡ Máy Phát Điện 1400KVA",
    pumpService: "Xe Bơm Cần 48m & Bơm Tĩnh Áp Lực Cao",
    year: 2024,
    client: "Công ty TNHH Vienergy (Tổng thầu: Công ty CP Xây Dựng Hợp Lực)",
    image: "/images/du-an/du-an-nha-may-vienergi-betongangiabinh.jpg",
    description: "Cung ứng 16.500 m³ bê tông thương phẩm mác cao, đặc biệt cho khối bệ máy 2 tổ máy phát điện công suất lớn 1400KVA và móng trạm biến áp của nhà máy sản xuất giày xuất khẩu Vienergy tại KCN Phúc Sơn. Kết cấu móng khối lớn được kiểm soát nhiệt độ chống nứt chặt chẽ.",
    highlights: ["16.500 m³ móng khối lớn không nứt nhiệt", "Bệ đỡ 2 tổ máy phát điện 1400KVA vững chắc", "Hợp tác thành công cùng tổng thầu xây dựng Hợp Lực"],
    slug: "du-an-nha-may-vietenergy",
    permalink: "/du-an/du-an-nha-may-vietenergy/",
    date: "2024-05-28"
  },
  {
    id: "proj-cang-xang-dau-ha-anh",
    title: "Dự Án Cảng Xăng Dầu Hà Anh – Ninh Bình",
    category: "Công trình Công cộng",
    location: "Sông Đáy, TP. Ninh Bình",
    volumeM3: 14500,
    concreteGrade: "Mác 350 Kháng Sunfat, B10",
    pumpService: "Xe Bơm Cần 48m & Bơm Tĩnh Thủy Lực",
    year: 2024,
    client: "Công Ty TNHH MTV Xăng Dầu Hà Anh",
    image: "/images/du-an/du-an-cang-xang-dau-ha-anh-ninh-binh-betongangiabinh.jpg",
    description: "Cung cấp 14.500 m³ bê tông thương phẩm mác cao kháng xâm thực nước ngầm và hóa chất cho bến rót xăng dầu, kè cảng thủy và hệ thống móng cụm bồn chứa xăng dầu 25.000m³.",
    highlights: ["14.500 m³ bê tông chống ăn mòn đặc chủng", "Móng cụm bồn bể tải trọng siêu nặng", "Nghiệm thu R28 đạt 118% mác thiết kế"],
    slug: "du-an-cang-xang-dau-ha-anh-ninh-binh",
    permalink: "/du-an/du-an-cang-xang-dau-ha-anh-ninh-binh/",
    date: "2024-05-29"
  },
  {
    id: "proj-duong-dien-110kv-kim-son",
    title: "Dự Án Tuyến Đường Điện 110kV Huyện Kim Sơn",
    category: "Giao thông & Hạ tầng",
    location: "Huyện Kim Sơn, Tỉnh Ninh Bình",
    volumeM3: 11200,
    concreteGrade: "Mác 300, Mác 350 Chống Thấm B8",
    pumpService: "Xe Bơm Cần 42m & Bơm Tĩnh Vượt Địa Hình Trũng",
    year: 2024,
    client: "Công Ty Điện Lực Ninh Bình (EVN Ninh Bình)",
    image: "/images/du-an/du-an-duong-dien-110kv-huyen-kim-son-betongangiabinh.jpg",
    description: "Cung ứng bê tông móng trụ điện cao thế 110kV vượt qua địa hình trũng ven biển huyện Kim Sơn. Sử dụng phụ gia chống ăn mòn nước lợ và bảo dưỡng dưỡng hộ đặc biệt cho móng cọc đài cao.",
    highlights: ["11.200 m³ móng trụ điện cao thế bền vững", "Chống ăn mòn muối biển vùng duyên hải Kim Sơn", "Vận chuyển bồn chuyên dụng đến các điểm đầm lầy khó tiếp cận"],
    slug: "du-an-duong-dien-110kv-huyen-kim-son",
    permalink: "/du-an/du-an-duong-dien-110kv-huyen-kim-son/",
    date: "2024-05-30"
  },
  {
    id: "proj-duong-phu-son-nho-quan",
    title: "Dự Án Tuyến Đường Phú Sơn Huyện Nho Quan",
    category: "Giao thông & Hạ tầng",
    location: "Xã Phú Sơn, Huyện Nho Quan, Tỉnh Ninh Bình",
    volumeM3: 16800,
    concreteGrade: "Mác 250, Mác 300 Mặt Đường Miền Núi",
    pumpService: "Xe Bồn Đổ Trực Tiếp & Xe Bơm Tự Hành",
    year: 2024,
    client: "UBND Huyện Nho Quan",
    image: "/images/du-an/du-an-duong-phu-son-huyen-nho-quan-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm mở rộng nâng cấp tuyến đường liên xã Phú Sơn miền núi Nho Quan. Bê tông có phụ gia tăng độ dẻo, cán phẳng tạo nhám chống trơn trượt trên dốc quanh co.",
    highlights: ["16.800 m³ mặt đường bê tông liên vùng", "Tạo rãnh nhám chống trượt trên cung đường đèo dốc", "Góp phần hoàn thành tiêu chí Nông thôn mới huyện Nho Quan"],
    slug: "du-an-duong-phu-son-huyen-nho-quan",
    permalink: "/du-an/du-an-duong-phu-son-huyen-nho-quan/",
    date: "2024-05-31"
  },
  {
    id: "proj-duong-tran-quan-khai",
    title: "Dự Án Tuyến Đường Trần Quang Khải TP. Ninh Bình",
    category: "Giao thông & Hạ tầng",
    location: "Phường Ninh Sơn, TP. Ninh Bình",
    volumeM3: 8900,
    concreteGrade: "Mác 250, Mác 300 R28",
    pumpService: "Xe Bơm Cần 37m & Xe Bồn 10m³ Nhỏ Gọn",
    year: 2024,
    client: "BQLDA Đầu Tư Xây Dựng TP. Ninh Bình",
    image: "/images/du-an/du-an-duong-tran-quan-khai-thanh-pho-ninh-binh-betongangiabinh.jpg",
    description: "Cung cấp bê tông hoàn thiện tuyến đường đô thị Trần Quang Khải. Thi công trong khu dân cư đông đúc, điều phối xe bồn linh hoạt giảm thiểu tiếng ồn và đảm bảo vệ sinh môi trường đô thị.",
    highlights: ["8.900 m³ hạ tầng giao thông đô thị văn minh", "Xe bồn kẹp chì niêm phong đảm bảo cấp phối sạch", "Hoàn thành trước kỳ hạn chỉnh trang đô thị 20 ngày"],
    slug: "du-an-duong-tran-quan-khai-thanh-pho-ninh-binh",
    permalink: "/du-an/du-an-duong-tran-quan-khai-thanh-pho-ninh-binh/",
    date: "2024-06-01"
  },
  {
    id: "proj-duong-ninh-khang",
    title: "Dự Án Tuyến Đường Xã Ninh Khang Huyện Hoa Lư",
    category: "Giao thông & Hạ tầng",
    location: "Xã Ninh Khang, Huyện Hoa Lư, Tỉnh Ninh Bình",
    volumeM3: 7400,
    concreteGrade: "Mác 250 Mặt Đường Nông Thôn Mới Kiểu Mẫu",
    pumpService: "Xe Bồn Xả Trực Tiếp Có Máng Dài",
    year: 2024,
    client: "UBND Xã Ninh Khang - Hoa Lư",
    image: "/images/du-an/du-an-duong-xa-ninh-khang-betongangiabinh.jpg",
    description: "Đổ bê tông tươi mặt đường liên thôn kiểu mẫu kết nối khu du lịch và làng nghề xã Ninh Khang. Bê tông được cắt khe co giãn đúng quy chuẩn, bảo dưỡng phủ bạt giữ ẩm 7 ngày liên tục.",
    highlights: ["7.400 m³ đường giao thông nông thôn kiểu mẫu", "Độ sụt 12±2 chuẩn mực cho đường giao thông bền trên 30 năm", "Nhận được thư khen ngợi từ bà con nhân dân địa phương"],
    slug: "du-an-duong-xa-ninh-khang",
    permalink: "/du-an/du-an-duong-xa-ninh-khang/",
    date: "2024-06-02"
  },
  {
    id: "proj-atgt-cao-bo-mai-son",
    title: "Gói Thầu ATGT Tuyến Cao Tốc Cao Bồ - Mai Sơn",
    category: "Giao thông & Hạ tầng",
    location: "Tuyến cao tốc Cao Bồ - Mai Sơn, Huyện Yên Mô",
    volumeM3: 13500,
    concreteGrade: "Mác 300, Mác 350 Dải Phân Cách & Hộ Lan Bê Tông",
    pumpService: "Xe Bơm Cần 45m & Máy Rải Dải Phân Cách Trượt",
    year: 2024,
    client: "Doanh Nghiệp Xây Dựng Xuân Trường & Bộ GTVT",
    image: "/images/du-an/du-an-goi-thau-dam-bao-an-toan-giao-thong-cao-toc-cao-bo-mai-son-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm đúc dải phân cách giữa cố định chống va đập và hệ thống hộ lan bê tông cốt thép bảo vệ an toàn giao thông trên tuyến cao tốc kiểu mẫu Cao Bồ - Mai Sơn.",
    highlights: ["13.500 m³ dải phân cách và hộ lan chịu lực cao", "Bê tông mác cao không rạn nứt chịu thời tiết khắc nghiệt", "Phục vụ an toàn giao thông cho hàng triệu lượt phương tiện"],
    slug: "du-an-goi-thau-dam-bao-an-toan-giao-thong-cao-toc-cao-bo-mai-son",
    permalink: "/du-an/du-an-goi-thau-dam-bao-an-toan-giao-thong-cao-toc-cao-bo-mai-son/",
    date: "2024-06-03"
  },
  {
    id: "proj-ham-chui-ninh-binh-thanh-hoa",
    title: "Dự Án Hầm Chui Dân Sinh Cao Tốc Ninh Bình - Thanh Hóa",
    category: "Giao thông & Hạ tầng",
    location: "Nút giao Mai Sơn, Huyện Yên Mô, Ninh Bình",
    volumeM3: 21000,
    concreteGrade: "Mác 350 Khối Lớn & Chống Thấm B10",
    pumpService: "2 Xe Bơm Cần 52m Bơm Đồng Thời 2 Phía",
    year: 2024,
    client: "Ban QLDA Thăng Long - Bộ GTVT",
    image: "/images/du-an/du-an-ham-chui-cao-toc-ninh-binh-thanh-hoa-betongangiabinh.jpg",
    description: "Cung cấp bê tông thương phẩm khối lớn cho thân đốt hầm chui dân sinh qua cao tốc. Kết cấu hầm kín đòi hỏi độ chống thấm B10, kiểm soát co ngót và đúc mẫu kiểm định LAS-XD chặt chẽ.",
    highlights: ["21.000 m³ bê tông hầm chui dân sinh kiên cố", "Chống thấm tinh thể B10 ngăn ngừa nước ngầm thẩm thấu", "Đổ liên tục phân đoạn thân vòm hầm 24/24"],
    slug: "du-an-ham-chui-cao-toc-ninh-binh-thanh-hoa",
    permalink: "/du-an/du-an-ham-chui-cao-toc-ninh-binh-thanh-hoa/",
    date: "2024-06-04"
  },
  {
    id: "proj-kho-bac-yen-khanh",
    title: "Dự Án Trụ Sở Kho Bạc Nhà Nước Huyện Yên Khánh",
    category: "Công trình Công cộng",
    location: "Thị trấn Ninh, Huyện Yên Khánh, Ninh Bình",
    volumeM3: 6200,
    concreteGrade: "Mác 300, Mác 350 Sàn Kho Tiền Đặc Biệt",
    pumpService: "Xe Bơm Cần 43m Vươn Xa",
    year: 2024,
    client: "Kho Bạc Nhà Nước Tỉnh Ninh Bình",
    image: "/images/du-an/du-an-kho-bac-nha-nuoc-huyen-yen-khanh-betongangiabinh-5.jpg",
    description: "Cung cấp bê tông thương phẩm cho khối nhà làm việc 4 tầng và hạng mục kho tiền kiên cố có yêu cầu an ninh đặc biệt. Bê tông mác 350 kết hợp phụ gia tăng cường độ chịu lực và chống phá hoại cơ học.",
    highlights: ["6.200 m³ công trình công cộng trọng điểm cấp huyện", "Kho bảo an tiêu chuẩn cấp quốc gia", "Nghiệm thu bàn giao đảm bảo tiến độ dự án"],
    slug: "du-an-kho-bac-nha-nuoc-huyen-yen-khanh",
    permalink: "/du-an/du-an-kho-bac-nha-nuoc-huyen-yen-khanh/",
    date: "2024-06-05"
  }
];

export const initialLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Bác Đặng Văn Hùng (Chủ thầu xây dựng)",
    phone: "0912.883.219",
    address: "Xã Gia Vân, Huyện Gia Viễn, Ninh Bình",
    concreteGrade: "Mác 250 (Đá 1x2)",
    estimatedM3: 45,
    pumpNeeded: true,
    pumpType: "Bơm cần 37m",
    pourDate: "2026-09-15",
    notes: "Đổ sàn tầng 2 nhà mái Thái, ngõ xe bồn 10m3 vào thoải mái. Cần báo giá gấp.",
    createdAt: "2026-09-09 14:20",
    status: "quoted"
  },
  {
    id: "lead-2",
    name: "Anh Nguyễn Quang Dũng (Kỹ sư Cty TNHH Nam Hải)",
    phone: "0984.112.990",
    address: "KCN Gián Khẩu, Huyện Gia Viễn, Ninh Bình",
    concreteGrade: "Mác 300 R7 (Đông kết nhanh)",
    estimatedM3: 160,
    pumpNeeded: true,
    pumpType: "Bơm cần 52m",
    pourDate: "2026-09-18",
    notes: "Đổ nền kho xưởng mở rộng, yêu cầu cung cấp mẫu nén R7 và phiếu xuất xưởng chuẩn.",
    createdAt: "2026-09-09 16:05",
    status: "new"
  },
  {
    id: "lead-3",
    name: "Chị Mai Thị Loan (Gia chủ xây nhà)",
    phone: "0977.553.881",
    address: "Phường Nam Thành, TP. Ninh Bình",
    concreteGrade: "Mác 250",
    estimatedM3: 32,
    pumpNeeded: true,
    pumpType: "Bơm tĩnh",
    pourDate: "2026-09-20",
    notes: "Đổ móng nhà phố, hẻm nhỏ xe bồn đỗ ngoài phố cách 60m.",
    createdAt: "2026-09-08 09:30",
    status: "contacted"
  }
];

export const initialAnalytics: RealtimeAnalytics = {
  activeUsers: 28,
  pageviewsToday: 1420,
  totalPageviews: 18420,
  chatInquiries: 54,
  leadsCount: 26,
  pageviewsPerMin: [12, 16, 14, 22, 19, 25, 31, 28, 24, 28],
  leadsToday: 8,
  callsToday: 19,
  deviceBreakdown: [
    { name: "Thiết bị Di Động (Mobile)", percentage: 84, count: 1192 },
    { name: "Máy tính bàn (Desktop)", percentage: 14, count: 198 },
    { name: "Máy tính bảng (Tablet)", percentage: 2, count: 30 }
  ],
  locationBreakdown: [
    { city: "TP. Ninh Bình & Huyện lân cận", percentage: 66, count: 937 },
    { city: "TP. Tam Điệp & Nho Quan", percentage: 18, count: 255 },
    { city: "Hà Nam (Phủ Lý, Duy Tiên)", percentage: 7, count: 99 },
    { city: "Nam Định (Ý Yên, Nghĩa Hưng)", percentage: 5, count: 71 },
    { city: "Hà Nội & Tỉnh Khác", percentage: 4, count: 58 }
  ],
  sourceBreakdown: [
    { source: "Google Tìm kiếm Tự nhiên (SEO)", percentage: 52, count: 738 },
    { source: "Facebook Fanpage (@betongangiabinh)", percentage: 29, count: 412 },
    { source: "Truy cập trực tiếp (Direct URL)", percentage: 12, count: 170 },
    { source: "Zalo OA & Giới thiệu", percentage: 7, count: 100 }
  ],
  topPages: [
    { path: "/", title: "Trang chủ Bê Tông An Gia Bình Ninh Bình", views: 680 },
    { path: "/bang-gia", title: "Bảng Báo Giá Bê Tông Tươi Mới Nhất 2025", views: 340 },
    { path: "/blog/bang-bao-gia-be-tong-tuoi-ninh-binh-moi-nhat", title: "Báo Giá Bê Tông Tươi Ninh Bình 2025", views: 215 },
    { path: "/du-an", title: "Hồ Sơ Dự Án Đã Thi Công An Gia Bình", views: 185 }
  ],
  recentEvents: [
    {
      id: "ev-1",
      timestamp: "18:12:44",
      type: "chat_inquiry",
      details: "Khách hỏi Chatbot: 'Giá bê tông mác 250 đổ mái tại Hoa Lư bao nhiêu?'",
      device: "mobile",
      location: "Hoa Lư, Ninh Bình",
      path: "/bang-gia"
    },
    {
      id: "ev-2",
      timestamp: "18:10:15",
      type: "quote_calculator",
      details: "Tính toán thể tích móng: 12m x 8m x 0.35m = 33.6 m³ bê tông M250",
      device: "mobile",
      location: "TP. Ninh Bình",
      path: "/"
    },
    {
      id: "ev-3",
      timestamp: "18:07:22",
      type: "call_hotline",
      details: "Click nút Gọi Hotline 0988 2662 93 từ thanh công cụ di động",
      device: "mobile",
      location: "KCN Khánh Phú, Ninh Bình",
      path: "/blog/bang-bao-gia-be-tong-tuoi-ninh-binh-moi-nhat"
    },
    {
      id: "ev-4",
      timestamp: "18:02:09",
      type: "download_profile",
      details: "Tải hồ sơ năng lực năng lực trạm trộn An Gia Bình (PDF)",
      device: "desktop",
      location: "TP. Tam Điệp",
      path: "/ho-so-nang-luc"
    }
  ]
};

export const initialIndustryNews: IndustryNews[] = [
  {
    id: "news-1",
    source: "Tạp chí Xi măng & Bê tông Việt Nam",
    sourceUrl: "https://ximang.vn/tin-tuc-be-tong-thi-truong-2025",
    title: "Xu hướng áp dụng phụ gia siêu dẻo và xỉ lò cao nghiền mịn trong phối trộn bê tông bền vững",
    publishedAt: "Hôm nay, 08:30",
    summary: "Việc sử dụng phụ gia thế hệ mới giúp bê tông tăng cường độ sớm R3, R7, giảm thiểu co ngót nhiệt và tăng khả năng kháng xâm thực mặn, phèn trong công trình ven sông, cửa biển.",
    rawContent: `Tại hội thảo khoa học vật liệu xây dựng 2025, các chuyên gia Viện Bê tông Việt Nam nhấn mạnh tầm quan trọng của việc chuẩn hóa trạm trộn tự động. Việc kết hợp tro bay tuyển và xỉ lò cao nghiền mịn S95 không chỉ giúp giảm 20% phát thải CO2 mà còn cải thiện đáng kể độ đặc chắc của cấu kiện bê tông, ngăn chặn ăn mòn cốt thép trong môi trường nước ngầm và hơi ẩm nhiệt đới. Đối với các trạm trộn quy mô lớn, việc trang bị cảm biến độ ẩm cát đá trực tiếp trong cối trộn là yếu tố then chốt để duy trì tỷ lệ Nước/Xi măng (N/X) chuẩn xác tuyệt đối.`,
    status: "new",
    targetKeywords: ["bê tông bền vững", "phụ gia bê tông ninh bình", "bê tông an gia bình", "mác bê tông chống thấm"]
  },
  {
    id: "news-2",
    source: "Báo Xây Dựng - Bộ Xây Dựng",
    sourceUrl: "https://baoxaydung.com.vn/kiem-soat-nhiet-khoi-do-be-tong-lon",
    title: "Kỹ thuật kiểm soát ứng suất nhiệt trong thi công bê tông khối lớn móng bè nhà xưởng",
    publishedAt: "Hôm qua, 15:45",
    summary: "Hướng dẫn giải pháp hạ nhiệt độ bê tông tươi đầu vào, sử dụng đá làm lạnh và bảo dưỡng ủ nhiệt kiểm soát chênh lệch nhiệt độ trong lòng khối đổ không quá 20 độ C.",
    rawContent: `Thi công bê tông khối lớn (chiều dày bản móng bè > 1.2m) thường tiềm ẩn rủi ro nứt do nhiệt thủy hóa xi măng. Các nhà thầu uy tín khuyến nghị giải pháp: 1. Sử dụng xi măng ít tỏa nhiệt; 2. Đổ bê tông vào chiều tối hoặc ban đêm khi nhiệt độ môi trường giảm; 3. Sử dụng trạm trộn có hệ thống phun sương làm mát cốt liệu đá 1x2; 4. Cắm ống đo nhiệt độ điện tử theo dõi diễn biến nhiệt độ tâm khối đổ trong suốt 72 giờ đầu tiên sau khi kết thúc công tác đổ.`,
    status: "new",
    targetKeywords: ["đổ bê tông khối lớn", "bê tông thương phẩm ninh bình", "an gia bình kỹ thuật"]
  },
  {
    id: "news-3",
    source: "Diễn đàn Nhà Thầu Xây Dựng Dân Dụng",
    sourceUrl: "https://xaydungdan-dung.vn/nhan-biet-be-tong-tuoi-kem-chat-luong",
    title: "Dấu hiệu nhận biết bê tông tươi kém chất lượng và cách phòng ngừa cho chủ nhà",
    publishedAt: "07/09/2026",
    summary: "Cách kiểm tra phiếu giao nhận hàng có kẹp chì niêm phong, kiểm tra độ sụt nón Abrams tại hiện trường trước khi đồng ý cho xe bồn xả vào phễu bơm.",
    rawContent: `Nhiều chủ nhà lo ngại mua phải bê tông tươi bị pha thêm nước trên đường vận chuyển hoặc trạm trộn sử dụng cát bẩn chứa nhiều bùn sét. Để an tâm, gia chủ nên: 1. Kiểm tra kẹp chì niêm phong tại phễu xả của xe bồn trước khi đổ; 2. Yêu cầu kỹ thuật viên đo độ sụt bằng nón côn tiêu chuẩn ngay trước mặt; 3. Lấy ít nhất 2 tổ mẫu (6 viên) để gửi nén kiểm tra R7 và R28 tại phòng thí nghiệm hợp chuẩn LAS-XD; 4. Ưu tiên chọn các thương hiệu có trạm trộn gần công trình (bán kính dưới 25km) để bê tông không bị suy giảm phẩm cấp.`,
    status: "new",
    targetKeywords: ["kiểm tra bê tông tươi", "đo độ sụt bê tông", "bê tông tươi an gia bình ninh bình"]
  },
  {
    id: "news-4",
    source: "Cổng Thông Tin Sở Xây Dựng Ninh Bình",
    sourceUrl: "https://soxaydung.ninhbinh.gov.vn/quy-chuan-vat-lieu-ha-tang-2026",
    title: "Đẩy mạnh ứng dụng bê tông thương phẩm đạt chuẩn TCVN trong các dự án hạ tầng trọng điểm Ninh Bình",
    publishedAt: "Hôm nay, 10:15",
    summary: "Tăng cường kiểm định chất lượng vật liệu đầu vào tại các trạm trộn KCN Khánh Phú, Tam Điệp, Kim Sơn phục vụ cao tốc Ninh Bình - Hải Phòng và các cụm công nghiệp sinh thái.",
    rawContent: `Nhằm đảm bảo niên hạn công trình trên 50 năm, Sở Xây Dựng tỉnh Ninh Bình ban hành công văn đôn đốc các chủ đầu tư, nhà thầu thi công ưu tiên sử dụng bê tông thương phẩm từ các trạm trộn đạt chuẩn ISO 9001:2015. Bê tông phải có chứng chỉ xuất xưởng, kẹp chì niêm phong và phòng thí nghiệm LAS-XD đạt chuẩn đo lường quốc gia.`,
    status: "new",
    targetKeywords: ["bê tông ninh bình", "dự án ninh bình", "trạm trộn kcn khánh phú", "bê tông tươi an gia bình"]
  },
  {
    id: "news-5",
    source: "Tạp Chí Cầu Đường & Bê Tông Ứng Suất Trước",
    sourceUrl: "https://cauduongvietnam.vn/kinh-nghiem-do-be-tong-san-mai-chong-tham",
    title: "Bí quyết đổ bê tông sàn mái, sàn hầm chống thấm tuyệt đối không cần dán màng khò",
    publishedAt: "Hôm qua, 09:20",
    summary: "Sử dụng cấp phối bê tông Mác 300 - 350 bổ sung phụ gia chống thấm tinh thể thẩm thấu B6 - B8 kết hợp đầm dùi đúng kỹ thuật và bảo dưỡng dưỡng ẩm 7 ngày liên tục.",
    rawContent: `Đổ bê tông sàn mái và sàn hầm đòi hỏi độ sụt 12±2cm và mác tối thiểu 300. Kỹ sư khuyên dùng phụ gia chống thấm tinh thể thẩm thấu hoạt tính ngay tại cối trộn trạm An Gia Bình, đầm chặt hai lớp vuông góc, cán phẳng và bảo dưỡng rải bao tải tưới nước 3 lần/ngày trong 7 ngày đầu. Phương pháp này giúp tiết kiệm 40% chi phí chống thấm hoàn thiện.`,
    status: "new",
    targetKeywords: ["đổ bê tông sàn mái", "bê tông chống thấm ninh bình", "kinh nghiệm đổ bê tông"]
  }
];

export const initialIntegrationConfig: IntegrationConfig = {
  googleAnalyticsId: "G-AGB93NB2025",
  searchConsoleTag: "google-site-verification=AGB-NinhBinh-Concrete-2025-Verified",
  isSynced: true,
  lastSyncedAt: "Hôm nay, 08:30:15",
  syncedPageviews: 24890,
  indexedUrls: 34,
  searchImpressions: 14280,
  searchClicks: 1890,
  averageCtr: 13.2,
  topRankKeywords: 8,
  realtimeVisitors: 28,
  engagementRate: 64.5
};

export const initialMediaFiles = [
  {
    id: "media-blog-1",
    name: "be-tong-thuong-pham-an-gia-binh.jpg",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80",
    path: "/images/blog/be-tong-thuong-pham-an-gia-binh.jpg",
    folder: "/images/blog",
    type: "image" as const,
    size: "1.4 MB",
    uploadedAt: "09/09/2026",
    dimensions: "1920x1080"
  },
  {
    id: "media-1",
    name: "tram-tron-be-tong-tuoi-an-gia-binh-khanh-phu.jpg",
    url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80",
    path: "/images/tram-tron/tram-tron-be-tong-tuoi-an-gia-binh-khanh-phu.jpg",
    folder: "/images/tram-tron",
    type: "image" as const,
    size: "1.4 MB",
    uploadedAt: "08/09/2026",
    dimensions: "1920x1080"
  },
  {
    id: "media-2",
    name: "thi-cong-do-be-tong-san-nha-xuong-kcn-tam-diep.jpg",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    path: "/images/du-an/thi-cong-do-be-tong-san-nha-xuong-kcn-tam-diep.jpg",
    folder: "/images/du-an",
    type: "image" as const,
    size: "2.1 MB",
    uploadedAt: "07/09/2026",
    dimensions: "2048x1365"
  },
  {
    id: "media-3",
    name: "xe-bom-be-tong-can-52m-an-gia-binh.jpg",
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80",
    path: "/images/xe-may/xe-bom-be-tong-can-52m-an-gia-binh.jpg",
    folder: "/images/xe-may",
    type: "image" as const,
    size: "1.8 MB",
    uploadedAt: "05/09/2026",
    dimensions: "1920x1280"
  },
  {
    id: "media-4",
    name: "quy-trinh-thi-nghiem-duc-mau-be-tong-las-xd.jpg",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    path: "/images/ky-thuat/quy-trinh-thi-nghiem-duc-mau-be-tong-las-xd.jpg",
    folder: "/images/ky-thuat",
    type: "image" as const,
    size: "1.2 MB",
    uploadedAt: "03/09/2026",
    dimensions: "1600x1067"
  },
  {
    id: "media-5",
    name: "video-hoat-dong-tram-tron-va-doan-xe-bon.mp4",
    url: "https://assets.mixkit.co/videos/preview/mixkit-heavy-machinery-operating-on-a-construction-site-41584-large.mp4",
    type: "video" as const,
    size: "8.6 MB",
    uploadedAt: "01/09/2026",
    dimensions: "1080p HD"
  },
  {
    id: "media-6",
    name: "ho-so-nang-luc-va-chung-chi-iso-an-gia-binh.pdf",
    url: "/assets/profile-an-gia-binh-2025.pdf",
    type: "document" as const,
    size: "4.5 MB",
    uploadedAt: "28/08/2026",
    dimensions: "28 trang A4"
  }
];

export const initialCategories: CategoryItem[] = [
  {
    id: "cat-tin-tuc",
    name: "Tin Tức",
    slug: "tin-tuc",
    description: "Tin tức thị trường bê tông tươi Ninh Bình, hoạt động trạm trộn, báo giá mới nhất và các dự án triển khai.",
    color: "amber"
  },
  {
    id: "cat-kinh-nghiem",
    name: "Kinh Nghiệm",
    slug: "kinh-nghiem",
    description: "Kinh nghiệm đổ bê tông móng, cột, dầm, sàn, lựa chọn nhà cung cấp uy tín, cẩm nang xây dựng và mẹo thi công thực tế.",
    color: "emerald"
  },
  {
    id: "cat-kien-thuc",
    name: "Kiến Thức",
    slug: "kien-thuc",
    description: "Kiến thức kỹ thuật xây dựng, tiêu chuẩn mác bê tông R7, R28, cấp phối vật liệu, thí nghiệm LAS-XD và bảo dưỡng chống nứt.",
    color: "blue"
  }
];

export const initialPages: SitePage[] = [
  {
    id: "page-home",
    title: "Trang Chủ - Bê Tông An Gia Bình",
    slug: "/",
    menuTitle: "Trang chủ",
    showInMenu: true,
    menuLocation: "header",
    menuOrder: 0,
    layout: "hero-content",
    summary: "Cấu hình và nội dung các khối hiển thị trên trang chủ: Video banner hero, thông số công suất 450m³/h, máy tính số khối bê tông, bảng giá tham khảo và các dự án trọng điểm.",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80",
    heroCtaText: "Xem Báo Giá Bê Tông",
    heroCtaLink: "/bang-gia",
    sections: [
      {
        id: "sec-home-hero",
        type: "hero",
        title: "BÊ TÔNG AN GIA BÌNH - NỀN MÓNG VỮNG BỀN",
        content: "Cung ứng bê tông thương phẩm mác 150 – 450, hệ thống 2 cụm trạm trộn tự động tổng công suất 450m³/h (Trạm KCN Khánh Phú 300m³/h & Trạm Xã Kim Sơn 150m³/h), đội xe 35+ xe bồn và dàn xe bơm cần vươn xa 37m - 56m. Đo nén mẫu R7, R28 kiểm định LAS-XD trực tiếp tại hiện trường.",
        badge: "Trạm Đôi 450m³/h KCN Khánh Phú & Kim Sơn",
        buttonText: "Xem Báo Giá Tham Khảo",
        buttonLink: "/bang-gia"
      },
      {
        id: "sec-home-capacity",
        type: "features",
        title: "Năng Lực Thiết Bị & Trạm Trộn Công Nghệ Cao",
        content: "Hệ thống trạm trộn tự động hóa PLC cùng dàn thiết bị cơ giới chuyên dụng sẵn sàng phục vụ 24/7 trên toàn địa bàn tỉnh Ninh Bình.",
        badge: "Năng Lực Thiết Bị",
        items: [
          "Cụm trạm đôi tự động hóa PLC tổng công suất 450 m³/h",
          "Đội ngũ hơn 35 xe bồn chuyên dụng dung tích 10m³ – 12m³",
          "Dàn xe bơm cần vươn xa 37m, 43m, 52m, 56m và bơm tĩnh áp lực cao",
          "Phòng thí nghiệm hợp chuẩn LAS-XD nén mẫu R7, R28 và đo độ sụt tận công trình"
        ]
      },
      {
        id: "sec-home-pricing",
        type: "rich_text",
        title: "Bảng Giá Tham Khảo & Máy Tính Dự Toán Thể Tích",
        content: "Cung cấp công cụ tính thể tích bê tông cho móng đơn, móng băng, móng bè, cột, dầm, sàn và cập nhật bảng giá tham khảo mới nhất tại thời điểm hiện tại cho từng mác bê tông.",
        badge: "Giá Cả Minh Bạch"
      },
      {
        id: "sec-home-projects",
        type: "features",
        title: "Công Trình & Dự Án Tiêu Biểu",
        content: "Đồng hành cùng các nhà thầu và chủ đầu tư trong những công trình công nghiệp và dân dụng trọng điểm.",
        badge: "Dự Án Thực Tế",
        items: [
          "Nhà xưởng KCN Khánh Phú & KCN Gián Khẩu",
          "Dự án Mở rộng Tuyến đường ĐT477 & Cầu Mai Sơn",
          "Các khu đô thị, biệt thự sinh thái Tràng An, TP. Tam Điệp",
          "Hàng ngàn công trình nhà phố, trường học, bệnh viện tại Ninh Bình"
        ]
      },
      {
        id: "sec-home-process",
        type: "features",
        title: "Quy Trình Kiểm Định & Sản Xuất Chuẩn TCVN",
        content: "Từng mẻ trộn đều tuân thủ các bước nghiêm ngặt từ kiểm định cát đá xi măng đầu vào đến thử nghiệm độ sụt tại hiện trường.",
        badge: "TCVN 3105 & TCVN 3118",
        items: [
          "Sàng lọc cát vàng hạt lớn và rửa sạch đá dăm 1x2",
          "Định lượng tự động bằng hệ thống cân điện tử sai số < 1%",
          "Kẹp chì niêm phong bồn xả trước khi xe xuất trạm",
          "Đúc tổ mẫu lưu kiểm tra cường độ nén R7 và R28"
        ],
        buttonText: "Xem Quy Trình Kiểm Định",
        buttonLink: "/quy-trinh-san-xuat"
      },
      {
        id: "sec-home-cta",
        type: "cta",
        title: "Liên Hệ Kỹ Sư Tư Vấn & Đặt Lịch Đổ Bê Tông 24/7",
        content: "Khảo sát mặt bằng miễn phí, tư vấn mác bê tông và điều phối xe bơm bồn chuyên nghiệp trên toàn tỉnh Ninh Bình.",
        badge: "Hotline 24/7: 0988 2662 93",
        buttonText: "Gọi 0988 2662 93",
        buttonLink: "tel:0988266293"
      }
    ],
    content: `## Nội Dung Các Khối Trang Chủ - Bê Tông An Gia Bình
 
### 1. Khối Banner Hero & Video Giới Thiệu
- **Tiêu đề chính:** BÊ TÔNG AN GIA BÌNH - NỀN MÓNG VỮNG BỀN
- **Tiêu đề phụ:** Đồng Hành Mọi Công Trình Trọng Điểm Tại Ninh Bình
- **Nội dung mô tả:** Cung ứng bê tông thương phẩm mác 150 – 450, hệ thống 2 cụm trạm trộn tự động tổng công suất 450m³/h (Trạm KCN Khánh Phú 300m³/h & Trạm Xã Kim Sơn 150m³/h), đội xe 35+ xe bồn và dàn xe bơm cần vươn xa 37m - 56m. Đo nén mẫu R7, R28 kiểm định LAS-XD trực tiếp tại hiện trường.
- **Media:** Video toàn cảnh trạm trộn và đoàn xe bồn (WebM & MP4).
 
### 2. Khối Số Liệu Năng Lực Trạm Trộn
- **Công suất:** 450 m³/h (2 trạm điều khiển PLC tự động)
- **Đội xe bồn:** 35+ xe bồn chuyên dụng 10 - 12m³
- **Xe bơm cần:** 56 mét vươn xa tối đa (dàn xe 37m, 43m, 52m, 56m)
- **Tiêu chuẩn kỹ thuật:** TCVN 3105 & TCVN 3118 (kiểm định nén mẫu R7, R28)
 
### 3. Khối Bảng Giá Tham Khảo & Máy Tính Dự Toán
- Công cụ tính nhanh khối lượng bê tông cho móng, dầm, cột, sàn.
- Bảng đơn giá tham khảo tại thời điểm hiện tại cho các mác M150, M200, M250, M300, M350, M400 và phụ gia.
 
### 4. Khối Dự Án Tiêu Biểu & Khách Hàng
- KCN Khánh Phú, Nhà máy Changshin, KCN Gián Khẩu, Cầu Mai Sơn, Cao tốc Bắc - Nam...
 
### 5. Khối Quy Trình Kiểm Định & Sản Xuất
- Tiêu chuẩn TCVN 3105, TCVN 3118, kẹp chì xe bồn, thử độ sụt và đúc mẫu thí nghiệm nén LAS-XD.
 
### 6. Khối Liên Hệ & Tư Vấn 24/7
- Hotline Kỹ Sư: 0988 2662 93, 2 cụm trạm KCN Khánh Phú & Xã Kim Sơn.`,
    seoTitle: "Bê Tông An Gia Bình Ninh Bình | Trạm Trộn Bê Tông Tươi Chuẩn TCVN",
    seoDescription: "Trạm trộn bê tông tươi An Gia Bình Ninh Bình. Cung cấp bê tông thương phẩm mác 150-450, xe bơm cần 37m-56m, 35+ xe bồn tại TP Ninh Bình, KCN Khánh Phú, Kim Sơn.",
    seoKeywords: ["bê tông an gia bình", "bê tông tươi ninh bình", "trạm trộn bê tông ninh bình", "giá bê tông tươi ninh bình"],
    canonicalUrl: "https://betongangiabinh.vn/",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-gioi-thieu",
    title: "Giới Thiệu Doanh Nghiệp Bê Tông An Gia Bình",
    slug: "gioi-thieu",
    menuTitle: "Giới thiệu",
    showInMenu: true,
    menuLocation: "both",
    menuOrder: 1,
    layout: "hero-content",
    summary: "Nhà cung cấp bê tông thương phẩm công nghệ cao hàng đầu tại Ninh Bình với 2 cụm trạm tự động hóa 450m³/h.",
    content: `## Về Chúng Tôi - Bê Tông An Gia Bình Ninh Bình

Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình (MST: 2700870972) được thành lập với sứ mệnh mang đến giải pháp **bê tông thương phẩm (bê tông tươi)** chất lượng cao, chuẩn mác, đủ khối lượng và đáp ứng tiến độ cho mọi công trình tại Ninh Bình và các tỉnh lân cận.

### Quy Mô Năng Lực Cung Ứng
- **Trạm 1:** Cụm trạm đôi KCN Khánh Phú, Yên Khánh, Ninh Bình - Công suất 300m³/h.
- **Trạm 2:** Xã Kim Sơn, Ninh Bình - Công suất 150m³/h.
- **Đội xe vận chuyển:** 35+ xe bồn chuyên dụng dung tích 10m³ - 12m³.
- **Đội xe bơm:** Xe bơm cần 37m, 43m, 52m, 56m và hệ thống bơm tĩnh áp lực cao luồn sâu 200m.
- **Phòng thí nghiệm:** Hợp chuẩn LAS-XD kiểm định nén mẫu R7, R28 và đo độ sụt tận chân công trình.

### Tiêu Chuẩn Hoạt Động Của An Gia Bình
1. **Chất lượng TCVN:** Cấp phối Mix Design đạt mác thiết kế theo tiêu chuẩn.
2. **Cân đong chuẩn xác:** Hệ thống cân điện tử tự động sai số dưới 1%.
3. **Niêm phong kẹp chì:** Đảm bảo không pha nước ngoài trạm.
4. **Phục vụ 24/7:** Hotline kỹ thuật và điều vận luôn sẵn sàng phục vụ các ca đổ xuyên đêm.`,
    seoTitle: "Giới Thiệu Trạm Trộn Bê Tông Tươi An Gia Bình Ninh Bình | Uy Tín Hàng Đầu",
    seoDescription: "Giới thiệu Công ty Bê Tông An Gia Bình Ninh Bình. Cụm trạm đôi 450m3/h tại KCN Khánh Phú & Kim Sơn, 35 xe bồn, bơm cần 56m, chứng chỉ thí nghiệm LAS.",
    seoKeywords: ["bê tông an gia bình", "trạm trộn bê tông ninh bình", "bê tông tươi khánh phú"],
    canonicalUrl: "https://betongangiabinh.vn/about",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-bang-gia",
    title: "Bảng Báo Giá Bê Tông Tươi & Dịch Vụ Xe Bơm Ninh Bình",
    slug: "bang-gia",
    menuTitle: "Báo giá",
    showInMenu: true,
    menuLocation: "both",
    menuOrder: 2,
    layout: "pricing-table",
    summary: "Bảng giá bê tông thương phẩm mác 150 đến 450 và biểu phí ca xe bơm cần, bơm tĩnh mới nhất 2026.",
    content: `## Báo Giá Bê Tông Tươi Ninh Bình Mới Nhất 2026

An Gia Bình kính gửi Quý khách hàng bảng giá tham khảo bê tông tươi (đá 1x2, độ sụt 12±2):

| Mác Bê Tông | Loại Đá | Độ Sụt | Đơn Giá Tham Khảo (VNĐ/m³) |
| :--- | :--- | :--- | :--- |
| **Mác 150** | Đá 1x2 | 12±2 | **860.000** |
| **Mác 200** | Đá 1x2 | 12±2 | **930.000** |
| **Mác 250** | Đá 1x2 | 12±2 | **990.000** |
| **Mác 300** | Đá 1x2 | 12±2 | **1.060.000** |
| **Mác 350** | Đá 1x2 | 12±2 | **1.140.000** |
| **Mác 400** | Đá 1x2 | 12±2 | **1.230.000** |

*Đơn giá chưa bao gồm VAT và có thể thay đổi tùy cự ly vận chuyển và phụ gia chống thấm B6/B8/B10.*`,
    seoTitle: "Báo Giá Bê Tông Tươi Ninh Bình 2026 Mới Nhất | Trạm Trộn An Gia Bình",
    seoDescription: "Bảng báo giá bê tông thương phẩm mác 200, 250, 300, 350 và giá thuê ca bơm bê tông tại Ninh Bình mới nhất, định lượng đủ khối lượng, đúng mác.",
    seoKeywords: ["báo giá bê tông tươi ninh bình", "giá bê tông mác 250", "giá xe bơm bê tông"],
    canonicalUrl: "https://betongangiabinh.vn/bang-gia",
    isPublished: true,
    updatedAt: "2026-09-10"
  },
  {
    id: "page-ho-so-nang-luc",
    title: "Hồ Sơ Năng Lực Thiết Bị & Trạm Trộn Bê Tông An Gia Bình",
    slug: "ho-so-nang-luc",
    menuTitle: "Hồ sơ năng lực",
    showInMenu: true,
    menuLocation: "header",
    menuOrder: 3,
    layout: "services-grid",
    summary: "Hệ thống trạm đôi công nghệ EU, dàn 35+ xe bồn, bơm cần vươn xa 56m và phòng thí nghiệm LAS-XD.",
    content: `## Năng Lực Thiết Bị & Công Nghệ Trạm Trộn An Gia Bình

An Gia Bình đầu tư đồng bộ hệ thống máy móc cơ giới hiện đại bậc nhất khu vực:
- Cụm trạm đôi điều khiển PLC tự động.
- Trạm cân điện tử 120 tấn kiểm định định kỳ.
- Đội hình xe bơm cần 37m, 43m, 52m, 56m Sany / Putzmeister.
- Phòng nén mẫu thủy lực 2000kN đạt chuẩn LAS-XD.`,
    seoTitle: "Hồ Sơ Năng Lực & Dàn Thiết Bị Trạm Trộn An Gia Bình Ninh Bình",
    seoDescription: "Hồ sơ năng lực Công ty Bê Tông An Gia Bình Ninh Bình: Hệ thống trạm trộn tự động 450m3/h, 35 xe bồn vận chuyển, 5 xe bơm cần, phòng thí nghiệm LAS.",
    seoKeywords: ["hồ sơ năng lực bê tông", "xe bơm cần 56m ninh bình", "trạm trộn an gia bình"],
    canonicalUrl: "https://betongangiabinh.vn/ho-so-nang-luc",
    isPublished: true,
    updatedAt: "2026-09-10"
  },
  {
    id: "page-chinh-sach-chat-luong",
    title: "Chính Sách Chất Lượng & Quy Trình Đúc Mẫu Thí Nghiệm",
    slug: "chinh-sach-chat-luong",
    menuTitle: "Chính sách chất lượng",
    showInMenu: false,
    menuLocation: "footer",
    menuOrder: 4,
    layout: "standard",
    summary: "Quy chuẩn kiểm định TCVN 3105 & 3118, lưu mẫu R7, R28 và kiểm định nén mẫu tại phòng thí nghiệm hợp chuẩn LAS-XD.",
    content: `## Tiêu Chuẩn Quản Lý Chất Lượng Bê Tông An Gia Bình

Chất lượng là nền tảng của mọi công trình xây dựng. Chúng tôi áp dụng quy trình kiểm soát kỹ thuật nghiêm ngặt:
1. **Vật tư đầu vào tuyển chọn:** Xi măng Vicem Bút Sơn / Tam Điệp, cát vàng hạt to sạch tạp chất, đá dăm 1x2 sàng tuyển rửa sạch.
2. **Kẹp chì bảo vệ:** Xe bồn được niêm chì trước khi rời trạm để đảm bảo độ sụt và phẩm cấp bê tông.
3. **Biên bản nghiệm thu minh bạch:** Giao hàng kèm phiếu giao nhận ghi rõ giờ xuất trạm, khối lượng, mác bê tông và độ sụt.
4. **Đúc mẫu tại hiện trường:** Hỗ trợ đúc mẫu kiểm định R7, R28 theo yêu cầu của tư vấn giám sát.

*Lưu ý: Bảng giá và cấp phối mang tính chất tham khảo tại thời điểm phát hành.*`,
    seoTitle: "Chính Sách Chất Lượng & Thử Nghiệm Bê Tông An Gia Bình Ninh Bình",
    seoDescription: "Chính sách chất lượng bê tông thương phẩm An Gia Bình: Tiêu chuẩn TCVN, đúc mẫu R7 R28, chứng nhận phòng thí nghiệm LAS-XD.",
    seoKeywords: ["chất lượng bê tông", "chính sách an gia bình", "thí nghiệm las ninh bình"],
    canonicalUrl: "https://betongangiabinh.vn/chinh-sach-chat-luong",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-quy-trinh-san-xuat",
    title: "Quy Trình Kiểm Định & Sản Xuất Bê Tông Thương Phẩm An Gia Bình",
    slug: "quy-trinh-san-xuat",
    menuTitle: "Quy trình sản xuất",
    showInMenu: true,
    menuLocation: "both",
    menuOrder: 5,
    layout: "standard",
    summary: "Chi tiết 6 bước kiểm định vật liệu đầu vào, định lượng tự động PLC, kiểm tra độ sụt và đúc mẫu R7, R28 theo TCVN.",
    content: `## Quy Trình Kiểm Định Và Sản Xuất Bê Tông Tươi Tại Ninh Bình

Hệ thống trạm trộn Bê Tông An Gia Bình tuân thủ quy trình kiểm soát chất lượng 6 bước khép kín:

### Bước 1: Kiểm Tra & Tuyển Chọn Nguyên Vật Liệu Đầu Vào
- **Cát vàng:** Sử dụng cát hạt trung và to, hàm lượng bùn sét < 1.5% theo TCVN 7570:2006.
- **Đá dăm 1x2:** Đá nghiền sạch, không lẫn tạp chất, cường độ chịu nén đá gốc > 800 kg/cm².
- **Xi măng:** Xi măng Pooc lăng hỗn hợp PCB40, PC40 Vicem Bút Sơn, Tam Điệp chính hãng.
- **Phụ gia:** Phụ gia siêu dẻo giảm nước và chống thấm thế hệ mới đạt chuẩn ASTM C494.
- **Nước trộn:** Nước ngầm qua xử lý lọc đạt tiêu chuẩn TCVN 4506:2012.

### Bước 2: Thiết Kế Cấp Phối Mix Design Số Hóa
Cấp phối bê tông từng mác M150 - M450 được lập trình và lưu trữ trên máy tính trạm trộn.

### Bước 3: Định Lượng Tự Động Bằng Cân Điện Tử
Hệ thống cân loadcell điện tử định lượng tự động sai số dưới 1% cho từng mẻ trộn.

### Bước 4: Kiểm Tra Độ Sụt Tại Trạm & Kẹp Chì Niêm Phong Xe Bồn
Kiểm tra độ sụt trước khi xe bồn rời trạm và kẹp chì niêm phong phễu xả.

### Bước 5: Thử Côn Độ Sụt & Đúc Mẫu Tại Chân Công Trường
Kỹ thuật viên thực hiện thử côn độ sụt theo TCVN 3106:1993 và đúc mẫu nén lập phương 15x15x15 cm.

### Bước 6: Bơm Bê Tông & Hướng Dẫn Bảo Dưỡng Thủy Hóa
Vận hành xe bơm cần vươn xa 37m - 56m an toàn và tư vấn bảo dưỡng dưỡng ẩm chống nứt.`,
    seoTitle: "Quy Trình Kiểm Định & Sản Xuất Bê Tông Thương Phẩm | An Gia Bình",
    seoDescription: "Quy trình 6 bước kiểm định vật liệu, định lượng tự động PLC, thử độ sụt và đúc mẫu nén R7, R28 tại trạm trộn Bê Tông An Gia Bình Ninh Bình.",
    seoKeywords: ["quy trình sản xuất bê tông", "kiểm định độ sụt bê tông", "đúc mẫu r7 r28 ninh bình"],
    canonicalUrl: "https://betongangiabinh.vn/quy-trinh-san-xuat",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-chinh-sach-thanh-toan",
    title: "Chính Sách Thanh Toán & Đối Soát Khối Lượng",
    slug: "chinh-sach-thanh-toan",
    menuTitle: "Chính sách thanh toán",
    showInMenu: false,
    menuLocation: "footer",
    menuOrder: 6,
    layout: "standard",
    summary: "Quy định phương thức thanh toán chuyển khoản, tiền mặt, tạm ứng và thủ tục đối soát khối lượng theo phiếu giao nhận.",
    content: `## Chính Sách Thanh Toán & Tạm Ứng Bê Tông An Gia Bình

### 1. Phương Thức Thanh Toán
- **Chuyển khoản ngân hàng:** Tài khoản doanh nghiệp Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình.
- **Tiền mặt:** Thanh toán trực tiếp tại văn phòng trạm trộn hoặc cho nhân viên phụ trách hợp đồng có giấy giới thiệu.

### 2. Tạm Ứng Và Thanh Quyết Toán
- Đối với công trình dân dụng: Tạm ứng từ 30% - 50% giá trị dự kiến trước ca đổ, thanh toán phần còn lại sau khi kết thúc ca đổ và ký biên bản xác nhận khối lượng.
- Đối với dự án công nghiệp, nhà thầu: Thực hiện theo hợp đồng kinh tế và chu kỳ nghiệm thu đối soát hàng tuần hoặc hàng tháng.

*Mọi bảng giá đều mang tính chất tham khảo tại thời điểm hiện tại.*`,
    seoTitle: "Chính Sách Thanh Toán & Đối Soát Bê Tông An Gia Bình",
    seoDescription: "Chính sách thanh toán, tạm ứng và quy trình đối soát khối lượng cung ứng bê tông tươi tại Bê Tông An Gia Bình Ninh Bình.",
    seoKeywords: ["thanh toán bê tông", "hợp đồng bê tông tươi ninh bình"],
    canonicalUrl: "https://betongangiabinh.vn/chinh-sach-thanh-toan",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-chinh-sach-van-chuyen",
    title: "Chính Sách Vận Chuyển & Điều Độ Xe Bồn, Xe Bơm",
    slug: "chinh-sach-van-chuyen",
    menuTitle: "Chính sách vận chuyển",
    showInMenu: false,
    menuLocation: "footer",
    menuOrder: 7,
    layout: "standard",
    summary: "Quy định cự ly điều vận xe bồn, thời gian di chuyển, khảo sát mặt bằng và điều kiện an toàn cho xe bơm cần.",
    content: `## Quy Định Vận Chuyển & Điều Vận Xe Bồn Bê Tông

### 1. Phạm Vi & Bán Kính Phục Vụ
- Hệ thống 2 cụm trạm tại KCN Khánh Phú và Xã Kim Sơn phục vụ toàn bộ tỉnh Ninh Bình và các khu vực lân cận.
- Cự ly vận chuyển tối ưu: Trong bán kính 30km để bảo đảm chất lượng và độ sụt của hỗn hợp bê tông.

### 2. Khảo Sát Hiện Trường & An Toàn Xe Bơm
- Kỹ thuật viên An Gia Bình tiến hành khảo sát trước đường vào xe bồn, cổng ngõ, dây điện và mặt bằng chân chống xe bơm cần.
- Đảm bảo an toàn tuyệt đối cho người và phương tiện trong suốt quá trình đổ bê tông.`,
    seoTitle: "Chính Sách Vận Chuyển & Xe Bơm Bê Tông An Gia Bình Ninh Bình",
    seoDescription: "Quy định vận chuyển xe bồn, xe bơm bê tông tươi tại Ninh Bình của Bê Tông An Gia Bình.",
    seoKeywords: ["vận chuyển bê tông tươi ninh bình", "xe bơm cần ninh bình"],
    canonicalUrl: "https://betongangiabinh.vn/chinh-sach-van-chuyen",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-dieu-khoan",
    title: "Điều Khoản Sử Dụng Dịch Vụ & Hợp Đồng Nguyên Tắc",
    slug: "dieu-khoan",
    menuTitle: "Điều khoản dịch vụ",
    showInMenu: false,
    menuLocation: "footer",
    menuOrder: 8,
    layout: "standard",
    summary: "Điều khoản cung ứng bê tông thương phẩm, quyền và trách nhiệm của khách hàng và bên cung cấp.",
    content: `## Điều Khoản Sử Dụng Dịch Vụ Cung Cấp Bê Tông Thương Phẩm

### 1. Trách Nhiệm Của Bên Bán (An Gia Bình)
- Cung cấp bê tông đúng mác, loại đá, độ sụt theo hợp đồng đã ký kết.
- Điều động xe bồn và xe bơm đúng thời gian và địa điểm thỏa thuận.
- Cung cấp phiếu giao nhận cân điện tử và hỗ trợ đúc mẫu kiểm định tại hiện trường.

### 2. Trách Nhiệm Của Bên Mua
- Chuẩn bị đường vào thông thoáng, an toàn chịu tải trọng cho xe bồn và xe bơm.
- Bố trí nhân lực đầm dùi, cán mặt hoàn thiện kịp thời theo tiến độ xả bê tông.
- Không tự ý pha thêm nước vào xe bồn làm thay đổi tỷ lệ N/X của bê tông.

*Mọi bảng giá trên website đều mang tính chất tham khảo tại thời điểm hiện tại.*`,
    seoTitle: "Điều Khoản Dịch Vụ Cung Ứng Bê Tông An Gia Bình Ninh Bình",
    seoDescription: "Điều khoản dịch vụ và hợp đồng nguyên tắc cung cấp bê tông thương phẩm An Gia Bình Ninh Bình.",
    seoKeywords: ["điều khoản dịch vụ bê tông", "hợp đồng cung ứng bê tông"],
    canonicalUrl: "https://betongangiabinh.vn/dieu-khoan",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-chinh-sach-bao-mat",
    title: "Chính Sách Bảo Mật Thông Tin Khách Hàng",
    slug: "chinh-sach-bao-mat",
    menuTitle: "Chính sách bảo mật",
    showInMenu: false,
    menuLocation: "footer",
    menuOrder: 9,
    layout: "standard",
    summary: "Chính sách bảo vệ thông tin liên hệ, khối lượng dự án và thông tin đối tác của Bê Tông An Gia Bình.",
    content: `## Chính Sách Bảo Mật Thông Tin Khách Hàng

Công ty Cổ phần Thương mại và Dịch vụ An Gia Bình tôn trọng và bảo vệ quyền riêng tư của mọi khách hàng và đối tác:
- Thông tin số điện thoại, địa chỉ công trình chỉ sử dụng cho mục đích khảo sát, điều vận xe và chăm sóc sau bán hàng.
- Không chia sẻ dữ liệu khách hàng cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý.`,
    seoTitle: "Chính Sách Bảo Mật Thông Tin | Bê Tông An Gia Bình",
    seoDescription: "Chính sách bảo mật dữ liệu và thông tin khách hàng của Bê Tông An Gia Bình.",
    seoKeywords: ["chính sách bảo mật bê tông an gia bình"],
    canonicalUrl: "https://betongangiabinh.vn/chinh-sach-bao-mat",
    isPublished: true,
    updatedAt: "2026-09-15"
  },
  {
    id: "page-lien-he",
    title: "Liên Hệ Đặt Bê Tông & Tư Vấn Kỹ Thuật Hiện Trường",
    slug: "lien-he",
    menuTitle: "Liên hệ",
    showInMenu: true,
    menuLocation: "both",
    menuOrder: 5,
    layout: "contact-map",
    summary: "Liên hệ trạm trộn An Gia Bình 24/7. Khảo sát công trình, tư vấn mác bê tông và điều phối xe bơm tận nơi.",
    content: `## Thông Tin Liên Hệ Công Ty Cổ Phần Thương Mại Và Dịch Vụ An Gia Bình

- **Tên đầy đủ:** CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH
- **Mã số thuế:** 2700870972
- **Trụ sở & Trạm 1:** KCN Khánh Phú, Huyện Yên Khánh, Tỉnh Ninh Bình.
- **Trạm 2:** Xã Kim Sơn, Tỉnh Ninh Bình.
- **Hotline Điều Vận / Báo Giá:** 0988 2662 93
- **Email:** ketoan.angiabinh@gmail.com
- **Website:** https://betongangiabinh.vn

Đội ngũ kỹ sư kết cấu sẵn sàng đến trực tiếp hiện trường khảo sát đường vào, đường vươn cần bơm và đo đạc khối lượng miễn phí!`,
    seoTitle: "Liên Hệ Đặt Bê Tông Tươi Ninh Bình | Hotline 0988 2662 93 An Gia Bình",
    seoDescription: "Liên hệ đặt mua bê tông tươi Ninh Bình giá tốt nhất. Khảo sát công trình miễn phí, điều xe bồn và bơm cần nhanh chóng 24/7.",
    seoKeywords: ["liên hệ bê tông an gia bình", "đặt bê tông tươi ninh bình", "hotline bê tông"],
    canonicalUrl: "https://betongangiabinh.vn/lien-he",
    isPublished: true,
    updatedAt: "2026-09-10"
  }
];

export const initialAiSettings: AiSettingsConfig = {
  activeProvider: "gemini",
  gemini: {
    apiKey: "",
    model: "gemini-2.5-flash",
  },
  openai: {
    apiKey: "",
    model: "gpt-4o",
    baseUrl: "https://api.openai.com/v1"
  },
  grok: {
    apiKey: "",
    model: "grok-2",
    baseUrl: "https://api.x.ai/v1"
  },
  claude: {
    apiKey: "",
    model: "claude-3-5-sonnet-20241022"
  },
  deepseek: {
    apiKey: "",
    model: "deepseek-chat",
    baseUrl: "https://api.deepseek.com"
  },
  testStatus: "idle"
};

export const initialSiteMenus: SiteMenu[] = [
  {
    id: "header-main",
    name: "Menu Chính (Header Navigation)",
    location: "header",
    items: [
      { id: "m-home", label: "Trang Chủ", url: "/", order: 1, isActive: true },
      { id: "m-about", label: "Về Chúng Tôi", url: "/about", order: 2, isActive: true },
      { id: "m-capacity", label: "Hồ Sơ Năng Lực", url: "/ho-so-nang-luc", order: 3, isActive: true, badge: "LAS-XD" },
      { id: "m-pricing", label: "Báo Giá Bê Tông", url: "/bang-gia", order: 4, isActive: true, badge: "2026" },
      { id: "m-projects", label: "Công Trình Tiêu Biểu", url: "/du-an", order: 5, isActive: true },
      { id: "m-blog", label: "Cẩm Nang Kỹ Thuật", url: "/blog", order: 6, isActive: true },
      { id: "m-contact", label: "Liên Hệ 24/7", url: "/lien-he", order: 7, isActive: true }
    ]
  },
  {
    id: "footer-services",
    name: "Dịch Vụ Chân Trang (Footer Services)",
    location: "footer-services",
    items: [
      { id: "fs-1", label: "Bê Tông Thương Phẩm Mác 100 - Mác 600", url: "/bang-gia", order: 1, isActive: true },
      { id: "fs-2", label: "Dịch Vụ Xe Bơm Cần 37m - 56m", url: "/bang-gia", order: 2, isActive: true },
      { id: "fs-3", label: "Bơm Tĩnh Đường Hẹp & Tầng Cao", url: "/bang-gia", order: 3, isActive: true },
      { id: "fs-4", label: "Bê Tông Phụ Gia Đông Kết Nhanh R7", url: "/blog", order: 4, isActive: true },
      { id: "fs-5", label: "Thí Nghiệm Nén Mẫu Bê Tông LAS", url: "/ho-so-nang-luc", order: 5, isActive: true }
    ]
  },
  {
    id: "footer-links",
    name: "Liên Kết & Chính Sách (Footer Links)",
    location: "footer-links",
    items: [
      { id: "fl-1", label: "Hồ Sơ Năng Lực Trạm Trộn", url: "/ho-so-nang-luc", order: 1, isActive: true },
      { id: "fl-2", label: "Quy Trình Kiểm Soát Chất Lượng", url: "/about", order: 2, isActive: true },
      { id: "fl-3", label: "Chính Sách Vận Chuyển", url: "/chinh-sach-van-chuyen", order: 3, isActive: true },
      { id: "fl-4", label: "Chính Sách Thanh Toán", url: "/chinh-sach-thanh-toan", order: 4, isActive: true },
      { id: "fl-5", label: "Liên Hệ Ban Giám Đốc", url: "/lien-he", order: 5, isActive: true }
    ]
  },
  {
    id: "mobile-quick",
    name: "Thanh Thao Tác Nhanh Di Động",
    location: "mobile",
    items: [
      { id: "mq-1", label: "Gọi Điện", url: "tel:0988266293", icon: "Phone", order: 1, isActive: true },
      { id: "mq-2", label: "Tính Khối Lượng", url: "/#calculator", icon: "Calculator", order: 2, isActive: true },
      { id: "mq-3", label: "Báo Giá", url: "/bang-gia", icon: "Tag", order: 3, isActive: true },
      { id: "mq-4", label: "Chỉ Đường", url: "/lien-he", icon: "MapPin", order: 4, isActive: true }
    ]
  }
];

export const initialSchemaSettings: SchemaSettings = {
  enabled: true,
  organizationName: "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
  alternateName: "Bê Tông An Gia Bình Ninh Bình",
  legalName: "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH",
  taxId: "2700870972",
  vatID: "2700870972",
  businessType: "LocalBusiness",
  logoUrl: "https://www.betongangiabinh.vn/logo.png",
  imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80",
  description: "Trạm trộn bê tông tươi, bê tông thương phẩm uy tín hàng đầu Ninh Bình với công suất 450m³/h (Trạm 1: KCN Khánh Phú & Trạm 2: Xã Kim Sơn). Cung cấp bê tông mác 150 - 500, xe bơm cần 37m-56m.",
  phone: "0988 2662 93",
  email: "ketoan.angiabinh@gmail.com",
  url: "https://www.betongangiabinh.vn",
  streetAddress: "KCN Khánh Phú, Huyện Yên Khánh",
  addressLocality: "Yên Khánh",
  addressRegion: "Ninh Bình",
  postalCode: "430000",
  addressCountry: "VN",
  latitude: 20.2506,
  longitude: 105.9744,
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/betongangiabinh/",
    "https://zalo.me/0988266293"
  ],
  postDefaultType: "BlogPosting",
  postDefaultAuthor: "Kỹ Sư An Gia Bình",
  postAuthorUrl: "https://www.betongangiabinh.vn/gioi-thieu",
  postPublisherLogo: "https://www.betongangiabinh.vn/logo.png",
  enableBreadcrumbs: true,
  autoExtractFaqSchema: true,
  pageDefaultType: "WebPage",
  customJsonLd: ""
};

export const initialAiSchedulerConfig: AiSchedulerConfig = {
  isEnabled: false,
  frequencyHours: 24,
  publishStatus: "published",
  targetCategory: "Kỹ Thuật Thi Công",
  focusTopics: [
    "Báo giá bê tông tươi Ninh Bình năm 2025 mới nhất",
    "Kỹ thuật đổ bê tông móng, dầm, sàn mác 250 và 300 chuẩn TCVN",
    "Giải pháp thi công bê tông phụ gia đông kết nhanh R7 cho tiến độ gấp",
    "Quy trình kiểm tra độ sụt, lấy mẫu nén thí nghiệm LAS-XD tại hiện trường",
    "Bảng so sánh chi phí bê tông tươi thương phẩm và bê tông trộn tay truyền thống"
  ],
  primaryKeyword: "bê tông tươi ninh bình",
  secondaryKeywords: [
    "báo giá bê tông ninh bình",
    "trạm trộn an gia bình",
    "mác bê tông 250 ninh bình",
    "xe bơm bê tông 52m",
    "kỹ thuật đổ sàn bê tông"
  ],
  minWordCount: 1000,
  insertInternalLinks: true,
  logs: [
    {
      id: "log-1",
      timestamp: "2026-09-10 08:30:00",
      postTitle: "Kỹ Thuật Thi Công Đổ Bê Tông Tươi Móng Nhà Chuẩn TCVN Tại Ninh Bình",
      wordCount: 1245,
      keywordsUsed: ["bê tông tươi ninh bình", "mác bê tông 250", "trạm trộn an gia bình"],
      internalLinksCount: 5,
      status: "success"
    }
  ]
};

export const initialMediaFolders: MediaFolder[] = [
  {
    id: "f-blog",
    name: "blog",
    path: "/images/blog",
    description: "Hình ảnh bài viết cẩm nang kỹ thuật & tin tức",
    color: "amber",
    createdAt: "2026-01-01"
  },
  {
    id: "f-projects",
    name: "du-an",
    path: "/images/du-an",
    description: "Hình ảnh công trình thực tế, cầu đường và nhà xưởng",
    color: "blue",
    createdAt: "2026-01-01"
  },
  {
    id: "f-batching",
    name: "tram-tron",
    path: "/images/tram-tron",
    description: "Trạm trộn KCN Khánh Phú & Kim Sơn, silo xi măng",
    color: "emerald",
    createdAt: "2026-01-01"
  },
  {
    id: "f-fleet",
    name: "doi-xe",
    path: "/images/doi-xe",
    description: "Đoàn xe bồn trộn và xe bơm cần 37m - 56m",
    color: "purple",
    createdAt: "2026-01-01"
  },
  {
    id: "f-certificates",
    name: "chung-chi",
    path: "/images/chung-chi",
    description: "Giấy chứng nhận hợp quy, chứng chỉ thí nghiệm LAS-XD",
    color: "slate",
    createdAt: "2026-01-01"
  }
];

