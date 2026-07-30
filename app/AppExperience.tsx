"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock3,
  Film,
  Globe2,
  Layers3,
  Mail,
  Menu,
  MessageCircle,
  Mic2,
  Moon,
  Palette,
  Phone,
  Play,
  PlayCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  WandSparkles,
  X,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeProvider";

type PortfolioItem = {
  id?: string;
  src: string;
  titleEN?: string;
  descEN?: string;
  titleMM?: string;
  descMM?: string;
  featured?: boolean;
};

type LocalProfile = {
  displayName: string;
  email: string;
  company: string;
};

type ContactAction = {
  label: string;
  detail: string;
  href: string;
  icon: typeof Send;
  external?: boolean;
};

const PROFILE_STORAGE_KEY = "bas_website_profile";
const HERO_VIDEO_ID = "DVM3o2Wqcys";
const RETIRED_WEBSITE_VIDEO_IDS = new Set(["IrukbYGHhQs", "T9p2lqcETCE", "wJjyMQ3bjt4"]);

const fallbackPortfolio: PortfolioItem[] = [
  {
    id: "mahura-myaing",
    src: HERO_VIDEO_ID,
    titleEN: "Cinematic Trailer · Mahura Myaing",
    descEN: "A cinematic AI film crafted by Burma AI Studio",
    titleMM: "Cinematic Trailer · Mahura Myaing",
    descMM: "Burma AI Studio မှ ဖန်တီးထားသော cinematic AI film",
    featured: true,
  },
];

