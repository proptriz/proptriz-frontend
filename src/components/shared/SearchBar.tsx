'use client';

import React, { useState, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { LuSlidersHorizontal } from "react-icons/lu";
import Popup from "./Popup";
import PropertyFilter from "../property/PropertyFilter";
import { PropertyFilterPayload } from "@/types/property";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchBarProps = {
  value:              string;
  onChange:           (value: string) => void;
  onSearch:           () => void;
  onFilter:           (filters: PropertyFilterPayload) => void;
  activeFilterCount?: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onFilter,
  activeFilterCount = 0,
}) => {
  const { t }                                             = useLanguage();
  const [togglePopup, setTogglePopup]                     = useState(false);
  const [showRecentSearch, setShowRecentSearch]           = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { onSearch(); setShowRecentSearch(false); }
    if (e.key === "Escape") { setShowRecentSearch(false); }
  };

  const handleBlur = useCallback(() => {
    blurTimerRef.current = setTimeout(() => setShowRecentSearch(false), 150);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setShowRecentSearch(true);
  }, []);

  const handleRecentSelect = useCallback(
    (query: string) => {
      onChange(query);
      setShowRecentSearch(false);
      onSearch();
    },
    [onChange, onSearch],
  );

  // ── Stubbed recent searches ─────────────────────────────────────────────────
  const recentSearches = [
    { query: "3-bed apartment Lekki",            time: "2m ago"    },
    { query: "Commercial space Victoria Island", time: "1h ago"    },
    { query: "Houses near Ikeja",                time: "Yesterday" },
  ];

  return (
    <>
      <div className="w-full relative">

        {/* ── Search input ─────────────────────────────────────────────── */}
        <div
          className="flex items-center bg-white rounded-2xl
                     shadow-[0_4px_20px_rgba(0,0,0,0.14)] px-3 py-2 gap-2"
        >
          <FiSearch className="text-[#9ca3af] flex-shrink-0" size={15} />

          <input
            type="text"
            placeholder={t("home_search_hint")}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 bg-transparent outline-none text-sm text-[#111827]
                       placeholder:text-[#9ca3af] min-w-0"
            aria-label={t("home_search_hint")}
          />

          <div className="w-px h-5 bg-[#e5e7eb] flex-shrink-0" />

          {/* Filter button — label is always "Filter" (recognisable icon-led UX) */}
          <button
            type="button"
            onClick={() => setTogglePopup((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold
                        transition-all duration-200 flex-shrink-0
                        ${togglePopup
                          ? "text-white"
                          : "bg-[#e0f0f5] text-[#1e5f74] hover:bg-[#b8dde8]"
                        }`}
            style={togglePopup
              ? { background: "linear-gradient(135deg,#143d4d,#1e5f74)" }
              : undefined}
            aria-label="Open filters"
          >
            <LuSlidersHorizontal size={13} />
            Filter
            {activeFilterCount > 0 && (
              <span
                className="min-w-[16px] h-4 rounded-full bg-[#f0a500] text-[#111]
                           text-[9px] font-extrabold flex items-center justify-center px-1"
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search submit */}
          <button
            type="button"
            onClick={() => { onSearch(); setShowRecentSearch(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       text-white flex-shrink-0
                       hover:shadow-[0_4px_14px_rgba(30,95,116,0.4)]
                       transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
            aria-label="Search"
          >
            <FiSearch size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Recent searches dropdown ──────────────────────────────────── */}
        {showRecentSearch && recentSearches.length > 0 && (
          <div
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50
                       bg-white rounded-2xl border border-[#e5e7eb]
                       shadow-[0_8px_28px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.6px]">
                Recent Searches
              </p>
            </div>
            {recentSearches.map((item, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => handleRecentSelect(item.query)}
                className="w-full flex items-center gap-3 px-4 py-2.5
                           hover:bg-[#f7f8fa] transition-colors text-left"
              >
                <span className="text-[#9ca3af] text-sm flex-shrink-0">🕐</span>
                <span className="flex-1 text-sm text-[#111827] font-medium truncate">
                  {item.query}
                </span>
                <span className="text-[10px] text-[#9ca3af] flex-shrink-0">
                  {item.time}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Filter popup ─────────────────────────────────────────────────── */}
      <Popup
        header="Filter Properties"
        toggle={togglePopup}
        setToggle={setTogglePopup}
        useMask
        hideReset={false}
      >
        <PropertyFilter onFilter={onFilter} setTogglePopup={setTogglePopup} />
      </Popup>
    </>
  );
};

export default SearchBar;
