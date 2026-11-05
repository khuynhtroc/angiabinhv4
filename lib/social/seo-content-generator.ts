/**
 * SEO Social Copywriting & Content Optimization Engine for Bê Tông An Gia Bình
 * Tự động tối ưu nội dung bài đăng Facebook Fanpage và Telegram
 * Chuẩn cấu trúc 5 phần tối ưu SEO GEO & Kỹ thuật xây dựng:
 * 1. Hook Headline: Tiêu đề nổi bật kèm icon theo danh mục
 * 2. Đoạn dẫn nhập & Góc nhìn chuyên gia (Storytelling Hook)
 * 3. Tự động phát hiện & định dạng rõ ràng:
 *    📍 Trạm trộn & Nhà máy: Làm sạch và hiển thị chuẩn chỉ
 *    📞 Hotline tư vấn & đặt dịch vụ 24/7: Tự động gộp và loại bỏ các số điện thoại trùng lặp
 * 4. Mẹo bỏ túi & Kêu gọi hành động (CTA)
 * 5. Cụm 8 – 12 Hashtags chuẩn SEO Facebook & SEO GEO
 */

export interface SeoPostSource {
  title?: string;
  category?: string;
  categoryName?: string;
  excerpt?: string;
  summary?: string;
  seo_description?: string;
  seoDescription?: string;
  address?: string;
  phone?: string;
  hotline?: string;
  contactPhone?: string;
  url?: string;
  urlPath?: string;
  permalink?: string;
  slug?: string;
  region?: string;
  regionLabel?: string;
  tags?: string[];
  [key: string]: any;
}

