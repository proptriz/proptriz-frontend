'use client';

import Link from "next/link";
import React from "react";
import { FaRegUser } from "react-icons/fa";
import { FiHome, FiHeart, FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";

const menus = [
  { name: "Home", icon: <FiHome />, link: '/home' },
  { name: "Favorite", icon: <FiHeart />, link: '/home/promotion' },
  { name: "Search", icon: <FiSearch />, link: '#' },
  { name: "Settings", icon: <FaRegUser />, link: '/home/agent-dashboard' },
];

const Footer: React.FC = () => {
  const pathname = usePathname();
  return (
    <footer className="fixed bottom-0 w-full bg-gray-200 flex justify-around shadow-md z-20">
      {menus.map((menu, index) => (
        <Link href={menu.link} key={index}>
          <button className={`flex flex-col items-center px-6 py-4 w-full ${menu.link===pathname? 'text-[#234F68] card-bg': 'text-gray-700'}`}>
            <div className="text-2xl">{menu.icon}</div>
            {/* <p className="text-sm">{menu.name}</p> */}
          </button>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
