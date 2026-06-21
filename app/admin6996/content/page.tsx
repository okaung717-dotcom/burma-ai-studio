"use client";

import { useEffect, useState } from "react";

export default function ContentControlPage() {
  const [code, setCode] = useState("");
  const [form, setForm] = useState({ homeTitle: "", homeSubtitle: "", servicesTitle: "", contactEmail: "", contactPhone: "" });
  const [note, setNote] = useState("Loading content...");

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) setForm(data.content);
        setNote("Content loaded.");
      })
      .catch(() => setNote("Content cannot be loaded."));
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setNote("Saving content...");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, ...form }),
    });
    const data = await res.json().catch(() => null);
    setNote(data?.ok ? "Content saved." : data?.message || "Content save failed.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-3 text-3xl font-black">Website Content Control</h1>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Control code" className="mt-6 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        <div className="mt-5 space-y-3">
          <input value={form.homeTitle} onChange={(e) => update("homeTitle", e.target.value)} placeholder="Home title" className="w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <textarea value={form.homeSubtitle} onChange={(e) => update("homeSubtitle", e.target.value)} placeholder="Home subtitle" className="h-24 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={form.servicesTitle} onChange={(e) => update("servicesTitle", e.target.value)} placeholder="Services title" className="w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} placeholder="Contact email" className="w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} placeholder="Contact phone" className="w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        </div>
        <button disabled={!code} onClick={() => void save()} className="mt-5 w-full rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save Content</button>
        <p className="mt-4 rounded-xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{note}</p>
      </section>
    </main>
  );
}
