"use client";

import axiosClient, { setAuthToken } from "@/config/client";
import { useEffect, useContext, useRef } from "react";
import logger from "../../logger.config.mjs";
import { AppContext } from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

export default function GoogleLoginButton() {
  const { setAuthUser, googleReady, setRequiresOnboarding } = useContext(AppContext);
  const router  = useRouter();
  const btnRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleReady || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      auto_select: false,
      callback: async (response: any) => {
        try {
          const res  = await axiosClient.post("/users/authenticate/google", {
            idToken: response.credential,
          });
          const data = res.data;

          setAuthUser(data.user);
          setAuthToken(data.token);

          if (data.requiresOnboarding) {
            setRequiresOnboarding(true);
            router.push("/profile/edit");
          }
        } catch (error) {
          logger.error("Google login failed:", error);
        }
      },
    });

    // Clear any stale button before re-rendering
    btnRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(btnRef.current, {
      theme:          "outline",
      size:           "large",
      width:          320,
      shape:          "pill",          // pill matches the app's rounded language
      text:           "continue_with",
      logo_alignment: "center",
    });
  }, [googleReady]);

  return (
    <div className="flex flex-col items-center w-full">
      {/*
        The wrapper gives the native Google button a subtle brand shadow
        and rounds the corners to pill shape — without overriding the
        button's own styles (which would break Google's guidelines).
      */}
      <div
        ref={btnRef}
        className="overflow-hidden transition-transform active:scale-[0.97]"
        style={{
          borderRadius: 999,
          boxShadow: "0 2px 12px rgba(30,95,116,0.10)",
        }}
      />
    </div>
  );
}