"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clapperboard,
  Clock3,
  Film,
  Globe2,
  Home,
  LockKeyhole,
  Mail,
  MessageCircle,
  Mic2,
  Moon,
  Play,
  PlaySquare,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UserRound,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeProvider";
import "./apk-v2-experience.css";

type Lang = "EN" | "MM";
type AuthMode = "signin" | "signup";
type PortfolioItem = {
  id: string;
  src: string;
  titleEN: string;
  descEN: string;
  titleMM: string;
  descMM: string;
};

const HERO_VIDEO_ID = "DVM3o2Wqcys";
const PROFILE_KEY = "bas_website_profile";

const copy = {
  EN: {
    studio: "Mobile Creative Studio",
    home: "Home",
    services: "Services",
    work: "Work",
    stories: "Stories",
    plans: "Plans",
    chat: "Chat",
    profile: "Profile",
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    hero1: "Make every frame",
    hero2: "feel expensive.",
    heroText: "Premium AI films, cinematic campaigns and original stories — shaped with human creative direction for brands that want to be remembered.",
    start: "Start a project",
    watch: "Watch our work",
    metrics: ["Videos crafted", "Fast turnaround", "Creative direction"],
    creativeSystem: "Creative system",
    creativeTitle: "One studio. Four powerful ways to make your brand move.",
    serviceNames: ["Cinematic brand films", "AI presenter campaigns", "Architecture & process films", "TikTok / Reels performance shorts"],
    serviceDescriptions: [
      "High-impact brand stories with dramatic direction, premium product framing and cinematic pacing.",
      "Natural Burmese and English presenters for launches, explainers, offers and trust-building campaigns.",
      "Clear visual storytelling for property, engineering, factories, systems and complex processes.",
      "Fast hooks, sharp scripts and vertical-first creative direction designed to stop the scroll.",
    ],
    productionFlow: "Production flow",
    flowTitle: "Fast enough for social. Polished enough for a flagship campaign.",
    flow: [
      ["Brief", "Share the goal, audience, platform and product."],
      ["Build", "Script, visual language, AI production and cinematic polish are developed together."],
      ["Launch", "Review, refine and receive the final campaign-ready video."],
    ],
    portfolioTitle: "Selected cinematic directions",
    storiesTitle: "Original stories, one episode at a time.",
    storiesText: "Burma AI Studio Originals will appear here as new films and series are released.",
    comingSoon: "Coming soon",
    plansTitle: "Choose how you want to work with the studio.",
    planNames: ["Project Start", "Studio Pro", "Brand Partner"],
    planTexts: ["For one focused campaign or launch.", "For brands creating content regularly.", "For businesses managing multiple campaigns."],
    planLabels: ["Project-based", "Ongoing production", "Custom partnership"],
    contactTitle: "Bring us the brief. We’ll build the visual world.",
    contactText: "Send your product, platform, duration, style and deadline. The studio will guide the next step clearly.",
    settings: "Studio settings",
    theme: "Appearance",
    language: "Language",
    legal: "Legal & privacy",
    logout: "Log out",
    createAccount: "Create account",
    signIn: "Sign in",
    welcome: "Enter your creative studio.",
    introText: "Your premium mobile workspace for AI films, brand campaigns, original stories and direct studio communication.",
    name: "Your name",
    email: "Email address",
    password: "Password",
    continue: "Continue to studio",
    switchSignIn: "Already have an account? Sign in",
    switchSignUp: "New here? Create an account",
  },
  MM: {
    studio: "Mobile Creative Studio",
    home: "ပင်မ",
    services: "ဝန်ဆောင်မှု",
    work: "လက်ရာ",
    stories: "ဇာတ်လမ်း",
    plans: "Plans",
    chat: "Chat",
    profile: "Profile",
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    hero1: "Brand ကို မြင်တာနဲ့",
    hero2: "မှတ်မိသွားစေမယ့် AI Video.",
    heroText: "Cinematic direction၊ premium visual language နဲ့ AI production ကိုပေါင်းစပ်ပြီး Brand ကို ပိုကြီး၊ ပိုခိုင်မာ၊ ပိုမှတ်မိလွယ်အောင် ဖန်တီးပေးပါတယ်။",
    start: "Project စတင်ရန်",
    watch: "လက်ရာများကြည့်ရန်",
    metrics: ["ဖန်တီးပြီး Video", "Fast turnaround", "Creative direction"],
    creativeSystem: "Creative system",
    creativeTitle: "Studio တစ်ခုတည်းနဲ့ Brand ကို လှုပ်ရှားစေမယ့် powerful direction လေးမျိုး။",
    serviceNames: ["Cinematic brand films", "AI presenter campaigns", "Architecture & process films", "TikTok / Reels performance shorts"],
    serviceDescriptions: [
      "Brand ad နဲ့ product campaign တွေအတွက် cinematic visual direction ဖန်တီးပေးပါတယ်။",
      "မြန်မာနဲ့ English presenter campaigns တွေအတွက် polished commercial finish ဖန်တီးပေးပါတယ်။",
      "Property၊ engineering၊ factory နဲ့ complex process တွေအတွက် ရှင်းလင်းတဲ့ visual storytelling ဖန်တီးပေးပါတယ်။",
      "Hook ကောင်း၊ script တိုနဲ့ vertical-first short videos တွေဖန်တီးပေးပါတယ်။",
    ],
    productionFlow: "Production flow",
    flowTitle: "Social အတွက်မြန်ပြီး flagship campaign အတွက် premium ဖြစ်တဲ့ workflow.",
    flow: [
      ["Brief", "Goal၊ audience၊ platform နဲ့ product ကိုပြောပါ။"],
      ["Build", "Script၊ visual language၊ AI production နဲ့ cinematic polish ကို တစ်ခုတည်းအဖြစ်တည်ဆောက်မယ်။"],
      ["Launch", "Review၊ refine ပြီး final campaign video ကိုရယူပါ။"],
    ],
    portfolioTitle: "ရွေးချယ်နိုင်တဲ့ Cinematic Direction များ",
    storiesTitle: "Original ဇာတ်လမ်းတွေကို အပိုင်းလိုက်ကြည့်ပါ။",
    storiesText: "Burma AI Studio Original Films နဲ့ Series အသစ်တွေ ထုတ်လွှင့်တိုင်း ဒီနေရာမှာပေါ်လာမယ်။",
    comingSoon: "မကြာမီလာမည်",
    plansTitle: "Studio နဲ့ လက်တွဲမယ့် ပုံစံကိုရွေးပါ။",
    planNames: ["Project Start", "Studio Pro", "Brand Partner"],
    planTexts: ["Campaign တစ်ခု သို့မဟုတ် launch တစ်ခုအတွက်။", "Content ကိုပုံမှန်ထုတ်လုပ်နေတဲ့ Brand တွေအတွက်။", "Campaign မျိုးစုံလုပ်နေတဲ့ Business တွေအတွက်။"],
    planLabels: ["Project-based", "Ongoing production", "Custom partnership"],
    contactTitle: "Brief ကိုပေးပါ။ Visual world တစ်ခုလုံး ဖန်တီးပေးမယ်။",
    contactText: "Product၊ platform၊ duration၊ style နဲ့ deadline ကိုပို့ပါ။ နောက်တစ်ဆင့်ကို Studio က ရှင်းရှင်းလင်းလင်းလမ်းညွှန်ပေးမယ်။",
    settings: "Studio settings",
    theme: "Theme",
    language: "ဘာသာစကား",
    legal: "Legal & privacy",
    logout: "Log out",
    createAccount: "Account ဖွင့်ရန်",
    signIn: "Sign in",
    welcome: "Creative Studio ထဲဝင်ပါ။",
    introText: "AI films၊ brand campaigns၊ original stories နဲ့ studio communication အားလုံးအတွက် premium mobile workspace ဖြစ်ပါတယ်။",
    name: "အမည်",
    email: "Email လိပ်စာ",
    password: "Password",
    continue: "Studio ထဲဝင်ရန်",
    switchSignIn: "Account ရှိပြီးသားလား? Sign in",
    switchSignUp: "Account မရှိသေးဘူးလား? Account ဖွင့်ရန်",
  },
} as const;

