'use client';

import Link from "next/link";
import React from "react";
import { FaRegUser, FaMapMarkerAlt, FaUser, FaHeart } from "react-icons/fa";
import { FiHome, FiHeart } from "react-icons/fi";

import { usePathname } from "next/navigation";
import { PiHouseFill } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";

const menus = [
  { name: "Map", icon: <LuMapPin />, activeIcon:<FaMapMarkerAlt />, link: '/' },
  { name: "Pomotion", icon: <FiHome />, activeIcon:<PiHouseFill />, link: '/explore' },
  { name: "Favorite", icon: <FiHeart />,  activeIcon:<FaHeart />, link: '/property/list' },
  { name: "Profile", icon: <FaRegUser />, activeIcon:<FaUser />, link: '/profile' },
];

const Footer: React.FC = () => {
  const pathname = usePathname();
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around shadow-md z-50">
      {menus.map((menu, index) => (
        <Link 
        href={menu.link} 
        key={index} 
        className={`flex items-center py-2 w-full flex flex-col items-center justify-center${menu.link===pathname? 'text-primary card-bg': 'text-tertiary'}`}
        >
          <p className="text-xl">{menu.link===pathname? menu.activeIcon: menu.icon}</p>
          <p className="text-xs">{menu.name}</p>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
