import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const HOST = 'wake.webuildreal.dev';
const ALIASES = new Set([`www.${HOST}`]);

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (host && ALIASES.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
