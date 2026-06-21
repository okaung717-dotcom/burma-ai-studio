"use client";
import { useState } from "react";
import Link from "next/link";
import { Video, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white dark:bg-gray-950 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide whitespace-nowrap dark:text-white">
          <Video className="text-[#00C2FF] w-6 h-6" />
          Burma AI Studio
        </Link>

        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">Home</Link>
          <Link href="/services" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">Services</Link>
          <Link href="/portfolio" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">Portfolio</Link>
          <Link href="/contact" className="hover:text-gray-900 dark:hover:text-[#00C2FF] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="hidden md:block text-gray-500 dark:text-gray-300 hover:text-[#00C2FF]">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link href="/contact" className="hidden md:inline-flex bg-[#00C2FF] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors whitespace-nowrap">
            Message Us
          </Link>
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="block md:hidden dark:text-white">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t dark:border-gray-800 md:hidden flex flex-col px-6 py-6 z-50">
          <div className="flex flex-col gap-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 dark:text-white font-bold text-lg">Home</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-300 font-bold text-lg">Services</Link>
            <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-300 font-bold text-lg">Portfolio</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-300 font-bold text-lg">Contact</Link>
          </div>

          <div className="flex flex-col items-start gap-5 pt-6 mt-4 border-t dark:border-gray-800">
            <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-bold text-gray-500 dark:text-gray-300">
              {theme === "dark" ? <Sun className="w-6 h-6 text-[#00C2FF]" /> : <Moon className="w-6 h-6 text-[#00C2FF]" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}