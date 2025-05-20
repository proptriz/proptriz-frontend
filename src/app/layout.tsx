import type { Metadata } from "next";
import { Lato } from 'next/font/google';
import "./globals.css";
import AppContextProvider from "../../context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/context/AuthContext";

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
        <div className="w-full md:mx-auto min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300" >
          <SessionProvider>
            <AuthProvider>
              <AppContextProvider>        
                {children}
                <ToastContainer />              
              </AppContextProvider>
            </AuthProvider>
          </SessionProvider>
        </div> 
      </body>
    </html>
  );
}
