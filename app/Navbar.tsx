"use client";
import { useState, useEffect } from "react";
import { Video, Menu, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ခုနက ကျွန်တော်တို့ ဆောက်ခဲ့တဲ့ Context ထဲက ဘာသာစကားကို လှမ်းခေါ်သုံးတာပါ
  const { lang, toggleLang } = useLanguage();

  // Dark Mode အတွက် အလုပ်လုပ်မယ့် အပိုင်း
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ဘာသာစကားအလိုက် စာသားတွေ ပြောင်းဖို့ မှတ်ထားတဲ့ အပိုင်း
  const t = {
    EN: { home: "Home", services: "Services", portfolio: "Portfolio", contact: "Contact", message: "Message Us", lang: "English" },
    MM: { home: "ပင်မစာမျက်နှာ", services: "ဝန်ဆောင်မှုများ", portfolio: "လက်ရာများ", contact: "ဆက်သွယ်ရန်", message: "စကားပြောရန်", lang: "မြန်မာ" }
  }[lang];

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white dark:bg-gray-900 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide whitespace-nowrap dark:text-white">
          <Video className="text-[#00C2FF] w-6 h-6" />
          Burma AI Studio
        </div>

        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
          <a href="/" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors whitespace-nowrap">{t.home}</a>
          <a href="/services" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors whitespace-nowrap">{t.services}</a>
          <a href="/portfolio" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors whitespace-nowrap">{t.portfolio}</a>
          <a href="/contact" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors whitespace-nowrap">{t.contact}</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-[#00C2FF] transition-colors">
            <Globe className="w-5 h-5" /> {lang}
          </button>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="hidden md:block text-gray-500 dark:text-gray-300 hover:text-[#00C2FF] transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap hover:bg-blue-600 transition-colors">
            {t.message}
          </a>
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="block md:hidden text-[#111827] dark:text-white focus:outline-none">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-100 dark:border-gray-700 md:hidden flex flex-col px-6 py-6 z-50 transition-colors duration-300">
          <div className="flex flex-col gap-6">
            <a href="/" className="text-gray-900 dark:text-white font-bold text-lg border-b border-gray-50 dark:border-gray-700 pb-2">{t.home}</a>
            <a href="/services" className="text-gray-500 dark:text-gray-300 font-bold text-lg border-b border-gray-50 dark:border-gray-700 pb-2">{t.services}</a>
            <a href="/portfolio" className="text-gray-500 dark:text-gray-300 font-bold text-lg border-b border-gray-50 dark:border-gray-700 pb-2">{t.portfolio}</a>
            <a href="/contact" className="text-gray-500 dark:text-gray-300 font-bold text-lg pb-2">{t.contact}</a>
          </div>

          <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={toggleLang} className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-300">
              <Globe className="w-6 h-6 text-[#00C2FF]" /> {t.lang}
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}