"use client";

import { useEffect, useRef, useCallback, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopupProps {
  /** Title shown in the sticky header */
  header: string;
  /** Controls open/close state */
  toggle: boolean;
  /** State setter to open/close the sheet */
  setToggle: (value: boolean) => void;
  /** Optional callback fired after the sheet closes (for cleanup / navigation) */
  onClose?: () => void;
  /** Clicking the backdrop closes the sheet (default: true) */
  useMask?: boolean;
  /** Hide the reset button (default: false) */
  hideReset?: boolean;
  /** Called when the reset button is clicked */
  onReset?: () => void;
  /** Label for the reset button (default: "Reset") */
  resetLabel?: string;
  /** Children rendered inside the scrollable body */
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_CLOSE_THRESHOLD   = 90;  // px downward
const SWIPE_VELOCITY_MIN      = 0.3; // px/ms — prevent accidental slow-drag close
const SWIPE_HORIZONTAL_TOL    = 60;  // px — ignore sideways swipes

// ─── Component ────────────────────────────────────────────────────────────────

export default function Popup({
  header,
  toggle,
  setToggle,
  onClose,
  useMask = true,
  hideReset = false,
  onReset,
  resetLabel = "Reset",
  children,
}: PopupProps) {
  const { t } = useLanguage();
  // Portal mount guard — createPortal needs the DOM to exist (SSR safe)
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const startY    = useRef<number | null>(null);
  const startX    = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const endY      = useRef<number | null>(null);
  const endX      = useRef<number | null>(null);

  // ── Lock body scroll when open ─────────────────────────────────────────────
  useEffect(() => {
    if (toggle) {
      document.body.style.overflow    = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow    = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow    = "";
      document.body.style.touchAction = "";
    };
  }, [toggle]);

  // ── Close helper (calls both setToggle + optional onClose) ────────────────
  const close = useCallback(() => {
    setToggle(false);
    onClose?.();
  }, [setToggle, onClose]);

  // ── Keyboard: Escape closes the sheet ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toggle) close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggle, close]);

  // ── Swipe-to-close handlers ────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!toggle) return;
    startY.current    = e.touches[0].clientY;
    startX.current    = e.touches[0].clientX;
    startTime.current = Date.now();
    endY.current      = null;
    endX.current      = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!toggle) return;
    endY.current = e.touches[0].clientY;
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!toggle) return;
    if (startY.current === null || endY.current === null || startTime.current === null) return;

    const deltaY    = endY.current - startY.current;
    const deltaX    = startX.current !== null && endX.current !== null
                        ? Math.abs(endX.current - startX.current)
                        : 0;
    const elapsed   = Date.now() - startTime.current;
    const velocity  = Math.abs(deltaY) / elapsed; // px/ms

    const isDownSwipe  = deltaY > SWIPE_CLOSE_THRESHOLD;
    const isMostlyVert = deltaX < SWIPE_HORIZONTAL_TOL;
    const isFastEnough = velocity >= SWIPE_VELOCITY_MIN;

    if (isDownSwipe && isMostlyVert && isFastEnough) close();
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`
          fixed inset-0 z-[9998] bg-black/45 backdrop-blur-[2px]
          transition-opacity duration-300
          ${toggle ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => useMask && close()}
      />

      {/* ── Bottom Sheet ──────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={header}
        className={`
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full md:max-w-[650px]
          rounded-t-[26px] overflow-hidden
          z-[9999]
          shadow-[0_-8px_40px_rgba(0,0,0,0.16)]
          transition-transform duration-300 ease-out
          ${toggle ? "translate-y-0" : "translate-y-full"}
        `}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gradient accent strip */}
        <div className="h-1 bg-gradient-to-r from-[#143d4d] via-[#1e5f74] to-[#f0a500]" />

        {/* Scrollable body */}
        <div className="bg-white h-[calc(100vh-150px)] overflow-y-auto overscroll-contain px-5 pb-8">

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-[5px] rounded-full bg-gray-300" />
          </div>

          {/* Sticky header */}
          <div className="sticky top-0 bg-white pt-2.5 pb-3 z-10 border-b border-gray-100 mb-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-[Raleway] font-extrabold text-[17px] text-[#111827] leading-tight">
                {header}
              </p>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Reset button */}
                {!hideReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="
                      px-3.5 py-1.5 rounded-full
                      bg-[#e0f0f5] text-[#1e5f74]
                      text-xs font-semibold
                      hover:bg-[#b8dde8] transition-colors
                      flex items-center gap-1
                    "
                  >
                    <span className="text-sm leading-none">↺</span>
                    {t("filter_reset")}
                  </button>
                )}

                {/* Close button */}
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="
                    w-[30px] h-[30px] rounded-full
                    bg-gray-100 text-gray-500
                    flex items-center justify-center
                    text-sm font-medium
                    hover:bg-gray-200 transition-colors
                  "
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}