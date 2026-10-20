import { NextRequest, NextResponse } from 'next/server';
import { getRealtimeTrends } from '@/lib/social-listening';
import { getAllPostsServer } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const existingPosts = getAllPostsServer();
    const trends = await getRealtimeTrends(existingPosts);

    return NextResponse.json({
      success: true,
      trends,
      total: trends.length,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[API /api/ai/social-listening/trends] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi quét xu hướng mạng xã hội: ' + (err?.message || 'Lỗi không xác định'),
        trends: []
      },
      { status: 500 }
    );
  }
}
