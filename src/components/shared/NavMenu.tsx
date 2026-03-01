"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlMenu } from "react-icons/sl";
import Popup from "@/components/shared/Popup";
import { AppContext } from "@/context/AppContextProvider";

// ─── Menu items ───────────────────────────────────────────────────────────────
// Shared across Header and ProfileTransaction.
// Keep sorted by frequency of use.

const MENU_ITEMS = [
  { icon: "👤", title: "My Profile",         link: "/profile"              },
  { icon: "✏️", title: "Edit Profile",       link: "/profile/edit"         },
  { icon: "🏠", title: "List New Property",  link: "/property/add"         },
  { icon: "🤝", title: "Become an Agent",    link: "/profile/become-agent" },
  { icon: "🔒", title: "Privacy Policy",     link: "/privacy-policy"       },
  { icon: "📋", title: "Terms of Service",   link: "/terms-of-service"     },
  { icon: "❓", title: "FAQ",                link: "/profile/faq"          },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface NavMenuProps {
  /**
   * Override the avatar URL shown in the trigger button and inside the popup.
   * Falls back to authUser.avatar → "/logo.png".
   */
  avatarSrc?: string;

  /**
   * Override the display name shown inside the popup header.
   * Falls back to authUser.display_name → "Guest".
   */
  displayName?: string;

  /**
   * Override the email shown inside the popup header.
   * Falls back to authUser.primary_email → "".
   */
  email?: string;

  /**
   * Badge label shown on the user card.
   * Defaults to "Top Agent #1". Pass null to hide.
   */
  badge?: string | null;

  /**
   * Visual variant of the trigger button.
   *
   * "header"  (default) — plain hamburger icon, no avatar ring.
   *                        Used by Header on the teal nav bar.
   *
   * "profile" — avatar thumbnail + hamburger side by side.
   *             Used by ProfileTransaction's top bar.
   */
  variant?: "header" | "profile";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NavMenu({
  avatarSrc,
  displayName,
  email,
  badge = "🏆 Top Agent #1",
  variant = "header",
}: NavMenuProps) {
  const [open, setOpen]   = useState(false);
  const { authUser }      = useContext(AppContext);

  const resolvedAvatar      = avatarSrc    ?? authUser?.avatar       ?? "/logo.png";
  const resolvedDisplayName = displayName  ?? authUser?.display_name ?? "Guest";
  const resolvedEmail       = email        ?? authUser?.primary_email ?? "";

  return (
    <>
      {/* ── Trigger button ────────────────────────────────────────────── */}
      {variant === "profile" ? (
        /*
          Profile variant: avatar thumbnail + menu icon together.
          Used in ProfileTransaction's fixed header where the user is
          always authenticated and their avatar adds context.
        */
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex items-center gap-2 rounded-full
                     bg-white/15 border border-white/25 pl-1 pr-3 py-1
                     transition-colors hover:bg-white/25 active:scale-95"
        >
          {/* Avatar ring */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2"
            style={{ borderColor: "#f0a500" }}
          >
            <Image
              src={resolvedAvatar}
              width={32}
              height={32}
              alt={resolvedDisplayName}
              className="w-full h-full object-cover"
            />
          </div>
          <SlMenu size={14} className="text-white" />
        </button>
      ) : (
        /*
          Header variant: plain hamburger only.
          When the user is logged in we still add a subtle gold dot on
          the avatar to indicate the account is active — but keep it minimal.
        */
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="relative w-9 h-9 rounded-full flex items-center justify-center
                     text-white text-lg transition-colors
                     bg-white/15 border border-white/25
                     hover:bg-white/25 active:scale-95"
        >
          {/* Logged-in indicator dot */}
          {authUser && (
            <span
              className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: "#f0a500", borderColor: "#1e5f74" }}
            />
          )}
          <SlMenu size={16} />
        </button>
      )}

      {/* ── Navigation popup ──────────────────────────────────────────── */}
      <Popup header="" toggle={open} setToggle={setOpen} useMask hideReset>

        {/* User card */}
        <div className="flex items-center gap-4 px-1 pb-4 mb-1 border-b border-[#e5e7eb]">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex-shrink-0"
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-[3px]"
              style={{
                borderColor: "#f0a500",
                boxShadow:   "0 2px 12px rgba(240,165,0,0.3)",
              }}
            >
              <Image
                src={resolvedAvatar}
                width={56}
                height={56}
                alt={resolvedDisplayName}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block"
            >
              <p
                className="font-extrabold text-[16px] text-[#111827] truncate
                           hover:text-[#1e5f74] transition-colors"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                {resolvedDisplayName}
              </p>
            </Link>

            {resolvedEmail && (
              <p className="text-[12px] text-[#9ca3af] truncate mt-0.5">
                {resolvedEmail}
              </p>
            )}

            {badge && (
              <span
                className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold
                           bg-[#fef3cd] text-[#c88400] px-2 py-0.5 rounded-full
                           border border-[rgba(240,165,0,0.3)]"
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-0.5 my-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setOpen(false)}
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
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="flex gap-2 pt-3 border-t border-[#e5e7eb] mt-1">
          <Link
            href="/profile/edit"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 rounded-xl text-center text-[13px] font-bold
                       bg-[#e0f0f5] text-[#1e5f74]"
          >
            ⚙️ Manage Account
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold
                       bg-[#fee2e2] text-[#ef4444]"
          >
            ✕ Close
          </button>
        </div>
      </Popup>
    </>
  );
}
