import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

const SYSTEM_INSTRUCTION = `Bạn là Chuyên Viên Tư Vấn Kỹ Thuật & Kinh Doanh Cao Cấp của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH (Trạm trộn bê tông tươi, bê tông thương phẩm hàng đầu tại Ninh Bình).
Fanpage Facebook chính thức: https://www.facebook.com/betongangiabinh/
Hotline 24/7: 0988 2662 93
Email: ketoan.angiabinh@gmail.com
Hệ thống trạm trộn:
- Trạm 1: KCN Khánh Phú, phường Đông Hoa Lư, tỉnh Ninh Bình (Công suất 300m³/h).
- Trạm 2: Xã Kim Sơn, tỉnh Ninh Bình (Công suất 150m³/h).
- Đội xe: 35+ xe bồn vận chuyển 10-12m³, 6 xe bơm cần 37m - 56m và các xe bơm tĩnh áp lực cao.

Nhiệm vụ của bạn:
1. Tư vấn mác bê tông chuẩn kỹ thuật:
   - Đổ lót móng: M100 - M150 (giá ~850k - 890k/m³)
   - Đổ móng, dầm, cột, sàn nhà phố dân dụng: Mác 250 (giá ~980k - 1.030k/m³)
   - Đổ nhà cao tầng, sàn xưởng KCN, dầm vượt nhịp: Mác 300 (giá ~1.050k - 1.110k/m³)
   - Đổ cấu kiện chống thấm (tầng hầm, bể nước, mái): Mác 300 - 350 kèm phụ gia chống thấm B6, B8, B10
   - Đông kết nhanh: Thêm phụ gia R7 hoặc R3 để tháo cốt pha sớm.
2. Hướng dẫn tính thể tích bê tông m³:
   - Thể tích = Chiều dài (m) x Chiều rộng (m) x Chiều dày (m).
   - Cộng thêm hệ số hao hụt từ 3% đến 5% tùy độ dày cốp pha và đầm dùi.
3. Tư vấn chọn xe bơm:
   - Nhà dưới 5 tầng, mặt đường thoáng: Bơm cần 37m - 43m.
   - Sàn xưởng rộng, công trình cao: Bơm cần 52m - 56m.
   - Nhà trong ngõ nhỏ xe bồn không vào được: Bơm tĩnh (nối ống dài 50m - 200m).
4. Phong cách giao tiếp: Chuyên nghiệp, lịch sự, nhiệt tình, am hiểu địa bàn Ninh Bình (TP. Ninh Bình, Hoa Lư, Kim Sơn, Yên Khánh, Gia Viễn, Nho Quan, Tam Điệp). Luôn hướng dẫn khách hàng để lại SĐT hoặc gọi Hotline 0988 2662 93 để kỹ sư An Gia Bình tới đo đạc khảo sát hiện trường miễn phí.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful domain-specific fallback if GEMINI_API_KEY is not configured
      const lower = lastUserMessage.toLowerCase();
      let reply = "Chào quý khách! Tôi là trợ lý ảo kỹ thuật của Bê Tông An Gia Bình Ninh Bình (Hotline 24/7: 0988 2662 93). ";

      if (lower.includes("giá") || lower.includes("bao nhiêu")) {
        reply += "Hiện nay giá bê tông thương phẩm An Gia Bình tại Ninh Bình tham khảo như sau:\n• Mác 200: ~920.000đ - 960.000đ/m³\n• Mác 250 (phổ biến nhất cho sàn nhà): ~980.000đ - 1.030.000đ/m³\n• Mác 300: ~1.050.000đ - 1.110.000đ/m³\n• Ca bơm cần: từ 2.800.000đ/ca.\nGiá cụ thể phụ thuộc vào địa chỉ công trình và độ sụt. Quý khách vui lòng để lại Số Điện Thoại hoặc gọi trực tiếp Hotline 0988 2662 93 để được báo giá ưu đãi nhất!";
      } else if (lower.includes("mác") || lower.includes("chọn") || lower.includes("đổ")) {
        reply += "Đối với công trình dân dụng tại Ninh Bình, kỹ sư An Gia Bình khuyến nghị:\n• Móng & Cột & Sàn: Nên dùng Mác 250 (đá 1x2, độ sụt 12±2).\n• Sân thượng / Sàn mái / Bể ngầm: Nên dùng Mác 300 có kèm phụ gia chống thấm B6 hoặc B8 để an tâm tuyệt đối.\n• Cần tháo cốt pha sớm: Yêu cầu trạm An Gia Bình thêm phụ gia đông kết nhanh R7.\nQuý khách muốn đổ hạng mục nào, diện tích ra sao để chúng tôi hỗ trợ tính khối lượng chính xác?";
      } else if (lower.includes("tính") || lower.includes("khối") || lower.includes("m3") || lower.includes("thể tích")) {
        reply += "Cách tính khối lượng bê tông (m³) rất đơn giản:\nSố m³ = Chiều dài (m) × Chiều rộng (m) × Chiều dày (m) × 1.04 (hệ số dôi dư 4%).\nVí dụ: Sàn 100m² dày 12cm (0.12m) sẽ cần: 100 × 0.12 × 1.04 ≈ 12.5 m³ bê tông.\nQuý khách có thể nhập thông số vào công cụ 'Tính Toán Bê Tông' ngay trên website hoặc gọi 0988 2662 93 để kỹ sư đến đo trực tiếp.";
      } else {
        reply += "Bê Tông An Gia Bình sở hữu 2 cụm trạm trộn tự động hóa tại KCN Khánh Phú (300m³/h) và Xã Kim Sơn (150m³/h) với hơn 35 xe bồn và hệ thống xe bơm cần 37m-56m, bơm tĩnh áp lực cao. Chúng tôi sẵn sàng phục vụ quý khách 24/7 trên toàn tỉnh Ninh Bình. Quý khách cần tư vấn báo giá, chọn mác bê tông hay đặt lịch đổ bê tông cho công trình nào ạ?";
      }

      return NextResponse.json({ reply });
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Dạ, Bê Tông An Gia Bình xin nghe. Quý khách vui lòng gọi Hotline 0988 2662 93 hoặc để lại số điện thoại để kỹ sư kinh doanh liên hệ trực tiếp ạ!";
    return NextResponse.json({ reply });

  } catch (err: unknown) {
    console.error("Gemini chat error:", err);
    return NextResponse.json(
      { reply: "Hệ thống tư vấn Bê Tông An Gia Bình đang xử lý nhiều lượt yêu cầu. Quý khách vui lòng gọi trực tiếp Hotline 24/7: 0988 2662 93 hoặc gửi email ketoan.angiabinh@gmail.com để được phục vụ ngay tức khắc!" },
      { status: 200 }
    );
  }
}
