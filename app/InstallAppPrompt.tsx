"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsIos(ios);
    setIsStandalone(standalone);

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (isStandalone) return null;

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice.catch(() => null);
      setInstallEvent(null);
      setPanelOpen(false);
      return;
    }
    setPanelOpen(true);
  }

  return (
    <>
      <button
        onClick={install}
        className="bas-install-button fixed right-[20rem] top-[3.45rem] z-[60] hidden h-10 items-center gap-2 rounded-full border border-[#be9537]/45 bg-[#100708] px-4 text-sm font-black text-[#fff7eb] shadow-md shadow-black/10 transition hover:bg-[#911923] md:inline-flex"
        aria-label="Install Burma AI Studio app"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#be9537] text-xs font-black text-[#100708]">⌄</span>
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
              {isIos
                ? "iPhone/iPad မှာ Safari နဲ့ဖွင့်ပြီး Share button → Add to Home Screen ကိုနှိပ်ပါ။"
                : installEvent
                  ? "ဒီခလုတ်ကိုနှိပ်ပြီး Burma AI Studio ကို phone/desktop မှာ app လို install လုပ်နိုင်ပါတယ်။"
                  : "Browser menu ထဲက Add to Home Screen / Install App ကိုနှိပ်ပြီး free install လုပ်နိုင်ပါတယ်။"}
            </p>

            <div className="mt-5 grid gap-3 rounded-2xl border border-[#be9537]/20 bg-white/5 p-4 text-sm text-[#f3dfc1]">
              <p><b className="text-[#e3bc61]">Android Chrome:</b> Menu ⋮ → Add to Home screen / Install app</p>
              <p><b className="text-[#e3bc61]">iPhone Safari:</b> Share → Add to Home Screen</p>
              <p><b className="text-[#e3bc61]">Desktop:</b> Address bar install icon → Install</p>
            </div>

            <button onClick={install} className="mt-5 w-full rounded-full bg-[#be9537] px-5 py-3 text-sm font-black text-[#100708]">
              {installEvent ? "Install Now" : "Open Install Guide"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