const copy = {
  EN: {
    navHome: "Home",
    navServices: "Services",
    navWork: "Work",
    navChat: "Chat",
    appLabel: "Native Studio App",
    homeTitle: "Studio Home",
    servicesTitle: "Creative Services",
    workTitle: "Selected Work",
    chatTitle: "Project Studio",
    heroEyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    heroLine1: "Make Every Frame",
    heroLine2: "Feel Expensive.",
    heroDescription:
      "Premium AI films, product stories and presenter campaigns shaped with cinematic direction — built to make your brand look sharper, bigger and impossible to ignore.",
    startProject: "Start a Project",
    watchWork: "Watch Our Work",
    metrics: [
      ["100+", "Videos crafted"],
      ["48h", "Fast turnaround"],
      ["Pro", "Creative direction"],
    ],
    creativeKicker: "CREATIVE SYSTEM",
    creativeTitle: "One studio. Four powerful ways to make your brand move.",
    servicesIntro:
      "Four premium production tracks for brands that want cinematic presence, faster execution and a visual language that feels deliberately high-end.",
    services: [
      {
        title: "Cinematic Brand Films",
        short: "Brand Film",
        description:
          "High-impact brand stories with dramatic visual direction, premium product framing and cinematic pacing built to elevate perception.",
      },
      {
        title: "AI Presenter Campaigns",
        short: "Presenter",
        description:
          "Natural Burmese and English presenters for launches, explainers, offers and trust-building campaigns with a polished commercial finish.",
      },
      {
        title: "Architecture & Process Films",
        short: "Process",
        description:
          "Clear, sophisticated visual storytelling for property, engineering, factories, systems and complex processes.",
      },
      {
        title: "TikTok / Reels Performance Shorts",
        short: "Short Form",
        description:
          "Fast hooks, sharp scripts and vertical-first creative direction designed to stop the scroll without making your brand look cheap.",
      },
    ],
    flowKicker: "PRODUCTION FLOW",
    flowTitle: "Fast enough for social. Polished enough for a flagship campaign.",
    flow: [
      ["Brief", "Share the goal, audience, platform and product. We turn it into a focused creative direction."],
      ["Build", "Script, visual language, AI production and cinematic polish are developed as one cohesive system."],
      ["Launch", "Review, refine and receive the final campaign-ready video for the platforms that matter."],
    ],
    selectedWork: "Curated Showreel",
    workDescription:
      "A focused collection of approved Burma AI Studio films. Tap a film to watch it inside the app.",
    playFilm: "Play film",
    projectKicker: "DIRECT STUDIO LINE",
    projectHeadline: "Bring us the brief. We’ll build the visual world.",
    projectDescription:
      "Send your product, platform, duration, style and deadline. The studio will guide the next step clearly.",
    projectChecklist: ["Product or brand", "Target platform", "Duration and deadline", "Reference style"],
    askAi: "Ask Burma AI",
    directContact: "Direct contact",
    settings: "App Settings",
    settingsHint: "Personalize your studio workspace",
    appearance: "Appearance",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    myanmar: "Myanmar",
    projectCenter: "Project Center",
    projectCenterHint: "Portfolio and new project request",
    legal: "Legal & Privacy",
    legalHint: "Policies and data choices",
    workspace: "Burma AI Studio Workspace",
    guest: "App workspace",
    close: "Close",
    productionReady: "Production ready",
    exploreWork: "Explore work",
  },
  MM: {
    navHome: "ပင်မ",
    navServices: "ဝန်ဆောင်မှု",
    navWork: "လက်ရာ",
    navChat: "ဆက်သွယ်",
    appLabel: "Native Studio App",
    homeTitle: "Studio Home",
    servicesTitle: "Creative Services",
    workTitle: "ရွေးချယ်ထားသော လက်ရာများ",
    chatTitle: "Project Studio",
    heroEyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    heroLine1: "Brand ကို မြင်တာနဲ့",
    heroLine2: "မှတ်မိသွားစေမယ့် AI Video.",
    heroDescription:
      "Cinematic direction၊ premium visual language နဲ့ AI production ကိုပေါင်းစပ်ပြီး Brand ကို ပိုကြီး၊ ပိုခိုင်မာ၊ ပိုမှတ်မိလွယ်အောင် Video Campaign တွေဖန်တီးပေးပါတယ်။",
    startProject: "Project စတင်ရန်",
    watchWork: "လက်ရာများကြည့်ရန်",
    metrics: [
      ["100+", "ဖန်တီးပြီး Video"],
      ["48h", "Fast turnaround"],
      ["Pro", "Creative direction"],
    ],
    creativeKicker: "CREATIVE SYSTEM",
    creativeTitle: "Studio တစ်ခုတည်းနဲ့ Brand ကို လှုပ်ရှားစေမယ့် powerful direction လေးမျိုး။",
    servicesIntro:
      "Social media၊ local business ad နဲ့ premium brand presentation အတွက် လိုချင်တဲ့ video direction ကို ရွေးချယ်နိုင်ပါတယ်။",
    services: [
      {
        title: "Cinematic Commercials",
        short: "Brand Film",
        description:
          "Brand ad၊ product highlight နဲ့ offer campaign တွေအတွက် ရုပ်ရှင်ဆန်ဆန် visual flow နဲ့ဖန်တီးပေးပါတယ်။",
      },
      {
        title: "AI Presenter Campaigns",
        short: "Presenter",
        description:
          "မြန်မာ/English AI presenter နဲ့ explain၊ launch၊ offer နဲ့ trust-building video တွေဖန်တီးပေးပါတယ်။",
      },
      {
        title: "Architecture & Process Videos",
        short: "Process",
        description:
          "အဆောက်အဦး၊ water system၊ factory၊ real estate နဲ့ process animation တွေအတွက် ရှင်းလင်းတဲ့ video direction ဖန်တီးပေးပါတယ်။",
      },
      {
        title: "TikTok / Reels Shorts",
        short: "Short Form",
        description:
          "Hook ကောင်း၊ script တို၊ vertical video direction နဲ့ posting-ready short ads တွေဖန်တီးပေးပါတယ်။",
      },
    ],
    flowKicker: "PRODUCTION FLOW",
    flowTitle: "Social အတွက်မြန်ပြီး flagship campaign အတွက် premium ဖြစ်တဲ့ workflow.",
    flow: [
      ["Brief", "Goal၊ audience၊ platform နဲ့ product ကိုပြောပါ။ Focused creative direction အဖြစ် ပြောင်းပေးမယ်။"],
      ["Build", "Script၊ visual language၊ AI production နဲ့ cinematic polish ကို system တစ်ခုတည်းအဖြစ် တည်ဆောက်ပေးမယ်။"],
      ["Launch", "Review၊ refine ပြီး platform-ready final campaign video ကို ရယူနိုင်ပါတယ်။"],
    ],
    selectedWork: "Curated Showreel",
    workDescription:
      "Burma AI Studio ရဲ့ အတည်ပြုထားသော cinematic film များကို App ထဲကနေ တိုက်ရိုက်ကြည့်နိုင်ပါတယ်။",
    playFilm: "Video ကြည့်ရန်",
    projectKicker: "DIRECT STUDIO LINE",
    projectHeadline: "Project brief ကိုပို့ပါ။ Visual world ကို တည်ဆောက်ပေးမယ်။",
    projectDescription:
      "Product၊ platform၊ duration၊ style နဲ့ deadline ကိုပို့ပါ။ နောက်တစ်ဆင့်ကို Studio က သေချာလမ်းညွှန်ပေးပါမယ်။",
    projectChecklist: ["Product / Brand", "Target platform", "Duration / Deadline", "Reference style"],
    askAi: "Burma AI ကိုမေးရန်",
    directContact: "တိုက်ရိုက်ဆက်သွယ်ရန်",
    settings: "App Settings",
    settingsHint: "Studio workspace ကို စိတ်ကြိုက်ပြင်ဆင်ရန်",
    appearance: "Appearance",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    myanmar: "မြန်မာ",
    projectCenter: "Project Center",
    projectCenterHint: "Portfolio နဲ့ Project အသစ်တင်ရန်",
    legal: "Legal & Privacy",
    legalHint: "Policy နဲ့ Data choices",
    workspace: "Burma AI Studio Workspace",
    guest: "App workspace",
    close: "ပိတ်ရန်",
    productionReady: "Production ready",
    exploreWork: "လက်ရာကြည့်ရန်",
  },
} as const;

