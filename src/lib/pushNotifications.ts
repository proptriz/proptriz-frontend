// src/lib/pushNotifications.ts

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, onMessage, Messaging, getToken, isSupported } from "firebase/messaging";
import {notificationsApi} from "@/services/notificationApi";
import logger                              from "../../logger.config.mjs";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let app: FirebaseApp;
let messaging: Messaging;

function getFirebaseMessaging(): Messaging {
  if (!app) app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  if (!messaging) messaging = getMessaging(app);
  return messaging;
}

// ─── Environment detection ────────────────────────────────────────────────────

export type PushSupport =
  | 'supported'        // Desktop browser or full PWA — can do web push
  | 'android-webview'  // Android Pi Browser — no Notification API in WebView
  | 'ios-webview'      // iPhone Pi Browser — no SW support in WKWebView
  | 'ios-install'      // iPhone Safari tab — web push only works once added to the Home Screen
  | 'no-sw';           // anything else without service worker

export interface EnvironmentInfo {
  ua: string;
  support: PushSupport;
  hasServiceWorker: boolean;
  hasNotificationAPI: boolean;
  notificationPermission: 'granted' | 'denied' | 'default';
  isIOS: boolean;
  isAndroid: boolean;
  isAndroidWebView: boolean;
  isIOSWebView: boolean;
  isStandalone: boolean;
}

export function getEnvironmentInfo(): EnvironmentInfo {
  const ua      = navigator.userAgent;
  const isIOS   = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  // Android WebView carries the "wv" token (confirmed from real Pi Browser UA)
  const isAndroidWebView = isAndroid && /\bwv\b/.test(ua);

  // Real Mobile Safari always has Version/X.X — Pi Browser WKWebView omits it
  const isIOSWebView = isIOS && !/Version\/[\d.]+/.test(ua);

  const isStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as any).standalone === true;

  const hasServiceWorker  = 'serviceWorker' in navigator;
  const hasNotificationAPI = typeof Notification !== 'undefined';
  const notificationPermission = hasNotificationAPI
    ? (Notification.permission as 'granted' | 'denied' | 'default')
    : 'default';

  let support: PushSupport;
  if (!hasServiceWorker)    support = isIOSWebView ? 'ios-webview' : 'no-sw';
  else if (isAndroidWebView) support = 'android-webview';
  else if (isIOSWebView)     support = 'ios-webview';
  else if (isIOS && !isStandalone) support = 'ios-install';
  else                       support = 'supported';

  return {
    ua,
    support,
    hasServiceWorker,
    hasNotificationAPI,
    notificationPermission,
    isIOS,
    isAndroid,
    isAndroidWebView,
    isIOSWebView,
    isStandalone,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

/** True when the Firebase web settings are present in this build. */
export function isPushConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId && firebaseConfig.appId && VAPID_KEY
  );
}

export type PushFailure =
  | 'not_configured'   // Firebase settings missing in this build
  | 'unsupported'      // this browser / webview cannot do web push
  | 'ios_install'      // iPhone Safari tab: add to Home Screen first
  | 'blocked'          // the person blocked notifications for this site
  | 'dismissed'        // the permission prompt was closed without answering
  | 'failed';          // anything else (network, Firebase, server)

export interface PushRegistration {
  token: string | null;
  reason?: PushFailure;
}

/**
 * Registers this browser for push and tells the server about it. Pass
 * `silent: true` to refresh an existing registration without ever showing the
 * permission prompt (used on app start).
 */
export async function registerPush(language?: string, silent = false): Promise<PushRegistration> {
  const env = getEnvironmentInfo();

  if (!isPushConfigured()) {
    logger.warn('[Push] Firebase settings are missing; push is disabled');
    return { token: null, reason: 'not_configured' };
  }

  if (env.support === 'ios-install') return { token: null, reason: 'ios_install' };
  if (env.support !== 'supported') {
    logger.warn('[Push] Not supported:', env.support);
    return { token: null, reason: 'unsupported' };
  }

  if (env.notificationPermission === 'denied') {
    logger.warn('[Push] Notifications blocked by user');
    return { token: null, reason: 'blocked' };
  }
  if (silent && env.notificationPermission !== 'granted') return { token: null, reason: 'dismissed' };

  try {
    if (!(await isSupported())) return { token: null, reason: 'unsupported' };

    // getToken asks for permission itself when it is still undecided.
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;

    const token = await getToken(getFirebaseMessaging(), {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      const after = typeof Notification !== 'undefined' ? Notification.permission : 'default';
      return { token: null, reason: after === 'denied' ? 'blocked' : 'dismissed' };
    }

    await notificationsApi.saveTokenToServer(token, language);
    logger.info('[Push] Registered ✓');
    return { token };
  } catch (err: any) {
    if (err?.code === 'messaging/permission-blocked') return { token: null, reason: 'blocked' };
    if (err?.code === 'messaging/permission-default') return { token: null, reason: 'dismissed' };
    logger.error('[Push] Registration failed:', err);
    return { token: null, reason: 'failed' };
  }
}

/** Kept for callers that only need the token. */
export async function registerPushNotifications(language?: string): Promise<string | null> {
  return (await registerPush(language)).token;
}

// ─── Showing messages while the page is open ──────────────────────────────────

/**
 * Firebase gives messages to the page (not the service worker) while a tab is
 * open, and shows nothing. This shows them through the service worker so the
 * look and the tap behave exactly like a background notification, and then
 * tells the caller so it can refresh the unread count.
 */
export function listenForForegroundPush(onReceive: () => void): () => void {
  if (!isPushConfigured()) return () => undefined;

  let unsubscribe: (() => void) | undefined;
  let cancelled = false;

  isSupported()
    .then((ok) => {
      if (!ok || cancelled) return;
      unsubscribe = onMessage(getFirebaseMessaging(), async (payload) => {
        const data = (payload.data ?? {}) as Record<string, string>;
        const title = data.title || payload.notification?.title;
        const body  = data.body  || payload.notification?.body || '';

        if (title && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            const reg = await navigator.serviceWorker.getRegistration('/');
            await reg?.showNotification(title, {
              body,
              icon: '/android-chrome-192x192.png',
              badge: '/favicon-32x32.png',
              data: { url: data.url },
            });
          } catch (err) {
            logger.warn('[Push] Could not show foreground notification:', err);
          }
        }
        onReceive();
      });
    })
    .catch(() => undefined);

  return () => { cancelled = true; unsubscribe?.(); };
}
