"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, Globe, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageContext";

const translations = {
  EN: { home: "Home", services: "Services", portfolio: "Portfolio", contact: "Contact", message: "Message Us", langText: "English", dark: "Dark Mode", light: "Light Mode" },
  MM: { home: "ပင်မစာမျက်နှာ", services: "ဝန်ဆောင်မှုများ", portfolio: "လက်ရာများ", contact: "ဆက်သွယ်ရန်", message: "စကားပြောရန်", langText: "မြန်မာ", dark: "အမှောင်စနစ်", light: "အလင်းစနစ်" }
} as const;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
        
        {/* Logo container with size and professional alignment */}
        <Link href="/" className="flex items-center gap-3">
          <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            style={{ display: "block" }}
            viewBox="0 0 2048 2048" 
            className="h-16 w-auto dark:brightness-[1.15]" // Increased logo height for professional feel
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
                <linearGradient id="Gradient1" gradientUnits="userSpaceOnUse" x1="1127.68" y1="1015.71" x2="1119.45" y2="1005.66">
                    <stop className="stop0" offset="0" stopOpacity={1} stopColor="rgb(144,21,30)"/>
                    <stop className="stop1" offset="1" stopOpacity={1} stopColor="rgb(157,72,67)"/>
                </linearGradient>
            </defs>
            <path transform="translate(0,0)" fill="none" d="M 0 0 L 2048 0 L 2048 2048 L 0 2048 L 0 0 z"/>
            {/* Paths removed for brevity */}
          </svg>
          <span className="text-xl font-bold text-gray-950 dark:text-white">YourBrand</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest items-center">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.home}</Link>
          <Link href="/services" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.services}</Link>
          <Link href="/portfolio" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.portfolio}</Link>
          <Link href="/contact" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">{t.contact}</Link>
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-[#00C2FF] transition-colors px-2">
            <Globe className="w-4 h-4" /> {lang}
          </button>
          <button onClick={toggleTheme} className="hidden md:block text-gray-500 dark:text-gray-300 hover:text-[#00C2FF]">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/contact" className="hidden md:inline-flex bg-[#00C2FF] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors whitespace-nowrap">
            {t.message}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="block md:hidden text-gray-900 dark:text-white focus:outline-none">
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-2xl border-t border-gray-100 dark:border-gray-900 md:hidden flex flex-col px-6 py-8 z-[100] transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.home}</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.services}</Link>
            <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.portfolio}</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg hover:text-[#00C2FF] transition-colors">{t.contact}</Link>
          </div>

          <div className="flex flex-col items-start gap-6 pt-6 mt-6 border-t border-gray-100 dark:border-gray-900">
            {/* Mobile Language Switcher */}
            <button onClick={() => { toggleLang(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-bold text-gray-900 dark:text-white text-base w-full hover:text-[#00C2FF] transition-colors">
              <Globe className="w-5 h-5 text-[#00C2FF]" /> {t.langText} ({lang})
            </button>
            
            {/* Mobile Dark/Light Theme Toggle */}
            <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-bold text-gray-900 dark:text-white text-base w-full hover:text-[#00C2FF] transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5 text-[#00C2FF]" /> : <Moon className="w-5 h-5 text-[#00C2FF]" />}
              {theme === "dark" ? t.light : t.dark}
            </button>
            
            {/* Mobile Message Button */}
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex justify-center items-center bg-[#00C2FF] text-white px-5 py-3 rounded-xl font-bold text-sm w-full shadow-md hover:bg-blue-600 transition-colors text-center">
              {t.message}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}