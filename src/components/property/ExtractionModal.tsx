"use client";

import { useEffect, useState } from "react";
import { createPortal }        from "react-dom";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractionPhase =
  | "idle"
  | "geocoding"    // resolving address → coordinates via Nominatim
  | "extracting"   // calling the AI backend
  | "done"
  | "error";

interface ExtractionModalProps {
  isOpen:   boolean;
  phase:    ExtractionPhase;
  /** The user-supplied address being geocoded (shown in the geocoding step) */
  address?: string;
  /** Error message shown when phase === "error" */
  error?:   string;
  /** Called when the user taps "Try Again" on the error screen */
  onRetry:  () => void;
  /** Called when the user taps "Cancel" — only available during extraction */
  onCancel: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const STEPS: { phase: ExtractionPhase; icon: string; label: string; sub: string }[] = [
  {
    phase: "geocoding",
    icon:  "📍",
    label: "Resolving location",
    sub:   "Looking up coordinates from your address",
  },
  {
    phase: "extracting",
    icon:  "✨",
    label: "Extracting property details",
    sub:   "AI is reading your description — usually 15–30 s",
  },
  {
    phase: "done",
    icon:  "✅",
    label: "Done!",
    sub:   "Your listing details are ready to review",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ExtractionModal({
  isOpen,
  phase,
  address,
  error,
  onRetry,
  onCancel,
}: ExtractionModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!mounted) return null;

  const isError = phase === "error";
  const isDone  = phase === "done";

  // Index of the currently active step
  const activeIdx = STEPS.findIndex((s) => s.phase === phase);

  return createPortal(
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[3px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── Modal card ───────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Extracting property details"
        className={`fixed inset-0 z-[9999]
          flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0
          transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`w-full max-w-[400px] bg-white rounded-[28px] overflow-hidden
            shadow-[0_24px_80px_rgba(0,0,0,0.22)]
            transition-transform duration-300 ease-out
            ${isOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        >
          {/* Accent strip — gold while working, red on error, teal on done */}
          <div
            className="h-1"
            style={{
              background: isError
                ? "linear-gradient(90deg,#ef4444,#dc2626)"
                : isDone
                ? "linear-gradient(90deg,#1e5f74,#f0a500)"
                : "linear-gradient(90deg,#143d4d,#1e5f74,#f0a500)",
            }}
          />

          {/* ── Hero icon ─────────────────────────────────────────────────────── */}
          <div
            className="flex flex-col items-center pt-8 pb-5 px-6"
            style={{
              background: isError
                ? "linear-gradient(180deg,#fff5f5 0%,white 100%)"
                : isDone
                ? "linear-gradient(180deg,#f0fdf4 0%,white 100%)"
                : "linear-gradient(180deg,#e0f0f5 0%,white 100%)",
            }}
          >

            {/* ── Sparkle animation for ref ──────────────────────────────────── */}
            {/* <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                    background: "linear-gradient(135deg,#143d4d,#1e5f74)",
                    boxShadow:  "0 4px 16px rgba(30,95,116,0.28)",
                }}
                >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative">
                    <div
                    className="absolute inset-0 rounded-full border-[2.5px] animate-spin"
                    style={{ borderColor: "transparent", borderTopColor: "#f0a500" }}
                    />
                    <Sparkle size={13} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-bold leading-tight">{progress}</p>
                    <p className="text-white/55 text-[11px] mt-0.5">
                    Powered by Llama 3 · usually 15–30 seconds
                    </p>
                </div>
            </div> */}

            {/* Animated icon circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative mb-4"
              style={{
                background: isError
                  ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                  : isDone
                  ? "linear-gradient(135deg,#e0f0f5,#c5dde6)"
                  : "linear-gradient(135deg,#1e5f74,#143d4d)",
                boxShadow: isError
                  ? "0 0 0 8px rgba(239,68,68,0.08),0 8px 32px rgba(239,68,68,0.2)"
                  : "0 0 0 8px rgba(30,95,116,0.08),0 8px 32px rgba(30,95,116,0.2)",
              }}
            >
              {/* Spinning ring — only while working */}
              {!isError && !isDone && (
                <div
                  className="absolute inset-0 rounded-full border-[3px] animate-spin"
                  style={{ borderColor: "rgba(240,165,0,0.25)", borderTopColor: "#f0a500" }}
                />
              )}

              {/* Pulsing ring — done state */}
              {isDone && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ background: "#f0a500" }} />
              )}

              {/* Icon */}
              <span className="relative z-10 text-3xl leading-none select-none">
                {isError ? "⚠️" : isDone ? "✨" : "🤖"}
              </span>
            </div>

            {/* Title + subtitle */}
            <h2
              className="text-[20px] font-black text-center leading-tight mb-1"
              style={{
                fontFamily: "'Raleway', sans-serif",
                color: isError ? "#ef4444" : "#111827",
              }}
            >
              {isError ? "Extraction Failed"
               : isDone  ? "Details Extracted! ✨"
               : "Analysing Your Property"}
            </h2>
            <p className="text-[12px] text-center leading-relaxed"
              style={{ color: isError ? "#ef4444" : "#6b7280", maxWidth: 280 }}>
              {isError
                ? (error ?? "Something went wrong. Please try again.")
                : isDone
                ? "Review and edit the details before publishing."
                : "Hang tight — AI is filling your listing form…"}
            </p>
          </div>

          {/* ── Progress steps (shown while working or done, not on error) ───── */}
          {!isError && (
            <div className="px-5 pb-4">
              <div className="flex flex-col gap-2">
                {STEPS.map((step, idx) => {
                  const isActive   = step.phase === phase;
                  const isComplete = isDone || (activeIdx > idx);
                  const isPending  = !isActive && !isComplete;

                  return (
                    <div
                      key={step.phase}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300"
                      style={{
                        background: isActive   ? "linear-gradient(135deg,#e0f0f5,#f0f9fc)"
                                  : isComplete ? "#f9fafb"
                                  : "transparent",
                        border: isActive
                          ? "1.5px solid rgba(30,95,116,0.2)"
                          : isComplete
                          ? "1.5px solid #e5e7eb"
                          : "1.5px solid transparent",
                      }}
                    >
                      {/* Step indicator */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isComplete ? "#f0a500"
                                    : isActive   ? "#1e5f74"
                                    : "#e5e7eb",
                        }}
                      >
                        {isActive ? (
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="white" strokeWidth="3" />
                            <path className="opacity-90" fill="white"
                              d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : isComplete ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#143d4d"
                              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700 }}>
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] font-bold leading-tight"
                          style={{
                            color: isActive   ? "#1e5f74"
                                 : isComplete ? "#111827"
                                 : "#9ca3af",
                          }}
                        >
                          {step.label}
                        </p>
                        {isActive && (
                          <p className="text-[10px] mt-0.5 leading-tight"
                            style={{ color: "#6b7280" }}>
                            {step.phase === "geocoding" && address
                              ? `Looking up "${address.slice(0, 32)}${address.length > 32 ? "…" : ""}"`
                              : step.sub}
                          </p>
                        )}
                        {isComplete && (
                          <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>
                            Complete
                          </p>
                        )}
                      </div>

                      {/* Emoji */}
                      {!isActive && (
                        <span className="text-base flex-shrink-0" style={{ opacity: isPending ? 0.3 : 1 }}>
                          {step.icon}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Actions ────────────────────────────────────────────────────────── */}
          <div className="px-4 pb-6 flex flex-col gap-2">
            {isError && (
              <>
                {/* Retry */}
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3.5 rounded-2xl text-white text-[14px] font-bold
                             flex items-center justify-center gap-2
                             transition-all active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#143d4d,#1e5f74)",
                    boxShadow:  "0 4px 16px rgba(30,95,116,0.35)",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  ↺ Try Again
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-3 rounded-2xl text-[13px] font-semibold
                             transition-all active:scale-[0.98]"
                  style={{
                    background: "#f9fafb",
                    border:     "1.5px solid #e5e7eb",
                    color:      "#6b7280",
                  }}
                >
                  Cancel
                </button>
              </>
            )}

            {/* Cancel while working */}
            {!isError && !isDone && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3 rounded-2xl text-[13px] font-semibold
                           transition-all active:scale-[0.98]"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border:     "1.5px solid rgba(239,68,68,0.2)",
                  color:      "#dc2626",
                }}
              >
                Cancel extraction
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}