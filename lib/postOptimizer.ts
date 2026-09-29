/**
 * Comprehensive Post Optimizer Utility for Bê Tông An Gia Bình
 * - Brand Alignment & Competitor Contact Sanitization
 * - Content Clutter & Special Character Cleaning
 * - Excerpt & Meta Description Auto-Generation
 * - Auto-Suggestions for Primary Keywords, Secondary Keywords & Tags
 * - Contextual Internal Links & Technical CTA Box Injection
 */

export interface OptimizeOptions {
  sanitizeBrandAndContact?: boolean;
  cleanClutterAndSpecialChars?: boolean;
  standardizeHeadings?: boolean;
  removeCommitments?: boolean;
  injectInternalLinks?: boolean;
  injectCtaBox?: boolean;
  optimizeTitle?: boolean;
  optimizeExcerpt?: boolean;
  // Aliases for convenience
  cleanClutter?: boolean;
  brandAndContact?: boolean;
  addInternalLinks?: boolean;
  addTechnicalCtaBox?: boolean;
  optimizeMetaDescription?: boolean;
}

export interface OptimizationStats {
  competitorContactsReplaced: number;
  clutterCleaned: number;
  commitmentsRemoved: number;
  internalLinksAdded: number;
  headingsStandardized: boolean;
  ctaBoxAdded: boolean;
}

export interface OptimizeResult {
  optimizedTitle: string;
  optimizedExcerpt: string;
  optimizedMetaDescription: string;
  optimizedContent: string;
  // Convenience aliases for backward compatibility
  title: string;
  excerpt: string;
  metaDescription: string;
  content: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  suggestedTags: string[];
  wordCount: number;
  seoScore: number;
  stats: OptimizationStats;
  optimizationsApplied: string[];
  competitorContactsReplaced: number;
  clutterCleaned: number;
  internalLinksAdded: number;
  headingsStandardized: number;
}

// Internal link dictionary for Bê Tông An Gia Bình
export const INTERNAL_LINK_RULES = [
  {
    regex: /(?:báo giá bê tông tươi|giá bê tông tươi ninh bình|báo giá bê tông|bảng giá bê tông|đơn giá bê tông tươi)(?![^<]*<\/a>)(?![^\[]*\])/i,
    anchor: 'báo giá bê tông tươi Ninh Bình',
    url: '/bang-gia',
    title: 'Xem bảng báo giá bê tông tươi Ninh Bình mới nhất'
  },
  {
    regex: /(?:trạm trộn an gia bình|bê tông an gia bình|nhà máy bê tông an gia bình|công ty bê tông an gia bình)(?![^<]*<\/a>)(?![^\[]*\])/i,
    anchor: 'Trạm trộn Bê Tông An Gia Bình',
    url: '/gioi-thieu',
    title: 'Giới thiệu năng lực trạm trộn Bê Tông An Gia Bình Ninh Bình'
  },
  {
    regex: /(?:quy trình kiểm định|thí nghiệm nén mẫu|kiểm soát chất lượng|chuẩn tcvn|tiêu chuẩn tcvn 9340|phòng las-xd)(?![^<]*<\/a>)(?![^\[]*\])/i,
    anchor: 'quy trình kiểm định chất lượng nén mẫu chuẩn TCVN',
    url: '/quy-trinh-san-xuat',
    title: 'Quy trình kiểm soát chất lượng bê tông thương phẩm đạt chuẩn TCVN'
  },
  {
    regex: /(?:dự án tiêu biểu|công trình tiêu biểu|dự án đã thi công|hồ sơ năng lực)(?![^<]*<\/a>)(?![^\[]*\])/i,
    anchor: 'các dự án công trình tiêu biểu tại Ninh Bình',
    url: '/du-an',
    title: 'Hồ sơ các công trình dự án Bê Tông An Gia Bình đã cung ứng'
  },
  {
    regex: /(?:liên hệ đặt lịch|tư vấn kỹ thuật|hotline đặt bê tông|tư vấn đổ bê tông|khảo sát hiện trường)(?![^<]*<\/a>)(?![^\[]*\])/i,
    anchor: 'liên hệ kỹ sư Bê Tông An Gia Bình (0988 2662 93)',
    url: '/lien-he',
    title: 'Liên hệ tư vấn và điều độ xe bơm bê tông tươi 24/7'
  }
];

