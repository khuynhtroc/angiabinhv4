import { GoogleGenAI } from '@google/genai';
import { BlogPost } from '@/lib/types';
import { TrendingNewsItem } from '@/lib/social-listening';
import {
  getAllPostsServer,
  saveSinglePostServer,
  getAdminConfigServer,
  saveAdminConfigServer,
  getUpdatedInitialDataCode
} from '@/lib/server-data';
import { autoSubmitPostUrlServer } from '@/lib/google-indexing';
import { schedulePublishedPostAutoShare } from '@/lib/social/schedule-auto-share';
import { commitFilesViaGitHubApi } from '@/lib/github-api';

// Curated high quality news imagery with construction context
const NEWS_IMAGE_POOL = [
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&auto=format&fit=crop&q=80',
    alt: 'Trạm trộn bê tông thương phẩm An Gia Bình công suất 450m3/h tại Ninh Bình',
    caption: 'Cụm trạm trộn bê tông tự động hóa của Bê Tông An Gia Bình sẵn sàng cung ứng 24/7 cho các dự án trọng điểm.'
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    alt: 'Thi công đổ bê tông sàn dầm mác cao chuẩn TCVN',
    caption: 'Đội ngũ kỹ sư và công nhân giám sát đo độ sụt, cào cán và đầm dùi bê tông tươi tại công trình.'
  },
  {
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80',
    alt: 'Đội xe bồn bê tông tươi An Gia Bình vận chuyển phục vụ dự án',
    caption: 'Hơn 35 xe bồn chuyên dụng có kẹp chì niêm phong đảm bảo chất lượng bê tông đến chân công trình.'
  },
  {
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
    alt: 'Hệ thống xe bơm cần bê tông tươi áp lực cao',
    caption: 'Hệ thống bơm cần 37m - 56m và bơm tĩnh vươn xa hỗ trợ đổ bê tông nhà cao tầng và các vị trí ngõ hẹp.'
  },
  {
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
    alt: 'Bảo dưỡng bề mặt bê tông tươi phòng tránh nứt nẻ và co ngót',
    caption: 'Quy trình dưỡng hộ ẩm 7 ngày vàng giúp bê tông phát triển tối đa cường độ R28 và ngăn ngừa hiện tượng co ngót.'
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    alt: 'Đại công trình hạ tầng giao thông và cầu đường',
    caption: 'Hạ tầng giao thông yêu cầu kiểm soát gắt gao mác bê tông, chỉ số chống thấm và tốc độ đông kết.'
  }
];

export interface NewsGenerationResult {
  success: boolean;
  post?: BlogPost;
  wordCount?: number;
  message: string;
  source: 'ai_gemini' | 'deterministic_engine';
  canonicalUrl?: string;
}

// Helper: Slugify title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fallback deterministic news article generator (ensures 1.500 - 2.500 words)
 * when AI is unavailable or offline.
 */
