import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Avoid redirecting in AI Studio preview or local dev
  if (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.startsWith('ais-dev-') ||
    host.startsWith('ais-pre-')
  ) {
    return NextResponse.next();
  }

  // 1. Redirect published Cloud Run URL -> https://www.betongangiabinh.vn
  // 2. Redirect non-www betongangiabinh.vn -> https://www.betongangiabinh.vn
  const isCloudRunDirect = host.startsWith('b-t-ng-an-gia-b-nh');
  const isNonWww = host === 'betongangiabinh.vn';

  if (isCloudRunDirect || isNonWww) {
    const url = request.nextUrl.clone();
    url.protocol = 'https';
    url.host = 'www.betongangiabinh.vn';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
