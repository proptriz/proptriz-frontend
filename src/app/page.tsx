<<<<<<< HEAD
'use client';

import React, { useState } from "react";
import Header from "@/components/shared/Header";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Map from "@/components/Map";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import PropertyListing from "@/components/property/Listing";

const HomePage: React.FC = () => {
  const [ mapOrList, setMapOrList ] = useState<string>('map')
  return (
    <div className="flex flex-col pt-5 pb-32">
      {/* Header */}
      <header className="p-4 flex justify-between items-center relative">
        {/* Centered Banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="banner.png"
            alt="banner"
            className="h-auto max-w-full"
          />
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4 ml-auto">
          <button className="text-gray-500 text-xl"><FaRegBell /></button>
          {/* <img
            src="https://placehold.co/40"
            alt="profile"
            className="rounded-full w-10 h-10"
          /> */}
        </div>
      </header>
      <div className="px-6 py-3">
        <SearchBar />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Map Section */}
      <div className="relative flex-1">
        {/* Centralized Button Tabs */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex w-[70%] bg-gray-100 rounded-full shadow-md text-white">
          <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${mapOrList==='map'? 'bg-[#61AF74]': 'bg-gray-100' }`}
            onClick={()=>setMapOrList('map')}
          >
            Map
          </button>
          <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${mapOrList==='list'? 'bg-[#61AF74]': 'bg-gray-100' }`}
            onClick={()=>setMapOrList('list')}
          >
            Listing
          </button>
        </div>

        {/* Map Component or List */}
        {
          mapOrList==='map'? 
          <Map />:
          <PropertyListing />
        }
        
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};

export default HomePage;
=======
// import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl">E Rental Hub Frontend</h1>
        {/* <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> 
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        
        */}
      </main>
      
    </div>
  );
}
>>>>>>> c227043d7798fe6345edcb8594de0eb3f081b6cc
