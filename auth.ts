import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import userAPI from '@/services/userApi';
import axiosClient, { setAuthToken } from '@/config/client';
import jwt from "jsonwebtoken";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ username: z.string(), password: z.string().min(6) })
        .safeParse(credentials);
      
      if (parsedCredentials.success) {
        const { username, password } = parsedCredentials.data;
        const data = await userAPI.login({username, password, provider:'credentials'});
        if(!data) return null;
        console.log("data-from-credentials", data)
        return data;


        // const user = data.user
        // if (!user) return null;
        // console.log('User authenticated:', user); // Debugging
        // const authUser = {
        //   id: user._id,
        //   email: user.email,
        //   name: user.fullname || user.username,
        //   image: user.image, 
        // };
        // return authUser
      }
      console.log('Invalid credentials');
      return null;
    },
  }), Google, Facebook, Apple, GitHub], 
  callbacks: {
    async jwt({token, user, account, profile}) {
      // console.log("user from jwt:", user)
      // console.log("token from jwt:", token)
      if (user) {
        const currentUser = user as { user: any, token: string };//

        token.id = currentUser.user?._id;
        token.email = currentUser.user?.email;
        token.name = currentUser.user?.fullname || currentUser.user?.username;
        token.picture = currentUser.user?.image || "";
        token.phone = currentUser.user?.phone || "";
        token.accessToken = currentUser?.token;

        console.log("current-user", user);
        const decoded = jwt.decode(currentUser?.token);
        console.log("decode", decoded);
        if (typeof decoded === 'object' && decoded !== null && 'exp' in decoded) {
          token.exp = decoded.exp as number;
          console.log("expireDate set", decoded.exp);
        } else {
          token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;
        }



        return token;
      }

      // if (account?.provider === 'google') {
      //   token.email = profile.email;
      //   token.picture = profile.picture;
      //   token.emailVerified = profile.verified_email;
      // }
      // if (account?.provider === 'facebook') {
      //   token.email = profile.email;
      //   token.picture = profile.picture.data.url;
      //   token.emailVerified = profile.verified_email;
      // }
      // if (account?.provider === 'apple') {
      //   token.email = profile.email;
      //   token.picture = null;
      //   token.emailVerified = profile.email_verified;
      // }
      return token;

    },
    async session({ session, token}) {
      // console.log("token from session:", token)
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name,
        image: token.picture as string,
        // phone: token.phone as string,
        emailVerified: token.emailVerified ? new Date(token.emailVerified as string) : null
      }
      session.sessionToken = token.accessToken as string;
      session.expires = new Date(token.exp as number * 1000).toISOString() as unknown as (Date & string); // Assign a Date object directly
      //     username: token.email, 
      //     password: '', 
      //     provider:'Oauth'
      //   });
      //   const currentUserDetails = data.user;
      //   setAuthToken(data.token)

      //   if(currentUserDetails) {
      //     session.user = {
      //       id: currentUserDetails._id,
      //       email: currentUserDetails.email,
      //       name: currentUserDetails.fullname || currentUserDetails.username,
      //       image: currentUserDetails.image || token.picture,
      //       // provider: dbUser.data.provider,
      //       // phone: dbUser.data.phone,  
      //       emailVerified: token.emailVerified ? new Date(token.emailVerified as string) : null
      //     };
      //   }
      // }     
      // if (token.email){
      //   // const resp = await axiosClient.get(`/users/get-user/${token.email}`);
      //   const data = await userAPI.login({
      
      return session;
    },
    async signIn({user, account}) {
      try {
        console.log("auth user: ", user);
        const currentUser = user as { user: any, token: string };//
        const existingUser = await axiosClient.post("/users/authenticate", { provider: account?.provider, email: currentUser.user.email, username: currentUser.user.username });
        console.log("API Response:", existingUser.data); // Debugging
        // if (existingUser.status === 200) return true;
        return true;
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