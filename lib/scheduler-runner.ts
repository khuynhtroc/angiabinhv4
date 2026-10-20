import { GoogleGenAI } from '@google/genai';
import {
  getAllPostsServer,
  saveSinglePostServer,
  getAdminConfigServer,
  saveAdminConfigServer,
  getUpdatedInitialDataCode,
} from '@/lib/server-data';
import { commitFilesViaGitHubApi } from '@/lib/github-api';
import { BlogPost } from '@/lib/types';
import {
  selectCoverImage,
  enrichContentWithImages,
  getRelatedInternalPosts,
  buildDeterministicWhitepaper
} from '@/app/api/ai/crawl-generate/route';
import { autoSubmitPostUrlServer } from '@/lib/google-indexing';

export interface SchedulerExecutionResult {
  success: boolean;
  post?: BlogPost;
  wordCount?: number;
  message: string;
  source: 'ai_gemini' | 'deterministic_engine';
}

/**
 * Autonomous Scheduler Runner
 * Checks admin settings, evaluates scheduled time slots (06:00, 12:00, 18:00 Vietnam time),
 * generates post >= 5000 words, saves to posts.json, updates admin logs, and commits to Git.
 */
export async function checkAndRunScheduler(force = false): Promise<SchedulerExecutionResult> {
  const adminConfig = getAdminConfigServer();
  const scheduler = adminConfig?.aiScheduler;

  const isEnabled = Boolean(scheduler?.isEnabled ?? scheduler?.enabled);
  if (!isEnabled && !force) {
    return {
      success: false,
      message: 'AI Auto-Scheduler đang ở trạng thái TẮT (disabled).',
      source: 'deterministic_engine'
    };
  }

  // Get current Vietnam Time (GMT+7)
  const now = new Date();
  const vnFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = vnFormatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
  const todayVn = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
  const currentHM = `${getPart('hour')}:${getPart('minute')}`;

  if (!force) {
    const slots = ['06:00', '12:00', '18:00'];
    let activeSlot = '';
    for (const s of slots) {
      if (currentHM >= s) {
        activeSlot = s;
      }
    }

    if (!activeSlot) {
      return {
        success: false,
        message: `Chưa đến khung giờ đăng đầu tiên trong ngày (hiện tại: ${currentHM} VN, khung giờ: 06:00, 12:00, 18:00).`,
        source: 'deterministic_engine'
      };
    }

    // Check last run
    const lastRunAt = scheduler?.lastRunAt || '';
    if (lastRunAt) {
      const lastRunDate = new Date(lastRunAt);
      const lastRunParts = vnFormatter.formatToParts(lastRunDate);
      const getLastPart = (type: string) => lastRunParts.find(p => p.type === type)?.value || '';
      const lastRunDayVn = `${getLastPart('year')}-${getLastPart('month')}-${getLastPart('day')}`;
      const lastRunHMVn = `${getLastPart('hour')}:${getLastPart('minute')}`;

      if (lastRunDayVn === todayVn) {
        let lastSlot = '';
        for (const s of slots) {
          if (lastRunHMVn >= s) {
            lastSlot = s;
          }
        }
        if (lastSlot === activeSlot) {
          return {
            success: false,
            message: `Khung giờ ${activeSlot} ngày hôm nay (${todayVn}) đã được xuất bản bài viết thành công lúc ${lastRunHMVn}.`,
            source: 'deterministic_engine'
          };
        }
      }
    }
  }

  // Pick keyword & focus topic
  const primaryKeyword = scheduler?.primaryKeyword || 'bê tông tươi ninh bình';
  const secondaryKeywordsList = Array.isArray(scheduler?.secondaryKeywords)
    ? scheduler.secondaryKeywords
    : [
        'bê tông ngõ hẹp ninh bình',
        'xử lý đổ bê tông gặp mưa to',
        'cách kiểm tra độ sụt nón côn',
        'bê tông chống thấm b8 tầng hầm',
        'mác bê tông 250 đổ mái nhà phố',
        'bảng giá bê tông an gia bình',
        'bơm tĩnh bê tông tươi 150m',
        'đúc mẫu nén r28 bê tông',
        'bảo dưỡng bê tông 7 ngày vàng'
      ];
  const focusTopics = Array.isArray(scheduler?.focusTopics) && scheduler.focusTopics.length > 0
    ? scheduler.focusTopics
    : [
        'Cẩm nang xử lý đổ bê tông tươi gặp trời mưa to bất chợt và chống nứt co ngót mùa hè tại Ninh Bình',
        'Giải pháp bơm tĩnh bê tông tươi ngõ hẹp sâu 150m tại TP. Ninh Bình và Tam Điệp',
        'Hướng dẫn kiểm tra kẹp chì xe bồn, đo độ sụt nón côn và đúc mẫu nén R28 chống gian lận mác',
        'Kỹ thuật đổ bê tông chống thấm B6 B8 cho bể nước ngầm và tầng hầm chuẩn TCVN',
        'So sánh chi phí đổ bê tông tươi thương phẩm và trộn tay cho nhà phố 100m2 Ninh Bình'
      ];

  const topicIndex = (scheduler?.totalPublished || 0) % focusTopics.length;
  const currentTopic = focusTopics[topicIndex];
  const combinedKeywords = [primaryKeyword, ...secondaryKeywordsList].join(', ');

  const chosenCover = selectCoverImage(currentTopic, combinedKeywords);
  const relatedArticles = getRelatedInternalPosts(currentTopic, combinedKeywords, 4);

  // Attempt generation via Gemini 3.8 Flash
  const apiKey = process.env.GEMINI_API_KEY;
  let generatedPost: any = null;
  let sourceUsed: 'ai_gemini' | 'deterministic_engine' = 'deterministic_engine';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là Giám Đốc Nội Dung Chuẩn SEO của CÔNG TY TNHH BÊ TÔNG AN GIA BÌNH tại Ninh Bình (Hotline: 0988 2662 93).
Hãy viết một bài viết phân tích kỹ thuật chuẩn SEO sâu sắc về chủ đề: "${currentTopic}".
Từ khóa chính: "${primaryKeyword}".
Từ khóa phụ: ${combinedKeywords}.
Trả về đúng định dạng JSON:
{
  "title": "Tiêu đề chuẩn SEO dưới 70 ký tự chứa từ khóa chính hấp dẫn",
  "slug": "tieu-de-khong-dau-chuan-seo",
  "excerpt": "Tóm tắt bài viết 150 ký tự chuẩn SEO",
  "seoTitle": "Tiêu đề SEO | Bê Tông An Gia Bình",
  "seoDescription": "Meta Description 150 ký tự",
  "focusKeywords": ["${primaryKeyword}", "bê tông an gia bình", "ninh bình"],
  "category": "Kỹ Thuật Thi Công",
  "tags": ["bê tông tươi ninh bình", "bê tông an gia bình", "kỹ thuật thi công"],
  "content": "Nội dung phân tích mở đầu chuyên sâu khoảng 1000 - 1500 từ về đề tài với các thẻ ## H2 phân tích chi tiết kinh nghiệm hiện trường tại Ninh Bình"
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      });

      const cleanJson = (res.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.title && parsed.content) {
        generatedPost = parsed;
        sourceUsed = 'ai_gemini';
      }
    } catch (err) {
      console.warn('[SchedulerRunner] Gemini call failed, continuing with deterministic engine:', err);
    }
  }

  // Construct guaranteed >= 5000-word post (combines Gemini's unique intro + full 12-chapter whitepaper)
  const finalTitle = generatedPost?.title || `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}: Hướng Dẫn Kỹ Thuật Toàn Diện & Phân Tích Thực Tiễn Tại Ninh Bình`;
  const finalSlug = generatedPost?.slug || finalTitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const baseContent = generatedPost?.content ? `${generatedPost.content.trim()}\n\n---\n\n` : '';
  const whitepaperContent = buildDeterministicWhitepaper(primaryKeyword, secondaryKeywordsList.join(', '), finalTitle, relatedArticles);
  const fullRawContent = `${baseContent}${whitepaperContent}`;
  const enrichedContent = enrichContentWithImages(fullRawContent, finalTitle, combinedKeywords, chosenCover.url);
  const finalWordCount = enrichedContent.trim().split(/\s+/).filter(Boolean).length;
  const fullSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

  const newBlogPost: BlogPost = {
    id: `post-${Date.now()}`,
    title: finalTitle,
    slug: fullSlug,
    permalink: `/${fullSlug}.html`,
    category: generatedPost?.category || 'Kỹ Thuật Thi Công',
    excerpt: generatedPost?.excerpt || `Cẩm nang kỹ thuật chuyên sâu về ${primaryKeyword} từ kỹ sư Bê Tông An Gia Bình: Tiêu chuẩn TCVN, bảng cấp phối mác, kiểm định nón sụt và bảo dưỡng chuẩn xác.`,
    content: enrichedContent,
    date: todayVn,
    coverImage: chosenCover.url,
    tags: generatedPost?.tags || [primaryKeyword, 'bê tông an gia bình', 'kỹ thuật thi công', 'Ninh Bình'],
    focusKeywords: generatedPost?.focusKeywords || [primaryKeyword, ...secondaryKeywordsList.slice(0, 3)],
    readTime: `${Math.max(15, Math.ceil(finalWordCount / 200))} phút`,
    views: 12
  };

  // Save new post to public/data/posts.json
  saveSinglePostServer(newBlogPost);

  // Auto-submit URL to Google Indexing API & IndexNow
  try {
    const postCanonicalUrl = `https://www.betongangiabinh.vn/${fullSlug}.html`;
    await autoSubmitPostUrlServer(postCanonicalUrl);
  } catch (idxErr) {
    console.warn('[scheduler-runner] Auto-submit to Google Indexing failed:', idxErr);
  }

  // Update admin settings log
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    newsTitle: currentTopic,
    generatedTitle: finalTitle,
    wordCount: finalWordCount,
    status: 'published' as const
  };

  const updatedAdminConfig = {
    ...adminConfig,
    aiScheduler: {
      ...scheduler,
      lastRunAt: new Date().toISOString(),
      totalPublished: (scheduler?.totalPublished || 0) + 1,
      logs: [newLog, ...(scheduler?.logs || [])].slice(0, 20)
    }
  };

  saveAdminConfigServer(updatedAdminConfig);

  // Synchronize to GitHub if token available
  try {
    const updatedInitialCode = getUpdatedInitialDataCode();
    await commitFilesViaGitHubApi(
      [{ path: 'public/data/posts.json', content: JSON.stringify(getAllPostsServer(), null, 2) }],
      `[AI Auto-Scheduler] Xuất bản tự động: ${finalTitle} (${finalWordCount} từ)`
    );
  } catch (syncErr) {
    console.warn('[SchedulerRunner] Git sync note:', syncErr);
  }

  return {
    success: true,
    post: newBlogPost,
    wordCount: finalWordCount,
    message: `Đã tự động tạo và xuất bản bài viết thành công: "${finalTitle}" (${finalWordCount.toLocaleString('vi-VN')} từ, nguồn: ${sourceUsed}).`,
    source: sourceUsed
  };
}
