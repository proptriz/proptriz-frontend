'use client';

import React, { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmSheetProps {
  /** Controls visibility */
  open: boolean;
  /** Called when the user cancels or taps the backdrop */
  onClose: () => void;
  /** Called when the user confirms */
  onConfirm: () => void;

  // ── Content ──────────────────────────────────────────────────────────────
  /** Large emoji or icon shown at top. Default: "🗑️" */
  icon?:          string;
  /** Icon background color. Default: "#fff5f5" */
  iconBg?:        string;
  /** Bold heading text */
  title:          string;
  /** Descriptive body. Can be a string or JSX for inline <strong> etc. */
  description?:   React.ReactNode;

  // ── Confirm button ────────────────────────────────────────────────────────
  /** Confirm button label. Default: "Confirm" */
  confirmLabel?:  string;
  /** Confirm button bg color. Default: "#ef4444" (red/destructive) */
  confirmColor?:  string;
  /** Show a loading spinner + disable the button */
  loading?:       boolean;
  /** Loading label. Default: "Processing…" */
  loadingLabel?:  string;

  // ── Cancel button ─────────────────────────────────────────────────────────
  /** Cancel button label. Default: "Cancel" */
  cancelLabel?:   string;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span
      style={{
        display:       "inline-block",
        width:         16,
        height:        16,
        borderRadius:  "50%",
        border:        "2.5px solid rgba(255,255,255,0.35)",
        borderTopColor:"white",
        animation:     "cs-spin 0.75s linear infinite",
        flexShrink:    0,
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConfirmSheet({
  open,
  onClose,
  onConfirm,
  icon         = "🗑️",
  iconBg       = "#fff5f5",
  title,
  description,
  confirmLabel = "Confirm",
  confirmColor = "#ef4444",
  loading      = false,
  loadingLabel = "Processing…",
  cancelLabel  = "Cancel",
}: ConfirmSheetProps) {

  // Prevent body scroll while open — works even inside a page-scroll container
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return ()  => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* ── Keyframe for spinner ─────────────────────────────────────── */}
      <style>{`@keyframes cs-spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[200] flex items-end"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      >
        {/* ── Sheet ──────────────────────────────────────────────────── */}
        <div
          className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-4 duration-300"
          style={{ maxWidth: 640, margin: "0 auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#e5e7eb" }} />

          {/* Icon + text */}
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
              style={{ background: iconBg }}
            >
              {icon}
            </div>

            <h2
              className="text-[17px] font-black text-[#111827] mb-1"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {title}
            </h2>

            {description && (
              <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-xs">
                {description}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm
                         flex items-center justify-center gap-2
                         transition-all disabled:opacity-60"
              style={{ background: confirmColor }}
            >
              {loading ? (
                <>
                  <Spinner />
                  {loadingLabel}
                </>
              ) : (
                confirmLabel
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl text-[#4b5563] font-semibold
                         text-sm border border-[#e5e7eb] bg-white transition-all
                         disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
