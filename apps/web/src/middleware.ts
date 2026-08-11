import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'webuildreal.dev';
const LEGACY_HOSTS = new Set(['pact.pbm-labs.com', 'www.webuildreal.dev']);

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (!host || (!LEGACY_HOSTS.has(host) && host !== CANONICAL_HOST)) {
    return NextResponse.next();
  }

  if (LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
