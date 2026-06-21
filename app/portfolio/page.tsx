"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Video } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import VideoGrid from "./VideoGrid";

const translations = {
  EN: {
    title1: "Our ",
    titleHighlight: "Masterpieces",
    subtitle: "Explore our gallery of high-fidelity AI generated videos, showcasing our expertise in cinematic storytelling and virtual presenter campaigns.",
    footerText: "© 2026 Burma AI Studio. All rights reserved."
  },
  MM: {
    title1: "ကျွန်ုပ်တို့၏ ",
    titleHighlight: "အကောင်းဆုံးလက်ရာများ",
    subtitle: "ရုပ်ရှင်ဆန်သော ဇာတ်လမ်းဖွဲ့စည်းမှုနှင့် AI Presenter ဖန်တီးမှုများတွင် ကျွန်ုပ်တို့၏ ကျွမ်းကျင်မှုကို ပြသထားသော အရည်အသွေးမြင့် AI ဗီဒီယိုပြခန်းကို လေ့လာကြည့်ရှုပါ။",
    footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။"
  }
} as const;

function getVisitorId() {
  const key = "bas_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

function getDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|android.*mobile|windows phone/.test(ua)) return "Mobile";
  if (/ipad|tablet|android/.test(ua)) return "Tablet";
  return "Desktop";
}

export default function Portfolio() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const isAdminPreview = searchParams.get("adminPreview") === "1";
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];
  const sentVideos = useRef<Set<string>>(new Set());

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-portfolio-video]"));
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        const videoId = element.dataset.videoId || "";
        const videoTitle = element.dataset.videoTitle || videoId;
        const sessionKey = `bas_video_seen_${videoId}`;
        if (!videoId || sentVideos.current.has(videoId) || sessionStorage.getItem(sessionKey)) return;

        sentVideos.current.add(videoId);
        sessionStorage.setItem(sessionKey, "1");
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            eventType: "portfolio-video-view",
            page: "/portfolio",
            path: window.location.pathname,
            source: "Portfolio Page",
            device: getDevice(),
            language: navigator.language || "Unknown",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
            videoId,
            videoTitle,
          }),
          keepalive: true,
        }).catch(() => undefined);
      });
    }, { threshold: 0.55 });

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [safeLang]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {isAdminPreview && (
        <div className="sticky top-0 z-50 border-b border-[#be9537]/25 bg-[#fff9f0]/95 px-5 py-3 shadow backdrop-blur dark:bg-[#100708]/95">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <a href="/admin6996/tools" className="rounded-full bg-[#be9537] px-4 py-2 text-sm font-black text-[#100708]">Back to Admin Tools</a>
            <a href="/admin6996/portfolio" className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] dark:border-white/10 dark:bg-white/5 dark:text-white/85">Portfolio Manager</a>
          </div>
        </div>
      )}

      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          {t.title1} <span className="text-[#00C2FF]">{t.titleHighlight}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
      </header>

      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <VideoGrid />
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-16 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"><Video className="text-[#00C2FF] w-6 h-6" />Burma AI Studio</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
