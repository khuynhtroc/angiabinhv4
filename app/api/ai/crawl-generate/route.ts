import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

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

    const ai = getGeminiClient();

    mainKeyword = primaryKeyword || (customKeywords ? customKeywords.split(',')[0].trim() : "bê tông tươi ninh bình");
    const subKeywords = secondaryKeywords || "bê tông an gia bình, giá bê tông tươi ninh bình, kỹ thuật đổ bê tông, xe bơm bê tông ninh bình";
    const combinedKeywords = customKeywords || `${mainKeyword}, ${subKeywords}`;
    const topicHeading = focusTopic || "Ứng dụng kỹ thuật và công nghệ bê tông thương phẩm chuẩn TCVN tại Ninh Bình";

    // Format internal links for prompt instruction
    const linksList = Array.isArray(internalLinks) && internalLinks.length > 0
      ? internalLinks.map((l: { title?: string; text?: string; url: string }) => `- [${l.text || l.title || l.url}](${l.url})`).join('\n')
      : `- [Báo giá bê tông tươi Ninh Bình](/bang-gia)\n- [Giới thiệu Trạm trộn Bê Tông An Gia Bình](/gioi-thieu)\n- [Quy trình kiểm định và sản xuất](/quy-trinh-san-xuat)\n- [Dự án tiêu biểu tại Ninh Bình](/du-an)\n- [Liên hệ đặt lịch đổ bê tông](/lien-he)\n- [Trang chủ Bê Tông An Gia Bình](/)`;

    const prompt = `Bạn là Giám Đốc Nội Dung Chuẩn SEO Cấp Cao (SEO Content Director) kiêm Chuyên Gia Kỹ Thuật Công Trình của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93 - Email: ketoan.angiabinh@gmail.com).

HÃY VIẾT MỘT BÀI VIẾT CHUẨN SEO CHUYÊN SÂU TỐI THIỂU 1.000 TỪ (BẮT BUỘC >= 1000 WORDS) VỚI CÁC THÔNG SỐ SAU:

1. THÔNG TIN ĐẦU VÀO:
- Chủ đề tập trung (Focus Topic): ${topicHeading}
- Tiêu đề gốc tham khảo: ${sourceTitle || "Tin tức kỹ thuật bê tông xây dựng"}
- Nguồn tham khảo: ${sourceUrl || "Tạp chí Xây Dựng"}
- Nội dung gốc quét được:
${rawContent || "Công nghệ sản xuất bê tông tươi thương phẩm hiện đại, kiểm soát tỷ lệ cấp phối, phụ gia giảm co ngót, phương pháp đổ và bảo dưỡng theo tiêu chuẩn TCVN."}

2. TỪ KHÓA BẮT BUỘC PHẢI LỒNG GHÉP:
- Từ khóa chính (Primary Keyword): "${mainKeyword}" -> Xuất hiện ở Tiêu đề (H1), đoạn mở đầu (100 từ đầu), ít nhất 2 thẻ H2/H3, rải đều trong thân bài (mật độ 1.5% - 2.5%), và đoạn kết luận (Call to action).
- Từ khóa phụ (Secondary Keywords): ${subKeywords} -> Lồng ghép tự nhiên, mượt mà vào các luận điểm kỹ thuật và ví dụ thực tế.

3. LIÊN KẾT NỘI BỘ (INTERNAL LINKS) BẮT BUỘC PHẢI CHÈN VÀO BÀI VIẾT:
Hãy chọn lọc ít nhất 3 đến 5 liên kết từ danh sách dưới đây và chèn tự nhiên vào các đoạn văn phù hợp bằng cú pháp Markdown [Anchor Text](/url):
${linksList}

4. YÊU CẦU ĐỘ DÀI VÀ CẤU TRÚC:
- ĐỘ DÀI: TỐI THIỂU 1.000 TỪ (Nội dung chi tiết, phân tích sâu sắc, không viết vắn tắt hay sáo rỗng).
- BỐ CỤC BÀI VIẾT:
  + Mở bài cuốn hút nêu bối cảnh xây dựng tại Ninh Bình và tầm quan trọng của chủ đề.
  + Thẻ H2 & H3 phân tích chi tiết từng khía cạnh kỹ thuật, bảng tra cứu mác bê tông (M200, M250, M300, M350) hoặc bảng kiểm tra độ sụt.
  + Các lưu ý thực tế tại các huyện/thành phố Ninh Bình (Hoa Lư, Tam Điệp, Kim Sơn, Yên Khánh, Gia Viễn, Nho Quan).
  + Hướng dẫn bảo dưỡng dưỡng ẩm 7 ngày vàng để tránh nứt nẻ.
  + Chèn khéo léo thương hiệu "Bê Tông An Gia Bình" (2 trạm trộn Khánh Phú & Kim Sơn, đội xe 35+ xe bồn, bơm cần 37m-56m, phòng LAS kiểm định).
  + Kết luận kèm thông tin liên hệ và kêu gọi hành động đặt hàng.

5. ĐỊNH DẠNG ĐẦU RA (JSON THUẦN TÚY):
{
  "title": "Tiêu đề chuẩn SEO chứa từ khóa chính hấp dẫn",
  "slug": "tieu-de-khong-dau-chuan-url-than-thien",
  "excerpt": "Đoạn mô tả ngắn 140-160 ký tự chuẩn SEO",
  "seoTitle": "Tiêu đề SEO dưới 65 ký tự chứa từ khóa chính",
  "seoDescription": "Meta Description 140-160 ký tự chứa từ khóa chính và phụ",
  "focusKeywords": ["${mainKeyword}", "từ khóa phụ 1", "từ khóa phụ 2"],
  "category": "Kỹ Thuật Thi Công",
  "tags": ["bê tông tươi ninh bình", "bê tông an gia bình", "${mainKeyword}"],
  "readTime": "8 phút",
  "content": "Toàn bộ bài viết Markdown chi tiết >= 1000 từ có lồng ghép từ khóa chính, từ khóa phụ và các internal links dạng [anchor](/url)",
  "coverImage": "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80"
}`;

    if (!ai) {
      // Fallback deterministic generator if API key is not yet set
      const slug = (sourceTitle || "cong-nghe-be-tong-an-gia-binh")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Hướng Dẫn Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn Tại Ninh Bình`;
      const fallbackPost = {
        title: fallbackTitle,
        slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
        excerpt: `Cẩm nang chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
        seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
        seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
        focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
        category: "Kinh Nghiệm",
        tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
        readTime: "9 phút",
        coverImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80",
        content: `## 1. Tổng Quan Về ${mainKeyword.toUpperCase()} Trong Công Trình Hiện Đại Tại Ninh Bình

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
`
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

    return NextResponse.json(parsed);

  } catch (err: unknown) {
    console.error("AI crawl & rewrite error, falling back to deterministic engine:", err);
    
    // Deterministic fallback so scheduler NEVER breaks
    const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Hướng Dẫn Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn Tại Ninh Bình`;
    const slug = (sourceTitle || "cong-nghe-be-tong-an-gia-binh")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const fallbackPost = {
      title: fallbackTitle,
      slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
      excerpt: `Cẩm nang chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
      seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
      seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
      focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
      category: "Kinh Nghiệm",
      tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
      readTime: "9 phút",
      coverImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1000&auto=format&fit=crop&q=80",
      content: `## 1. Tổng Quan Về ${mainKeyword.toUpperCase()} Trong Công Trình Hiện Đại Tại Ninh Bình

Trong bức tranh phát triển hạ tầng và xây dựng dân dụng bùng nổ tại tỉnh Ninh Bình, nhu cầu sử dụng **${mainKeyword}** đạt chuẩn chất lượng ngày càng trở thành yêu cầu tiên quyết của các chủ đầu tư, kiến trúc sư và nhà thầu xây dựng. Từ các công trình biệt thự, nhà phố tại trung tâm TP. Ninh Bình, TP. Tam Điệp cho đến các khu nhà xưởng trọng điểm tại KCN Khánh Phú, KCN Gián Khẩu, việc ứng dụng bê tông thương phẩm từ trạm trộn chuyên nghiệp đã thay thế hoàn toàn phương pháp trộn thủ công truyền thống.

Để hiểu rõ hơn về năng lực cung ứng và quy mô của đơn vị sản xuất, quý khách hàng có thể tham khảo [giới thiệu trạm trộn Bê Tông An Gia Bình](/gioi-thieu) – đơn vị sở hữu 2 cụm trạm trộn tự động hóa 100% tại KCN Khánh Phú và Xã Kim Sơn với tổng công suất hơn 450m³/h.

---

## 2. Tiêu Chuẩn Kỹ Thuật Cốt Lõi Của Bê Tông Tươi Chuẩn TCVN

Chất lượng của **${mainKeyword}** phụ thuộc chặt chẽ vào quy trình kiểm soát nguồn nguyên vật liệu đầu vào và công nghệ cân đong điện tử tại buồng điều khiển trung tâm. Theo tiêu chuẩn TCVN 9345:2012 và TCVN 3105:1993, các chỉ tiêu sau bắt buộc phải được giám sát nghiêm ngặt:

### 2.1. Cốt liệu cát vàng và đá dăm chọn lọc
- **Cát vàng hạt lớn (Mô-đun độ lớn 2.6 - 3.2):** Cát sạch, được sàng lọc rửa trôi bùn sét, không lẫn tạp chất hữu cơ. Cát hạt lớn giúp kết cấu xi măng bám dính tối đa, hạn chế hiện tượng co ngót gây rạn chân chim bề mặt sàn.
- **Đá dăm 1x2 tuyển chọn:** Đá có cường độ nén cao, độ đồng đều hạt tối ưu, không lẫn đá phong hóa mềm yếu, đảm bảo độ rỗng cấu kiện nhỏ nhất.

### 2.2. Bảng phân loại mác bê tông phổ biến và ứng dụng thực tế
| Mác Bê Tông | Độ Sụt (cm) | Hạng Mục Ứng Dụng Khuyến Nghị | Thời Gian Đông Kết Ban Đầu |
| :--- | :--- | :--- | :--- |
| **Mác 200 (M200)** | 12 ± 2 | Bê tông lót móng, sân vườn, tường rào, sàn không chịu tải lớn | 2.5 - 3.5 giờ |
| **Mác 250 (M250)** | 12 ± 2 | Móng nhà phố, dầm sàn nhà 2-4 tầng, cột chịu lực dân dụng | 2.5 - 3.5 giờ |
| **Mác 300 (M300)** | 14 ± 2 | Nhà cao tầng, tầng hầm, bể bơi, sàn khẩu độ lớn, nhà xưởng | 2.0 - 3.0 giờ |
| **Mác 350 (M350)** | 14 ± 2 | Kết cấu chịu lực đặc biệt, cọc khoan nhồi, dầm cầu vượt | 2.0 - 3.0 giờ |

Trước khi ký kết hợp đồng cung cấp, quý khách nên tra cứu [bảng báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất để lập dự toán chính xác theo từng mác và cự ly vận chuyển.

---

## 3. Quy Trình Thi Công Đổ Bê Tông Chuẩn Kỹ Sư Tại Ninh Bình

Để phát huy tối đa cường độ chịu lực của khối đổ bê tông thương phẩm, các bước thi công thực tế tại công trường cần được tiến hành bài bản:

1. **Kiểm tra độ sụt và niêm phong kẹp chì xe bồn:** Khi xe bồn của Bê Tông An Gia Bình cập chân công trình, cán bộ kỹ thuật cùng chủ nhà tiến hành kiểm tra biên bản giao hàng, kẹp chì bồn trộn và thử độ sụt bằng nón côn tiêu chuẩn.
2. **Đúc mẫu thử nghiệm nén:** Mỗi mẻ đổ từ 20m³ - 50m³ đều được đúc tối thiểu 1 tổ mẫu (3 viên kích thước 15x15x15cm) để lưu mẫu tại [phòng kiểm định LAS-XD](/quy-trinh-san-xuat). Các mẫu này sẽ được nén kiểm tra cường độ tuổi 7 ngày (R7) và 28 ngày (R28).
3. **Kỹ thuật đầm dùi:** Đầm dùi phải vuông góc với bề mặt, bước đầm không quá 1.5 lần bán kính tác dụng, thời gian đầm mỗi vị trí khoảng 20 - 30 giây cho đến khi bê tông không còn sủi bọt khí và nổi lớp vữa xi măng mỏng.

---

## 4. Chế Độ Bảo Dưỡng "7 Ngày Vàng" Phòng Ngừa Nứt Co Ngót

Hiện tượng nứt mặt bê tông sau khi đổ phần lớn không phải do chất lượng bê tông mà bắt nguồn từ khâu bảo dưỡng ban đầu bị lơ là, đặc biệt vào mùa nắng nóng hoặc gió hanh khô tại miền Bắc.

- **4 giờ đầu tiên:** Phủ bạt ẩm hoặc bao bố ướt ngay khi bề mặt bê tông se mặt (sau khi xoa mặt lần cuối).
- **Từ ngày 1 đến ngày 3:** Tưới nước giữ ẩm liên tục không để bề mặt bị trắng khô. Đối với sàn mái, giải pháp ngâm nước bảo dưỡng viền bờ be là phương pháp tối ưu nhất.
- **Từ ngày 4 đến ngày 7:** Duy trì tưới nước đều đặn 3 - 4 lần mỗi ngày vào sáng sớm và chiều mát.

---

## 5. Kết Luận & Đơn Vị Cung Ứng Bê Tông Uy Tín Tại Ninh Bình

Việc lựa chọn đơn vị cung ứng bê tông uy tín có trạm trộn gần công trình, sở hữu đội xe bồn và bơm cần hùng hậu là yếu tố quyết định sự thành bại và tiến độ của cả dự án. Quý khách hàng có thể tham khảo [các dự án công trình tiêu biểu](/du-an) mà Bê Tông An Gia Bình đã thực hiện để an tâm về chất lượng.

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
</div>

Quý khách hàng có nhu cầu khảo sát địa hình, đặt lịch đổ bê tông hoặc điều xe bồn xe bơm, xin vui lòng [liên hệ đặt lịch đổ bê tông](/lien-he) với kỹ sư Bê Tông An Gia Bình qua Hotline **0988 2662 93** để được phục vụ chu đáo nhất!`
    };

    return NextResponse.json(fallbackPost);
  }
}
