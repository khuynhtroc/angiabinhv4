import { BlogPost } from '@/lib/types';

export interface TrendingNewsItem {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: string; // ISO string
  ageHours: number;
  trendScore: number;
  category: 'Vật Liệu Xây Dựng' | 'Hạ Tầng Giao Thông' | 'Thị Trường BĐS & Tài Chính' | 'Thời Tiết & Khí Hậu Xây Dựng' | 'Chính Sách & Quy Chuẩn' | 'Thời Sự Thị Trường';
  concreteAngle: string;
  focusKeywords: string[];
  suggestedTitle: string;
  hasBeenWritten?: boolean;
  writtenPostSlug?: string;
}

export interface SocialListeningConfig {
  autoPilotEnabled: boolean;
  minTrendScore: number;
  checkIntervalHours: number;
  lastRunAt?: string;
  autoPublishedCount?: number;
  selectedSources?: string[];
}

export const DEFAULT_SOCIAL_LISTENING_CONFIG: SocialListeningConfig = {
  autoPilotEnabled: true,
  minTrendScore: 65,
  checkIntervalHours: 4,
  selectedSources: ['Google Trends VN', 'VnExpress', 'CafeF', 'Báo Giao Thông', 'VietNamNet']
};

// RSS Feed Endpoints
const RSS_SOURCES = [
  {
    name: 'Google Trends VN',
    url: 'https://trends.google.com/trending/rss?geo=VN',
    type: 'google_trends'
  },
  {
    name: 'CafeF Thị Trường',
    url: 'https://cafef.vn/thi-truong.rss',
    type: 'standard_rss'
  },
  {
    name: 'CafeF Bất Động Sản',
    url: 'https://cafef.vn/bat-dong-san.rss',
    type: 'standard_rss'
  },
  {
    name: 'VnExpress Thời Sự',
    url: 'https://vnexpress.net/rss/thoi-su.rss',
    type: 'standard_rss'
  },
  {
    name: 'VnExpress Bất Động Sản',
    url: 'https://vnexpress.net/rss/bat-dong-san.rss',
    type: 'standard_rss'
  },
  {
    name: 'Báo Giao Thông',
    url: 'https://baogiaothong.vn/rss/giao-thong.rss',
    type: 'standard_rss'
  },
  {
    name: 'VietNamNet Bất Động Sản',
    url: 'https://vietnamnet.vn/rss/bat-dong-san.rss',
    type: 'standard_rss'
  }
];

