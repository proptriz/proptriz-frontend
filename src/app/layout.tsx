import type { Metadata, Viewport } from "next";
import { DM_Sans, Raleway } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import AppContextProvider from "../context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import GoogleScriptLoader from "@/components/GoogleScriptLoader";
import { LanguageProvider } from "@/i18n/LanguageContext";
import LanguagePickerModal  from "@/components/LanguagePickerModal";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const dmSans = DM_Sans({
  weight:   ["400", "500", "600", "700"],
  subsets:  ["latin"],
  display:  "swap",
  variable: "--font-dm-sans",
});

const raleway = Raleway({
  weight:   ["700", "800", "900"],
  subsets:  ["latin"],
  display:  "swap",
  variable: "--font-raleway",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://proptriz.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "Proptriz Hub",
    template: "%s | Proptriz Hub",
  },
  description:
    "Proptriz — a Web3-integrated platform for discovering trusted properties near you. Rent, buy, or invest with confidence.",
  alternates: { canonical: SITE_URL },
  keywords: [
    "property", "properties", "land", "apartment", "hotel", "shortlet",
    "office", "shop", "properties in nigeria", "apartments for rent",
    "apartments for sale", "for sale", "for rent", "farming land",
    "pi property", "nigeria real estate", "real estate in nigeria",
    "apartment in lagos", "apartments in abuja", "Nigeria",
  ],
  authors: [{ name: "Proptriz Team" }],
  openGraph: {
    title:       "Proptriz Hub",
    description: "Discover trusted properties near you — for rent, sale, and investment.",
    url:         SITE_URL,
    siteName:    "Proptriz Hub",
    type:        "website",
    locale:      "en_US",
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: "Proptriz Hub" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Proptriz Hub",
    description: "Discover trusted properties near you — for rent, sale, and investment.",
    images:      [`${SITE_URL}/logo.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width:         "device-width",
  initialScale:  1,
  maximumScale:  1,
  userScalable:  false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // NOTE: no className on <html> — globals.css owns height:100% there.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${raleway.variable} antialiased`}
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          color: "#111827",
          // The background gradient lives on body so it always covers the
          // full visual area regardless of what the page renders.
          background: "linear-gradient(160deg,#f5f7f9 0%,#eaf2f5 50%,#f5f7f9 100%)",
        }}
      >
        {/*
          ── --vh custom property: the real mobile viewport fix ────────────────
          
          iOS Safari and Android Chrome report `window.innerHeight` as the
          true visible viewport height — EXCLUDING the collapsing browser chrome.
          `100vh` in CSS includes that chrome, so it's too tall on mobile.

          This script runs before paint (strategy="beforeInteractive") and sets
          `--vh` to 1/100th of the real inner height. Components use either:
            • `h-screen-safe` utility  (defined in globals.css, uses dvh + --vh)
            • `calc(var(--vh, 1dvh) * 100)` in inline styles

          The resize listener keeps it accurate when the address bar
          shows/hides as the user scrolls other pages.
        */}
        <Script id="vh-fix" strategy="beforeInteractive">
          {`
            function setVh() {
              document.documentElement.style.setProperty(
                '--vh', window.innerHeight * 0.01 + 'px'
              );
            }
            setVh();
            window.addEventListener('resize', setVh);
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0T7BSEVRN9"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0T7BSEVRN9');
          `}
        </Script>

        <LanguageProvider>
          <AppContextProvider>
            <GoogleScriptLoader />
            {children}

            {/* Language picker modal — available everywhere via useLanguage().openPicker() */}
            <LanguagePickerModal />

            <ToastContainer
              position="bottom-center"
              autoClose={4500}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              toastStyle={{
                borderRadius: 14,
                fontFamily:   "var(--font-dm-sans), sans-serif",
                fontSize:     13,
                fontWeight:   500,
                boxShadow:    "0 8px 32px rgba(0,0,0,0.12)",
              }}
            />
          </AppContextProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
