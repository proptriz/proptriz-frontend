"use client";

import axiosClient, { setAuthToken } from "@/config/client";
import { useEffect, useContext } from "react";
import logger from "../../logger.config.mjs";
import {AppContext} from "@/context/AppContextProvider";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleLoginButton() {
    const { authenticateUser, setAuthUser,  } = useContext(AppContext);

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        // This is the Google ID token (JWT)
        const idToken = response.credential;
        // logger.info("Google ID Token:", idToken);

        // Send token to your backend
        const res = await axiosClient.post(`/users/authenticate/google`, {
          idToken: idToken,
        });

        const data = await res.data;

        if (res.status !== 200) {
          logger.error("Login failed:", data);
          return;
        }

        logger.info("Login success:", data);
        setAuthUser(data.user);
        setAuthToken(data.token);

        // You can redirect after success
        // window.location.href = "/dashboard";
      },
    });

    // Render the Google button into a div
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline",
        size: "large",
        width: 200,
      }
    );

    // Optional: enable One Tap
    // window.google.accounts.id.prompt();
  }, []);

  return <div id="googleSignInDiv" />;
}