import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import AppContextProvider from "../context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const lato = Lato({ weight: "400", subsets: ["latin"], display: "swap" });

// Use ONE main site URL (use env in production)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://proptriz.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Proptriz Hub",
    template: "%s | Proptriz Hub",
  },

  description:
    "Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities.",

  alternates: {
    canonical: SITE_URL, // must match the real domain
  },

  keywords: [
    "property",
    "properties",
    "rent",
    "sale",
    "pi",
    "land",
    "apartment",
    "real estate",
    "Nigeria",
  ],

  authors: [{ name: "Proptriz Team" }],

  openGraph: {
    title: "Proptriz Hub",
    description:
      "Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities.",
    url: SITE_URL,
    siteName: "Proptriz Hub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/logo.png`, // ✅ absolute OG image for WhatsApp
        width: 1200,
        height: 630,
        alt: "Proptriz Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Proptriz Hub",
    description:
      "Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities.",
    images: [`${SITE_URL}/logo.png`],
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-black ${lato.className} antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

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

        <div className="w-full min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300">
          <AppContextProvider>
            {children}
            <ToastContainer />
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
