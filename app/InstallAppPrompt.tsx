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

function isIosDevice() {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const iPadOS = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/.test(userAgent) || iPadOS;
}

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideMode, setGuideMode] = useState<"ios" | "android" | "browser">("browser");
  const [isStandalone, setIsStandalone] = useState(false);
  const [navbarTarget, setNavbarTarget] = useState<PortalTarget | null>(null);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

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
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice.catch(() => null);
      setInstallEvent(null);
      setGuideOpen(false);
      return;
    }

    setGuideMode(isIosDevice() ? "ios" : window.innerWidth < 768 ? "android" : "browser");
    setGuideOpen(true);
  }

  const targetIsMobile = navbarTarget?.mobile ?? false;
  const installButton = (
    <button
      onClick={handleInstallClick}
      className={targetIsMobile
        ? "bas-install-button order-[-1] inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-2.5 pr-3 text-[11px] font-black text-[#fff7eb] shadow-md shadow-black/10 transition active:scale-95 md:hidden"
        : "bas-install-button order-[-1] hidden h-12 shrink-0 items-center gap-2.5 rounded-full border border-[#be9537]/45 bg-[#100708] px-4 pr-5 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"}
      aria-label="Install Burma AI Studio app"
    >
      <AppIconMark small={targetIsMobile} />
      <span>{targetIsMobile ? "App" : "Install App"}</span>
    </button>
  );

  const guideText = guideMode === "ios"
    ? "iOS: Safari ထဲမှာ Share ကိုနှိပ်ပြီး Add to Home Screen ကိုရွေးပါ။ iOS က website ကို auto install ခွင့်မပေးလို့ user confirm လိုပါတယ်။"
    : guideMode === "android"
      ? "Android: Browser menu ထဲက Install App / Add to Home Screen ကိုရွေးပါ။ Install prompt ရနိုင်တဲ့အချိန်မှာ button နှိပ်တာနဲ့ native prompt တန်းပေါ်ပါမယ်။"
      : "Browser install prompt ရနိုင်တဲ့အချိန်မှာ button နှိပ်တာနဲ့ native install prompt တန်းပေါ်ပါမယ်။";

  return (
    <>
      {navbarTarget ? createPortal(installButton, navbarTarget.node) : null}

      {guideOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center">
          <section className="w-full max-w-md rounded-[1.75rem] border border-[#be9537]/35 bg-[#100708] p-5 text-[#fff7eb] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <AppIconMark />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e3bc61]">Install App</p>
                  <h3 className="mt-1 text-xl font-black">Burma AI Studio</h3>
                </div>
              </div>
              <button onClick={() => setGuideOpen(false)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-[#e3bc61]">×</button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#f3dfc1]">{guideText}</p>
            <button onClick={() => setGuideOpen(false)} className="mt-5 w-full rounded-full bg-[#be9537] px-5 py-3 text-sm font-black text-[#100708]">OK</button>
          </section>
        </div>
      )}
    </>
  );
}
