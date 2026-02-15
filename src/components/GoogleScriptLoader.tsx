// components/GoogleScriptLoader.tsx
"use client";

import Script from "next/script";
import { useContext } from "react";
import { AppContext } from "@/context/AppContextProvider";

export default function GoogleScriptLoader() {
  const { setGoogleReady } = useContext(AppContext);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setGoogleReady(true)}
    />
  );
}
