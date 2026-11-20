'use client';
import { useContext, useEffect } from 'react';
import { AppContext } from '@/context/AppContextProvider';
import { useLanguage } from '@/i18n/LanguageContext';
import { listenForForegroundPush, registerPush } from '@/lib/pushNotifications';

export const ALERTS_CHANGED_EVENT = 'proptriz:alerts-changed';

const REFRESH_KEY = 'proptriz_push_refreshed_at';
const REFRESH_EVERY_MS = 12 * 60 * 60 * 1000;

/**
 * Mounted once for the whole app (renders nothing). For a signed-in person who
 * already allowed notifications it:
 *  - refreshes this browser's push registration at most twice a day, so the
 *    server keeps treating the device as live and picks up rotated tokens;
 *  - shows alerts that arrive while a tab is open, and tells the header badge
 *    to refresh.
 * It never shows a permission prompt; only the settings switch does that.
 */
export default function PushBootstrap() {
  const { authUser } = useContext(AppContext);
  const { locale } = useLanguage();

  useEffect(() => {
    if (!authUser) return;

    let last = 0;
    try { last = Number(localStorage.getItem(REFRESH_KEY) || 0); } catch { /* storage unavailable */ }

    if (Date.now() - last > REFRESH_EVERY_MS) {
      registerPush(locale, true)
        .then((res) => {
          if (res.token) {
            try { localStorage.setItem(REFRESH_KEY, String(Date.now())); } catch { /* ignore */ }
          }
        })
        .catch(() => undefined);
    }

    return listenForForegroundPush(() => window.dispatchEvent(new Event(ALERTS_CHANGED_EVENT)));
  }, [authUser, locale]);

  return null;
}
