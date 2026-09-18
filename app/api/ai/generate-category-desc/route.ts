import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { categoryName, slug, style = "standard" } = await req.json();

    if (!categoryName || !categoryName.trim()) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp tên chuyên mục." },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const prompt = `Bạn là Chuyên gia Kỹ thuật và Chiến lược Nội dung SEO cho Công ty TNHH Bê Tông An Gia Bình tại Ninh Bình (Hotline: 0988 2662 93, KCN Khánh Phú và Kim Sơn, Ninh Bình).
Hãy viết một đoạn MÔ TẢ CHUYÊN MỤC BÀI VIẾT (Category Meta Description chuẩn SEO) cho chuyên mục: "${categoryName.trim()}" (đường dẫn: /blog/${slug || 'tin-tuc'}/).

YÊU CẦU:
1. Độ dài: 2 đến 3 câu súc tích (khoảng 140 - 180 ký tự hoặc 40 - 60 từ), rất thích hợp hiển thị ở đầu trang chuyên mục và làm meta description Google Search.
2. Nội dung: Khái quát những chủ đề, kiến thức chuyên sâu, tiêu chuẩn kỹ thuật (TCVN 9340:2012, cấp phối, mác bê tông 150-450, bơm cần, độ sụt) hoặc báo giá liên quan đến chuyên mục này tại tỉnh Ninh Bình.
3. Văn phong: Chuyên nghiệp, đáng tin cậy, thể hiện vị thế đơn vị trạm trộn bê tông tươi hàng đầu Ninh Bình.
4. Trả về DUY NHẤT đoạn văn mô tả tiếng Việt hoàn chỉnh, KHÔNG thêm lời chào, KHÔNG có ngoặc kép bọc ngoài, KHÔNG dùng markdown tiêu đề.`;

    if (!ai) {
      // High-quality deterministic fallback tailored for concrete categories
      const lower = categoryName.toLowerCase();
      let fallbackDesc = `Chuyên mục ${categoryName} tổng hợp các bài viết kỹ thuật chuyên sâu, báo giá bê tông tươi và cẩm nang thi công từ đội ngũ kỹ sư Bê Tông An Gia Bình Ninh Bình.`;

      if (lower.includes('báo giá') || lower.includes('thị trường')) {
        fallbackDesc = `Cập nhật liên tục bảng báo giá bê tông tươi Ninh Bình mác 150-450, giá thuê ca xe bơm cần 37m-56m và chính sách chiết khấu mới nhất từ trạm trộn An Gia Bình.`;
      } else if (lower.includes('kỹ thuật') || lower.includes('thi công')) {
        fallbackDesc = `Hướng dẫn kỹ thuật đổ bê tông móng, sàn, dầm cột; quy trình kiểm tra côn thử độ sụt, bảo dưỡng ẩm chống nứt và nghiệm thu chuẩn TCVN tại công trường.`;
      } else if (lower.includes('tiêu chuẩn') || lower.includes('chất lượng')) {
        fallbackDesc = `Tổng hợp tiêu chuẩn quốc gia TCVN, quy trình đúc mẫu nén R7, R28 tại phòng thí nghiệm LAS và chứng nhận kiểm định chất lượng trạm trộn An Gia Bình.`;
      } else if (lower.includes('cẩm nang') || lower.includes('kinh nghiệm')) {
        fallbackDesc = `Cẩm nang kinh nghiệm xây dựng thực chiến, bí quyết chọn mác bê tông tối ưu chi phí và phòng tránh rủi ro nứt ngót cho công trình nhà dân và dự án tại Ninh Bình.`;
      } else if (lower.includes('dự án') || lower.includes('công trình')) {
        fallbackDesc = `Hồ sơ các dự án thi công đổ bê tông thương phẩm tiêu biểu tại KCN Khánh Phú, Tam Điệp, Kim Sơn và các công trình giao thông trọng điểm tỉnh Ninh Bình.`;
      }

      return NextResponse.json({ description: fallbackDesc });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    const generatedText = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : '';
    return NextResponse.json({ description: generatedText });
  } catch (error: unknown) {
    console.error("Generate category description error:", error);
    return NextResponse.json(
      { error: "Không thể tạo mô tả bằng AI. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
