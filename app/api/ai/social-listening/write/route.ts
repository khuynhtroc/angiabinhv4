import { NextRequest, NextResponse } from 'next/server';
import { generateTrendingNewsArticle } from '@/lib/trending-news-writer';
import { getRealtimeTrends, TrendingNewsItem } from '@/lib/social-listening';
import { getAllPostsServer } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let trend: TrendingNewsItem | null = null;
    let autoPick = false;

    try {
      const body = await req.json();
      if (body?.trend) {
        trend = body.trend;
      }
      if (body?.autoPick) {
        autoPick = true;
      }
    } catch {
      autoPick = true;
    }

    // If autoPick or no trend provided, scan trends and pick best candidate
    if (!trend && autoPick) {
      const existingPosts = getAllPostsServer();
      const allTrends = await getRealtimeTrends(existingPosts);
      const candidate = allTrends.find(t => !t.hasBeenWritten && t.trendScore >= 50);

      if (!candidate) {
        return NextResponse.json({
          success: false,
          message: 'Không tìm thấy chủ đề xu hướng phù hợp chưa được viết (yêu cầu điểm xu hướng >= 50).'
        }, { status: 404 });
      }

      trend = candidate;
    }

    if (!trend) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu thông tin xu hướng (trend) để viết bài.'
      }, { status: 400 });
    }

    const result = await generateTrendingNewsArticle(trend);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/ai/social-listening/write] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi tạo bài viết xu hướng: ' + (err?.message || 'Lỗi không xác định')
      },
      { status: 500 }
    );
  }
}
