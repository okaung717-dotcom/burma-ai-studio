"use client";

import { useEffect, useState } from "react";

const STARTUP_AD_KEY = "bas-startup-ad-seen-v1";
const STARTUP_AD_DURATION_MS = 3000;

function isAppLaunchContext() {
  if (typeof window === "undefined") return false;

  const search = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const media = window.matchMedia?.("(display-mode: standalone)");
  const iosStandalone =
    "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  const hasCapacitor = typeof (window as Window & { Capacitor?: unknown }).Capacitor !== "undefined";
  const isAndroidWebView =
    /Android/i.test(userAgent) && (/; wv\)/i.test(userAgent) || /Version\/\d+(\.\d+)?/i.test(userAgent));

  const explicitAppMode =
    search.get("source") === "pwa" ||
    search.get("source") === "app" ||
    search.get("source") === "native" ||
    search.get("platform") === "ios" ||
    search.get("platform") === "android" ||
    localStorage.getItem("bas-app-mode") === "native";

  return Boolean(media?.matches || iosStandalone || hasCapacitor || isAndroidWebView || explicitAppMode);
}

export default function AppStartupAd() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isAppLaunchContext()) return;
    if (sessionStorage.getItem(STARTUP_AD_KEY) === "true") return;

    sessionStorage.setItem(STARTUP_AD_KEY, "true");
    setVisible(true);
    document.body.classList.add("bas-startup-ad-lock");

    const finishTimer = window.setTimeout(() => {
      setClosing(true);
    }, STARTUP_AD_DURATION_MS);

    return () => {
      window.clearTimeout(finishTimer);
      document.body.classList.remove("bas-startup-ad-lock");
    };
  }, []);

  useEffect(() => {
    if (!closing) return;

    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("bas-startup-ad-lock");
    }, 260);

    return () => window.clearTimeout(removeTimer);
  }, [closing]);

  if (!visible) return null;

  return (
    <section
      className={`fixed inset-0 z-[2147483647] bg-white transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
      aria-label="Burma AI Studio startup advertisement"
      onClick={() => setClosing(true)}
    >
      <img
        src="/burma-ai-startup-ad.webp?v=1"
        alt="Create with Burma AI Studio"
        className="h-full w-full object-cover"
        draggable={false}
        onError={() => setClosing(true)}
      />
    </section>
  );
}
