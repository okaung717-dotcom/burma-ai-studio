"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

const NAV_SELECTOR = "body:not(.bas-app-mode) > nav";

function applyCurrentState(nav: HTMLElement, lang: "EN" | "MM", pathname: string) {
  const row = nav.querySelector<HTMLElement>(":scope > div");
  if (!row) return false;

  const mainGroup = row.querySelector<HTMLElement>(":scope > div:nth-of-type(1)");
  const utilityGroup = row.querySelector<HTMLElement>(":scope > div:nth-of-type(2)");
  if (!mainGroup || !utilityGroup) return false;

  const chatLabel = lang === "MM" ? "စကားပြောရန်" : "Chat";
  const storiesLabel = lang === "MM" ? "ဇာတ်လမ်းများ" : "Stories";

  const mainLinks = Array.from(mainGroup.querySelectorAll<HTMLAnchorElement>(":scope > a"));
  const legacyContact = mainLinks.find((link) => {
    const href = link.getAttribute("href");
    return href === "/contact" || href === "/chat";
  });

  if (legacyContact) {
    if (legacyContact.getAttribute("href") !== "/chat") legacyContact.setAttribute("href", "/chat");
    if ((legacyContact.textContent || "").trim() !== chatLabel) legacyContact.textContent = chatLabel;
    if (pathname === "/chat" || pathname.startsWith("/chat/")) legacyContact.setAttribute("aria-current", "page");
    else legacyContact.removeAttribute("aria-current");
  }

  let storiesLink = mainGroup.querySelector<HTMLAnchorElement>(":scope > a.bas-stories-nav-link");
  if (!storiesLink) {
    storiesLink = document.createElement("a");
    storiesLink.className = `${legacyContact?.className || ""} bas-stories-nav-link`.trim();
    mainGroup.appendChild(storiesLink);
  }
  storiesLink.setAttribute("href", "/stories");
  if ((storiesLink.textContent || "").trim() !== storiesLabel) storiesLink.textContent = storiesLabel;
  if (pathname === "/stories" || pathname.startsWith("/stories/")) storiesLink.setAttribute("aria-current", "page");
  else storiesLink.removeAttribute("aria-current");

  const profileSlot = utilityGroup.querySelector<HTMLAnchorElement>(
    ":scope > a.hidden.md\\:inline-flex:not(.bas-install-button), :scope > a.bas-navbar-profile"
  );
  if (profileSlot) {
    profileSlot.dataset.basProfileSlot = "true";
    profileSlot.classList.add("bas-navbar-profile");
    if (profileSlot.getAttribute("href") !== "#profile") profileSlot.setAttribute("href", "#profile");
    profileSlot.setAttribute("role", "button");
    profileSlot.setAttribute("aria-label", "Open profile menu");
    profileSlot.setAttribute("aria-haspopup", "dialog");
    profileSlot.setAttribute("aria-controls", "bas-profile-menu");
    profileSlot.setAttribute("title", "Profile");
  }

  const mobileDrawer = Array.from(nav.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.classList.contains("md:hidden") && Boolean(child.querySelector('a[href="/services"]'))
  );

  if (mobileDrawer) {
    const mobileLinksGroup = mobileDrawer.querySelector<HTMLElement>(":scope > div:first-child");
    if (mobileLinksGroup) {
      const mobileLinks = Array.from(mobileLinksGroup.querySelectorAll<HTMLAnchorElement>(":scope > a"));
      const mobileContact = mobileLinks.find((link) => {
        const href = link.getAttribute("href");
        return href === "/contact" || href === "/chat";
      });
      if (mobileContact) {
        mobileContact.setAttribute("href", "/chat");
        mobileContact.textContent = chatLabel;
      }

      let mobileStories = mobileLinksGroup.querySelector<HTMLAnchorElement>(":scope > a.bas-stories-mobile-link");
      if (!mobileStories) {
        mobileStories = document.createElement("a");
        mobileStories.className = `${mobileContact?.className || ""} bas-stories-mobile-link`.trim();
        mobileLinksGroup.appendChild(mobileStories);
      }
      mobileStories.setAttribute("href", "/stories");
      mobileStories.textContent = storiesLabel;
    }
  }

  return true;
}

export default function WebsiteNavbarStaticBridge() {
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const safeLang = lang === "MM" ? "MM" : "EN";

  useLayoutEffect(() => {
    if (document.body.classList.contains("bas-app-mode")) return;

    let frame = 0;
    let attempts = 0;

    const sync = () => {
      const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
      if (nav && applyCurrentState(nav, safeLang, pathname)) return;
      if (attempts >= 12) return;
      attempts += 1;
      frame = window.requestAnimationFrame(sync);
    };

    const scheduleSync = () => {
      attempts = 0;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };

    sync();
    const onNavClick = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(NAV_SELECTOR)) scheduleSync();
    };

    document.addEventListener("click", onNavClick, true);
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("click", onNavClick, true);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [pathname, safeLang]);

  return null;
}
