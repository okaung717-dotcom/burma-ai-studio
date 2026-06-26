"use client";

import { useEffect, useRef, useState } from "react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string; platform: string }>;
};

type ButtonPosition = {
  top: number;
  left: number;
};

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    function handleInstall(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    }

    function alignWithNavbar() {
      if (window.innerWidth < 768) {
        setButtonPosition(null);
        return;
      }

      const nav = document.querySelector("nav");
      if (!nav) {
        setButtonPosition(null);
        return;
      }

      const contactLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href="/contact"]'));
      const contactNavLink = contactLinks[0];
      const languageButton = Array.from(nav.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
        const label = button.textContent?.trim();
        return label === "EN" || label === "MM";
      });

      if (!contactNavLink || !languageButton) {
        setButtonPosition(null);
        return;
      }

      const contactRect = contactNavLink.getBoundingClientRect();
      const langRect = languageButton.getBoundingClientRect();
      const buttonWidth = buttonRef.current?.getBoundingClientRect().width ?? 156;
      const leftNearLanguage = langRect.left - buttonWidth - 14;
      const minLeftAfterContact = contactRect.right + 16;
      const left = Math.max(minLeftAfterContact, leftNearLanguage);

      setButtonPosition({
        top: langRect.top + langRect.height / 2,
        left,
      });
    }

    window.addEventListener("beforeinstallprompt", handleInstall);
    window.addEventListener("resize", alignWithNavbar);
    window.addEventListener("scroll", alignWithNavbar, { passive: true });
    const timer = window.setInterval(alignWithNavbar, 750);
    requestAnimationFrame(alignWithNavbar);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstall);
      window.removeEventListener("resize", alignWithNavbar);
      window.removeEventListener("scroll", alignWithNavbar);
      window.clearInterval(timer);
    };
  }, []);

  if (isStandalone) return null;

  async function install() {
    if (!installEvent) {
      setPanelOpen(true);
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    setPanelOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={install}
        className="fixed z-[60] hidden h-12 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-5 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"
        style={buttonPosition ? { top: buttonPosition.top, left: buttonPosition.left, transform: "translateY(-50%)" } : { top: -9999, left: -9999 }}
        aria-label="Install Burma AI Studio app"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#be9537] text-xs font-black text-[#100708]">⌄</span>
        Install App
      </button>

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

            <p className="mt-4 text-sm leading-relaxed text-[#f3dfc1]">
              Open your browser menu and choose Add to Home Screen or Install App.
            </p>

            <button onClick={() => setPanelOpen(false)} className="mt-5 w-full rounded-full bg-[#be9537] px-5 py-3 text-sm font-black text-[#100708]">
              Got it
            </button>
          </section>
        </div>
      )}
    </>
  );
}