// Subjective commitment phrases to sanitize for Google E-E-A-T
export const COMMITMENT_REPLACEMENTS = [
  { regex: /cam kết 100%/gi, replacement: 'đáp ứng tiêu chuẩn nghiêm ngặt' },
  { regex: /cam kết rẻ nhất(?: thị trường)?/gi, replacement: 'tối ưu chi phí cạnh tranh trực tiếp từ trạm trộn' },
  { regex: /cam kết chất lượng số 1/gi, replacement: 'đảm bảo chất lượng đạt chuẩn TCVN 9340:2012' },
  { regex: /tuyệt đối không bao giờ nứt/gi, replacement: 'hạn chế tối đa rủi ro nứt co ngót khi bảo dưỡng đúng kỹ thuật' },
  { regex: /cam kết tốt nhất việt nam/gi, replacement: 'đáp ứng tiêu chuẩn chất lượng cao theo đúng mác thiết kế' },
  { regex: /rẻ nhất miền bắc/gi, replacement: 'báo giá cạnh tranh tại Ninh Bình' },
  { regex: /khẳng định 100%/gi, replacement: 'được kiểm định thực nghiệm' }
];

// Competitor phone numbers (excluding An Gia Bình: 0988 2662 93, 0988266293, 0988.266.293)
const AN_GIA_BINH_PHONES = ['0988266293', '0988 2662 93', '0988.266.293'];
const AGB_PHONE_STANDARD = '0988 2662 93';
const AGB_EMAIL_STANDARD = 'ketoan.angiabinh@gmail.com';
const AGB_COMPANY_STANDARD = 'Bê Tông An Gia Bình';
const AGB_PLANT_ADDRESS = 'Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình | Trạm 2: Xã Kim Sơn, Tỉnh Ninh Bình';

// Known competitor brands and variations
const COMPETITOR_NAME_PATTERNS = [
  /(?:Công ty|Công Ty|Bê Tông|Bê tông|Be tong)\s+(?:Việt Nhật|Viet Nhat|Chèm|Chem|Rạng Đông|Rang Dong|Việt Đức|Viet Duc|Hoàng Mai|Hoang Mai|HUD|Sông Đà|Song Da|Xuân Mai|Xuan Mai|Vinaconex|Chinfon|Nghi Sơn|Nghi Son|Hà Nam|Ha Nam|Hà Nội|Ha Noi|Phúc Thịnh|Phuc Thinh|Đại Phong|Dai Phong|Bảo Quân|Bao Quan|Vĩnh Tuy|Vinh Tuy|Thịnh Liệt|Thinh Liet|Thăng Long|Thang Long)/gi,
  /(?:Công ty TNHH|Công ty Cổ phần|Công ty CP|CTCP|Doanh nghiệp)\s+(?!.*An Gia Bình)[A-ZÀ-Ỹa-zà-ỹ0-9\s]{3,35}(?:Bê tông|Bê Tông|Vật liệu xây dựng)/g
];

/**
 * 1. Sanitize Brand & Competitor Contacts to Bê Tông An Gia Bình
 */
