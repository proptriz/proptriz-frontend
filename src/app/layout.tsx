import type { Metadata } from "next";
import { Lato } from 'next/font/google';
import "./globals.css";
import AppContextProvider from "../../context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react"

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "E Landlord",
  description: "Easy search and list of apartment, house, shop, land etc. for sale and rent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body
        className={`bg-background text-black ${lato.className} antialiased`}
      >
        <div className="w-full md:w-[650px] md:mx-auto min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300" >
          <AppContextProvider>
            <SessionProvider>
              {children}
              <ToastContainer />
            </SessionProvider>
          </AppContextProvider>
        </div> 
      </body>
    </html>
  );
}
