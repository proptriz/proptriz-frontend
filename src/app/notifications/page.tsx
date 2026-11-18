'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Splash from '@/components/shared/Splash';
import { useAuth } from '@/context/AppContextProvider';
import { useLanguage } from '@/i18n/LanguageContext';
import { notificationsApi } from '@/services/notificationApi';
import { relativeTime } from '@/lib/relativeTime';
import { IInboxItem } from '@/types';

const TYPE_ICON: Record<string, string> = {
  new_listing: '🏠', listing_change: '✏️', enquiry: '💬', expiring: '⏳',
  review: '⭐', agent_report: '📊', demand: '📈', system: '🔔',
};

/** Alert links point at the public site; inside the app we follow just the path. */
function toPath(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search + u.hash;
  } catch {
    return '/';
  }
}

export default function NotificationsInboxPage() {
  const { authUser } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<IInboxItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async (next?: string | null) => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await notificationsApi.listInbox(next);
      setItems((prev) => (next ? [...prev, ...res.data.items] : res.data.items));
      setCursor(res.data.nextCursor);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authUser) load(); }, [authUser, load]);

  const markAll = async () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    try { await notificationsApi.markRead({ all: true }); } catch { load(); }
  };

  const openItem = (item: IInboxItem) => {
    if (!item.read) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, read: true } : i)));
      notificationsApi.recordInboxOpen(item.id).catch(() => {});
    }
  };

  if (!authUser) return <Splash showFooter />;

  const hasUnread = items.some((i) => !i.read);

  return (
    <main
      className="w-full h-full md:max-w-[650px] mx-auto pb-10"
      style={{ background: '#f5f7f9', fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-[#143d4d]" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {t('alerts_inbox_title')}
          </h1>
          <div className="flex items-center gap-3">
            {hasUnread && (
              <button type="button" onClick={markAll} className="text-xs font-semibold text-[#1e5f74]">
                {t('alerts_mark_all_read')}
              </button>
            )}
            <Link href="/profile/notifications" className="text-xs font-semibold text-[#1e5f74]">
              {t('alerts_settings_link')}
            </Link>
          </div>
        </div>

        {failed && <p className="text-sm text-red-500 mb-3">{t('alerts_error')}</p>}

        {!loading && !failed && items.length === 0 && (
          <p className="text-sm text-gray-500 py-10 text-center">{t('alerts_inbox_empty')}</p>
        )}

        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={toPath(item.url)}
                onClick={() => openItem(item)}
                className="flex gap-3 rounded-xl p-3 bg-white border"
                style={{ borderColor: item.read ? '#e5e7eb' : '#f0a500' }}
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#e0f0f5] flex-shrink-0">
                  {TYPE_ICON[item.type] ?? '🔔'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`text-[13px] text-[#111827] truncate ${item.read ? 'font-medium' : 'font-bold'}`}>
                      {item.title}
                    </span>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-[#f0a500] flex-shrink-0" />}
                  </span>
                  <span className="block text-xs text-gray-600 mt-0.5 line-clamp-2">{item.body}</span>
                  <span className="block text-[11px] text-gray-400 mt-1">{relativeTime(item.createdAt, t)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {loading && <p className="text-sm text-gray-400 text-center py-4">{t('alerts_loading')}</p>}

        {!loading && cursor && (
          <button
            type="button"
            onClick={() => load(cursor)}
            className="w-full mt-3 rounded-xl py-2.5 text-sm font-semibold border border-[#1e5f74] text-[#1e5f74]"
          >
            {t('alerts_load_more')}
          </button>
        )}
      </div>
    </main>
  );
}