export function sanitizeBrandAndCompetitors(content: string): { text: string; replacementsCount: number } {
  let text = content;
  let count = 0;

  // Replace competitor names with Bê Tông An Gia Bình
  COMPETITOR_NAME_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      text = text.replace(pattern, () => {
        count++;
        return AGB_COMPANY_STANDARD;
      });
    }
  });

  // Replace other phone numbers with An Gia Bình hotline
  // Match standard VN phone numbers: (0|84) + (2x|3x|5x|7x|8x|9x) + 7-8 digits
  const phoneRegex = /(?:\+84|0)(?:2\d{1,2}|3\d|5\d|7\d|8\d|9\d)[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g;
  text = text.replace(phoneRegex, (matched) => {
    const digits = matched.replace(/\D/g, '');
    const cleanDigits = digits.startsWith('84') ? '0' + digits.slice(2) : digits;
    if (cleanDigits === '0988266293') {
      return AGB_PHONE_STANDARD;
    }
    count++;
    return AGB_PHONE_STANDARD;
  });

  // Replace competitor emails with An Gia Bình official email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  text = text.replace(emailRegex, (matched) => {
    if (matched.toLowerCase() === 'ketoan.angiabinh@gmail.com') {
      return matched;
    }
    count++;
    return AGB_EMAIL_STANDARD;
  });

  // Replace competitor batching plant address phrases
  const competitorAddressRegex = /(?:Địa chỉ|Trụ sở|Nhà máy|Trạm trộn|Địa điểm trạm)(?:\s*:\s*|\s*-\s*)(?!.*Khánh Phú)(?!.*Kim Sơn)(?!.*Ninh Bình)[^\n.]{15,100}/gi;
  text = text.replace(competitorAddressRegex, () => {
    count++;
    return `Địa chỉ trạm trộn: ${AGB_PLANT_ADDRESS}`;
  });

  return { text, replacementsCount: count };
}

/**
 * 2. Remove Clutter, Broken Liquid/Template tags & Special Character Junk
 */
export function cleanClutterAndJunk(content: string, postTitle?: string): { text: string; cleanCount: number } {
  let text = content;
  let cleanCount = 0;

  // 1. Remove broken liquid tags: {{ site.url }}, {{ site.baseurl }}, {% ... %}
  if (/\{\{\s*site\.(?:url|baseurl)\s*\}\}/g.test(text)) {
    text = text.replace(/\{\{\s*site\.(?:url|baseurl)\s*\}\}/g, '');
    cleanCount++;
  }
  if (/\{%\s*.*?\s*%\}/g.test(text)) {
    text = text.replace(/\{%\s*.*?\s*%\}/g, '');
    cleanCount++;
  }

  // 2. Clean broken markdown images with liquid syntax like: ![]({{ site.url }}/...)
  text = text.replace(/!\[(.*?)\]\(\s*\{\{\s*site\.(?:url|baseurl)\s*\}\}(.*?)\)/g, (_m, alt, path) => {
    cleanCount++;
    return `![${alt}](${path.startsWith('/') ? path : '/' + path})`;
  });

  // 3. Remove external source clutter / spam anchors / click here
  const clutterPatterns = [
    /(?:quảng cáo|banner tài trợ|liên kết ngoài|click here|nhấp vào đây để xem chi tiết|nguồn bài viết\s*:.*|theo nguồn\s*:.*|bản quyền thuộc về.*)/gi,
    /(?:bài viết liên quan|bài cùng chuyên mục|xem thêm các tin khác\s*:?)(?:\r?\n(?:\s*[-*]\s*.*))+/gi,
    /(?:đăng ngày\s*:?\s*\d{1,2}\/\d{1,2}\/\d{4}|lượt xem\s*:?\s*\d+|tác giả\s*:?\s*[a-zà-ỹ\s]+)(?:\s*\|\s*)?/gi
  ];

  clutterPatterns.forEach(cp => {
    if (cp.test(text)) {
      text = text.replace(cp, '');
      cleanCount++;
    }
  });

  // 4. Remove unicode replacement chars and control chars (e.g. \uFFFD, &nbsp;, &#160;)
  if (/\uFFFD/g.test(text)) {
    text = text.replace(/\uFFFD/g, '');
    cleanCount++;
  }
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&#160;/g, ' ');
  text = text.replace(/&amp;nbsp;/gi, ' ');

  // 5. Standardize Markdown headings: ensure space after #
  text = text.replace(/^(#{1,6})([^\s#])/gm, (_m, hashes, rest) => {
    cleanCount++;
    return `${hashes} ${rest}`;
  });

  // 6. Condense excessive blank lines (more than 2 consecutive newlines)
  text = text.replace(/\n{3,}/g, '\n\n');

  return { text: text.trim(), cleanCount };
}

