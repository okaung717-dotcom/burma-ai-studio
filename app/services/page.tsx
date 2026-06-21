"use client";
import { Video, Clapperboard, Mic, Building, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Services() {
  const { lang } = useLanguage();

  // ဘာသာစကားအတွက် စာသားများကို ဒီမှာ ခွဲရေးထားပါတယ်
  const t = {
    EN: {
      title1: "Next-Gen ",
      titleHighlight: "AI Video",
      title2: " Solutions",
      subtitle: "Elevate your brand with cutting-edge AI technology. From commercial campaigns to cinematic character performances, we deliver studio-quality results at unprecedented speed.",
      s1Title: "Cinematic Commercials",
      s1Desc: "High-end promotional videos with advanced visual storytelling. We act as your cinematic prompt directors to generate breathtaking visuals that command attention.",
      s2Title: "Virtual Presenter Campaigns",
      s2Desc: "Engage your local audience with hyper-realistic AI avatars. We create customized Burmese presenter campaigns delivering localized scripts with authentic character performance.",
      s3Title: "Architectural Animations",
      s3Desc: "Transform blueprints into stunning reality. Our AI-driven architectural process animations showcase real estate and construction projects in fluid, dynamic motion.",
      s4Title: "Social Media Content",
      s4Desc: "Fast-paced, highly engaging short-form content tailored for TikTok, Reels, and Shorts. Optimized to boost viewer retention and maximize organic reach.",
      learnMore: "Learn more",
      ctaTitle: "Ready to transform your content?",
      ctaBtn: "Start Your Project Today"
    },
    MM: {
      title1: "ခေတ်သစ် ",
      titleHighlight: "AI ဗီဒီယို",
      title2: " ဝန်ဆောင်မှုများ",
      subtitle: "ခေတ်မီ AI နည်းပညာများဖြင့် သင့်လုပ်ငန်းကို မြှင့်တင်လိုက်ပါ။ ကြော်ငြာများမှစ၍ ရုပ်ရှင်ဆန်သော ဗီဒီယိုများအထိ အကောင်းဆုံးအရည်အသွေးကို အမြန်ဆုံး ဖန်တီးပေးပါသည်။",
      s1Title: "ရုပ်ရှင်ဆန်သော ကြော်ငြာဗီဒီယိုများ",
      s1Desc: "အဆင့်မြင့်ပုံဖော်မှုများဖြင့် ဖန်တီးထားသော ကြော်ငြာဗီဒီယိုများ။ ဆွဲဆောင်မှုအပြည့်ရှိသော ရုပ်ထွက်များကို ဖန်တီးပေးပါသည်။",
      s2Title: "AI Presenter ဗီဒီယိုများ",
      s2Desc: "အသက်ဝင်သော AI Avatar များဖြင့် သင့်ပရိသတ်ကို ဆွဲဆောင်ပါ။ မြန်မာလိုပြောသော AI Presenter ဗီဒီယိုများကို စိတ်ကြိုက်ဖန်တီးပေးပါသည်။",
      s3Title: "ဗိသုကာနှင့် အဆောက်အဦး ဗီဒီယိုများ",
      s3Desc: "ပုံကြမ်းများမှသည် အသက်ဝင်လှပသော ဗီဒီယိုများဆီသို့။ အိမ်ခြံမြေနှင့် ဆောက်လုပ်ရေးလုပ်ငန်းများအတွက် AI ဖြင့် အသေးစိတ် ဖန်တီးပေးပါသည်။",
      s4Title: "Social Media ဗီဒီယိုများ",
      s4Desc: "TikTok, Reels နှင့် Shorts များအတွက် မြန်ဆန်ပြီး ဆွဲဆောင်မှုရှိသော ဗီဒီယိုတိုများ။ ကြည့်ရှုသူများပြားစေရန် အထူးဖန်တီးပေးပါသည်။",
      learnMore: "အသေးစိတ်လေ့လာရန်",
      ctaTitle: "သင့်ရဲ့ ဗီဒီယိုတွေကို အဆင့်မြှင့်တင်ဖို့ အဆင်သင့်ပဲလား?",
      ctaBtn: "ယခုပဲ စတင်လိုက်ပါ"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          {t.title1} <span className="text-[#00C2FF]">{t.titleHighlight}</span> {t.title2}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </header>

      {/* Services Grid */}
      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {[
            { Icon: Clapperboard, title: t.s1Title, desc: t.s1Desc },
            { Icon: Mic, title: t.s2Title, desc: t.s2Desc },
            { Icon: Building, title: t.s3Title, desc: t.s3Desc },
            { Icon: Video, title: t.s4Title, desc: t.s4Desc },
          ].map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
                <service.Icon className="text-[#00C2FF] w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {service.desc}
              </p>
              <a href="/portfolio" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
                {t.learnMore} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </main>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-gray-900 dark:bg-gray-900 text-white mt-8">
        <h2 className="text-3xl font-bold mb-6">{t.ctaTitle}</h2>
        <button className="bg-[#00C2FF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00a8e0] transition-all shadow-lg shadow-cyan-500/30">
          {t.ctaBtn}
        </button>
      </section>
    </div>
  );
}