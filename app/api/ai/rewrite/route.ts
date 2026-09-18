import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text = "",
      title = "",
      contextTitle = "",
      field = "",
      type = "",
      target = "",
      targetKeywords = "",
      keywords = "",
    } = body;

    const postTitle = (title || contextTitle || "Bê Tông An Gia Bình Ninh Bình").trim();
    const mode = (type || field || target || "content").toLowerCase();
    const effectiveKeywords = (targetKeywords || keywords || "bê tông tươi ninh bình, an gia bình").trim();

    const isExcerpt = mode === "excerpt" || mode === "seo_description" || mode === "summary";
    const isProject = mode === "project" || mode === "project_description";

    // Build intelligent fallback in case Gemini API is offline or key not provided
    let fallbackText = text;
    if (isExcerpt) {
      const cleanTitle = postTitle.replace(/^bảng báo giá\s*/i, '').trim();
      fallbackText = `Bê Tông An Gia Bình Ninh Bình cung ứng giải pháp ${cleanTitle} đạt chuẩn TCVN. Cung cấp đúng mác, đủ khối lượng, xe bơm bồn 24/7 hotline 0988 2662 93.`;
    } else if (isProject) {
      fallbackText = `Dự án "${postTitle}" được Công ty TNHH Bê Tông An Gia Bình triển khai cung ứng bê tông thương phẩm đạt tiêu chuẩn TCVN 9340:2012.

Quy trình thi công được giám sát nghiêm ngặt:
- Trạm trộn tự động KCN Khánh Phú và Xã Kim Sơn cấp phối liên tục với đội hình 35+ xe bồn chuyên dụng.
- Sử dụng phụ gia siêu dẻo giảm nước và kiểm soát độ sụt 14±2cm phù hợp đường dẫn bơm cần 37m - 56m.
- 100% các mẻ bê tông đều được đúc mẫu thí nghiệm nén R7 và R28 lưu hồ sơ nghiệm thu kỹ thuật.
Công trình hoàn thành đảm bảo tiến độ yêu cầu, đáp ứng các tiêu chí kỹ thuật của Chủ đầu tư và Tư vấn giám sát.`;
    } else {
      // Full Markdown Article
      fallbackText = `## 1. Giới Thiệu Chuyên Đề: ${postTitle}

Công tác đổ bê tông thương phẩm đòi hỏi sự phối hợp nhịp nhàng giữa chất lượng cấp phối tại trạm trộn tự động và năng lực cơ giới hóa bơm bồn tại hiện trường. **Công ty TNHH Bê Tông An Gia Bình** tự hào là đối tác vật liệu tin cậy tại Ninh Bình, sở hữu cụm trạm đôi tại KCN Khánh Phú (300m³/h) và Xã Kim Sơn (150m³/h).

![Bê tông An Gia Bình]({{ site.url }}/images/blog/be-tong-thuong-pham-an-gia-binh.jpg)

---

## 2. Tiêu Chuẩn Kỹ Thuật & Cấp Phối TCVN

Mọi mẻ bê tông xuất xưởng đều tuân thủ nghiêm ngặt hệ thống chỉ tiêu chất lượng quốc gia:

| Tiêu Chí Kỹ Thuật | Chỉ Số Quy Chuẩn | Giải Pháp Đảm Bảo Từ An Gia Bình |
| :--- | :--- | :--- |
| **Độ sụt tiêu chuẩn** | 12 ± 2 cm (Bơm cần 14 ± 2) | Bổ sung phụ gia siêu dẻo giữ độ sụt ổn định suốt hành trình xe bồn |
| **Cốt liệu đá** | Đá 1x2 tuyển chọn sàng cơ học | Sạch tạp chất, rửa sạch bụi sét trước khi nạp vào silo cấp liệu |
| **Cốt liệu cát** | Cát vàng hạt thô sạch | Mô đun độ lớn M = 2.4 - 2.8, độ ẩm cát đo điện tử tự động |
| **Kiểm định mẫu thử** | Mác R7 và Mác R28 | Đúc 02 tổ mẫu (6 viên) kiểm định nén tại phòng LAS-XD hợp chuẩn |

---

## 3. Quy Trình Vận Hành & Bơm Bê Tông Hiện Trường

Để đảm bảo kết cấu dầm, cột, sàn đạt độ đặc chắc cao nhất và không bị bọt khí hay rỗ tổ ong:

1. **Kiểm tra niêm phong kẹp chì:** Kỹ thuật viên đối chiếu phiếu giao nhận hàng với số niêm chì bồn xả.
2. **Thử độ sụt bằng nón Abrams:** Đo trực tiếp trước sự chứng kiến của chủ nhà hoặc tư vấn giám sát.
3. **Đầm dùi kỹ thuật:** Đưa đầu chày đầm thẳng đứng, rút từ từ, cự ly đầm 1.5 lần bán kính tác dụng để bê tông lèn chặt quanh cốt thép.
4. **Bảo dưỡng thủy hóa:** Phủ bao bố dưỡng ẩm và tưới nước liên tục 3 lần/ngày trong 7 ngày đầu.

> **Khuyến cáo từ Kỹ sư An Gia Bình:** Tuyệt đối không tự ý châm thêm nước vào bồn xe bê tông tại công trường vì sẽ làm tăng tỷ lệ Nước/Xi măng (N/X), gây tụt mác và nứt co ngót bề mặt.

---

## 4. Liên Hệ Trạm Trộn An Gia Bình Tư Vấn Báo Giá

Quý khách hàng và nhà thầu có nhu cầu đặt lịch đổ bê tông tươi, thuê ca bơm cần hoặc nhận bảng báo giá chiết khấu dự án tại Ninh Bình:

- **Hotline Kỹ Thuật & Điều Độ 24/7:** **0988 2662 93**
- **Trạm 1:** KCN Khánh Phú, Yên Khánh, TP. Ninh Bình (Công suất 300m³/h)
- **Trạm 2:** Xã Kim Sơn, Tỉnh Ninh Bình (Công suất 150m³/h)
- **Email:** ketoan.angiabinh@gmail.com
- **Website:** https://betongangiabinh.vn`;
    }

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json({ rewritten: fallbackText });
    }

    let prompt = "";
    if (isExcerpt) {
      prompt = `Bạn là Chuyên gia SEO và Kỹ thuật Bê Tông của Công ty TNHH Bê Tông An Gia Bình (Ninh Bình, Hotline 0988 2662 93).
Hãy viết lại đoạn mô tả tóm tắt (Meta Description / Excerpt) thật ngắn gọn, súc tích (khoảng 120-160 ký tự), kích thích click vào xem bài viết, chuẩn SEO.

Tiêu đề bài viết: "${postTitle}"
Từ khóa trọng tâm: "${effectiveKeywords}"
Nội dung gốc cần tóm tắt:
"""
${text || postTitle}
"""

YÊU CẦU:
- Trả về DUY NHẤT 1-2 câu tóm tắt (không có ngoặc kép, không có lời dẫn).`;
    } else if (isProject) {
      prompt = `Bạn là Chuyên gia Giám sát Dự án của Công ty Bê Tông An Gia Bình (Ninh Bình).
Hãy viết lại phần mô tả kỹ thuật cho dự án thi công bê tông: "${postTitle}".
Nội dung hiện tại:
"""
${text || "Cung cấp bê tông tươi cho dự án"}
"""

YÊU CẦU:
- Nêu rõ giải pháp kỹ thuật, mác bê tông, xe bơm bồn, tiến độ và kiểm định TCVN.
- Trả về văn bản kết quả thuần túy.`;
    } else {
      prompt = `Bạn là Chuyên gia Kỹ thuật và Nội dung Xây dựng cao cấp của Công Ty TNHH Bê Tông An Gia Bình tại Ninh Bình (Hotline: 0988 2662 93, Email: ketoan.angiabinh@gmail.com).
Trạm trộn gồm Trạm 1 tại KCN Khánh Phú (300m³/h) và Trạm 2 tại Kim Sơn, Ninh Bình (150m³/h).

Hãy VIẾT LẠI và NÂNG CẤP toàn bộ bài viết sau thành một bài viết chuyên sâu, chuẩn SEO bậc nhất về bê tông tươi:
- Tiêu đề liên quan: "${postTitle}"
- Từ khóa cần tối ưu: "${effectiveKeywords}"
- Nội dung gốc cần tối ưu:
"""
${text || postTitle}
"""

YÊU CẦU ĐỊNH DẠNG & NỘI DUNG:
1. Định dạng Markdown hoàn chỉnh với các thẻ ## (heading 2), ### (heading 3), danh sách gạch đầu dòng, bảng so sánh hoặc thông số kỹ thuật.
2. Đưa vào các tiêu chuẩn ngành: TCVN 9340:2012, độ sụt (12±2cm, 14±2cm), mác bê tông (M200, M250, M300, M350, M400), phụ gia siêu dẻo, đầm dùi và dưỡng ẩm.
3. Chèn hình ảnh minh họa hợp lệ dạng: ![Minh họa bê tông]({{ site.url }}/images/blog/be-tong-thuong-pham-an-gia-binh.jpg).
4. Phần kết luận có thông tin liên hệ Hotline 0988 2662 93 của Bê Tông An Gia Bình.
5. Trả về DUY NHẤT nội dung Markdown, không thêm lời chào, không bọc trong code block \`\`\`markdown.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.65,
        },
      });

      let result = response.text ? response.text.trim() : "";
      // Clean possible markdown code fence wrapper
      if (result.startsWith("```markdown")) {
        result = result.replace(/^```markdown\s*/i, "").replace(/\s*```$/, "");
      } else if (result.startsWith("```")) {
        result = result.replace(/^```\s*/i, "").replace(/\s*```$/, "");
      }

      return NextResponse.json({ rewritten: result || fallbackText });
    } catch (genError) {
      console.warn("Gemini generation error, using fallback:", genError);
      return NextResponse.json({ rewritten: fallbackText });
    }
  } catch (error: unknown) {
    console.error("Rewrite route error:", error);
    return NextResponse.json(
      { rewritten: "Bê Tông An Gia Bình Ninh Bình - Cung ứng bê tông tươi chuẩn TCVN, mác 200 - 400, xe bồn xe bơm 24/7. Hotline: 0988 2662 93." },
      { status: 200 }
    );
  }
}
