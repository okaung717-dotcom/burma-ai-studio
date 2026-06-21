"use client";
import { Play, TrendingUp, Palette, Video } from "lucide-react";
import { useLanguage } from "./LanguageContext";

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
    footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။"
  }
} as const;

export default function Home() {
  const { lang } = useLanguage();
  
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  return (
    <>
      <main className="flex flex-col lg:flex-row items-center justify-between py-12 md:py-20 px-6 md:px-16 lg:px-24">
        
        <div className="lg:w-[50%] space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-[#00C2FF]"></div>
            {t.badge}
          </div>

          {/* မြန်မာစာလုံးများ မထပ်စေရန် leading-loose နှင့် tracking-normal ကို သုံးပေးထားပါသည် */}
          <h1 className="text-4xl md:text-[64px] font-extrabold leading-loose tracking-normal dark:text-white">
            {t.title1} <br /> {t.title2} <br /> {t.title3} <span className="text-[#00C2FF]">{t.title4}</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
            {t.desc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors">
              {t.btn1}
            </a>
            <a href="/portfolio" className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-[#111827] dark:text-white px-8 py-3.5 rounded-full font-bold text-lg border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors gap-2">
              <Play className="w-5 h-5" /> {t.btn2}
            </a>
          </div>
        </div>
        
        <div className="lg:w-[45%] w-full h-[450px] md:h-[600px] relative">
          <div className="w-full h-full rounded-[2.5rem] bg-[#111827] overflow-hidden relative shadow-2xl flex items-center justify-center">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/20 via-transparent to-transparent blur-2xl"></div>
            
            <div className="absolute inset-0 opacity-40 flex items-center justify-center flex-col gap-8 transform rotate-12 scale-150">
              <div className="w-64 h-16 border-4 border-[#00C2FF]/30 rounded-xl"></div>
              <div className="w-80 h-16 border-4 border-[#00C2FF]/20 rounded-xl"></div>
              <div className="w-72 h-16 border-4 border-[#00C2FF]/10 rounded-xl"></div>
            </div>

            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,194,255,0.4)] z-10 cursor-pointer hover:scale-110 transition-transform duration-300">
              <Play className="text-[#00C2FF] w-8 h-8 ml-1" fill="currentColor" />
            </div>

            <div className="absolute left-6 md:left-10 top-1/4 w-28 h-36 bg-gray-800 rounded-xl border-4 border-white shadow-xl transform -rotate-12 hidden md:block overflow-hidden">
               <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Video frame 1" />
            </div>
            <div className="absolute right-6 md:right-10 bottom-1/4 w-36 h-24 bg-gray-800 rounded-xl border-4 border-white shadow-xl transform rotate-6 hidden md:block overflow-hidden flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Video frame 2" />
               <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center z-10"><Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor"/></div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="bg-[#f9fafb] dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-800 py-16 px-6 md:px-16 lg:px-24 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 text-center md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-[40px] font-extrabold text-[#111827] dark:text-white leading-none">100+</h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Videos Created</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-[40px] font-extrabold text-[#111827] dark:text-white leading-none flex items-baseline">
              48<span className="text-[#00C2FF] text-2xl ml-1 font-bold">hr</span>
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <TrendingUp className="text-[#00C2FF] w-8 h-8" />
            <p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Business-Focused</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <Palette className="text-[#00C2FF] w-8 h-8" />
            <p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Custom Style</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#e5e7eb] dark:bg-black py-16 px-6 md:px-16 lg:px-24 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-[#111827] dark:text-white">
              <Video className="text-[#00C2FF] w-6 h-6" />
              Burma AI Studio
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.footerText}</p>
          </div>
          <div className="col-span-1 flex flex-col space-y-4">
            <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Home</a>
            <a href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Services</a>
            <a href="/portfolio" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Portfolio</a>
          </div>
          <div className="col-span-1 flex flex-col space-y-4">
            <a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}