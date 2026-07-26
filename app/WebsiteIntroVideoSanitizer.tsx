"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const VIDEO_RESTART_MS = 41400;
const VIDEO_REVEAL_FALLBACK_MS = 1800;

function isWebsiteHome(pathname: string) {
  if (pathname !== "/" || typeof window === "undefined") return false;

  const nav = navigator as Navigator & { standalone?: boolean };
  const search = new URLSearchParams(window.location.search);
  const ua = navigator.userAgent || "";
  const appLike = Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
      nav.standalone === true ||
      (ua.includes("Android") && ua.includes("; wv")) ||
      search.get("source") === "pwa" ||
      search.get("source") === "app" ||
      search.get("source") === "native" ||
      search.get("platform") === "ios" ||
      search.get("platform") === "android"
  );

  return !appLike;
}

function cleanPlayerUrl(src: string) {
  const url = new URL(src);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", "1");
  url.searchParams.set("controls", "0");
  url.searchParams.set("disablekb", "1");
  url.searchParams.set("fs", "0");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("iv_load_policy", "3");
  url.searchParams.set("cc_load_policy", "0");
  url.searchParams.set("autohide", "1");
  url.searchParams.delete("playlist");
  url.searchParams.delete("loop");
  url.searchParams.delete("showinfo");
  url.searchParams.delete("bascycle");
  return url;
}

export default function WebsiteIntroVideoSanitizer() {
  const pathname = usePathname() || "/";

  useLayoutEffect(() => {
    if (!isWebsiteHome(pathname)) return;

    let currentIframe: HTMLIFrameElement | null = null;
    let restartTimer: number | null = null;
    let revealTimer: number | null = null;

    const reveal = (iframe: HTMLIFrameElement) => {
      if (!iframe.isConnected) return;
      iframe.classList.add("bas-intro-video-ready");
    };

    const scheduleRestart = () => {
      if (restartTimer) window.clearInterval(restartTimer);
      restartTimer = window.setInterval(() => {
        const iframe = document.querySelector<HTMLIFrameElement>(".bas-intro-media iframe");
        if (!iframe) return;
        try {
          const url = cleanPlayerUrl(iframe.src);
          url.searchParams.set("bascycle", String(Date.now()));
          iframe.src = url.toString();
        } catch {
          // Keep the current video frame if a restart URL cannot be prepared.
        }
      }, VIDEO_RESTART_MS);
    };

    const sanitize = () => {
      const iframe = document.querySelector<HTMLIFrameElement>(".bas-intro-media iframe");
      if (!iframe) return;

      iframe.style.pointerEvents = "none";
      iframe.style.userSelect = "none";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");

      if (iframe !== currentIframe) {
        currentIframe = iframe;
        iframe.classList.remove("bas-intro-video-ready");

        let sourceChanged = false;
        try {
          const nextSrc = cleanPlayerUrl(iframe.src).toString();
          if (iframe.src !== nextSrc) {
            sourceChanged = true;
            iframe.src = nextSrc;
          }
        } catch {
          // Leave the existing player source untouched if it cannot be parsed.
        }

        if (revealTimer) window.clearTimeout(revealTimer);

        if (sourceChanged) {
          const handleLoad = () => {
            iframe.removeEventListener("load", handleLoad);
            reveal(iframe);
          };
          iframe.addEventListener("load", handleLoad);
          revealTimer = window.setTimeout(() => reveal(iframe), VIDEO_REVEAL_FALLBACK_MS);
        } else {
          window.requestAnimationFrame(() => reveal(iframe));
        }

        scheduleRestart();
      }

      const media = iframe.parentElement;
      if (media && !media.querySelector(".bas-intro-video-input-shield")) {
        const shield = document.createElement("div");
        shield.className = "bas-intro-video-input-shield";
        shield.setAttribute("aria-hidden", "true");
        media.appendChild(shield);
      }
    };

    sanitize();
    const observer = new MutationObserver(sanitize);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (restartTimer) window.clearInterval(restartTimer);
      if (revealTimer) window.clearTimeout(revealTimer);
    };
  }, [pathname]);

  return null;
}
