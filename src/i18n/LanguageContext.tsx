"use client";

// src/i18n/LanguageContext.tsx
//
// Provides the active locale and translation helper to the entire app.
//
// Persistence priority (reading):
//   1. localStorage[STORAGE_KEY]           — fastest, survives refresh
//   2. User settings from the backend      — restored after login on new device
//   3. DEFAULT_LOCALE ("en")               — safe fallback
//
// Persistence on change:
//   1. Always writes to localStorage immediately (no flicker on next load)
//   2. For authenticated users, also PATCHes /api/users/settings in the background
//      (fire-and-forget — a failed network call must never break the UI)

import React, {
  createContext, useCallback, useContext,
  useEffect, useMemo, useRef, useState,
} from "react";

import {
  DEFAULT_LOCALE, STORAGE_KEY, TRANSLATIONS,
  type Locale, type Translations,
} from "./translations";

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  /** Currently active locale */
  locale: Locale;
  /** Translate a key to the active language */
  t: (key: keyof Translations) => string;
  /** Change locale, persist to localStorage and (if authed) to backend */
  setLocale: (locale: Locale) => void;
  /** Whether the language picker modal is open */
  pickerOpen: boolean;
  openPicker:  () => void;
  closePicker: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in TRANSLATIONS) return stored as Locale;
  } catch {
    // localStorage blocked (private mode / permissions) — ignore
  }
  return DEFAULT_LOCALE;
}

function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

/** Fire-and-forget backend sync — never throws into the call-site */
async function syncToBackend(locale: Locale): Promise<void> {
  try {
    await fetch("/api/users/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ locale }),
      // credentials: "include" — rely on existing cookie/session mechanism
    });
  } catch {
    // Network failure or unauthenticated — silently ignore.
    // The locale is already in localStorage so no data is lost.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  children:  React.ReactNode;
  /**
   * Pass the authenticated user's stored locale from the server (SSR / initial
   * auth fetch).  When provided it takes priority over localStorage on first
   * mount, keeping the server and client in sync.
   */
  serverLocale?: Locale | null;
  /** Whether the current user is authenticated (enables backend sync on change) */
  isAuthenticated?: boolean;
}

export function LanguageProvider({
  children,
  serverLocale,
  isAuthenticated = false,
}: LanguageProviderProps) {

  // Initialise from localStorage immediately so there's no visible flash.
  // If the server gave us an authenticated user's preference, honour that.
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (serverLocale && serverLocale in TRANSLATIONS) return serverLocale;
    return readStoredLocale();
  });

  const [pickerOpen, setPickerOpen] = useState(false);

  // When serverLocale arrives after mount (e.g. after auth resolves), sync up
  const prevServerLocale = useRef<Locale | null | undefined>(undefined);
  useEffect(() => {
    if (
      serverLocale &&
      serverLocale in TRANSLATIONS &&
      serverLocale !== prevServerLocale.current
    ) {
      prevServerLocale.current = serverLocale;
      setLocaleState(serverLocale);
      writeStoredLocale(serverLocale);
    }
  }, [serverLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(next);
    if (isAuthenticated) {
      syncToBackend(next); // fire-and-forget
    }
  }, [isAuthenticated]);

  const t = useCallback(
    (key: keyof Translations): string =>
      TRANSLATIONS[locale][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key,
    [locale],
  );

  const openPicker  = useCallback(() => setPickerOpen(true),  []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, t, setLocale, pickerOpen, openPicker, closePicker }),
    [locale, t, setLocale, pickerOpen, openPicker, closePicker],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() must be used inside <LanguageProvider>.");
  }
  return ctx;
}
