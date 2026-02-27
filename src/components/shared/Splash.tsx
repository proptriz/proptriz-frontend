"use client";

import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContextProvider";
import Footer from "./Footer";
import GoogleLoginButton from "../GoogleLoginButton";
import { BrandLogo } from "@/components/shared/BrandLogo";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  auto_login:             "Checking session…",
  pi_sdk_loading:         "Loading Pi SDK…",
  pi_authenticating:      "Authenticating with Pi…",
  backend_authenticating: "Verifying identity…",
  authenticated:          "Signed in! Redirecting…",
  timeout:                "Connection timed out",
  failed:                 "Login failed — please retry",
};

export default function Splash({ showFooter = false }: { showFooter?: boolean }) {
  const { isSigningInUser, authenticateUser, loginStage } = useContext(AppContext);

  const stageLabel = loginStage
    ? (STAGE_LABELS[loginStage] ?? loginStage.replace(/_/g, " "))
    : null;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(160deg,#f5f7f9 0%,#eaf2f5 55%,#f5f7f9 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <main className="flex-grow flex items-center justify-center p-4">

        {/* ── Signing-in loading state ───────────────────────────────── */}
        {isSigningInUser ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">

            {/* Pulsing stacked logo */}
            <div style={{ animation: "splashPulse 1.6s ease-in-out infinite" }}>
              <BrandLogo variant="stacked" theme="dark" size={88} />
            </div>

            {/* Spinner + stage badge */}
            {stageLabel && (
              <div className="flex flex-col items-center gap-3">
                <div
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: "3px solid #e0f0f5",
                    borderTopColor: "#1e5f74",
                    animation: "spin 0.85s linear infinite",
                  }}
                />
                <span
                  className="px-4 py-1.5 rounded-full text-[11px] font-bold
                             uppercase tracking-wider text-white"
                  style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
                >
                  {stageLabel}
                </span>
              </div>
            )}
          </div>

        ) : (
          /* ── Login card ─────────────────────────────────────────────── */
          <div
            className="w-full max-w-md animate-in fade-in zoom-in duration-500"
            style={{
              background: "white",
              borderRadius: 28,
              padding: "36px 28px 28px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 20px 64px rgba(30,95,116,0.12), 0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            {/* Brand header — stacked: logo + wordmark + tagline */}
            <div className="flex flex-col items-center mb-9">
              <BrandLogo variant="stacked" theme="dark" size={76} />

              {stageLabel && (
                <span
                  className="mt-5 px-4 py-1.5 rounded-full text-[11px] font-bold
                             uppercase tracking-wider text-white"
                  style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
                >
                  {stageLabel}
                </span>
              )}
            </div>

            {/* Login options */}
            <div className="flex flex-col gap-4">

              {/* Google */}
              <div className="flex justify-center w-full transition-transform active:scale-[0.98]">
                <GoogleLoginButton />
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-[#f0f0f0]" />
                <span
                  style={{
                    flexShrink: 0, margin: "0 14px",
                    fontSize: 10, fontWeight: 900,
                    color: "#9ca3af", textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  or
                </span>
                <div className="flex-grow border-t border-[#f0f0f0]" />
              </div>

              {/* Pi Network */}
              <div
                style={{
                  borderRadius: 18,
                  border: "1.5px solid #e5e7eb",
                  background: "#fafcff",
                  padding: "18px 16px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1e5f74";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(30,95,116,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className="flex flex-col items-center gap-4 text-center">

                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{
                      background: "#e0f0f5", color: "#1e5f74",
                      fontSize: 11, fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: "#1e5f74" }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ background: "#1e5f74" }}
                      />
                    </span>
                    Required: Pi Browser
                  </div>

                  <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                    To use your Pi Wallet and Identity, you{" "}
                    <strong style={{ color: "#111827" }}>must</strong> be browsing
                    within the{" "}
                    <strong style={{ color: "#111827" }}>Pi Browser</strong> app.
                  </p>

                  <button
                    onClick={() => authenticateUser()}
                    disabled={isSigningInUser}
                    className="w-full flex items-center justify-center gap-2.5
                               transition-all duration-200 active:scale-[0.98]
                               disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      padding: "13px 20px", borderRadius: 14,
                      background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                      color: "white", fontSize: 14, fontWeight: 800,
                      boxShadow: "0 4px 18px rgba(30,95,116,0.35)",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    <Image
                      src="/pi_logo.png"
                      alt="Pi Network"
                      width={20}
                      height={20}
                      className="opacity-90 flex-shrink-0"
                    />
                    {isSigningInUser ? "Connecting to Pi…" : "Continue with Pi Network"}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center" style={{ fontSize: 12, color: "#9ca3af" }}>
              Trouble signing in?{" "}
              <span
                className="font-semibold cursor-pointer hover:underline"
                style={{ color: "#1e5f74" }}
              >
                Get Help
              </span>
            </p>
          </div>
        )}
      </main>

      {showFooter && (
        <footer className="pb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Footer />
        </footer>
      )}

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(0.92); opacity: 0.82; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}