const serviceIcons = [Clapperboard, Mic2, Building2, Film] as const;

function useAppMode() {
  const [appMode, setAppMode] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");

    const check = () => {
      const search = new URLSearchParams(window.location.search);
      const userAgent = navigator.userAgent || "";
      const hasCapacitor = typeof (window as Window & { Capacitor?: unknown }).Capacitor !== "undefined";
      const isAndroidWebView =
        /Android/i.test(userAgent) &&
        (/; wv\)/i.test(userAgent) || /Version\/\d+(\.\d+)?/i.test(userAgent));
      const explicitAppMode =
        search.get("source") === "pwa" ||
        search.get("source") === "app" ||
        search.get("source") === "native" ||
        search.get("platform") === "android" ||
        search.get("platform") === "ios" ||
        localStorage.getItem("bas-app-mode") === "native";

      if (hasCapacitor || isAndroidWebView || explicitAppMode) {
        localStorage.setItem("bas-app-mode", "native");
      }

      const enabled =
        window.innerWidth < 900 &&
        (media.matches || hasCapacitor || isAndroidWebView || explicitAppMode);

      setAppMode(enabled);
      document.body.classList.toggle("bas-app-mode", enabled);
    };

    check();
    window.addEventListener("resize", check, { passive: true });
    media.addEventListener?.("change", check);

    return () => {
      window.removeEventListener("resize", check);
      media.removeEventListener?.("change", check);
      document.body.classList.remove("bas-app-mode");
    };
  }, []);

  return appMode;
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

function AppBrand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#e4c993]/60 bg-[#fffaf0] shadow-[0_8px_24px_rgba(26,11,14,0.10)] dark:border-[#6b4b2a] dark:bg-[#1a0b0e]">
        <img src="/apple-touch-icon.png?v=10" alt="Burma AI Studio" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-black leading-none tracking-[-0.02em] text-[#1a0b0e] dark:text-[#fff7eb]">Burma AI Studio</p>
        <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.18em] text-[#9b7a47] dark:text-[#e3bc61]">Cinematic AI Production</p>
      </div>
    </div>
  );
}

