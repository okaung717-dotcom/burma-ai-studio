"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsIos(ios);
    setIsStandalone(standalone);

    if (!standalone) {
      const dismissedAt = Number(localStorage.getItem("bas_install_dismissed_at") || "0");
      const oneDay = 24 * 60 * 60 * 1000;
      if (!dismissedAt || Date.now() - dismissedAt > oneDay) setVisible(true);
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (!visible || isStandalone) return null;

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice.catch(() => null);
      setInstallEvent(null);
      setVisible(false);
      return;
    }
    window.location.href = "/install";
  }

  function dismiss() {
    localStorage.setItem("bas_install_dismissed_at", String(Date.now()));
    setVisible(false);
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-[330px] rounded-[1.5rem] border border-[#be9537]/35 bg-[#100708] p-4 text-[#fff7eb] shadow-2xl shadow-black/30 md:left-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e3bc61]">Install App</p>
          <h3 className="mt-1 text-base font-black">Burma AI Studio</h3>
        </div>
        <button onClick={dismiss} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[#e3bc61]">×</button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#f3dfc1]">
        {isIos ? "iPhone မှာ Share → Add to Home Screen နဲ့ free install လုပ်နိုင်ပါတယ်။" : "Website ကို app လို free install လုပ်နိုင်ပါတယ်။"}
      </p>
      <button onClick={install} className="mt-4 w-full rounded-full bg-[#be9537] px-4 py-3 text-sm font-black text-[#100708]">
        {installEvent ? "Install Now" : "How to Install"}
      </button>
    </div>
  );
}