const defaultPortfolio: PortfolioItem[] = [
  { id: "trailer", src: "DVM3o2Wqcys", titleEN: "Cinematic Trailer", descEN: "Human-directed AI film", titleMM: "Cinematic Trailer", descMM: "Human-directed AI film" },
  { id: "architecture", src: "IrukbYGHhQs", titleEN: "Architecture Film", descEN: "Premium process storytelling", titleMM: "Architecture Film", descMM: "Premium process storytelling" },
  { id: "commercial", src: "T9p2lqcETCE", titleEN: "Cinematic Commercial", descEN: "High-end brand campaign", titleMM: "Cinematic Commercial", descMM: "High-end brand campaign" },
  { id: "presenter", src: "wJjyMQ3bjt4", titleEN: "AI Presenter Campaign", descEN: "Natural presenter production", titleMM: "AI Presenter Campaign", descMM: "Natural presenter production" },
];

function cleanYoutubeId(value: string) {
  return value.replace("https://youtu.be/", "").replace("https://www.youtube.com/watch?v=", "").split("&")[0].split("?")[0].trim();
}

function BrandMark() {
  return <span className="apk2-brand-mark" aria-hidden="true">BA</span>;
}

function IntroGate({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const t = copy[lang];
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(mode === "signin" ? "/api/account/sign-in" : "/api/account/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signin" ? { email, password } : { name, email, password }),
      });
      const data = await response.json().catch(() => null) as { ok?: boolean; authenticated?: boolean; requiresEmailConfirmation?: boolean; error?: string; user?: { email?: string; displayName?: string } } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || "Unable to continue. Please try again.");
        return;
      }
      if (data.requiresEmailConfirmation) {
        setMode("signin");
        setPassword("");
        setError("Account created. Confirm your email, then sign in.");
        return;
      }
      if (data.user) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName: data.user.displayName || name || "Burma AI Studio Client", email: data.user.email || email, company: "" }));
      }
      localStorage.setItem("bas_apk_v2_intro_done", "true");
      onDone();
    } catch {
      setError("Connection problem. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="apk2-intro">
      <div className="apk2-intro-glow" />
      <div className="apk2-intro-top"><BrandMark /><span>BURMA AI STUDIO</span></div>
      <div className="apk2-intro-copy">
        <p><Sparkles /> {t.eyebrow}</p>
        <h1>{t.welcome}</h1>
        <span>{t.introText}</span>
      </div>
      <form className="apk2-auth" onSubmit={submit}>
        <div className="apk2-auth-tabs">
          <button type="button" className={mode === "signin" ? "is-active" : ""} onClick={() => setMode("signin")}>{t.signIn}</button>
          <button type="button" className={mode === "signup" ? "is-active" : ""} onClick={() => setMode("signup")}>{t.createAccount}</button>
        </div>
        {mode === "signup" && <label><UserRound /><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name} required /></label>}
        <label><Mail /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} required /></label>
        <label><LockKeyhole /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} minLength={8} required /></label>
        {error && <p className="apk2-auth-message">{error}</p>}
        <button className="apk2-auth-submit" disabled={busy}>{busy ? "Please wait…" : t.continue}<ArrowRight /></button>
        <button type="button" className="apk2-auth-switch" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? t.switchSignUp : t.switchSignIn}</button>
      </form>
    </section>
  );
}

