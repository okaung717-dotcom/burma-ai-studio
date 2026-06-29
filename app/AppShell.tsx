"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./mobile-website-fixes.css";
import Navbar from "./Navbar";
import AIAssistant from "./AIAssistant";
import AnalyticsTracker from "./AnalyticsTracker";
import InstallAppPrompt from "./InstallAppPrompt";
import AppBottomNav from "./AppBottomNav";
import AppExperience from "./AppExperience";

function shouldShowAppOnlyParts() {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & { standalone?: boolean };
  const search = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosHomeScreen = nav.standalone === true;
  const androidWebView = userAgent.includes("Android") && userAgent.includes("; wv");
  const explicitApp =
    search.get("source") === "pwa" ||
    search.get("source") === "app" ||
    search.get("source") === "native" ||
    search.get("platform") === "ios" ||
    search.get("platform") === "android";

  return Boolean(standalone || iosHomeScreen || androidWebView || explicitApp);
}

function AppOnly({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(shouldShowAppOnlyParts());
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return enabled ? <>{children}</> : null;
}

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
      {!isAdminArea && (
        <AppOnly>
          <AppExperience />
          <AppBottomNav />
        </AppOnly>
      )}
      {!isAdminArea && <InstallAppPrompt />}
      {!isAdminArea && <AIAssistant />}
    </>
  );
}
