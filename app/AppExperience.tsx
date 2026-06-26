"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Bell, Clapperboard, Clock3, Film, MessageCircle, PlayCircle, Send, Sparkles, Star } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const copy = {
  EN: {
    home: "Studio Home",
    services: "Services",
    work: "Work",
    contact: "Project Brief",
    heroTitle: "Create cinematic AI videos without a studio shoot.",
    heroText: "Choose a video type, send your product details, and get a polished social-ready concept.",
    start: "Start Project",
    watch: "View Work",
    today: "What do you need today?",
    flow: "Production flow",
    servicesTitle: "Video services built for business growth",
    workTitle: "Selected video directions",
    contactTitle: "Tell us your project",
    contactText: "Send product, platform, duration, style and deadline. We will guide the next step clearly.",
    ai: "Ask AI",
    ready: "Ready in 48h",
    premium: "Premium style",
    noShoot: "No filming cost",
    serviceItems: [
      ["AI Presenter Ad", "Presenter-style video for product or brand explanation."],
      ["Product Video", "Clean cinematic product highlight for online sales."],
      ["TikTok/Reels Short", "Short-form hook, script and visual direction."],
      ["Cinematic Brand Ad", "Premium commercial storytelling for social media."],
    ],
    flowItems: ["Share product info", "Get script and visual plan", "Review and receive final video"],
    contactActions: ["Telegram", "Viber", "Email"],
  },
  MM: {
    home: "Studio Home",
    services: "ဝန်ဆောင်မှု",
    work: "လက်ရာများ",
    contact: "Project Brief",
    heroTitle: "Studio ရိုက်ကူးစရိတ်မလိုဘဲ Cinematic AI Video ဖန်တီးပါ။",
    heroText: "Video အမျိုးအစားရွေးပြီး product details ပို့ပါ။ Social media အတွက်အသင့် concept ကို လမ်းညွှန်ပေးမယ်။",
    start: "Project စတင်ရန်",
    watch: "လက်ရာကြည့်ရန်",
    today: "ဒီနေ့ ဘာဖန်တီးချင်လဲ?",
    flow: "လုပ်ဆောင်ပုံ",
    servicesTitle: "Business growth အတွက် AI video services",
    workTitle: "ရွေးချယ်နိုင်တဲ့ Video direction များ",
    contactTitle: "Project အချက်အလက်ပို့ရန်",
    contactText: "Product, platform, duration, style နဲ့ deadline ကိုပို့ပါ။ နောက်တစ်ဆင့်ကို သေချာလမ်းညွှန်ပေးပါမယ်။",
    ai: "AI ကိုမေးရန်",
    ready: "48h အတွင်း",
    premium: "Premium style",
    noShoot: "ရိုက်ကူးစရိတ်မလို",
    serviceItems: [
      ["AI Presenter Ad", "Product/brand ကို presenter style နဲ့ရှင်းပြပေးမယ်။"],
      ["Product Video", "Online sales အတွက် cinematic product highlight ဖန်တီးပေးမယ်။"],
      ["TikTok/Reels Short", "Hook, script, visual direction ပါ short video ဖန်တီးပေးမယ်။"],
      ["Cinematic Brand Ad", "Social media အတွက် premium storytelling ဖန်တီးပေးမယ်။"],
    ],
    flowItems: ["Product info ပို့ပါ", "Script / visual plan ပြင်ဆင်မယ်", "Review ပြီး final video ရယူပါ"],
    contactActions: ["Telegram", "Viber", "Email"],
  },
} as const;

function useAppMode() {
  const [appMode, setAppMode] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");

    const check = () => {
      const search = new URLSearchParams(window.location.search);
      const enabled = window.innerWidth < 768 && (media.matches || search.get("source") === "pwa");
      setAppMode(enabled);
      document.body.classList.toggle("bas-app-mode", enabled);
    };

    check();
    window.addEventListener("resize", check);
    media.addEventListener?.("change", check);

    return () => {
      window.removeEventListener("resize", check);
      media.removeEventListener?.("change", check);
      document.body.classList.remove("bas-app-mode");
    };
  }, []);

  return appMode;
}

