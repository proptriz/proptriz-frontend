'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AppContextProvider';
import { registerPush, getEnvironmentInfo, PushSupport, PushFailure } from '@/lib/pushNotifications';
import logger from "../../logger.config.mjs";
import { notificationsApi } from '@/services/notificationApi';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { INotificationSettings, SwitchableAlertType } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Locale } from '@/i18n/translations';

// ─── Types ────────────────────────────────────────────────────────────────────

type ChannelId = 'email' | 'push' | 'whatsapp';
type PushPermState = 'granted' | 'denied' | 'default' | 'unsupported';

interface ChannelMeta {
  id: ChannelId;
  label: string;
  description: string;
  icon: string;
}

const CHANNELS: ChannelMeta[] = [
  { id: 'email',    label: 'Email',    description: 'Get alerts sent to your inbox',        icon: '✉️' },
  { id: 'push',     label: 'Push',     description: 'Instant alerts on this device',         icon: '🔔' },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Get alerts sent to your WhatsApp',      icon: '💬' },
];

const ALERT_TYPE_KEYS = [
  'new_listing', 'listing_change', 'enquiry', 'expiring', 'review', 'agent_report', 'demand',
] as const satisfies readonly SwitchableAlertType[];

const DEFAULT_TYPES: Record<SwitchableAlertType, boolean> = {
  new_listing: true, listing_change: true, enquiry: true, expiring: true,
  review: true, agent_report: true, demand: true,
};

const FALLBACK_ZONES = ['Africa/Lagos', 'Africa/Nairobi', 'Africa/Accra', 'Africa/Johannesburg', 'Europe/London', 'Europe/Paris', 'America/New_York', 'Asia/Dubai', 'UTC'];

function listTimeZones(current: string): string[] {
  let zones: string[] = FALLBACK_ZONES;
  try {
    const fn = (Intl as any).supportedValuesOf;
    if (typeof fn === 'function') zones = fn('timeZone');
  } catch { /* use fallback */ }
  return zones.includes(current) ? zones : [current, ...zones];
}

function browserTimeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos'; }
  catch { return 'Africa/Lagos'; }
}

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const pad = (n: number) => String(n).padStart(2, '0');

// ─── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Requires a leading + and country code, e.g. +2348012345678 (8-15 digits after +)
const WHATSAPP_RE = /^\+[1-9]\d{7,14}$/;

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email address is required';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address';
  return null;
}

function validateWhatsapp(value: string): string | null {
  if (!value.trim()) return 'WhatsApp number is required';
  if (!WHATSAPP_RE.test(value.trim())) return 'Include country code, e.g. +234 801 234 5678';
  return null;
}

// ─── Push-only banners ─────────────────────────────────────────────────────────

