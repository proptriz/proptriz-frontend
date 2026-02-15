"use client";

import axiosClient, { setAuthToken } from "@/config/client";
import { useEffect, useContext, useRef } from "react";
import logger from "../../logger.config.mjs";
import { AppContext } from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const { setAuthUser, googleReady  } = useContext(AppContext);
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleReady || !buttonRef.current) return;

    // Prevent duplicate initialization
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      auto_select: false,
      callback: async (response: any) => {
        try {
          const res = await axiosClient.post(
            `/users/authenticate/google`,
            { idToken: response.credential }
          );

          const data = res.data;

          setAuthUser(data.user);
          setAuthToken(data.token);

          if (data.requiresOnboarding) {
            router.push("/profile/edit");
          }

        } catch (error) {
          logger.error("Login failed:", error);
        }
      },
    });

    // Clear container before rendering
    buttonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      shape: "rectangular",
      text: "continue_with",
      logo_alignment: "center",
    });

  }, [googleReady]);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={buttonRef}
        className="shadow-sm rounded-lg overflow-hidden transition-transform active:scale-95"
      />
    </div>
  );
}
