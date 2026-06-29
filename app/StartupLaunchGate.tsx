"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const DISPLAY_MS = 3000;

function isAppLikeContext() {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & { standalone?: boolean };
  const search = new URLSearchParams(window.location.search);
  const isNative = Capacitor.isNativePlatform();
  const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const isIOSHomeScreen = nav.standalone === true;
  const explicitAppMode =
    search.get("source") === "pwa" ||
    search.get("source") === "app" ||
    search.get("source") === "native" ||
    search.get("platform") === "ios" ||
    search.get("platform") === "android" ||
    localStorage.getItem("bas-app-mode") === "native";

  return Boolean(isNative || isStandalone || isIOSHomeScreen || explicitAppMode);
}

export default function StartupLaunchGate() {
  const [show, setShow] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [imageSrc, setImageSrc] = useState("/burma-ai-startup-ad.png?v=3");

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

    const timer = window.setTimeout(() => {
      setShow(false);
    }, DISPLAY_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <section className="fixed inset-0 z-[2147483647] bg-white" aria-label="Burma AI Studio startup ad">
      <img
        src={imageSrc}
        alt="Burma AI Studio Startup Ad"
        className="h-full w-full object-cover"
        draggable={false}
        onError={() => {
          if (imageSrc.includes(".png")) setImageSrc("/burma-ai-startup-ad.webp?v=3");
        }}
      />
      <button
        type="button"
        onClick={() => setShow(false)}
        className="absolute right-5 top-5 rounded-full bg-black/35 px-5 py-2 text-base font-bold text-white backdrop-blur-md"
        aria-label={`Skip startup ad in ${secondsLeft} seconds`}
      >
        Skip {secondsLeft}
      </button>
    </section>
  );
}
