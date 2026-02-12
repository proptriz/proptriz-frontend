"use client";

import axiosClient, { setAuthToken } from "@/config/client";
import { useEffect, useContext } from "react";
import logger from "../../logger.config.mjs";
import {AppContext} from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleLoginButton() {
  const { setAuthUser } = useContext(AppContext);
  const router = useRouter()

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        const idToken = response.credential;
        try {
          const res = await axiosClient.post(`/users/authenticate/google`, {
            idToken: idToken,
          });
          const data = res.data;

          if (res.status === 200) {
            logger.info("Login success:", data);
            setAuthUser(data.user);
            setAuthToken(data.token);
            if (res.data.requiresOnboarding) {
              router.push("/profile/edit");
            } 
          }
        } catch (error) {
          logger.error("Login failed:", error);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline", // 'outline' looks more modern and premium
        size: "large",
        width: "320", // Matches mobile-first widths
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "center",
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Container with a subtle shadow to make it pop */}
      <div id="googleSignInDiv" className="shadow-sm rounded-lg overflow-hidden transition-transform active:scale-95" />
    </div>
  );
}