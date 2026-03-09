import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ✅ Redirect หน้า `/` ไป `/home`
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/features/dashboard', req.url));
  }

  // ✅ กำหนด CORS Headers (เฉพาะ API Routes)
  if (pathname.startsWith('/api')) {
    res.headers.set('Access-Control-Allow-Origin', '*');  // อนุญาตทุก origin
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  return res;
}

// ✅ ใช้ Middleware กับ `/` และ API Routes
export const config = {
  matcher: ['/', '/api/:path*'], 
};
