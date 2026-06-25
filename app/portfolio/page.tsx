"use client";

import { useEffect, useRef, useState } from "react";
import { PlaySquare, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import VideoGrid from "./VideoGrid";

const translations = {
  EN: {
    title1: "Video",
    titleHighlight: "Portfolio",
    subtitle: "A real app-style gallery of Burma AI Studio work: cinematic ads, product videos and short-form social media samples.",
    footerText: "© 2026 Burma AI Studio. All rights reserved."
  },
  MM: {
    title1: "Video",
    titleHighlight: "လက်ရာပြခန်း",
    subtitle: "Burma AI Studio ရဲ့ cinematic ad, product video, short-form social media sample တွေကို app gallery တစ်ခုလို ကြည့်ရှုနိုင်အောင်ပြင်ထားပါတယ်။",
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
  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];
  const sentVideos = useRef<Set<string>>(new Set());

  useEffect(() => {
    setIsAdminPreview(new URLSearchParams(window.location.search).get("adminPreview") === "1");
  }, []);

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
          keepalive: true
        }).catch(() => undefined);
      });
    }, { threshold: 0.55 });

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [safeLang]);

  return (
    <div className="min-h-screen bg-[#fff9f0] text-[#1a0b0e] transition-colors duration-300 dark:bg-[#100708] dark:text-[#fff7eb]">
      {isAdminPreview && (
        <div className="sticky top-0 z-50 border-b border-[#be9537]/25 bg-[#fff9f0]/95 px-5 py-3 shadow backdrop-blur dark:bg-[#100708]/95">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <a href="/admin6996/tools" className="rounded-full bg-[#be9537] px-4 py-2 text-sm font-black text-[#100708]">Back to Admin Tools</a>
            <a href="/admin6996/portfolio" className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] dark:border-white/10 dark:bg-white/5 dark:text-white/85">Portfolio Manager</a>
          </div>
        </div>
      )}

      <header className="mx-auto max-w-7xl px-5 py-10 md:px-12 lg:px-24">
        <div className="overflow-hidden rounded-[2.2rem] border border-[#ead9bd] bg-[#1a0b0e] p-6 text-white shadow-[0_18px_55px_rgba(26,11,14,0.14)] md:p-10 dark:border-[#4b2a1d]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]"><Sparkles className="h-4 w-4" /> App Gallery</div>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{t.title1} <span className="text-[#e3bc61]">{t.titleHighlight}</span></h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white/70 md:text-lg">{t.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-12 md:px-12 lg:px-24">
        <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-4 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e] md:p-6">
          <div className="mb-5 flex items-center gap-3 px-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#911923] text-white"><PlaySquare className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">Featured work</p>
              <p className="text-sm font-bold text-[#79695d] dark:text-[#d8c4a3]">Tap a video to preview the style.</p>
            </div>
          </div>
          <VideoGrid />
        </div>
      </main>

      <footer className="border-t border-[#ead9bd] bg-[#fff3e3] px-6 py-12 dark:border-[#4b2a1d] dark:bg-[#100708]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 font-black text-xl text-[#1a0b0e] dark:text-white"><PlaySquare className="h-6 w-6 text-[#911923] dark:text-[#e3bc61]" />Burma AI Studio</div>
          <p className="text-sm text-[#79695d] dark:text-[#d8c4a3]">{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
