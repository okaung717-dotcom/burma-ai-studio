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
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-3 text-3xl font-black">Backup Center</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-[#d8c4a3]">Download inbox, chat, portfolio, and analytics summary as JSON.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Control code" className="mt-6 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        <button disabled={!code} onClick={() => void createBackup()} className="mt-4 w-full rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Download Backup JSON</button>
        <p className="mt-4 rounded-xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{note}</p>
      </section>
    </main>
  );
}