/**
 * 3. Standardize Headings Structure
 */
export function standardizeHeadings(content: string, title?: string): { text: string; standardized: boolean } {
  let text = content;
  let standardized = false;

  // If content has no H2 tags, promote primary bold sections or structure it
  if (!text.includes('## ') && !text.includes('<h2>')) {
    // Check if there are strong bold paragraphs like **1. ...** and convert to ##
    const boldHeadingRegex = /^\*\*(\d+[\.\)]\s*[^*]+)\*\*/gm;
    if (boldHeadingRegex.test(text)) {
      text = text.replace(boldHeadingRegex, '## $1');
      standardized = true;
    } else {
      // Prepend a structured H2 opening section
      const introH2 = `## 1. Tổng Quan Kỹ Thuật & Yêu Cầu Cốt Lõi\n\n`;
      text = introH2 + text;
      standardized = true;
    }
  }

  return { text, standardized };
}

/**
 * 4. Technical CTA Box Generator
 */
export function generateTechnicalCtaBox(): string {
  return `
<div class="my-8 p-6 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-lg">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
    <span>★ Trạm Trộn Bê Tông An Gia Bình Ninh Bình</span>
  </div>
  <h3 class="text-lg font-black text-white mb-2">Cần Tư Vấn Cấp Phối &amp; Báo Giá Tận Chân Công Trình?</h3>
  <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
    Chúng tôi cung ứng bê tông tươi đạt chuẩn TCVN từ Mác 150 đến Mác 600, thí nghiệm nén mẫu R7/R28 tại phòng LAS-XD, đội ngũ 35+ xe bồn chuyên dụng và bơm cần 37m - 56m phục vụ 24/7 khắp Ninh Bình và vùng lân cận.
  </p>
  <div class="flex flex-wrap items-center gap-4">
    <a href="tel:0988266293" class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow">
      <span>📞 Hotline Kỹ Thuật: 0988 2662 93</span>
    </a>
    <a href="/bang-gia" class="text-xs text-amber-300 font-bold hover:underline">
      Xem Bảng Báo Giá Chi Tiết &rarr;
    </a>
  </div>
</div>`;
}

/**
 * 5. Suggest Primary Keywords, Secondary Keywords & Tags from Title and Content
 */
