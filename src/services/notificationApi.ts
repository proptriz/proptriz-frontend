// ─── Notifications ─────────────────────────────────────────────────────────────────────

import axiosClient from "@/config/client";
import { INotificationSettings } from "@/types";

export const notificationsApi = {
  testPushNotification: (userId: string) =>
    axiosClient.post('/notifications/test-login', { userId }),
  unregisterPushNotifications: (fcmToken: string) =>
    axiosClient.delete('/notifications/token', { data: { fcmToken } }),
  saveTokenToServer: (userId: string, fcmToken: string) =>
    axiosClient.post('/notifications/token', { userId, fcmToken, platform: 'web' }),
  
  savePreferences: (data: INotificationSettings) =>
    axiosClient.patch('/notifications/settings', {
      emailEnabled:    data.emailEnabled,
      email:           data.email,  
      whatsappEnabled: data.whatsappEnabled,
      whatsappNumber:  data.whatsappNumber,
      pushEnabled:     data.pushEnabled,
    }),
  
  getSettings: () => axiosClient.get('/notifications/settings'),
  customMessage: () => axiosClient.post(`/notifications/custom`, { 
    subject: "Proptriz - Custom Message",
    title: "Custom Message",
    body: "This is a custom notification message.",
    ctaText: "Learn More",
    ctaUrl: "https://proptriz.com"
   }),
};