import { NextRequest, NextResponse } from 'next/server';
import { checkAndRunScheduler, checkAndRunSocialListeningAutoPilot } from '@/lib/scheduler-runner';

export const dynamic = 'force-dynamic';

const DEFAULT_OWNER = 'khuynhtroc';
const DEFAULT_REPO = 'angiabinhv4';
async function dispatchGithubWorkflow(eventType: string, payload: any) {
  const token = (process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || '').trim().replace(/^['"]|['"]$/g, '');
  const owner = (process.env.GITHUB_OWNER || DEFAULT_OWNER).trim();
  const repo = (process.env.GITHUB_REPO || DEFAULT_REPO).trim();

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'BeTongAnGiaBinh-CronJobOrg',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: payload,
    }),
  });

  return { ok: res.ok, status: res.status };
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const sync = searchParams.get('sync') === 'true';
    const force = searchParams.get('force') === 'true';
    const mode = searchParams.get('mode') || 'all';

    // 1. Chế độ đồng bộ (chỉ chạy khi có cờ ?sync=true)
    if (sync) {
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
        sync: true,
        duration_ms: Date.now() - startTime,
        results,
      });
    }

    // 2. Chế độ Mặc định cho cron-job.org: Dispatch GitHub Actions Cloud Runner
    // Trả về HTTP 200 OK ngay trong vòng 500ms để cron-job.org KHÔNG BAO GIỜ bị timeout 30s
    const eventType = mode === 'social' || mode === 'social-listening' ? 'social_listen' : 'cron_publish';
    const dispatch = await dispatchGithubWorkflow(eventType, {
      source: 'cron-job.org',
      mode,
      force,
      triggered_at: new Date().toISOString(),
      requested_url: req.url,
    });

    if (!dispatch.ok) {
      // Fallback: Dispatch failed -> Run autonomous AI writer directly with time budget protection
      const results: Record<string, any> = {};
      if (mode === 'all' || mode === 'social' || mode === 'social-listening') {
        results.socialListening = await checkAndRunSocialListeningAutoPilot(force);
      }
      // Only run heavy whitepaper if mode specifically requested or if time budget permits (<15s)
      if (mode === 'whitepaper' || (mode === 'all' && (Date.now() - startTime) < 15000)) {
        results.whitepaper = await checkAndRunScheduler(force);
      }
      return NextResponse.json({
        success: true,
        message: 'AI Auto-Writer task executed directly via Autonomous Engine (GitHub dispatch fallback)',
        service: 'Be Tong An Gia Binh Autonomous Intelligence Engine',
        source: 'direct_execution',
        github_status: dispatch.status,
        target_domain: 'https://www.betongangiabinh.vn',
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        results,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'AI Auto-Writer task successfully triggered and queued on GitHub Actions Cloud Runners!',
      service: 'Be Tong An Gia Binh Autonomous Intelligence Engine',
      source: 'cron-job.org',
      status: 'dispatched_successfully',
      github_status: dispatch.status,
      target_domain: 'https://www.betongangiabinh.vn',
      duration_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API /api/cron/ai-scheduler GET] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi thực thi AI Cron Scheduler: ' + (err?.message || 'Internal Error'),
        duration_ms: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
