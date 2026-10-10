import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { getAllPostsServer } from "@/lib/server-data";

// Curated high quality concrete construction images with Vietnamese context
const CONCRETE_IMAGE_CATALOG = [
  {
    id: "tram-tron",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80",
    alt: "Trạm trộn bê tông tươi An Gia Bình công suất lớn tại Ninh Bình",
    caption: "Toàn cảnh cụm trạm trộn bê tông tự động hóa hiện đại của Bê Tông An Gia Bình tại KCN Khánh Phú và Kim Sơn công suất 450m³/h.",
    keywords: ["trạm", "trạm trộn", "công suất", "sản xuất", "nhà máy", "báo giá", "giá", "an gia bình", "tổng quan"]
  },
  {
    id: "do-san",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    alt: "Thi công đổ bê tông sàn dầm cột công trình Ninh Bình",
    caption: "Công nhân thi công cào cán, đầm dùi bê tông tươi mặt sàn nhà xưởng và biệt thự đạt chuẩn kỹ thuật TCVN 9345:2012.",
    keywords: ["sàn", "đổ sàn", "đầm dùi", "mác 250", "nhà phố", "dầm", "cột", "thi công", "quy trình"]
  },
  {
    id: "xe-bon",
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80",
    alt: "Đội xe bồn vận chuyển bê tông thương phẩm An Gia Bình",
    caption: "Đội ngũ hơn 35 xe bồn chuyên dụng vận chuyển bê tông tươi giao tận chân công trình khắp Ninh Bình có kẹp chì niêm phong.",
    keywords: ["xe bồn", "xe", "vận chuyển", "xe bồn bê tông", "giao hàng", "đội xe", "tiến độ"]
  },
  {
    id: "xe-bom",
    url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80",
    alt: "Xe bơm cần bê tông tươi vươn cao tại công trình Ninh Bình",
    caption: "Xe bơm cần 37m - 56m công suất lớn vươn cần đổ bê tông sàn cao tầng nhanh chóng, vượt chướng ngại vật đường dây điện.",
    keywords: ["bơm", "xe bơm", "bơm cần", "bơm tĩnh", "cần 52m", "cần 37m", "áp lực cao", "độ cao"]
  },
  {
    id: "thi-nghiem",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    alt: "Kiểm tra độ sụt và đúc mẫu thử nén bê tông tươi",
    caption: "Cán bộ kỹ thuật đo độ sụt bằng nón côn chuẩn Abrams và đúc tổ mẫu lập phương 15x15x15cm lưu nghiệm thu tại phòng LAS-XD.",
    keywords: ["độ sụt", "thí nghiệm", "mác", "kiểm định", "mẫu nén", "tcvn", "chất lượng", "mác 300", "tiêu chuẩn"]
  },
  {
    id: "bao-duong",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80",
    alt: "Bảo dưỡng bề mặt bê tông tươi sau khi đổ",
    caption: "Quy trình dưỡng hộ ẩm 7 ngày vàng giúp bê tông phát triển tối đa cường độ R28 và ngăn ngừa hiện tượng co ngót nứt nẻ.",
    keywords: ["bảo dưỡng", "nứt", "tưới nước", "dưỡng hộ", "7 ngày", "chống nứt", "co ngót"]
  },
  {
    id: "chong-tham",
    url: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&auto=format&fit=crop&q=80",
    alt: "Thi công bê tông chống thấm cho tầng hầm và mái",
    caption: "Ứng dụng phụ gia chống thấm B6 - B12 và kỹ thuật đầm nén cho các kết cấu ngầm, bể chứa nước và sàn mái ngoài trời.",
    keywords: ["chống thấm", "tầng hầm", "bể bơi", "mái", "phụ gia", "b6", "b8", "nước"]
  },
  {
    id: "cong-nghiep",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80",
    alt: "Công trình hạ tầng và nhà xưởng bê tông cốt thép",
    caption: "Hạ tầng giao thông, cầu cảng và nhà xưởng công nghiệp tại các khu công nghiệp trọng điểm Khánh Phú và Gián Khẩu Ninh Bình.",
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
  if (existingMatches && existingMatches.length >= 6) {
    return content; // Already has sufficient images
  }

  // Filter available images avoiding the cover image if possible
  const candidatePool = CONCRETE_IMAGE_CATALOG.filter(img => img.url !== coverUrl);
  const imagesToInsert: Array<{ url: string; alt: string; caption: string }> = [];

  const text = (title + " " + keywords + " " + content.slice(0, 1000)).toLowerCase();
  
  // Sort candidate pool by keyword match relevance
  const scored = candidatePool.map(img => ({
    img,
    score: img.keywords.filter(k => text.includes(k)).length
  })).sort((a, b) => b.score - a.score);

  scored.slice(0, 6).forEach(item => imagesToInsert.push(item.img));

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
    // Insert after sections 1, 2, 4, 6, 8, 10
    if (i === 1 || i === 2 || i === 4 || i === 6 || i === 8 || i === 10) {
      const targetLineIdx = h2Indices[i] + offset + 2;
      const img = imagesToInsert[insertCount];
      const imageBlock = `\n![${img.alt}](${img.url})\n*Hình ${insertCount + 1}: ${img.caption}*\n`;
      
      lines.splice(targetLineIdx, 0, imageBlock);
      offset++;
      insertCount++;
    }
  }

  // Fallback if not inserted enough
  if (insertCount < 3 && imagesToInsert.length > 0) {
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

/**
 * Deterministic high-authority engineering whitepaper generator (> 5,000 words guaranteed)
 */
function buildDeterministicWhitepaper(mainKeyword: string, subKeywords: string, sourceTitle: string, relatedArticles: Array<{ title: string; url: string }>): string {
  const rel1 = relatedArticles[0] ? `[${relatedArticles[0].title}](${relatedArticles[0].url})` : `[dự án công trình tiêu biểu tại Ninh Bình](/du-an)`;
  const rel2 = relatedArticles[1] ? `[${relatedArticles[1].title}](${relatedArticles[1].url})` : `[quy trình kiểm định chất lượng LAS-XD](/quy-trinh-san-xuat)`;

  const chapters = [
`## 1. Tổng Quan Thị Trường Xây Dựng & Tầm Nhìn Chiến Lược Của ${mainKeyword.toUpperCase()} Tại Ninh Bình

Trong tiến trình đô thị hóa và hiện đại hóa cơ sở hạ tầng bùng nổ của tỉnh Ninh Bình giai đoạn 2025 - 2030, ngành xây dựng dân dụng lẫn công nghiệp đang chứng kiến những bước chuyển mình mạnh mẽ. Từ các tuyến phố sầm uất tại Thành phố Ninh Bình, Thành phố Tam Điệp, các khu đô thị mới như Phúc Sơn, Xuân Thành, cho đến các địa bàn huyện có nền địa chất phù sa bồi lắng như Yên Khánh, Kim Sơn, Gia Viễn, Nho Quan, nhu cầu về một giải pháp kết cấu vững chắc, bền bỉ qua nhiều thế hệ ngày càng trở nên cấp thiết. Trong bối cảnh đó, sự hiện diện và ứng dụng của giải pháp **${mainKeyword}** không đơn thuần chỉ là một sự thay thế vật liệu xây dựng mà là một cuộc cách mạng về kiểm soát chất lượng, đẩy nhanh tiến độ thi công và bảo vệ tài sản trường tồn cho các chủ đầu tư.

Nhiều năm về trước, phương pháp tự phối trộn bê tông thủ công bằng máy trộn mini quả lê tại chân công trình từng là tập quán quen thuộc của đa số thợ xây địa phương. Tuy nhiên, cùng với sự gia tăng về quy mô công trình, sự phức tạp của kết cấu dầm sàn vượt nhịp và các yêu cầu khắt khe về chống thấm tầng hầm, bể ngầm, phương pháp thủ công này đã phơi bày hàng loạt khuyết tật nghiêm trọng. Việc đong đếm cốt liệu cát, đá, xi măng và nước một cách áng chừng bằng xẻng hoặc xô nhựa dẫn đến hiện tượng cấp phối không đồng đều; mỗi mẻ trộn có một độ sụt và cường độ khác nhau; cốt liệu cát sông thường bị lẫn bùn sét hữu cơ do không qua quy trình rửa đãi công nghiệp; đá dăm lẫn nhiều hạt thoi dẹt và bụi đá phong hóa; tỷ lệ nước/xi măng (N/X) bị thợ hồ tự ý tăng lên để dễ cào cán, vô tình làm suy giảm nghiêm trọng cường độ chịu nén thiết kế và tạo ra hàng triệu vi mao dẫn khiến sàn nhà bị thấm nứt sau vài mùa mưa.

Trước thực trạng đó, việc áp dụng công nghệ bê tông thương phẩm từ trạm trộn cơ giới hóa tự động 100% của Công ty TNHH Bê Tông An Gia Bình đã tạo nên một bước ngoặt mang tính bản lề. Bằng việc định lượng nguyên vật liệu bằng hệ thống cân điện tử có độ chính xác sai số dưới 1%, kết hợp với quy trình giám sát chất lượng tại phòng thí nghiệm chuyên ngành LAS-XD, bê tông tươi đã chứng minh được sự vượt trội tuyệt đối về khả năng chịu lực, độ đồng nhất và tuổi thọ kết cấu. Để hiểu rõ quy mô công nghệ và năng lực đáp ứng của đơn vị dẫn đầu khu vực, quý khách hàng và các kỹ sư có thể tìm hiểu thêm về [giới thiệu trạm trộn Bê Tông An Gia Bình](/gioi-thieu) với 2 cụm nhà máy hiện đại tại KCN Khánh Phú và Huyện Kim Sơn, cung ứng liên tục hơn 450m³ bê tông tươi mỗi giờ.

Một yếu tố không thể bỏ qua là tính đồng bộ trong dây chuyền cung ứng. Khi một công trình đổ sàn biệt thự hoặc nhà phố diện tích từ 100m² đến 250m², nếu sử dụng phương pháp trộn tay thủ công, nhà thầu phải huy động từ 15 đến 25 lao động làm việc cật lực từ sáng sớm đến tối muộn. Thời gian thi công kéo dài hàng chục tiếng đồng hồ khiến lớp bê tông đổ trước đã bắt đầu ninh kết đóng rắn trong khi lớp bê tông đổ sau mới được đưa vào, hình thành nên các mạch ngừng thi công nguội ngoài ý muốn. Đây chính là nguyên nhân hàng đầu gây ra hiện tượng rò rỉ nước, nứt gãy dầm sàn và giảm khả năng chịu lực liên hợp của cốt thép. Ngược lại, với đội xe bồn chuyên dụng kết hợp xe bơm cần công suất lớn của Bê Tông An Gia Bình, toàn bộ khối lượng 40m³ đến 60m³ bê tông của một sàn nhà phố chỉ mất từ 1.5 đến 2.5 giờ để hoàn tất toàn bộ quá trình bơm, đầm dùi và cán phẳng mặt sàn, đảm bảo tính liền khối tuyệt đối từ chân cột đến nóc mái.`,

`## 2. Tiêu Chuẩn Kỹ Thuật Vật Liệu Đầu Vào Theo TCVN & Kiểm Soát Cốt Liệu Chuẩn Trạm Trộn

Để tạo nên một khối **${mainKeyword}** đạt chuẩn mác thiết kế và có khả năng chống chọi bền vững với khí hậu nhiệt đới gió mùa khắc nghiệt tại miền Bắc, việc tuyển chọn và kiểm định nguyên vật liệu đầu vào là điều kiện tiên quyết. Tại trạm trộn Bê Tông An Gia Bình, mọi nguồn vật tư đều phải trải qua các phép thử nghiệm cơ lý nghiêm ngặt theo các tiêu chuẩn quốc gia hiện hành như TCVN 7570:2006 (Cốt liệu cho bê tông và vữa), TCVN 2682:2009 (Xi măng Poóc lăng) và TCVN 6260:2009 (Xi măng Poóc lăng hỗn hợp):

### 2.1. Cát vàng tự nhiên hạt lớn – Xương sống liên kết cơ học
Cát sử dụng trong bê tông chất lượng cao bắt buộc phải là cát vàng tự nhiên được khai thác từ lòng sông Lô hoặc sông Mã. Tiêu chuẩn kỹ thuật bắt buộc:
- Mô-đun độ lớn (Fineness Modulus) phải đạt từ 2.6 đến 3.2. Cát hạt lớn giúp giảm diện tích bề mặt tiếp xúc riêng, từ đó giảm hàm lượng nước nhào trộn và lượng hồ xi măng cần thiết để bao bọc hạt, hạn chế tối đa nguy cơ co ngót thể tích khi bê tông đóng rắn.
- Hàm lượng bùn, bụi, sét và tạp chất hữu cơ kiểm soát chặt chẽ dưới 1.0% khối lượng (thấp hơn nhiều so với ngưỡng 3.0% cho phép của TCVN). Tuyệt đối không sử dụng cát nhiễm mặn, cát biển hoặc cát mịn (mô-đun < 1.8) vì sẽ gây hiện tượng nứt chân chim và giảm 30% cường độ nén cơ học.

### 2.2. Đá dăm 1x2 sàng tuyển cơ học cường độ cao
Đá dăm là khung chịu lực nén chính của kết cấu bê tông. Bê Tông An Gia Bình tuyển chọn đá dăm 10x20mm và 10x25mm từ các mỏ đá vôi có tuổi địa chất già tại Ninh Bình:
- Cường độ nén của đá gốc đạt tối thiểu 1000 - 1200 kg/cm², đảm bảo khả năng chịu lực uốn nén vượt trội.
- Hàm lượng hạt thoi dẹt được khống chế dưới 8%, hạt có góc cạnh sắc nét giúp tăng cường độ bám dính ngàm cơ học với vữa xi măng.
- Toàn bộ đá trước khi đưa vào phễu chứa của trạm trộn đều trải qua hệ thống sàng rung phân loại và phun nước rửa trôi bụi bột đá nhằm tránh làm mất hoạt tính bám dính của màng xi măng.

### 2.3. Xi măng Poóc-lăng hỗn hợp PCB40 si-lô kín khí
Xi măng là chất kết dính quyết định tốc độ phát triển cường độ của khối bê tông. Chúng tôi sử dụng các thương hiệu xi măng PCB40 uy tín hàng đầu như Xi măng The Vissai, Duyên Hà, Tam Điệp, Hoàng Thạch:
- Xi măng được vận chuyển bằng xe chuyên dụng bồn kín và bơm trực tiếp bằng khí nén vào các si-lô chứa đứng dung tích 150 - 200 tấn.
- Hệ thống si-lô kín khí bảo vệ xi măng khỏi sự xâm nhập của hơi ẩm không khí, giữ cho hoạt tính xi măng luôn đạt trạng thái tốt nhất trước giờ trộn.
- Độ mịn của xi măng qua sàng 0.08mm dưới 10%, lượng nước tiêu chuẩn tạo vữa dẻo từ 26% - 28%, thời gian bắt đầu đông kết không sớm hơn 45 phút và kết thúc không muộn hơn 10 giờ.

### 2.4. Phụ gia siêu hóa dẻo & giảm nước thế hệ mới (Polycarboxylate Ether)
Để bê tông có thể luân chuyển êm ái qua hàng trăm mét đường ống bơm cao tầng mà không bị tắc nghẽn hoặc phân tầng, việc ứng dụng phụ gia hóa học thế hệ thứ 3 (gốc Polycarboxylate) đóng vai trò then chốt:
- Khả năng giảm lượng nước nhào trộn từ 18% đến 25% trong khi vẫn giữ nguyên hoặc gia tăng độ sụt của hỗn hợp bê tông.
- Giảm thiểu triệt để tỷ lệ N/X (Nước/Xi măng) xuống mức lý tưởng 0.40 - 0.45, giúp cấu trúc đá xi măng sau khi hydrat hóa trở nên đặc chắc, loại bỏ hoàn toàn các vi lỗ rỗng gây thấm dột.
- Kéo dài thời gian duy trì độ sụt ổn định trong vòng 90 - 120 phút trên đường vận chuyển, đặc biệt thích hợp với điều kiện giao thông và cự ly vận chuyển xe bồn khắp tỉnh Ninh Bình.

Mời quý bạn đọc tham khảo thêm quy trình nghiệm thu vật tư và kiểm định chất lượng tại [quy trình kiểm định và sản xuất chuẩn TCVN](/quy-trinh-san-xuat).`,

`## 3. Khảo Sát Địa Chất Đặc Thù Ninh Bình & Bài Toán Lựa Chọn Loại Móng

Ninh Bình là tỉnh có địa hình bán sơn địa vô cùng đa dạng, chuyển tiếp giữa vùng núi cao đá vôi phía Tây và đồng bằng trũng ven biển phía Đông Nam. Yếu tố địa chất công trình tại từng khu vực có sự phân hóa sâu sắc, đòi hỏi chủ nhà và kỹ sư xây dựng phải hiểu rõ để lựa chọn loại móng và mác bê tông tương thích:

### 3.1. Khu vực đồng bằng trũng phù sa sông Đáy và ven biển (Yên Khánh, Kim Sơn)
- **Đặc điểm địa chất:** Đất sét dẻo mềm, bùn sét phù sa bồi đắp tầng mặt dày từ 8m đến 15m, mực nước ngầm nông chỉ cách mặt đất tự nhiên từ 0.5m đến 1.2m, có tính chất nhiễm mặn hoặc nhiễm phèn nhẹ ở các xã ven biển Kim Sơn (Kim Đông, Kim Trung, Bình Minh).
- **Nguy cơ kết cấu:** Sức chịu tải của nền đất yếu (R0 chỉ khoảng 0.5 - 0.8 kg/cm²), rất dễ xảy ra hiện tượng lún lệch không đều giữa các đầu cột, gây nứt toác tường và xé toạc dầm móng.
- **Giải pháp bê tông & móng:** 
  + Ưu tiên giải pháp móng cọc bê tông cốt thép dự ứng lực hoặc cọc ép bê tông sâu qua lớp bùn chạm tầng sét cuội sỏi.
  + Đối với nhà phố 2-4 tầng sử dụng móng bè liên tục toàn khối: Bắt buộc sử dụng bê tông mác từ **M250 đến M300**, chiều dày bản bè tối thiểu 300 - 450mm kèm dầm sườn móng cao 600 - 800mm để tạo độ cứng vững chống lại phản lực đáy móng.
  + Bắt buộc tích hợp phụ gia chống thấm cấp **B6 hoặc B8** cho toàn bộ đài móng và giằng móng để ngăn chặn muối sunfat và nước ngầm ăn mòn cốt thép.

### 3.2. Khu vực thung lũng đá vôi và sườn đồi karst (TP. Ninh Bình, Hoa Lư, Gia Viễn, Nho Quan)
- **Đặc điểm địa chất:** Lớp đất phủ mỏng, dưới đáy là đá vôi nứt nẻ hoặc hang caster ngầm, đá mồ côi phân bố rải rác. Nước mặt thấm nhanh qua các khe nứt địa chất.
- **Nguy cơ kết cấu:** Đặt móng lên đầu các mỏm đá mồ côi hoặc khe hang ngầm không được xử lý có thể gây trượt móng hoặc sụt lún đột ngột cục bộ.
- **Giải pháp bê tông & móng:** Cần đào bóc lớp đất phong hóa đến tầng đá gốc, sử dụng móng băng giao thoa hai phương hoặc móng đơn trên nền đá. Bê tông móng nên sử dụng mác **M250** với độ sụt 12±2cm để đầm nén ôm sát các hốc đá tự nhiên.

### 3.3. Khu vực đất đồi đầm chặt và gò đồi bazan (TP. Tam Điệp)
- **Đặc điểm địa chất:** Nền đất sét sỏi son, đất đồi gạch màu nâu đỏ, cường độ chịu tải đất tự nhiên khá tốt (R0 đạt 1.5 - 2.5 kg/cm²).
- **Giải pháp bê tông & móng:** Rất thuận lợi cho thi công móng nông như móng băng hoặc móng đơn. Khuyến nghị sử dụng bê tông mác **M250** cho hệ móng giằng và mác **M250 - M300** cho dầm sàn các tầng trên.`,

`## 4. Bảng Tra Cứu Toàn Diện Các Mác Bê Tông Thương Phẩm & Độ Sụt Chuẩn TCVN

Việc lựa chọn đúng mác bê tông cho từng cấu kiện không chỉ quyết định hệ số an toàn chịu lực của ngôi nhà mà còn giúp gia chủ tiết kiệm hàng chục triệu đồng chi phí lãng phí vật tư. Dưới đây là bảng tra cứu kỹ thuật toàn diện do Ban Kỹ Thuật Công ty Bê Tông An Gia Bình biên soạn chuẩn hóa theo TCVN 3105:1993 và TCVN 9345:2012:

| Mác Bê Tông (M) | Cấp Độ Bền Nén (B) | Độ Sụt Khuyến Nghị | Cấu Kiện Khuyên Dùng | Tiêu Chuẩn & Đặc Tính Kỹ Thuật | Ứng Dụng Thực Tế |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mác 150 (M150)** | B10 - B12.5 | 10 ± 2 cm | Bê tông lót móng, cán tôn nền tầng 1, sân vườn | Ngăn mất nước xi măng của lớp móng trên, làm phẳng đáy hố móng | Nhà dân, tường rào |
| **Mác 200 (M200)** | B15 | 12 ± 2 cm | Móng nhà cấp 4, tường rào, sân để xe gia đình | Dễ cán xoa mặt, giá thành kinh tế, phù hợp tải trọng nhẹ | Công trình phụ trợ |
| **Mác 250 (M250)** | B20 | 12 ± 2 / 14 ± 2 cm | Móng nhà phố, dầm giằng, cột, sàn mái 2 - 5 tầng | Tiêu chuẩn vàng nhà dân dụng, độ đặc chắc cao, chống thấm cơ bản | [Báo giá M250](/bang-gia) |
| **Mác 300 (M300)** | B22.5 | 14 ± 2 / 16 ± 2 cm | Biệt thự tân cổ điển, sàn nhịp lớn >6m, móng bè | Cường độ phát triển nhanh, chịu nén uốn cao, ngăn ngừa nứt võng sàn | [Báo giá M300](/bang-gia) |
| **Mác 350 (M350)** | B25 | 16 ± 2 cm (Bơm cần) | Tầng hầm, bể ngầm, hồ bơi, cọc khoan nhồi | Tích hợp chống thấm B6 - B8, cấu trúc đá xi măng siêu đặc chắc | [Báo giá M350](/bang-gia) |
| **Mác 400 (M400)** | B30 | 16 ± 2 cm | Dầm vượt nhịp lớn, nhà xưởng tải nặng KCN | Cường độ cực cao, kiểm soát chặt chẽ nhiệt thủy hóa xi măng | [Báo giá M400](/bang-gia) |

### 4.1. Hiểu đúng về Độ Sụt (Slump) trong thi công
Độ sụt là chỉ số phản ánh tính công tác và độ linh động của hỗn hợp bê tông tươi, được đo bằng độ sụt lún của khối bê tông hình nón cụt chuẩn Abrams (chiều cao 300mm):
- **Độ sụt 10 ± 2 cm:** Thích hợp cho móng đổ trực tiếp bằng máng xả của xe bồn, bê tông ít chảy, dễ giữ hình dáng ván khuôn mái dốc.
- **Độ sụt 12 ± 2 cm:** Thích hợp cho bơm tĩnh cự ly ngắn dưới 50m hoặc thi công dầm sàn thông thường bằng cần cẩu tháp.
- **Độ sụt 14 ± 2 cm đến 16 ± 2 cm:** Tiêu chuẩn bắt buộc cho thi công bơm cần áp lực cao (cần 37m - 56m) và bơm tĩnh nối ống luồn ngõ sâu từ 80m đến 150m. Độ sụt này cho phép hỗn hợp bê tông len lỏi qua lưới thép đan dày đặc mà không bị nghẽn ống hay hình thành bọng khí rỗ tổ ong.

Quý khách hàng có thể tham khảo bảng chi phí cập nhật mới nhất cho từng mác tại trang [báo giá bê tông tươi Ninh Bình mới nhất](/bang-gia).`,

`## 5. Quy Trình Thi Công Đổ Bê Tông Từng Cấu Kiện Chi Tiết Từ Kỹ Sư Trưởng

Một khối bê tông hoàn hảo là sự kết hợp giữa cấp phối trạm trộn chuẩn xác và tay nghề thi công chuẩn mực của đội thợ tại hiện trường. Dưới đây là hướng dẫn kỹ thuật chi tiết cho từng cấu kiện công trình dân dụng và công nghiệp:

### 5.1. Kỹ thuật đổ bê tông Móng (Móng bè, móng băng, móng đài cọc)
- **Chuẩn bị trước khi đổ:** Hố móng phải được vét sạch bùn rác, đổ lớp bê tông lót M150 dày tối thiểu 10cm. Ván khuôn phải kín khít, quét dầu chống dính và gia cố thanh chống xiên chắc chắn để không bị phình bung khi chịu áp lực dòng bê tông xả mạnh.
- **Phương pháp đổ:** Đổ theo từng lớp nằm ngang dày từ 30cm đến 40cm, đổ từ xa về gần phía phễu bơm. Sử dụng đầm dùi phi 50 cắm thẳng đứng qua lớp bê tông mới vào lớp dưới khoảng 10cm để hai lớp hòa quyện liền mạch.
- **Lưu ý đặc biệt:** Đối với móng bè có khối lượng lớn (> 50m³), cần tính toán tốc độ cung ứng của trạm trộn đạt tối thiểu 20 - 30m³/h để lớp bê tông trước chưa vượt quá thời gian bắt đầu đông kết sơ bộ (45 phút) thì lớp tiếp theo đã được đổ phủ lên.

### 5.2. Kỹ thuật đổ bê tông Cột và Vách chịu lực
- **Chiều cao rơi tự do:** Tuyệt đối không để vòi bơm xả bê tông rơi tự do từ độ cao vượt quá 1.5 mét vì cốt liệu đá dăm nặng hơn sẽ rơi xuống đáy trước, cát và vữa xi măng nổi lên trên, gây hiện tượng phân tầng và rỗ tổ ong chân cột.
- **Biện pháp thi công:** 
  + Đối với cột cao trên 3.5m, bắt buộc phải dùng ống vòi voi luồn sâu xuống đáy cột hoặc trổ cửa sổ đổ bê tông ở lưng chừng thân cột.
  + Trước khi bơm bê tông mác chính, thợ kỹ thuật phải đổ trước một lớp vữa xi măng cát tỷ lệ 1:1 dày khoảng 5 - 10cm vào chân cột để làm lớp đệm chống rỗ tiếp giáp mạch ngừng móng.
  + Đầm dùi cắm từng đoạn 40cm, kết hợp gõ nhẹ ván khuôn bên ngoài bằng búa cao su để bọt khí bám dính thành khuôn thoát ra ngoài.

### 5.3. Kỹ thuật đổ bê tông Dầm và Sàn toàn khối
- **Nguyên tắc đổ:** Đổ bê tông dầm trước cho đến khi cách mặt đáy bản sàn khoảng 3 - 5cm thì chuyển sang đổ dầm và sàn đồng thời. Đổ sàn theo hướng giật lùi, bắt đầu từ góc xa nhất của công trình và lùi dần về phía cầu thang hoặc đường thoát ống bơm.
- **Kỹ thuật đầm nén kép:**
  + Dầm sàn sâu: Dùng đầm dùi cắm so le các điểm cách nhau 30 - 40cm, thời gian đầm tại mỗi điểm từ 20 đến 30 giây cho đến khi mặt bê tông sủi hết bọt khí và nổi lên một lớp váng xi măng bóng loáng.
  + Bản sàn mỏng (10 - 15cm): Sau khi cào cán phẳng bằng thước nhôm hộp 3m, bắt buộc phải sử dụng đầm bàn kéo đều 2 lượt vuông góc nhau để làm đặc chắc 5cm bề mặt trên cùng, tăng cường khả năng chống thấm nước mưa.

### 5.4. Kỹ thuật hoàn thiện mặt sàn và xoa nền chống nứt chân chim
- Khoảng 2 đến 3 giờ sau khi đầm nén (khi mặt bê tông đã se lại, bước chân người lên chỉ lún khoảng 3 - 5mm), thợ hoàn thiện dùng bàn xoa gỗ hoặc máy xoa nền cơ khí mini xoa đều toàn bộ bề mặt.
- Động tác xoa cơ học giúp ép chặt các vết nứt vi mô do co ngót dẻo thoát nước ban đầu, đóng kín các mao dẫn rỗng và tạo bề mặt bóng nhẵn hoàn hảo trước khi bảo dưỡng.`,

`## 6. Giải Pháp Bê Tông Chống Thấm Toàn Khối (B6 – B12) Cho Tầng Hầm & Bể Nước Ngầm

Thấm dột là nỗi ám ảnh lớn nhất của các chủ đầu tư sau khi hoàn thiện nhà. Đặc biệt tại Ninh Bình với lượng mưa hàng năm lớn và nền đất phù sa ẩm ướt, việc chống thấm bằng màng khò hay sơn quét bên ngoài chỉ có tuổi thọ từ 3 đến 5 năm do hiện tượng lão hóa hữu cơ. Giải pháp chống thấm triệt để và kinh tế nhất chính là **chống thấm tự thân toàn khối** ngay từ khi sản xuất bê tông tươi:

### 6.1. Cơ chế hoạt động của phụ gia chống thấm tinh thể thẩm thấu (Permeability-Reducing Admixture)
Bê Tông An Gia Bình ứng dụng phụ gia chống thấm thế hệ mới được phối trộn đồng nhất ngay tại trạm trộn. Các ion hoạt tính trong phụ gia sẽ phản ứng hóa học với canxi hydroxit tự do sinh ra từ quá trình thủy hóa xi măng, tạo thành hàng triệu tinh thể vô cơ hình kim không tan. Các tinh thể này phát triển len lỏi lấp đầy 100% các vi mao dẫn và vết nứt có độ rộng lên đến 0.4mm, biến khối bê tông thành một khối đá liền đặc kín khí và kín nước hoàn toàn.

### 6.2. Các cấp độ chống thấm B theo TCVN 3116:1993
- **Cấp chống thấm B6 (Chịu áp lực cột nước 6 atm tương đương 60m nước):** Ứng dụng cho sàn mái ngoài trời, sê-nô thu nước, ban công, khu vệ sinh âm sàn.
- **Cấp chống thấm B8 (Chịu áp lực cột nước 8 atm):** Tiêu chuẩn bắt buộc cho bể chứa nước ăn ngầm gia đình, bể phốt tự hoại, vách tầng hầm nửa nổi nửa chìm.
- **Cấp chống thấm B10 - B12 (Chịu áp lực cột nước 10 - 12 atm):** Ứng dụng cho tầng hầm sâu 2 - 3 tầng, bể bơi vô cực trên cao, hầm ngầm xử lý nước thải công nghiệp tại KCN Khánh Phú và Gián Khẩu.

### 6.3. Chi tiết thi công chống thấm mạch ngừng bằng băng cản nước Waterstop
Khối bê tông dù đạt mác cao đến đâu thì vị trí tiếp giáp giữa đáy đáy bể và thành vách bể (mạch ngừng thi công) vẫn là điểm xung yếu số 1 gây rò rỉ nước ngầm. Biện pháp thi công chuẩn mực của Bê Tông An Gia Bình:
1. Lắp đặt dải băng cản nước PVC Waterstop loại V hoặc O rộng 150 - 200mm chính giữa tim thép vách trước khi đổ bê tông đáy.
2. Vệ sinh thổi sạch vụn rác, xịt rửa sạch bụi xi măng tại vị trí mạch ngừng trước khi đổ tiếp thành vách.
3. Quét một lớp phụ gia kết nối gốc epoxy hoặc vữa xi măng polymer đàn hồi chuyên dụng lên bề mặt mạch ngừng trước khi bơm bê tông mới.

Khách hàng có thể tham khảo thêm các hình ảnh thực tế từ các ${rel1} và ${rel2}.`,

`## 7. Giải Pháp Vượt Ngõ Hẻm Sâu 150m Bằng Đội Xe Bơm Cần & Bơm Tĩnh Chuyên Dụng

Một trong những rào cản lớn nhất khiến nhiều chủ nhà trong các khu dân cư cũ tại TP. Ninh Bình, TP. Tam Điệp và các thị trấn e ngại sử dụng bê tông tươi là **đường vào quá hẹp, xe bồn 10 khối không thể tiếp cận chân công trình**. Thấu hiểu sâu sắc nỗi trăn trở này, Công ty Bê Tông An Gia Bình đã đầu tư đồng bộ hệ thống thiết bị cơ giới chuyên biệt để xử lý triệt để bài toán ngõ hẹp:

### 7.1. Đội xe bơm cần từ 37m đến 56m vươn cao vượt chướng ngại vật
- **Cần gập thông minh chữ Z và RZ:** Cho phép đầu vòi bơm vươn linh hoạt qua hệ thống dây điện dân sinh chằng chịt, tán cây xanh hoặc mái hiên tôn của nhà lân cận.
- **Vươn cần qua nóc nhà:** Đối với các công trình nằm trong ngõ cách mặt đường lớn 30 - 45 mét, xe bơm cần có thể đỗ tại lòng đường lớn và vươn toàn bộ chiều dài cần qua nóc nhà mặt tiền để thả vòi rót trực tiếp bê tông vào sàn công trình phía sau mà xe bồn không cần phải đi vào ngõ.

### 7.2. Giải pháp Bơm Tĩnh nối đường ống thép chịu áp lực cao lên tới 150m
Khi ngõ quá sâu (> 50m) hoặc có nhiều góc ngoặt gấp khúc mà xe bơm cần không thể vươn tới, giải pháp **Bơm Tĩnh (Bơm kéo)** là sự cứu cánh hoàn hảo:
- Xe bơm tĩnh được đỗ ngoài đường rộng, kết nối với hệ thống đường ống thép đúc áp lực cao đường kính D125mm.
- Đội ngũ thợ lắp đường ống của An Gia Bình sẽ khảo sát trước và rải đường ống men theo bờ tường ngõ hẻm, luồn qua cửa nách hoặc kéo dọc theo giếng trời lên các tầng cao một cách gọn gàng, an toàn tuyệt đối cho người đi đường.
- **Cấp phối bê tông chuyên dụng cho bơm tĩnh:** Để bê tông có thể di chuyển êm thuận qua 150m đường ống với áp lực đẩy lên tới 120 bar mà không bị nghẽn tắc, chúng tôi thiết kế cấp phối đặc biệt:
  + Tăng tỷ lệ cát vàng lên 42% - 45% để tạo lớp màng vữa đệm bôi trơn thành ống.
  + Sử dụng phụ gia siêu dẻo duy trì độ sụt ổn định ở mức 16 ± 2 cm.
  + Bơm trước một mẻ vữa xi măng bôi trơn đường ống (vữa láng ống) trước khi cho bê tông thương phẩm chính thức luân chuyển.

Nhờ giải pháp này, hàng trăm hộ gia đình tại các con ngõ nhỏ chỉ rộng từ 1.8m đến 2.5m tại Ninh Bình đã đổ sàn bê tông thương phẩm nhanh chóng, an toàn và sạch sẽ, không hề làm vương vãi cát đá gây ô nhiễm khu phố như phương pháp trộn tay truyền thống.`,

`## 8. Quy Trình Kiểm Định Chất Lượng, Chống Gian Lận & Nghiệm Thu Hiện Trường

Sự tin tưởng tuyệt đối của khách hàng trong suốt hơn 10 năm qua tại Ninh Bình bắt nguồn từ tính minh bạch và quy trình kiểm định chất lượng khép kín tại chân công trình của Bê Tông An Gia Bình. Để đảm bảo quyền lợi tối đa cho gia chủ và nhà thầu, chúng tôi khuyến khích khách hàng thực hiện đầy đủ các bước nghiệm thu sau khi xe bồn cập bến:

### 8.1. Kiểm tra niêm phong chì và phiếu xuất kho điện tử
- **Niêm phong kẹp chì nguyên vẹn:** Mỗi xe bồn khi xuất xưởng từ trạm trộn Khánh Phú hoặc Kim Sơn đều được kẹp chì niêm phong tại phễu xả và van điều khiển nước. Khách hàng kiểm tra mã số kẹp chì trùng khớp với mã in trên phiếu giao hàng. Điều này đảm bảo 100% tài xế không thể tự ý pha thêm nước lã trên đường vận chuyển làm suy giảm mác bê tông.
- **Phiếu giao hàng điện tử:** Thể hiện rõ biển số xe, tên khách hàng, địa chỉ công trình, giờ xuất trạm, giờ đến hiện trường, loại mác bê tông đặt mua (ví dụ: M250, M300), cấp độ sụt yêu cầu và thể tích thực tế trên xe (tính bằng m³).

### 8.2. Thử độ sụt bằng nón côn chuẩn Abrams tại công trường
Trước khi tài xế xả bê tông vào phễu bơm, cán bộ kỹ thuật của An Gia Bình cùng chủ nhà hoặc giám sát công trình tiến hành thử độ sụt ngay tại máng xả:
1. Đặt nón côn chuẩn (chiều cao 300mm, đường kính đáy 200mm, đỉnh 100mm) lên tấm thép phẳng nằm ngang và dùng chân giẫm chặt hai tai nón.
2. Cho bê tông vào nón làm 3 lớp xấp xỉ bằng nhau, mỗi lớp dùng thanh thép tròn trơn D16 dài 600mm đầm đều 25 cái từ ngoài vào trong.
3. Gạt phẳng miệng nón, nhấc nón côn lên từ từ theo phương thẳng đứng trong khoảng thời gian từ 5 đến 7 giây.
4. Đặt nón côn úp ngược bên cạnh khối bê tông đã sụt, dùng thước đo khoảng cách từ đỉnh nón đến điểm rơi cao nhất của khối bê tông. Dung sai độ sụt cho phép nằm trong khoảng ± 2 cm so với hợp đồng đặt hàng. Nếu độ sụt sai lệch vượt mức cho phép, khách hàng có toàn quyền từ chối nhận mẻ bê tông đó.

### 8.3. Đúc 3 tổ mẫu lập phương 15x15x15cm lưu nghiệm thu tại phòng LAS-XD
Để có căn cứ pháp lý và kỹ thuật nghiệm thu thanh quyết toán, quy trình lấy mẫu thử nén được thực hiện như sau:
- Mỗi lô bê tông từ 20m³ đến 50m³ được đúc tối thiểu 1 tổ mẫu (gồm 3 viên lập phương kích thước chuẩn 150 x 150 x 150 mm).
- Mẫu được đúc vào khuôn gang hoặc khuôn thép chuẩn, đầm chặt và gạt phẳng bề mặt, dán tem niêm phong có chữ ký xác nhận của đại diện chủ nhà và kỹ thuật trạm trộn.
- Sau 24 giờ dưỡng hộ ban đầu tại hiện trường, mẫu được chuyển về phòng thí nghiệm chuyên ngành kiểm định xây dựng LAS-XD của An Gia Bình để dưỡng ẩm trong phòng chuẩn (nhiệt độ 27 ± 2°C, độ ẩm > 95%).
- **Thử nén cường độ:** Tiến hành nén mẫu bằng máy ép thủy lực tự động ở tuổi 7 ngày (R7 - đạt khoảng 70% - 80% mác thiết kế) để đưa ra dự báo sớm, và nén ở tuổi 28 ngày (R28 - bắt buộc đạt 100% - 115% mác thiết kế) để xuất biên bản kết quả thí nghiệm chính thức cho chủ nhà.

Quý khách hàng có thể đọc thêm về [tiêu chuẩn lấy mẫu kiểm định LAS-XD](/quy-trinh-san-xuat).`,

`## 9. Cẩm Nang Xử Lý Sự Cố Khẩn Cấp Tại Công Trường: Trời Mưa To & Nắng Gắt Ninh Bình

Thời tiết là biến số rủi ro lớn nhất trong quá trình thi công bê tông toàn khối. Tại Ninh Bình, hai thái cực thời tiết khắc nghiệt thường gặp nhất là những cơn mưa rào bất chợt vào mùa hè thu và những đợt nắng nóng gay gắt trên 39°C kết hợp gió Lào khô khốc. Dưới đây là các phác đồ xử lý sự cố chuẩn kỹ sư giúp bảo toàn 100% chất lượng công trình:

### 9.1. Phác đồ xử lý khi đang đổ bê tông thì gặp trời mưa rào to
Mưa lớn có thể làm rửa trôi lớp hồ xi măng bề mặt, tăng tỷ lệ N/X cục bộ và gây rỗ xốp bê tông non.
1. **Chuẩn bị dự phòng bắt buộc:** Trước mỗi ca đổ bê tông sàn hoặc mái, nhà thầu bắt buộc phải chuẩn bị sẵn các cuộn bạt nilon khổ rộng đủ để che phủ toàn bộ diện tích sàn thi công.
2. **Nếu mưa nhỏ (mưa phùn nhẹ):** Vẫn tiếp tục thi công bình thường, tiến hành cào cán đến đâu dùng bạt nilon hoặc tấm xốp che phủ ngay đến đó để tránh nước mưa đọng trực tiếp lên bề mặt bê tông chưa đóng rắn.
3. **Nếu mưa giông to xối xả kéo dài:**
   - Ngay lập tức tạm dừng trạm xả bê tông từ xe bồn.
   - Nhanh chóng đầm dùi kỹ phần bê tông đã đổ đến một vị trí cấu kiện có nội lực mô-men uốn nhỏ nhất (thường là ở vị trí 1/3 đến 1/4 nhịp dầm hoặc sàn) để tạo **mạch ngừng thi công chủ động**.
   - Tạo gờ chắn nghiêng 45 độ hoặc tạo nhám bề mặt mạch ngừng, tuyệt đối không để mặt phẳng mạch ngừng thẳng đứng trơn nhẵn.
   - Dùng bạt nilon kéo phủ kín toàn bộ sàn, gia cố gạch chèn mép bạt để gió lốc không thổi bay, khơi thông đường thoát nước tạm thời ra khỏi mặt sàn ván khuôn.
   - **Xử lý sau khi tạnh mưa:** Dùng máy bơm hút sạch nước đọng, đợi bê tông non se lại thì dùng vòi xịt rửa sạch bùn bẩn, tưới nước hồ dầu xi măng cát tỷ lệ 1:1 hoặc quét phụ gia liên kết bê tông cũ - mới trước khi tiếp tục bơm các mẻ tiếp theo.

### 9.2. Phác đồ chống rạn nứt chân chim khi thi công dưới trời nắng nóng >38°C
Nhiệt độ cao kết hợp gió Lào làm nước trên bề mặt bê tông bốc hơi cực nhanh (vượt quá tốc độ 1.0 kg/m²/h), trong khi bên trong khối bê tông vẫn ẩm ướt, tạo ra sự chênh lệch ứng suất co ngót nhiệt rất lớn dẫn đến hiện tượng nứt chân chim chằng chịt:
- **Thời điểm đổ bê tông:** Khuyến nghị khách hàng đăng ký đổ bê tông vào khung giờ chiều muộn (từ 16h00 trở đi) hoặc ca đêm để tránh ánh nắng mặt trời chiếu trực tiếp.
- **Biện pháp hạ nhiệt cốt liệu:** Tại trạm trộn An Gia Bình, đá dăm được phun nước làm mát liên tục và sử dụng nước lạnh nhào trộn để khống chế nhiệt độ hỗn hợp bê tông tươi xuất xưởng dưới 32°C.
- **Che phủ dưỡng ẩm tức thì:** Ngay sau khi xoa phẳng mặt sàn, không đợi bê tông khô hẳn mà phải phủ ngay một lớp màng nilon bảo vệ hoặc bao tải gai tẩm ướt lên bề mặt để khóa chặt hơi ẩm, ngăn chặn 100% hiện tượng mất nước bề mặt.`,

`## 10. Chế Độ Dưỡng Hộ "7 Ngày Vàng" & Thời Điểm Tháo Dỡ Cốp Pha Theo TCVN 4453:1995

Chất lượng của khối **${mainKeyword}** sau khi đổ chỉ mới hoàn thành được 50% chặng đường; 50% còn lại quyết định tuổi thọ công trình chính là **chế độ dưỡng hộ ẩm**. Xi măng là chất kết dính thủy lực, nó cần có môi trường nước liên tục trong những ngày đầu để phản ứng thủy hóa xảy ra hoàn toàn và phát triển tinh thể cường độ:

### 10.1. Lịch trình bảo dưỡng 7 ngày vàng chi tiết
- **Giai đoạn 1: 24 giờ đầu tiên sau khi đổ**
  + Giữ nguyên lớp màng nilon che phủ hoặc rải lớp bao tải ướt lên toàn bộ mặt sàn.
  + Sau khoảng 4 - 6 giờ (khi bê tông đã đủ cứng để đi lại mà không để lại vết lõm), bắt đầu phun nước dạng sương mù nhẹ nhàng lên bề mặt. Tuyệt đối không dùng vòi nước xịt tia mạnh trực tiếp vì sẽ làm xói mòn lớp xi măng non.
- **Giai đoạn 2: Từ ngày thứ 2 đến ngày thứ 3**
  + Duy trì độ ẩm bề mặt 100% cả ngày lẫn đêm. Phương pháp tốt nhất cho sàn mái và sàn tầng là **ngâm nước (bảo dưỡng thủy hóa ngập nước)**: Đắp bờ cát hoặc gạch cao 5 - 10cm xung quanh mép sàn và bơm nước ngập sâu khoảng 2 - 3cm. Lớp nước này vừa giữ ẩm tuyệt đối vừa đóng vai trò như một tấm đệm nhiệt làm giảm sự chênh lệch nhiệt độ ngày - đêm.
- **Giai đoạn 3: Từ ngày thứ 4 đến ngày thứ 7**
  + Tưới nước giữ ẩm định kỳ tối thiểu 3 đến 4 lần mỗi ngày (sáng sớm 06:00, trưa nắng 11:30, đầu giờ chiều 14:30 và tối 18:00). Vào những ngày hanh khô có gió Lào, cần tăng tần suất tưới để bề mặt bê tông không bao giờ bị trắng khô.

### 10.2. Thời điểm tháo dỡ ván khuôn cốp pha an toàn theo TCVN 4453:1995
Nhiều thợ xây vì muốn quay vòng coppha nhanh đã vội vàng tháo giáo chống chỉ sau 7 - 10 ngày, gây hiện tượng võng nứt dầm sàn vĩnh viễn không thể khắc phục. Quy định thời gian tối thiểu được phép tháo dỡ coppha chịu lực:
- **Cốp pha thành bên (cột, vách, dầm):** Có thể tháo sau 24 - 48 giờ khi bê tông đạt cường độ tối thiểu 50 kg/cm² đủ để giữ nguyên hình dạng cấu kiện.
- **Cốp pha đáy dầm, bản sàn nhịp nhỏ (< 2 mét):** Được phép tháo dỡ sau tối thiểu 7 - 10 ngày khi cường độ nén đạt trên 50% R28.
- **Cốp pha đáy dầm, bản sàn nhịp trung bình (2 - 8 mét):** Bắt buộc phải duy trì hệ giáo chống tối thiểu **21 đến 28 ngày** (hoặc khi có kết quả nén mẫu R28 đạt trên 80% mác thiết kế).
- **Cấu kiện conson, ban công vươn ra ngoài:** Bắt buộc duy trì 100% cột chống đỡ chịu lực đến đủ 28 ngày và chỉ tháo dỡ khi công trình đã đổ xong các tầng bên trên để tránh tải trọng lật.`,

`## 11. Dự Toán Chi Phí & So Sánh Bài Toán Kinh Tế Thực Tế Tại Ninh Bình

Rất nhiều chủ nhà ban đầu lầm tưởng rằng tự mua cát, đá, xi măng về gọi thợ trộn tay sẽ tiết kiệm được chi phí so với gọi bê tông tươi từ trạm trộn. Tuy nhiên, khi đặt lên bàn cân tính toán chi tiết toàn bộ các chi phí ẩn, bê tông tươi thương phẩm luôn mang lại hiệu quả kinh tế và độ an toàn vượt trội:

### 11.1. Bảng so sánh kinh tế chi tiết cho công trình nhà phố 100m² sàn (Khối lượng 15m³ bê tông)

| Hạng Mục So Sánh | Phương Pháp Trộn Thủ Công (Máy Quả Lê) | Sử Dụng Bê Tông Tươi An Gia Bình | Phân Tích Lợi Ích & Chênh Lệch |
| :--- | :--- | :--- | :--- |
| **Chi phí vật tư cát, đá, xi măng** | Mua lẻ tại đại lý vật liệu: Giá cao hơn 10 - 15% so với giá gốc trạm trộn nhập khẩu quy mô lớn. | Nhập số lượng lớn từ nhà máy, giá nguyên vật liệu gốc cạnh tranh tối ưu. | Tiết kiệm từ 50.000 - 80.000 đ/m³ vật tư. |
| **Hao hụt vật tư tại mặt bằng** | Hao hụt từ 8% - 12% do cát đá rơi vãi ra lòng đường, xi măng bị ẩm mốc, thợ xúc vung vãi. | Hao hụt gần như 0%; trạm trộn cân điện tử xả trực tiếp vào phễu bơm tới tận sàn. | Tiết kiệm từ 1.200.000 - 1.800.000 đ tiền hao hụt. |
| **Chi phí nhân công thợ đổ** | Cần 15 - 20 thợ kéo tời, xúc cát đá trong 8 - 10 tiếng. Chi phí nhân công: 350.000 - 400.000 đ/người. | Chỉ cần 4 - 5 thợ cào cán, máy bơm cần tự động rót vào vị trí. Ca bơm trọn gói. | Giảm 60% chi phí nuôi thợ và nước non bồi dưỡng. |
| **Thời gian thi công hoàn thiện** | Kéo dài 8 đến 10 tiếng liên tục mệt mỏi, dễ xảy ra mạch ngừng nguội gây nứt sàn. | Chỉ mất **1.5 đến 2 giờ** hoàn thành sạch sẽ, bê tông đồng nhất liền khối. | Rút ngắn 80% thời gian thi công, gia chủ đỡ vất vả giám sát. |
| **Chất lượng mác & Bảo hành** | Mác phập phù không đồng đều, phụ thuộc vào tay xúc của thợ hồ, không có phòng thí nghiệm bảo hành. | 100% chuẩn mác, kẹp chì niêm phong, đúc mẫu nén LAS-XD nghiệm thu bằng văn bản pháp lý. | Giá trị ngôi nhà bền bỉ trăm năm, không lo thấm dột sửa chữa. |

### 11.2. Công thức tính khối lượng bê tông sàn chính xác gia chủ cần nhớ
Để không bị đặt thừa hoặc thiếu bê tông trong ngày đổ, quý khách áp dụng công thức tiêu chuẩn:
$$V = S \\times H \\times k$$
Trong đó:
- **V:** Thể tích bê tông cần đặt mua (m³).
- **S:** Diện tích mặt sàn thi công (m²), ví dụ: 100 m².
- **H:** Chiều dày lớp bê tông sàn (m), ví dụ: 0.12 m (12 cm).
- **k:** Hệ số nở dơ dầm sàn và hao hụt ván khuôn gỗ (thường lấy từ 1.03 đến 1.05 đối với sàn phẳng, và 1.10 đến 1.15 nếu tính gộp cả khối lượng bê tông dầm phụ và dầm chính).

Ví dụ: Sàn nhà phố diện tích 100m², bản sàn dày 12cm, hệ dầm kích thước 22x40cm:
Tổng thể tích bê tông thực tế cần đặt = 100 x 0.12 x 1.12 = 13.44 đến 14.0 m³ (tương đương 1 xe bồn 10m³ và 1 xe bồn 4m³).

Để nhận bảng dự toán bóc tách khối lượng chi tiết miễn phí cho công trình của mình, quý gia chủ vui lòng xem tại [bảng báo giá bê tông tươi Ninh Bình](/bang-gia).`,

`## 12. Bộ Hỏi Đáp Thường Gặp (FAQ) & Năng Lực Cung Ứng Bê Tông An Gia Bình

Dưới đây là tổng hợp 8 câu hỏi thực tế được các gia chủ và nhà thầu xây dựng tại Ninh Bình quan tâm nhiều nhất khi chuẩn bị đổ bê tông tươi:

### Câu 1: Nhà tôi trong ngõ sâu 80m tại phố cổ TP. Ninh Bình thì xe bê tông có vào được không?
**Trả lời:** Hoàn toàn được. Bê Tông An Gia Bình sở hữu dàn thiết bị bơm tĩnh chuyên dụng áp lực cao, có thể nối đường ống thép luồn qua ngõ sâu tới 150m mà không cần xe bồn đi vào ngõ. Đội ngũ kỹ sư sẽ đến tận nơi khảo sát mặt bằng đường ống miễn phí trước 1 ngày.

### Câu 2: Làm sao để tôi biết trạm trộn giao đúng mác bê tông tôi đã đặt mua chứ không bị tráo mác thấp hơn?
**Trả lời:** Chúng tôi cam kết minh bạch 100%: Mỗi xe bồn đều có tem kẹp chì niêm phong tại phễu xả và phiếu xuất kho điện tử ghi rõ mác bê tông. Khi xe đến công trình, kỹ thuật viên sẽ cùng quý khách đo độ sụt bằng nón côn và đúc 3 tổ mẫu nén 15x15x15cm có chữ ký của hai bên. Sau 28 ngày, mẫu được ép nén tại phòng LAS-XD và trả kết quả chính thức cho khách hàng.

### Câu 3: Đang đổ bê tông sàn mà gặp mưa to bất chợt thì phải làm thế nào?
**Trả lời:** Quý khách không cần quá hoang mang. Đội thi công An Gia Bình luôn chuẩn bị sẵn bạt nilon chuyên dụng che phủ. Nếu mưa nhỏ, chúng tôi tiếp tục cào xoa và phủ bạt ngay. Nếu mưa to kéo dài, kỹ sư sẽ hướng dẫn ngắt mạch ngừng thi công chuẩn kỹ thuật tại vị trí 1/3 nhịp dầm, phủ bạt kín và tiếp tục đổ nối lớp mới ngay sau khi tạnh mưa với phụ gia liên kết chuyên dụng.

### Câu 4: Đổ bê tông mái nhà phố vào mùa hè nắng gắt có sợ bị nứt nẻ chân chim không?
**Trả lời:** Hoàn toàn không lo nứt nếu tuân thủ đúng quy trình của chúng tôi. Bê Tông An Gia Bình sử dụng phụ gia duy trì độ dẻo và đá làm mát khống chế nhiệt độ mẻ trộn dưới 32°C. Sau khi xoa mặt, sàn được phủ ngay bạt nilon giữ ẩm và tiến hành dưỡng ẩm liên tục trong 7 ngày vàng.

### Câu 5: Bê tông mác 250 và mác 300 khác nhau thế nào, nhà phố 3 tầng nên dùng loại nào?
**Trả lời:** Mác 250 chịu được lực nén 250 kg/cm², trong khi Mác 300 chịu được 300 kg/cm² và có độ đặc chắc cao hơn. Đối với nhà phố 2-4 tầng, mác 250 là tiêu chuẩn vàng tối ưu chi phí cho móng và dầm sàn. Nếu nhà có khẩu độ nhịp dầm lớn trên 6m hoặc có tầng lửng, ban công vươn dài, quý khách nên nâng cấp lên mác 300 cho hệ dầm sàn.

### Câu 6: Chi phí 1 ca xe bơm bê tông tươi tại Ninh Bình hiện nay là bao nhiêu?
**Trả lời:** Giá ca bơm phụ thuộc vào độ dài cần vươn (cần 37m, 45m hay 56m) hoặc chiều dài đường ống bơm tĩnh. Thông thường, chi phí ca bơm trọn gói dao động từ 2.000.000 đ đến 3.500.000 đ/ca cho khối lượng dưới 30m³. Với khối lượng lớn hơn, đơn giá bơm sẽ tính theo m³ vô cùng tiết kiệm.

### Câu 7: Bê tông tươi đổ xong sau bao nhiêu ngày thì được tháo dỡ giáo chống cốp pha?
**Trả lời:** Theo TCVN 4453:1995, ván khuôn thành bên (cột, dầm) có thể tháo sau 24 - 48 giờ. Tuy nhiên, ván khuôn đáy dầm và bản sàn nhịp lớn bắt buộc phải duy trì tối thiểu từ **21 đến 28 ngày** để bê tông phát triển trên 80% - 100% cường độ R28 trước khi chịu toàn bộ tải trọng bản thân và tải trọng thi công tầng trên.

### Câu 8: Tôi cần liên hệ đặt lịch trước bao nhiêu ngày để được điều xe bồn đúng giờ tốt?
**Trả lời:** Quý khách hàng nên liên hệ trước từ 1 đến 2 ngày qua hotline **0988 2662 93**. Đội ngũ điều độ sẽ lên lịch trình chính xác, bố trí kỹ sư khảo sát đường đi và giữ khung giờ vàng đổ sàn thuận lợi nhất cho gia đình.

---

### Về Công Ty TNHH Bê Tông An Gia Bình
Trải qua hơn 10 năm xây dựng và phát triển trên mảnh đất Cố đô Ninh Bình, **Công ty TNHH Bê Tông An Gia Bình** tự hào là đối tác chiến lược tin cậy của hàng ngàn công trình từ nhà dân dụng, biệt thự, trường học, bệnh viện cho đến các dự án nhà máy công nghiệp quy mô lớn:
- **Cụm 2 Trạm Trộn Hiện Đại:** Trạm 1 tại KCN Khánh Phú và Trạm 2 tại Huyện Kim Sơn, tổng công suất hơn 450m³/h.
- **Hơn 35 Xe Bồn Chuyên Dụng:** Vận chuyển liên tục, điều độ nhịp nhàng khắp các huyện thị Ninh Bình và vùng lân cận.
- **Dàn Xe Bơm Khủng:** Bơm cần 37m - 56m và hệ thống bơm tĩnh áp lực cao sẵn sàng chinh phục mọi ngõ hẻm và độ cao phức tạp.
- **Cam kết vàng:** 100% chuẩn mác, đủ khối lượng, kẹp chì minh bạch, đồng hành cùng sự vững bền của mọi công trình.

<div class="my-8 p-6 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-lg">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
    <span>★ CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH NINH BÌNH</span>
  </div>
  <h3 class="text-lg font-black text-white mb-2">Đăng Ký Khảo Sát &amp; Nhận Báo Giá Bê Tông Tươi Tận Chân Công Trình</h3>
  <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
    Kỹ sư trưởng An Gia Bình trực tiếp có mặt tại công trình sau 30 phút để kiểm tra mặt bằng ngõ hẹp, tư vấn cấp phối mác và đo đạc thể tích miễn phí. Cam kết đồng hành cùng chất lượng bền vững của ngôi nhà bạn!
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
`
  ];

  return chapters.join('\n\n---\n\n');
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
    const subKeywords = secondaryKeywords || "bê tông ngõ hẹp ninh bình, xử lý đổ bê tông gặp mưa to, cách kiểm tra độ sụt nón côn, bê tông chống thấm b8 tầng hầm, mác bê tông 250 đổ mái nhà phố, bảng giá bê tông an gia bình, bơm tĩnh bê tông tươi 150m";
    const combinedKeywords = customKeywords || `${mainKeyword}, ${subKeywords}`;
    const topicHeading = focusTopic || "Cẩm nang kỹ thuật thi công và giải pháp bê tông thương phẩm chuẩn TCVN tại Ninh Bình";

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

HÃY VIẾT MỘT BÀI VIẾT CHUẨN SEO CHUYÊN SÂU TỐI THIỂU 5.000 TỪ (BẮT BUỘC >= 5000 WORDS, KHÔNG DƯỚI 5000 TỪ) THEO ĐỊNH DẠNG SÁCH TRẮNG KỸ THUẬT XÂY DỰNG TOÀN DIỆN KÈM HÌNH ẢNH MINH HỌA VỚI CÁC THÔNG SỐ SAU:

1. THÔNG TIN ĐẦU VÀO:
- Chủ đề tập trung (Focus Topic): ${topicHeading}
- Tiêu đề gốc tham khảo: ${sourceTitle || "Kỹ thuật bê tông xây dựng"}
- Nguồn tham khảo: ${sourceUrl || "Tạp chí Xây Dựng & Kiểm Định"}
- Nội dung gốc quét được:
${rawContent || "Công nghệ sản xuất bê tông tươi thương phẩm hiện đại, kiểm soát tỷ lệ cấp phối cát đá xi măng, phụ gia giảm co ngót, kỹ thuật đổ và bảo dưỡng theo tiêu chuẩn TCVN tại Ninh Bình."}

2. TỪ KHÓA BẮT BUỘC PHẢI LỒNG GHÉP:
- Từ khóa chính (Primary Keyword): "${mainKeyword}" -> Bắt buộc xuất hiện trong Tiêu đề (H1), đoạn mở đầu (100 từ đầu), ít nhất 5 thẻ H2/H3, rải đều trong thân bài (mật độ 1.5% - 2.5%), và đoạn kết luận (Call to action).
- Từ khóa phụ (Secondary Keywords): ${subKeywords} -> Lồng ghép tự nhiên, mượt mà vào các luận điểm kỹ thuật, phân tích mác bê tông, tiêu chuẩn thí nghiệm và kinh nghiệm thực tế tại địa phương.

3. HÌNH ẢNH MINH HỌA BẮT BUỘC TRONG THÂN BÀI VIẾT (MARKDOWN):
BẮT BUỘC chèn ít nhất 4 đến 6 hình ảnh minh họa chân thực vào các đoạn phù hợp bằng cú pháp Markdown:
![Chú thích ảnh tiếng Việt](URL_HÌNH_ẢNH)
*Hình X: Chú thích chi tiết nội dung ảnh liên quan đến công trình Ninh Bình.*

DANH SÁCH ẢNH CHÍNH XÁC ĐƯỢC PHÉP CHỌN DÙNG (DÙNG ĐÚNG URL BÊN DƯỚI, KHÔNG TỰ BỊA URL KHÁC):
${imageCatalogForPrompt}

4. LIÊN KẾT NỘI BỘ (INTERNAL LINKS) BẮT BUỘC PHẢI CHÈN VÀO BÀI VIẾT:
Hãy lồng ghép tự nhiên từ 6 đến 10 liên kết từ danh sách dưới đây bằng cú pháp Markdown [Anchor Text](/url):
${mergedLinks}

5. YÊU CẦU ĐỘ DÀI VÀ CẤU TRÚC (BẮT BUỘC >= 5.000 TỪ):
- ĐỘ DÀI: TỐI THIỂU 5.000 TỪ. Phân tích cặn kẽ từng bước, có bảng biểu Markdown so sánh, công thức tính toán thể tích bê tông, phân tích địa chất các huyện tại Ninh Bình, phác đồ xử lý sự cố mưa to / nắng nóng, và 8 câu hỏi FAQ.
- BỐ CỤC BÀI VIẾT ĐỦ 12 PHẦN LỚN:
  + Thẻ ## 1: Tổng Quan Thị Trường Xây Dựng & Tầm Nhìn Chiến Lược Của "${mainKeyword}" Tại Ninh Bình
  + Thẻ ## 2: Tiêu Chuẩn Kỹ Thuật Vật Liệu Đầu Vào Theo TCVN & Kiểm Soát Cốt Liệu Chuẩn Trạm Trộn
  + Thẻ ## 3: Khảo Sát Địa Chất Đặc Thù Ninh Bình (Yên Khánh, Kim Sơn, Tam Điệp, Hoa Lư) & Bài Toán Lựa Chọn Loại Móng
  + Thẻ ## 4: Bảng Tra Cứu Toàn Diện Các Mác Bê Tông Thương Phẩm (M150 - M400) & Độ Sụt Chuẩn TCVN
  + Thẻ ## 5: Quy Trình Thi Công Đổ Bê Tông Từng Cấu Kiện Chi Tiết Từ Kỹ Sư Trưởng (Móng, Cột, Dầm Sàn, Hoàn Thiện Mặt)
  + Thẻ ## 6: Giải Pháp Bê Tông Chống Thấm Toàn Khối (B6 – B12) Cho Tầng Hầm & Bể Nước Ngầm
  + Thẻ ## 7: Giải Pháp Vượt Ngõ Hẻm Sâu 150m Bằng Đội Xe Bơm Cần & Bơm Tĩnh Chuyên Dụng
  + Thẻ ## 8: Quy Trình Kiểm Định Chất Lượng, Chống Gian Lận & Nghiệm Thu Hiện Trường (Kẹp chì, nón sụt Abrams, đúc 3 tổ mẫu R7, R28)
  + Thẻ ## 9: Cẩm Nang Xử Lý Sự Cố Khẩn Cấp Tại Công Trường: Trời Mưa To & Nắng Gắt Ninh Bình
  + Thẻ ## 10: Chế Độ Dưỡng Hộ "7 Ngày Vàng" & Thời Điểm Tháo Dỡ Cốp Pha Theo TCVN 4453:1995
  + Thẻ ## 11: Dự Toán Chi Phí & So Sánh Bài Toán Kinh Tế Thực Tế Tại Ninh Bình (Bê tông tươi vs Trộn tay)
  + Thẻ ## 12: Bộ Hỏi Đáp Thường Gặp (FAQ 8 câu hỏi) & Năng Lực Cung Ứng Bê Tông An Gia Bình

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
  "readTime": "25 phút",
  "coverImage": "${chosenCover.url}",
  "aiHeroImagePrompt": "A photorealistic 8k ultra-detailed cinematic photo of a modern concrete batching plant with concrete mixer trucks and concrete pump truck at golden hour in Ninh Binh Vietnam, surrounded by lush green karst limestone mountains, professional engineering construction photography, 8k resolution, photorealistic",
  "content": "Toàn bộ bài viết Markdown chi tiết >= 5000 từ có lồng ghép từ khóa chính, từ khóa phụ, 4-6 ảnh minh họa ![alt](url) và các internal links dạng [anchor](/url)"
}`;

    if (!ai) {
      // Deterministic high-authority whitepaper (>5,000 words guaranteed)
      const slug = (sourceTitle || "cam-nang-be-tong-tuoi-an-gia-binh")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Cẩm Nang Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn 2026 Tại Ninh Bình`;
      const rawWhitepaper = buildDeterministicWhitepaper(mainKeyword, subKeywords, sourceTitle, relatedArticles);
      const enrichedContent = enrichContentWithImages(rawWhitepaper, fallbackTitle, combinedKeywords, chosenCover.url);

      const fallbackPost = {
        title: fallbackTitle,
        slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
        excerpt: `Cẩm nang kỹ thuật chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
        seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
        seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
        focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
        category: "Kinh Nghiệm",
        tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
        readTime: "25 phút",
        coverImage: chosenCover.url,
        aiHeroImagePrompt: "A photorealistic 8k ultra-detailed cinematic photo of a modern concrete batching plant with concrete mixer trucks and concrete pump truck at golden hour in Ninh Binh Vietnam, surrounded by lush green karst limestone mountains, professional engineering construction photography, 8k resolution, photorealistic",
        content: enrichedContent
      };

      return NextResponse.json(fallbackPost);
    }

    // Try primary model (gemini-3.8-flash), fallback to secondary model (gemini-3.1-pro-preview)
    let parsed: any = null;
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-pro-preview"];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        });

        const text = response.text || "";
        const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
        parsed = JSON.parse(cleanJson);
        if (parsed && parsed.title && parsed.content) {
          break; // successfully generated
        }
      } catch (modelErr) {
        console.warn(`Model ${modelName} failed or busy, trying next option:`, modelErr);
      }
    }

    if (!parsed || !parsed.content) {
      throw new Error("AI models returned empty or invalid response, triggering deterministic whitepaper engine.");
    }

    // Ensure cover image and in-body illustration images are present
    const finalCover = parsed.coverImage || chosenCover.url;
    parsed.coverImage = finalCover;
    parsed.aiHeroImagePrompt = parsed.aiHeroImagePrompt || "A photorealistic 8k ultra-detailed cinematic photo of a modern concrete batching plant with concrete mixer trucks and concrete pump truck at golden hour in Ninh Binh Vietnam, surrounded by lush green karst limestone mountains, professional engineering construction photography, 8k resolution, photorealistic";
    parsed.content = enrichContentWithImages(parsed.content || "", parsed.title || topicHeading, combinedKeywords, finalCover);

    return NextResponse.json(parsed);

  } catch (err: unknown) {
    console.error("AI crawl & rewrite error, using deterministic whitepaper engine:", err);
    
    // Deterministic fallback with enriched images so scheduler NEVER breaks
    const fallbackTitle = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}: Hướng Dẫn Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn Tại Ninh Bình`;
    const slug = (sourceTitle || "cong-nghe-be-tong-an-gia-binh")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const chosenCover = selectCoverImage(fallbackTitle, mainKeyword);
    const relatedArticles = getRelatedInternalPosts(fallbackTitle, mainKeyword, 4);
    const rawWhitepaper = buildDeterministicWhitepaper(mainKeyword, "bê tông an gia bình, trạm trộn ninh bình", fallbackTitle, relatedArticles);
    const enrichedFallback = enrichContentWithImages(rawWhitepaper, fallbackTitle, mainKeyword, chosenCover.url);

    const fallbackPost = {
      title: fallbackTitle,
      slug: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `bai-viet-seo-${Date.now()}`,
      excerpt: `Cẩm nang chuyên sâu về ${mainKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác 200 - 350, kỹ thuật đổ sàn dầm cột và quy trình bảo dưỡng chuẩn xác.`,
      seoTitle: `${fallbackTitle} | Bê Tông An Gia Bình`,
      seoDescription: `Phân tích chuyên sâu về ${mainKeyword} tại Ninh Bình: Cấp phối mác chuẩn, kỹ thuật đầm nén, bảo dưỡng 7 ngày vàng. Xem [báo giá bê tông tươi Ninh Bình](/bang-gia) mới nhất.`,
      focusKeywords: [mainKeyword, "bê tông an gia bình", "kỹ thuật đổ bê tông", "giá bê tông tươi ninh bình"],
      category: "Kinh Nghiệm",
      tags: [mainKeyword, "bê tông an gia bình", "tiêu chuẩn tcvn", "trạm trộn ninh bình", "kỹ thuật thi công"],
      readTime: "25 phút",
      coverImage: chosenCover.url,
      aiHeroImagePrompt: "A photorealistic 8k ultra-detailed cinematic photo of a modern concrete batching plant with concrete mixer trucks and concrete pump truck at golden hour in Ninh Binh Vietnam, surrounded by lush green karst limestone mountains, professional engineering construction photography, 8k resolution, photorealistic",
      content: enrichedFallback
    };

    return NextResponse.json(fallbackPost);
  }
}
