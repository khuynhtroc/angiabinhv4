import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pageTitle = "",
      slug = "",
      prompt = "",
      action = "generate_all", // "generate_all" | "optimize_seo" | "write_section"
      targetKeywords = "",
      sectionType = "rich_text",
      activeProvider = "gemini",
      aiConfigs = {}
    } = body;

    const title = (pageTitle || "Trang Giới Thiệu Bê Tông An Gia Bình").trim();
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const keywords = targetKeywords || "bê tông tươi ninh bình, trạm trộn an gia bình, đổ bê tông ninh bình, bê tông thương phẩm";

    // 1. Check if Gemini or another provider has an API key configured
    let aiText = "";
    let useFallback = false;

    // Try Gemini if available
    try {
      const geminiApiKey = aiConfigs?.gemini?.apiKey || process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        const client = getGeminiClient();
        if (client) {
          const systemPrompt = `Bạn là chuyên gia SEO và chuyên viên truyền thông kỹ thuật xây dựng hàng đầu của Công ty TNHH Bê Tông An Gia Bình (Ninh Bình).
Website: betongangiabinh.vn
Trạm 1: KCN Khánh Phú, Yên Khánh, Ninh Bình (300m³/h)
Trạm 2: Xã Kim Sơn, Ninh Bình (150m³/h)
Hotline: 0988 2662 93 (24/7)

Nhiệm vụ: Hãy tạo nội dung và tối ưu SEO toàn diện cho trang "${title}" (đường dẫn: /${cleanSlug}).
LƯU Ý QUAN TRỌNG VỀ TỪ NGỮ: Tuyệt đối không dùng các từ mang tính cam kết, khẳng định tuyệt đối (như "cam kết", "khẳng định chắc chắn", "bảo đảm 100%"). Mọi bảng giá đều là tham khảo tại thời điểm hiện tại. Dùng từ ngữ kỹ thuật khách quan như "định lượng chuẩn mác", "kiểm định độ sụt", "đáp ứng tiến độ".
Yêu cầu đầu ra bắt buộc: Trả về ĐÚNG 1 ĐỊNH DẠNG JSON hợp lệ (không kèm văn bản thừa ngoài dấu ngoặc nhọn):
{
  "seoTitle": "Tiêu đề SEO chuẩn 55-60 ký tự chứa từ khóa chính và tên thương hiệu An Gia Bình",
  "seoDescription": "Đoạn mô tả SEO 150-160 ký tự cuốn hút, thúc đẩy nhấp chuột, kèm hotline 0988 2662 93",
  "focusKeywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3", "từ khóa 4"],
  "subtitle": "Lời tựa hoặc thông điệp chính của trang",
  "heroCtaText": "Liên Hệ Ngay",
  "heroCtaLink": "/lien-he",
  "sections": [
    {
      "id": "sec-1",
      "type": "hero",
      "title": "Tiêu đề Hero ấn tượng",
      "content": "Nội dung giới thiệu trọng tâm của trang...",
      "badge": "An Gia Bình Ninh Bình"
    },
    {
      "id": "sec-2",
      "type": "features",
      "title": "Năng Lực & Ưu Điểm Nổi Bật",
      "content": "Mô tả chi tiết về hệ thống trạm đôi, đội xe bồn 35+ chiếc và kiểm định mẫu R28 đạt chuẩn.",
      "items": [
        "Công suất phối trộn 450m³/h sẵn sàng đáp ứng dự án trọng điểm",
        "Đội xe bồn 35+ xe chuyên dụng và 06 xe bơm cần 37m - 56m",
        "100% mẻ bê tông đúc mẫu thí nghiệm nén LAS-XD chuẩn TCVN"
      ]
    },
    {
      "id": "sec-3",
      "type": "rich_text",
      "title": "Nội Dung Kỹ Thuật & Tiêu Chuẩn Phục Vụ",
      "content": "Chi tiết quy trình làm việc, tư vấn khảo sát mặt bằng miễn phí, cung ứng chuẩn mác thiết kế..."
    },
    {
      "id": "sec-4",
      "type": "cta",
      "title": "Nhận Báo Giá Bê Tông Tham Khảo Hôm Nay",
      "content": "Liên hệ ngay kỹ sư Bê Tông An Gia Bình để nhận báo giá chiết khấu trực tiếp theo khối lượng công trình.",
      "badge": "Hotline 0988 2662 93"
    }
  ]
}`;

          const userPrompt = prompt 
            ? `Yêu cầu cụ thể từ người quản trị: ${prompt}\nTrang: "${title}", từ khóa trọng tâm: "${keywords}"`
            : `Hãy tạo cấu trúc nội dung và tối ưu SEO cho trang "${title}". Từ khóa: "${keywords}"`;

          const response = await client.models.generateContent({
            model: aiConfigs?.gemini?.model || "gemini-2.5-flash",
            contents: `${systemPrompt}\n\n${userPrompt}`,
          });

          aiText = response.text || "";
        }
      }
    } catch (e) {
      console.warn("Gemini generation skipped or failed, using local generator:", e);
      useFallback = true;
    }

    // Try parsing AI JSON
    let parsedResult = null;
    if (aiText) {
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn("Could not parse AI response as JSON:", err);
      }
    }

    // High quality programmatic fallback if AI response is missing or unparseable
    if (!parsedResult) {
      const isIntro = title.toLowerCase().includes("giới thiệu") || cleanSlug.includes("gioi-thieu");
      const isPrice = title.toLowerCase().includes("báo giá") || cleanSlug.includes("bang-gia");
      const isContact = title.toLowerCase().includes("liên hệ") || cleanSlug.includes("lien-he");
      const isRecruit = title.toLowerCase().includes("tuyển dụng") || cleanSlug.includes("tuyen-dung");
      const isCapacity = title.toLowerCase().includes("năng lực") || cleanSlug.includes("ho-so-nang-luc");

      const generatedSeoTitle = `${title} | Bê Tông An Gia Bình Ninh Bình`;
      const generatedSeoDesc = `Thông tin chính thức về ${title.toLowerCase()} từ Công ty TNHH Bê Tông An Gia Bình Ninh Bình. Trạm trộn KCN Khánh Phú & Kim Sơn, phục vụ 24/7 hotline 0988 2662 93.`;
      const generatedKeywords = [
        "bê tông tươi ninh bình",
        "bê tông an gia bình",
        title.toLowerCase(),
        "trạm trộn khánh phú",
        "giá bê tông ninh bình"
      ];

      parsedResult = {
        seoTitle: generatedSeoTitle,
        seoDescription: generatedSeoDesc,
        focusKeywords: generatedKeywords,
        subtitle: `Giải pháp cung ứng bê tông tươi thương phẩm uy tín hàng đầu tại tỉnh Ninh Bình`,
        heroCtaText: "Tư Vấn & Đặt Lịch",
        heroCtaLink: "/lien-he",
        sections: [
          {
            id: `sec-${Date.now()}-1`,
            type: "hero",
            title: title,
            content: `Công ty TNHH Bê Tông An Gia Bình - Nhà cung ứng bê tông thương phẩm công nghệ cao với cụm trạm đôi tại KCN Khánh Phú (300m³/h) và Xã Kim Sơn (150m³/h), luôn đảm bảo tiến độ và chất lượng cho mọi công trình tại Ninh Bình.`,
            badge: "Bê Tông An Gia Bình"
          },
          {
            id: `sec-${Date.now()}-2`,
            type: "features",
            title: "Tiêu Chuẩn Chất Lượng & Năng Lực Cung Ứng",
            content: "Chúng tôi áp dụng hệ sinh thái vận hành tự động hóa khép kín từ trạm trộn đến tận chân công trình.",
            items: [
              "Hệ thống định lượng cân điện tử sai số dưới 1% đạt chuẩn TCVN 9340:2012",
              "Đội ngũ 35+ xe bồn và 06 xe bơm cần vươn xa 37m - 56m cơ động toàn tỉnh",
              "Phòng thí nghiệm hợp chuẩn LAS-XD đúc nén mẫu R7 và R28 lưu hồ sơ nghiệm thu",
              "Đội ngũ kỹ sư khảo sát thực địa miễn phí, tư vấn mác bê tông tối ưu chi phí"
            ]
          },
          {
            id: `sec-${Date.now()}-3`,
            type: "rich_text",
            title: "Quy Trình Triển Khai & Kiểm Soát",
            content: `### 1. Tiếp Nhận Yêu Cầu & Khảo Sát Hiện Trường
Ngay sau khi quý khách liên hệ hotline **0988 2662 93**, kỹ sư An Gia Bình sẽ trực tiếp đến công trình đo đạc đường vào xe bồn, tính toán vị trí đặt chân xe bơm cần và kiểm tra điều kiện mặt bằng thi công.

### 2. Thiết Kế Cấp Phối Phù Hợp Từng Hạng Mục
Tùy thuộc kết cấu móng bè, dầm sàn, cột vách hay mái dốc, trạm trộn sẽ điều chỉnh tỷ lệ phụ gia siêu dẻo, phụ gia chống thấm B6 - B12 và độ sụt 12±2cm (đổ xả) hoặc 14±2cm (bơm cần).

### 3. Nghiệm Thu & Cấp Chứng Chỉ Xuất Xưởng
Từng chuyến xe bồn xuất phát đều có phiếu xuất kho điện tử ghi rõ biển số xe, giờ rời trạm, khối lượng m³ và mác bê tông. Kỹ thuật viên hiện trường tiến hành thử độ sụt và đúc mẫu lưu kiểm tra nén mẫu.`
          },
          {
            id: `sec-${Date.now()}-4`,
            type: "cta",
            title: "Đồng Hành Cùng Mọi Công Trình Bền Vững Tại Ninh Bình",
            content: "Hãy liên hệ ngay hôm nay để nhận bảng giá chiết khấu trực tiếp và lịch ưu tiên điều phối xe bồn phục vụ công trình của bạn.",
            badge: "Hotline Kỹ Sư: 0988 2662 93"
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      providerUsed: activeProvider,
      data: parsedResult
    });
  } catch (error: any) {
    console.error("Error in page-writer API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Lỗi xử lý yêu cầu AI"
      },
      { status: 500 }
    );
  }
}
