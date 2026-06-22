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
    <main className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">CMS Control</p>
          <h2 className="mt-3 text-4xl font-black">Website Content</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">Edit the main text for Home, Services and Contact. Save once and your public pages can read from the backend content store.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">5</p><p className="text-xs font-bold text-white/55">Editable Fields</p></div>
            <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-black">CMS</p><p className="text-xs font-bold text-white/55">Backend Source</p></div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">Control Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ADMIN_CONTROL" className="mt-2 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input value={form.homeTitle} onChange={(e) => update("homeTitle", e.target.value)} placeholder="Home title" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <input value={form.servicesTitle} onChange={(e) => update("servicesTitle", e.target.value)} placeholder="Services title" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <input value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} placeholder="Contact email" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} placeholder="Contact phone" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <textarea value={form.homeSubtitle} onChange={(e) => update("homeSubtitle", e.target.value)} placeholder="Home subtitle" className="h-32 resize-none rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708] md:col-span-2" />
          </div>
          <button disabled={!code} onClick={() => void save()} className="mt-5 w-full rounded-2xl bg-[#911923] px-5 py-4 font-extrabold text-white disabled:opacity-50">Save Content</button>
          <p className="mt-4 rounded-2xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{note}</p>
        </div>
      </section>
    </main>
  );
}
