"use client";

import { Play, Video, Sparkles, MessageCircle, Clock, BadgeCheck, Wand2, ArrowRight, PhoneCall } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import ContentStrip from "./ContentStrip";

const heroVideoId = "T9p2lqcETCE";

const translations = {
  EN: {
    badge: "BURMA AI STUDIO APP",
    title1: "AI Videos That",
    title2: "Make Your Brand",
    title3: "Stand Out",
    desc: "A premium AI video creation service for business ads, product videos, AI presenters, Reels, TikTok and cinematic brand campaigns.",
    btn1: "Start Project",
    btn2: "Watch Work",
    quickTitle: "What do you need today?",
    q1: "AI presenter ad",
    q2: "Product video",
    q3: "TikTok/Reels short",
    q4: "Script idea",
    heroLabel: "Live preview",
    heroTitle: "Cinematic brand video",
    heroCaption: "Muted autoplay • Ready for social media",
    flowTitle: "Simple project flow",
    f1: "Tell us your product, platform and duration.",
    f2: "We prepare direction, script and visual style.",
    f3: "You review, request revisions and receive final video.",
    footerText: "© 2026 Burma AI Studio. All rights reserved."
  },
  MM: {
    badge: "BURMA AI STUDIO APP",
    title1: "သင့်Brandကို",
    title2: "ပိုထင်းထွက်စေမယ့်",
    title3: "AI Video",
    desc: "လုပ်ငန်းကြော်ငြာ၊ product video၊ AI presenter၊ Reels/TikTok short video နဲ့ cinematic brand campaign တွေကို premium quality နဲ့ ဖန်တီးပေးပါတယ်။",
    btn1: "Project စတင်ရန်",
    btn2: "လက်ရာကြည့်ရန်",
    quickTitle: "ဒီနေ့ ဘာလိုချင်လဲ?",
    q1: "AI presenter ad",
    q2: "Product video",
    q3: "TikTok/Reels short",
    q4: "Script idea",
    heroLabel: "Live preview",
    heroTitle: "Cinematic brand video",
    heroCaption: "အသံပိတ် autoplay • Social media အတွက်အသင့်",
    flowTitle: "လုပ်ဆောင်ပုံ အလွယ်ချုပ်",
    f1: "Product, platform, duration ကိုပြောပါ။",
    f2: "Direction, script, visual style ကိုပြင်ဆင်ပေးပါမယ်။",
    f3: "Review / revision ပြီး final video ရယူပါ။",
    footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။"
  }
} as const;

export default function Home() {
  const { lang } = useLanguage();
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];
  const quickActions = [t.q1, t.q2, t.q3, t.q4];
  const flow = [t.f1, t.f2, t.f3];

  return (
    <>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-12 lg:px-24 lg:py-14">
        <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 rounded-[2.2rem] border border-[#ead9bd] bg-[#fffdf8]/82 p-5 shadow-[0_18px_55px_rgba(26,11,14,0.08)] backdrop-blur md:p-8 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]/80">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#be9537]/35 bg-[#fff3e3] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:bg-white/5 dark:text-[#e3bc61]">
              <Sparkles className="h-4 w-4" /> {t.badge}
            </div>
            <div>
              <h1 className="text-[42px] font-black leading-[1.16] tracking-tight text-[#1a0b0e] sm:text-6xl lg:text-7xl dark:text-[#fff7eb]">
                <span className="inline-block whitespace-nowrap">{t.title1}</span><br />{t.title2}<br /><span className="text-[#911923] dark:text-[#e3bc61]">{t.title3}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#79695d] md:text-lg dark:text-[#d8c4a3]">{t.desc}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#911923] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#911923]/20 transition hover:bg-[#7a141e]">
                <MessageCircle className="h-5 w-5" /> {t.btn1}
              </a>
              <a href="/portfolio" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#be9537]/45 bg-white/70 px-6 py-3.5 text-sm font-black text-[#1a0b0e] transition hover:border-[#911923]/50 dark:bg-white/5 dark:text-white">
                <Play className="h-5 w-5" /> {t.btn2}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {[{ icon: Video, label: "100+", text: "Videos" }, { icon: Clock, label: "48h", text: "Fast" }, { icon: BadgeCheck, label: "Pro", text: "Quality" }, { icon: Wand2, label: "AI", text: "Creative" }].map((item) => (
                <div key={item.text} className="rounded-3xl border border-[#ead9bd] bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <item.icon className="mb-3 h-5 w-5 text-[#be9537]" />
                  <p className="text-2xl font-black text-[#1a0b0e] dark:text-white">{item.label}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#79695d] dark:text-[#d8c4a3]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-[#ead9bd] bg-[#100708] p-3 shadow-[0_26px_90px_rgba(145,25,35,0.22)] dark:border-[#4b2a1d]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#100708] md:aspect-video lg:aspect-[4/5] xl:aspect-video">
              <iframe className="absolute inset-0 h-full w-full scale-[1.03]" src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`} title="Burma AI Studio cinematic commercial autoplay preview" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#100708]/90 via-transparent to-[#100708]/25" />
            </div>
            <div className="absolute bottom-7 left-7 right-7 rounded-[1.6rem] border border-white/10 bg-[#100708]/82 p-4 text-white backdrop-blur-xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80"><Sparkles className="h-3.5 w-3.5 text-[#e3bc61]" /> {t.heroLabel}</div>
              <h2 className="text-xl font-black md:text-2xl">{t.heroTitle}</h2>
              <p className="mt-1 text-sm text-white/70">{t.heroCaption}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-[#ead9bd] bg-[#1a0b0e] p-6 text-white shadow-[0_18px_55px_rgba(26,11,14,0.12)] dark:border-[#4b2a1d]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]">Quick actions</p>
            <h2 className="mt-3 text-2xl font-black">{t.quickTitle}</h2>
            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => (
                <a key={action} href="/contact" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm font-bold text-white/88 hover:bg-white/12">
                  {action}<ArrowRight className="h-4 w-4 text-[#e3bc61]" />
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-6 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">{t.flowTitle}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {flow.map((text, index) => (
                <div key={text} className="rounded-[1.6rem] border border-[#ead9bd] bg-[#fff9f0] p-5 dark:border-[#4b2a1d] dark:bg-[#241113]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">{index + 1}</span>
                  <p className="mt-4 text-sm font-bold leading-relaxed text-[#1a0b0e] dark:text-[#fff7eb]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ContentStrip type="home" />

      <footer className="border-t border-[#ead9bd] bg-[#fff3e3] px-6 py-12 transition-colors duration-300 dark:border-[#4b2a1d] dark:bg-[#100708] md:px-16 lg:px-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-[#1a0b0e] dark:text-white"><Video className="h-6 w-6 text-[#911923] dark:text-[#e3bc61]" />Burma AI Studio</div>
          <p className="text-sm font-medium text-[#79695d] dark:text-[#d8c4a3]">{t.footerText}</p>
          <a href="tel:09671010011" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#911923] px-4 py-2 text-sm font-black text-white"><PhoneCall className="h-4 w-4" /> 09671010011</a>
        </div>
      </footer>
    </>
  );
}
