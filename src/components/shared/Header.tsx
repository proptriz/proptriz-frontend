"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SlMenu } from "react-icons/sl";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 border-b border-black/5">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Proptriz"
            width={104}
            height={64}
            priority
            fetchPriority="high"
            className="h-9 w-auto object-contain"
          />

          <div className="text-base text-2xl font-bold tracking-wide text-gray-900">
            ropTriz
          </div>
        </Link>

        {/* Menu */}
        <button
          type="button"
          className="text-gray-600 text-xl p-2 rounded-full hover:bg-black/5 active:scale-95 transition"
          aria-label="Open menu"
        >
          <SlMenu />
        </button>
      </div>
    </header>
  );
};

export default Header;