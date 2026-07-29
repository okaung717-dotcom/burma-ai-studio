"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import "./website-navbar-utility-controls.css";

const DESKTOP_PROFILE_SLOT = 'body:not(.bas-app-mode) > nav > div > div:nth-of-type(2) > a.hidden.md\\:inline-flex:not(.bas-install-button)';
const CHAT_PAGE_SELECTOR = ".bas-chat-page";

export default function WebsiteChatRouteFixes() {
  const pathname = usePathname() || "/";

  useLayoutEffect(() => {
    let frame = 0;
    let attempts = 0;

    const promoteDesktopProfileSlot = () => {
      if (window.innerWidth < 1024 || document.body.classList.contains("bas-app-mode")) return true;

      const slot = document.querySelector<HTMLAnchorElement>(DESKTOP_PROFILE_SLOT);
      if (!slot) return false;

      slot.dataset.basProfileSlot = "true";

      // WebsiteNavbarProfile owns the control after it adds bas-navbar-profile.
      // Before that hand-off, keep the legacy href expected by its attachment logic.
      if (!slot.classList.contains("bas-navbar-profile") && slot.getAttribute("href") !== "/contact") {
        slot.setAttribute("href", "/contact");
      }

      return true;
    };

    const attachWithBoundedRetry = () => {
      if (promoteDesktopProfileSlot() || attempts >= 10) return;
      attempts += 1;
      frame = window.requestAnimationFrame(attachWithBoundedRetry);
    };

    attachWithBoundedRetry();

    const onResize = () => {
      attempts = 0;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(attachWithBoundedRetry);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
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
      const nextValue = `${availableHeight}px`;

      if (page.style.getPropertyValue("--bas-chat-available-height") !== nextValue) {
        page.style.setProperty("--bas-chat-available-height", nextValue);
      }
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncAvailableHeight);
    };

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    body.classList.add("bas-chat-viewport-lock");
    scheduleSync();

    // Navbar height can affect the available chat viewport. The page itself is
    // deliberately not observed because setting its height could retrigger a
    // ResizeObserver feedback loop.
    const resizeObserver = new ResizeObserver(scheduleSync);
    const nav = document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
    if (nav) resizeObserver.observe(nav);

    window.addEventListener("resize", scheduleSync, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleSync);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleSync);
      window.visualViewport?.removeEventListener("resize", scheduleSync);
      body.classList.remove("bas-chat-viewport-lock");
      document.querySelector<HTMLElement>(CHAT_PAGE_SELECTOR)?.style.removeProperty("--bas-chat-available-height");
    };
  }, [pathname]);

  return null;
}
