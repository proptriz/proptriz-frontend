import type { Metadata } from "next";
import { Lato } from 'next/font/google';
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "../context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import Script from 'next/script';

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Proptriz Hub',
    description: 'Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities.',
    metadataBase: new URL('https://proptriz.netlify.app'),
    alternates: { canonical: 'https://proptriz-test.netlify.app'},
    openGraph: {
      title: 'Proptriz Hub',
      description: 'Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities.',
      url: 'https://proptriz.netlify.app',
      siteName: 'Proptriz Hub',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Proptriz Logo',
        },
      ],
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta charSet="utf-8" />
        <title>Proptriz Hub</title>
        <meta
          property="og:title"
          content="Proptriz Hub, Connecting you with trusted properties"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://proptriz.netlify.app" />
        <meta
          name="description"
          content="Proptriz, A Web3 integrated platform that helps you discover trusted properties within your locality for rent, sale and investment opportunities."
         />
        <meta name="keywords" content="property, properties, rent, sale, pi, land, apartment, real estate" />
        <meta name="author" content="Proptriz Team" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="font-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/https://fonts.gstatic.com/;"
        />
        {/* Google tag (gtag.js) using Next.js Script */}
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

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
        />

        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`bg-background text-black ${lato.className} antialiased`}
      >
        <div className="w-full min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300" >
          <AppContextProvider>
            {children}
            <ToastContainer />
          </AppContextProvider>
        </div> 
      </body>
    </html>
  );
}
