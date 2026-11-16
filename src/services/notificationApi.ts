// ─── Notifications ─────────────────────────────────────────────────────────────────────

import axiosClient from "@/config/client";
import { INotificationSettings } from "@/types";

export const notificationsApi = {
  // The server takes the user from the session, so no user id is sent.
  sendTestPush: () => axiosClient.post('/notifications/test'),
  unregisterPushNotifications: (fcmToken: string) =>
    axiosClient.delete('/notifications/token', { data: { fcmToken } }),
  saveTokenToServer: (fcmToken: string) =>
    axiosClient.post('/notifications/token', { fcmToken, platform: 'web' }),

  savePreferences: (data: INotificationSettings) =>
    axiosClient.patch('/notifications/settings', {
      emailEnabled:    data.emailEnabled,
      email:           data.email,  
      whatsappEnabled: data.whatsappEnabled,
      whatsappNumber:  data.whatsappNumber,
      pushEnabled:     data.pushEnabled,
    }),
  
  getSettings: () => axiosClient.get('/notifications/settings'),
};