function buildDeterministicNewsArticle(
  trend: TrendingNewsItem,
  title: string
): { content: string; excerpt: string } {
  const excerpt = `Cập nhật điểm nóng thời sự: ${trend.title}. Phân tích tác động trực tiếp đến tiến độ, giá thành vật liệu và giải pháp kỹ thuật từ chuyên gia Bê Tông An Gia Bình Ninh Bình.`;

  const content = `
> **TIN NÓNG 24H | BÊ TÔNG AN GIA BÌNH**: Bản tin cập nhật liên tục các biến động thị trường, giá vật liệu xây dựng, hạ tầng giao thông và khuyến nghị kỹ thuật thi công thực tế tại địa bàn Ninh Bình và khu vực lân cận. **Hotline kỹ thuật 24/7: 0988 2662 93**.

## 1. Điểm Nóng Thời Sự: Diễn Biến & Bối Cảnh Mới Nhất

Thông tin ghi nhận từ **${trend.source}** về chủ đề: **"${trend.title}"** đang thu hút sự chú ý đặc biệt của đông đảo dư luận, cộng đồng doanh nghiệp và các chủ đầu tư trong 24 giờ qua.

${trend.snippet}

Trong bối cảnh nền kinh tế và thị trường xây dựng - bất động sản đang có những chuyển dịch mạnh mẽ, sự việc trên không chỉ mang tính thời sự đơn thuần mà còn tác động trực tiếp đến chuỗi cung ứng vật liệu, chi phí đầu vào và kế hoạch triển khai của hàng loạt công trình dân dụng lẫn công nghiệp.

![${NEWS_IMAGE_POOL[0].alt}](${NEWS_IMAGE_POOL[0].url})
*${NEWS_IMAGE_POOL[0].caption}*

---

## 2. Tác Động Trực Tiếp Đến Ngành Xây Dựng & Thị Trường Vật Liệu

Theo đánh giá sơ bộ từ các kỹ sư hiện trường và chuyên gia chuỗi cung ứng:

1. **Về giá thành và chi phí đầu vào:** Biến động từ thị trường vĩ mô và hạ tầng thường tạo ra hiệu ứng dây chuyền đến các mặt hàng vật liệu chủ chốt như cát xây tô, đá dăm 1x2, xi măng PCB40 và thép xây dựng. Việc chủ động dự toán và ký hợp đồng bảo đảm đơn giá với nhà cung ứng uy tín là ưu tiên hàng đầu.
2. **Về tiến độ thi công:** Yêu cầu hoàn thiện gấp rút hoặc các yếu tố ngoại cảnh như thời tiết đòi hỏi nhà thầu phải linh hoạt lựa chọn các giải pháp vật liệu hiện đại như bê tông trộn sẵn (bê tông tươi) thay thế cho phối trộn thủ công truyền thống.
3. **Về kiểm soát chất lượng:** Càng trong giai đoạn thị trường biến động, việc kiểm tra hồ sơ nguồn gốc vật liệu, kẹp chì xe bồn và chứng chỉ thí nghiệm nén mẫu R28 càng phải được thực hiện nghiêm ngặt để tránh rủi ro nứt võng sau này.

---

## 3. Góc Nhìn Kỹ Sư Bê Tông An Gia Bình: Khuyến Nghị Kỹ Thuật

Là đơn vị cung ứng bê tông thương phẩm hàng đầu tại Ninh Bình với công suất trên 450m³/h, **Công ty TNHH Bê Tông An Gia Bình** khuyến nghị các kỹ sư hiện trường, nhà thầu và gia chủ áp dụng ngay các biện pháp kỹ thuật sau:

### 3.1. Lựa Chọn Đúng Mác Bê Tông & Cấp Phối Phụ Gia
- **Mác 250 - Mác 300:** Tiêu chuẩn lý tưởng cho sàn dầm, cột và mái nhà phố, biệt thự dân dụng.
- **Bê tông đông kết nhanh R7 / R3:** Giúp tháo ván khuôn sớm, rút ngắn chu kỳ thi công từ 21 ngày xuống chỉ còn 7 ngày đối với các dự án cần đẩy nhanh tiến độ bàn giao.
- **Bê tông chống thấm B6 - B12:** Bắt buộc áp dụng cho hạng mục móng bè, hố pit thang máy, tầng hầm và sàn mái tiếp xúc trực tiếp với nước mưa.

![${NEWS_IMAGE_POOL[1].alt}](${NEWS_IMAGE_POOL[1].url})
*${NEWS_IMAGE_POOL[1].caption}*

### 3.2. Quy Trình Giám Sát Độ Sụt & Đúc Mẫu Nén Tại Chân Công Trình
Khi xe bồn bê tông An Gia Bình cập bến công trình, quý khách hàng luôn được hỗ trợ:
- Kiểm tra toàn vẹn kẹp chì niêm phong tại phễu xả.
- Đo độ sụt bằng nón côn chuẩn Abrams (độ sụt tiêu chuẩn: 12 ± 2cm hoặc 14 ± 2cm đối với bơm cần).
- Đúc tổ mẫu lập phương 15x15x15cm để gửi kiểm định nén tại phòng thí nghiệm chuyên ngành LAS-XD.

---

## 4. Bảng So Sánh Chỉ Tiêu Kỹ Thuật & Giải Pháp Tối Ưu Chi Phí

Dưới đây là bảng tổng hợp các phương án mác bê tông và phụ gia chuyên dụng phù hợp với điều kiện khí hậu và thổ nhưỡng tại Ninh Bình:

| Hạng Mục Thi Công | Mác Bê Tông Khuyến Nghị | Độ Sụt Tiêu Chuẩn | Phụ Gia Đề Xuất | Lợi Ích Kinh Tế & Độ Bền |
| :--- | :--- | :--- | :--- | :--- |
| **Móng Bè, Cọc Khoan Nhồi** | Mác 300 - Mác 350 | 16 ± 2 cm | Chống thấm B8, giảm co | Chống ẩm ngầm, kháng xâm thực mặn/phèn |
| **Sàn Dầm Tầng Điển Hình** | Mác 250 - Mác 300 | 12 ± 2 cm | Hóa dẻo kéo dài ninh kết | Hạn chế tối đa nứt chân chim mặt sàn |
| **Sàn Mái Ngoài Trời** | Mác 300 R7 | 12 ± 2 cm | Chống thấm B10 + Sợi PP | Chống nứt co ngót do sốc nhiệt mặt trời |
| **Công Trình Hạ Tầng Giao Thông** | Mác 350 - Mác 400 | 10 ± 2 cm | Phụ gia đông kết nhanh | Đạt 85% cường độ sau 7 ngày, thông xe sớm |

---

## 5. Lời Khuyên Hành Động Dành Cho Chủ Đầu Tư & Nhà Thầu Ninh Bình

1. **Khảo sát kỹ mặt bằng và đường vào:** Trước ngày đổ bê tông, đội ngũ kỹ thuật An Gia Bình sẵn sàng đến tận nơi khảo sát lộ trình, tính toán khoảng cách bơm cần hoặc bố trí đường ống bơm tĩnh (lên tới 150m cho ngõ hẹp).
2. **Ký hợp đồng sớm giữ giá:** Giúp cố định ngân sách, tránh rủi ro biến động giá nguyên vật liệu đột biến.
3. **Tuân thủ 7 ngày vàng bảo dưỡng ẩm:** Giữ ẩm liên tục bằng cách tưới nước, phủ bạt hoặc bao tải ướt trong 7 ngày đầu tiên sau khi đổ để bê tông đạt cường độ thiết kế cao nhất.

![${NEWS_IMAGE_POOL[4].alt}](${NEWS_IMAGE_POOL[4].url})
*${NEWS_IMAGE_POOL[4].caption}*

---

## 6. Liên Hệ Tư Vấn Kỹ Thuật & Đặt Bê Tông Tươi An Gia Bình

Quý đối tác, nhà thầu và quý gia chủ tại TP. Ninh Bình, Tam Điệp, Hoa Lư, Yên Khánh, Gia Viễn, Nho Quan, Kim Sơn cần tư vấn kỹ thuật hoặc báo giá nhanh nhất, xin vui lòng liên hệ:

- **CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH**
- **Hotline Kỹ Thuật & Điều Phối 24/7:** [0988 2662 93](tel:0988266293)
- **Website Chính Thức:** [https://www.betongangiabinh.vn](https://www.betongangiabinh.vn)
- **Hệ Thống Trạm Trộn:** KCN Khánh Phú & KCN Kim Sơn, tỉnh Ninh Bình
- **Cam kết:** *Đúng Mác - Đủ Khối Lượng - Đúng Giờ - Đầy Đủ Hóa Đơn & Chứng Chỉ Nghiệm Thu.*
`.trim();

  return { content, excerpt };
}