function Banner({ tone, title, body }: { tone: 'warn' | 'info' | 'error'; title?: string; body: string }) {
  const palette = {
    warn:  { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', title: '#fbbf24' },
    info:  { bg: 'rgba(100,100,100,0.1)', border: 'var(--border)',         title: 'var(--text-primary)' },
    error: { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  title: '#f87171' },
  }[tone];
  return (
    <div className="rounded-lg p-3 mt-2 text-xs" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
      {title && <p className="font-medium mb-0.5" style={{ color: palette.title }}>{title}</p>}
      <p style={{ color: 'var(--text-muted)' }}>{body}</p>
    </div>
  );
}

function PushUnsupportedBanner({ support }: { support: PushSupport | null }) {
  const { t } = useLanguage();
  if (support === 'android-webview')
    return <Banner tone="warn" title={t('alerts_push_android_webview_title')} body={t('alerts_push_android_webview_body')} />;
  if (support === 'ios-webview')
    return <Banner tone="info" title={t('alerts_push_ios_webview_title')} body={t('alerts_push_ios_webview_body')} />;
  if (support === 'ios-install')
    return <Banner tone="warn" title={t('alerts_push_ios_install_title')} body={t('alerts_push_ios_install_body')} />;
  return <Banner tone="info" body={t('alerts_push_unsupported')} />;
}

function PushBlockedBanner() {
  const { t } = useLanguage();
  return <Banner tone="error" title={t('alerts_push_blocked_title')} body={t('alerts_push_blocked_body')} />;
}

function PushErrorBanner({ reason }: { reason: PushFailure }) {
  const { t } = useLanguage();
  if (reason === 'blocked') return <PushBlockedBanner />;
  if (reason === 'not_configured') return <Banner tone="warn" body={t('alerts_push_not_configured')} />;
  if (reason === 'dismissed') return <Banner tone="info" body={t('alerts_push_dismissed')} />;
  return <Banner tone="error" body={t('alerts_push_failed')} />;
}

// ─── Toggle switch (standalone, reusable) ──────────────────────────────────────

function Switch({
  checked, disabled, loading, onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className="flex-shrink-0 w-11 h-6 rounded-full relative focus:outline-none bg-primary"
      style={{
        // background: checked ? 'blue' : 'blue',
        border:     `1.5px solid ${checked ? 'var(--pi-gold)' : 'var(--border)'}`,
        cursor:     disabled ? 'not-allowed' : 'pointer',
        opacity:    disabled && !checked ? 0.5 : loading ? 0.7 : 1,
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          background:'#fff',
          left:       checked ? 'calc(100% - 18px)' : '2px',
          transition: 'left 0.2s ease, background 0.2s',
          fontSize:   '8px',
        }}
      >
        {loading ? '⟳' : ''}
      </span>
    </button>
  );
}

// ─── Channel card (header + collapsible sub-content) ───────────────────────────

function ChannelCard({
  meta, enabled, loading, disabled, onToggle, children,
}: {
  meta: ChannelMeta;
  enabled: boolean;
  loading?: boolean;
  disabled?: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-3 transition-all"
      style={{
        background: enabled ? 'rgba(240,160,60,0.06)' : 'var(--bg-elevated)',
        border:     `1px solid ${enabled ? 'rgba(240,160,60,0.25)' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {meta.icon}
          </span>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{meta.label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>
          </div>
        </div>
        <Switch checked={enabled} disabled={disabled} loading={loading} onChange={onToggle} />
      </div>

      {/* Sub-content (input fields / banners) — only rendered when toggle is on */}
      {enabled && children && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function NotificationSettingsPage() {
  const { authUser } = useAuth();
  const { t, locale } = useLanguage();
  const { settings, setSettings } = useNotificationSettings();

  const [channels, setChannels] = useState<Record<ChannelId, boolean>>({
    email: false,
    push: false,
    whatsapp: false,
  });

  const [pushSupport, setPushSupport]   = useState<PushSupport | null>(null);
  const [pushPerm,    setPushPerm]      = useState<PushPermState>('default');
  const [pushLoading, setPushLoading]   = useState(false);
  const [fcmToken,    setFcmToken]      = useState<string | null>(null);

  const [email, setEmail]               = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [whatsapp, setWhatsapp]               = useState('');
  const [whatsappTouched, setWhatsappTouched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [timezone, setTimezone]   = useState<string>(() => browserTimeZone());
  const [alertLang, setAlertLang] = useState<Locale>(locale);
  const [quiet, setQuiet]         = useState({ enabled: true, start: '21:00', end: '07:00' });
  const [digestHour, setDigestHour] = useState(8);
  const [types, setTypes]         = useState<Record<SwitchableAlertType, boolean>>(DEFAULT_TYPES);

  const [pushError, setPushError] = useState<PushFailure | null>(null);
  const [testing, setTesting]     = useState(false);
  const [testMsg, setTestMsg]     = useState<string | null>(null);

  useEffect(() => {
    const env = getEnvironmentInfo();
    setPushSupport(env.support);
    if (env.support === 'supported') {
      setPushPerm(env.notificationPermission);
    } else {
      setPushPerm('unsupported');
    }
  }, []);

  // Seed the form from the shared settings instead of fetching again.
  // Re-runs (idempotently) whenever `settings` is updated elsewhere, e.g. after save.
  useEffect(() => {
    if (!settings) return;
    // Push counts as on only if this browser has permission AND the server has it switched on.
    const env = getEnvironmentInfo();
    const pushOn = env.support === 'supported' && env.notificationPermission === 'granted' && !!settings.pushEnabled;
    setChannels((c) => ({
      ...c,
      email:    !!settings.emailEnabled,
      whatsapp: !!settings.whatsappEnabled,
      push:     pushOn,
    }));
    setEmail(settings.email || '');
    setWhatsapp(settings.whatsappNumber || '');
    if (settings.timezone) setTimezone(settings.timezone);
    if (settings.language) setAlertLang(settings.language);
    if (settings.quietHours) setQuiet(settings.quietHours);
    if (typeof settings.digestHour === 'number') setDigestHour(settings.digestHour);
    if (settings.types) setTypes({ ...DEFAULT_TYPES, ...settings.types });
  }, [settings]);

  const emailError    = useMemo(() => (channels.email    ? validateEmail(email)       : null), [channels.email, email]);
  const whatsappError = useMemo(() => (channels.whatsapp  ? validateWhatsapp(whatsapp) : null), [channels.whatsapp, whatsapp]);

  const pushBlocked     = pushPerm === 'denied';
  const pushUnsupported = pushPerm === 'unsupported';

  const toggleEmail = () => setChannels((c) => ({ ...c, email: !c.email }));
  const toggleWhatsapp = () => setChannels((c) => ({ ...c, whatsapp: !c.whatsapp }));

  const togglePush = useCallback(async () => {
    if (pushUnsupported) return;
    setPushError(null);

    if (channels.push) {
      setPushLoading(true);
      try {
        if (fcmToken) await notificationsApi.unregisterPushNotifications(fcmToken);
        setFcmToken(null);
        // Save straight away: the switch itself is the setting, no extra Save press needed.
        await notificationsApi.savePreferences({ pushEnabled: false });
        setChannels((c) => ({ ...c, push: false }));
      } catch (err) {
        logger.error('[NotificationModal] Push disable failed:', err);
        setPushError('failed');
      } finally {
        setPushLoading(false);
      }
      return;
    }

    if (pushBlocked) { setPushError('blocked'); return; }
    if (!authUser) return;

    setPushLoading(true);
    try {
      const result = await registerPush(alertLang);
      if (result.token) {
        setFcmToken(result.token);
        setPushPerm('granted');
        // Save straight away so the server knows push is on (the test alert and real alerts depend on it).
        await notificationsApi.savePreferences({ pushEnabled: true });
        setChannels((c) => ({ ...c, push: true }));
      } else {
        const env = getEnvironmentInfo();
        if (env.hasNotificationAPI) setPushPerm(env.notificationPermission);
        setPushError(result.reason ?? 'failed');
      }
    } catch (err) {
      logger.error('[NotificationModal] Push enable failed:', err);
      setPushError('failed');
    } finally {
      setPushLoading(false);
    }
  }, [channels.push, pushBlocked, pushUnsupported, fcmToken, authUser, alertLang]);

  const canSave =
    (!channels.email    || !emailError) &&
    (!channels.whatsapp || !whatsappError);

  const handleTest = async () => {
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await notificationsApi.sendTestAlert();
      const { push, email } = res.data;
      const pushLine: Record<string, string> = {
        sent: t('alerts_test_push_sent'),
        off: t('alerts_test_push_off'),
        no_device: t('alerts_test_push_no_device'),
        held: t('alerts_test_push_held'),
        capped: t('alerts_test_push_capped'),
        failed: t('alerts_test_push_failed'),
      };
      const emailLine: Record<string, string> = {
        sent: t('alerts_test_email_sent'),
        failed: t('alerts_test_email_failed'),
      };
      setTestMsg([
        t('alerts_test_inbox'),
        pushLine[push] ?? t('alerts_test_push_off'),
        emailLine[email] ?? t('alerts_test_email_none'),
      ].join(' '));
    } catch (err: any) {
      setTestMsg(err?.response?.status === 429 ? t('alerts_test_limit') : t('alerts_test_failed'));
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) {
      setEmailTouched(true);
      setWhatsappTouched(true);
      return;
    }

    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await notificationsApi.savePreferences({
        emailEnabled:    channels.email,
        email:           channels.email ? email.trim() : undefined,
        whatsappEnabled: channels.whatsapp,
        whatsappNumber:        channels.whatsapp ? whatsapp.trim() : undefined,
        pushEnabled:     channels.push,
        timezone,
        language:        alertLang,
        quietHours:      quiet,
        digestHour,
        types,
      });
      const saved = (res.data?.settings ?? res.data) as INotificationSettings;
      setSettings(saved); // propagates the new configured-state to every consumer of the hook
      logger.info('[NotificationModal] Save successful:', saved);
      setSaveMsg(t('alerts_saved'));
    } catch (err) {
      logger.error('[NotificationModal] Save failed:', err);
      setSaveMsg(t('alerts_save_failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center px-4 bg-white"      
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative animate-slide-up max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(240,160,60,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('alerts_settings_title')}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('alerts_settings_subtitle')}
            </p>
          </div>          
        </div>

        <div className="space-y-3 mb-5">

          {/* ── Email channel ──────────────────────────────────────────── */}
          <ChannelCard
            meta={CHANNELS[0]}
            enabled={channels.email}
            onToggle={toggleEmail}
          >
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email address
            </label>
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${emailTouched && emailError ? '#f87171' : 'var(--border)'}`,
                color: 'var(--text-primary)',
              }}
            />
            {emailTouched && emailError && (
              <p className="text-xs mt-1" style={{ color: '#f87171' }}>{emailError}</p>
            )}
          </ChannelCard>

          {/* ── WhatsApp channel ───────────────────────────────────────── */}
          <ChannelCard
            meta={CHANNELS[2]}
            enabled={channels.whatsapp}
            onToggle={toggleWhatsapp}
          >
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              WhatsApp number (with country code)
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              onBlur={() => setWhatsappTouched(true)}
              placeholder="+234 801 234 5678"
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${whatsappTouched && whatsappError ? '#f87171' : 'var(--border)'}`,
                color: 'var(--text-primary)',
              }}
            />
            {whatsappTouched && whatsappError && (
              <p className="text-xs mt-1" style={{ color: '#f87171' }}>{whatsappError}</p>
            )}
          </ChannelCard>
          
          {/* ── Push channel ───────────────────────────────────────────── */}
          <ChannelCard
            meta={CHANNELS[1]}
            enabled={channels.push}  
            loading={pushLoading}
            disabled={pushUnsupported || (pushBlocked && !channels.push)}
            onToggle={togglePush}
          >
          </ChannelCard> 
          {/* Unsupported banner sits outside the card content area so it shows
              even when the toggle itself is forced off/disabled */}
          {pushUnsupported && <PushUnsupportedBanner support={pushSupport} />}
          {!pushUnsupported && pushBlocked && <PushBlockedBanner />}
          {!pushUnsupported && !pushBlocked && pushError && <PushErrorBanner reason={pushError} />}
        </div>

        {/* ── When ───────────────────────────────────────────────────── */}
        <div className="space-y-3 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('alerts_section_when')}
          </p>

          <label className="block text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('alerts_timezone')}
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {listTimeZones(timezone).map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </label>

          <label className="block text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('alerts_language')}
            <select
              value={alertLang}
              onChange={(e) => setAlertLang(e.target.value as Locale)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
            </select>
          </label>

          <div className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('alerts_quiet_hours')}</p>
              <Switch checked={quiet.enabled} onChange={() => setQuiet((q) => ({ ...q, enabled: !q.enabled }))} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('alerts_quiet_hint')}</p>
            {quiet.enabled && (
              <div className="flex gap-3 mt-3">
                <label className="flex-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t('alerts_quiet_from')}
                  <input
                    type="time" value={quiet.start}
                    onChange={(e) => setQuiet((q) => ({ ...q, start: e.target.value }))}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </label>
                <label className="flex-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t('alerts_quiet_to')}
                  <input
                    type="time" value={quiet.end}
                    onChange={(e) => setQuiet((q) => ({ ...q, end: e.target.value }))}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </label>
              </div>
            )}
          </div>

          <label className="block text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('alerts_digest_hour')}
            <select
              value={digestHour}
              onChange={(e) => setDigestHour(Number(e.target.value))}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {HOURS.map((h) => <option key={h} value={h}>{pad(h)}:00</option>)}
            </select>
            <span className="block mt-1">{t('alerts_digest_hint')}</span>
          </label>
        </div>

        {/* ── What to send ───────────────────────────────────────────── */}
        <div className="space-y-2 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('alerts_section_types')}
          </p>
          {ALERT_TYPE_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="text-sm pr-3" style={{ color: 'var(--text-primary)' }}>{t(`alerts_type_${key}` as const)}</span>
              <Switch checked={types[key]} onChange={() => setTypes((p) => ({ ...p, [key]: !p[key] }))} />
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
            className="flex-1 rounded-xl py-3 text-sm font-semibold bg-primary text-white"
            
          >
            {saving ? t('alerts_saving') : t('alerts_save')}
          </button>
        </div>
        {saveMsg && <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>{saveMsg}</p>}

        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="w-full mt-3 rounded-xl py-2.5 text-sm font-semibold border border-[#1e5f74] text-[#1e5f74]"
        >
          {testing ? t('alerts_test_sending') : t('alerts_test_button')}
        </button>
        {testMsg && <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>{testMsg}</p>}
      </div>
    </div>
  );
}