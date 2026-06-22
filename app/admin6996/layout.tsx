"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/admin6996/tools"],
  ["Main Control", "/admin6996"],
  ["Chat Inbox", "/admin6996/chat"],
  ["Analytics", "/admin6996/analytics"],
  ["Operations", "/admin6996/ops"],
  ["Content CMS", "/admin6996/content"],
  ["Backup", "/admin6996/backup"],
  ["Portfolio", "/admin6996/portfolio"],
];

export default function Admin6996Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isAuthPage = pathname === "/admin6996/login" || pathname === "/admin6996/logout";

  useEffect(() => {
    document.body.classList.add("bas-admin-route");
    setDarkMode(document.documentElement.classList.contains("dark"));
    return () => document.body.classList.remove("bas-admin-route");
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDarkMode(next);
  }

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

  if (isAuthPage) return <>{children}</>;

  return (
    <>
      <style>{`
        body.bas-admin-route nav:not(.bas-admin-menu),
        body:has(.bas-admin-area) nav:not(.bas-admin-menu) { display: none !important; }
        body.bas-admin-route .fixed.bottom-6.right-6,
        body:has(.bas-admin-area) .fixed.bottom-6.right-6 { display: none !important; }
      `}</style>
      <div className="bas-admin-area min-h-screen bg-[#fff9f0] text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-5">
          <aside className="bas-admin-menu rounded-[2rem] border border-[#be9537]/25 bg-[#100708] p-4 text-white shadow-2xl lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-72 lg:shrink-0">
            <a href="/admin6996/tools" className="block rounded-[1.5rem] bg-[#be9537] px-5 py-4 text-xl font-black text-[#100708] shadow-lg">Burma AI Studio</a>
            <p className="mt-3 px-2 text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Admin Control</p>
            <div className="mt-6 space-y-2">
              {links.map(([label, href]) => {
                const active = pathname === href || (href !== "/admin6996" && pathname?.startsWith(href));
                return (
                  <a key={href} href={href} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-extrabold shadow-sm transition ${active ? "border-[#be9537] bg-[#be9537] text-[#100708]" : "border-[#be9537]/25 bg-[#fff9f0] text-[#911923] hover:bg-[#f1dfbd] hover:text-[#100708]"}`}>
                    <span>{label}</span>
                    <span className="text-xs">›</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-[#be9537]/25 bg-[#1a0b0e] p-4 text-sm text-[#d8c4a3]">
              <p className="font-black text-[#e3bc61]">Production backend</p>
              <p className="mt-1 text-xs leading-relaxed text-[#d8c4a3]">Leads, chats, analytics, CMS, backups and portfolio tools.</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="/admin6996/logout" className="rounded-2xl border border-red-300/40 bg-red-50 px-3 py-3 text-center text-xs font-black text-red-700">Logout</a>
              <a href="/" className="rounded-2xl border border-[#be9537]/35 bg-[#fff9f0] px-3 py-3 text-center text-xs font-black text-[#911923]">View Site</a>
            </div>
          </aside>
          <section className="min-w-0 flex-1 rounded-[2rem] border border-[#be9537]/20 bg-white/70 shadow-2xl shadow-[#100708]/5 backdrop-blur dark:bg-[#1a0b0e]/70 dark:shadow-black/20">
            <header className="border-b border-[#be9537]/20 px-5 py-5 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Dashboard Workspace</p>
                  <h1 className="mt-1 text-2xl font-black md:text-3xl">Burma AI Studio Control</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={toggleTheme} className="rounded-full border border-[#be9537]/30 bg-white px-4 py-2 text-xs font-black text-[#911923] shadow-sm dark:bg-[#100708] dark:text-[#e3bc61]">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <a href="/admin6996/tools" className="rounded-full bg-[#be9537] px-4 py-2 text-xs font-black text-[#100708]">Tools</a>
                  <a href="/admin6996/portfolio" className="rounded-full border border-[#be9537]/30 bg-white px-4 py-2 text-xs font-black text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">Portfolio</a>
                </div>
              </div>
            </header>
            <div className="p-4 md:p-6">{children}</div>
          </section>
        </div>
      </div>
    </>
  );
}
