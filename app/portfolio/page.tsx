"use client";
import { Video } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Portfolio() {
  const { lang } = useLanguage();

  const t = {
    EN: {
      title1: "Our ",
      titleHighlight: "Masterpieces",
      subtitle: "Explore our gallery of high-fidelity AI generated videos, showcasing our expertise in cinematic storytelling and virtual presenter campaigns.",
      items: [
        { src: "DVM3o2Wqcys", title: "Cinematic Trailers Ai video", desc: "TikTok, Youtube, Facebook-Ai videos" },
        { src: "IrukbYGHhQs", title: "Architecture ai videos", desc: "Advanced AI Video Production" },
        { src: "T9p2lqcETCE", title: "Cinematic Commercial", desc: "High-End AI Promotional Video" },
        { src: "wJjyMQ3bjt4", title: "Virtual Presenter Campaign", desc: "Advanced AI Virtual Presenter Production" },
      ],
      footerText: "© 2026 Burma AI Studio. All rights reserved."
    },
    MM: {
      title1: "ကျွန်ုပ်တို့၏ ",
      titleHighlight: "အကောင်းဆုံးလက်ရာများ",
      subtitle: "ရုပ်ရှင်ဆန်သော ဇာတ်လမ်းဖွဲ့စည်းမှုနှင့် AI Presenter ဖန်တီးမှုများတွင် ကျွန်ုပ်တို့၏ ကျွမ်းကျင်မှုကို ပြသထားသော အရည်အသွေးမြင့် AI ဗီဒီယိုပြခန်းကို လေ့လာကြည့်ရှုပါ။",
      items: [
        { src: "DVM3o2Wqcys", title: "ရုပ်ရှင်ဆန်သော Trailer AI ဗီဒီယိုများ", desc: "TikTok, Youtube, Facebook AI ဗီဒီယိုများ" },
        { src: "IrukbYGHhQs", title: "ဗိသုကာနှင့် အဆောက်အဦး AI ဗီဒီယိုများ", desc: "အဆင့်မြင့် AI ဗီဒီယို ဖန်တီးမှု" },
        { src: "T9p2lqcETCE", title: "ရုပ်ရှင်ဆန်သော ကြော်ငြာများ", desc: "အဆင့်မြင့် AI ကြော်ငြာဗီဒီယို" },
        { src: "wJjyMQ3bjt4", title: "AI Presenter ဗီဒီယိုများ", desc: "အဆင့်မြင့် AI Presenter ဖန်တီးမှု" },
      ],
      footerText: "© 2026 Burma AI Studio. မူပိုင်ခွင့်များအားလုံး ရယူထားပြီးဖြစ်ပါသည်။"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          {t.title1} <span className="text-[#00C2FF]">{t.titleHighlight}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </header>

      {/* Portfolio Grid */}
      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Portfolio Items */}
          {t.items.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${item.src}`} allowFullScreen></iframe>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-16 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
              <Video className="text-[#00C2FF] w-6 h-6" />
              Burma AI Studio
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}