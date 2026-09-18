import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

// Curated high quality concrete construction images
const CONCRETE_IMAGE_LIBRARY = [
  {
    theme: "tram_tron",
    keywords: ["trạm", "trạm trộn", "sản xuất", "nhà máy", "batching", "công suất"],
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80",
    desc: "Toàn cảnh trạm trộn bê tông hiện đại công suất lớn với silo xi măng và xe bồn xếp hàng"
  },
  {
    theme: "do_san",
    keywords: ["sàn", "đổ sàn", "dân dụng", "mác 250", "nhà phố", "biệt thự", "bơm cần"],
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    desc: "Thi công đổ bê tông sàn nhà xưởng và công trình kiến trúc hiện đại, công nhân đầm dùi chuyên nghiệp"
  },
  {
    theme: "xe_bon",
    keywords: ["xe bồn", "xe", "vận chuyển", "giao hàng", "bồn quay", "xe bồn an gia bình"],
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80",
    desc: "Đội ngũ xe bồn bê tông thương phẩm đang nạp liệu tại trạm trộn tự động"
  },
  {
    theme: "xe_bom",
    keywords: ["bơm", "xe bơm", "bơm cần", "bơm tĩnh", "cần 52m", "cần 37m", "áp lực cao"],
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80",
    desc: "Xe bơm bê tông cần vươn cao 52m đang vươn cần đổ bê tông tầng thượng công trình lớn"
  },
  {
    theme: "thi_nghiem",
    keywords: ["mác", "kiểm định", "độ sụt", "thí nghiệm", "mẫu nén", "tcvn", "chất lượng"],
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    desc: "Kỹ sư đo độ sụt bê tông tươi bằng nón Abrams và đúc mẫu lập phương kiểm định tại công trường"
  },
  {
    theme: "ha_tang",
    keywords: ["hạ tầng", "đường", "cầu", "kcn", "khu công nghiệp", "gián khẩu", "tam điệp"],
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80",
    desc: "Đại công trường hạ tầng khu công nghiệp với các kết cấu bê tông cốt thép kiên cố"
  },
  {
    theme: "chong_tham",
    keywords: ["chống thấm", "mác 350", "bể nước", "tầng hầm", "móng", "cọc"],
    url: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&auto=format&fit=crop&q=80",
    desc: "Thi công bê tông chống thấm B6, B8 cho kết cấu móng và tầng hầm công trình"
  }
];

export async function POST(req: NextRequest) {
  try {
    const { title = "", action = "suggest_prompt", customPrompt = "" } = await req.json();

    const ai = getGeminiClient();

    if (action === "suggest_prompt") {
      let suggestedPrompt = `Chụp ảnh hiện thực góc rộng flycam 4K: Công trình xây dựng đổ bê tông tươi tại Ninh Bình, xe bồn bê tông và xe bơm cần vươn dài đổ bê tông sàn kiên cố, ánh sáng ban ngày chân thực, độ chi tiết cao của vật liệu xây dựng.`;

      if (ai) {
        try {
          const res = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `Bạn là trợ lý AI chuyên về hình ảnh xây dựng và bê tông tươi.
Dựa vào tiêu đề bài viết: "${title}"
Hãy viết 1 câu Prompt mô tả chi tiết hình ảnh nhiếp ảnh chân thực (photorealistic prompt, độ phân giải cao, ánh sáng tự nhiên, liên quan đến bê tông tươi, xe bồn, xe bơm, hoặc công trình xây dựng tại Ninh Bình).
Chỉ trả về DUY NHẤT 1 câu prompt tiếng Việt súc tích không dài quá 50 từ, không dùng dấu ngoặc kép.`,
            config: { temperature: 0.6 }
          });
          if (res.text) {
            suggestedPrompt = res.text.trim().replace(/^"|"$/g, "");
          }
        } catch {}
      } else {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("bơm")) {
          suggestedPrompt = `Ảnh chụp cận cảnh xe bơm bê tông cần 52m vươn dài đổ bê tông sàn tầng 4 công trình biệt thự cao cấp tại TP Ninh Bình, độ nét cao 4K.`;
        } else if (lowerTitle.includes("giá") || lowerTitle.includes("báo giá")) {
          suggestedPrompt = `Toàn cảnh trạm trộn bê tông tươi tự động hiện đại An Gia Bình tại KCN Khánh Phú Ninh Bình với dàn silo xi măng và đội xe bồn bốc hàng, ánh sáng rực rỡ.`;
        } else if (lowerTitle.includes("mác") || lowerTitle.includes("kỹ thuật") || lowerTitle.includes("độ sụt")) {
          suggestedPrompt = `Kỹ sư kiểm tra độ sụt bê tông tươi và đúc tổ mẫu thử nén bê tông mác 250 tại công trường xây dựng, ánh sáng chuyên nghiệp chân thực.`;
        }
      }

      // Pick matching sample image
      const lower = (title + " " + suggestedPrompt).toLowerCase();
      const matched = CONCRETE_IMAGE_LIBRARY.find(img => img.keywords.some(k => lower.includes(k))) || CONCRETE_IMAGE_LIBRARY[0];

      return NextResponse.json({
        suggestedPrompt,
        sampleImageUrl: matched.url,
        library: CONCRETE_IMAGE_LIBRARY
      });
    }

    // Action: generate_image
    const promptToUse = customPrompt || title || "bê tông tươi";
    const lowerP = promptToUse.toLowerCase();

    // Select the best image from library matching the user prompt
    const matched = CONCRETE_IMAGE_LIBRARY.find(img => img.keywords.some(k => lowerP.includes(k))) || CONCRETE_IMAGE_LIBRARY[Math.floor(Math.random() * CONCRETE_IMAGE_LIBRARY.length)];

    return NextResponse.json({
      imageUrl: matched.url,
      desc: matched.desc,
      prompt: promptToUse
    });

  } catch (error: unknown) {
    console.error("Suggest image error:", error);
    return NextResponse.json(
      { error: "Lỗi xử lý hình ảnh AI." },
      { status: 500 }
    );
  }
}
