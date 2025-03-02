import React, { useEffect, useState }  from "react";
import { FiHome, FiGrid, FiMap, FiBriefcase, FiMoreHorizontal } from "react-icons/fi";

const tabs = [
  { name: "House", value:'house', icon: <FiHome /> },
  { name: "Land", value:'land', icon: < FiMap/> },
  { name: "Office", value:'office', icon: <FiBriefcase /> },
  { name: "Shop", value:'shop', icon: <FiGrid /> },
  { name: "Hotel", value:'hotel', icon: <FiGrid /> },
  { name: "Others", value:'others', icon: <FiMoreHorizontal /> },
];

interface NavigationTabsProps {
  disable?: boolean; 
  setValue: (value: string) => void
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ disable=false, setValue }) => {
  const [selectedValue, setSelectedValue] = useState<string>(tabs[0]?.value || "");
  
  useEffect(() => {
    // Set the default value as the first item's value
    setValue(selectedValue);
  }, [selectedValue, setValue]);
  
  return (
    <nav className="flex space-x-4 px-4 py-2 overflow-x-auto">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex items-center px-4 py-2 rounded-lg ${
            selectedValue === tab.value ? "bg-[#61AF74] text-white" : "bg-gray-100"
          }`}
          onClick={()=>!disable? setSelectedValue(tab.value): null}
        >
          {/* <span>{tab.icon}</span> */}
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;
