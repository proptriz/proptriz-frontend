import React from "react";
import { FiHome, FiHeart, FiBell, FiSettings } from "react-icons/fi";

const menus = [
  { name: "Home", icon: <FiHome /> },
  { name: "Favourite", icon: <FiHeart /> },
  { name: "Notifications", icon: <FiBell /> },
  { name: "Settings", icon: <FiSettings /> },
];

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-200 p-4 flex justify-around shadow-md max-w-[650px] z-10">
      {menus.map((menu, index) => (
        <button key={index} className="flex flex-col items-center text-gray-700">
          <div className="text-2xl">{menu.icon}</div>
          <p className="text-sm">{menu.name}</p>
        </button>
      ))}
    </footer>
  );
};

export default Footer;
