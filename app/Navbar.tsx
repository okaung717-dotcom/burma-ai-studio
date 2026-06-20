"use client";
import { useState } from "react";
import { Video, Menu, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeProvider"; // အသစ်ထည့်လိုက်ပါ

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme(); // Context ကနေ လှမ်းယူလိုက်ပါ

  const t = {
    EN: { home: "Home", services: "Services", portfolio: "Portfolio", contact: "Contact", message: "Message Us", lang: "English", dark: "Dark Mode", light: "Light Mode" },
    MM: { home: "ပင်မစာမျက်နှာ", services: "ဝန်ဆောင်မှုများ", portfolio: "လက်ရာများ", contact: "ဆက်သွယ်ရန်", message: "စကားပြောရန်", lang: "မြန်မာ", dark: "အမှောင်စနစ်", light: "အလင်းစနစ်" }
  }[lang];

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white dark:bg-gray-950 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide whitespace-nowrap dark:text-white">
          <Video className="text-[#00C2FF] w-6 h-6" />
          Burma AI Studio
        </div>

        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
          <a href="/" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.home}</a>
          <a href="/services" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.services}</a>
          <a href="/portfolio" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.portfolio}</a>
          <a href="/contact" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.contact}</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-[#00C2FF]">
            <Globe className="w-5 h-5" /> {lang}
          </button>

          {/* ဒီမှာ Context က theme ကို သုံးပေးရပါမယ် */}
          <button onClick={toggleTheme} className="hidden md:block text-gray-500 dark:text-gray-300 hover:text-[#00C2FF]">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a href="/contact" className="bg-[#00C2FF] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors">
            {t.message}
          </a>
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="block md:hidden dark:text-white">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t dark:border-gray-800 md:hidden flex flex-col px-6 py-6 z-50">
          <div className="flex flex-col gap-6">
            <a href="/" className="text-gray-900 dark:text-white font-bold text-lg">{t.home}</a>
            <a href="/services" className="text-gray-500 dark:text-gray-300 font-bold text-lg">{t.services}</a>
            <a href="/portfolio" className="text-gray-500 dark:text-gray-300 font-bold text-lg">{t.portfolio}</a>
            <a href="/contact" className="text-gray-500 dark:text-gray-300 font-bold text-lg">{t.contact}</a>
          </div>

          <div className="flex flex-col items-start gap-5 pt-6 mt-4 border-t dark:border-gray-800">
            <button onClick={toggleLang} className="flex items-center gap-3 font-bold text-gray-500 dark:text-gray-300">
              <Globe className="w-6 h-6 text-[#00C2FF]" /> {t.lang}
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-3 font-bold text-gray-500 dark:text-gray-300">
              {theme === "dark" ? <Sun className="w-6 h-6 text-[#00C2FF]" /> : <Moon className="w-6 h-6 text-[#00C2FF]" />}
              {theme === "dark" ? t.light : t.dark}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}