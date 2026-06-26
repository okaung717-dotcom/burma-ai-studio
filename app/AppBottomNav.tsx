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
      <nav className="isolate mx-auto grid max-w-[430px] grid-cols-5 items-center justify-items-center rounded-[2rem] border border-[#e7d4ad] bg-[#fffaf1] px-2 py-2 shadow-[0_18px_55px_rgba(26,11,14,0.24)] ring-1 ring-white/90 dark:border-[#e7d4ad] dark:bg-[#fffaf1] dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        {items.map((item) => {
          const Icon = item.Icon;

          if (item.type === "ai") {
            return (
              <button key="ai" type="button" onClick={openAssistant} className="flex h-[4.25rem] w-[4.25rem] -translate-y-2 flex-col items-center justify-center rounded-[1.7rem] bg-[#be9537] text-[10px] font-extrabold text-[#100708] shadow-[0_16px_34px_rgba(190,149,55,0.36)] ring-4 ring-[#fffaf1] transition-transform active:scale-95" aria-label="Open Burma AI assistant">
                <Icon className="mb-1 h-[20px] w-[20px] shrink-0" strokeWidth={2.55} />
                <span className="max-w-full text-center leading-none text-[#100708]">{item.label}</span>
              </button>
            );
          }

          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const colorClass = active ? "text-[#a51624]" : "text-[#2b1914]";

          return (
            <Link key={item.href} href={item.href} className={`flex h-[3.7rem] w-[4rem] flex-col items-center justify-center rounded-none bg-transparent px-1 text-center text-[9px] font-black leading-[1.05] shadow-none transition-colors ${colorClass} hover:text-[#a51624]`} aria-current={active ? "page" : undefined}>
              <Icon className={`mb-1 h-[20px] w-[20px] shrink-0 transition-colors ${colorClass}`} strokeWidth={active ? 2.8 : 2.45} />
              <span className={`block max-w-full overflow-visible text-ellipsis leading-[1.08] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] ${colorClass}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