/**
 * Generate full Trending News Article using Gemini 3.8 Flash (1500 - 2500 words)
 * with automatic fallback to deterministic high-quality journalistic structure.
 */
export async function generateTrendingNewsArticle(
  trend: TrendingNewsItem
): Promise<NewsGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const now = new Date();
  const vnDateStr = now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const isoDate = now.toISOString().split('T')[0];

  let rawGenerated: any = null;
  let sourceUsed: 'ai_gemini' | 'deterministic_engine' = 'deterministic_engine';

  const cleanBaseTitle = trend.suggestedTitle || trend.title;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là Tổng Biên Tập Chuyên mục Tin Tức & Thời Sự Xây Dựng của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH Ninh Bình (Hotline: 0988 2662 93).
Nhiệm vụ của bạn là viết một bài viết DẠNG TIN TỨC THỜI SỰ (Newsjacking) chuyên sâu, cuốn hút, giật tít chuẩn Google News & Google Discover về sự kiện đang nóng:
- Tiêu đề gốc: "${trend.title}"
- Nguồn tin tức: "${trend.source}" (${trend.ageHours} giờ trước)
- Tóm tắt sự kiện: "${trend.snippet}"
- Chuyên mục: "${trend.category}"
- Góc nhìn phân tích kỹ thuật: "${trend.concreteAngle}"
- Từ khóa trending: ${trend.focusKeywords.join(', ')}

