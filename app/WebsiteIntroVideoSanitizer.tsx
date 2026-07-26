"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

export default function WebsiteIntroVideoSanitizer() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!isWebsiteHome(pathname)) return;

    let lastIframe: HTMLIFrameElement | null = null;

    const sanitize = () => {
      const iframe = document.querySelector<HTMLIFrameElement>(".bas-intro-media iframe");
      if (!iframe) return;

      iframe.style.pointerEvents = "none";
      iframe.style.userSelect = "none";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");

      if (iframe === lastIframe) return;
      lastIframe = iframe;

      try {
        const url = new URL(iframe.src);
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

        // A same-video playlist is what makes YouTube expose Previous/Next transport controls.
        // Remove playlist-based looping on the public website intro so the transport cluster
        // cannot be summoned by pointer activity.
        url.searchParams.delete("playlist");
        url.searchParams.delete("loop");
        url.searchParams.delete("showinfo");

        const nextSrc = url.toString();
        if (iframe.src !== nextSrc) iframe.src = nextSrc;
      } catch {
        // Leave the existing player untouched if the URL cannot be parsed.
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

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
