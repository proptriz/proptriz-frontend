'use client';

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

// ─── Menu definitions ─────────────────────────────────────────────────────────
// Renamed "Promotion" → "Explore" to match the route and user mental model.
// Emoji icons replaces the multi-library icon imports.

const MENUS = [
  { name: "Map",     icon: "📍", activeIcon: "📍", link: "/"             },
  { name: "Explore", icon: "🏠", activeIcon: "🏠", link: "/explore"      },
  { name: "Saved",   icon: "🤍", activeIcon: "❤️",  link: "/property/list" },
  { name: "Profile", icon: "👤", activeIcon: "👤", link: "/profile"      },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer
      className="sticky bottom-0 left-0 w-full z-20
                 bg-white border-t border-[#e5e7eb]
                 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch mx-auto">
        {MENUS.map((menu) => {
          const isActive = pathname === menu.link ||
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
              {/* Active top indicator bar */}
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

              {/* Label */}
              <span
                className={`text-[10px] font-medium leading-none transition-colors
                            ${isActive
                              ? "text-[#1e5f74] font-bold"
                              : "text-[#9ca3af]"
                            }`}
              >
                {menu.name}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;