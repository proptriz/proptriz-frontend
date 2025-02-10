import { auth } from '../auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware is running for:', req.nextUrl.pathname); // Debugging
  const session = await auth(); // Get the authenticated user session
  console.log('Session data:', session); // Debugging

  const protectedRoutes = ['/profile/transaction', '/profile/edit', '/property/add', '/property/edit', '/property/reviews']; // Add more protected routes if needed

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session?.user) {
      // Redirect unauthenticated users to login page
      const loginUrl = new URL('/profile/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/profile/edit', '/property/add', '/property/edit', '/((?!api|_next/static|_next/image|.*\\.png$).*)'] // Apply middleware only to this route
};
