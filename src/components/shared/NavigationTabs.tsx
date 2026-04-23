import { CategoryEnum } from "@/types/property";
import React, { SetStateAction } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Translations } from "@/i18n/translations";

// ─── Tab definitions ──────────────────────────────────────────────────────────
// labelKey ties each category to the translation table.
// Icon emojis are language-neutral — only the text label changes.

const CATEGORIES: {
  labelKey: keyof Translations;
  value:    CategoryEnum;
  icon:     string;
}[] = [
  { labelKey: "cat_apartment", value: CategoryEnum.house,    icon: "🏠" },
  { labelKey: "cat_land",      value: CategoryEnum.land,     icon: "🏘️" },
  { labelKey: "cat_shortlet",  value: CategoryEnum.shortlet, icon: "🌙" },
  { labelKey: "cat_hotel",     value: CategoryEnum.hotel,    icon: "🏨" },
  { labelKey: "cat_shop",      value: CategoryEnum.shop,     icon: "🏪" },
  { labelKey: "cat_office",    value: CategoryEnum.office,   icon: "🏢" },
  { labelKey: "cat_others",    value: CategoryEnum.others,   icon: "•••" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavigationTabsProps {
  value:    string;
  onChange: React.Dispatch<SetStateAction<CategoryEnum>>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NavigationTabs: React.FC<NavigationTabsProps> = ({ value, onChange }) => {
  const { t } = useLanguage();

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
            style={isActive
              ? { background: "linear-gradient(135deg,#143d4d,#1e5f74)" }
              : undefined}
          >
            <span className="text-[15px] leading-none">{tab.icon}</span>
            {/* Translated label — stays on one line, tab never widens */}
            <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationTabs;
