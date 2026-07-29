"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

function findNavbar() {
  if (document.body.classList.contains("bas-app-mode")) return null;
  return document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
}

function findDesktopTarget(nav: HTMLElement | null) {
  return nav?.querySelector<HTMLElement>(":scope > div > div:nth-of-type(1)") || null;
}

function findMobileTarget(nav: HTMLElement | null) {
  if (!nav) return null;

  const drawers = Array.from(nav.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
  const drawer = drawers.find((child) => child.classList.contains("md:hidden") && child.querySelector('a[href="/services"]'));
  return drawer?.querySelector<HTMLElement>(":scope > div:first-child") || null;
}

export default function WebsiteStoriesNav() {
  const [desktopTarget, setDesktopTarget] = useState<HTMLElement | null>(null);
  const [mobileTarget, setMobileTarget] = useState<HTMLElement | null>(null);
  const pathname = usePathname() || "/";
  const { lang } = useLanguage();
  const label = lang === "MM" ? "ဇာတ်လမ်းများ" : "Stories";
  const active = pathname === "/stories" || pathname.startsWith("/stories/");

  useEffect(() => {
    const nav = findNavbar();
    if (!nav) return;

    const syncTargets = () => {
      const nextDesktop = findDesktopTarget(nav);
      const nextMobile = findMobileTarget(nav);
      setDesktopTarget((current) => (current === nextDesktop ? current : nextDesktop));
      setMobileTarget((current) => (current === nextMobile ? current : nextMobile));
    };

    syncTargets();

    // Only the mobile drawer is added and removed dynamically. Watching the
    // navbar subtree is sufficient and avoids whole-page attribute callbacks.
    const observer = new MutationObserver(syncTargets);
    observer.observe(nav, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {desktopTarget
        ? createPortal(
            <Link
              href="/stories"
              className={`bas-stories-nav-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>,
            desktopTarget
          )
        : null}

      {mobileTarget
        ? createPortal(
            <Link
              href="/stories"
              className="bas-stories-mobile-link text-gray-900 dark:text-white font-bold text-lg hover:text-[#911923] dark:hover:text-[#e3bc61] transition-colors"
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>,
            mobileTarget
          )
        : null}
    </>
  );
}