/** Chuyển tiếng Việt có dấu thành chuỗi PascalCase cho hashtag (VD: "Quốc lộ 21B" -> "QuocLo21B") */
export function toHashtagSlug(str: string): string {
  if (!str) return '';
  const noTone = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

  return noTone
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

/** Chuẩn hóa một chuỗi số điện thoại Việt Nam thành định dạng đẹp mắt (VD: "0988 266 293") */
function formatVietnamesePhone(numStr: string): string | null {
  let digits = numStr.replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length >= 11) {
    digits = '0' + digits.slice(2);
  }

  // Di động 10 số (09x, 08x, 07x, 03x, 05x)
  if (digits.length === 10 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  // Cố định Ninh Bình & các tỉnh 11 số (đầu 0229, 024, 028...)
  if (digits.length === 11 && digits.startsWith('02')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  // Tổng đài 1900 / 1800
  if ((digits.startsWith('1900') || digits.startsWith('1800')) && (digits.length === 8 || digits.length === 10)) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  return null;
}

/** Tự động bóc tách, chuẩn hóa và loại bỏ các số điện thoại trùng lặp */
export function extractAndDeduplicatePhones(text: string, explicitPhone?: string): string {
  const candidates: string[] = [];

  if (explicitPhone) {
    candidates.push(explicitPhone);
  }

  if (text) {
    // Tách các trường hợp dính liền số điện thoại với chữ
    const preprocessed = text
      .replace(/(\d)\s*(Địa chỉ|Trạm trộn|Address|Đ\/c)/gi, '$1 $2')
      .replace(/(\d)\s*(Điện thoại|Hotline|SĐT|ĐT)/gi, '$1 $2');

    // Quét tìm tất cả các chuỗi có định dạng số điện thoại
    const matches = preprocessed.match(
      /(?:(?:\+84|84|0)[1-9][0-9\s.\-]{7,12}[0-9]|1900[\s.\-]?[0-9]{4,6}|1800[\s.\-]?[0-9]{4,6})/g
    );
    if (matches) {
      candidates.push(...matches);
    }
  }

  const uniquePhones: string[] = [];
  for (const raw of candidates) {
    const subParts = raw.split(/hoặc|\/|-|\bvà\b|;|•|,/i);
    for (const part of subParts) {
      const formatted = formatVietnamesePhone(part);
      if (formatted && !uniquePhones.includes(formatted)) {
        uniquePhones.push(formatted);
      }
    }
  }

  // Đảm bảo hotline chính thức của Bê Tông An Gia Bình luôn có mặt
  const defaultHotline = '0988 266 293';
  if (!uniquePhones.includes(defaultHotline)) {
    uniquePhones.unshift(defaultHotline);
  }

  return uniquePhones.slice(0, 2).join(' • ');
}

/** Làm sạch và chuẩn hóa địa chỉ trạm trộn hoặc công trình */
export function cleanAddressString(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();

  // Bỏ tiền tố
  cleaned = cleaned.replace(/^(?:Địa chỉ trạm|Địa chỉ|Trạm trộn|Nhà máy|Address|Đ\/c)[\s:–-]*/i, '');
  // Bỏ phần dính liền số điện thoại / hotline ở sau
  cleaned = cleaned.replace(/(?:Điện thoại|Hotline|Số điện thoại|ĐT|SĐT)[\s:–-]*.*$/i, '');
  // Bỏ ghi chú lặp
  cleaned = cleaned.replace(/[–•-]\s*Đạt chuẩn TCVN.*$/i, '');
  cleaned = cleaned.replace(/[–•-]\s*Giấy phép.*$/i, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/[.,;–—\-]+$/, '').trim();

  return cleaned;
}

/** Tự động bóc tách địa chỉ từ văn bản mô tả hoặc thuộc tính explicit */
export function extractAddress(text: string, explicitAddress?: string): string {
  if (explicitAddress) {
    const cleaned = cleanAddressString(explicitAddress);
    if (cleaned.length >= 8) return cleaned;
  }

  if (text) {
    const match = text.match(
      /(?:Địa chỉ|Trạm trộn|Nhà máy|Đ\/c)[\s:–-]*([^.–\n\r]+?(?:KCN|Khu công nghiệp|Cụm công nghiệp|phường|xã|huyện|thành phố|TP|thôn|xóm|số|đường|phố|tỉnh|đại lộ)[^.–\n\r]*)/i
    );
    if (match && match[1]) {
      const cleaned = cleanAddressString(match[1]);
      if (cleaned.length >= 10) return cleaned;
    }
  }

  return 'Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình • Trạm 2: Kim Sơn, Ninh Bình';
}

/** Làm sạch đoạn dẫn nhập (bỏ địa chỉ, hotline, câu khẩu hiệu lặp) */
export function extractCleanIntro(text: string): string {
  if (!text) return '';
  return text
    .replace(/(?:Điện thoại|Hotline|Số điện thoại|ĐT|SĐT)[\s:]*[0-9\s.hoặc/,-]{9,60}/gi, '')
    .replace(/(?:Địa chỉ|Trạm trộn|Nhà máy|Đ\/c)[\s:]*[^.–\n\r]+?(?:KCN|phường|xã|huyện|thành phố|TP|thôn|xóm|số|đường|phố|tỉnh)[^.–\n\r]*/gi, '')
    .replace(/Trạm trộn Bê Tông An Gia Bình đạt chuẩn TCVN.*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,;–—\-\s]+|[.,;–—\-\s]+$/g, '')
    .trim();
}

/** Xác định loại hình bài viết của Bê Tông An Gia Bình */
export function detectTopic(title: string, category: string, excerpt: string): string {
  const combined = `${title} ${category} ${excerpt}`.toLowerCase();

  // 1. Hạ tầng giao thông & công trình trọng điểm
  if (/cao tốc|quốc lộ|đường tỉnh|đt\d+|ql\d+|cầu |sân bay|hạ tầng|giao thông|ùn tắc|thông xe|khởi công|nâng cấp|đầu tư công|dự án khẩn cấp|tuyến đường/i.test(combined)) {
    return 'infrastructure';
  }

  // 2. Báo giá & chi phí vật tư
  if (/bảng giá|báo giá|đơn giá|giá bê tông|chi phí|ép cọc|mác 200|mác 250|mác 300|mác 350|m200|m250|m300|m350|m400/i.test(combined)) {
    return 'pricing';
  }

  // 3. Vật liệu xây dựng mới & công nghệ panel
  if (/bê tông nhẹ|sàn panel|bê tông nhựa|khí chưng áp|panel|vật liệu mới|tấm tường/i.test(combined)) {
    return 'material';
  }

  // 4. Bơm bê tông, xe bồn & thiết bị trạm trộn
  if (/xe bơm|bơm cần|bơm tĩnh|xe bồn|trạm trộn|cụm trạm|công suất trạm|vận chuyển bê tông/i.test(combined)) {
    return 'pump';
  }

  // 5. Kỹ thuật & tiêu chuẩn thi công
  if (/bảo dưỡng|độ sụt|nứt sàn|cấp phối|mác bê tông|cường độ|r28|phụ gia|chống thấm|đổ móng|đổ sàn|đổ dầm|đầm dùi|kỹ thuật|tcvn/i.test(combined)) {
    return 'technical';
  }

  // 6. Tin thị trường & bất động sản
  if (/thị trường|bất động sản|thời sự|quy hoạch|xây dựng/i.test(combined)) {
    return 'market';
  }

  return 'general';
}

/**
 * Tự động tạo bài đăng Facebook chuẩn SEO GEO cho Bê Tông An Gia Bình:
 * 1. Hook Headline: Tiêu đề nổi bật kèm icon theo danh mục
 * 2. Đoạn dẫn nhập & Giá trị chuyên gia (Storytelling Hook)
 * 3. Khối thông tin thực địa: 📍 Trạm trộn & 📞 Hotline tư vấn 24/7 (khử trùng số)
 * 4. Mẹo bỏ túi & Kêu gọi hành động (CTA)
 * 5. Cụm 8 – 12 Hashtags chuẩn SEO Facebook & SEO GEO
 */
export function buildOptimizedFacebookStatus(post: SeoPostSource, siteUrl = 'https://www.betongangiabinh.vn'): string {
  const rawTitle = (post.title || 'Bê Tông An Gia Bình').trim();
  const rawCategory = (post.category || post.categoryName || 'Tin Tức & Thị Trường').trim();
  const rawExcerpt = (post.excerpt || post.summary || post.seo_description || post.seoDescription || '').trim();

  let postPath = post.permalink || post.urlPath || post.url || '';
  if (!postPath && post.slug) {
    postPath = `/blog/tin-tuc/${post.slug}.html`;
  }
  const fullUrl = postPath.startsWith('http')
    ? postPath
    : `${siteUrl}${postPath.startsWith('/') ? '' : '/'}${postPath}`;

  const topic = detectTopic(rawTitle, rawCategory, rawExcerpt);
  const address = extractAddress(rawExcerpt, post.address);
  const phone = extractAndDeduplicatePhones(rawExcerpt, post.phone || post.hotline || post.contactPhone);
  const cleanIntro = extractCleanIntro(rawExcerpt);

  // 1. HOOK HEADLINE: TIÊU ĐỀ NỔI BẬT KÈM ICON THEO DANH MỤC
  const hookMap: Record<string, string> = {
    infrastructure: `🛣️ [TIẾN ĐỘ HẠ TẦNG & GIAO THÔNG] • ${rawTitle.toUpperCase()}`,
    pricing: `📊 [BẢNG GIÁ BÊ TÔNG TƯƠI MỚI NHẤT] • ${rawTitle.toUpperCase()}`,
    technical: `⚙️ [KỸ THUẬT & TIÊU CHUẨN ĐỔ BÊ TÔNG] • ${rawTitle.toUpperCase()}`,
    pump: `🚛 [CỤM TRẠM TRỘN & DỊCH VỤ XE BƠM 24/7] • ${rawTitle.toUpperCase()}`,
    material: `🧱 [VẬT LIỆU XÂY DỰNG CÔNG NGHỆ MỚI] • ${rawTitle.toUpperCase()}`,
    market: `📰 [THỊ TRƯỜNG XÂY DỰNG & VẬT LIỆU 24H] • ${rawTitle.toUpperCase()}`,
    general: `🏗️ [BÊ TÔNG AN GIA BÌNH - VỮNG BỀN MỌI CÔNG TRÌNH] • ${rawTitle.toUpperCase()}`,
  };
  const hookTitle = hookMap[topic] || hookMap.general;

  // 2. ĐOẠN DẪN NHẬP & GÓC NHÌN CHUYÊN GIA (STORYTELLING HOOK)
  let narrativeIntro = '';
  if (cleanIntro && cleanIntro.length >= 50 && cleanIntro.toLowerCase() !== rawTitle.toLowerCase()) {
    narrativeIntro = cleanIntro;
  } else {
    const introMap: Record<string, string> = {
      infrastructure: `Các dự án hạ tầng giao thông và công trình trọng điểm luôn đòi hỏi tiêu chuẩn khắt khe về chất lượng mác bê tông, tiến độ cấp hàng liên tục và kiểm soát chặt chẽ quy trình thử mẫu nghiệm thu. Đội ngũ kỹ sư Bê Tông An Gia Bình luôn sẵn sàng đồng hành cùng các nhà thầu thi công đạt chuẩn chất lượng và vượt tiến độ.`,
      pricing: `Bê Tông An Gia Bình cập nhật bảng báo giá bê tông tươi thương phẩm mới nhất, tối ưu chi phí vật tư cho các chủ đầu tư, nhà thầu và hộ gia đình tại Ninh Bình và các vùng lân cận. Cam kết đủ khối lượng, đúng mác thiết kế và niêm phong kẹp chì từng xe bồn xuất trạm.`,
      technical: `Quy trình thi công và dưỡng hộ đúng kỹ thuật là yếu tố then chốt quyết định 90% độ bền và khả năng chống nứt, chống thấm của kết cấu bê tông. Cùng chuyên gia kỹ thuật An Gia Bình tìm hiểu các giải pháp thi công tối ưu đảm bảo tuổi thọ công trình bền vững cùng thời gian.`,
      pump: `Hệ thống trạm trộn tự động hóa công suất cao cùng dàn xe bồn chuyên dụng và xe bơm cần hiện đại (37m - 56m, bơm tĩnh vươn xa) của An Gia Bình đáp ứng mọi yêu cầu cấp bê tông liên tục ngày đêm, kể cả các vị trí ngõ hẹp và nhà cao tầng.`,
      material: `Ứng dụng các dòng vật liệu xây dựng công nghệ mới giúp giảm tải trọng kết cấu, cách âm, cách nhiệt vượt trội và đẩy nhanh tiến độ thi công. Giải pháp xây dựng hiện đại cho các công trình xanh và thông minh.`,
      market: `Cập nhật những diễn biến mới nhất về thị trường vật liệu xây dựng, chính sách quy hoạch và tiến độ các dự án xây dựng trọng điểm. Góc nhìn chuyên sâu từ các kỹ sư xây dựng Bê Tông An Gia Bình.`,
      general: `Bê Tông An Gia Bình tự hào là đối tác tin cậy cung cấp bê tông thương phẩm chất lượng cao cho hàng nghìn công trình dân dụng và dự án công nghiệp trọng điểm tại Ninh Bình và các tỉnh lân cận.`,
    };
    narrativeIntro = introMap[topic] || introMap.general;
  }

  // 3. KHỐI THÔNG TIN THỰC ĐỊA: ĐỊA CHỈ & HOTLINE LỌC TRÙNG
  const infoLines: string[] = [];
  infoLines.push(`📍 Trạm trộn & Nhà máy: ${address}`);
  infoLines.push(`📞 Hotline tư vấn & đặt dịch vụ 24/7: ${phone}`);
  if (rawCategory) {
    infoLines.push(`🏷️ Chuyên mục: ${rawCategory}`);
  }

  const infoSection = `📌 THÔNG TIN LIÊN HỆ & NĂNG LỰC CUNG ỨNG:\n${infoLines.join('\n')}`;

  // 4. MẸO BỎ TÚI & KÊU GỌI HÀNH ĐỘNG (CTA)
  const tipMap: Record<string, string> = {
    infrastructure: `💡 Lời khuyên cho nhà thầu: Với các hạng mục đổ bê tông khối lớn, nên phối hợp chặt chẽ với trạm trộn để điều tiết tần suất xe bồn 10-15 phút/xe, tránh tình trạng chờ lâu làm suy giảm độ sụt thiết kế!`,
    pricing: `💡 Lời khuyên cho chủ đầu tư: Hãy liên hệ sớm trước 24h - 48h để kỹ sư trạm khảo sát mặt bằng, tư vấn cấp phối mác tối ưu chi phí và nhận chính sách chiết khấu trực tiếp tốt nhất!`,
    technical: `💡 Lời khuyên kỹ thuật: 7 ngày đầu tiên sau khi đổ là 'thời gian vàng' phát triển cường độ; hãy duy trì tưới nước dưỡng ẩm liên tục ngày 3-4 lần để phòng tránh tối đa hiện tượng rạn nứt bề mặt!`,
    pump: `💡 Lời khuyên cho công trình: Bố trí trước khoảng trống tối thiểu 4m cho xe bơm đỗ và đường vào thông thoáng cho xe bồn quay đầu để quá trình bơm bê tông diễn ra nhịp nhàng, an toàn!`,
    material: `💡 Lời khuyên: Khi thi công các dòng bê tông nhẹ và panel, nên sử dụng vữa dán chuyên dụng và xử lý mối nối chống thấm kỹ càng theo đúng khuyến cáo của nhà sản xuất!`,
    general: `💡 Lời khuyên: Luôn yêu cầu nhân viên kỹ thuật thử độ sụt bằng côn chuẩn tại công trình và giữ lại biên bản giao nhận có kẹp chì niêm phong xe bồn.`,
  };
  const tipText = tipMap[topic] || tipMap.general;

  const ctaSection = `👉 Xem chi tiết bài viết, phân tích kỹ thuật và nhận báo giá ưu đãi tại:\n🔗 ${fullUrl}`;

  // 5. CỤM 8 – 12 HASHTAGS CHUẨN SEO FACEBOOK & TỐI ƯU SEO GEO
  const tagList: string[] = [
    '#BeTongAnGiaBinh',
    '#AnGiaBinh',
    '#BeTongTuoi',
    '#BeTongThuongPham',
    '#TramTronBeTong',
    '#BeTongNinhBinh',
    '#BeTongTuoiNinhBinh',
    '#XayDungNinhBinh',
  ];

  const combinedLower = `${rawTitle} ${rawCategory} ${rawExcerpt}`.toLowerCase();

  // Thêm tags địa danh thực tế (SEO GEO)
  if (combinedLower.includes('yên khánh') || combinedLower.includes('khanh phu')) {
    tagList.push('#YenKhanh');
  }
  if (combinedLower.includes('kim sơn')) {
    tagList.push('#KimSon');
  }
  if (combinedLower.includes('hoa lư')) {
    tagList.push('#HoaLu');
  }
  if (combinedLower.includes('tam điệp')) {
    tagList.push('#TamDiep');
  }
  if (combinedLower.includes('gia viễn')) {
    tagList.push('#GiaVien');
  }
  if (combinedLower.includes('nam định')) {
    tagList.push('#BeTongNamDinh');
  }
  if (combinedLower.includes('hà nam')) {
    tagList.push('#BeTongHaNam');
  }

  // Thêm tags theo danh mục
  if (topic === 'pricing') {
    tagList.push('#BaoGiaBeTong', '#GiaBeTongTuoi');
  } else if (topic === 'infrastructure') {
    tagList.push('#HaTangGiaoThong', '#TienDoCongTrinh');
  } else if (topic === 'technical') {
    tagList.push('#KyThuatBeTong', '#BaoDuongBeTong');
  } else if (topic === 'pump') {
    tagList.push('#XeBomBeTong', '#XeBonBeTong');
  } else {
    tagList.push('#VatLieuXayDung', '#DoBeTong');
  }

  // Thêm hashtag PascalCase từ tiêu đề bài viết
  const titleTag = toHashtagSlug(rawTitle);
  if (titleTag && titleTag.length > 3) {
    tagList.push(`#${titleTag}`);
  }

  // Khử trùng lặp tags
  const uniqueTags: string[] = [];
  for (const t of tagList) {
    if (!uniqueTags.includes(t)) {
      uniqueTags.push(t);
    }
  }

  // Cân đối chính xác từ 8 đến 12 hashtags chuẩn SEO Facebook
  const geoFallbacks = [
    '#NinhBinh',
    '#VatLieuXayDung',
    '#DoBeTongChatLuong',
    '#KienTrucXayDung',
  ];

  for (const fb of geoFallbacks) {
    if (uniqueTags.length < 8 && !uniqueTags.includes(fb)) {
      uniqueTags.push(fb);
    }
  }

  const finalTags = uniqueTags.length > 12 ? uniqueTags.slice(0, 12) : uniqueTags;
  const hashtagLine = finalTags.join(' ');

  // KẾT HỢP 5 PHẦN HOÀN CHỈNH
  return [
    hookTitle,
    '',
    narrativeIntro,
    '',
    infoSection,
    '',
    tipText,
    '',
    ctaSection,
    '',
    hashtagLine,
  ].join('\n').trim();
}

/**
 * Tự động tạo bài đăng Telegram chuẩn định dạng HTML cho Bê Tông An Gia Bình.
 */
export function buildOptimizedTelegramMessage(post: SeoPostSource, siteUrl = 'https://www.betongangiabinh.vn'): string {
  const rawTitle = (post.title || 'Bê Tông An Gia Bình').trim();
  const rawExcerpt = (post.excerpt || post.summary || post.seo_description || post.seoDescription || '').trim();
  let postPath = post.permalink || post.urlPath || post.url || '';
  if (!postPath && post.slug) {
    postPath = `/blog/tin-tuc/${post.slug}.html`;
  }
  const fullUrl = postPath.startsWith('http')
    ? postPath
    : `${siteUrl}${postPath.startsWith('/') ? '' : '/'}${postPath}`;

  const address = extractAddress(rawExcerpt, post.address);
  const phone = extractAndDeduplicatePhones(rawExcerpt, post.phone || post.hotline || post.contactPhone);
  const cleanIntro = extractCleanIntro(rawExcerpt);

  let text = `📢 <b>[BÊ TÔNG AN GIA BÌNH - THÔNG TIN KỸ THUẬT & DỰ ÁN]</b>\n\n`;
  text += `🏗️ <b>${rawTitle}</b>\n\n`;

  if (cleanIntro && cleanIntro.length > 20) {
    text += `${cleanIntro}\n\n`;
  }

  text += `📌 <b>THÔNG TIN LIÊN HỆ & NĂNG LỰC CUNG ỨNG:</b>\n`;
  text += `📍 <b>Trạm trộn:</b> ${address}\n`;
  text += `📞 <b>Hotline tư vấn 24/7:</b> ${phone}\n\n`;

  text += `👉 <a href="${fullUrl}">Xem chi tiết bài viết, phân tích kỹ thuật và báo giá tại đây</a>\n\n`;
  text += `#BeTongAnGiaBinh #BeTongTuoi #BeTongNinhBinh #TramTronBeTong`;

  return text;
}

