"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalTarget = {
  node: HTMLElement;
  mobile: boolean;
};

function AppIconMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[0.78rem] bg-white ring-1 ring-[#be9537]/70 ${
        small ? "h-8 w-8" : "h-9 w-9"
      }`}
    >
      <img
        src="/burma-ai-icon.svg?v=10"
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}

export default function InstallAppPrompt() {
  const [navbarTarget, setNavbarTarget] = useState<PortalTarget | null>(null);

  useEffect(() => {
    function findNavbarControls() {
      const nav = document.querySelector("nav");
      if (!nav) return;

      if (window.innerWidth < 768) {
        const menuButton = nav.querySelector<HTMLButtonElement>("button.block.md\\:hidden");
        const controls = menuButton?.closest("div.flex.items-center.gap-4") as HTMLElement | null;
        setNavbarTarget(controls ? { node: controls, mobile: true } : null);
        return;
      }

      const languageButton = Array.from(nav.querySelectorAll<HTMLButtonElement>("button") ?? []).find((button) => {
        const label = button.textContent?.trim();
        return label === "EN" || label === "MM";
      });

      const controls = languageButton?.closest("div.flex.items-center.gap-4") as HTMLElement | null;
      setNavbarTarget(controls ? { node: controls, mobile: false } : null);
    }

    window.addEventListener("resize", findNavbarControls);
    requestAnimationFrame(findNavbarControls);
    const timer = window.setInterval(findNavbarControls, 1000);

    return () => {
      window.removeEventListener("resize", findNavbarControls);
      window.clearInterval(timer);
    };
  }, []);

  const targetIsMobile = navbarTarget?.mobile ?? false;

  const installButton = (
    <a
      href="/downloads/burma-ai-studio.apk"
      download
      className={
        targetIsMobile
          ? "bas-install-button order-[-1] inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-2.5 pr-3 text-[11px] font-black text-[#fff7eb] shadow-md shadow-black/10 transition active:scale-95 md:hidden"
          : "bas-install-button order-[-1] hidden h-12 shrink-0 items-center gap-2.5 rounded-full border border-[#be9537]/45 bg-[#100708] px-4 pr-5 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"
      }
      aria-label="Download Burma AI Studio Android APK"
    >
      <AppIconMark small={targetIsMobile} />
      <span>{targetIsMobile ? "APK" : "Download APK"}</span>
    </a>
  );

  return <>{navbarTarget ? createPortal(installButton, navbarTarget.node) : null}</>;
}