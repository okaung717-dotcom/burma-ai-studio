"use client";
import { Video, Clapperboard, Mic, Building, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const translations = {
  EN: {
    title1: "AI Video",
    title2: "Service Catalog",
    subtitle: "Choose a video direction like a real app menu. Each service is built for social media, local business ads and premium brand presentation.",
    s1Title: "Cinematic Commercials",
    s1Desc: "Premium brand ads with dramatic visuals, product highlights and cinematic story flow.",
    s2Title: "AI Presenter Campaigns",
    s2Desc: "Realistic Burmese/English presenters for explainers, offers, launches and customer trust videos.",
    s3Title: "Architecture & Process Videos",
    s3Desc: "Building, water system, factory, real estate and process animation videos with clear visual direction.",
    s4Title: "TikTok / Reels Shorts",
    s4Desc: "Fast hooks, short scripts, vertical video direction and mobile-first ads ready for posting.",
    learnMore: "View examples",
    ctaTitle: "Tell us your product and platform.",
    ctaBtn: "Request a video plan"
  },
  MM: {
    title1: "AI Video",
    title2: "ဝန်ဆောင်မှု Menu",
    subtitle: "App menu တစ်ခုလို လိုချင်တဲ့ video direction ကိုရွေးနိုင်အောင် ပြင်ထားပါတယ်။ Social media, local business ad နဲ့ premium brand presentation အတွက်အဓိကထားဖန်တီးပေးပါတယ်။",
    s1Title: "Cinematic Commercials",
    s1Desc: "Brand ad, product highlight, offer campaign တွေအတွက် ရုပ်ရှင်ဆန်ဆန် visual flow နဲ့ဖန်တီးပေးပါတယ်။",
    s2Title: "AI Presenter Campaigns",
    s2Desc: "မြန်မာ/English AI presenter နဲ့ explain, launch, offer, trust-building video တွေဖန်တီးပေးပါတယ်။",
    s3Title: "Architecture & Process Videos",
    s3Desc: "အဆောက်အဦး၊ water system၊ factory၊ real estate၊ process animation တွေအတွက်ရှင်းလင်းတဲ့ video direction ဖန်တီးပေးပါတယ်။",
    s4Title: "TikTok / Reels Shorts",
    s4Desc: "Hook ကောင်း၊ script တို၊ vertical video direction နဲ့ posting-ready short ads တွေဖန်တီးပေးပါတယ်။",
    learnMore: "နမူနာကြည့်ရန်",
    ctaTitle: "Product နဲ့ Platform ကိုပြောပေးပါ။",
    ctaBtn: "Video plan တောင်းရန်"
  }
} as const;

export default function Services() {
  const { lang } = useLanguage();
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];
  const services = [
    { Icon: Clapperboard, title: t.s1Title, desc: t.s1Desc, tag: "Brand" },
    { Icon: Mic, title: t.s2Title, desc: t.s2Desc, tag: "Presenter" },
    { Icon: Building, title: t.s3Title, desc: t.s3Desc, tag: "Process" },
    { Icon: Video, title: t.s4Title, desc: t.s4Desc, tag: "Shorts" },
  ];

  return (
    <div className="min-h-screen bg-[#fff9f0] text-[#1a0b0e] transition-colors duration-300 dark:bg-[#100708] dark:text-[#fff7eb]">
      <header className="mx-auto max-w-7xl px-5 py-10 md:px-12 lg:px-24">
        <div className="rounded-[2.2rem] border border-[#ead9bd] bg-[#fffdf8] p-6 shadow-[0_18px_55px_rgba(26,11,14,0.08)] md:p-10 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3e3] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:bg-white/5 dark:text-[#e3bc61]"><Sparkles className="h-4 w-4" /> Service Menu</div>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{t.title1} <span className="text-[#911923] dark:text-[#e3bc61]">{t.title2}</span></h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-[#79695d] md:text-lg dark:text-[#d8c4a3]">{t.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-12 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((service, index) => (
            <div key={service.title} className="group overflow-hidden rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(145,25,35,0.12)] dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#911923] text-white shadow-lg shadow-[#911923]/20"><service.Icon className="h-7 w-7" /></div>
                <span className="rounded-full bg-[#fff3e3] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#911923] dark:bg-white/8 dark:text-[#e3bc61]">{service.tag}</span>
              </div>
              <h3 className="text-2xl font-black leading-snug">{service.title}</h3>
              <p className="mt-3 min-h-[84px] text-sm font-medium leading-relaxed text-[#79695d] dark:text-[#d8c4a3]">{service.desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[#ead9bd] pt-5 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm font-black text-[#be9537]"><CheckCircle2 className="h-4 w-4" /> Ready</div>
                <a href="/portfolio" className="inline-flex items-center gap-2 rounded-full bg-[#1a0b0e] px-4 py-2 text-xs font-black text-white transition group-hover:bg-[#911923] dark:bg-[#e3bc61] dark:text-[#100708]">{t.learnMore}<ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-12 lg:px-24">
        <div className="rounded-[2rem] bg-[#1a0b0e] p-7 text-white md:flex md:items-center md:justify-between md:p-10">
          <h2 className="text-3xl font-black leading-snug">{t.ctaTitle}</h2>
          <a href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#be9537] px-6 py-3 text-sm font-black text-[#100708] md:mt-0">{t.ctaBtn}<ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </div>
  );
}
