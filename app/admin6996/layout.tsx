"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["Tools", "/admin6996/tools"],
  ["Main", "/admin6996"],
  ["Inbox", "/admin6996#messages"],
  ["Chat", "/admin6996/chat"],
  ["Analytics", "/admin6996/analytics"],
  ["Ops", "/admin6996/ops"],
  ["Content", "/admin6996/content"],
  ["Backup", "/admin6996/backup"],
  ["Portfolio", "/admin6996/portfolio"],
];

export default function Admin6996Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const isAuthPage = pathname === "/admin6996/login" || pathname === "/admin6996/logout";

  useEffect(() => {
    document.body.classList.add("bas-admin-route");
    return () => document.body.classList.remove("bas-admin-route");
  }, []);

  useEffect(() => {
    if (isAuthPage) {
      setAllowed(true);
      return;
    }

    fetch("/api/admin/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) setAllowed(true);
        else window.location.href = "/admin6996/login";
      })
      .catch(() => {
        window.location.href = "/admin6996/login";
      });
  }, [isAuthPage]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#100708] px-5 text-[#fff7eb]">
        <section className="rounded-[2rem] border border-[#be9537]/25 bg-[#1a0b0e] p-7 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#e3bc61]">Burma AI Studio</p>
          <h1 className="mt-3 text-2xl font-black">Checking admin access...</h1>
        </section>
      </main>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <style>{`
        body.bas-admin-route nav:not(.bas-admin-menu),
        body:has(.bas-admin-area) nav:not(.bas-admin-menu) {
          display: none !important;
        }
        body.bas-admin-route .fixed.bottom-6.right-6,
        body:has(.bas-admin-area) .fixed.bottom-6.right-6 {
          display: none !important;
        }
      `}</style>
      <div className="bas-admin-area">
        <nav className="bas-admin-menu relative z-10 border-b border-[#be9537]/25 bg-[#fff9f0] px-4 py-3 shadow-sm dark:bg-[#100708]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <a href="/admin6996/tools" className="mr-2 rounded-full bg-[#be9537] px-4 py-2 text-sm font-black text-[#100708]">Admin Tools</a>
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] hover:bg-[#fff3e3] dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10">{label}</a>
            ))}
            <a href="/admin6996/logout" className="ml-auto rounded-full border border-red-300/40 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-200">Logout</a>
            <a href="/" className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] hover:bg-[#fff3e3] dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">View Site</a>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
}
