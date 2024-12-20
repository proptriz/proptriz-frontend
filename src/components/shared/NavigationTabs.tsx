import React from "react";
import { FiHome, FiGrid, FiMap, FiBriefcase, FiMoreHorizontal } from "react-icons/fi";

const tabs = [
  { name: "House", icon: <FiHome /> },
  { name: "Land", icon: < FiMap/> },
  { name: "Office", icon: <FiBriefcase /> },
  { name: "Shop", icon: <FiGrid /> },
  { name: "Hotel", icon: <FiGrid /> },
  { name: "Others", icon: <FiMoreHorizontal /> },
];

const NavigationTabs: React.FC = () => {
  return (
    <nav className="flex justify-around space-x-4 px-4 py-2 overflow-x-auto">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex items-center px-4 py-2 rounded-lg ${
            tab.name === "House" ? "bg-[#61AF74] text-white" : "bg-gray-100"
          }`}
        >
          {/* <span>{tab.icon}</span> */}
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;
