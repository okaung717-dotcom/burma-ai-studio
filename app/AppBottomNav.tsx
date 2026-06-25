"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, PlaySquare, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function AppBottomNav() {
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const isMm = lang === "MM";
  const items = [
    { href: "/", label: isMm ? "ပင်မ" : "Home", Icon: Home },
    { href: "/services", label: isMm ? "ဝန်ဆောင်မှု" : "Services", Icon: Grid2X2 },
    { href: "/portfolio", label: isMm ? "လက်ရာ" : "Work", Icon: PlaySquare },
    { href: "/contact", label: isMm ? "ဆက်သွယ်" : "Contact", Icon: MessageCircle },
  ];

  const openAssistant = () => {
    document.getElementById("burma-ai-open-button")?.click();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.65rem)] md:hidden">
      <nav className="mx-auto flex max-w-[430px] items-center justify-between rounded-[2rem] border border-[#be9537]/30 bg-[#fffdf8]/92 px-2 py-2 shadow-[0_18px_55px_rgba(26,11,14,0.18)] backdrop-blur-2xl dark:border-[#e3bc61]/25 dark:bg-[#100708]/92">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`flex min-w-[3.9rem] flex-col items-center justify-center rounded-3xl px-2.5 py-2 text-[10px] font-extrabold transition-all ${active ? "bg-[#911923] text-white shadow-lg shadow-[#911923]/25 dark:bg-[#e3bc61] dark:text-[#100708]" : "text-[#79695d] hover:bg-[#fff3e3] hover:text-[#911923] dark:text-[#d8c4a3] dark:hover:bg-white/8"}`}>
              <Icon className="mb-1 h-[18px] w-[18px]" />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={openAssistant} className="flex min-w-[3.9rem] flex-col items-center justify-center rounded-3xl bg-[#be9537] px-2.5 py-2 text-[10px] font-extrabold text-[#100708] shadow-lg shadow-[#be9537]/25">
          <Sparkles className="mb-1 h-[18px] w-[18px]" />
          <span className="leading-none">AI</span>
        </button>
      </nav>
    </div>
  );
}