function SettingsDrawer({ open, onClose, activeLang }: { open: boolean; onClose: () => void; activeLang: "EN" | "MM" }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const t = copy[activeLang];
  const isDark = theme === "dark";
  const [profile, setProfile] = useState<LocalProfile>({ displayName: "Burma AI Studio Client", email: "", company: "" });

  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LocalProfile>;
      setProfile({
        displayName: parsed.displayName?.trim() || "Burma AI Studio Client",
        email: parsed.email || "",
        company: parsed.company || "",
      });
    } catch {
      // Keep safe local defaults.
    }
  }, [open]);

  const initials = useMemo(() => {
    const value = profile.displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    return value || "BA";
  }, [profile.displayName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10030] flex justify-end">
      <button type="button" aria-label={t.close} onClick={onClose} className="absolute inset-0 bg-[#100708]/55 backdrop-blur-sm" />
      <aside className="relative flex h-full w-[min(22rem,92vw)] flex-col border-l border-[#ead9bd] bg-[#fffaf3] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+0.8rem)] text-[#1a0b0e] shadow-[-28px_0_80px_rgba(26,11,14,0.28)] dark:border-[#4b2a1d] dark:bg-[#100708] dark:text-[#fff7eb]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">{t.settings}</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">{t.workspace}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ead9bd] bg-white text-[#1a0b0e] active:scale-95 dark:border-[#5a3928] dark:bg-[#1a0b0e] dark:text-[#fff7eb]" aria-label={t.close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[1.55rem] border border-[#ead9bd] bg-white p-4 shadow-sm dark:border-[#5a3928] dark:bg-[#1a0b0e]">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#911923] text-sm font-black text-white dark:bg-[#e3bc61] dark:text-[#100708]">{initials}</div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-black">{profile.displayName}</p>
            <p className="mt-1 truncate text-xs font-semibold text-[#7d6b5f] dark:text-[#d8c4a3]">{profile.email || profile.company || t.guest}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 overflow-y-auto pb-4">
          <section className="rounded-[1.55rem] border border-[#ead9bd] bg-white p-3 dark:border-[#5a3928] dark:bg-[#1a0b0e]">
            <p className="mb-2 flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]"><Palette className="h-4 w-4" />{t.appearance}</p>
            <button type="button" onClick={toggleTheme} className="flex w-full items-center justify-between rounded-2xl bg-[#fff6e8] px-3 py-3 text-sm font-black dark:bg-[#241113]">
              <span className="flex items-center gap-2">{isDark ? <Moon className="h-5 w-5 text-[#e3bc61]" /> : <Sun className="h-5 w-5 text-[#be9537]" />}{isDark ? t.dark : t.light}</span>
              <span className="rounded-full bg-[#be9537] px-3 py-1 text-[10px] font-black text-[#100708]">Change</span>
            </button>
          </section>

          <section className="rounded-[1.55rem] border border-[#ead9bd] bg-white p-3 dark:border-[#5a3928] dark:bg-[#1a0b0e]">
            <p className="mb-2 flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]"><Globe2 className="h-4 w-4" />{t.language}</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => lang !== "EN" && toggleLang()} className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-black ${lang === "EN" ? "bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]" : "bg-[#fff6e8] dark:bg-[#241113]"}`}>{lang === "EN" && <Check className="h-4 w-4" />}{t.english}</button>
              <button type="button" onClick={() => lang !== "MM" && toggleLang()} className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-black ${lang === "MM" ? "bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]" : "bg-[#fff6e8] dark:bg-[#241113]"}`}>{lang === "MM" && <Check className="h-4 w-4" />}{t.myanmar}</button>
            </div>
          </section>

          <Link href="/portfolio" onClick={onClose} className="flex items-center gap-3 rounded-[1.35rem] border border-[#ead9bd] bg-white p-3.5 shadow-sm active:scale-[0.99] dark:border-[#5a3928] dark:bg-[#1a0b0e]">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff3e3] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]"><Layers3 className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm font-black">{t.projectCenter}</strong><small className="mt-1 block truncate text-[11px] font-semibold text-[#7d6b5f] dark:text-[#d8c4a3]">{t.projectCenterHint}</small></span>
            <ChevronRight className="h-4 w-4 opacity-45" />
          </Link>

          <Link href="/legal" onClick={onClose} className="flex items-center gap-3 rounded-[1.35rem] border border-[#ead9bd] bg-white p-3.5 shadow-sm active:scale-[0.99] dark:border-[#5a3928] dark:bg-[#1a0b0e]">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff3e3] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]"><ShieldCheck className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm font-black">{t.legal}</strong><small className="mt-1 block truncate text-[11px] font-semibold text-[#7d6b5f] dark:text-[#d8c4a3]">{t.legalHint}</small></span>
            <ChevronRight className="h-4 w-4 opacity-45" />
          </Link>
        </div>
      </aside>
    </div>
  );
}

