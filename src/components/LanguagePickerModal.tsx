"use client";

// src/components/LanguagePickerModal.tsx
//
// Full-screen-dimmed portal modal for selecting the app language.
// Triggered via useLanguage().openPicker() from anywhere in the app
// (NavMenu language row, profile settings, etc.)
//
// Design: matches PublishSuccessModal — same rounded card, same accent strip,
// same entry animation, z-[9999] portal.

import { useEffect, useState } from "react";
import { createPortal }        from "react-dom";
import { useLanguage }         from "@/i18n/LanguageContext";
import { LOCALE_META, type Locale } from "@/i18n/translations";

const LOCALES = Object.entries(LOCALE_META) as [Locale, typeof LOCALE_META[Locale]][];

export default function LanguagePickerModal() {
  const { locale, setLocale, t, pickerOpen, closePicker } = useLanguage();

  const [selected, setSelected] = useState<Locale>(locale);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Keep internal selection in sync when modal reopens
  useEffect(() => {
    if (pickerOpen) setSelected(locale);
  }, [pickerOpen, locale]);

  // Lock body scroll
  useEffect(() => {
    if (pickerOpen) {
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
  }, [pickerOpen]);

  const handleSave = () => {
    setLocale(selected);
    closePicker();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-black/55 backdrop-blur-[3px]
          transition-opacity duration-300
          ${pickerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closePicker}
      />

      {/* ── Modal card ────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("lang_picker_title")}
        className={`fixed inset-0 z-[9999]
          flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0
          transition-all duration-300
          ${pickerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`w-full max-w-[400px] bg-white rounded-[28px] overflow-hidden
            shadow-[0_24px_80px_rgba(0,0,0,0.22)]
            transition-transform duration-300 ease-out
            ${pickerOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* Accent strip */}
          <div className="h-1 bg-gradient-to-r from-[#143d4d] via-[#1e5f74] to-[#f0a500]" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="text-3xl mb-2">🌐</div>
            <h2
              className="text-[20px] font-black text-[#111827] leading-tight"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {t("lang_picker_title")}
            </h2>
            <p className="text-[12px] text-[#6b7280] mt-1">
              {t("lang_picker_subtitle")}
            </p>
          </div>

          {/* Language options */}
          <div className="px-4 pb-4 flex flex-col gap-2">
            {LOCALES.map(([code, meta]) => {
              const isActive = selected === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelected(code)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl
                             text-left transition-all duration-150 active:scale-[0.98]"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                          boxShadow:  "0 4px 16px rgba(30,95,116,0.35)",
                        }
                      : {
                          background: "#f9fafb",
                          border:     "1.5px solid #e5e7eb",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  }}
                >
                  {/* Flag */}
                  <span className="text-[28px] leading-none flex-shrink-0">
                    {meta.flag}
                  </span>

                  {/* Names */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] font-bold leading-tight"
                      style={{ color: isActive ? "white" : "#111827" }}
                    >
                      {meta.nativeName}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: isActive ? "rgba(255,255,255,0.65)" : "#9ca3af" }}
                    >
                      {meta.label}
                    </p>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center
                               justify-center flex-shrink-0"
                    style={
                      isActive
                        ? { borderColor: "#f0a500", background: "#f0a500" }
                        : { borderColor: "#d1d5db", background: "white" }
                    }
                  >
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#143d4d"
                          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="px-4 pb-6 flex gap-2">
            <button
              type="button"
              onClick={closePicker}
              className="flex-1 py-3 rounded-2xl text-[13px] font-semibold
                         transition-all active:scale-[0.98]"
              style={{
                background: "#f9fafb",
                border:     "1.5px solid #e5e7eb",
                color:      "#6b7280",
              }}
            >
              {t("lang_picker_cancel")}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-2xl text-white text-[13px] font-bold
                         transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                boxShadow:  "0 4px 16px rgba(30,95,116,0.35)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {t("lang_picker_save")}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