export function suggestKeywordsAndTags(title: string, content: string = '', category?: string): {
  primaryKeyword: string;
  secondaryKeywords: string;
  tags: string[];
} {
  const cleanTitle = (title || '').trim();
  const lowerTitle = cleanTitle.toLowerCase();
  const combinedText = `${cleanTitle} ${content.slice(0, 1000)}`.toLowerCase();

  // 1. Identify primary keyword
  let primary = 'bê tông tươi ninh bình';
  if (lowerTitle.includes('báo giá') || lowerTitle.includes('giá bê tông')) {
    primary = 'giá bê tông tươi ninh bình';
  } else if (lowerTitle.includes('mác 250') || lowerTitle.includes('mac 250')) {
    primary = 'bê tông mác 250 ninh bình';
  } else if (lowerTitle.includes('mác 300') || lowerTitle.includes('mac 300')) {
    primary = 'bê tông mác 300 ninh bình';
  } else if (lowerTitle.includes('đổ sàn') || lowerTitle.includes('đổ móng') || lowerTitle.includes('kỹ thuật')) {
    primary = 'kỹ thuật đổ bê tông tươi ninh bình';
  } else if (lowerTitle.includes('độ sụt') || lowerTitle.includes('kiểm tra độ sụt')) {
    primary = 'kiểm tra độ sụt bê tông tươi';
  } else if (lowerTitle.includes('bảo dưỡng') || lowerTitle.includes('nứt')) {
    primary = 'bảo dưỡng bê tông tươi';
  } else if (lowerTitle.includes('xe bơm') || lowerTitle.includes('bơm cần')) {
    primary = 'thuê xe bơm bê tông ninh bình';
  } else if (lowerTitle.includes('kim sơn')) {
    primary = 'bê tông tươi kim sơn ninh bình';
  } else if (lowerTitle.includes('yên khánh') || lowerTitle.includes('khánh phú')) {
    primary = 'bê tông tươi yên khánh ninh bình';
  } else if (lowerTitle.includes('hoa lư')) {
    primary = 'bê tông tươi hoa lư ninh bình';
  } else if (lowerTitle.includes('tam điệp')) {
    primary = 'bê tông tươi tam điệp ninh bình';
  }

  // 2. Derive secondary keywords
  const secondaryList = [
    'trạm trộn an gia bình',
    'giá bê tông ninh bình',
    'bê tông thương phẩm tcvn',
    'xe bồn đổ bê tông ninh bình',
    'kinh nghiệm đổ bê tông'
  ];

  if (category) {
    if (category.toLowerCase().includes('kỹ thuật') || category.toLowerCase().includes('thi công')) {
      secondaryList[0] = 'kỹ thuật thi công bê tông';
      secondaryList[1] = 'quy chuẩn nén mẫu las-xd';
    } else if (category.toLowerCase().includes('báo giá')) {
      secondaryList[0] = 'đơn giá bê tông mác 200 mác 250 mác 300';
      secondaryList[1] = 'chi phí đổ bê tông tươi trọn gói';
    }
  }

  // 3. Extract relevant tags
  const tagsSet = new Set<string>();
  tagsSet.add('Bê tông Ninh Bình');
  tagsSet.add('Bê tông An Gia Bình');
  tagsSet.add(primary);

  if (combinedText.includes('mác') || combinedText.includes('mac')) tagsSet.add('Mác bê tông');
  if (combinedText.includes('bảo dưỡng')) tagsSet.add('Bảo dưỡng bê tông');
  if (combinedText.includes('xe bơm') || combinedText.includes('bơm cần')) tagsSet.add('Xe bơm bê tông');
  if (combinedText.includes('kim sơn')) tagsSet.add('Kim Sơn');
  if (combinedText.includes('khánh phú') || combinedText.includes('yên khánh')) tagsSet.add('Yên Khánh');
  if (combinedText.includes('giá') || combinedText.includes('báo giá')) tagsSet.add('Báo giá bê tông');
  if (combinedText.includes('tcvn') || combinedText.includes('tiêu chuẩn')) tagsSet.add('Tiêu chuẩn TCVN');

  return {
    primaryKeyword: primary,
    secondaryKeywords: secondaryList.slice(0, 4).join(', '),
    tags: Array.from(tagsSet).slice(0, 6)
  };
}

/**
 * 6. Generate Optimized Meta Description / Excerpt (140 - 160 characters)
 */
export function generateOptimizedExcerpt(
  title: string,
  content: string = '',
  primaryKeyword?: string
): string {
  const kw = primaryKeyword || 'bê tông tươi Ninh Bình';
  const cleanTitle = title.replace(/\s*\|\s*Bê Tông An Gia Bình.*$/i, '').trim();

  // Strip markdown/html from content to get first sentence
  const plainContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#*`_>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  let firstThought = plainContent.slice(0, 90).trim();
  if (!firstThought || firstThought.length < 20) {
    firstThought = `Cẩm nang kỹ thuật & báo giá ${cleanTitle}`;
  }

  // Ensure brand, standard and contact phone fit within 140-160 chars
  const template = `${firstThought}. Trạm trộn Bê Tông An Gia Bình đạt chuẩn TCVN, cung ứng 24/7 hotline 0988 2662 93.`;

  if (template.length > 160) {
    return template.slice(0, 157) + '...';
  }
  if (template.length < 130) {
    return `${cleanTitle} chuẩn TCVN từ trạm trộn Bê Tông An Gia Bình. Cung cấp xe bồn, xe bơm cần, nén mẫu LAS-XD, hỗ trợ 24/7 hotline 0988 2662 93.`.slice(0, 160);
  }
  return template;
}

