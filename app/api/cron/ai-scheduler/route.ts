import { NextRequest, NextResponse } from 'next/server';
import { checkAndRunScheduler } from '@/lib/scheduler-runner';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    const result = await checkAndRunScheduler(force);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/cron/ai-scheduler] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi thực thi AI Scheduler: ' + (err?.message || 'Internal Error')
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let force = false;
    try {
      const body = await req.json();
      force = Boolean(body?.force);
    } catch {
      // ignore empty body
    }

    const result = await checkAndRunScheduler(force);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/cron/ai-scheduler POST] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi thực thi AI Scheduler: ' + (err?.message || 'Internal Error')
      },
      { status: 500 }
    );
  }
}
