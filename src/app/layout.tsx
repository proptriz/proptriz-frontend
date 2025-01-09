import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lato } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "E Rental Hub",
  description: "Easy search and list of apartment, house, shop, land etc. for sale and rent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-background text-black ${lato.className} antialiased`}
      >
        <div className="w-full md:w-[650px] md:mx-auto min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300" >
          {children}
        </div> 
      </body>
    </html>
  );
}
