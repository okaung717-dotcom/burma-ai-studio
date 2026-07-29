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

    const nav = document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
    if (!nav) return;

    const navLabel = lang === "MM" ? "စကားပြောရန်" : "Chat";
    const ctaLabel = lang === "MM" ? "Chat ဖွင့်ရန်" : "Open Chat";
    const active = pathname === CHAT_PATH || pathname.startsWith(`${CHAT_PATH}/`);
    const utilityGroup = nav.querySelector<HTMLElement>(":scope > div > div:nth-of-type(2)");

    const sync = () => {
      nav.querySelectorAll<HTMLAnchorElement>('a[href="/contact"], a[href="/chat"]').forEach((link) => {
        // The desktop utility-group CTA is owned by WebsiteNavbarProfile. Never
        // rewrite it as a Chat link; doing so creates href observer contention.
        if (utilityGroup?.contains(link) || link.classList.contains("bas-navbar-profile") || link.dataset.basProfileSlot === "true") return;

        const nextLabel = isCallToAction(link) ? ctaLabel : navLabel;
        if (link.getAttribute("href") !== CHAT_PATH) link.setAttribute("href", CHAT_PATH);
        if ((link.textContent || "").trim() !== nextLabel) link.textContent = nextLabel;
        if (active) link.setAttribute("aria-current", "page");
        else if (link.hasAttribute("aria-current")) link.removeAttribute("aria-current");
      });
    };

    sync();

    // Only the mobile drawer is mounted dynamically. Observe the navbar subtree
    // for additions/removals instead of observing the entire page or attributes.
    const observer = new MutationObserver(sync);
    observer.observe(nav, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [lang, pathname]);

  return null;
}
