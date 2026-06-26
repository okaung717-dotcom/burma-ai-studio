"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string; platform: string }>;
};

type PortalTarget = {
  node: HTMLElement;
  mobile: boolean;
};

function AppIconMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-[0.78rem] bg-white ring-1 ring-[#be9537]/70 ${small ? "h-8 w-8" : "h-9 w-9"}`}>
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
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [navbarTarget, setNavbarTarget] = useState<PortalTarget | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => null);
    }

    function handleInstall(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    }

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

    window.addEventListener("beforeinstallprompt", handleInstall);
    window.addEventListener("resize", findNavbarControls);
    requestAnimationFrame(findNavbarControls);
    const timer = window.setInterval(findNavbarControls, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall);
      window.removeEventListener("resize", findNavbarControls);
      window.clearInterval(timer);
    };
  }, []);

  if (isStandalone) return null;

  async function handleInstallClick() {
    setIsInstalling(true);

    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice.catch(() => null);
      setInstallEvent(null);
      setIsInstalling(false);
      return;
    }

    window.setTimeout(() => setIsInstalling(false), 1200);
  }

  const targetIsMobile = navbarTarget?.mobile ?? false;
  const installButton = (
    <button
      onClick={handleInstallClick}
      className={targetIsMobile
        ? "bas-install-button order-[-1] inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-2.5 pr-3 text-[11px] font-black text-[#fff7eb] shadow-md shadow-black/10 transition active:scale-95 md:hidden"
        : "bas-install-button order-[-1] hidden h-12 shrink-0 items-center gap-2.5 rounded-full border border-[#be9537]/45 bg-[#100708] px-4 pr-5 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"}
      aria-label="Install Burma AI Studio app"
      disabled={isInstalling}
    >
      <AppIconMark small={targetIsMobile} />
      <span>{targetIsMobile ? (isInstalling ? "..." : "App") : (isInstalling ? "Installing" : "Install App")}</span>
    </button>
  );

  return <>{navbarTarget ? createPortal(installButton, navbarTarget.node) : null}</>;
}