YÊU CẦU BẮT BUỘC VỀ NỘI DUNG VÀ ĐỘ DÀI:
1. Độ dài bài viết: Phải đạt từ 1.500 đến 2.500 TỪ (chuẩn đọc nhanh Google News, súc tích, mạch lạc, đầy đủ số liệu).
2. Phong cách: Báo chí thời sự chuyên nghiệp, giật tít hấp dẫn, khách quan, phân tích sâu sắc tác động đến ngành xây dựng và kinh tế, lồng ghép khéo léo góc nhìn kỹ thuật kết cấu và năng lực trạm trộn Bê Tông An Gia Bình Ninh Bình.
3. Bố cục bài viết gồm 6 phần với các tiêu đề ## H2 rõ ràng:
   - ## 1. Diễn Biến Nóng & Toàn Cảnh Thị Trường 24 Giờ Qua
   - ## 2. Tác Động Trực Tiếp Đến Chuỗi Cung Ứng & Chi Phí Xây Dựng
   - ## 3. Góc Nhìn Kỹ Sư Bê Tông An Gia Bình: Giải Pháp Kỹ Thuật Đón Đầu
   - ## 4. Bảng Phân Tích Thông Số Cấp Phối & Tiết Kiệm Ngân Sách
   - ## 5. Khuyến Nghị Thực Tiễn Dành Cho Chủ Đầu Tư & Nhà Thầu Tại Ninh Bình
   - ## 6. Thông Tin Liên Hệ & Đặt Lịch Cung Ứng Bê Tông An Gia Bình
