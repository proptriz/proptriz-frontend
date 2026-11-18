import { interpolate } from '@/i18n/translations';

type T = (key: 'alerts_just_now' | 'alerts_ago_min' | 'alerts_ago_hour' | 'alerts_ago_day') => string;

export function relativeTime(iso: string, t: T, now = Date.now()): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 1) return t('alerts_just_now');
  if (mins < 60) return interpolate(t('alerts_ago_min'), { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return interpolate(t('alerts_ago_hour'), { n: hours });
  return interpolate(t('alerts_ago_day'), { n: Math.floor(hours / 24) });
}
