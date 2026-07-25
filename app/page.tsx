"use client";

import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Film,
  MessageCircle,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import ContentStrip from "./ContentStrip";
import "./premium-home.css";

const heroVideoId = "DVM3o2Wqcys";

const translations = {
  EN: {
    eyebrow: "AI FILMMAKING · BRAND SYSTEMS",
    title1: "AI Videos That",
    title2: "Make Your Brand",
    title3: "Unforgettable.",
    desc: "Premium AI video direction for brands that want cinematic quality, faster production and a visual identity people actually remember.",
    btn1: "Start a Project",
    btn2: "Explore Our Work",
    heroLabel: "NOW PLAYING",
    heroTitle: "Cinematic brand storytelling",
    heroCaption: "AI-crafted · Human-directed · Social-ready",
    floatingKicker: "Creative advantage",
    floatingTitle: "Studio-grade visuals without studio-sized delays.",
    stat1Label: "100+",
    stat1Text: "Videos crafted",
    stat2Label: "48h",
    stat2Text: "Fast turnaround",
    stat3Label: "Pro",
    stat3Text: "Creative direction",
    stat4Label: "AI",
    stat4Text: "Production engine",
    quickKicker: "Creative concierge",
    quickTitle: "What should we create next?",
    quickDesc: "Choose a direction and we’ll take you straight into the right project flow.",
    q1: "AI presenter campaign",
    q2: "Product launch video",
    q3: "TikTok / Reels short",
    q4: "Script & concept direction",
    flowKicker: "Premium workflow",
    flowTitle: "From brief to final, without the usual production friction.",
    flowDesc: "A clear three-step production system designed for businesses that need speed without sacrificing visual quality.",
    f1Title: "Tell us the goal",
    f1: "Share your product, platform, audience and duration. We shape the creative brief around the result you need.",
    f2Title: "We build the world",
    f2: "Direction, script, visual language and AI production are developed into a cohesive premium video system.",
    f3Title: "Review. Refine. Launch.",
    f3: "You review, request revisions and receive a polished final video ready for the platforms that matter.",
    footerText: "© 2026 Burma AI Studio. All rights reserved.",
  },
  MM: {
    eyebrow: "AI FILMMAKING · BRAND SYSTEMS",
    title1: "သင့် Brand ကို",
    title2: "လူတွေမှတ်မိသွားစေမယ့်",
    title3: "AI Video.",
    desc: "Cinematic quality၊ မြန်ဆန်တဲ့ production နဲ့ မှတ်မိလွယ်တဲ့ visual identity ကို ပေါင်းစပ်ပြီး Brand တွေအတွက် premium AI video direction ဖန်တီးပေးပါတယ်။",
    btn1: "Project စတင်ရန်",
    btn2: "လက်ရာများကြည့်ရန်",
    heroLabel: "NOW PLAYING",
    heroTitle: "Cinematic brand storytelling",
    heroCaption: "AI-crafted · Human-directed · Social-ready",
    floatingKicker: "Creative advantage",
    floatingTitle: "Studio quality ကို production delay အများကြီးမရှိဘဲ ရယူပါ။",
    stat1Label: "100+",
    stat1Text: "ဖန်တီးပြီး Video",
    stat2Label: "48h",
    stat2Text: "Fast turnaround",
    stat3Label: "Pro",
    stat3Text: "Creative direction",
    stat4Label: "AI",
    stat4Text: "Production engine",
    quickKicker: "Creative concierge",
    quickTitle: "နောက်တစ်ခု ဘာဖန်တီးမလဲ?",
    quickDesc: "လိုချင်တဲ့ direction ကိုရွေးလိုက်ပါ။ သင့် Project အတွက် အလိုက်ဖက်ဆုံး workflow ကို တန်းပို့ပေးမယ်။",
    q1: "AI presenter campaign",
    q2: "Product launch video",
    q3: "TikTok / Reels short",
    q4: "Script & concept direction",
    flowKicker: "Premium workflow",
    flowTitle: "Brief ကနေ Final အထိ ရှင်းလင်းပြီး မြန်ဆန်တဲ့ Production Flow.",
    flowDesc: "Speed ကိုလိုချင်ပေမယ့် visual quality မလျော့ချင်တဲ့ Business တွေအတွက် သုံးဆင့်တည်းနဲ့ လုပ်ဆောင်နိုင်အောင် တည်ဆောက်ထားပါတယ်။",
    f1Title: "Goal ကိုပြောပါ",
    f1: "Product၊ platform၊ audience နဲ့ duration ကိုပြောပါ။ လိုချင်တဲ့ result ကိုအခြေခံပြီး creative brief ဖန်တီးပေးမယ်။",
    f2Title: "Visual world ကိုဖန်တီးမယ်",
    f2: "Direction၊ script၊ visual language နဲ့ AI production ကို cohesive premium video system တစ်ခုအဖြစ် တည်ဆောက်ပေးမယ်။",
    f3Title: "Review. Refine. Launch.",
    f3: "Review လုပ်ပြီး revision တောင်းနိုင်ပါတယ်။ ပြီးရင် platform-ready final video ကို ရယူနိုင်ပါတယ်။",
    footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။",
  },
} as const;

