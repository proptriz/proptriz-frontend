'use client';

import Header from "@/components/shared/Header";
import { NotificationSettingsPage } from "@/components/NotificationSettings";
import Splash from "@/components/shared/Splash";
import { useAuth } from "@/context/AppContextProvider";


export default function NotificationPage() {
  const { authUser } = useAuth();
 
  if (!authUser) return <Splash showFooter />;

  return (
    <main 
      className="w-full h-full md:max-w-[650px] mx-auto pb-10"
      style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      <NotificationSettingsPage />
    </main>
  );
}
