"use client";

import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Film,
  Mail,
  MessageCircle,
  Phone,
  Play,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import ContentStrip from "./ContentStrip";
import "./premium-home-v2.css";
import "./home-video-cleanup-mm.css";

const heroVideoId = "DVM3o2Wqcys";

const translations = {
  EN: {
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    title1: "Make Every Frame",
    title2: "Feel Expensive.",
    desc: "Premium AI films, product stories and presenter campaigns shaped with cinematic direction — built to make your brand look sharper, bigger and impossible to ignore.",
    btn1: "Start a Project",
    btn2: "Watch Our Work",
    stagePill1: "Brand Films",
    stagePill2: "Presenters",
    stagePill3: "Product Stories",
    stagePill4: "Short Form",
    heroLabel: "FEATURED FILM",
    heroTitle: "Cinematic Trailer · Burma AI Studio",
    heroCaption: "AI-crafted · Human-directed · Campaign-ready",
    sideTitle: "Get in touch",
    sideCopy: "Tell us the result you want. We will shape the creative direction around it.",
    socialLabel: "Direct studio line",
    metricOne: "100+",
    metricOneText: "Videos crafted",
    metricTwo: "48h",
    metricTwoText: "Fast turnaround",
    metricThree: "Pro",
    metricThreeText: "Creative direction",
    testimonial: "Built for brands that need premium visuals without a traditional production bottleneck.",
    dockKicker: "NEXT PROJECT",
    dockTitle: "Turn your next idea into a cinematic campaign.",
    dockAction: "Build My Video",
    servicesKicker: "CREATIVE SYSTEM",
    servicesTitle: "One studio. Four powerful ways to make your brand move.",
    service1: "Cinematic brand films",
    service2: "AI presenter campaigns",
    service3: "Product launch stories",
    service4: "TikTok / Reels shorts",
    flowKicker: "PRODUCTION FLOW",
    flowTitle: "Fast enough for social. Polished enough for a flagship campaign.",
    f1Title: "Brief",
    f1: "Share the goal, audience, platform and product. We turn it into a focused creative direction.",
    f2Title: "Build",
    f2: "Script, visual language, AI production and cinematic polish are developed as one cohesive system.",
    f3Title: "Launch",
    f3: "Review, refine and receive the final campaign-ready video for the platforms that matter.",
    footerText: "© 2026 Burma AI Studio. Premium AI video production for ambitious brands.",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    title1: "Brand ကို မြင်တာနဲ့",
    title2: "မှတ်မိသွားစေမယ့် AI Video.",
    desc: "Cinematic direction၊ premium visual language နဲ့ AI production ကိုပေါင်းစပ်ပြီး Brand ကို ပိုကြီး၊ ပိုခိုင်မာ၊ ပိုမှတ်မိလွယ်အောင် Video Campaign တွေဖန်တီးပေးပါတယ်။",
    btn1: "Project စတင်ရန်",
    btn2: "လက်ရာများကြည့်ရန်",
    stagePill1: "Brand Films",
    stagePill2: "Presenters",
    stagePill3: "Product Stories",
    stagePill4: "Short Form",
    heroLabel: "FEATURED FILM",
    heroTitle: "Cinematic Trailer · Burma AI Studio",
    heroCaption: "AI-crafted · Human-directed · Campaign-ready",
    sideTitle: "တိုက်ရိုက်ဆက်သွယ်ရန်",
    sideCopy: "လိုချင်တဲ့ result ကိုပြောပါ။ အဲ့ဒီ result ကိုအခြေခံပြီး creative direction တစ်ခုလုံးဖန်တီးပေးမယ်။",
    socialLabel: "Studio direct line",
    metricOne: "100+",
    metricOneText: "ဖန်တီးပြီး Video",
    metricTwo: "48h",
    metricTwoText: "Fast turnaround",
    metricThree: "Pro",
    metricThreeText: "Creative direction",
    testimonial: "Traditional production delay မလိုဘဲ premium visual quality လိုချင်တဲ့ Brand တွေအတွက် တည်ဆောက်ထားပါတယ်။",
    dockKicker: "NEXT PROJECT",
    dockTitle: "နောက်ထပ် Idea ကို cinematic campaign တစ်ခုအဖြစ် ပြောင်းလိုက်ပါ။",
    dockAction: "Video စတင်ရန်",
    servicesKicker: "CREATIVE SYSTEM",
    servicesTitle: "Studio တစ်ခုတည်းနဲ့ Brand ကို လှုပ်ရှားစေမယ့် powerful direction လေးမျိုး။",
    service1: "Cinematic brand films",
    service2: "AI presenter campaigns",
    service3: "Product launch stories",
    service4: "TikTok / Reels shorts",
    flowKicker: "PRODUCTION FLOW",
    flowTitle: "Social အတွက်မြန်ပြီး flagship campaign အတွက်လုံလောက်အောင် premium ဖြစ်တဲ့ workflow.",
    f1Title: "Brief",
    f1: "Goal၊ audience၊ platform နဲ့ product ကိုပြောပါ။ Focused creative direction အဖြစ် ပြောင်းပေးမယ်။",
    f2Title: "Build",
    f2: "Script၊ visual language၊ AI production နဲ့ cinematic polish ကို system တစ်ခုတည်းအဖြစ် တည်ဆောက်ပေးမယ်။",
    f3Title: "Launch",
    f3: "Review၊ refine ပြီး platform-ready final campaign video ကို ရယူနိုင်ပါတယ်။",
    footerText: "© 2026 Burma AI Studio. Ambitious brands အတွက် premium AI video production.",
  },
} as const;

