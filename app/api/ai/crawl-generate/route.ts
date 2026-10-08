import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { getAllPostsServer } from "@/lib/server-data";

// Curated high quality concrete construction images with Vietnamese context
const CONCRETE_IMAGE_CATALOG = [
  {
    id: "tram-tron",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80",
    alt: "Trạm trộn bê tông tươi An Gia Bình công suất lớn tại Ninh Bình",
    caption: "Toàn cảnh trạm trộn bê tông tự động hóa hiện đại của Bê Tông An Gia Bình tại KCN Khánh Phú và Kim Sơn.",
    keywords: ["trạm", "trạm trộn", "công suất", "sản xuất", "nhà máy", "báo giá", "giá", "an gia bình", "tổng quan"]
  },
  {
    id: "do-san",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    alt: "Thi công đổ bê tông sàn dầm cột công trình Ninh Bình",
    caption: "Công nhân thi công cào cán, đầm dùi bê tông tươi mặt sàn nhà xưởng và biệt thự đạt chuẩn kỹ thuật TCVN.",
    keywords: ["sàn", "đổ sàn", "đầm dùi", "mác 250", "nhà phố", "dầm", "cột", "thi công", "quy trình"]
  },
  {
    id: "xe-bon",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80",
    alt: "Đội xe bồn vận chuyển bê tông thương phẩm An Gia Bình",
    caption: "Đội ngũ hơn 35 xe bồn chuyên dụng vận chuyển bê tông tươi giao tận chân công trình khắp Ninh Bình.",
    keywords: ["xe bồn", "xe", "vận chuyển", "xe bồn bê tông", "giao hàng", "đội xe", "tiến độ"]
  },
  {
    id: "xe-bom",
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80",
    alt: "Xe bơm cần bê tông tươi vươn cao tại công trình Ninh Bình",
    caption: "Xe bơm cần 37m - 56m công suất lớn vươn cần đổ bê tông sàn cao tầng nhanh chóng, chuẩn xác.",
    keywords: ["bơm", "xe bơm", "bơm cần", "bơm tĩnh", "cần 52m", "cần 37m", "áp lực cao", "độ cao"]
  },
  {
    id: "thi-nghiem",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    alt: "Kiểm tra độ sụt và đúc mẫu thử nén bê tông tươi",
    caption: "Cán bộ kỹ thuật đo độ sụt bằng nón côn chuẩn và đúc tổ mẫu lập phương lưu nghiệm thu tại phòng LAS-XD.",
    keywords: ["độ sụt", "thí nghiệm", "mác", "kiểm định", "mẫu nén", "tcvn", "chất lượng", "mác 300", "tiêu chuẩn"]
  },
  {
    id: "bao-duong",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80",
    alt: "Bảo dưỡng bề mặt bê tông tươi sau khi đổ",
    caption: "Quy trình dưỡng hộ ẩm 7 ngày vàng giúp bê tông phát triển tối đa cường độ R28 và ngăn ngừa co ngót nứt nẻ.",
    keywords: ["bảo dưỡng", "nứt", "tưới nước", "dưỡng hộ", "7 ngày", "chống nứt", "co ngót"]
  },
  {
    id: "chong-tham",
    url: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&auto=format&fit=crop&q=80",
    alt: "Thi công bê tông chống thấm cho tầng hầm và mái",
    caption: "Ứng dụng phụ gia chống thấm B6 - B12 và kỹ thuật đầm nén cho các kết cấu ngầm và sàn mái ngoài trời.",
    keywords: ["chống thấm", "tầng hầm", "bể bơi", "mái", "phụ gia", "b6", "b8", "nước"]
  },
  {
    id: "cong-nghiep",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80",
    alt: "Công trình hạ tầng và nhà xưởng bê tông cốt thép",
    caption: "Hạ tầng giao thông, cầu cảng và nhà xưởng công nghiệp tại các khu công nghiệp trọng điểm Ninh Bình.",
    keywords: ["khu công nghiệp", "khánh phú", "gián khẩu", "nhà xưởng", "hạ tầng", "cốt thép", "công trình"]
  }
];

function selectCoverImage(title: string, keywords = ""): { url: string; alt: string; caption: string } {
  const text = (title + " " + keywords).toLowerCase();
  
  for (const item of CONCRETE_IMAGE_CATALOG) {
    if (item.keywords.some(k => text.includes(k))) {
      return item;
    }
  }
  return CONCRETE_IMAGE_CATALOG[0]; // Default to mixing plant
}

function enrichContentWithImages(content: string, title: string, keywords = "", coverUrl = ""): string {
  // Count existing images
  const existingMatches = content.match(/!\[.*?\]\(.*?\)/g);
  if (existingMatches && existingMatches.length >= 3) {
    return content; // Already has sufficient images (at least 3)
  }

  // Filter available images avoiding the cover image if possible
  const candidatePool = CONCRETE_IMAGE_CATALOG.filter(img => img.url !== coverUrl);
  const imagesToInsert: Array<{ url: string; alt: string; caption: string }> = [];

  // Pick up to 3-4 distinct images from the pool
  const text = (title + " " + keywords + " " + content.slice(0, 1000)).toLowerCase();
  
  // Sort candidate pool by keyword match relevance
  const scored = candidatePool.map(img => ({
    img,
    score: img.keywords.filter(k => text.includes(k)).length
  })).sort((a, b) => b.score - a.score);

  scored.slice(0, 4).forEach(item => imagesToInsert.push(item.img));

  // Find H2 headings to insert images after
  const lines = content.split('\n');
  const h2Indices: number[] = [];

  lines.forEach((line, idx) => {
    if (/^##\s+/.test(line.trim())) {
      h2Indices.push(idx);
    }
  });

  if (h2Indices.length === 0) {
    const mid = Math.floor(lines.length / 2);
    const img1 = imagesToInsert[0];
    lines.splice(mid, 0, `\n\n![${img1.alt}](${img1.url})\n*Hình 1: ${img1.caption}*\n\n`);
    return lines.join('\n');
  }

  let insertCount = 0;
  let offset = 0;

  for (let i = 0; i < h2Indices.length && insertCount < imagesToInsert.length; i++) {
    // Insert after sections 1, 2, 4, 6 (leaving intro and conclusion clean)
    if (i === 1 || i === 2 || i === 4 || i === 6) {
      const targetLineIdx = h2Indices[i] + offset + 2;
      const img = imagesToInsert[insertCount];
      const imageBlock = `\n![${img.alt}](${img.url})\n*Hình ${insertCount + 1}: ${img.caption}*\n`;
      
      lines.splice(targetLineIdx, 0, imageBlock);
      offset++;
      insertCount++;
    }
  }

  // Fallback if not inserted enough
  if (insertCount < 2 && imagesToInsert.length > 0) {
    const targetLineIdx = Math.min(lines.length - 1, (h2Indices[0] || 0) + 3);
    const img = imagesToInsert[0];
    lines.splice(targetLineIdx, 0, `\n![${img.alt}](${img.url})\n*Hình 1: ${img.caption}*\n`);
  }

  return lines.join('\n');
}

/**
 * Find relevant previous articles from repository database
 */
