"use client";
import { Mail, Phone, Globe, Send } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Contact() {
  const { lang } = useLanguage();

  const t = {
    EN: {
      title1: "Let's ",
      titleHighlight: "Create",
      title2: " Something Amazing",
      subtitle: "Ready to elevate your brand with next-gen AI video production? Reach out directly via any of the channels below, and we will get back to you immediately.",
      emailLabel: "Email Us",
      phoneLabel: "Call Us",
      telegramLabel: "Telegram",
      facebookLabel: "Facebook",
      firstName: "First Name",
      lastName: "Last Name",
      emailAddress: "Email Address",
      projectDetails: "Project Details",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "john@company.com",
      projectPlaceholder: "Tell us about your video needs...",
      sendButton: "Send Message"
    },
    MM: {
      title1: "အကောင်းဆုံး ",
      titleHighlight: "လက်ရာများကို",
      title2: " ဖန်တီးကြစို့",
      subtitle: "ခေတ်မီ AI ဗီဒီယို ဖန်တီးမှုများဖြင့် သင့်လုပ်ငန်းကို မြှင့်တင်ဖို့ အဆင်သင့်ပဲလား? အောက်ပါ ဆက်သွယ်ရန် လမ်းကြောင်းများမှတဆင့် တိုက်ရိုက်ဆက်သွယ်နိုင်ပြီး ကျွန်ုပ်တို့ ချက်ချင်း အကြောင်းပြန်ပေးပါမည်။",
      emailLabel: "အီးမေးလ် ပို့ရန်",
      phoneLabel: "ဖုန်းခေါ်ဆိုရန်",
      telegramLabel: "Telegram",
      facebookLabel: "Facebook",
      firstName: "ပထမအမည်",
      lastName: "နောက်ဆုံးအမည်",
      emailAddress: "အီးမေးလ် လိပ်စာ",
      projectDetails: "ပရောဂျက် အသေးစိတ်",
      firstNamePlaceholder: "ဥပမာ - အောင်",
      lastNamePlaceholder: "ဥပမာ - ခန့်",
      emailPlaceholder: "သင့်အီးမေးလ်ထည့်ပါ",
      projectPlaceholder: "သင်လိုအပ်သော ဗီဒီယိုအကြောင်း ပြောပြပေးပါ...",
      sendButton: "မက်ဆေ့ချ် ပို့ရန်"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-[#00C2FF] selection:text-white transition-colors duration-300">
      
      {/* Contact Section */}
      <main className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        
        {/* Left: Contact Info */}
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t.title1} <span className="text-[#00C2FF]">{t.titleHighlight}</span> <br/>{t.title2}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="space-y-6 pt-4">
            {[
              { Icon: Mail, label: t.emailLabel, val: "okaung717@gmail.com", href: "mailto:okaung717@gmail.com" },
              { Icon: Phone, label: t.phoneLabel, val: "09671010011", href: "tel:09671010011" },
              { Icon: Send, label: t.telegramLabel, val: "@BurmaAiStudio", href: "https://t.me/BurmaAiStudio" },
              { Icon: Globe, label: t.facebookLabel, val: "Burma Ai Studio", href: "https://www.facebook.com/BurmaAiaStudio/" },
            ].map((item, index) => (
              <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer w-fit">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#00C2FF]/10 transition-colors">
                    <item.Icon className="w-5 h-5 text-[#00C2FF]" />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">{item.label}</p>
                    <p className="font-bold text-gray-900 dark:text-white">{item.val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="md:w-1/2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-gray-800">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.firstName}</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.firstNamePlaceholder} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.lastName}</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.lastNamePlaceholder} />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.emailAddress}</label>
                <input type="email" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.emailPlaceholder} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.projectDetails}</label>
                <textarea rows={4} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all resize-none text-gray-900 dark:text-white" placeholder={t.projectPlaceholder}></textarea>
            </div>
            <button type="button" className="w-full bg-[#111827] dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-[#00C2FF] transition-colors shadow-lg">
                {t.sendButton}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}