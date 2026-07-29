"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

const CHAT_PATH = "/chat";

function isCallToAction(link: HTMLAnchorElement) {
  const className = link.getAttribute("class") || "";
  const text = (link.textContent || "").trim().toLowerCase();
  return className.includes("bg-[#00C2FF]") || text.includes("message") || text.includes("စကားပြော");
}

export default function WebsiteChatNav() {
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();

  useEffect(() => {
    if (document.body.classList.contains("bas-app-mode")) return;

    const navLabel = lang === "MM" ? "စကားပြောရန်" : "Chat";
    const ctaLabel = lang === "MM" ? "Chat ဖွင့်ရန်" : "Open Chat";
    const active = pathname === CHAT_PATH || pathname.startsWith(`${CHAT_PATH}/`);

    const sync = () => {
      const nav = document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
      if (!nav) return;

      nav.querySelectorAll<HTMLAnchorElement>('a[href="/contact"], a[href="/chat"]').forEach((link) => {
        if (link.classList.contains("bas-navbar-profile")) return;

        const nextLabel = isCallToAction(link) ? ctaLabel : navLabel;
        if (link.getAttribute("href") !== CHAT_PATH) link.setAttribute("href", CHAT_PATH);
        if ((link.textContent || "").trim() !== nextLabel) link.textContent = nextLabel;
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang, pathname]);

  return null;
}
