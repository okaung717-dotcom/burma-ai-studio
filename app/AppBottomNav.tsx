"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, BriefcaseBusiness, Home, MessageCircle, PlaySquare } from "lucide-react";
import { useLanguage } from "./LanguageContext";

type NavItem =
  | { type: "link"; href: string; label: string; Icon: typeof Home }
  | { type: "ai"; label: string; Icon: typeof Bot };

export default function AppBottomNav() {
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const isMm = lang === "MM";

  const items: NavItem[] = [
    { type: "link", href: "/", label: isMm ? "ပင်မ" : "Home", Icon: Home },
    { type: "link", href: "/services", label: isMm ? "ဝန်ဆောင်မှု" : "Services", Icon: BriefcaseBusiness },
    { type: "ai", label: "AI", Icon: Bot },
    { type: "link", href: "/portfolio", label: isMm ? "လက်ရာ" : "Work", Icon: PlaySquare },
    { type: "link", href: "/contact", label: isMm ? "ဆက်သွယ်" : "Chat", Icon: MessageCircle },
  ];

  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent("bas-open-assistant"));
    document.getElementById("burma-ai-open-button")?.click();
  };

  const isLegal = ["/legal", "/privacy", "/terms", "/project-policy", "/ai-ip-policy", "/acceptable-use", "/copyright", "/privacy-choices"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isLegal) return null;

  return (
    <div className="bas-app-bottom-nav fixed inset-x-0 bottom-0 z-[10010] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.55rem)] md:hidden">
      <nav className="isolate mx-auto grid max-w-[430px] grid-cols-5 items-end rounded-[1.75rem] border border-[#e4c993]/70 bg-[#fffaf1]/96 px-2 pb-2 pt-2 shadow-[0_20px_65px_rgba(26,11,14,0.28)] ring-1 ring-white/80 backdrop-blur-2xl dark:border-[#6b4b2a] dark:bg-[#1a0b0e]/96 dark:ring-white/5">
        {items.map((item) => {
          const Icon = item.Icon;

          if (item.type === "ai") {
            return (
              <button
                key="ai"
                type="button"
                onClick={openAssistant}
                className="relative mx-auto flex h-[4.15rem] w-[4.15rem] -translate-y-3 flex-col items-center justify-center rounded-[1.55rem] bg-[#a51624] text-[9px] font-black text-white shadow-[0_18px_38px_rgba(165,22,36,0.38)] ring-4 ring-[#fffaf1] transition active:scale-95 dark:bg-[#e3bc61] dark:text-[#100708] dark:ring-[#1a0b0e]"
                aria-label="Open Burma AI assistant"
              >
                <span className="absolute inset-1 rounded-[1.25rem] border border-white/15 dark:border-[#100708]/10" />
                <Icon className="relative mb-1 h-[21px] w-[21px]" strokeWidth={2.45} />
                <span className="relative leading-none">{item.label}</span>
              </button>
            );
          }

          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-auto flex h-[3.65rem] w-[4rem] flex-col items-center justify-center rounded-[1.15rem] px-1 text-center text-[9px] font-black leading-none transition active:scale-95 ${
                active
                  ? "bg-[#f4e4c8] text-[#a51624] dark:bg-[#32171a] dark:text-[#e3bc61]"
                  : "text-[#63534a] dark:text-[#d8c4a3]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="mb-1.5 h-[20px] w-[20px]" strokeWidth={active ? 2.8 : 2.3} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
