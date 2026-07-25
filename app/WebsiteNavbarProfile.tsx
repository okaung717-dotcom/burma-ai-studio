"use client";

import { useEffect, useState } from "react";
import { UserRound, X } from "lucide-react";

export default function WebsiteNavbarProfile() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const attach = () => {
      if (window.innerWidth < 1024 || document.body.classList.contains("bas-app-mode")) return;

      const link = document.querySelector<HTMLAnchorElement>(
        'body:not(.bas-app-mode) > nav a[href="/contact"].hidden.md\\:inline-flex'
      );
      if (!link || link.dataset.profileReady === "1") return;

      link.dataset.profileReady = "1";
      link.classList.add("bas-navbar-profile");
      link.setAttribute("href", "#profile");
      link.setAttribute("aria-label", "Open profile");
      link.setAttribute("title", "Profile");

      const activate = (event: Event) => {
        event.preventDefault();
        setOpen((value) => !value);
      };

      link.addEventListener("click", activate);
      return () => link.removeEventListener("click", activate);
    };

    let cleanup = attach();
    const timer = window.setInterval(() => {
      if (!cleanup) cleanup = attach();
    }, 500);

    const onResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cleanup?.();
      window.clearInterval(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close profile"
        className="fixed inset-0 z-[9997] hidden bg-black/10 backdrop-blur-[1px] lg:block"
        onClick={() => setOpen(false)}
      />
      <section className="fixed right-8 top-[7.4rem] z-[9998] hidden w-[21rem] overflow-hidden rounded-[1.8rem] border border-[#be9537]/35 bg-[#fffaf1]/95 p-4 text-[#1a0b0e] shadow-[0_24px_80px_rgba(26,11,14,0.28)] backdrop-blur-2xl dark:bg-[#1a0b0e]/95 dark:text-[#fff7eb] lg:block">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#911923] text-white shadow-lg shadow-[#911923]/20 dark:bg-[#e3bc61] dark:text-[#100708]">
              <UserRound className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-black">Burma AI Studio Profile</p>
              <p className="mt-0.5 text-xs font-bold text-[#79695d] dark:text-[#d8c4a3]">Website profile access</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ead9bd] bg-white/75 text-[#911923] dark:border-white/10 dark:bg-white/5 dark:text-[#e3bc61]" aria-label="Close profile">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 rounded-2xl border border-[#ead9bd] bg-white/65 p-4 text-sm font-semibold leading-relaxed text-[#5f4d42] dark:border-white/10 dark:bg-white/5 dark:text-[#e7d7c6]">
          Account sign-in is not enabled yet. This profile control is ready for the future customer account system without changing the current website workflow.
        </div>
      </section>
    </>
  );
}
