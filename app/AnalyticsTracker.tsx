"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSource() {
  const referrer = document.referrer || "Direct";
  const lower = referrer.toLowerCase();
  if (!referrer) return "Direct";
  if (lower.includes("facebook")) return "Facebook";
  if (lower.includes("tiktok")) return "TikTok";
  if (lower.includes("youtube")) return "YouTube";
  if (lower.includes("google")) return "Google";
  if (lower.includes("telegram")) return "Telegram";
  if (lower.includes("instagram")) return "Instagram";
  try {
    return new URL(referrer).hostname.replace("www.", "");
  } catch {
    return "Other";
  }
}

function getDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|android.*mobile|windows phone/.test(ua)) return "Mobile";
  if (/ipad|tablet|android/.test(ua)) return "Tablet";
  return "Desktop";
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const key = "bas_visitor_id";
    let visitorId = localStorage.getItem(key);
    if (!visitorId) {
      visitorId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, visitorId);
    }

    const controller = new AbortController();
    const query = window.location.search.replace(/^\?/, "");

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        path: `${pathname}${query ? `?${query}` : ""}`,
        page: pathname,
        source: getSource(),
        device: getDevice(),
        language: navigator.language || "Unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [pathname]);

  return null;
}