function AppLogo() {
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#fffdf8] shadow-inner ring-1 ring-[#be9537]/45">
      <svg viewBox="0 0 128 128" className="h-10 w-10" aria-hidden="true">
        <rect width="128" height="128" rx="28" fill="#fffdf8" />
        <path fill="#911923" d="M34.8 32.6c6.6 0 13.1-.2 19.7.1 8.5.4 14.5 5 16.1 12.4 1.3 6.4-1.2 11.5-6.8 15.1 8.1 3.2 12.6 9.1 12 18.2-.8 11.7-9.7 18.5-23.8 18.6H34.8V32.6Zm15.8 26.2c6.2 0 9.7-2.6 9.7-7.4s-3.4-7.3-9.8-7.3h-3.6v14.7h3.7Zm1.7 26.5c7.5 0 11.5-2.8 11.5-8.2 0-5.3-3.9-8.1-11.7-8.1h-5.2v16.3h5.4Z" />
        <path fill="#911923" d="M82.8 32.2h15.1l24.1 64.8h-17.2l-4.1-12.4H80.4L76.2 97H59.7l23.1-64.8Zm13.6 39.6-5.5-17.1-5.9 17.1h11.4Z" />
        <path fill="#be9537" d="M50.8 94.7c18.9-18.8 42.4-28.9 72.5-30.4-17.9 7.5-33.6 17.8-46.9 30.9-8.6 8.4-18.3 12.1-29.9 11.3-7.2-.5-14.2-2-20.9-4.4 8.9-1.1 17.3-3.6 25.2-7.4Z" />
      </svg>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[#ead9bd]/70 bg-[#fff9f0]/94 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.7rem)] backdrop-blur-2xl dark:border-[#4b2a1d] dark:bg-[#100708]/94">
      <div className="flex min-w-0 items-center gap-3">
        <AppLogo />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black uppercase tracking-[0.22em] text-[#be9537]">Burma AI Studio</p>
          <h1 className="truncate text-xl font-black text-[#1a0b0e] dark:text-[#fff7eb]">{title}</h1>
        </div>
      </div>
      <button className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ead9bd] bg-white text-[#911923] shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e] dark:text-[#e3bc61]" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}

function StatCard({ icon: Icon, label, text }: { icon: typeof Sparkles; label: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#ead9bd] bg-white/72 p-3 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]/72">
      <Icon className="mb-2 h-5 w-5 text-[#be9537]" />
      <p className="text-base font-black text-[#1a0b0e] dark:text-[#fff7eb]">{label}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#79695d] dark:text-[#d8c4a3]">{text}</p>
    </div>
  );
}

export default function AppExperience() {
  const appMode = useAppMode();
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const t = copy[activeLang];

  const currentTitle = useMemo(() => {
    if (pathname.startsWith("/services")) return t.services;
    if (pathname.startsWith("/portfolio")) return t.work;
    if (pathname.startsWith("/contact")) return t.contact;
    return t.home;
  }, [pathname, t]);

  if (!appMode) return null;

  const openAssistant = () => document.getElementById("burma-ai-open-button")?.click();

  return (
    <div className="fixed inset-0 z-[9000] flex flex-col overflow-hidden bg-[#fff9f0] text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <Header title={currentTitle} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[7.25rem] pt-4">
        {pathname.startsWith("/services") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_18px_45px_rgba(26,11,14,0.22)]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]">Services</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.servicesTitle}</h2></div>
            <div className="grid gap-3">{t.serviceItems.map(([title, description], index) => <Link key={title} href="/contact" className="flex items-center gap-3 rounded-[1.55rem] border border-[#ead9bd] bg-[#fffdf8] p-4 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#911923] text-sm font-black text-white dark:bg-[#e3bc61] dark:text-[#100708]">{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-base font-black">{title}</span><span className="mt-1 block text-sm leading-relaxed text-[#79695d] dark:text-[#d8c4a3]">{description}</span></span><ArrowRight className="h-5 w-5 shrink-0 text-[#be9537]" /></Link>)}</div>
          </section>
        ) : pathname.startsWith("/portfolio") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Portfolio</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.workTitle}</h2></div>
            {['Cinematic Brand Ad', 'AI Presenter Video', 'Product Motion Ad'].map((title, index) => <div key={title} className="overflow-hidden rounded-[1.7rem] border border-[#ead9bd] bg-[#100708] p-3 text-white shadow-sm dark:border-[#4b2a1d]"><div className="flex aspect-video items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#911923] via-[#1a0b0e] to-[#be9537]"><PlayCircle className="h-12 w-12 text-white/88" /></div><div className="flex items-center justify-between px-1 pt-3"><div><p className="text-base font-black">{title}</p><p className="text-xs font-bold text-[#e3bc61]">Ready for social media</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">0{index + 1}</span></div></div>)}
          </section>
        ) : pathname.startsWith("/contact") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_18px_45px_rgba(26,11,14,0.22)]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]">Contact</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.contactTitle}</h2><p className="mt-3 text-sm leading-relaxed text-[#f3dfc1]">{t.contactText}</p></div>
            {t.contactActions.map((action) => <Link key={action} href="/contact" className="flex items-center justify-between rounded-[1.55rem] border border-[#ead9bd] bg-[#fffdf8] p-4 font-black text-[#1a0b0e] shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff3e3] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]"><Send className="h-5 w-5" /></span>{action}</span><ArrowRight className="h-5 w-5 text-[#be9537]" /></Link>)}
            <button onClick={openAssistant} className="flex w-full items-center justify-between rounded-[1.55rem] bg-[#911923] p-4 text-left font-black text-white shadow-[0_16px_35px_rgba(145,25,35,0.24)]"><span className="flex items-center gap-3"><MessageCircle className="h-5 w-5" />{t.ai}</span><Sparkles className="h-5 w-5 text-[#f1d180]" /></button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_22px_55px_rgba(26,11,14,0.26)]"><div className="flex items-center justify-between"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]">Quick creation</p><Star className="h-5 w-5 text-[#e3bc61]" /></div><h2 className="mt-4 text-[2rem] font-black leading-tight">{t.heroTitle}</h2><p className="mt-3 text-sm leading-relaxed text-[#f3dfc1]">{t.heroText}</p><div className="mt-5 flex gap-3"><Link href="/contact" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#911923] px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" />{t.start}</Link><Link href="/portfolio" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white"><PlayCircle className="h-4 w-4" />{t.watch}</Link></div></div>
            <div className="grid grid-cols-3 gap-3"><StatCard icon={Clock3} label="48h" text={t.ready} /><StatCard icon={BadgeCheck} label="Pro" text={t.premium} /><StatCard icon={Clapperboard} label="AI" text={t.noShoot} /></div>
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">{t.today}</p><div className="mt-4 grid grid-cols-2 gap-3">{t.serviceItems.map(([title]) => <Link key={title} href="/contact" className="rounded-[1.35rem] border border-[#ead9bd] bg-[#fff9f0] p-4 text-sm font-black leading-tight text-[#1a0b0e] dark:border-[#4b2a1d] dark:bg-[#241113] dark:text-[#fff7eb]"><Film className="mb-3 h-5 w-5 text-[#be9537]" />{title}</Link>)}</div></div>
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">{t.flow}</p><div className="mt-4 space-y-3">{t.flowItems.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-[1.25rem] bg-[#fff3e3] p-3 dark:bg-[#241113]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">{index + 1}</span><p className="text-sm font-bold">{item}</p></div>)}</div></div>
          </section>
        )}
      </main>
    </div>
  );
}
