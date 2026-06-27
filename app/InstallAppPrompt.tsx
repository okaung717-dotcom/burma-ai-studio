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

function isAppleMobile() {
  if (typeof window === "undefined") return false;
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  const touchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/i.test(userAgent) || touchMac;
}

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

function IosInstallSheet({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[100000] md:hidden" role="dialog" aria-modal="true" aria-label="Install Burma AI Studio on iPhone">
      <button aria-label="Close install guide" className="absolute inset-0 bg-[#100708]/45 backdrop-blur-sm" onClick={onClose} />
      <section className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] overflow-hidden rounded-[2rem] border border-[#ead9bd] bg-[#fffaf1] p-4 text-[#1a0b0e] shadow-[0_28px_90px_rgba(16,7,8,0.35)]">
        <div className="flex items-center gap-3 border-b border-[#ead9bd] pb-3">
          <AppIconMark />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a51624]">iPhone / iPad Install</p>
            <h2 className="text-lg font-black leading-tight">Burma AI Studio App ထည့်ရန်</h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#100708] text-sm font-black text-white" aria-label="Close">×</button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex gap-3 rounded-[1.25rem] border border-[#ead9bd] bg-white p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">1</span>
            <p className="text-sm font-bold leading-relaxed">Safari မှာ <span className="font-black text-[#a51624]">Share</span> icon ကိုနှိပ်ပါ။</p>
          </div>
          <div className="flex gap-3 rounded-[1.25rem] border border-[#ead9bd] bg-white p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">2</span>
            <p className="text-sm font-bold leading-relaxed"><span className="font-black text-[#a51624]">Add to Home Screen</span> ကိုရွေးပါ။</p>
          </div>
          <div className="flex gap-3 rounded-[1.25rem] border border-[#ead9bd] bg-white p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#be9537] text-sm font-black text-[#100708]">3</span>
            <p className="text-sm font-bold leading-relaxed"><span className="font-black text-[#a51624]">Add</span> ကိုနှိပ်တာနဲ့ App icon က Home Screen ပေါ်တက်လာပါမယ်။</p>
          </div>
        </div>

        <button onClick={onClose} className="mt-4 h-12 w-full rounded-2xl bg-[#a51624] text-sm font-black text-white shadow-[0_14px_30px_rgba(165,22,36,0.25)]">နားလည်ပါပြီ</button>
      </section>
    </div>,
    document.body,
  );
}

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [navbarTarget, setNavbarTarget] = useState<PortalTarget | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [appleMobile, setAppleMobile] = useState(false);

  useEffect(() => {
    setAppleMobile(isAppleMobile());
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

    if (appleMobile) {
      setShowIosGuide(true);
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

  return <>{navbarTarget ? createPortal(installButton, navbarTarget.node) : null}{showIosGuide && <IosInstallSheet onClose={() => setShowIosGuide(false)} />}</>;
}
