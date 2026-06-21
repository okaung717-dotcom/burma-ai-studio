"use client";

import { useEffect, useRef } from "react";
import { Video } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const translations = {
  EN: {
    title1: "Our ",
    titleHighlight: "Masterpieces",
    subtitle: "Explore our gallery of high-fidelity AI generated videos, showcasing our expertise in cinematic storytelling and virtual presenter campaigns.",
    items: [
      { src: "DVM3o2Wqcys", title: "Cinematic Trailers AI Video", desc: "TikTok, YouTube, Facebook AI videos" },
      { src: "IrukbYGHhQs", title: "Architecture AI Videos", desc: "Advanced AI Video Production" },
      { src: "T9p2lqcETCE", title: "Cinematic Commercial", desc: "High-End AI Promotional Video" },
      { src: "wJjyMQ3bjt4", title: "Virtual Presenter Campaign", desc: "Advanced AI Virtual Presenter Production" },
    ],
    footerText: "© 2026 Burma AI Studio. All rights reserved."
  },
  MM: {
    title1: "ကျွန်ုပ်တို့၏ ",
    titleHighlight: "အကောင်းဆုံးလက်ရာများ",
    subtitle: "ရုပ်ရှင်ဆန်သော ဇာတ်လမ်းဖွဲ့စည်းမှုနှင့် AI Presenter ဖန်တီးမှုများတွင် ကျွန်ုပ်တို့၏ ကျွမ်းကျင်မှုကို ပြသထားသော အရည်အသွေးမြင့် AI ဗီဒီယိုပြခန်းကို လေ့လာကြည့်ရှုပါ။",
    items: [
      { src: "DVM3o2Wqcys", title: "ရုပ်ရှင်ဆန်သော Trailer AI ဗီဒီယိုများ", desc: "TikTok, YouTube, Facebook AI ဗီဒီယိုများ" },
      { src: "IrukbYGHhQs", title: "ဗိသုကာနှင့် အဆောက်အဦး AI ဗီဒီယိုများ", desc: "အဆင့်မြင့် AI ဗီဒီယို ဖန်တီးမှု" },
      { src: "T9p2lqcETCE", title: "ရုပ်ရှင်ဆန်သော ကြော်ငြာများ", desc: "အဆင့်မြင့် AI ကြော်ငြာဗီဒီယို" },
      { src: "wJjyMQ3bjt4", title: "AI Presenter ဗီဒီယိုများ", desc: "အဆင့်မြင့် AI Presenter ဖန်တီးမှု" },
    ],
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
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          {t.title1} <span className="text-[#00C2FF]">{t.titleHighlight}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
      </header>

      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((item) => (
            <div key={item.src} data-portfolio-video data-video-id={item.src} data-video-title={item.title} className="group cursor-pointer">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${item.src}`} allowFullScreen title={item.title}></iframe>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
