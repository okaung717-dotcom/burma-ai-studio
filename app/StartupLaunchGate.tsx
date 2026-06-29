"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const DISPLAY_MS = 3000;

function isAppLikeContext() {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & { standalone?: boolean };
  const isNative = Capacitor.isNativePlatform();
  const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const isIOSHomeScreen = nav.standalone === true;

  return isNative || isStandalone || isIOSHomeScreen;
}

export default function StartupLaunchGate() {
  const [show, setShow] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    if (!isAppLikeContext()) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;

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
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white">
      <div className="relative h-full w-full">
        <Image
          src="/burma-ai-startup-ad.png"
          alt="Burma AI Studio Startup Ad"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute right-5 top-5 rounded-full bg-black/35 px-5 py-2 text-base font-medium text-white backdrop-blur-md"
          aria-label={`Skip startup ad in ${secondsLeft} seconds`}
        >
          Skip {secondsLeft}
        </button>
      </div>
    </div>
  );
}