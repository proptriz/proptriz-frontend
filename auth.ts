import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import userAPI from '@/services/userApi';
import axiosClient from '@/config/client';
import { AdapterUser } from 'next-auth/adapters';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ username: z.string(), password: z.string().min(6) })
        .safeParse(credentials);
      
      if (parsedCredentials.success) {
        const { username, password } = parsedCredentials.data;
        const user = await userAPI.login({username, password});
        if (!user) return null;
        console.log('User authenticated:', user); // Debugging
        return user
      }
      console.log('Invalid credentials');
      return null;
    },
  }), Google, Facebook, Apple, GitHub], 
  callbacks: {
    async session({ session, token}) {
    //  console.log("token:", token.email)
    const dbUser = await axiosClient.get(`/users/get-user/${token.email}`);
    const currentUserDetails = dbUser.data.data.data

    if(dbUser) {
          session.user = {
            id: currentUserDetails._id,
            email: currentUserDetails.email,
            name: currentUserDetails.fullname || currentUserDetails.username,
        image: currentUserDetails.image,
            // provider: dbUser.data.provider,
            // phone: dbUser.data.phone,  
            emailVerified: token.emailVerified ? new Date(token.emailVerified as string) : null
          };
        }
      
      return session;
    },
    async signIn({user, account}) {
      try {
        const existingUser = await axiosClient.post("/users/auth", { ...user, provider: account?.provider });
        console.log("API Response:", existingUser.data); // Debugging
        if (existingUser.status === 200) return true;
      } catch (error) {
        console.error("Sign-in failed:", error);
      }
      return false;
    }
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/profile/login',
    error: '/error'
  },
});