// Helper: Strip HTML tags
function stripHtml(html: string): string {
  return (html || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper: Extract image URL from description or enclosure
function extractImageUrl(rawBlock: string): string | undefined {
  // Check <ht:picture>...</ht:picture>
  const htPic = rawBlock.match(/<ht:picture>([^<]+)<\/ht:picture>/i);
  if (htPic?.[1]) return htPic[1].trim();

  // Check <enclosure url="..."
  const enc = rawBlock.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enc?.[1]) return enc[1].trim();

  // Check <img src="..."
  const img = rawBlock.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (img?.[1]) return img[1].trim();

  return undefined;
}

// Analyze keywords and categorize
interface CategoryAngleResult {
  category: TrendingNewsItem['category'];
  concreteAngle: string;
  relevanceScore: number;
  focusKeywords: string[];
}

function analyzeCategoryAndAngle(title: string, snippet: string): CategoryAngleResult {
  const text = `${title} ${snippet}`.toLowerCase();

  // Negative keyword filtering: Exclude pure sports, entertainment, celebrity gossip, and lottery
  const isExcluded =
    text.includes('bóng đá') ||
    text.includes('câu lạc bộ bóng đá') ||
    text.includes('đội tuyển bóng đá') ||
    text.includes('ngoại hạng anh') ||
    text.includes('champions league') ||
    text.includes('marseille') ||
    text.includes('sporting') ||
    text.includes('kết quả trận') ||
    text.includes('trực tiếp bóng đá') ||
    text.includes('bong da 24h') ||
    text.includes('showbiz') ||
    text.includes('ca sĩ') ||
    text.includes('diễn viên') ||
    text.includes('hoa hậu') ||
    text.includes('phim rạp') ||
    text.includes('bài bạc') ||
    text.includes('xổ số') ||
    text.includes('lô đề') ||
    text.includes('game') ||
    text.includes('esport') ||
    text.includes('lol ') ||
    text.includes('lien minh') ||
    text.includes('pubg') ||
    text.includes('fifa');

  if (isExcluded && !text.includes('sân vận động') && !text.includes('nhà thi đấu') && !text.includes('công trình')) {
    return {
      category: 'Thời Sự Thị Trường',
      concreteAngle: 'Chủ đề giải trí/thể thao ngoài phạm vi xây dựng.',
      relevanceScore: 0,
      focusKeywords: []
    };
  }

  // 1. Vật liệu xây dựng & giá cả (highest direct relevance)
  if (
    text.includes('thép') ||
    text.includes('xi măng') ||
    text.includes('bê tông') ||
    text.includes('cát xây dựng') ||
    text.includes('đá xây dựng') ||
    text.includes('vật liệu xây dựng') ||
    text.includes('giá vlxd') ||
    text.includes('sắt thép') ||
    text.includes('nguồn cát') ||
    text.includes('trạm trộn')
  ) {
    return {
      category: 'Vật Liệu Xây Dựng',
      concreteAngle: 'Phân tích biến động giá nguyên vật liệu, bí quyết chọn mác bê tông tối ưu kinh phí và bảo đảm tuổi thọ kết cấu công trình.',
      relevanceScore: 45,
      focusKeywords: ['giá vật liệu xây dựng', 'giá bê tông tươi', 'bê tông thương phẩm ninh bình', 'tiết kiệm chi phí xây nhà']
    };
  }

  // 2. Hạ tầng giao thông & đại dự án
  if (
    text.includes('cao tốc') ||
    text.includes('sân bay') ||
    text.includes('cầu vượt') ||
    text.includes('cảng biển') ||
    text.includes('giao thông') ||
    text.includes('đường vành đai') ||
    text.includes('thông xe') ||
    text.includes('khởi công') ||
    text.includes('giải ngân đầu tư công') ||
    text.includes('tuyến đường') ||
    text.includes('nút giao')
  ) {
    return {
      category: 'Hạ Tầng Giao Thông',
      concreteAngle: 'Yêu cầu kỹ thuật bê tông mác cao, phụ gia đông kết nhanh R7 và năng lực cung ứng xe bồn 24/7 cho các tuyến giao thông trọng điểm.',
      relevanceScore: 35,
      focusKeywords: ['bê tông mác cao', 'bê tông r7 đông kết nhanh', 'đổ bê tông hạ tầng', 'bê tông an gia bình']
    };
  }

  // 3. Thời tiết cực đoan & mùa bão lũ ảnh hưởng thi công
  if (
    text.includes('bão') ||
    text.includes('áp thấp nhiệt đới') ||
    text.includes('mưa lớn') ||
    text.includes('ngập lụt') ||
    text.includes('nắng nóng kỷ lục') ||
    text.includes('triều cường') ||
    text.includes('sạt lở') ||
    text.includes('rét đậm') ||
    text.includes('mưa dông') ||
    text.includes('dự báo thời tiết')
  ) {
    return {
      category: 'Thời Tiết & Khí Hậu Xây Dựng',
      concreteAngle: 'Cẩm nang kỹ thuật đổ bê tông trong điều kiện thời tiết khắc nghiệt, chống nứt chân chim, chống thấm B6-B10 và quy trình bảo dưỡng chuẩn.',
      relevanceScore: 30,
      focusKeywords: ['đổ bê tông trời mưa', 'bảo dưỡng bê tông mùa nắng', 'bê tông chống thấm b8', 'xử lý nứt bê tông']
    };
  }

  // 4. Thị trường Bất động sản, quy hoạch, tín dụng
  if (
    text.includes('bất động sản') ||
    text.includes('nhà ở xã hội') ||
    text.includes('chung cư') ||
    text.includes('đấu giá đất') ||
    text.includes('sổ đỏ') ||
    text.includes('quy hoạch') ||
    text.includes('lãi suất') ||
    text.includes('ngân hàng') ||
    text.includes('thị trường nhà đất') ||
    text.includes('pháp lý dự án')
  ) {
    return {
      category: 'Thị Trường BĐS & Tài Chính',
      concreteAngle: 'Dự báo xu hướng xây dựng nhà ở, kinh nghiệm quản lý định mức xây thô và chọn giải pháp móng bê tông vững chắc đón đầu chu kỳ mới.',
      relevanceScore: 25,
      focusKeywords: ['xây nhà trọn gói', 'kinh nghiệm đổ móng nhà', 'định mức bê tông', 'bê tông an gia bình ninh bình']
    };
  }

  // 5. Chính sách, thông tư, quy chuẩn xây dựng mới
  if (
    text.includes('luật') ||
    text.includes('nghị định') ||
    text.includes('thông tư') ||
    text.includes('tcvn') ||
    text.includes('tiêu chuẩn') ||
    text.includes('cấp phép xây dựng') ||
    text.includes('nghiệm thu') ||
    text.includes('pccc')
  ) {
    return {
      category: 'Chính Sách & Quy Chuẩn',
      concreteAngle: 'Phổ biến tiêu chuẩn chất lượng TCVN mới nhất, hướng dẫn lấy mẫu thử nén và hồ sơ nghiệm thu bê tông đạt chuẩn pháp lý.',
      relevanceScore: 25,
      focusKeywords: ['tiêu chuẩn tcvn bê tông', 'nghiệm thu bê tông tươi', 'hồ sơ kiểm định mác', 'an gia bình']
    };
  }

  // 6. Thời sự thị trường chung (Newsjacking góc nhìn doanh nghiệp)
  return {
    category: 'Thời Sự Thị Trường',
    concreteAngle: 'Góc nhìn từ chuyên gia xây dựng: Phân tích cơ hội, thách thức và giải pháp vật liệu bền vững cho các chủ đầu tư tại Ninh Bình.',
    relevanceScore: 15,
    focusKeywords: ['thị trường xây dựng', 'bê tông tươi ninh bình', 'an gia bình']
  };
}

// Calculate Trend Score (0 - 100)
function computeTrendScore(
  ageHours: number,
  relevanceScore: number,
  source: string,
  isGoogleTrend: boolean
): number {
  let score = relevanceScore;

  // Recency score
  if (ageHours <= 4) {
    score += 35;
  } else if (ageHours <= 12) {
    score += 28;
  } else if (ageHours <= 24) {
    score += 18;
  } else if (ageHours <= 48) {
    score += 10;
  } else {
    score += 4;
  }

  // Source authority boost
  if (isGoogleTrend) {
    score += 20; // Proven search volume explosion
  } else if (source.includes('CafeF') || source.includes('VnExpress')) {
    score += 12;
  } else {
    score += 8;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

// Generate suggested SEO-optimized title
function generateSuggestedNewsTitle(originalTitle: string, category: TrendingNewsItem['category']): string {
  const cleanTitle = originalTitle.trim().replace(/\.$/, '');
  
  if (category === 'Vật Liệu Xây Dựng') {
    return `${cleanTitle}: Tác Động Đến Giá Thành Xây Dựng & Lời Khuyên Từ Kỹ Sư Bê Tông`;
  }
  if (category === 'Hạ Tầng Giao Thông') {
    return `${cleanTitle}: Yêu Cầu Kỹ Thuật Bê Tông Mác Cao & Tiến Độ Cung Ứng`;
  }
  if (category === 'Thời Tiết & Khí Hậu Xây Dựng') {
    return `${cleanTitle}: Cẩm Nang Thi Công & Bảo Dưỡng Bê Tông Tránh Nứt Chuẩn Kỹ Sư`;
  }
  if (category === 'Thị Trường BĐS & Tài Chính') {
    return `${cleanTitle}: Dự Báo Xu Hướng Xây Nhà & Giải Pháp Tiết Kiệm Chi Phí Thô`;
  }
  return `${cleanTitle}: Phân Tích Dưới Góc Nhìn Kỹ Thuật Xây Dựng An Gia Bình`;
}

// Check if a topic has already been written about in posts.json
function checkTopicWritten(title: string, existingPosts: BlogPost[]): { written: boolean; postSlug?: string } {
  const titleWords = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length >= 3);

  for (const post of existingPosts) {
    const postText = `${post.title} ${post.excerpt || ''}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Count matching words
    let matches = 0;
    for (const w of titleWords) {
      if (postText.includes(w)) {
        matches++;
      }
    }

    if (titleWords.length > 0 && matches / titleWords.length >= 0.7) {
      return { written: true, postSlug: post.slug || post.id };
    }
  }

  return { written: false };
}

// Fetch single RSS feed with timeout & error handling
async function fetchRssFeed(source: typeof RSS_SOURCES[0]): Promise<TrendingNewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[SocialListening] Failed to fetch ${source.name} (${res.status})`);
      return [];
    }

    const xml = await res.text();
    const items: TrendingNewsItem[] = [];
    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    const matches = xml.match(itemRegex) || [];

    const now = Date.now();

    for (const itemXml of matches) {
      // Extract title
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const title = stripHtml(titleMatch?.[1] || '');
      if (!title || title.length < 10) continue;

      // Extract link
      let linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      if (!linkMatch) {
        linkMatch = itemXml.match(/<ht:news_item_url>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_url>/i);
      }
      const link = stripHtml(linkMatch?.[1] || source.url);

      // Extract pubDate
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      let publishedAt = new Date().toISOString();
      let ageHours = 2; // fallback

      if (pubDateMatch?.[1]) {
        const parsedDate = new Date(pubDateMatch[1].trim());
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate.toISOString();
          ageHours = Math.max(0, Math.round((now - parsedDate.getTime()) / (1000 * 60 * 60) * 10) / 10);
        }
      }

      // Filter: only consider items published within the last 48 hours
      if (ageHours > 48) continue;

      // Extract description / snippet
      let descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      if (!descMatch) {
        descMatch = itemXml.match(/<ht:news_item_snippet>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_snippet>/i);
      }
      const snippet = stripHtml(descMatch?.[1] || title);

      // Extract image
      const imageUrl = extractImageUrl(itemXml);

      // Analyze category and relevance
      const isGoogleTrend = source.type === 'google_trends';
      const analysis = analyzeCategoryAndAngle(title, snippet);
      const trendScore = computeTrendScore(ageHours, analysis.relevanceScore, source.name, isGoogleTrend);

      const id = `trend-${Math.abs(hashString(title + link))}`;

      items.push({
        id,
        title,
        snippet,
        url: link,
        source: source.name,
        imageUrl,
        publishedAt,
        ageHours,
        trendScore,
        category: analysis.category,
        concreteAngle: analysis.concreteAngle,
        focusKeywords: analysis.focusKeywords,
        suggestedTitle: generateSuggestedNewsTitle(title, analysis.category)
      });
    }

    return items;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[SocialListening] Error parsing ${source.name}:`, err?.message || err);
    return [];
  }
}

// Simple deterministic hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

/**
 * Main function: Fetch, aggregate, score and deduplicate real-time trends.
 * Returns sorted trending items (highest score first).
 */
export async function getRealtimeTrends(existingPosts: BlogPost[] = []): Promise<TrendingNewsItem[]> {
  const promises = RSS_SOURCES.map(source => fetchRssFeed(source));
  const results = await Promise.allSettled(promises);

  const allItems: TrendingNewsItem[] = [];
  const seenTitles = new Set<string>();

  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      for (const item of res.value) {
        const normTitle = item.title.toLowerCase().trim();
        if (seenTitles.has(normTitle)) continue;
        seenTitles.add(normTitle);

        // Check if written
        const writeCheck = checkTopicWritten(item.title, existingPosts);
        item.hasBeenWritten = writeCheck.written;
        item.writtenPostSlug = writeCheck.postSlug;

        allItems.push(item);
      }
    }
  }

  // Sort: highest trendScore first
  allItems.sort((a, b) => {
    // Unwritten first if close score
    if (!a.hasBeenWritten && b.hasBeenWritten && b.trendScore - a.trendScore < 10) return -1;
    if (a.hasBeenWritten && !b.hasBeenWritten && a.trendScore - b.trendScore < 10) return 1;
    return b.trendScore - a.trendScore;
  });

  return allItems;
}
