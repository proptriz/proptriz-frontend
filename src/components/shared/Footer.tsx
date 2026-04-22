'use client';

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Component ────────────────────────────────────────────────────────────────
// Nav labels are translated via t().  The emoji icons are language-neutral so
// they stay constant — only the text label below each icon changes.

const Footer: React.FC = () => {
  const pathname   = usePathname();
  const { t }      = useLanguage();

  const MENUS = [
    { labelKey: "nav_map"     as const, icon: "📍", activeIcon: "📍", link: "/"             },
    { labelKey: "nav_explore" as const, icon: "🏠", activeIcon: "🏠", link: "/explore"      },
    { labelKey: "nav_saved"   as const, icon: "🤍", activeIcon: "❤️",  link: "/property/list" },
    { labelKey: "nav_profile" as const, icon: "👤", activeIcon: "👤", link: "/profile"      },
  ] as const;

  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-[40]
                 bg-white border-t border-[#e5e7eb]
                 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch mx-auto">
        {MENUS.map((menu) => {
          const isActive =
            pathname === menu.link ||
            (menu.link !== "/" && pathname.startsWith(menu.link));

          return (
            <Link
              key={menu.link}
              href={menu.link}
              className="flex-1 flex flex-col items-center justify-center
                         gap-1 py-2.5 relative transition-colors duration-150
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-[#1e5f74] focus-visible:ring-inset"
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2
                             w-5 h-[3px] rounded-b-full"
                  style={{ background: "#f0a500" }}
                />
              )}

              {/* Icon */}
              <span
                className={`text-[22px] leading-none transition-all duration-200
                            ${isActive ? "scale-110" : "opacity-60"}`}
              >
                {isActive ? menu.activeIcon : menu.icon}
              </span>

              {/* Translated label */}
              <span
                className={`text-[10px] font-medium leading-none transition-colors
                            ${isActive ? "text-[#1e5f74] font-bold" : "text-[#9ca3af]"}`}
              >
                {t(menu.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
