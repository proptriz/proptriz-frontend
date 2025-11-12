import type { Metadata } from "next";
import { Lato } from 'next/font/google';
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "../context/AppContextProvider";
import { ToastContainer } from "react-toastify";

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "Proptriz Hub",
  description: "Easy search and list of apartment, house, shop, land etc. for sale and rent.",
};

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
        <title>Proptriz</title>
        <base href="/" />
        <meta
          property="og:title"
          content="Proptriz, Searchable trusted properties"
        />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://mapofpi.concretecode.ch" /> */}
        {/* <meta
          property="og:image"
          content="https://mapofpi.concretecode.ch/assets/images/logo.svg"
        /> */}
        <meta
          name="description"
          content="Proptriz introduce transparency into real estate through blockchain by helping users to easily discover trusted properties for rent, sale and investment opportunities."
        />
        <meta name="keywords" content="property, properties, rent, sale, pi, land, apartment, real estate" />
        <meta name="author" content="Proptriz Team" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="font-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/https://fonts.gstatic.com/;"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVNC88Q13K"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SVNC88Q13K');
          `,
        }} />
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
