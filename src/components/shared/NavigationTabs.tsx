import { CategoryEnum } from "@/types/property";
import React, { SetStateAction } from "react";

// ─── Tab definitions with emoji icons ─────────────────────────────────────────
// Emojis replace the icon components that were commented out — zero dependency,
// visually consistent with the rest of the design system.

const CATEGORIES: { label: string; value: CategoryEnum; icon: string }[] = [
  { label: "Apartment",    value: CategoryEnum.house,    icon: "🏠" },
  { label: "Land",     value: CategoryEnum.land,     icon: "🏘️" },
  { label: "Shortlet", value: CategoryEnum.shortlet, icon: "🌙" },
  { label: "Hotel",    value: CategoryEnum.hotel,    icon: "🏨" },
  { label: "Shop",     value: CategoryEnum.shop,     icon: "🏪" },
  { label: "Office",   value: CategoryEnum.office,   icon: "🏢" },
  { label: "Others",   value: CategoryEnum.others,   icon: "•••" },
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
      {CATEGORIES.map((tab) => {
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
                          ? "text-white border-[#1e5f74] font-bold"
                          : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#1e5f74] hover:text-[#1e5f74]"
                        }`}
            style={isActive ? { background: "linear-gradient(135deg,#143d4d,#1e5f74)" } : undefined}
          >
            <span className="text-[15px] leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationTabs;