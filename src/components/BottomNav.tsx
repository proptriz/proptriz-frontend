import React from "react";
import { FiHome, FiSearch, FiUser } from "react-icons/fi";

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-4 flex justify-around shadow-md">
      <FiHome size={24} />
      <FiSearch size={24} />
      <FiUser size={24} />
    </div>
  );
};

export default BottomNav;
