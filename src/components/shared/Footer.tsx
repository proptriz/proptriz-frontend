'use client';

import Link from "next/link";
import React from "react";
import { FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { FiHome, FiHeart } from "react-icons/fi";

import { usePathname } from "next/navigation";

const menus = [
  { name: "Home", icon: <FaMapMarkerAlt  />, link: '/' },
  { name: "Explore", icon: <FiHome />, link: '/explore' },
  { name: "Favorite", icon: <FiHeart />, link: '/property/list' },
  { name: "Settings", icon: <FaRegUser />, link: '/profile' },
];

const Footer: React.FC = () => {
  const pathname = usePathname();
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around shadow-md z-50">
      {menus.map((menu, index) => (
        <Link 
        href={menu.link} 
        key={index} 
        className={`flex items-center px-6 py-4 w-full ${menu.link===pathname? 'text-primary card-bg': 'text-tertiary'}`}
        >
          <button className={"mx-auto"}>
            <div className="text-2xl mx-auto">{menu.icon}</div>
            {/* <p className="text-sm">{menu.name}</p> */}
          </button>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
