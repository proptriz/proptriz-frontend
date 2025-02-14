import { auth } from '../auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await auth(); // Get the authenticated user session

  const protectedRoutes = [
    '/profile/transaction',
    '/profile/edit',
    '/property/add',
    '/property/edit',
    '/property/reviews',
  ];

  // 🚀 Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session?.user) {
      const loginUrl = new URL('/profile/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🚀 Redirect authenticated users away from the login page
  if (req.nextUrl.pathname.startsWith('/profile/login') && session?.user) {
    const profileUrl = new URL('/profile/transaction', req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/profile/edit',
    '/property/add',
    '/property/edit',
    '/profile/login', // Ensure login page is covered
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
