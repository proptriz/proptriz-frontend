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

const NavigationTabs: React.FC<{setValue: (value: string) => void}> = ({ setValue }) => {
  const [selectedValue, setSelectedValue] = useState<string>(tabs[0]?.value || "");
  
    useEffect(() => {
      // Set the default value as the first item's value
      setValue(selectedValue);
    }, [selectedValue, setValue]);
  
    const handleSelection = (value: string) => {
      setSelectedValue(value);
    };
  return (
    <nav className="flex sm:justify-center gap-4 overflow-x-auto w-full">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex items-center px-4 py-2 rounded-lg ${
            selectedValue === tab.value ? "bg-primary text-secondary" : "bg-gray-100"
          }`}
          onClick={()=>setSelectedValue(tab.value)}
        >
          {/* <span>{tab.icon}</span> */}
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;
