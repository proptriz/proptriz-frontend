import { CategoryEnum } from "@/types";
import React, { SetStateAction } from "react";

// ─── Tab definitions with emoji icons ─────────────────────────────────────────
// Emojis replace the icon components that were commented out — zero dependency,
// visually consistent with the rest of the design system.

const TABS: { name: string; value: CategoryEnum; icon: string }[] = [
  { name: "House",    value: CategoryEnum.house,    icon: "🏠" },
  { name: "Land",     value: CategoryEnum.land,     icon: "🏘️" },
  { name: "Shortlet", value: CategoryEnum.shortlet, icon: "🌙" },
  { name: "Hotel",    value: CategoryEnum.hotel,    icon: "🏨" },
  { name: "Shop",     value: CategoryEnum.shop,     icon: "🏪" },
  { name: "Office",   value: CategoryEnum.office,   icon: "🏢" },
  { name: "Others",   value: CategoryEnum.others,   icon: "•••" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavigationTabsProps {
  value: string;
  onChange: React.Dispatch<SetStateAction<CategoryEnum>>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NavigationTabs: React.FC<NavigationTabsProps> = ({ value, onChange }) => {
  return (
    <nav
      className="flex gap-2 overflow-x-auto w-full py-0.5"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" } as React.CSSProperties}
      aria-label="Property categories"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-pressed={isActive}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-[1.5px]
                        flex-shrink-0 text-[11px] font-medium transition-all duration-200
                        ${isActive
                          ? "bg-[#1a7a4a] text-white border-[#1a7a4a] font-bold"
                          : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#2ea06a] hover:text-[#1a7a4a]"
                        }`}
          >
            <span className="text-[15px] leading-none">{tab.icon}</span>
            {tab.name}
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationTabs;
