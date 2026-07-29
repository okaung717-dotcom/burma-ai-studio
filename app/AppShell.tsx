"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import "./mobile-website-fixes.css";
import "./liquid-glass-navbar.css";
import "./liquid-glass-navbar-logo-fix.css";
import "./desktop-navbar-header-band.css";
import "./website-profile-dark-fix.css";
import "./website-typography.css";
import "./premium-site-system-v2.css";
import "./website-theme-polish-v3.css";
import "./website-intro-sequence-v2.css";
import "./website-intro-timing-216.css";
import "./website-intro-video-sanitizer.css";
import "./website-intro-mm-headline-fix.css";
import "./website-intro-brand-theme-fix.css";
import "./website-chat-route-fixes.css";
import "./website-navbar-utility-controls.css";
import Navbar from "./Navbar";
import WebsiteNavbarStaticBridge from "./WebsiteNavbarStaticBridge";
import WebsitePlansBridge from "./WebsitePlansBridge";
import WebsiteIntroGate from "./WebsiteIntroGate";
import WebsiteIntroVideoSanitizer from "./WebsiteIntroVideoSanitizer";
import WebsiteLogoutRedirect from "./WebsiteLogoutRedirect";
import AIAssistant from "./AIAssistant";
import InstallAppPrompt from "./InstallAppPrompt";
import AppBottomNav from "./AppBottomNav";
import AppExperience from "./AppExperience";
import PrivacyConsent from "./PrivacyConsent";
import ConsentAwareAnalytics from "./ConsentAwareAnalytics";
import LegalQuickLinks from "./LegalQuickLinks";
import WebsiteNavbarProfile from "./WebsiteNavbarProfile";

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
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return enabled ? <>{children}</> : null;
}

const LEGAL_PATHS = [
  "/legal",
  "/privacy",
  "/terms",
  "/project-policy",
  "/ai-ip-policy",
  "/acceptable-use",
  "/copyright",
  "/privacy-choices",
];

function getWebsiteRouteClass(pathname: string, isLegalArea: boolean) {
  if (pathname === "/") return "bas-route-home";
  if (pathname.startsWith("/services")) return "bas-route-services";
  if (pathname.startsWith("/portfolio")) return "bas-route-portfolio";
  if (pathname.startsWith("/stories")) return "bas-route-stories";
  if (pathname.startsWith("/plans")) return "bas-route-plans";
  if (pathname.startsWith("/chat") || pathname.startsWith("/contact")) return "bas-route-chat";
  if (isLegalArea) return "bas-route-legal";
  return "bas-route-public";
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdminArea = pathname.startsWith("/admin6996") || pathname.startsWith("/admin");
  const isLegalArea = LEGAL_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isChatArea = pathname === "/chat" || pathname.startsWith("/chat/");
  const routeClass = isAdminArea ? "bas-route-admin" : getWebsiteRouteClass(pathname, isLegalArea);

  useEffect(() => {
    document.body.classList.toggle("bas-admin-route", isAdminArea);
    document.body.classList.toggle("bas-chat-viewport-lock", !isAdminArea && isChatArea);

    if (!isAdminArea && isChatArea) window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      document.body.classList.remove("bas-admin-route");
      document.body.classList.remove("bas-chat-viewport-lock");
    };
  }, [isAdminArea, isChatArea]);

  return (
    <>
      <ConsentAwareAnalytics />
      {!isAdminArea && <WebsiteIntroGate />}
      {!isAdminArea && <WebsiteIntroVideoSanitizer />}
      {!isAdminArea && <WebsiteLogoutRedirect />}
      {!isAdminArea && <Navbar />}
      {!isAdminArea && <WebsiteNavbarStaticBridge />}
      {!isAdminArea && <WebsitePlansBridge />}
      {!isAdminArea && <WebsiteNavbarProfile />}
      <main className={`bas-website-content ${routeClass} w-full flex-grow`}>
        {children}
      </main>
      {!isAdminArea && <LegalQuickLinks />}
      {!isAdminArea && (
        <AppOnly>
          {isLegalArea ? (
            <div className="fixed inset-0 z-[9000] flex flex-col overflow-hidden bg-[#fff9f0] text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
              <header className="flex shrink-0 items-center justify-between border-b border-[#ead9bd] bg-[#fffdf8]/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.7rem)] backdrop-blur-2xl dark:border-[#4b2a1d] dark:bg-[#100708]/95">
                <Link href="/" className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ead9bd] bg-white text-[#911923] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#e3bc61]" aria-label="Back to Burma AI Studio">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 text-sm font-black">
                  <ShieldCheck className="h-5 w-5 text-[#be9537]" /> Legal & Privacy
                </div>
                <div className="h-11 w-11" aria-hidden="true" />
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto pb-[6.5rem]">
                {children}
              </div>
            </div>
          ) : (
            <AppExperience />
          )}
          <AppBottomNav />
        </AppOnly>
      )}
      {!isAdminArea && <InstallAppPrompt />}
      {!isAdminArea && <AIAssistant />}
      {!isAdminArea && <PrivacyConsent />}
    </>
  );
}
