"use client";

import { useState } from "react";

export default function BackupPage() {
  const [code, setCode] = useState("");
  const [note, setNote] = useState("Ready to create backup.");

  async function createBackup() {
    setNote("Collecting data...");
    const [inbox, chat, portfolio, analytics] = await Promise.all([
      fetch("/api/inbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }).then((r) => r.json()).catch(() => null),
      fetch("/api/admin/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, action: "list" }) }).then((r) => r.json()).catch(() => null),
      fetch("/api/portfolio", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch("/api/analytics/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: code }) }).then((r) => r.json()).catch(() => null),
    ]);

    const payload = { createdAt: new Date().toISOString(), inbox, chat, portfolio, analytics };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `burma-ai-studio-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNote("Backup downloaded.");
  }

  return (
    <main className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Backup Center</p>
          <h2 className="mt-3 text-4xl font-black">Data Snapshot</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">Download a protected JSON backup of inbox messages, chat logs, portfolio records and analytics summary. Useful before major content edits.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[["Inbox", "Leads"], ["Chat", "Logs"], ["Portfolio", "Videos"], ["Analytics", "Summary"]].map(([a, b]) => <div key={a} className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">{a}</p><p className="text-xs font-bold text-white/55">{b}</p></div>)}
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">Secure Download</p>
          <h3 className="mt-3 text-2xl font-black">Create backup file</h3>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ADMIN_CONTROL code" className="mt-6 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <button disabled={!code} onClick={() => void createBackup()} className="mt-4 w-full rounded-2xl bg-[#911923] px-5 py-4 font-extrabold text-white disabled:opacity-50">Download Backup JSON</button>
          <p className="mt-4 rounded-2xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{note}</p>
        </div>
      </section>
    </main>
  );
}
