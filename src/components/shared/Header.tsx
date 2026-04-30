"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import { SlMenu } from "react-icons/sl";
import Popup from "./Popup";
import { AppContext } from "@/context/AppContextProvider";
import Image from "next/image";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALE_META } from "@/i18n/translations";

// ─── Component ────────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { authUser }            = useContext(AppContext);
  const { t, locale, openPicker } = useLanguage();

  // Menu items — labels come from the translation table.
  // The Language entry also shows the active locale flag + name for instant
  // feedback without opening the picker.
  const MENU_ITEMS = [
    { icon: "✏️", labelKey: "menu_edit_profile"  as const, link: "/profile/edit",         action: undefined          },
    { icon: "🏠", labelKey: "menu_list_property" as const, link: "/property/add",          action: undefined          },
    { icon: "🤝", labelKey: "menu_become_agent"  as const, link: "#",  action: undefined          },
    { icon: "🔒", labelKey: "menu_privacy"       as const, link: "/privacy-policy",        action: undefined          },
    { icon: "📋", labelKey: "menu_terms"         as const, link: "/terms-of-service",      action: undefined          },
    { icon: "❓", labelKey: "menu_faq"           as const, link: "/profile/faq",           action: undefined          },
  ] as const;

  const localeMeta = LOCALE_META[locale];

  return (
    <>
      {/* ── Sticky header bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-[40] w-full border-b border-black/10"
        style={{ background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)" }}
      >
        <div className="h-14 px-4 flex items-center justify-between mx-auto">

          {/* Logo */}
          <BrandLogo variant="full" theme="light" size={36} linkTo="/" />

          {/* Right-side: language badge + menu button */}
          <div className="flex items-center gap-2">

            {/* Language badge — tapping it opens the picker directly from header */}
            <button
              type="button"
              onClick={openPicker}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                         transition-all hover:bg-white/25 active:scale-95"
              aria-label={t("menu_language")}
            >
              <span className="text-[16px] leading-none">{localeMeta.flag}</span>
              <span className="text-white text-[11px] font-semibold hidden xs:inline">
                {locale.toUpperCase()}
              </span>
            </button>

            {/* Hamburger menu button */}
            <button
              type="button"
              onClick={() => setShowMenu(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         text-white text-lg transition-colors
                         bg-white/15 border border-white/25
                         hover:bg-white/25 active:scale-95"
              aria-label="Open menu"
            >
              <SlMenu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Navigation popup ──────────────────────────────────────────── */}
      <Popup
        header=""
        toggle={showMenu}
        setToggle={setShowMenu}
        useMask
        hideReset
      >
        {/* User section */}
        <div className="flex items-center gap-4 px-1 pb-4 mb-1 border-b border-[#e5e7eb]">
          <div
            className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden
                       border-[3px] border-[#f0a500]
                       shadow-[0_2px_12px_rgba(240,165,0,0.3)]"
          >
            <Image
              src={authUser?.avatar || "/logo.png"}
              width={56}
              height={56}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className="font-extrabold text-[16px] text-[#111827] truncate"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {authUser?.display_name || "Guest"}
            </p>
            <p className="text-[12px] text-[#9ca3af] truncate mt-0.5">
              {authUser?.primary_email || ""}
            </p>
            <span
              className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold
                         bg-[#fef3cd] text-[#c88400] px-2 py-0.5 rounded-full
                         border border-[rgba(240,165,0,0.3)]"
            >
              🏆 {t("profile_top_agent")}
            </span>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-0.5 my-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                         hover:bg-[#e0f0f5] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center
                           text-[15px] flex-shrink-0 bg-[#e0f0f5] text-[#1e5f74]"
              >
                {item.icon}
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">
                {t(item.labelKey)}
              </span>
            </Link>
          ))}

          {/* Language selector row — opens picker, shows active flag + name */}
          <button
            type="button"
            onClick={() => { setShowMenu(false); openPicker(); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                       hover:bg-[#e0f0f5] transition-colors w-full text-left"
          >
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center
                         text-[18px] flex-shrink-0 bg-[#e0f0f5]"
            >
              {localeMeta.flag}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-[#111827]">
                {t("menu_language")}
              </span>
            </div>
            {/* Current locale badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "#e0f0f5", color: "#1e5f74" }}
            >
              {localeMeta.nativeName}
            </span>
          </button>
        </nav>

        {/* Footer actions */}
        <div className="flex gap-2 pt-3 border-t border-[#e5e7eb] mt-1">
          <Link
            href="/profile/edit"
            onClick={() => setShowMenu(false)}
            className="flex-1 py-2.5 rounded-xl text-center text-[13px] font-bold
                       bg-[#e0f0f5] text-[#1e5f74]"
          >
            ⚙️ {t("menu_edit_profile")}
          </Link>
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold
                       bg-[#fee2e2] text-[#ef4444]"
          >
            ✕ {t("common_close")}
          </button>
        </div>
      </Popup>
    </>
  );
};

export default Header;
