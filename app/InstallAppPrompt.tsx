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
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-[0.72rem] bg-white ring-1 ring-[#be9537]/70 ${small ? "h-7 w-7" : "h-8 w-8"}`}>
      <svg viewBox="0 0 128 128" aria-hidden="true" className={small ? "h-7 w-7" : "h-8 w-8"}>
        <rect width="128" height="128" rx="30" fill="#fffdf8" />
        <path fill="#911923" d="M34.8 32.6c6.6 0 13.1-.2 19.7.1 8.5.4 14.5 5 16.1 12.4 1.3 6.4-1.2 11.5-6.8 15.1 8.1 3.2 12.6 9.1 12 18.2-.8 11.7-9.7 18.5-23.8 18.6H34.8V32.6Zm15.8 26.2c6.2 0 9.7-2.6 9.7-7.4s-3.4-7.3-9.8-7.3h-3.6v14.7h3.7Zm1.7 26.5c7.5 0 11.5-2.8 11.5-8.2 0-5.3-3.9-8.1-11.7-8.1h-5.2v16.3h5.4Z" />
        <path fill="#911923" d="M82.8 32.2h15.1l24.1 64.8h-17.2l-4.1-12.4H80.4L76.2 97H59.7l23.1-64.8Zm13.6 39.6-5.5-17.1-5.9 17.1h11.4Z" />
        <path fill="#be9537" d="M50.8 94.7c18.9-18.8 42.4-28.9 72.5-30.4-17.9 7.5-33.6 17.8-46.9 30.9-8.6 8.4-18.3 12.1-29.9 11.3-7.2-.5-14.2-2-20.9-4.4 8.9-1.1 17.3-3.6 25.2-7.4Z" />
        <path fill="#f2d17a" d="M73.3 96.1c10.6-10.5 25-18.3 43.4-23.5-10.8 7-20.9 15.5-30.2 25.5-4.6 5-10.6 7.7-18 8.3l-10.6.8c5.6-2.7 10.7-6.4 15.4-11.1Z" />
      </svg>
    </span>
  );
}

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [guide, setGuide] = useState<"android" | "ios" | null>(null);
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

  function openChooser() {
    setGuide(null);
    setPanelOpen(true);
  }

  async function installAndroid() {
    if (!installEvent) {
      setGuide("android");
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    setPanelOpen(false);
  }

  const targetIsMobile = navbarTarget?.mobile ?? false;
  const installButton = (
    <button
      onClick={openChooser}
      className={targetIsMobile
        ? "bas-install-button order-[-1] inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-2.5 pr-3 text-[11px] font-black text-[#fff7eb] shadow-md shadow-black/10 transition active:scale-95 md:hidden"
        : "bas-install-button order-[-1] hidden h-12 shrink-0 items-center gap-2.5 rounded-full border border-[#be9537]/45 bg-[#100708] px-4 pr-5 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"}
      aria-label="Install Burma AI Studio app"
    >
      <AppIconMark small={targetIsMobile} />
      <span>{targetIsMobile ? "App" : "Install App"}</span>
    </button>
  );

  return (
    <>
      {navbarTarget ? createPortal(installButton, navbarTarget.node) : null}

      {panelOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center">
          <section className="w-full max-w-md rounded-[1.75rem] border border-[#be9537]/35 bg-[#100708] p-5 text-[#fff7eb] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e3bc61]">Free App Install</p>
                <h3 className="mt-1 text-xl font-black">Burma AI Studio</h3>
              </div>
              <button onClick={() => setPanelOpen(false)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-[#e3bc61]">×</button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={installAndroid} className="rounded-2xl bg-[#be9537] px-4 py-4 text-sm font-black text-[#100708]">Android</button>
              <button onClick={() => setGuide("ios")} className="rounded-2xl border border-[#be9537]/35 bg-white/10 px-4 py-4 text-sm font-black text-[#fff7eb]">iOS</button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#f3dfc1]">
              {guide === "ios"
                ? "iPhone/iPad: Safari ထဲမှာ Share ကိုနှိပ်ပြီး Add to Home Screen ကိုရွေးပါ။"
                : guide === "android"
                  ? "Android: Browser menu ထဲက Install App / Add to Home Screen ကိုရွေးပါ။"
                  : "Android သို့ iOS ကိုရွေးပါ။ Device အလိုက် install လုပ်နည်းကိုပြပေးမယ်။"}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
