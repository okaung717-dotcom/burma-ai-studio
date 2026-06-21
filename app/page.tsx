"use client";
import { Play, TrendingUp, Palette, Video, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import ContentStrip from "./ContentStrip";

const heroVideoId = "T9p2lqcETCE";

const translations = {
  EN: {
    badge: "NEXT-GEN VIDEO PRODUCTION",
    title1: "AI Videos That",
    title2: "Make Your",
    title3: "Brand",
    title4: "Stand Out",
    desc: "High-quality, affordable promotional videos powered by advanced AI. We craft cinematic narratives that captivate your audience and elevate your brand identity without the traditional studio costs.",
    btn1: "Get Started",
    btn2: "Watch Examples",
    heroLabel: "Auto-playing AI commercial sample",
    heroTitle: "Cinematic brand video preview",
    heroCaption: "Muted autoplay • AI commercial style • Ready for social media",
    footerText: "© 2026 Burma AI Studio. All rights reserved."
  },
  MM: {
    badge: "ခေတ်သစ် ဗီဒီယို ဖန်တီးမှု",
    title1: "သင့် Brand ကို",
    title2: "သူများထက်",
    title3: "ပိုပြီး",
    title4: "ထင်းထွက်သွားစေမယ့် AI ဗီဒီယိုများ",
    desc: "ကုန်ကျစရိတ် အရမ်းများတဲ့ ရိုးရိုး Studio တွေနဲ့ မတူဘဲ၊ အဆင့်မြင့် AI နည်းပညာကို သုံးပြီး အရည်အသွေးမြင့် ကြော်ငြာဗီဒီယိုတွေကို သင့်တင့်တဲ့ ဈေးနှုန်းနဲ့ ဖန်တီးပေးနေပါတယ်။ သင့်ပရိသတ်ကို အပြည့်အဝ ဆွဲဆောင်နိုင်မယ့် ရုပ်ရှင်ဆန်ဆန် ဖန်တီးမှုတွေနဲ့ Brand ရဲ့ Image ကို မြှင့်တင်လိုက်ပါ။",
    btn1: "အခုပဲ စလိုက်ရအောင်",
    btn2: "နမူနာ ကြည့်ရန်",
    heroLabel: "အလိုအလျောက်ပြသနေသော AI ကြော်ငြာနမူနာ",
    heroTitle: "ရုပ်ရှင်ဆန်သော Brand Video Preview",
    heroCaption: "အသံပိတ် autoplay • AI commercial style • Social media အတွက်အသင့်",
    footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။"
  }
} as const;

export default function Home() {
  const { lang } = useLanguage();
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  return (
    <>
      <main className="flex flex-col lg:flex-row items-center justify-between py-12 md:py-20 px-6 md:px-16 lg:px-24 gap-12">
        <div className="lg:w-[50%] space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-[#00C2FF]"></div>
            {t.badge}
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.4] tracking-normal dark:text-white">
            {t.title1} <br /> {t.title2} <br /> {t.title3} <span className="text-[#00C2FF]">{t.title4}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">{t.desc}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors">{t.btn1}</a>
            <a href="/portfolio" className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-8 py-3.5 rounded-full font-bold text-lg border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors gap-2"><Play className="w-5 h-5" /> {t.btn2}</a>
          </div>
        </div>
        <div className="lg:w-[45%] w-full relative">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#111827] border border-[#00C2FF]/20 shadow-2xl shadow-red-950/20">
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] xl:aspect-video bg-[#111827]">
              <iframe className="absolute inset-0 h-full w-full scale-[1.02]" src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`} title="Burma AI Studio cinematic commercial autoplay preview" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#100708]/80 via-transparent to-[#100708]/20" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
            <div className="absolute left-5 right-5 bottom-5 rounded-3xl border border-white/10 bg-[#100708]/75 p-4 md:p-5 text-white backdrop-blur-xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80"><Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" /> {t.heroLabel}</div>
              <h2 className="text-xl md:text-2xl font-extrabold leading-relaxed">{t.heroTitle}</h2>
              <p className="mt-1 text-sm text-white/70 leading-relaxed">{t.heroCaption}</p>
            </div>
          </div>
        </div>
      </main>

      <ContentStrip type="home" />

      <section className="bg-[#f9fafb] dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-800 py-16 px-6 md:px-16 lg:px-24 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 text-center md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="flex flex-col items-center justify-center space-y-2"><h3 className="text-[40px] font-extrabold text-[#111827] dark:text-white leading-none">100+</h3><p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Videos Created</p></div>
          <div className="flex flex-col items-center justify-center space-y-2"><h3 className="text-[40px] font-extrabold text-[#111827] dark:text-white leading-none flex items-baseline">48<span className="text-[#00C2FF] text-2xl ml-1 font-bold">hr</span></h3><p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Fast Delivery</p></div>
          <div className="flex flex-col items-center justify-center space-y-3"><TrendingUp className="text-[#00C2FF] w-8 h-8" /><p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Business-Focused</p></div>
          <div className="flex flex-col items-center justify-center space-y-3"><Palette className="text-[#00C2FF] w-8 h-8" /><p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Custom Style</p></div>
        </div>
      </section>

      <footer className="bg-[#e5e7eb] dark:bg-black py-16 px-6 md:px-16 lg:px-24 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div className="col-span-2 space-y-4"><div className="flex items-center gap-2 font-bold text-xl text-[#111827] dark:text-white"><Video className="text-[#00C2FF] w-6 h-6" />Burma AI Studio</div><p className="text-sm text-gray-500 dark:text-gray-400">{t.footerText}</p></div>
          <div className="col-span-1 flex flex-col space-y-4"><a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Home</a><a href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Services</a><a href="/portfolio" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Portfolio</a></div>
          <div className="col-span-1 flex flex-col space-y-4"><a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Contact</a><a href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Privacy Policy</a><a href="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Terms of Service</a></div>
        </div>
      </footer>
    </>
  );
}
