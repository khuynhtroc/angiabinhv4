import { NextRequest } from 'next/server';
import { GET as handler } from '../ai-scheduler/route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  url.searchParams.set('mode', 'social');
  const modifiedReq = new NextRequest(url, { headers: req.headers });
  return handler(modifiedReq);
}

export async function POST(req: NextRequest) {
  return GET(req);
}
