"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, PlaySquare, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";

type NavItem =
  | { type: "link"; href: string; label: string; Icon: typeof Home }
  | { type: "ai"; label: string; Icon: typeof Sparkles };

export default function AppBottomNav() {
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const isMm = lang === "MM";

  const items: NavItem[] = [
    { type: "link", href: "/", label: isMm ? "ပင်မ" : "Home", Icon: Home },
    { type: "link", href: "/services", label: isMm ? "ဝန်ဆောင်မှု" : "Services", Icon: Grid2X2 },
    { type: "ai", label: "AI", Icon: Sparkles },
    { type: "link", href: "/portfolio", label: isMm ? "လက်ရာ" : "Work", Icon: PlaySquare },
    { type: "link", href: "/contact", label: isMm ? "ဆက်သွယ်" : "Contact", Icon: MessageCircle },
  ];

  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent("bas-open-assistant"));
    document.getElementById("burma-ai-open-button")?.click();
  };

  return (
    <div className="bas-app-bottom-nav fixed inset-x-0 bottom-0 z-[9998] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.65rem)] md:hidden">
      <nav className="mx-auto grid max-w-[430px] grid-cols-5 items-center rounded-[2rem] border border-[#be9537]/30 bg-[#fffdf8]/94 px-2 py-2 shadow-[0_18px_55px_rgba(26,11,14,0.18)] backdrop-blur-2xl dark:border-[#e3bc61]/25 dark:bg-[#100708]/92">
        {items.map((item) => {
          const Icon = item.Icon;

          if (item.type === "ai") {
            return (
              <button key="ai" type="button" onClick={openAssistant} className="mx-auto flex min-w-[3.9rem] -translate-y-2 flex-col items-center justify-center rounded-[1.65rem] bg-[#be9537] px-3 py-3 text-[10px] font-extrabold text-[#100708] shadow-[0_16px_34px_rgba(190,149,55,0.35)] ring-4 ring-[#fffdf8] transition-transform active:scale-95 dark:ring-[#100708]" aria-label="Open Burma AI assistant">
                <Icon className="mb-1 h-[20px] w-[20px]" />
                <span className="leading-none">{item.label}</span>
              </button>
            );
          }

          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className={`mx-auto flex min-w-[3.65rem] flex-col items-center justify-center rounded-3xl px-2 py-2 text-[10px] font-extrabold transition-all ${active ? "bg-[#911923] text-white shadow-lg shadow-[#911923]/25 dark:bg-[#e3bc61] dark:text-[#100708]" : "text-[#79695d] hover:bg-[#fff3e3] hover:text-[#911923] dark:text-[#d8c4a3] dark:hover:bg-white/8"}`}>
              <Icon className="mb-1 h-[18px] w-[18px]" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
