"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AIAssistant from "./AIAssistant";
import AnalyticsTracker from "./AnalyticsTracker";
import InstallAppPrompt from "./InstallAppPrompt";
import AppBottomNav from "./AppBottomNav";
import AppExperience from "./AppExperience";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith("/admin6996") || pathname?.startsWith("/admin");

  return (
    <>
      <AnalyticsTracker />
      {!isAdminArea && <Navbar />}
      <main className="bas-website-content w-full flex-grow">
        {children}
      </main>
      {!isAdminArea && <AppExperience />}
      {!isAdminArea && <InstallAppPrompt />}
      {!isAdminArea && <AIAssistant />}
      {!isAdminArea && <AppBottomNav />}
    </>
  );
}