function getRelatedInternalPosts(topic: string, keywords: string, count = 4): Array<{ title: string; url: string }> {
  try {
    const posts = getAllPostsServer();
    if (!posts || posts.length === 0) return [];

    const searchTokens = (topic + " " + keywords)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter(t => t.length > 2);

    const scored = posts.map(p => {
      let score = 0;
      const text = ((p.title || "") + " " + (p.category || "") + " " + (p.tags || []).join(" ") + " " + (p.excerpt || ""))
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      for (const tok of searchTokens) {
        if (text.includes(tok)) score += 1;
      }
      return { p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

    return scored.map(item => ({
      title: item.p.title,
      url: `/${item.p.slug}`
    }));
  } catch (err) {
    console.warn("Could not get related internal posts:", err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  let mainKeyword = "bê tông tươi ninh bình";
  let sourceTitle = "";

  try {
    const body = await req.json().catch(() => ({}));
    sourceTitle = body.sourceTitle || "";
    const sourceUrl = body.sourceUrl;
    const rawContent = body.rawContent;
    const customKeywords = body.customKeywords;
    const focusTopic = body.focusTopic;
    const primaryKeyword = body.primaryKeyword;
    const secondaryKeywords = body.secondaryKeywords;
    const internalLinks = body.internalLinks;
    const aiConfigs = body.aiConfigs;
    const apiKey = body.apiKey || aiConfigs?.gemini?.apiKey || process.env.GEMINI_API_KEY;

    const ai = getGeminiClient(apiKey);

    mainKeyword = primaryKeyword || (customKeywords ? customKeywords.split(',')[0].trim() : "bê tông tươi ninh bình");
    const subKeywords = secondaryKeywords || "bê tông an gia bình, giá bê tông tươi ninh bình, kỹ thuật đổ bê tông, xe bơm bê tông ninh bình, tiêu chuẩn TCVN, mác bê tông 250";
    const combinedKeywords = customKeywords || `${mainKeyword}, ${subKeywords}`;
    const topicHeading = focusTopic || "Ứng dụng kỹ thuật và công nghệ bê tông thương phẩm chuẩn TCVN tại Ninh Bình";

    // 1. Build comprehensive internal links (Key pages + Previous related articles)
    const relatedArticles = getRelatedInternalPosts(topicHeading, combinedKeywords, 4);
    const keyPages = [
      { title: "Báo giá bê tông tươi Ninh Bình mới nhất", url: "/bang-gia" },
      { title: "Giới thiệu Trạm trộn Bê Tông An Gia Bình", url: "/gioi-thieu" },
      { title: "Quy trình kiểm định và sản xuất chuẩn TCVN", url: "/quy-trinh-san-xuat" },
      { title: "Dự án công trình tiêu biểu tại Ninh Bình", url: "/du-an" },
      { title: "Liên hệ đặt lịch và điều xe đổ bê tông", url: "/lien-he" },
      { title: "Trang chủ Bê Tông An Gia Bình", url: "/" }
    ];

    const mergedLinks = Array.isArray(internalLinks) && internalLinks.length > 0
      ? internalLinks.map((l: { title?: string; text?: string; url: string }) => `- [${l.text || l.title || l.url}](${l.url})`).join('\n')
      : [
          ...keyPages.map(p => `- [${p.title}](${p.url})`),
          ...relatedArticles.map(a => `- [${a.title}](${a.url})`)
        ].join('\n');

    // 2. Select contextual cover image
    const chosenCover = selectCoverImage(sourceTitle || topicHeading, combinedKeywords);

    // 3. Provide image catalog in prompt so Gemini picks contextual images
    const imageCatalogForPrompt = CONCRETE_IMAGE_CATALOG.map((img, idx) => 
      `${idx + 1}. URL: ${img.url} | Chủ đề: ${img.alt} | Chú thích gợi ý: ${img.caption}`
    ).join('\n');

    const prompt = `Bạn là Giám Đốc Nội Dung Chuẩn SEO Cấp Cao (SEO Content Director) kiêm Chuyên Gia Kỹ Thuật Công Trình của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93 - Email: ketoan.angiabinh@gmail.com).

HÃY VIẾT MỘT BÀI VIẾT CHUẨN SEO CHUYÊN SÂU TỐI THIỂU 2.000 TỪ (BẮT BUỘC >= 2000 WORDS, KHÔNG DƯỚI 2000 TỪ) KÈM HÌNH ẢNH MINH HỌA VỚI CÁC THÔNG SỐ SAU:

1. THÔNG TIN ĐẦU VÀO:
- Chủ đề tập trung (Focus Topic): ${topicHeading}
- Tiêu đề gốc tham khảo: ${sourceTitle || "Kỹ thuật bê tông xây dựng"}
- Nguồn tham khảo: ${sourceUrl || "Tạp chí Xây Dựng & Kiểm Định"}
- Nội dung gốc quét được:
${rawContent || "Công nghệ sản xuất bê tông tươi thương phẩm hiện đại, kiểm soát tỷ lệ cấp phối cát đá xi măng, phụ gia giảm co ngót, kỹ thuật đổ và bảo dưỡng theo tiêu chuẩn TCVN tại Ninh Bình."}

2. TỪ KHÓA BẮT BUỘC PHẢI LỒNG GHÉP:
- Từ khóa chính (Primary Keyword): "${mainKeyword}" -> Bắt buộc xuất hiện trong Tiêu đề (H1), đoạn mở đầu (100 từ đầu), ít nhất 4 thẻ H2/H3, rải đều trong thân bài (mật độ 1.5% - 2.5%), và đoạn kết luận (Call to action).
- Từ khóa phụ (Secondary Keywords): ${subKeywords} -> Lồng ghép tự nhiên, mượt mà vào các luận điểm kỹ thuật, phân tích mác bê tông, tiêu chuẩn thí nghiệm và kinh nghiệm thực tế.

3. HÌNH ẢNH MINH HỌA BẮT BUỘC TRONG THÂN BÀI VIẾT (MARKDOWN):
BẮT BUỘC chèn ít nhất 3 đến 4 hình ảnh minh họa chân thực vào các đoạn phù hợp bằng cú pháp Markdown:
![Chú thích ảnh tiếng Việt](URL_HÌNH_ẢNH)
*Hình X: Chú thích chi tiết nội dung ảnh liên quan đến công trình Ninh Bình.*

DANH SÁCH ẢNH CHÍNH XÁC ĐƯỢC PHÉP CHỌN DÙNG (DÙNG ĐÚNG URL BÊN DƯỚI, KHÔNG TỰ BỊA URL KHÁC):
${imageCatalogForPrompt}

4. LIÊN KẾT NỘI BỘ (INTERNAL LINKS) BẮT BUỘC PHẢI CHÈN VÀO BÀI VIẾT:
Hãy lồng ghép tự nhiên từ 5 đến 8 liên kết từ danh sách dưới đây (bao gồm các trang chức năng VÀ các bài viết trước đó cùng chủ đề) bằng cú pháp Markdown [Anchor Text](/url):
${mergedLinks}

5. YÊU CẦU ĐỘ DÀI VÀ CẤU TRÚC (BẮT BUỘC >= 2.000 TỪ):
- ĐỘ DÀI: TỐI THIỂU 2.000 TỪ. Phải là một bài phân tích chuyên sâu kỹ thuật đầy đủ số liệu, bảng tra cứu mác TCVN, phân tích địa chất địa bàn Ninh Bình, hướng dẫn thi công chi tiết từng bước, phân tích lỗi nứt thường gặp và phương pháp khắc phục, FAQ 5 câu hỏi và kết luận.
- BỐ CỤC BÀI VIẾT TỐI THIỂU 8 PHẦN LỚN:
  + Mở bài cuốn hút nêu bối cảnh phát triển xây dựng dân dụng & công nghiệp tại Ninh Bình (TP. Ninh Bình, TP. Tam Điệp, KCN Khánh Phú, KCN Gián Khẩu, Phúc Sơn, Kim Sơn, Yên Khánh, Gia Viễn, Nho Quan).
  + Thẻ ## 1: Bối cảnh, tầm quan trọng và vai trò cốt lõi của "${mainKeyword}".
  + Thẻ ## 2: Tiêu chuẩn kỹ thuật nguyên vật liệu (cát vàng sông Lô/sông Mã mô-đun 2.6 - 3.2, đá dăm 1x2 cường độ cao, xi măng PCB40 si-lô, phụ gia siêu hóa dẻo thế hệ mới).
  + Thẻ ## 3: Bảng tra cứu mác bê tông thương phẩm toàn diện (M150, M200, M250, M300, M350, M400) kèm độ sụt (12±2, 14±2, 16±2cm) và ứng dụng từng cấu kiện (móng bè, dầm sàn, cột, bể bơi, tầng hầm).
  + Thẻ ## 4: Quy trình kiểm định chất lượng tại hiện trường & phòng LAS-XD (kiểm tra kẹp chì xe bồn, đo độ sụt nón côn Abrams, đúc 3 tổ mẫu thử nén R7 và R28).
  + Thẻ ## 5: Kỹ thuật đổ bê tông và đầm dùi chuẩn kỹ sư công trình (bước đầm, thời gian đầm 20-30s, chống rỗ tổ ong và phân tầng).
  + Thẻ ## 6: Biện pháp thi công phòng ngừa co ngót nứt mặt trong điều kiện thời tiết đặc thù Ninh Bình (nắng nóng mùa hè, gió Lào khô, mùa nồm ẩm).
  + Thẻ ## 7: Chế độ bảo dưỡng "7 ngày vàng" và thời điểm tháo dỡ cốp pha an toàn theo TCVN 4453:1995.
  + Thẻ ## 8: Dự toán chi phí, bảng báo giá tham khảo và bài toán kinh tế khi sử dụng bê tông trạm trộn so với trộn thủ công.
  + Thẻ ## 9: Mục Hỏi Đáp Thường Gặp (FAQ) gồm 5 câu hỏi thực tế của khách hàng tại Ninh Bình.
  + Thẻ ## 10: Giới thiệu năng lực Công ty TNHH Bê Tông An Gia Bình (2 trạm Khánh Phú & Kim Sơn, 35+ xe bồn, bơm cần 37m-56m) kèm thông tin liên hệ và kêu gọi hành động đặt hàng.

6. ĐỊNH DẠNG ĐẦU RA (JSON THUẦN TÚY KHÔNG BỌC TRONG CODE BLOCK NẾU CÓ THỂ):
{
  "title": "Tiêu đề chuẩn SEO chứa từ khóa chính hấp dẫn",
  "slug": "tieu-de-khong-dau-chuan-url-than-thien",
  "excerpt": "Đoạn mô tả ngắn 140-160 ký tự chuẩn SEO chứa từ khóa chính",
  "seoTitle": "Tiêu đề SEO dưới 65 ký tự chứa từ khóa chính",
  "seoDescription": "Meta Description 140-160 ký tự chứa từ khóa chính và phụ",
  "focusKeywords": ["${mainKeyword}", "từ khóa phụ 1", "từ khóa phụ 2"],
  "category": "Kỹ Thuật Thi Công",
  "tags": ["bê tông tươi ninh bình", "bê tông an gia bình", "${mainKeyword}"],
  "readTime": "12 phút",
  "coverImage": "${chosenCover.url}",
  "content": "Toàn bộ bài viết Markdown chi tiết >= 2000 từ có lồng ghép từ khóa chính, từ khóa phụ, 3-4 ảnh minh họa ![alt](url) và các internal links dạng [anchor](/url)"
}`;

    if (!ai) {
      // High-authority exhaustive fallback (>2000 words)
      const slug = (sourceTitle || "cong-nghe-be-tong-an-gia-binh")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Cẩm Nang Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn 2026 Tại Ninh Bình`;

      const relatedLink1 = relatedArticles[0] ? `[${relatedArticles[0].title}](${relatedArticles[0].url})` : `[dự án tiêu biểu tại Ninh Bình](/du-an)`;
      const relatedLink2 = relatedArticles[1] ? `[${relatedArticles[1].title}](${relatedArticles[1].url})` : `[quy trình kiểm định LAS-XD](/quy-trinh-san-xuat)`;

      const rawFallbackContent = `## 1. Tổng Quan & Bối Cảnh Thực Tế Về ${mainKeyword.toUpperCase()} Tại Ninh Bình

Trong bức tranh hiện đại hóa đô thị và phát triển hạ tầng bùng nổ tại tỉnh Ninh Bình những năm gần đây, yêu cầu về chất lượng kết cấu công trình đã được nâng lên một tầm cao mới. Từ các dự án nhà ở dân dụng, biệt thự cao cấp tại **TP. Ninh Bình, TP. Tam Điệp, KĐT Xuân Thành, KĐT Phúc Sơn**, cho đến hệ thống nhà xưởng sản xuất quy mô lớn tại **KCN Khánh Phú, KCN Gián Khẩu, KCN Tam Điệp**, việc ứng dụng giải pháp **${mainKeyword}** đạt chuẩn chất lượng quốc gia TCVN đã trở thành tiêu chí sống còn của mọi chủ đầu tư và nhà thầu xây dựng.

Trước đây, phương pháp trộn bê tông thủ công bằng máy trộn quả lê tại hiện trường từng bộc lộ vô số nhược điểm: tỷ lệ cấp phối cát, đá, xi măng và nước đong đếm áng chừng theo xẻng hoặc thùng sơn, cốt liệu cát không được sàng lọc tạp chất hữu cơ và bùn sét, độ đồng đều mẻ trộn kém khiến bê tông dễ bị rỗ tổ ong, nứt chân chim và thấm dột chỉ sau vài năm sử dụng. 

Ngược lại, bê tông thương phẩm sản xuất từ trạm trộn chuyên nghiệp được vận hành hoàn toàn tự động bằng hệ thống cân điện tử định lượng chính xác đến từng kilogam. Để hiểu rõ hơn về quy mô nhà máy và năng lực cung ứng của đơn vị dẫn đầu khu vực, quý khách hàng có thể tham khảo [giới thiệu trạm trộn Bê Tông An Gia Bình](/gioi-thieu) – thương hiệu sở hữu 2 cụm trạm trộn tự động hóa 100% tại KCN Khánh Phú và Xã Kim Sơn với tổng công suất hơn 450m³/h.

Cùng với chuyên đề: *${sourceTitle || "Kỹ thuật ứng dụng bê tông thương phẩm tiên tiến"}*, bài viết này sẽ phân tích toàn diện mọi khía cạnh kỹ thuật từ tiêu chuẩn vật liệu, bảng cấp phối mác chuẩn, kỹ thuật đầm nén, phòng ngừa co ngót nứt mặt cho đến quy trình bảo dưỡng "7 ngày vàng" dành riêng cho khí hậu Ninh Bình.

---

## 2. Tiêu Chuẩn Kỹ Thuật Cốt Lõi Của Bê Tông Tươi Chuẩn TCVN

Độ bền chịu lực và tuổi thọ trăm năm của một khối bê tông phụ thuộc trực tiếp vào chất lượng của các thành phần hạt cấu tạo nên nó. Theo quy chuẩn quốc gia **TCVN 9345:2012** (Kết cấu bê tông và bê tông cốt thép - Hướng dẫn kỹ thuật phòng chống nứt) và **TCVN 3105:1993** (Hỗn hợp bê tông nặng và bê tông nặng - Lấy mẫu, chế tạo và bảo dưỡng mẫu thử), từng loại nguyên vật liệu đầu vào tại Bê Tông An Gia Bình đều phải vượt qua các bài kiểm định cơ lý nghiêm ngặt:

### 2.1. Cốt liệu cát vàng hạt lớn (Mô-đun độ lớn 2.6 – 3.2)
Cát vàng sử dụng trong cấp phối bê tông thương phẩm bắt buộc phải là cát khai thác từ lòng sông tự nhiên (sông Lô, sông Mã), hạt tròn đều, sạch và không lẫn tạp chất bùn sét (hàm lượng bùn bụi sét kiểm soát < 1.0%). Cát có mô-đun độ lớn từ 2.6 đến 3.2 tạo khung xương chịu lực vững chắc, giúp giảm lượng nước thừa trong hỗn hợp, hạn chế hiện tượng co ngót thể tích khi bê tông ninh kết.

### 2.2. Cốt liệu đá dăm 1x2 tuyển chọn
Đá dăm kích thước hạt 10x20mm và 10x25mm được sàng tuyển cơ học từ các mỏ đá vôi chất lượng cao tại Ninh Bình. Đá có cường độ nén cơ học cao, tỷ lệ hạt thoi dẹt dưới 8%, bề mặt gồ ghề tăng khả năng bám dính cơ học với vữa xi măng. Không sử dụng đá lẫn tạp chất sét hoặc đá phong hóa yếu.

### 2.3. Xi măng PCB40 si-lô chất lượng cao
Bê Tông An Gia Bình sử dụng độc quyền các dòng xi măng Poóc-lăng hỗn hợp PCB40 từ các thương hiệu hàng đầu như The Vissai, Tam Điệp, Hoàng Thạch. Toàn bộ xi măng được vận chuyển bằng xe bồn chuyên dụng và bơm trực tiếp vào hệ thống si-lô kín khí, ngăn ngừa tuyệt đối hơi ẩm làm suy giảm hoạt tính xi măng trước khi trộn.

### 2.4. Phụ gia siêu hóa dẻo & giảm nước thế hệ mới
Tùy thuộc vào yêu cầu của từng công trình, bê tông được phối trộn phụ gia siêu dẻo gốc Polycarboxylate thế hệ mới giúp giảm từ 15% - 25% lượng nước nhào trộn nhưng vẫn duy trì độ sụt linh động cao từ 12±2cm đến 16±2cm, giúp hỗn hợp dễ dàng luân chuyển qua đường ống bơm cần và len lỏi vào các khe cốt thép dày đặc mà không bị phân tầng tách nước.

Quý nhà thầu và các kỹ sư giám sát có thể tham khảo thêm [quy trình kiểm định và sản xuất chuẩn TCVN](/quy-trinh-san-xuat) để nắm vững các chỉ tiêu cơ lý nghiệm thu từng mẻ trộn xuất xưởng.

---

## 3. Bảng Tra Cứu Mác Bê Tông Toàn Diện & Ứng Dụng Trong Xây Dựng

Lựa chọn đúng mác bê tông cho từng cấu kiện là chìa khóa giúp tối ưu hóa chi phí đầu tư mà vẫn đảm bảo tuyệt đối khả năng chịu lực dài lâu của ngôi nhà:

| Mác Bê Tông | Cấp Độ Bền B | Độ Sụt Khuyến Nghị | Cấu Kiện Khuyên Dùng | Ưu Điểm Kỹ Thuật Nổi Bật |
| :--- | :--- | :--- | :--- | :--- |
| **Mác 150 (M150)** | B10 - B12.5 | 10 ± 2 cm | Bê tông lót móng, cán nền sân, vỉa hè | Giá thành tiết kiệm, ngăn mất nước xi măng lớp trên |
| **Mác 200 (M200)** | B15 | 12 ± 2 cm | Móng nhà cấp 4, tường rào, sân vườn | Dễ cán xoa mặt, thời gian đông kết ổn định |
| **Mác 250 (M250)** | B20 | 12 ± 2 cm / 14 ± 2 cm | Móng nhà phố, dầm giằng, cột, sàn mái 2-4 tầng | Độ bền kết cấu vững vàng, khả năng chống thấm tiêu chuẩn |
| **Mác 300 (M300)** | B22.5 | 14 ± 2 cm / 16 ± 2 cm | Biệt thự tân cổ điển, nhà cao tầng, sàn vượt nhịp, móng bè | Cường độ chịu nén uốn cao, đặc chắc, hạn chế nứt vi mô |
| **Mác 350 (M350)** | B25 | 16 ± 2 cm (Bơm cần/tĩnh) | Tầng hầm, bể ngầm, sàn mái lộ thiên, cọc khoan nhồi | Chống thấm B6 - B8, kháng muối khoáng, tuổi thọ công trình thế kỷ |
| **Mác 400 (M400)** | B30 | 16 ± 2 cm | Nhà xưởng tải trọng nặng, cầu cảng, dầm dự ứng lực | Cường độ phát triển nhanh, phục vụ công trình tải trọng cực lớn |

Để tra cứu chi tiết đơn giá từng mác bê tông và chi phí ca bơm cần, quý khách hàng vui lòng xem tại [bảng báo giá bê tông tươi Ninh Bình mới nhất](/bang-gia) được niêm yết công khai và cập nhật minh bạch.

---

## 4. Kiểm Định Chất Lượng Tại Hiện Trường & Phòng Thí Nghiệm LAS-XD

Quy trình giao nhận bê tông tươi thương phẩm không dừng lại ở việc xe bồn tới công trình xả bê tông, mà là một chuỗi các thao tác kiểm định có văn bản ký nhận giữa đại diện trạm trộn và chủ đầu tư:

### 4.1. Kiểm tra tem niêm phong và kẹp chì xe bồn
Mỗi xe bồn xuất phát từ Trạm Bê Tông An Gia Bình đều được kẹp chì niêm phong tại miệng phễu nạp và van xả. Trên phiếu giao hàng điện tử ghi rõ biển số xe, thời gian xuất trạm, khối lượng (m³), mác bê tông và độ sụt yêu cầu. Bác tài xế chỉ được cắt chì khi có sự chứng kiến và đồng ý của chủ nhà hoặc kỹ sư tư vấn giám sát.

### 4.2. Thử độ sụt bằng nón côn tiêu chuẩn (Slump Test)
Dụng cụ thử bao gồm nón côn Abrams (chiều cao 300mm), phễu nạp và que đầm thép đầu tù:
1. Lấy mẫu bê tông tươi đại diện ở đoạn giữa mẻ xả (sau khi xe đã xả bỏ khoảng 0.2m³ đầu).
2. Nạp bê tông vào côn làm 3 lớp đều nhau, mỗi lớp dùng que thép đầm đều 25 lần từ ngoài vào trong.
3. Gạt phẳng miệng nón, lau sạch chân đế rồi nhẹ nhàng nhấc nón thẳng đứng lên trong thời gian 5 - 10 giây.
4. Đặt nón côn bên cạnh mẫu bê tông vừa sụt, đặt thước nằm ngang trên miệng nón và đo khoảng cách từ thanh thước xuống điểm cao nhất của khối bê tông sụt. Độ sụt đạt chuẩn khi nằm trong phạm vi cam kết (ví dụ 12 ± 2 cm).

### 4.3. Đúc tổ mẫu thử nén nghiệm thu R7 và R28
Mỗi ca đổ từ 20m³ - 50m³ đều được kỹ thuật viên tiến hành đúc tối thiểu 1 tổ mẫu (gồm 3 viên mẫu lập phương kích thước chuẩn 150 x 150 x 150 mm). Mẫu sau khi đúc được bảo dưỡng tiêu chuẩn tại hiện trường 24 giờ trước khi đưa về phòng thí nghiệm chuyên ngành để nén thủy lực xác định cường độ tuổi 7 ngày (R7 đạt khoảng 70% - 80% mác thiết kế) và tuổi 28 ngày (R28 đạt 100% mác thiết kế). Quý vị có thể tham khảo thêm bài phân tích chuyên sâu tại ${relatedLink2}.

---

## 5. Kỹ Thuật Đổ Bê Tông Và Đầm Dùi Chuẩn Kỹ Sư Công Trình

Kỹ thuật đổ và đầm nén quyết định đến 60% chất lượng bề mặt và độ đặc chắc của cấu kiện. Dưới đây là các lưu ý kỹ thuật không thể bỏ qua:

### 5.1. Chuẩn bị cốp pha và cốt thép trước giờ G
- Cốt thép phải được kê bằng các cục kê bê tông đúc sẵn (không dùng gạch vỡ hoặc gỗ vụn), bảo đảm chiều dày lớp bê tông bảo vệ theo đúng bản vẽ thiết kế (thông thường từ 1.5cm - 2.5cm cho dầm sàn và 3cm cho móng).
- Cốp pha phải được làm sạch rác, mùn cưa, lá cây và tưới nước tạo độ ẩm đầy đủ trước khi bơm bê tông để tránh cốp pha hút ngược nước từ hỗn hợp bê tông tươi.

### 5.2. Nguyên tắc vận hành máy đầm dùi
- **Phương đầm:** Luôn cắm đầu đầm vuông góc với mặt sàn, cắm ngập sâu vào lớp bê tông đã đổ bên dưới khoảng 10cm để hai lớp kết dính liền khối, tránh hiện tượng khớp nối lạnh (cold joint).
- **Khoảng cách bước đầm:** Bước đầm giữa hai điểm liên tiếp không được vượt quá 1.5 lần bán kính tác dụng của đầu đầm (thông thường khoảng 30cm - 40cm).
- **Thời gian đầm:** Tại mỗi điểm đầm, giữ cố định từ 20 đến 30 giây cho đến khi hỗn hợp bê tông chìm xuống, bề mặt se lại và nổi lên một lớp vữa mỏng bóng, không còn bọt khí sủi lên.
- **Rút đầu đầm:** Rút từ từ và nhẹ nhàng để lỗ hổng do đầu đầm để lại tự động được vữa bê tông lấp đầy.

### 5.3. Tránh các lỗi thi công thường gặp
- Tuyệt đối không dùng đầu đầm dùi để "cào" hoặc "đẩy" bê tông chạy xa trên sàn vì hành động này sẽ làm các hạt đá dăm nặng chìm xuống dưới, vữa xi măng nhẹ dồn về một góc, gây phân tầng nghiêm trọng.
- Khi bơm cột hoặc vách cao trên 2m, phải sử dụng máng nghiêng hoặc ống vòi voi đưa bê tông xuống tận đáy để tránh bê tông rơi tự do làm đá văng ra khỏi vữa gây rỗ chân cột.

---

## 6. Biện Pháp Phòng Ngừa Nứt Co Ngót Dưới Khí Hậu Ninh Bình

Địa bàn tỉnh Ninh Bình chịu ảnh hưởng rõ rệt của khí hậu nhiệt đới gió mùa Bắc Bộ: mùa hè thường xuất hiện các đợt nắng nóng gay gắt kèm gió Lào khô hanh, trong khi mùa xuân lại có nồm ẩm mưa phùn. Hiện tượng nứt mặt bê tông sau khi đổ thường do hiện tượng **co ngót dẻo (plastic shrinkage)** khi tốc độ bốc hơi nước trên bề mặt lớn hơn tốc độ nước thoát ra từ bên trong khối đổ:

1. **Che chắn và hoàn thiện mặt đúng thời điểm:** Ngay sau khi cán phẳng, dùng bàn xoa cơ khí hoặc xoa gỗ vuốt mặt. Khi bê tông bắt đầu đông kết sơ bộ (khoảng 2-3 giờ sau khi cào cán), tiến hành xoa hoàn thiện lần 2 để đóng kín các vết nứt tế vi ban đầu.
2. **Phủ bạt nilon hoặc bao tải ẩm ngay lập tức:** Không để bề mặt bê tông trần tiếp xúc trực tiếp với ánh nắng mặt trời và gió hanh. Phủ bạt giữ ẩm giúp độ ẩm bề mặt duy trì ở mức 95% - 100%.
3. **Cắt khe co giãn đối với sàn diện tích lớn:** Đối với các sàn nhà xưởng hoặc sân bãi vượt quá 6m x 6m, kỹ sư khuyến cáo cắt khe co giãn sâu 1/3 chiều dày sàn sau khi đổ khoảng 24 - 48 giờ để giải phóng ứng suất nhiệt, ngăn chặn các vết nứt phát triển ngẫu nhiên.

Quý khách hàng có thể tham khảo thêm các giải pháp thực tế từ ${relatedLink1} đã được chúng tôi hoàn thành trên địa bàn tỉnh.

---

## 7. Chế Độ Bảo Dưỡng "7 Ngày Vàng" & Tháo Dỡ Cốp Pha An Toàn

Bê tông là vật liệu tiếp tục phản ứng thủy hóa và phát triển cường độ suốt đời công trình, nhưng **7 ngày đầu tiên sau khi đổ** là giai đoạn quyết định đến hơn 80% phẩm chất cuối cùng:

- **Giai đoạn 1 (Ngày 1 đến Ngày 3 - Dưỡng hộ ẩm liên tục):**
  Tưới nước giữ ẩm thường xuyên 24/24 giờ. Sử dụng vòi phun sương nhẹ nhàng, tuyệt đối không xả dòng nước áp lực mạnh làm xói lở bề mặt bê tông non. Đối với các mặt sàn dầm mái bằng, kỹ sư khuyên dùng phương pháp be bờ gạch cao 5cm và ngâm nước bảo dưỡng ngập 2-3cm – đây là giải pháp dưỡng hộ hoàn hảo nhất.
- **Giai đoạn 2 (Ngày 4 đến Ngày 7 - Duy trì độ ẩm):**
  Tưới nước định kỳ 3 đến 4 lần mỗi ngày (vào sáng sớm trước khi nắng lên, giữa trưa và chiều mát). Giữ cho bao bố hoặc bề mặt sàn luôn ẩm ướt.
- **Thời gian tháo dỡ cốp pha chịu lực (TCVN 4453:1995):**
  + Cốp pha thành đứng (cột, dầm, tường): Tháo sau 24 - 48 giờ khi bê tông đạt cường độ tối thiểu 5 MPa để bảo dưỡng mặt bên.
  + Cốp pha đáy dầm, sàn nhịp < 4m: Chỉ tháo sau tối thiểu 10 - 14 ngày khi bê tông đạt trên 70% mác thiết kế.
  + Cốp pha dầm sàn nhịp lớn > 4m và conson (ban công, ô văng): Bắt buộc giữ hệ chống phụ tối thiểu 21 đến 28 ngày hoặc khi có kết quả nén mẫu R28 đạt yêu cầu.

---

## 8. Dự Toán Chi Phí & So Sánh Bài Toán Kinh Tế Thực Tế

Nhiều chủ nhà thường băn khoăn liệu sử dụng **${mainKeyword}** có đắt hơn so với việc tự mua cát, đá, xi măng về thuê thợ trộn thủ công? Hãy cùng xem xét bảng phân tích kinh tế toàn diện dưới đây cho một sàn nhà phố 100m² (chiều dày sàn 10cm, khối lượng khoảng 10m³ bê tông Mác 250):

| Tiêu Chí So Sánh | Phương Pháp Trộn Thủ Công (Máy Quả Lê) | Bê Tông Tươi An Gia Bình (Bơm Cần) |
| :--- | :--- | :--- |
| **Thời gian thi công 10m³** | Mất 5 - 7 tiếng đồng hồ kéo dài | **Chỉ 30 - 45 phút hoàn thành toàn bộ** |
| **Nhân công phục vụ** | Cần 12 - 15 thợ vận chuyển, xúc cát đá | **Chỉ cần 3 - 4 thợ cào cán và xoa mặt** |
| **Độ đồng đều & chất lượng** | Cấp phối cảm tính, sai số lớn, dễ phân tầng | **Chuẩn xác 100% bằng cân điện tử, kiểm định LAS** |
| **Hao hụt vật tư & vệ sinh** | Rơi vãi cát đá ra đường, chiếm dụng mặt bằng | **Sạch sẽ tuyệt đối, không chiếm dụng vỉa hè lòng đường** |
| **Rủi ro thời tiết** | Đổ lâu gặp mưa giông rất dễ hỏng cả sàn | **Đổ siêu tốc, chủ động ứng phó hoàn toàn** |
| **Tổng chi phí hoàn thiện** | Khoảng 13.500.000đ - 14.200.000đ (tính cả công thợ) | **Chỉ từ 12.000.000đ - 13.000.000đ (đã gồm ca bơm)** |

Rõ ràng, việc lựa chọn bê tông thương phẩm không những giúp gia chủ tiết kiệm từ 10% - 15% tổng chi phí thi công mà còn đảm bảo chất lượng sàn đặc chắc, không lo nứt thấm và rút ngắn tiến độ thi công toàn bộ ngôi nhà.

---

## 9. Hỏi Đáp Thường Gặp (FAQ) Về Bê Tông Tươi Ninh Bình

### Câu 1: Nhà trong ngõ hẻm nhỏ tại TP. Ninh Bình có đổ bê tông tươi được không?
**Trả lời:** Hoàn toàn được. Bê Tông An Gia Bình trang bị hệ thống xe bơm tĩnh (bơm đường ống) có thể nối dài đường ống thép lên tới 150m - 200m luồn lách qua ngõ nhỏ vào tận chân công trình mà xe bồn không cần phải tiến vào trong ngõ.

### Câu 2: Đổ bê tông tươi gặp trời mưa bất chợt thì phải xử lý như thế nào?
**Trả lời:** Nếu mưa nhỏ dạng phùn, công tác đổ vẫn diễn ra bình thường nhưng cần che bạt đoạn vừa đổ xong. Nếu gặp mưa rào lớn, tổ thợ phải lập tức dừng đổ, tạo mạch ngừng thi công vuông góc với trục dầm sàn tại vị trí có lực cắt nhỏ nhất (khoảng 1/3 nhịp dầm) và che bạt kín toàn bộ bề mặt. Khi tạnh mưa, vệ sinh sạch nước đọng và dùng hồ dầu xi măng liên kết trước khi đổ tiếp.

### Câu 3: Mác bê tông bao nhiêu là phù hợp nhất cho sàn mái nhà dân dụng?
**Trả lời:** Đối với sàn mái tiếp xúc trực tiếp với nắng mưa, kỹ sư An Gia Bình khuyến nghị sử dụng **Mác 250 hoặc Mác 300** có kết hợp phụ gia chống thấm B6 hoặc B8. Độ dày sàn mái nên đạt từ 10cm - 12cm để đảm bảo cách nhiệt và chống thấm hoàn hảo.

### Câu 4: Làm thế nào để kiểm tra thể tích bê tông giao đến có đủ khối lượng không?
**Trả lời:** Khách hàng có thể kiểm tra phiếu cân xe điện tử trước và sau khi xả bê tông tại trạm. Ngoài ra, tại công trình, gia chủ cùng giám sát có thể đo đạc hình học cốp pha thực tế (Dài x Rộng x Cao) cộng thêm 2% - 3% hệ số hao hụt do dãn nở cốp pha để đối chiếu chính xác thể tích thực nhận.

### Câu 5: Thời gian đặt lịch trước bao lâu để đảm bảo có xe bồn và xe bơm đúng giờ?
**Trả lời:** Quý khách hàng nên liên hệ trước từ 1 đến 2 ngày để đội ngũ kỹ thuật khảo sát mặt bằng đường đi, kiểm tra vị trí đỗ chân xe bơm và lên kế hoạch điều độ trạm trộn chính xác nhất.

---

## 10. Đơn Vị Cung Ứng Bê Tông Thương Phẩm Uy Tín Số 1 Tại Ninh Bình

Trải qua hơn một thập kỷ đồng hành cùng hàng ngàn công trình trên địa bàn tỉnh Ninh Bình, **Công ty TNHH Bê Tông An Gia Bình** tự hào là đối tác chiến lược của các nhà thầu xây dựng chuyên nghiệp. Những giá trị vượt trội chúng tôi mang tới:
- **Hệ thống 2 cụm trạm trộn tự động:** Đặt tại KCN Khánh Phú (phục vụ khu vực TP. Ninh Bình, Hoa Lư, Yên Khánh, Gia Viễn, Nho Quan) và Xã Kim Sơn (phục vụ toàn bộ khu vực huyện Kim Sơn, Yên Mô và vùng lân cận).
- **Đội xe cơ giới hùng hậu:** Hơn 35 xe bồn chuyên dụng dung tích 10m³ - 12m³ và dàn xe bơm cần từ 37m đến 56m sẵn sàng tiếp cận mọi địa hình cao tầng phức tạp.
- **Cam kết vàng:** 100% đúng mác kỹ thuật, chuẩn khối lượng, kiểm định mẫu nén tại phòng thí nghiệm LAS-XD hợp chuẩn Bộ Xây Dựng.

<div class="my-8 p-6 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-lg">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
    <span>★ CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH NINH BÌNH</span>
  </div>
  <h3 class="text-lg font-black text-white mb-2">Đăng Ký Khảo Sát &amp; Nhận Báo Giá Bê Tông Tươi Tận Chân Công Trình</h3>
  <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
    Kỹ sư trưởng An Gia Bình trực tiếp có mặt tại công trình sau 30 phút để kiểm tra mặt bằng, tư vấn cấp phối mác và đo đạc thể tích miễn phí. Cam kết đồng hành cùng chất lượng bền vững của ngôi nhà bạn!
  </p>
  <div class="flex flex-wrap items-center gap-4">
    <a href="tel:0988266293" class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow">
      <span>📞 Hotline Kỹ Thuật 24/7: 0988 2662 93</span>
    </a>
    <a href="/bang-gia" class="text-xs text-amber-300 font-bold hover:underline">
      Xem Chi Tiết Bảng Báo Giá Mới Nhất &rarr;
    </a>
  </div>
</div>

Quý khách hàng có nhu cầu tư vấn kỹ thuật, đặt lịch đổ sàn hoặc yêu cầu điều xe bơm, xin vui lòng [liên hệ đặt lịch đổ bê tông](/lien-he) với chúng tôi:
- **Hotline điều độ & tư vấn 24/7:** **0988 2662 93**
- **Email:** ketoan.angiabinh@gmail.com
- **Trạm 1:** KCN Khánh Phú, Phường Đông Hoa Lư, Tỉnh Ninh Bình.
- **Trạm 2:** Xã Kim Sơn, Tỉnh Ninh Bình.
- **Trang chủ chính thức:** [Bê Tông An Gia Bình](/)
`;

      const enrichedContent = enrichContentWithImages(rawFallbackContent, fallbackTitle, combinedKeywords, chosenCover.url);

      const fallbackPost = {
        title: fallbackTitle,
        slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
        excerpt: `Cẩm nang kỹ thuật chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
        seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
        seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
        focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
        category: "Kinh Nghiệm",
        tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
        readTime: "12 phút",
        coverImage: chosenCover.url,
        content: enrichedContent
      };

      return NextResponse.json(fallbackPost);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const text = response.text || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Ensure cover image and in-body illustration images are present
    const finalCover = parsed.coverImage || chosenCover.url;
    parsed.coverImage = finalCover;
    parsed.content = enrichContentWithImages(parsed.content || "", parsed.title || topicHeading, combinedKeywords, finalCover);

    return NextResponse.json(parsed);

  } catch (err: unknown) {
    console.error("AI crawl & rewrite error, falling back to deterministic engine:", err);
    
    // Deterministic fallback with enriched images so scheduler NEVER breaks
    const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Hướng Dẫn Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn Tại Ninh Bình`;
    const slug = (sourceTitle || "cong-nghe-be-tong-an-gia-binh")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const chosenCover = selectCoverImage(fallbackTitle, mainKeyword);

    // Load related previous articles
    const relatedArticles = getRelatedInternalPosts(fallbackTitle, mainKeyword, 4);
    const relatedLink1 = relatedArticles[0] ? `[${relatedArticles[0].title}](${relatedArticles[0].url})` : `[dự án công trình tiêu biểu](/du-an)`;
    const relatedLink2 = relatedArticles[1] ? `[${relatedArticles[1].title}](${relatedArticles[1].url})` : `[quy trình kiểm định chất lượng LAS-XD](/quy-trinh-san-xuat)`;

    const rawFallback = `## 1. Tổng Quan Về ${mainKeyword.toUpperCase()} Trong Công Trình Hiện Đại Tại Ninh Bình

Trong bức tranh phát triển hạ tầng và xây dựng dân dụng bùng nổ tại tỉnh Ninh Bình, nhu cầu sử dụng **${mainKeyword}** đạt chuẩn chất lượng ngày càng trở thành yêu cầu tiên quyết của các chủ đầu tư, kiến trúc sư và nhà thầu xây dựng. Từ các công trình biệt thự, nhà phố tại trung tâm TP. Ninh Bình, TP. Tam Điệp cho đến các khu nhà xưởng trọng điểm tại KCN Khánh Phú, KCN Gián Khẩu, việc ứng dụng bê tông thương phẩm từ trạm trộn chuyên nghiệp đã thay thế hoàn toàn phương pháp trộn thủ công truyền thống.

Để hiểu rõ hơn về năng lực cung ứng và quy mô của đơn vị sản xuất, quý khách hàng có thể tham khảo [giới thiệu trạm trộn Bê Tông An Gia Bình](/gioi-thieu) – đơn vị sở hữu 2 cụm trạm trộn tự động hóa 100% tại KCN Khánh Phú và Xã Kim Sơn với tổng công suất hơn 450m³/h.

Dựa trên những nghiên cứu thực tiễn từ chuyên đề: *${sourceTitle || "Kỹ thuật bê tông thương phẩm tiên tiến"}*, bài viết này sẽ phân tích chi tiết mọi khía cạnh kỹ thuật, từ lựa chọn mác bê tông, kiểm soát phụ gia đến các mẹo thi công thực tế tại địa bàn Ninh Bình.

---

## 2. Tiêu Chuẩn Kỹ Thuật Cốt Lõi Của Bê Tông Tươi Chuẩn TCVN

Chất lượng của **${mainKeyword}** phụ thuộc chặt chẽ vào quy trình kiểm soát nguồn nguyên vật liệu đầu vào và công nghệ cân đong điện tử tại buồng điều khiển trung tâm. Theo tiêu chuẩn TCVN 9345:2012 và TCVN 3105:1993, các chỉ tiêu sau bắt buộc phải được giám sát nghiêm ngặt:

### 2.1. Cốt liệu cát vàng và đá dăm chọn lọc
- **Cát vàng hạt lớn (Mô-đun độ lớn 2.6 - 3.2):** Cát sạch, được sàng lọc rửa trôi bùn sét, không lẫn tạp chất hữu cơ. Cát hạt lớn giúp kết cấu xi măng bám dính tối đa, hạn chế hiện tượng co ngót gây rạn chân chim bề mặt sàn.
- **Đá dăm 1x2 tuyển chọn:** Đá có cường độ nén cao, độ đồng đều hạt tối ưu, không lẫn đá phong hóa mềm yếu, đảm bảo độ rỗng cấu kiện nhỏ nhất.
- **Xi măng PCB40 chính hãng:** Bê Tông An Gia Bình sử dụng độc quyền dòng xi măng chất lượng cao được lưu trữ trong hệ thống si-lô kín khí, bảo đảm độ tươi và hoạt tính kết dính vượt trội.

Quý nhà thầu có thể tìm hiểu thêm về [quy trình sản xuất và kiểm định LAS-XD](/quy-trinh-san-xuat) để nắm vững các bước lấy mẫu nén R7, R28 trước khi xuất xưởng.

### 2.2. Bảng Tra Cứu Mác Bê Tông Phổ Biến Trong Xây Dựng Ninh Bình

| Mác Bê Tông | Độ Sụt Khuyến Nghị | Cấu Kiện Khuyên Dùng | Ưu Điểm Nổi Bật |
| :--- | :--- | :--- | :--- |
| **Mác 200 (M200)** | 12 ± 2 cm | Bê tông lót móng, sân vườn, tường rào | Tiết kiệm chi phí, dễ cán phẳng bề mặt |
| **Mác 250 (M250)** | 12 ± 2 cm / 14 ± 2 cm | Móng nhà phố, dầm giằng, cột, sàn mái | Độ bền ổn định, chống thấm tiêu chuẩn |
| **Mác 300 (M300)** | 14 ± 2 cm | Nhà cao tầng, sàn vượt nhịp, móng bè | Chịu lực uốn nén cao, độ đặc chắc tuyệt hảo |
| **Mác 350 (M350)** | 16 ± 2 cm (Bơm tĩnh/cần) | Tầng hầm, bể bơi, dầm dự ứng lực | Khả năng chống thấm B6 - B8, tuổi thọ công trình vĩnh cửu |

Để cập nhật đơn giá theo từng mác và cự ly vận chuyển xe bồn, quý khách vui lòng xem trực tiếp tại trang [bảng báo giá bê tông tươi Ninh Bình](/bang-gia) được cập nhật hàng tuần.

---

## 3. Kỹ Thuật Đổ Bê Tông Và Đầm Nén Thực Tế Tránh Co Ngót Nứt Mặt

Thi công **${mainKeyword}** đòi hỏi sự phối hợp nhịp nhàng giữa đội ngũ điều độ xe bồn, thợ vận hành bơm cần và tổ thợ hoàn thiện mặt sàn. Dưới đây là các nguyên tắc "vàng" được các kỹ sư đúc kết qua hàng ngàn [dự án tiêu biểu tại Ninh Bình](/du-an):

### 3.1. Kiểm tra độ sụt và niêm phong xe bồn tại hiện trường
Trước khi xả bê tông vào phễu bơm, cán bộ kỹ thuật giám sát bắt buộc phải:
1. Kiểm tra kẹp chì niêm phong bồn trộn đảm bảo không bị can thiệp trên đường vận chuyển.
2. Thử độ sụt bằng nón côn tiêu chuẩn; chỉ tiếp nhận bê tông khi độ sụt nằm trong dung sai cho phép.
3. Đúc tổ mẫu 3 viên kích thước 15x15x15 cm để lưu mẫu nén thí nghiệm nghiệm thu công trình.

### 3.2. Quy trình đầm dùi chuẩn kỹ thuật
- Đầu đầm dùi phải cắm vuông góc với mặt sàn hoặc cấu kiện, cắm sâu vào lớp bê tông đã đổ trước đó khoảng 10cm để liên kết 2 lớp hoàn hảo.
- Thời gian đầm tại mỗi vị trí từ 15 đến 30 giây (cho đến khi bề mặt bê tông se lại, nổi váng nước mỏng và không còn bọt khí nổi lên).
- Tuyệt đối không kéo lê đầu đầm dùi trên mặt cốt thép vì sẽ làm xô lệch khoảng cách đai thép chịu lực.

### 3.3. Xử lý bề mặt và chống nứt nắng gió Ninh Bình
Đặc thù khí hậu Ninh Bình vào mùa hè có gió Lào khô nóng và nhiệt độ cao, bê tông rất dễ mất nước nhanh gây nứt bề mặt. Biện pháp khắc phục:
- Sử dụng bàn xoa cơ khí hoặc xoa gỗ hoàn thiện ngay khi bê tông bắt đầu đông kết sơ bộ (khoảng 2-3 giờ sau khi cào cán).
- Phủ ngay bạt nilon hoặc bao tải ướt lên bề mặt sàn ngay sau khi hoàn thiện xoa phẳng.

Quý khách hàng cũng có thể xem thêm kinh nghiệm thi công từ ${relatedLink1} và ${relatedLink2}.

---

## 4. Chế Độ Bảo Dưỡng 7 Ngày Vàng Cho Bê Tông Tươi

Cường độ thiết kế của **${mainKeyword}** chỉ có thể đạt được 100% nếu quy trình dưỡng hộ ẩm được tuân thủ nghiêm ngặt trong 7 ngày đầu tiên:

1. **Ngày 1 đến Ngày 3:** Giữ ẩm liên tục 24/24 giờ bằng cách tưới nước dạng phun sương hoặc ngâm nước ngập 2-3cm trên mặt sàn mái. Tuyệt đối không tưới tia nước mạnh làm xói lở bề mặt bê tông non.
2. **Ngày 4 đến Ngày 7:** Duy trì tưới nước giữ ẩm 3 lần/ngày (sáng sớm, trưa và chiều tối).
3. **Tháo dỡ cốp pha an toàn:** Đối với dầm sàn nhịp lớn, chỉ được tháo dỡ hệ giáo chống sau tối thiểu 21 đến 28 ngày hoặc khi có kết quả nén mẫu R28 đạt trên 85% cường độ thiết kế.

---

## 5. Vì Sao Nên Lựa Chọn Bê Tông An Gia Bình Cho Công Trình Của Bạn?

Công ty TNHH Bê Tông An Gia Bình là đối tác tin cậy của nhiều nhà thầu lớn nhỏ trên khắp địa bàn tỉnh Ninh Bình và các vùng phụ cận. Điểm tựa năng lực sản xuất:
- **Đúng khối lượng, chuẩn mác kỹ thuật:** Toàn bộ xe bồn đều được cân tải điện tử tự động, tem niêm phong bảo đảm chất lượng nguyên bản từ trạm.
- **Đáp ứng tiến độ thi công:** Đội xe hơn 35 xe bồn chuyên dụng cùng hệ thống xe bơm cần từ 37m đến 56m sẵn sàng tiếp cận mọi địa hình hoặc độ cao phức tạp.
- **Giá thành hợp lý:** Cung cấp trực tiếp từ trạm trộn với bảng giá tham khảo minh bạch theo từng thời điểm.

Để nhận khảo sát mặt bằng miễn phí và tư vấn chi tiết từ kỹ sư trưởng, vui lòng [liên hệ đặt lịch đổ bê tông](/lien-he) hoặc kết nối qua đường dây nóng:
- **Hotline 24/7:** 0988 2662 93
- **Email:** ketoan.angiabinh@gmail.com
- **Văn phòng & Trạm 1:** KCN Khánh Phú, Phường Đông Hoa Lư, Tỉnh Ninh Bình.
- **Trạm 2:** Xã Kim Sơn, Tỉnh Ninh Bình.
- **Trang chủ chính thức:** [Bê Tông An Gia Bình](/)
`;

    const enrichedFallback = enrichContentWithImages(rawFallback, fallbackTitle, mainKeyword, chosenCover.url);

    const fallbackPost = {
      title: fallbackTitle,
      slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
      excerpt: `Cẩm nang chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
      seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
      seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
      focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
      category: "Kinh Nghiệm",
      tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
      readTime: "12 phút",
      coverImage: chosenCover.url,
      content: enrichedFallback
    };

    return NextResponse.json(fallbackPost);
  }
}