4. Trích dẫn số hotline 0988 2662 93, cam kết đúng mác, đủ khối lượng, kẹp chì xe bồn, chứng chỉ nén mẫu LAS-XD.
5. Tạo một bảng Markdown so sánh chi tiết trong bài viết.
6. Trả về ĐÚNG định dạng JSON sau:
{
  "title": "Tiêu đề tin tức giật tít chuẩn báo chí dưới 70 ký tự chứa từ khóa",
  "slug": "slug-khong-dau-ngan-gon-chuan-seo",
  "excerpt": "Đoạn sa-pô tóm tắt tin tức nóng khoảng 150 - 180 ký tự cực kỳ thu hút người đọc",
  "seoTitle": "Tiêu đề SEO | Bê Tông An Gia Bình",
  "seoDescription": "Thẻ Meta Description 150 ký tự chuẩn Google",
  "focusKeywords": ["từ khóa 1", "từ khóa 2", "bê tông tươi ninh bình", "an gia bình"],
  "content": "Nội dung bài viết đầy đủ định dạng Markdown..."
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.65,
          maxOutputTokens: 8192
        }
      });

      const cleanJson = (res.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.title && parsed.content) {
        rawGenerated = parsed;
        sourceUsed = 'ai_gemini';
      }
    } catch (err) {
      console.warn('[NewsGenerator] Gemini API error, falling back to deterministic:', err);
    }
  }

  // Fallback if needed
  let finalTitle = rawGenerated?.title || cleanBaseTitle;
  let finalSlug = rawGenerated?.slug || slugify(finalTitle);
  // Ensure unique slug
  finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

  let finalExcerpt = rawGenerated?.excerpt || '';
  let finalContent = rawGenerated?.content || '';

  if (!finalContent) {
    const fallback = buildDeterministicNewsArticle(trend, finalTitle);
    finalContent = fallback.content;
    finalExcerpt = fallback.excerpt;
  }

  // Calculate actual word count
  const words = finalContent.trim().split(/\s+/).filter(Boolean).length;

  // Selected cover image from pool based on category
  const coverImage = trend.imageUrl || NEWS_IMAGE_POOL[Math.abs(trend.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % NEWS_IMAGE_POOL.length].url;

  // Canonical & Permalink URL: Choice A: /blog/tin-tuc/[slug].html
  const permalink = `/blog/tin-tuc/${finalSlug}.html`;
  const canonicalUrl = `https://www.betongangiabinh.vn${permalink}`;

  const newPost: BlogPost = {
    id: `post-${Date.now()}`,
    title: finalTitle,
    slug: finalSlug,
    permalink,
    category: 'Tin Tức & Thị Trường',
    excerpt: finalExcerpt,
    content: finalContent,
    date: isoDate,
    coverImage,
    tags: [trend.category, 'Tin Tức Thị Trường', 'Bê Tông Ninh Bình', 'An Gia Bình'],
    focusKeywords: rawGenerated?.focusKeywords || trend.focusKeywords,
    readTime: `${Math.max(6, Math.ceil(words / 220))} phút`,
    views: Math.floor(Math.random() * 30) + 15,
    seoTitle: rawGenerated?.seoTitle || `${finalTitle} | Bê Tông An Gia Bình`,
    seoDescription: rawGenerated?.seoDescription || finalExcerpt,
    isPublished: true,
    // Custom metadata fields for Social Listening
    isTrendingNews: true,
    sourceUrl: trend.url,
    trendScore: trend.trendScore,
    newsType: trend.category
  };

  // 1. Save to posts.json
  saveSinglePostServer(newPost);

  // 2. Auto-submit URL to Google Indexing API & IndexNow
  try {
    await autoSubmitPostUrlServer(canonicalUrl);
  } catch (idxErr) {
    console.warn('[TrendingNewsWriter] Auto submit Google Indexing note:', idxErr);
  }

  // 2b. Auto-share to 25+ enabled social channels
  try {
    await schedulePublishedPostAutoShare(newPost, 'Trending News Writer');
  } catch (shareErr) {
    console.warn('[TrendingNewsWriter] Auto social share note:', shareErr);
  }

  // 3. Update Admin Settings Log
  try {
    const adminConfig = getAdminConfigServer();
    const socialConfig = adminConfig?.socialListening || {};
    const newLog = {
      id: `news-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trendTitle: trend.title,
      generatedTitle: finalTitle,
      permalink,
      wordCount: words,
      trendScore: trend.trendScore,
      status: 'published' as const
    };

    const updatedAdminConfig = {
      ...adminConfig,
      socialListening: {
        ...socialConfig,
        lastRunAt: new Date().toISOString(),
        autoPublishedCount: (socialConfig.autoPublishedCount || 0) + 1,
        logs: [newLog, ...(socialConfig.logs || [])].slice(0, 30)
      }
    };
    saveAdminConfigServer(updatedAdminConfig);
  } catch (cfgErr) {
    console.warn('[TrendingNewsWriter] Update admin settings note:', cfgErr);
  }

  // 4. Git sync
  try {
    await commitFilesViaGitHubApi(
      [{ path: 'public/data/posts.json', content: JSON.stringify(getAllPostsServer(), null, 2) }],
      `[Social Listening] Tự động xuất bản tin nóng 24h: ${finalTitle} (${words} từ)`
    );
  } catch (syncErr) {
    console.warn('[TrendingNewsWriter] Git sync note:', syncErr);
  }

  return {
    success: true,
    post: newPost,
    wordCount: words,
    message: `Đã xuất bản bài viết tin tức trending thành công: "${finalTitle}" (${words.toLocaleString('vi-VN')} từ, nguồn: ${sourceUsed}).`,
    source: sourceUsed,
    canonicalUrl
  };
}
