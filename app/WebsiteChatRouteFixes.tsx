"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const DESKTOP_CHAT_CTA = 'body:not(.bas-app-mode) > nav a[href="/chat"].hidden.md\\:inline-flex';
const CHAT_PAGE_SELECTOR = ".bas-chat-page";

export default function WebsiteChatRouteFixes() {
  const pathname = usePathname() || "/";

  useLayoutEffect(() => {
    const promoteDesktopProfileSlot = () => {
      if (window.innerWidth < 1024 || document.body.classList.contains("bas-app-mode")) return;

      const chatCta = document.querySelector<HTMLAnchorElement>(DESKTOP_CHAT_CTA);
      if (!chatCta || chatCta.classList.contains("bas-navbar-profile")) return;

      // WebsiteNavbarProfile intentionally upgrades the legacy desktop CTA into
      // the profile control. Preserve that contract while the real Chat link
      // remains available in the main navigation and mobile drawer.
      chatCta.setAttribute("href", "/contact");
    };

    promoteDesktopProfileSlot();

    const observer = new MutationObserver(promoteDesktopProfileSlot);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "href"],
    });

    window.addEventListener("resize", promoteDesktopProfileSlot);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", promoteDesktopProfileSlot);
    };
  }, [pathname]);

  useEffect(() => {
    const isChatRoute = pathname === "/chat" || pathname.startsWith("/chat/");
    if (!isChatRoute || document.body.classList.contains("bas-app-mode")) return;

    const body = document.body;
    let frame = 0;

    const syncAvailableHeight = () => {
      const page = document.querySelector<HTMLElement>(CHAT_PAGE_SELECTOR);
      if (!page) return;

      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const pageTop = Math.max(0, page.getBoundingClientRect().top);
      const availableHeight = Math.max(320, Math.floor(viewportHeight - pageTop));
      page.style.setProperty("--bas-chat-available-height", `${availableHeight}px`);
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncAvailableHeight);
    };

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    body.classList.add("bas-chat-viewport-lock");
    scheduleSync();

    const observer = new ResizeObserver(scheduleSync);
    const nav = document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
    const page = document.querySelector<HTMLElement>(CHAT_PAGE_SELECTOR);
    if (nav) observer.observe(nav);
    if (page) observer.observe(page);

    window.addEventListener("resize", scheduleSync);
    window.visualViewport?.addEventListener("resize", scheduleSync);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleSync);
      window.visualViewport?.removeEventListener("resize", scheduleSync);
      body.classList.remove("bas-chat-viewport-lock");
      document.querySelector<HTMLElement>(CHAT_PAGE_SELECTOR)?.style.removeProperty("--bas-chat-available-height");
    };
  }, [pathname]);

  return null;
}
