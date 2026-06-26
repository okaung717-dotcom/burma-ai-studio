"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Clapperboard, Clock3, Film, Globe2, Mail, MessageCircle, Moon, PlayCircle, Send, Settings2, Sparkles, Star, Sun } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeProvider";
import Navbar from "./Navbar";

type PortfolioItem = {
  id: string;
  src: string;
  titleEN: string;
  descEN: string;
  titleMM: string;
  descMM: string;
  featured?: boolean;
};

type AppContactAction = {
  label: "Telegram" | "Facebook" | "Email";
  href: string;
  type: "telegram" | "facebook" | "email";
};

const defaultAppPortfolio: PortfolioItem[] = [
  { id: "trailer", src: "DVM3o2Wqcys", titleEN: "Cinematic Trailers AI Video", descEN: "TikTok, YouTube, Facebook AI videos", titleMM: "Trailer AI Video", descMM: "TikTok, YouTube, Facebook AI videos", featured: true },
  { id: "architecture", src: "IrukbYGHhQs", titleEN: "Architecture AI Videos", descEN: "Advanced AI video production", titleMM: "Architecture AI Videos", descMM: "Advanced AI video production", featured: true },
  { id: "commercial", src: "T9p2lqcETCE", titleEN: "Cinematic Commercial", descEN: "High-end AI promotional video", titleMM: "Cinematic Commercial", descMM: "High-end AI promotional video", featured: true },
  { id: "presenter", src: "wJjyMQ3bjt4", titleEN: "Virtual Presenter Campaign", descEN: "Advanced AI virtual presenter production", titleMM: "AI Presenter Videos", descMM: "AI presenter video production", featured: true },
];

const appContactActions: AppContactAction[] = [
  { label: "Telegram", href: `tg://resolve?phone=${["959", "671", "010", "011"].join("")}`, type: "telegram" },
  { label: "Facebook", href: ["https://www.facebook.com", "BurmaAiaStudio"].join("/") + "/", type: "facebook" },
  { label: "Email", href: `mailto:${["okaung717", "gmail.com"].join("@")}`, type: "email" },
];

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
    settings: "App Settings",
    theme: "Theme mode",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    burmese: "Burmese",
    serviceItems: [["AI Presenter Ad", "Presenter-style video for product or brand explanation."], ["Product Video", "Clean cinematic product highlight for online sales."], ["TikTok/Reels Short", "Short-form hook, script and visual direction."], ["Cinematic Brand Ad", "Premium commercial storytelling for social media."]],
    flowItems: ["Share product info", "Get script and visual plan", "Review and receive final video"],
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
    settings: "App Setting",
    theme: "Theme mode",
    language: "ဘာသာစကား",
    light: "Light",
    dark: "Dark",
    english: "English",
    burmese: "မြန်မာ",
    serviceItems: [["AI Presenter Ad", "Product/brand ကို presenter style နဲ့ရှင်းပြပေးမယ်။"], ["Product Video", "Online sales အတွက် cinematic product highlight ဖန်တီးပေးမယ်။"], ["TikTok/Reels Short", "Hook, script, visual direction ပါ short video ဖန်တီးပေးမယ်။"], ["Cinematic Brand Ad", "Social media အတွက် premium storytelling ဖန်တီးပေးမယ်။"]],
    flowItems: ["Product info ပို့ပါ", "Script / visual plan ပြင်ဆင်မယ်", "Review ပြီး final video ရယူပါ"],
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
    <div className="bas-app-navbar-logo" aria-label="Burma AI Studio website logo">
      <Navbar />
    </div>
  );
}

