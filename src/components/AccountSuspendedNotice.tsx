"use client";

// Shown once the server reports this account as suspended. By then the person
// has already been signed out (AppContextProvider); this explains why.
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AppContextProvider";
import { useLanguage } from "@/i18n/LanguageContext";

const SUPPORT_EMAIL = "info@proptriz.com";

export default function AccountSuspendedNotice() {
  const { accountSuspended, dismissAccountSuspended } = useAuth();
  const { t } = useLanguage();
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!accountSuspended) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismissAccountSuspended();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountSuspended, dismissAccountSuspended]);

  if (!accountSuspended) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="suspended-title"
        aria-describedby="suspended-body"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl" aria-hidden>
          🚫
        </div>
        <h2 id="suspended-title" className="text-lg font-bold text-[#143d4d]">{t("suspended_title")}</h2>
        <p id="suspended-body" className="mt-2 text-sm text-gray-600">{t("suspended_body")}</p>
        <p className="mt-3 text-xs text-gray-500">
          {t("suspended_contact")}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#1e5f74] underline">{SUPPORT_EMAIL}</a>
        </p>
        <button
          ref={okRef}
          type="button"
          onClick={dismissAccountSuspended}
          className="mt-5 w-full rounded-xl bg-[#164e66] py-2.5 text-sm font-semibold text-white hover:bg-[#123f53]"
        >
          {t("suspended_ok")}
        </button>
      </div>
    </div>
  );
}
