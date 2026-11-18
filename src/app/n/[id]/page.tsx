'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { notificationsApi } from '@/services/notificationApi';
import { useLanguage } from '@/i18n/LanguageContext';

/**
 * Landing page for tracked alert links (https://proptriz.com/n/:id?c=push|email).
 * Records the open on the server, then goes to the stored destination.
 */
export default function TrackedLinkPage() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const channel = params.get('c') === 'email' ? 'email' : 'push';
    let cancelled = false;

    (async () => {
      let path = '/';
      try {
        const res = await notificationsApi.resolveTrackedLink(id, channel);
        // Only the path is used, so a bad value can never send the person off-site.
        const u = new URL(res.data.url);
        path = u.pathname + u.search + u.hash;
      } catch {
        // Fall back to the home page.
      }
      if (!cancelled) router.replace(path);
    })();

    return () => { cancelled = true; };
  }, [id, params, router]);

  return (
    <main className="w-full min-h-screen flex items-center justify-center text-sm text-gray-500">
      {t('alerts_link_opening')}
    </main>
  );
}