/**
 * 7. Master Optimization Function (Local Fast Deterministic Engine)
 */
export function optimizePostFull(
  post: {
    title: string;
    content: string;
    category?: string;
    excerpt?: string;
    seoDescription?: string;
    focusKeywords?: string[];
  },
  options: OptimizeOptions = {}
): OptimizeResult {
  const opts: OptimizeOptions = {
    sanitizeBrandAndContact: options.brandAndContact ?? options.sanitizeBrandAndContact ?? true,
    cleanClutterAndSpecialChars: options.cleanClutter ?? options.cleanClutterAndSpecialChars ?? true,
    standardizeHeadings: options.standardizeHeadings ?? true,
    removeCommitments: options.removeCommitments ?? true,
    injectInternalLinks: options.addInternalLinks ?? options.injectInternalLinks ?? true,
    injectCtaBox: options.addTechnicalCtaBox ?? options.injectCtaBox ?? true,
    optimizeTitle: options.optimizeTitle ?? true,
    optimizeExcerpt: options.optimizeMetaDescription ?? options.optimizeExcerpt ?? true,
    ...options
  };

  let content = post.content || '';
  const stats: OptimizationStats = {
    competitorContactsReplaced: 0,
    clutterCleaned: 0,
    commitmentsRemoved: 0,
    internalLinksAdded: 0,
    headingsStandardized: false,
    ctaBoxAdded: false
  };
  const applied: string[] = [];

  // 1. Sanitize Brand and Competitor Info
  if (opts.sanitizeBrandAndContact) {
    const brandRes = sanitizeBrandAndCompetitors(content);
    content = brandRes.text;
    stats.competitorContactsReplaced = brandRes.replacementsCount;
    if (brandRes.replacementsCount > 0) {
      applied.push(`Đã chuẩn hóa thông tin liên hệ và thay thế ${brandRes.replacementsCount} vị trí đơn vị khác thành Bê Tông An Gia Bình (Hotline 0988 2662 93)`);
    }
  }

  // 2. Clean Clutter and Special Characters
  if (opts.cleanClutterAndSpecialChars) {
    const cleanRes = cleanClutterAndJunk(content, post.title);
    content = cleanRes.text;
    stats.clutterCleaned = cleanRes.cleanCount;
    if (cleanRes.cleanCount > 0) {
      applied.push(`Đã loại bỏ các ký tự rác, thẻ template lỗi và nội dung thừa thãi (${cleanRes.cleanCount} mục)`);
    }
  }

  // 3. Remove Subjective Commitments
  if (opts.removeCommitments) {
    COMMITMENT_REPLACEMENTS.forEach(({ regex, replacement }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        stats.commitmentsRemoved++;
      }
    });
    if (stats.commitmentsRemoved > 0) {
      applied.push(`Đã thay thế ${stats.commitmentsRemoved} cụm từ khẳng định cam kết chủ quan theo chuẩn Google E-E-A-T`);
    }
  }

  // 4. Standardize Headings
  if (opts.standardizeHeadings) {
    const headRes = standardizeHeadings(content, post.title);
    content = headRes.text;
    stats.headingsStandardized = headRes.standardized;
    if (headRes.standardized) {
      applied.push('Đã chuẩn hóa cấu trúc phân cấp thẻ tiêu đề (H2, H3)');
    }
  }

  // 5. Inject Internal Links
  if (opts.injectInternalLinks) {
    INTERNAL_LINK_RULES.forEach(({ regex, anchor, url, title }) => {
      if (!content.includes(url) && regex.test(content)) {
        content = content.replace(regex, `<a href="${url}" title="${title}" class="text-amber-600 font-semibold hover:underline">${anchor}</a>`);
        stats.internalLinksAdded++;
      }
    });
    if (stats.internalLinksAdded > 0) {
      applied.push(`Tự động lồng ghép ${stats.internalLinksAdded} liên kết nội bộ tự nhiên`);
    }
  }

  // 6. Inject Technical CTA Box if not present
  if (opts.injectCtaBox && !content.includes('0988 2662 93') && !content.includes('0988.266.293')) {
    content = content + '\n' + generateTechnicalCtaBox();
    stats.ctaBoxAdded = true;
    applied.push('Đã chèn khung Hotline kỹ thuật & Trạm trộn Bê Tông An Gia Bình');
  }

  // 7. Suggest Keywords & Tags
  const kwSuggestions = suggestKeywordsAndTags(post.title, content, post.category);
  const primaryKw = post.focusKeywords?.[0] || kwSuggestions.primaryKeyword;
  const secondaryKw = post.focusKeywords?.slice(1).join(', ') || kwSuggestions.secondaryKeywords;

  // 8. Optimize Title
  let title = post.title;
  if (opts.optimizeTitle) {
    const cleanT = post.title.replace(/\s*\|\s*Bê Tông An Gia Bình.*$/i, '').trim();
    if (!cleanT.toLowerCase().includes('ninh bình') && !cleanT.toLowerCase().includes('an gia bình')) {
      title = `${cleanT} Tại Ninh Bình | Bê Tông An Gia Bình`;
    } else if (!cleanT.toLowerCase().includes('an gia bình')) {
      title = `${cleanT} | Bê Tông An Gia Bình`;
    } else {
      title = cleanT;
    }
    applied.push('Đã tối ưu thẻ Title chứa thương hiệu và địa danh Ninh Bình');
  }

  // 9. Optimize Excerpt / Meta Description
  const metaDesc = generateOptimizedExcerpt(title, content, primaryKw);
  applied.push('Tự động tối ưu đoạn tóm tắt Excerpt & Meta Description (140-160 ký tự chuẩn Google)');

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  let score = 88;
  if (stats.internalLinksAdded > 0) score += 3;
  if (stats.competitorContactsReplaced > 0) score += 2;
  if (stats.commitmentsRemoved > 0) score += 2;
  if (metaDesc.length >= 135 && metaDesc.length <= 165) score += 3;
  if (wordCount >= 1000) score += 2;
  score = Math.min(98, score);

  return {
    optimizedTitle: title,
    optimizedExcerpt: metaDesc,
    optimizedMetaDescription: metaDesc,
    optimizedContent: content,
    title,
    excerpt: metaDesc,
    metaDescription: metaDesc,
    content,
    primaryKeyword: primaryKw,
    secondaryKeywords: secondaryKw,
    suggestedTags: kwSuggestions.tags,
    wordCount,
    seoScore: score,
    stats,
    optimizationsApplied: applied,
    competitorContactsReplaced: stats.competitorContactsReplaced,
    clutterCleaned: stats.clutterCleaned,
    internalLinksAdded: stats.internalLinksAdded,
    headingsStandardized: stats.headingsStandardized ? 1 : 0
  };
}

/**
 * 8. Alias Helper for Excerpt / Meta Description Generation
 */
export function generateOptimizedMetaDescription(
  post: { title: string; content: string; focusKeywords?: string[] } | string,
  contentText?: string,
  kw?: string
): string {
  if (typeof post === 'string') {
    return generateOptimizedExcerpt(post, contentText || '', kw);
  }
  const primaryKw = post.focusKeywords?.[0] || '';
  return generateOptimizedExcerpt(post.title, post.content, primaryKw);
}
