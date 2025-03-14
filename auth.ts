import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import userAPI from '@/services/userApi';
import axiosClient, { setAuthToken } from '@/config/client';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const data = await userAPI.login({ username, password });
          const user = data.user;
          if (!user) return null;
          
          console.log("User authenticated:", user); // Debugging
          
          return {
            id: user._id, // Ensure `_id` is a string
            name: user.username,
            email: user.email,
            image: user.image,
            fullname: user.fullname,
            emailVerified: user.emailVerified || null, // ✅ Add this field (null if not available)
          };
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
    Google,
    Facebook,
    Apple,
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = {
          id: user.id,
          name: user.name || '',
          email: user.email,
          emailVerified: user.emailVerified, // ✅ Include emailVerified in session
        };
      }
      return session;
    },
  },
});
