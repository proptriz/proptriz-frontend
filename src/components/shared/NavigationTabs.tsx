import React, { SetStateAction }  from "react";
import { FiHome, FiGrid, FiMap, FiBriefcase, FiMoreHorizontal } from "react-icons/fi";

const tabs = [
  { name: "House", value:'house', icon: <FiHome /> },
  { name: "Land", value:'land', icon: < FiMap/> },
  { name: "Shortlet", value:'shortlet', icon: <FiHome /> },
  { name: "Hotel", value:'hotel', icon: <FiGrid /> },
  { name: "Shop", value:'shop', icon: <FiGrid /> },
  { name: "Office", value:'office', icon: <FiBriefcase /> },
  { name: "Others", value:'others', icon: <FiMoreHorizontal /> },
];

interface NavigationTabsProps {
  value: string;
  onChange: React.Dispatch<SetStateAction<string>>;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ value, onChange }) => {
  
  return (
    <nav 
    className="flex justify-between gap-3 overflow-x-auto scroll-hide w-full"
    style={{msOverflowStyle: "none", scrollbarWidth: "none"} as React.CSSProperties}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex items-center px-2 py-1 rounded-lg ${
            value === tab.value ? "bg-primary text-secondary" : "card-bg"
          }`}
          onClick={()=>onChange(tab.value)}
        >
          {/* <span>{tab.icon}</span> */}
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;