function HomeScreen({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const serviceIcons = [Clapperboard, Mic2, Film, Video];
  return <div className="apk2-stack">
    <section className="apk2-hero">
      <iframe src={`https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}&rel=0&playsinline=1`} title="Burma AI Studio cinematic film" allow="autoplay; encrypted-media" tabIndex={-1} />
      <div className="apk2-hero-shade" />
      <div className="apk2-hero-content">
        <p><Sparkles /> {t.eyebrow}</p>
        <h2><span>{t.hero1}</span><em>{t.hero2}</em></h2>
        <div>{t.heroText}</div>
        <div className="apk2-hero-actions"><Link href="/contact?source=native&apk=v2"><MessageCircle />{t.start}</Link><Link href="/portfolio?source=native&apk=v2" className="is-secondary"><Play />{t.watch}</Link></div>
      </div>
    </section>
    <section className="apk2-metrics">
      <article><strong>100+</strong><span>{t.metrics[0]}</span></article>
      <article><Clock3 /><strong>48h</strong><span>{t.metrics[1]}</span></article>
      <article><BadgeCheck /><strong>Pro</strong><span>{t.metrics[2]}</span></article>
    </section>
    <section className="apk2-panel">
      <p className="apk2-kicker">{t.creativeSystem}</p><h3>{t.creativeTitle}</h3>
      <div className="apk2-service-grid">{t.serviceNames.map((name, index) => { const Icon = serviceIcons[index]; return <Link href="/services?source=native&apk=v2" key={name}><Icon /><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><ChevronRight /></Link>; })}</div>
    </section>
    <section className="apk2-panel">
      <p className="apk2-kicker">{t.productionFlow}</p><h3>{t.flowTitle}</h3>
      <div className="apk2-flow">{t.flow.map(([title, text], index) => <article key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>
    </section>
    <Link href="/contact?source=native&apk=v2" className="apk2-cta"><div><Sparkles /><span>{t.contactTitle}</span></div><ArrowRight /></Link>
  </div>;
}

function ServicesScreen({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const icons = [Clapperboard, Mic2, Film, Video];
  return <div className="apk2-stack"><section className="apk2-page-hero"><p>CREATIVE CAPABILITIES</p><h2>{t.creativeTitle}</h2></section>{t.serviceNames.map((name, index) => { const Icon = icons[index]; return <article className="apk2-service-card" key={name}><div className="apk2-service-card-top"><span><Icon /></span><b>{["BRAND FILM", "PRESENTER", "PROCESS", "SHORT FORM"][index]}</b></div><h3>{name}</h3><p>{t.serviceDescriptions[index]}</p><footer><span><Check />Production ready</span><Link href="/portfolio?source=native&apk=v2">Explore work<ArrowRight /></Link></footer></article>; })}</div>;
}

function PortfolioScreen({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [items, setItems] = useState(defaultPortfolio);
  useEffect(() => { fetch("/api/portfolio", { cache: "no-store" }).then((r) => r.json()).then((data: { items?: PortfolioItem[] }) => { if (Array.isArray(data.items) && data.items.length) setItems(data.items.slice(0, 8)); }).catch(() => undefined); }, []);
  return <div className="apk2-stack"><section className="apk2-page-hero"><p>SELECTED WORK</p><h2>{t.portfolioTitle}</h2></section>{items.map((item, index) => { const id = cleanYoutubeId(item.src); const title = lang === "MM" ? item.titleMM || item.titleEN : item.titleEN || item.titleMM; const desc = lang === "MM" ? item.descMM || item.descEN : item.descEN || item.descMM; return <article className="apk2-video-card" key={item.id || id}><iframe src={`https://www.youtube.com/embed/${id}?playsinline=1&rel=0&modestbranding=1`} title={title} allowFullScreen /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{desc}</p></div></article>; })}</div>;
}

function StoriesScreen({ lang }: { lang: Lang }) { const t = copy[lang]; return <div className="apk2-stack"><section className="apk2-page-hero"><p>BURMA AI STUDIO ORIGINALS</p><h2>{t.storiesTitle}</h2><span>{t.storiesText}</span></section><article className="apk2-coming"><Film /><p>{t.comingSoon}</p><h3>{t.storiesTitle}</h3><span>{t.storiesText}</span></article></div>; }

function PlansScreen({ lang }: { lang: Lang }) { const t = copy[lang]; const icons = [Film, WandSparkles, BriefcaseBusiness]; return <div className="apk2-stack"><section className="apk2-page-hero"><p>STUDIO PLANS</p><h2>{t.plansTitle}</h2></section>{t.planNames.map((name, index) => { const Icon = icons[index]; return <article className={`apk2-plan${index === 1 ? " is-featured" : ""}`} key={name}><div><Icon /><span>{t.planLabels[index]}</span></div><h3>{name}</h3><p>{t.planTexts[index]}</p><ul><li><Check />Creative direction</li><li><Check />Production planning</li><li><Check />Direct studio communication</li></ul><Link href="/contact?source=native&apk=v2">Choose plan<ArrowRight /></Link></article>; })}</div>; }

function ContactScreen({ lang }: { lang: Lang }) { const t = copy[lang]; return <div className="apk2-stack"><section className="apk2-page-hero"><p>DIRECT STUDIO LINE</p><h2>{t.contactTitle}</h2><span>{t.contactText}</span></section><a className="apk2-contact" href="tg://resolve?phone=959671010011"><Send /><div><strong>Telegram</strong><span>+95 9 671 010 011</span></div><ChevronRight /></a><a className="apk2-contact" href="mailto:okaung717@gmail.com"><Mail /><div><strong>Email</strong><span>okaung717@gmail.com</span></div><ChevronRight /></a><button className="apk2-ai-contact" onClick={() => window.dispatchEvent(new CustomEvent("bas-open-assistant"))}><Sparkles />Ask Burma AI Studio<ArrowRight /></button></div>; }

export default function ApkV2Experience() {
  const pathname = usePathname() || "/";
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const activeLang = (lang === "MM" ? "MM" : "EN") as Lang;
  const t = copy[activeLang];
  const [intro, setIntro] = useState(true);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    document.body.classList.add("bas-apk-v2-mode");
    fetch("/api/account/session", { cache: "no-store" }).then((r) => r.json()).then((data: { authenticated?: boolean }) => setIntro(!data.authenticated && localStorage.getItem("bas_apk_v2_intro_done") !== "true")).catch(() => setIntro(localStorage.getItem("bas_apk_v2_intro_done") !== "true"));
    return () => document.body.classList.remove("bas-apk-v2-mode");
  }, []);

  const title = useMemo(() => pathname.startsWith("/services") ? t.services : pathname.startsWith("/portfolio") ? t.work : pathname.startsWith("/stories") ? t.stories : pathname.startsWith("/plans") ? t.plans : pathname.startsWith("/contact") || pathname.startsWith("/chat") ? t.chat : t.home, [pathname, t]);
  const nav = [
    { href: "/?source=native&apk=v2", label: t.home, Icon: Home, match: pathname === "/" },
    { href: "/services?source=native&apk=v2", label: t.services, Icon: Clapperboard, match: pathname.startsWith("/services") },
    { href: "/portfolio?source=native&apk=v2", label: t.work, Icon: PlaySquare, match: pathname.startsWith("/portfolio") },
    { href: "/contact?source=native&apk=v2", label: t.chat, Icon: MessageCircle, match: pathname.startsWith("/contact") || pathname.startsWith("/chat") },
  ];

  return <div className="apk2-shell">
    {intro && <IntroGate lang={activeLang} onDone={() => setIntro(false)} />}
    <header className="apk2-header"><div className="apk2-brand"><BrandMark /><div><strong>Burma AI Studio</strong><span>{title}</span></div></div><button onClick={() => setSettings(true)} aria-label="Open profile"><Settings2 /></button></header>
    <main className="apk2-main">
      {pathname.startsWith("/services") ? <ServicesScreen lang={activeLang} /> : pathname.startsWith("/portfolio") ? <PortfolioScreen lang={activeLang} /> : pathname.startsWith("/stories") ? <StoriesScreen lang={activeLang} /> : pathname.startsWith("/plans") ? <PlansScreen lang={activeLang} /> : pathname.startsWith("/contact") || pathname.startsWith("/chat") ? <ContactScreen lang={activeLang} /> : <HomeScreen lang={activeLang} />}
    </main>
    <nav className="apk2-bottom">{nav.slice(0,2).map(({ href,label,Icon,match }) => <Link key={href} href={href} className={match ? "is-active" : ""}><Icon /><span>{label}</span></Link>)}<button className="apk2-ai" onClick={() => window.dispatchEvent(new CustomEvent("bas-open-assistant"))}><Sparkles /><span>AI</span></button>{nav.slice(2).map(({ href,label,Icon,match }) => <Link key={href} href={href} className={match ? "is-active" : ""}><Icon /><span>{label}</span></Link>)}</nav>
    {settings && <div className="apk2-sheet-layer"><button className="apk2-sheet-backdrop" onClick={() => setSettings(false)} aria-label="Close settings" /><section className="apk2-sheet"><header><div><BrandMark /><span><strong>{t.settings}</strong><small>Burma AI Studio APK v2</small></span></div><button onClick={() => setSettings(false)}><X /></button></header><div className="apk2-sheet-content"><p className="apk2-kicker">{t.theme}</p><button className="apk2-setting-row" onClick={toggleTheme}>{theme === "dark" ? <Moon /> : <Sun />}<span>{theme === "dark" ? "Dark mode" : "Light mode"}</span><ChevronRight /></button><p className="apk2-kicker">{t.language}</p><button className="apk2-setting-row" onClick={toggleLang}><Globe2 /><span>{activeLang === "MM" ? "မြန်မာ" : "English"}</span><ChevronRight /></button><div className="apk2-sheet-links"><Link href="/stories?source=native&apk=v2" onClick={() => setSettings(false)}><Film />{t.stories}<ChevronRight /></Link><Link href="/plans?source=native&apk=v2" onClick={() => setSettings(false)}><Star />{t.plans}<ChevronRight /></Link><Link href="/legal?source=native&apk=v2" onClick={() => setSettings(false)}><ShieldCheck />{t.legal}<ChevronRight /></Link></div><button className="apk2-logout" onClick={async () => { await fetch("/api/account/sign-out", { method: "POST" }).catch(() => undefined); localStorage.removeItem("bas_apk_v2_intro_done"); location.href = "/?source=native&apk=v2"; }}>{t.logout}</button></div></section></div>}
  </div>;
}
