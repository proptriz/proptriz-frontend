import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google"
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import userAPI from '@/services/userApi';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
  }), Google],
  
});