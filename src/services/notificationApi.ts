// ─── Notifications ─────────────────────────────────────────────────────────────────────

import axiosClient from "@/config/client";
import { IInboxItem, INotificationSettings } from "@/types";

export interface InboxPage {
  items: IInboxItem[];
  nextCursor: string | null;
  unreadCount: number;
}

export interface TestAlertResult {
  inbox: boolean;
  push: string;
  email: string;
}

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'web';

export const notificationsApi = {
  // The server takes the user from the session, so no user id is sent.
  sendTestAlert: () => axiosClient.post<TestAlertResult>('/notifications/test'),
  unregisterPushNotifications: (fcmToken: string) =>
    axiosClient.delete('/notifications/token', { data: { fcmToken } }),
  saveTokenToServer: (fcmToken: string, language?: string) =>
    axiosClient.post('/notifications/token', {
      fcmToken,
      platform: 'web',
      appVersion: APP_VERSION,
      language,
    }),

  // Only the fields that are passed are changed on the server.
  savePreferences: (data: Partial<INotificationSettings>) =>
    axiosClient.patch('/notifications/settings', data),

  getSettings: () => axiosClient.get('/notifications/settings'),

  listInbox: (cursor?: string | null, limit = 20) =>
    axiosClient.get<InboxPage>('/notifications', { params: { limit, cursor: cursor || undefined } }),
  getUnreadCount: () => axiosClient.get<{ unreadCount: number }>('/notifications/unread-count'),
  markRead: (body: { ids: string[] } | { all: true }) => axiosClient.post('/notifications/read', body),
  recordInboxOpen: (id: string) => axiosClient.post(`/notifications/${id}/open`),

  // Used by the /n/[id] page: records the open and returns where to go.
  resolveTrackedLink: (id: string, channel: 'push' | 'email') =>
    axiosClient.get<{ url: string }>(`/n/${encodeURIComponent(id)}`, { params: { format: 'json', c: channel } }),
};