function AppHeader({ title, activeLang }: { title: string; activeLang: "EN" | "MM" }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = copy[activeLang];

  return (
    <>
      <header className="shrink-0 border-b border-[#ead9bd]/80 bg-[#fffaf3]/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.65rem)] backdrop-blur-2xl dark:border-[#4b2a1d] dark:bg-[#100708]/95">
        <div className="flex items-center justify-between gap-3">
          <AppBrand />
          <button type="button" onClick={() => setSettingsOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#ead9bd] bg-white text-[#911923] shadow-sm transition active:scale-95 dark:border-[#5a3928] dark:bg-[#1a0b0e] dark:text-[#e3bc61]" aria-label={t.settings}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9b7a47] dark:text-[#e3bc61]">{t.appLabel}</p>
            <h1 className="mt-1 truncate text-[1.35rem] font-black leading-none tracking-[-0.04em] text-[#1a0b0e] dark:text-[#fff7eb]">{title}</h1>
          </div>
          <span className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-[#be9537]/25 bg-[#fff3e3] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#7d5318] dark:border-[#e3bc61]/25 dark:bg-[#241113] dark:text-[#e3bc61]"><Sparkles className="h-3 w-3" />v3.0</span>
        </div>
      </header>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} activeLang={activeLang} />
    </>
  );
}

function MetricCard({ value, label, index }: { value: string; label: string; index: number }) {
  const icons = [BadgeCheck, Clock3, WandSparkles] as const;
  const Icon = icons[index] || Sparkles;
  return (
    <article className="min-w-0 rounded-[1.35rem] border border-[#ead9bd] bg-[#fffdf8] p-3 shadow-[0_8px_28px_rgba(26,11,14,0.06)] dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
      <Icon className="h-4 w-4 text-[#be9537] dark:text-[#e3bc61]" />
      <p className="mt-2 text-xl font-black tracking-[-0.04em] text-[#1a0b0e] dark:text-[#fff7eb]">{value}</p>
      <p className="mt-0.5 line-clamp-2 text-[9px] font-black uppercase leading-[1.25] tracking-[0.09em] text-[#7d6b5f] dark:text-[#d8c4a3]">{label}</p>
    </article>
  );
}

function HomeScreen({ activeLang }: { activeLang: "EN" | "MM" }) {
  const t = copy[activeLang];
  const openAssistant = () => window.dispatchEvent(new CustomEvent("bas-open-assistant"));

  return (
    <section className="space-y-5">
      <article className="relative isolate min-h-[31rem] overflow-hidden rounded-[2.15rem] bg-[#100708] shadow-[0_24px_70px_rgba(26,11,14,0.30)]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${HERO_VIDEO_ID}/maxresdefault.jpg)` }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,7,8,0.28)_0%,rgba(16,7,8,0.74)_48%,rgba(16,7,8,0.98)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_15%_0%,rgba(227,188,97,0.32),transparent_60%)]" />

        <div className="relative flex min-h-[31rem] flex-col justify-end p-5 text-white">
          <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.19em] text-[#f3d88c]"><Sparkles className="h-3.5 w-3.5" />{t.heroEyebrow}</p>
          <h2 className={`mt-4 text-[2.85rem] font-black leading-[0.93] tracking-[-0.065em] ${activeLang === "MM" ? "text-[2.35rem] leading-[1.08]" : ""}`}>
            <span className="block">{t.heroLine1}</span>
            <span className="mt-1 block text-[#e3bc61]">{t.heroLine2}</span>
          </h2>
          <p className="mt-4 text-[13px] font-semibold leading-[1.65] text-white/78">{t.heroDescription}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#a51624] px-3 text-[12px] font-black text-white shadow-[0_14px_32px_rgba(165,22,36,0.34)] active:scale-[0.98]">
              <MessageCircle className="h-4 w-4" />{t.startProject}<ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/portfolio" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-3 text-[12px] font-black text-white backdrop-blur-md active:scale-[0.98]">
              <PlayCircle className="h-4 w-4" />{t.watchWork}
            </Link>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-3 gap-2.5">
        {t.metrics.map(([value, label], index) => <MetricCard key={value} value={value} label={label} index={index} />)}
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-4 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">{t.creativeKicker}</p>
            <h3 className="mt-2 text-[1.55rem] font-black leading-[1.08] tracking-[-0.045em] text-[#1a0b0e] dark:text-[#fff7eb]">{t.creativeTitle}</h3>
          </div>
          <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#be9537] dark:text-[#e3bc61]" />
        </div>

        <div className="mt-4 -mr-4 flex snap-x gap-3 overflow-x-auto pb-1 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {t.services.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <Link key={service.title} href="/services" className="min-w-[76%] snap-start rounded-[1.55rem] border border-[#ead9bd] bg-[#fff7ed] p-4 active:scale-[0.99] dark:border-[#5a3928] dark:bg-[#241113]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]"><Icon className="h-5 w-5" /></span>
                  <span className="text-[10px] font-black text-[#9b7a47] dark:text-[#e3bc61]">0{index + 1}</span>
                </div>
                <h4 className="mt-4 text-lg font-black leading-tight text-[#1a0b0e] dark:text-[#fff7eb]">{service.title}</h4>
                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-relaxed text-[#7d6b5f] dark:text-[#d8c4a3]">{service.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_20px_55px_rgba(26,11,14,0.18)] dark:border dark:border-[#5a3928]">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#e3bc61]">{t.flowKicker}</p>
        <h3 className="mt-2 text-[1.55rem] font-black leading-[1.08] tracking-[-0.04em]">{t.flowTitle}</h3>
        <div className="mt-5 space-y-3">
          {t.flow.map(([title, description], index) => (
            <article key={title} className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e3bc61] text-xs font-black text-[#100708]">0{index + 1}</span>
              <div><h4 className="text-sm font-black">{title}</h4><p className="mt-1 text-[11px] font-semibold leading-relaxed text-white/65">{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <button type="button" onClick={openAssistant} className="flex w-full items-center justify-between rounded-[1.7rem] bg-[#a51624] p-4 text-left text-white shadow-[0_18px_40px_rgba(165,22,36,0.26)] active:scale-[0.99]">
        <span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12"><Sparkles className="h-5 w-5" /></span><span><strong className="block text-sm font-black">{t.askAi}</strong><small className="mt-1 block text-[10px] font-semibold text-white/70">Script · Concept · Creative direction</small></span></span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function ServicesScreen({ activeLang }: { activeLang: "EN" | "MM" }) {
  const t = copy[activeLang];

  return (
    <section className="space-y-4">
      <header className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-5 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3e3] px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]"><Sparkles className="h-3.5 w-3.5" />Creative Capabilities</span>
        <h2 className="mt-4 text-[2.15rem] font-black leading-[0.98] tracking-[-0.055em] text-[#1a0b0e] dark:text-[#fff7eb]">AI Video <span className="text-[#911923] dark:text-[#e3bc61]">Creative Systems</span></h2>
        <p className="mt-3 text-[13px] font-semibold leading-relaxed text-[#7d6b5f] dark:text-[#d8c4a3]">{t.servicesIntro}</p>
      </header>

      {t.services.map((service, index) => {
        const Icon = serviceIcons[index];
        return (
          <article key={service.title} className="overflow-hidden rounded-[1.8rem] border border-[#ead9bd] bg-[#fffdf8] p-4 shadow-[0_12px_38px_rgba(26,11,14,0.07)] dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#911923] text-white shadow-lg shadow-[#911923]/15 dark:bg-[#e3bc61] dark:text-[#100708]"><Icon className="h-6 w-6" /></span>
              <span className="rounded-full bg-[#fff3e3] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{service.short}</span>
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight tracking-[-0.03em] text-[#1a0b0e] dark:text-[#fff7eb]">{service.title}</h3>
            <p className="mt-2 text-[12px] font-semibold leading-[1.65] text-[#7d6b5f] dark:text-[#d8c4a3]">{service.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-[#ead9bd] pt-4 dark:border-white/10">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-[#9b7a47] dark:text-[#e3bc61]"><CheckCircle2 className="h-4 w-4" />{t.productionReady}</span>
              <Link href="/portfolio" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1a0b0e] px-3 text-[10px] font-black text-white active:scale-95 dark:bg-[#e3bc61] dark:text-[#100708]">{t.exploreWork}<ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </article>
        );
      })}

      <Link href="/contact" className="flex items-center justify-between rounded-[1.7rem] bg-[#a51624] p-4 text-white shadow-[0_18px_40px_rgba(165,22,36,0.24)] active:scale-[0.99]">
        <span><span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#f3d88c]">Next Project</span><strong className="mt-1 block text-base font-black">{t.startProject}</strong></span>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </section>
  );
}

function WorkScreen({ activeLang, items, onPlay }: { activeLang: "EN" | "MM"; items: PortfolioItem[]; onPlay: (item: PortfolioItem) => void }) {
  const t = copy[activeLang];

  return (
    <section className="space-y-4">
      <header className="overflow-hidden rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_22px_58px_rgba(26,11,14,0.24)] dark:border dark:border-[#5a3928]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#e3bc61]"><PlayCircle className="h-3.5 w-3.5" />{t.selectedWork}</span>
        <h2 className="mt-4 text-[2.2rem] font-black leading-[0.98] tracking-[-0.055em]">Selected <span className="text-[#e3bc61]">AI Films</span></h2>
        <p className="mt-3 text-[13px] font-semibold leading-relaxed text-white/68">{t.workDescription}</p>
      </header>

      {items.map((item, index) => {
        const videoId = cleanYoutubeId(item.src);
        const title = activeLang === "MM" ? item.titleMM || item.titleEN : item.titleEN || item.titleMM;
        const description = activeLang === "MM" ? item.descMM || item.descEN : item.descEN || item.descMM;
        return (
          <button key={item.id || item.src} type="button" onClick={() => onPlay(item)} className="group w-full overflow-hidden rounded-[1.85rem] border border-[#ead9bd] bg-[#fffdf8] text-left shadow-[0_14px_42px_rgba(26,11,14,0.09)] active:scale-[0.995] dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
            <div className="relative aspect-video overflow-hidden bg-[#100708]">
              <img src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} alt="" className="h-full w-full object-cover transition duration-500 group-active:scale-[1.02]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(16,7,8,0.72)_100%)]" />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-[#a51624] text-white shadow-[0_18px_45px_rgba(0,0,0,0.34)]"><Play className="ml-1 h-6 w-6 fill-current" /></span>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">0{index + 1}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-black leading-tight tracking-[-0.03em] text-[#1a0b0e] dark:text-[#fff7eb]">{title || "AI Film"}</h3>
              <p className="mt-2 text-[12px] font-semibold leading-relaxed text-[#7d6b5f] dark:text-[#d8c4a3]">{description || "Burma AI Studio"}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#911923] dark:text-[#e3bc61]"><PlayCircle className="h-4 w-4" />{t.playFilm}</span>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function ContactScreen({ activeLang }: { activeLang: "EN" | "MM" }) {
  const t = copy[activeLang];
  const openAssistant = () => window.dispatchEvent(new CustomEvent("bas-open-assistant"));
  const actions: ContactAction[] = [
    { label: "Telegram", detail: "+95 9 671 010 011", href: "tg://resolve?phone=959671010011", icon: Send },
    { label: "Phone", detail: "09 671 010 011", href: "tel:09671010011", icon: Phone },
    { label: "Email", detail: "okaung717@gmail.com", href: "mailto:okaung717@gmail.com", icon: Mail },
    { label: "Facebook", detail: "Burma AI Studio", href: "https://www.facebook.com/BurmaAiaStudio/", icon: MessageCircle, external: true },
  ];

  return (
    <section className="space-y-4">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#1a0b0e] p-5 text-white shadow-[0_22px_58px_rgba(26,11,14,0.24)] dark:border dark:border-[#5a3928]">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#e3bc61]/12 blur-2xl" />
        <p className="relative text-[9px] font-black uppercase tracking-[0.2em] text-[#e3bc61]">{t.projectKicker}</p>
        <h2 className="relative mt-3 text-[2.15rem] font-black leading-[0.98] tracking-[-0.055em]">{t.projectHeadline}</h2>
        <p className="relative mt-4 text-[13px] font-semibold leading-[1.7] text-white/68">{t.projectDescription}</p>
      </header>

      <section className="rounded-[1.8rem] border border-[#ead9bd] bg-[#fffdf8] p-4 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">Project Brief</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {t.projectChecklist.map((item, index) => (
            <div key={item} className="flex min-h-16 items-center gap-2.5 rounded-[1.2rem] bg-[#fff3e3] p-3 dark:bg-[#241113]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#be9537] text-[10px] font-black text-[#100708]">{index + 1}</span>
              <span className="text-[11px] font-black leading-tight text-[#1a0b0e] dark:text-[#fff7eb]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <p className="px-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">{t.directContact}</p>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <a key={action.label} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noopener noreferrer" : undefined} className="flex min-h-[4.65rem] items-center gap-3 rounded-[1.45rem] border border-[#ead9bd] bg-[#fffdf8] p-3.5 shadow-sm active:scale-[0.99] dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]"><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><strong className="block text-sm font-black text-[#1a0b0e] dark:text-[#fff7eb]">{action.label}</strong><small className="mt-1 block truncate text-[11px] font-semibold text-[#7d6b5f] dark:text-[#d8c4a3]">{action.detail}</small></span>
              <ArrowRight className="h-4 w-4 text-[#be9537] dark:text-[#e3bc61]" />
            </a>
          );
        })}
      </section>

      <button type="button" onClick={openAssistant} className="flex w-full items-center justify-between rounded-[1.7rem] bg-[#a51624] p-4 text-left text-white shadow-[0_18px_40px_rgba(165,22,36,0.26)] active:scale-[0.99]">
        <span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12"><Sparkles className="h-5 w-5" /></span><span><strong className="block text-sm font-black">{t.askAi}</strong><small className="mt-1 block text-[10px] font-semibold text-white/70">Always available in the app</small></span></span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function VideoModal({ item, activeLang, onClose }: { item: PortfolioItem | null; activeLang: "EN" | "MM"; onClose: () => void }) {
  if (!item) return null;
  const videoId = cleanYoutubeId(item.src);
  const title = activeLang === "MM" ? item.titleMM || item.titleEN : item.titleEN || item.titleMM;

  return (
    <div className="fixed inset-0 z-[10040] flex flex-col bg-[#080405] text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.7rem)]">
        <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#e3bc61]">Burma AI Studio Film</p><h2 className="mt-1 truncate text-base font-black">{title || "AI Film"}</h2></div>
        <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/8 active:scale-95" aria-label="Close video"><X className="h-5 w-5" /></button>
      </header>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        <iframe title={title || "Burma AI Studio film"} src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`} className="aspect-video w-full rounded-[1.4rem] border border-white/10 bg-black shadow-2xl" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
      <div className="shrink-0 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
        <button type="button" onClick={onClose} className="min-h-12 w-full rounded-2xl bg-[#a51624] text-sm font-black text-white">Close Film</button>
      </div>
    </div>
  );
}

export default function AppExperience() {
  const appMode = useAppMode();
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const t = copy[activeLang];
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackPortfolio);
  const [activeVideo, setActiveVideo] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (!appMode || !pathname.startsWith("/portfolio")) return;
    let alive = true;

    fetch("/api/portfolio", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { items?: PortfolioItem[] }) => {
        if (!alive || !Array.isArray(data.items)) return;
        const curated = data.items.filter((item) => item?.src && !RETIRED_WEBSITE_VIDEO_IDS.has(cleanYoutubeId(item.src)));
        setPortfolioItems(curated.length ? curated.slice(0, 8) : fallbackPortfolio);
      })
      .catch(() => alive && setPortfolioItems(fallbackPortfolio));

    return () => {
      alive = false;
    };
  }, [appMode, pathname]);

  useEffect(() => {
    setActiveVideo(null);
  }, [pathname]);

  const currentTitle = useMemo(() => {
    if (pathname.startsWith("/services")) return t.servicesTitle;
    if (pathname.startsWith("/portfolio")) return t.workTitle;
    if (pathname.startsWith("/contact") || pathname.startsWith("/chat")) return t.chatTitle;
    return t.homeTitle;
  }, [pathname, t]);

  if (!appMode) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex flex-col overflow-hidden bg-[#fff9f0] text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <AppHeader title={currentTitle} activeLang={activeLang} />
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-[calc(env(safe-area-inset-bottom,0px)+7.4rem)] pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pathname.startsWith("/services") ? (
          <ServicesScreen activeLang={activeLang} />
        ) : pathname.startsWith("/portfolio") ? (
          <WorkScreen activeLang={activeLang} items={portfolioItems} onPlay={setActiveVideo} />
        ) : pathname.startsWith("/contact") || pathname.startsWith("/chat") ? (
          <ContactScreen activeLang={activeLang} />
        ) : (
          <HomeScreen activeLang={activeLang} />
        )}
      </main>
      <VideoModal item={activeVideo} activeLang={activeLang} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