export default function Home() {
  const { lang } = useLanguage();
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];
  const isMyanmar = safeLang === "MM";

  const services = [t.service1, t.service2, t.service3, t.service4];
  const flow = [
    { title: t.f1Title, text: t.f1 },
    { title: t.f2Title, text: t.f2 },
    { title: t.f3Title, text: t.f3 },
  ];

  return (
    <>
      <main className="bas-home-v2">
        <section className="bas-command-hero" aria-label="Burma AI Studio premium AI video production">
          <aside className="bas-command-rail">
            <div>
              <div className="bas-command-rail-mark"><Film className="h-5 w-5" /></div>
              <p className="bas-command-rail-kicker">BURMA AI STUDIO</p>
              <h2>{t.sideTitle}</h2>
              <p>{t.sideCopy}</p>
            </div>

            <div className="bas-command-contact-list">
              <a href="mailto:okaung717@gmail.com"><Mail className="h-4 w-4" /><span>Email</span></a>
              <a href="tel:09671010011"><Phone className="h-4 w-4" /><span>Call</span></a>
              <a href="tg://resolve?phone=959671010011"><Send className="h-4 w-4" /><span>Telegram</span></a>
            </div>

            <div className="bas-command-rail-foot">
              <span>{t.socialLabel}</span>
              <strong>+95 9 671 010 011</strong>
            </div>
          </aside>

          <div className="bas-command-stage">
            <div className="bas-command-stage-top">
              <div className="bas-command-pills">
                {[t.stagePill1, t.stagePill2, t.stagePill3, t.stagePill4].map((pill, index) => (
                  <span className={index === 0 ? "is-active" : ""} key={pill}>{pill}</span>
                ))}
              </div>
              <div className="bas-command-stage-badge"><Sparkles className="h-4 w-4" /> AI CREATIVE ENGINE</div>
            </div>

            <div className="bas-command-media">
              <iframe
                className="bas-command-video"
                src={`https://www.youtube-nocookie.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0&cc_load_policy=0`}
                title="Burma AI Studio featured cinematic trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                tabIndex={-1}
                aria-hidden="true"
              />
              <div className="bas-command-media-shade" aria-hidden="true" />

              <div className="bas-command-copy">
                <p className="bas-command-eyebrow"><Sparkles className="h-4 w-4" /> {t.eyebrow}</p>
                <h1 className={isMyanmar ? "is-mm" : ""}>
                  <span>{t.title1}</span>
                  <em>{t.title2}</em>
                </h1>
                <p className="bas-command-description">{t.desc}</p>
                <div className="bas-command-hero-actions">
                  <a href="/contact"><MessageCircle className="h-5 w-5" /> {t.btn1}<ArrowRight className="h-4 w-4" /></a>
                  <a href="/portfolio" className="is-secondary"><span className="bas-command-play"><Play className="h-4 w-4 fill-current" /></span>{t.btn2}</a>
                </div>
              </div>

              <div className="bas-command-video-label">
                <span>{t.heroLabel}</span>
                <strong>{t.heroTitle}</strong>
                <small>{t.heroCaption}</small>
              </div>
            </div>

            <div className="bas-command-sidecards">
              <article className="bas-command-metric is-primary">
                <span>{t.metricOne}</span>
                <p>{t.metricOneText}</p>
              </article>
              <article className="bas-command-metric">
                <Clock3 className="h-5 w-5" />
                <span>{t.metricTwo}</span>
                <p>{t.metricTwoText}</p>
              </article>
              <article className="bas-command-metric">
                <BadgeCheck className="h-5 w-5" />
                <span>{t.metricThree}</span>
                <p>{t.metricThreeText}</p>
              </article>
              <article className="bas-command-quote">
                <WandSparkles className="h-5 w-5" />
                <p>{t.testimonial}</p>
              </article>
            </div>

            <a href="/contact" className="bas-command-dock">
              <div>
                <span>{t.dockKicker}</span>
                <strong>{t.dockTitle}</strong>
              </div>
              <div className="bas-command-dock-action">{t.dockAction}<ArrowRight className="h-4 w-4" /></div>
            </a>
          </div>
        </section>

        <section className={`bas-home-v2-services${isMyanmar ? " is-mm" : ""}`}>
          <div className="bas-home-v2-section-head">
            <p>{t.servicesKicker}</p>
            <h2>{t.servicesTitle}</h2>
          </div>
          <div className="bas-home-v2-service-list">
            {services.map((service, index) => (
              <a href="/services" key={service}>
                <span>0{index + 1}</span>
                <strong>{service}</strong>
                <ArrowRight className="h-5 w-5" />
              </a>
            ))}
          </div>
        </section>

        <section className={`bas-home-v2-flow${isMyanmar ? " is-mm" : ""}`}>
          <div className="bas-home-v2-flow-copy">
            <p>{t.flowKicker}</p>
            <h2>{t.flowTitle}</h2>
          </div>
          <div className="bas-home-v2-flow-grid">
            {flow.map((step, index) => (
              <article key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <ContentStrip type="home" />

      <footer className="bas-home-v2-footer">
        <div>
          <strong><Film className="h-5 w-5" /> Burma AI Studio</strong>
          <p>{t.footerText}</p>
          <span>AI FILM · BRAND SYSTEMS · CREATIVE DIRECTION</span>
        </div>
      </footer>
    </>
  );
}
