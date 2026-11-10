'use client';

import Header from "@/components/shared/Header";
import { NotificationSettingsPage } from "@/components/NotificationSettings";
import { notificationsApi } from "@/services/notificationApi";
import Splash from "@/components/shared/Splash";
import { useAuth } from "@/context/AppContextProvider";


export default function NotificationPage() {
  const { authUser } = useAuth();
 
  const sendCustomMessage = async () => {
    try {
      const res = await notificationsApi.customMessage();
      console.log('Custom message sent:', res.data);
    } catch (err) {
      console.error('Error sending custom message:', err);
    }
  };

  const deleteFcmToken = async () => {
    try {
      const res = await notificationsApi.unregisterPushNotifications("cgLyBe-DktneuOgCM4iMtz:APA91bHlCRYUhLx_XIj78Qhx3thJ85dPX8Efott6mCWUzo65XN7zQqWFYS7_zCtLLZDJx0vW5W8cu1rvnzO3EDaDXOYsdLSuJncLeOVGyeLJ7FHX2Sk7CXc");
      console.log('FCM token deleted:', res.data);
    } catch (err) {
      console.error('Error deleting FCM token:', err);
    }
  };

  if (!authUser) return <Splash showFooter />;

  return (
    <main 
      className="w-full h-full md:max-w-[650px] mx-auto pb-10"
      style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      <NotificationSettingsPage />
      <button 
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        onClick={sendCustomMessage}                            
      >
        Send Custom Message
      </button>

      <button 
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        onClick={deleteFcmToken}                            
      >
        Delete FCM Token
      </button>
    </main>
  );
}
