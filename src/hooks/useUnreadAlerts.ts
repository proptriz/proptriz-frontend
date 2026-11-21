'use client';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContextProvider';
import { notificationsApi } from '@/services/notificationApi';

const POLL_MS = 60_000;
const ALERTS_CHANGED_EVENT = 'proptriz:alerts-changed';

/** Unread alert count for the header badge. Polls while the tab is visible. */
export function useUnreadAlerts() {
  const { authUser } = useContext(AppContext);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!authUser) { setCount(0); return; }
    try {
      const res = await notificationsApi.getUnreadCount();
      setCount(res.data?.unreadCount ?? 0);
    } catch {
      // A badge is not worth an error message.
    }
  }, [authUser]);

  useEffect(() => {
    refresh();
    if (!authUser) return;
    const tick = () => { if (document.visibilityState === 'visible') refresh(); };
    const timer = setInterval(tick, POLL_MS);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener(ALERTS_CHANGED_EVENT, refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener(ALERTS_CHANGED_EVENT, refresh);
    };
  }, [authUser, refresh]);

  return { count, refresh, setCount };
}
