"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const DISPLAY_MS = 3000;
const STARTUP_AD_SRC = "/burma-ai-startup-ad.webp?v=12";

function isAppLikeContext() {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & { standalone?: boolean };
  const search = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent || "";
  const isNative = Capacitor.isNativePlatform();
  const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const isIOSHomeScreen = nav.standalone === true;
  const isAndroidWebView = /Android/i.test(userAgent) && /; wv\)/i.test(userAgent);
  const explicitAppMode =
    search.get("source") === "pwa" ||
    search.get("source") === "app" ||
    search.get("source") === "native" ||
    search.get("platform") === "ios" ||
    search.get("platform") === "android";

  return Boolean(isNative || isStandalone || isIOSHomeScreen || isAndroidWebView || explicitAppMode);
}

export default function StartupLaunchGate() {
  const [show, setShow] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    if (!isAppLikeContext()) {
      setShow(false);
      return;
    }

    const startedAt = Date.now();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, DISPLAY_MS - elapsed);
      setSecondsLeft(Math.max(0, Math.ceil(remaining / 1000)));
    }, 120);

    const timer = window.setTimeout(() => setShow(false), DISPLAY_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <section className="fixed inset-0 z-[2147483647] overflow-hidden bg-white" aria-label="Burma AI Studio startup ad">
      <img src={STARTUP_AD_SRC} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45" draggable={false} />
      <div className="absolute inset-0 bg-white/45" />
      <img src={STARTUP_AD_SRC} alt="Burma AI Studio Startup Ad" className="relative z-10 h-full w-full object-contain" draggable={false} onError={() => setShow(false)} />
      <button type="button" onClick={() => setShow(false)} className="absolute right-5 top-[calc(env(safe-area-inset-top,0px)+1.25rem)] z-20 rounded-full bg-black/35 px-5 py-2 text-base font-bold text-white backdrop-blur-md" aria-label={`Skip startup ad in ${secondsLeft} seconds`}>
        Skip {secondsLeft}
      </button>
    </section>
  );
}