function Header({ title, activeLang }: { title: string; activeLang: "EN" | "MM" }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const t = copy[activeLang];
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="relative flex shrink-0 items-center justify-between border-b border-[#ead9bd] bg-[#fff9f0]/96 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.7rem)] text-[#1a0b0e] backdrop-blur-2xl dark:border-[#4b2a1d] dark:bg-[#100708]/96 dark:text-[#fff7eb]">
      <div className="min-w-0">
        <AppLogo />
        <h1 className="-mt-1 truncate text-2xl font-black leading-none text-[#1a0b0e] dark:text-[#fff7eb]">{title}</h1>
      </div>
      <button onClick={() => setOpen((value) => !value)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#ead9bd] bg-white text-[#911923] shadow-sm transition active:scale-95 dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#e3bc61]" aria-label="Open app settings">
        <Settings2 className="h-5 w-5" />
      </button>

      {open && <button aria-label="Close app settings" className="fixed inset-0 z-[9001] bg-transparent" onClick={() => setOpen(false)} />}

      {open && (
        <section className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+4.8rem)] z-[9002] w-[min(21rem,calc(100vw-2rem))] rounded-[1.7rem] border border-[#ead9bd] bg-[#fffdf8] p-4 text-[#1a0b0e] shadow-[0_24px_80px_rgba(26,11,14,0.22)] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]"><Settings2 className="h-5 w-5" /></span>
            <div>
              <p className="text-base font-black">{t.settings}</p>
              <p className="text-xs font-bold text-[#79695d] dark:text-[#d8c4a3]">Burma AI Studio</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.25rem] border border-[#ead9bd] bg-[#fff9f0] p-3 dark:border-[#4b2a1d] dark:bg-[#241113]">
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#911923] dark:text-[#e3bc61]"><Sun className="h-4 w-4" />{t.theme}</p>
              <button onClick={toggleTheme} className="flex w-full items-center justify-between rounded-2xl bg-white px-3 py-3 text-left text-sm font-black text-[#1a0b0e] shadow-sm dark:bg-[#100708] dark:text-[#fff7eb]">
                <span className="flex items-center gap-2">{isDark ? <Moon className="h-5 w-5 text-[#e3bc61]" /> : <Sun className="h-5 w-5 text-[#be9537]" />}{isDark ? t.dark : t.light}</span>
                <span className="rounded-full bg-[#be9537] px-3 py-1 text-xs font-black text-[#100708]">Change</span>
              </button>
            </div>

            <div className="rounded-[1.25rem] border border-[#ead9bd] bg-[#fff9f0] p-3 dark:border-[#4b2a1d] dark:bg-[#241113]">
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#911923] dark:text-[#e3bc61]"><Globe2 className="h-4 w-4" />{t.language}</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => lang !== "EN" && toggleLang()} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black ${lang === "EN" ? "bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]" : "bg-white text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]"}`}>{lang === "EN" && <Check className="h-4 w-4" />}{t.english}</button>
                <button onClick={() => lang !== "MM" && toggleLang()} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black ${lang === "MM" ? "bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]" : "bg-white text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]"}`}>{lang === "MM" && <Check className="h-4 w-4" />}{t.burmese}</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </header>
  );
}

function StatCard({ icon: Icon, label, text }: { icon: typeof Sparkles; label: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#ead9bd] bg-white p-3 text-[#1a0b0e] shadow-sm dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]">
      <Icon className="mb-2 h-5 w-5 text-[#be9537] dark:text-[#e3bc61]" />
      <p className="text-base font-black">{label}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#79695d] dark:text-[#d8c4a3]">{text}</p>
    </div>
  );
}

function ContactActionIcon({ type }: { type: AppContactAction["type"] }) {
  if (type === "email") return <Mail className="h-6 w-6" />;
  if (type === "facebook") return <MessageCircle className="h-6 w-6" />;
  return <Send className="h-6 w-6" />;
}

function cleanYoutubeId(value: string) {
  return value
    .replace("https://youtu.be/", "")
    .replace("https://www.youtube.com/watch?v=", "")
    .replace("https://youtube.com/watch?v=", "")
    .split("&")[0]
    .split("?")[0]
    .trim();
}

function PortfolioVideoCard({ item, index, activeLang }: { item: PortfolioItem; index: number; activeLang: "EN" | "MM" }) {
  const videoId = cleanYoutubeId(item.src);
  const title = activeLang === "MM" ? item.titleMM || item.titleEN : item.titleEN || item.titleMM;
  const description = activeLang === "MM" ? item.descMM || item.descEN : item.descEN || item.descMM;

  return (
    <article className="overflow-hidden rounded-[1.7rem] border border-[#2f1418] bg-[#100708] p-3 text-white shadow-sm dark:border-[#6b4b2a]">
      <div className="overflow-hidden rounded-[1.25rem] bg-[#1a0b0e]">
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-1 pt-3">
        <div className="min-w-0">
          <p className="truncate text-base font-black text-white">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs font-bold leading-relaxed text-[#e3bc61]">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

export default function AppExperience() {
  const appMode = useAppMode();
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const t = copy[activeLang];
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(defaultAppPortfolio);

  useEffect(() => {
    if (!appMode || !pathname.startsWith("/portfolio")) return;

    let isAlive = true;
    fetch("/api/portfolio", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { items?: PortfolioItem[] }) => {
        if (!isAlive || !Array.isArray(data.items) || !data.items.length) return;
        setPortfolioItems(data.items.slice(0, 4));
      })
      .catch(() => {
        if (isAlive) setPortfolioItems(defaultAppPortfolio);
      });

    return () => {
      isAlive = false;
    };
  }, [appMode, pathname]);

  const currentTitle = useMemo(() => {
    if (pathname.startsWith("/services")) return t.services;
    if (pathname.startsWith("/portfolio")) return t.work;
    if (pathname.startsWith("/contact")) return t.contact;
    return t.home;
  }, [pathname, t]);

  if (!appMode) return null;

  const openAssistant = () => window.dispatchEvent(new CustomEvent("bas-open-assistant"));

  return (
    <div className="fixed inset-0 z-[9000] flex flex-col overflow-hidden bg-[#fff9f0] text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <Header title={currentTitle} activeLang={activeLang} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[7.25rem] pt-4">
        {pathname.startsWith("/services") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_18px_45px_rgba(26,11,14,0.22)] dark:bg-[#fff7eb] dark:text-[#100708]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61] dark:text-[#911923]">Services</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.servicesTitle}</h2></div>
            <div className="grid gap-3">{t.serviceItems.map(([title, description], index) => <Link key={title} href="/contact" className="flex items-center gap-3 rounded-[1.55rem] border border-[#ead9bd] bg-[#fffdf8] p-4 text-[#1a0b0e] shadow-sm dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#911923] text-sm font-black text-white dark:bg-[#e3bc61] dark:text-[#100708]">{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-base font-black">{title}</span><span className="mt-1 block text-sm leading-relaxed text-[#79695d] dark:text-[#d8c4a3]">{description}</span></span><ArrowRight className="h-5 w-5 shrink-0 text-[#be9537] dark:text-[#e3bc61]" /></Link>)}</div>
          </section>
        ) : pathname.startsWith("/portfolio") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Portfolio</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.workTitle}</h2></div>
            {portfolioItems.map((item, index) => <PortfolioVideoCard key={item.id || item.src} item={item} index={index} activeLang={activeLang} />)}
          </section>
        ) : pathname.startsWith("/contact") ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_18px_45px_rgba(26,11,14,0.22)] dark:bg-[#fff7eb] dark:text-[#100708]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61] dark:text-[#911923]">Contact</p><h2 className="mt-2 text-3xl font-black leading-tight">{t.contactTitle}</h2><p className="mt-3 text-sm leading-relaxed text-[#f3dfc1] dark:text-[#4b3830]">{t.contactText}</p></div>
            {appContactActions.map((action) => <a key={action.label} href={action.href} target={action.type === "facebook" ? "_blank" : undefined} rel={action.type === "facebook" ? "noopener noreferrer" : undefined} className="flex items-center justify-between rounded-[1.55rem] border border-[#ead9bd] bg-[#fffdf8] p-4 font-black text-[#1a0b0e] shadow-sm transition-transform active:scale-[0.98] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff3e3] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]"><ContactActionIcon type={action.type} /></span>{action.label}</span><ArrowRight className="h-5 w-5 text-[#be9537] dark:text-[#e3bc61]" /></a>)}
            <button onClick={openAssistant} className="flex w-full items-center justify-between rounded-[1.55rem] bg-[#911923] p-4 text-left font-black text-white shadow-[0_16px_35px_rgba(145,25,35,0.24)] dark:bg-[#e3bc61] dark:text-[#100708]"><span className="flex items-center gap-3"><MessageCircle className="h-5 w-5" />{t.ai}</span><Sparkles className="h-5 w-5 text-[#f1d180] dark:text-[#911923]" /></button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_22px_55px_rgba(26,11,14,0.26)] dark:bg-[#fff7eb] dark:text-[#100708]"><div className="flex items-center justify-between"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61] dark:text-[#911923]">Quick creation</p><Star className="h-5 w-5 text-[#e3bc61] dark:text-[#911923]" /></div><h2 className="mt-4 text-[2rem] font-black leading-tight">{t.heroTitle}</h2><p className="mt-3 text-sm leading-relaxed text-[#f3dfc1] dark:text-[#4b3830]">{t.heroText}</p><div className="mt-5 flex gap-3"><Link href="/contact" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#911923] px-4 py-3 text-sm font-black text-white dark:bg-[#911923] dark:text-white"><MessageCircle className="h-4 w-4" />{t.start}</Link><Link href="/portfolio" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><PlayCircle className="h-4 w-4" />{t.watch}</Link></div></div>
            <div className="grid grid-cols-3 gap-3"><StatCard icon={Clock3} label="48h" text={t.ready} /><StatCard icon={BadgeCheck} label="Pro" text={t.premium} /><StatCard icon={Clapperboard} label="AI" text={t.noShoot} /></div>
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">{t.today}</p><div className="mt-4 grid grid-cols-2 gap-3">{t.serviceItems.map(([title]) => <Link key={title} href="/contact" className="rounded-[1.35rem] border border-[#ead9bd] bg-[#fff9f0] p-4 text-sm font-black leading-tight text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#241113] dark:text-[#fff7eb]"><Film className="mb-3 h-5 w-5 text-[#be9537] dark:text-[#e3bc61]" />{title}</Link>)}</div></div>
            <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#fff7eb]"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">{t.flow}</p><div className="mt-4 space-y-3">{t.flowItems.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-[1.25rem] bg-[#fff3e3] p-3 text-[#1a0b0e] dark:bg-[#241113] dark:text-[#fff7eb]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">{index + 1}</span><p className="text-sm font-bold">{item}</p></div>)}</div></div>
          </section>
        )}
      </main>
    </div>
  );
}
