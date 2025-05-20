import { auth } from '../auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await auth(); // Get the authenticated user session

  const protectedRoutes = [
    // '/property/add-property',
    '/home/agent-dashboard',
    '/home/user-profile',
    // '/agents/register',
    '/property/edit',
  ];

  // 🚀 Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session?.user) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🚀 Redirect authenticated users away from the login page
  if (req.nextUrl.pathname.startsWith('/login') && session?.user) {
    const profileUrl = new URL('/home/agent-dashboard', req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/profile/edit',
    '/home/agent-dashboard',
    '/home/user-profile',
    '/agents/register',
    '/property/add-property',
    '/property/edit',
    '/login', // Ensure login page is covered
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
