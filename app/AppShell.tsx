"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AIAssistant from "./AIAssistant";
import AnalyticsTracker from "./AnalyticsTracker";
import InstallAppPrompt from "./InstallAppPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith("/admin6996") || pathname?.startsWith("/admin");

  return (
    <>
      <AnalyticsTracker />
      {!isAdminArea && <Navbar />}
      <main className="w-full flex-grow">
        {children}
      </main>
      {!isAdminArea && <InstallAppPrompt />}
      {!isAdminArea && <AIAssistant />}
    </>
  );
}
