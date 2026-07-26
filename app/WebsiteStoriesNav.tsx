"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

function findDesktopTarget() {
  if (document.body.classList.contains("bas-app-mode")) return null;
  return document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav > div > div:nth-of-type(1)");
}

function findMobileTarget() {
  if (document.body.classList.contains("bas-app-mode")) return null;

  const nav = document.querySelector<HTMLElement>("body:not(.bas-app-mode) > nav");
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
    const syncTargets = () => {
      setDesktopTarget(findDesktopTarget());
      setMobileTarget(findMobileTarget());
    };

    syncTargets();
    const observer = new MutationObserver(syncTargets);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", syncTargets);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncTargets);
    };
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
