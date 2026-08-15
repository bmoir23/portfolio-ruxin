import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|_vercel|api|[\\w-]+\\.\\w+).*)'],
};

export async function proxy() {
  return NextResponse.next();
}
