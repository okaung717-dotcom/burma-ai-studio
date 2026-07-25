"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function LegalQuickLinks() {
  const { lang } = useLanguage();
  const isMm = lang === "MM";

  return (
    <footer className="border-t border-[#ead9bd] bg-[#fffdf8] px-5 py-6 text-[#1a0b0e] dark:border-[#4b2a1d] dark:bg-[#100708] dark:text-[#fff7eb] md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-black">
          <ShieldCheck className="h-4 w-4 text-[#be9537]" />
          <span>{isMm ? "Burma AI Studio · Legal & Privacy" : "Burma AI Studio · Legal & Privacy"}</span>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-black text-[#79695d] dark:text-[#d8c4a3]">
          <Link href="/legal" className="hover:text-[#911923] dark:hover:text-[#e3bc61]">{isMm ? "မူဝါဒများ" : "Legal"}</Link>
          <Link href="/privacy" className="hover:text-[#911923] dark:hover:text-[#e3bc61]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#911923] dark:hover:text-[#e3bc61]">Terms</Link>
          <Link href="/privacy-choices" className="hover:text-[#911923] dark:hover:text-[#e3bc61]">Privacy Choices</Link>
        </nav>
      </div>
    </footer>
  );
}
