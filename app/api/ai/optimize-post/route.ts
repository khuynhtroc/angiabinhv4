import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { optimizePostFull, suggestKeywordsAndTags } from "@/lib/postOptimizer";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const {
    title,
    content,
    primaryKeyword,
    secondaryKeywords,
    internalLinks,
    category,
    sanitizeBrandAndContact = true,
    cleanClutter = true
  } = body;

  const kwSuggestions = suggestKeywordsAndTags(title || "", content || "", category);
  const mainKeyword = (primaryKeyword && primaryKeyword.trim()) || kwSuggestions.primaryKeyword;
  const subKeywords = (secondaryKeywords && secondaryKeywords.trim()) || kwSuggestions.secondaryKeywords;

  // Run fast deterministic rule-based pre-optimization / fallback
  const localResult = optimizePostFull(
    {
      title: title || "Bài viết Bê Tông An Gia Bình",
      content: content || "",
      category,
      focusKeywords: [mainKeyword, ...subKeywords.split(',').map((s: string) => s.trim()).filter(Boolean)]
    },
    {
      sanitizeBrandAndContact: Boolean(sanitizeBrandAndContact),
      cleanClutterAndSpecialChars: Boolean(cleanClutter),
      standardizeHeadings: true,
      removeCommitments: true,
      injectInternalLinks: true,
      injectCtaBox: true,
      optimizeTitle: true,
      optimizeExcerpt: true
    }
  );

  const ai = getGeminiClient();

  if (!ai) {
    return NextResponse.json({
      optimizedTitle: localResult.optimizedTitle,
      optimizedExcerpt: localResult.optimizedExcerpt,
      optimizedMetaDescription: localResult.optimizedMetaDescription,
      optimizedContent: localResult.optimizedContent,
      wordCount: localResult.wordCount,
      primaryKeyword: mainKeyword,
      secondaryKeywords: subKeywords,
      suggestedTags: localResult.suggestedTags,
      seoScore: localResult.seoScore,
      optimizationsApplied: localResult.optimizationsApplied,
      stats: localResult.stats
    });
  }

  try {
    // Prepare internal link targets
    const defaultLinks = [
      { text: "Báo giá bê tông tươi Ninh Bình", url: "/bang-gia" },
      { text: "Trạm trộn Bê Tông An Gia Bình", url: "/gioi-thieu" },
      { text: "Quy trình kiểm định chất lượng", url: "/quy-trinh-san-xuat" },
      { text: "Dự án công trình tiêu biểu", url: "/du-an" },
      { text: "Liên hệ tư vấn và đặt lịch đổ bê tông", url: "/lien-he" },
      { text: "Trang chủ Bê Tông An Gia Bình", url: "/" }
    ];
    const availableLinks = Array.isArray(internalLinks) && internalLinks.length > 0 ? internalLinks : defaultLinks;
    const linksGuide = availableLinks.map((l: any) => `- [${l.text || l.title || l.url}](${l.url})`).join('\n');

    const prompt = `Bạn là Chuyên Gia Tối Ưu Hóa Bài Viết Chuẩn SEO Cấp Cao kiêm Biên Tập Viên Trưởng của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93 - Email: ketoan.angiabinh@gmail.com - Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình - Trạm 2: Xã Kim Sơn, Ninh Bình).

HÃY TỐI ƯU LẠI TOÀN DIỆN BÀI VIẾT NÀY CHUẨN ON-PAGE SEO THEO ĐÚNG CÁC QUY TẮC BẮT BUỘC:

1. THÔNG TIN BÀI VIẾT ĐẦU VÀO:
- Tiêu đề: ${title || "Bài viết chuyên ngành bê tông xây dựng"}
- Chuyên mục: ${category || "Kỹ Thuật Thi Công"}
- Nội dung gốc cần tối ưu:
${localResult.optimizedContent}

2. CÁC TIÊU CHUẨN TỐI ƯU BẮT BUỘC:
- TỐI ƯU THEO THƯƠNG HIỆU BÊ TÔNG AN GIA BÌNH:
  + Nếu trong bài có chứa thông tin liên hệ, hotline, email, địa chỉ, hoặc tên đơn vị bê tông khác (như Bê tông Việt Nhật, Rạng Đông, Sông Đà, Việt Đức, Chèm...), ĐỔI TOÀN BỘ sang thương hiệu "Bê Tông An Gia Bình" với Hotline "0988 2662 93", email "ketoan.angiabinh@gmail.com" và hệ thống 2 trạm trộn Khánh Phú & Kim Sơn, Ninh Bình.
- LOẠI BỎ RÁC & KÝ TỰ ĐẶC BIỆT LỘN XỘN:
  + Cắt bỏ triệt để các đoạn văn thừa thãi không liên quan tới tiêu đề bài viết.
  + Loại bỏ các ký tự đặc biệt lộn xộn, template rác (như {{ site.url }}), đoạn link quảng cáo spam, "click here", "nguồn bài viết".
- TỪ KHÓA CHÍNH (Primary Keyword): "${mainKeyword}" -> Tối ưu xuất hiện ở tiêu đề H1, thẻ H2 đầu tiên, rải đều tự nhiên trong thân bài và đoạn kết luận kêu gọi hành động.
- TỪ KHÓA PHỤ (Secondary Keywords): "${subKeywords}" -> Phân bổ tự nhiên vào các đề mục kỹ thuật.
- THẺ TÓM TẮT EXCERPT / META DESCRIPTION:
  + Viết một đoạn tóm tắt sắc bén dài CHÍNH XÁC từ 140 đến 160 ký tự, chứa từ khóa chính, nêu bật cam kết tiêu chuẩn TCVN và hotline 0988 2662 93 của Bê Tông An Gia Bình.
- LOẠI BỎ TỪ NGỮ CAM KẾT CHỦ QUAN:
  + Tuyệt đối không dùng "cam kết 100%", "rẻ nhất thị trường", "số 1 việt nam". Thay bằng "đạt chuẩn TCVN 9340:2012", "kiểm định nén mẫu LAS-XD", "giá cạnh tranh trực tiếp từ trạm trộn".
- LIÊN KẾT NỘI BỘ (INTERNAL LINKS):
  + Chèn tự nhiên 3-5 liên kết sau vào các từ khóa phù hợp trong bài:
${linksGuide}
- ĐỘ DÀI & ĐỘ SÂU NỘI DUNG:
  + Nâng cấp bài viết chi tiết, mạch lạc, có phân chia đề mục H2, H3 rõ ràng, tối thiểu 1.000 từ.

3. ĐỊNH DẠNG ĐẦU RA JSON (CHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG CHỨA BẤT KỲ VĂN BẢN NÀO KHÁC):
{
  "optimizedTitle": "Tiêu đề chuẩn SEO sắc bén chứa từ khóa chính và thương hiệu An Gia Bình",
  "optimizedExcerpt": "Đoạn tóm tắt Excerpt / Meta Description từ 140 - 160 ký tự chuẩn Google",
  "optimizedMetaDescription": "Đoạn tóm tắt Excerpt / Meta Description từ 140 - 160 ký tự chuẩn Google",
  "optimizedContent": "Toàn bộ nội dung bài viết Markdown sau khi tối ưu theo thương hiệu Bê Tông An Gia Bình, làm sạch rác, chèn từ khóa và internal link",
  "primaryKeyword": "${mainKeyword}",
  "secondaryKeywords": "${subKeywords}",
  "suggestedTags": ["Bê tông Ninh Bình", "Bê tông An Gia Bình", "${mainKeyword}"],
  "seoScore": 96,
  "optimizationsApplied": [
    "Tối ưu nội dung chuẩn thương hiệu Bê Tông An Gia Bình (Hotline 0988 2662 93)",
    "Loại bỏ thông tin liên hệ của các đơn vị khác và chuyển về An Gia Bình",
    "Làm sạch ký tự thừa thãi, rác nguồn và ký tự đặc biệt lộn xộn",
    "Tối ưu đoạn tóm tắt Excerpt & Meta Description 140-160 ký tự chuẩn SEO",
    "Lồng ghép từ khóa chính và liên kết nội bộ tự nhiên"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      }
    });

    const text = response.text || "";
    const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleanJson);

    // Compute live word count
    const words = (parsed.optimizedContent || "").trim().split(/\s+/).filter(Boolean).length;
    parsed.wordCount = words;
    if (!parsed.suggestedTags || !Array.isArray(parsed.suggestedTags)) {
      parsed.suggestedTags = localResult.suggestedTags;
    }
    parsed.stats = localResult.stats;

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("AI post optimization fallback to deterministic engine:", err);
    // Graceful fallback to rich local optimizer
    return NextResponse.json({
      optimizedTitle: localResult.optimizedTitle,
      optimizedExcerpt: localResult.optimizedExcerpt,
      optimizedMetaDescription: localResult.optimizedMetaDescription,
      optimizedContent: localResult.optimizedContent,
      wordCount: localResult.wordCount,
      primaryKeyword: mainKeyword,
      secondaryKeywords: subKeywords,
      suggestedTags: localResult.suggestedTags,
      seoScore: localResult.seoScore,
      optimizationsApplied: localResult.optimizationsApplied,
      stats: localResult.stats
    });
  }
}
