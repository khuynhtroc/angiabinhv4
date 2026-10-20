import { NextRequest, NextResponse } from 'next/server';
import { checkAndRunScheduler, checkAndRunSocialListeningAutoPilot } from '@/lib/scheduler-runner';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';
    const mode = searchParams.get('mode') || 'all';

    const results: Record<string, any> = {};

    if (mode === 'all' || mode === 'whitepaper') {
      results.whitepaper = await checkAndRunScheduler(force);
    }

    if (mode === 'all' || mode === 'social' || mode === 'social-listening') {
      results.socialListening = await checkAndRunSocialListeningAutoPilot(force);
    }

    return NextResponse.json({
      success: true,
      mode,
      results
    });
  } catch (err: any) {
    console.error('[API /api/cron/ai-scheduler GET] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi thực thi AI Cron Scheduler: ' + (err?.message || 'Internal Error')
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let force = false;
    let mode = 'all';

    try {
      const body = await req.json();
      force = Boolean(body?.force);
      if (body?.mode) mode = body.mode;
    } catch {
      // ignore empty body
    }

    const results: Record<string, any> = {};

    if (mode === 'all' || mode === 'whitepaper') {
      results.whitepaper = await checkAndRunScheduler(force);
    }

    if (mode === 'all' || mode === 'social' || mode === 'social-listening') {
      results.socialListening = await checkAndRunSocialListeningAutoPilot(force);
    }

    return NextResponse.json({
      success: true,
      mode,
      results
    });
  } catch (err: any) {
    console.error('[API /api/cron/ai-scheduler POST] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi thực thi AI Cron Scheduler: ' + (err?.message || 'Internal Error')
      },
      { status: 500 }
    );
  }
}
