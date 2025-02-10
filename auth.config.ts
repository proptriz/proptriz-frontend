import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/profile/login',
    error: '/error'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith('/profile/transaction');

      if (isOnProfile && !isLoggedIn) {
        return false; // Middleware will handle redirection
      }

      return true;
    },
  },
  providers: [], // Add authentication providers
} satisfies NextAuthConfig;
