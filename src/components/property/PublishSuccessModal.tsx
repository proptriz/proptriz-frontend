"use client";

import { useEffect, useState } from "react";
import { createPortal }        from "react-dom";
import { useRouter }           from "next/navigation";

interface PublishSuccessModalProps {
  isOpen:        boolean;
  propertyId:    string;
  propertyTitle: string;
  /** Called when the modal should close (parent sets isOpen = false) */
  onClose:       () => void;
}

interface Action {
  icon:     string;
  label:    string;
  sub:      string;
  onClick:  () => void;
  primary?: boolean;
}

export default function PublishSuccessModal({
  isOpen,
  propertyId,
  propertyTitle,
  onClose,
}: PublishSuccessModalProps) {
  const router              = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll while open
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

  // ── Close then navigate ─────────────────────────────────────────────────────
  // Always call onClose() BEFORE any router call so the parent unmounts / hides
  // the modal immediately, regardless of the navigation target.

  const actions: Action[] = [
    {
      icon:    "🏠",
      label:   "List Another Property",
      sub:     "Start a new listing from scratch",
      primary: true,
      // Wizard state is already reset before the modal opens (handleSubmit).
      // Just close — no navigation: we're already on /property/add and
      // router.replace on the same URL triggers a remount that re-initialises
      // successModal from useState(false), causing a flicker / race.
      onClick: () => onClose(),
    },
    {
      icon:    "👁️",
      label:   "View Your Listing",
      sub:     "See how it looks to buyers",
      onClick: () => { onClose(); router.push(`/property/details/${propertyId}`); },
    },
    {
      icon:    "👤",
      label:   "Go to Profile",
      sub:     "Manage all your listings",
      onClick: () => { onClose(); router.push("/profile"); },
    },
    {
      icon:    "🏡",
      label:   "Back to Home",
      sub:     "Browse the marketplace",
      onClick: () => { onClose(); router.push("/"); },
    },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-black/55 backdrop-blur-[3px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Property published"
        className={`fixed inset-0 z-[9999]
          flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0
          transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`w-full max-w-[420px] bg-white rounded-[28px] overflow-hidden
            shadow-[0_24px_80px_rgba(0,0,0,0.22)]
            transition-transform duration-300 ease-out
            ${isOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        >
          {/* Accent strip */}
          <div className="h-1 bg-gradient-to-r from-[#143d4d] via-[#1e5f74] to-[#f0a500]" />

          {/* Hero */}
          <div
            className="px-6 pt-8 pb-6 flex flex-col items-center text-center"
            style={{ background: "linear-gradient(180deg,#f0fdf4 0%,white 100%)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
              style={{
                background: "linear-gradient(135deg,#e0f0f5 0%,#c5dde6 100%)",
                boxShadow:  "0 0 0 8px rgba(30,95,116,0.08),0 8px 32px rgba(30,95,116,0.2)",
              }}
            >
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "#f0a500" }} />
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M5 13l4 4L19 7" stroke="#1e5f74" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="text-[22px] font-black text-[#111827] leading-tight mb-1"
              style={{ fontFamily: "'Raleway', sans-serif" }}>
              Property Published! 🎉
            </h2>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-1 mb-2"
              style={{ background: "#e0f0f5" }}>
              <span className="text-[11px] font-bold text-[#1e5f74] truncate max-w-[240px]">
                📍 {propertyTitle || "Your new listing"}
              </span>
            </div>

            <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[280px]">
              Your property is now live and visible to buyers and renters across PropTriz.
            </p>
          </div>

          <div className="mx-5 h-px bg-[#e5e7eb]" />

          {/* Actions */}
          <div className="px-4 py-4 flex flex-col gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                           text-left transition-all duration-150 active:scale-[0.98]"
                style={action.primary
                  ? { background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                      boxShadow:  "0 4px 16px rgba(30,95,116,0.35)" }
                  : { background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
                onMouseEnter={(e) => {
                  if (!action.primary)
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                }}
                onMouseLeave={(e) => {
                  if (!action.primary)
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: action.primary ? "rgba(255,255,255,0.15)" : "#e0f0f5" }}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold leading-tight"
                    style={{ color: action.primary ? "white" : "#111827" }}>
                    {action.label}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-tight"
                    style={{ color: action.primary ? "rgba(255,255,255,0.65)" : "#9ca3af" }}>
                    {action.sub}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  className="flex-shrink-0"
                  style={{ opacity: action.primary ? 0.7 : 0.35 }}>
                  <path d="M9 18l6-6-6-6"
                    stroke={action.primary ? "white" : "#111827"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 pb-5">
            <span className="text-[11px] font-semibold" style={{ color: "#9ca3af" }}>
              Listed on
            </span>
            <span className="text-[11px] font-black"
              style={{ fontFamily: "'Raleway', sans-serif", color: "#143d4d" }}>
              <span style={{ color: "#f0a500" }}>Prop</span>Triz
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