export default function Home() {
  const { lang } = useLanguage();
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  const stats = [
    { icon: Film, value: t.stat1Label, label: t.stat1Text },
    { icon: Clock3, value: t.stat2Label, label: t.stat2Text },
    { icon: BadgeCheck, value: t.stat3Label, label: t.stat3Text },
    { icon: WandSparkles, value: t.stat4Label, label: t.stat4Text },
  ];

  const quickActions = [t.q1, t.q2, t.q3, t.q4];
  const flow = [
    { title: t.f1Title, text: t.f1 },
    { title: t.f2Title, text: t.f2 },
    { title: t.f3Title, text: t.f3 },
  ];

  return (
    <>
      <main className="bas-home-shell">
        <section className="bas-home-hero" aria-label="Burma AI Studio premium AI video production">
          <div className="bas-home-glow bas-home-glow-a" aria-hidden="true" />
          <div className="bas-home-glow bas-home-glow-b" aria-hidden="true" />

          <div className="bas-home-copy">
            <div className="bas-home-eyebrow">
              <Sparkles className="h-4 w-4" />
              <span>{t.eyebrow}</span>
            </div>

            <h1 className={`bas-home-title ${safeLang === "MM" ? "bas-home-title-mm" : ""}`}>
              <span>{t.title1}</span>
              <span>{t.title2}</span>
              <em>{t.title3}</em>
            </h1>

            <p className="bas-home-description">{t.desc}</p>

            <div className="bas-home-cta-row">
              <a href="/contact" className="bas-home-primary-cta">
                <MessageCircle className="h-5 w-5" />
                <span>{t.btn1}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/portfolio" className="bas-home-secondary-cta">
                <span className="bas-home-play"><Play className="h-4 w-4 fill-current" /></span>
                <span>{t.btn2}</span>
              </a>
            </div>
          </div>

          <div className="bas-home-media-zone">
            <div className="bas-home-media-frame">
              <iframe
                className="bas-home-video"
                src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                title="Burma AI Studio cinematic commercial autoplay preview"
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
              <div className="bas-home-media-vignette" aria-hidden="true" />
              <div className="bas-home-media-caption">
                <div className="bas-home-now-playing"><Sparkles className="h-3.5 w-3.5" /> {t.heroLabel}</div>
                <h2>{t.heroTitle}</h2>
                <p>{t.heroCaption}</p>
              </div>
            </div>

            <div className="bas-home-floating-card">
              <span>{t.floatingKicker}</span>
              <strong>{t.floatingTitle}</strong>
            </div>
          </div>

          <div className="bas-home-stat-rail">
            {stats.map((item) => (
              <div className="bas-home-stat" key={item.label}>
                <item.icon className="h-5 w-5" />
                <div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bas-home-below-grid">
          <div className="bas-home-concierge">
            <div>
              <p className="bas-home-section-kicker">{t.quickKicker}</p>
              <h2>{t.quickTitle}</h2>
              <p className="bas-home-section-copy">{t.quickDesc}</p>
            </div>
            <div className="bas-home-action-list">
              {quickActions.map((action, index) => (
                <a href="/contact" key={action}>
                  <span className="bas-home-action-index">0{index + 1}</span>
                  <span>{action}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="bas-home-flow-card">
            <div className="bas-home-flow-heading">
              <p className="bas-home-section-kicker">{t.flowKicker}</p>
              <h2>{t.flowTitle}</h2>
              <p className="bas-home-section-copy">{t.flowDesc}</p>
            </div>
            <div className="bas-home-flow-grid">
              {flow.map((step, index) => (
                <article key={step.title} className="bas-home-flow-step">
                  <span className="bas-home-step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ContentStrip type="home" />

      <footer className="bas-home-footer">
        <div className="bas-home-footer-inner">
          <div className="bas-home-footer-brand"><Film className="h-5 w-5" /> Burma AI Studio</div>
          <p>{t.footerText}</p>
          <span className="bas-home-footer-mark">AI · VIDEO · BRAND</span>
        </div>
      </footer>
    </>
  );
}
