"use client";

import { useEffect, useMemo, useState } from "react";

type PortfolioItem = {
  id: string;
  src: string;
  titleEN: string;
  descEN: string;
  titleMM: string;
  descMM: string;
  featured?: boolean;
};

const emptyItem = (): PortfolioItem => ({
  id: `${Date.now()}`,
  src: "",
  titleEN: "",
  descEN: "",
  titleMM: "",
  descMM: "",
  featured: true,
});

function cleanYoutube(value: string) {
  return value
    .trim()
    .replace("https://youtu.be/", "")
    .replace("https://www.youtube.com/watch?v=", "")
    .replace("https://youtube.com/watch?v=", "")
    .split("&")[0]
    .split("?")[0]
    .trim();
}

export default function PortfolioManagerPage() {
  const [code, setCode] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [status, setStatus] = useState("Load portfolio videos before editing.");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalFeatured = useMemo(() => items.filter((item) => item.featured).length, [items]);

  async function loadPortfolio() {
    setLoading(true);
    setStatus("Loading portfolio videos...");
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const nextItems = Array.isArray(data?.items) ? data.items : [];
      setItems(nextItems);
      setStatus(`Loaded ${nextItems.length} video${nextItems.length === 1 ? "" : "s"}.`);
    } catch {
      setStatus("Portfolio cannot be loaded yet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPortfolio();
  }, []);

  function updateItem(index: number, field: keyof PortfolioItem, value: string | boolean) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  async function savePortfolio() {
    if (!code) {
      setStatus("Enter ADMIN_CONTROL code first.");
      return;
    }

    const prepared = items
      .map((item, index) => ({
        ...item,
        id: item.id || `${Date.now()}-${index}`,
        src: cleanYoutube(item.src),
        titleEN: item.titleEN.trim() || "AI Video Project",
        descEN: item.descEN.trim() || "Burma AI Studio portfolio video",
        titleMM: item.titleMM.trim() || item.titleEN.trim() || "AI Video Project",
        descMM: item.descMM.trim() || item.descEN.trim() || "Burma AI Studio portfolio video",
      }))
      .filter((item) => item.src);

    if (!prepared.length) {
      setStatus("Add at least one valid YouTube video ID or URL.");
      return;
    }

    setSaving(true);
    setStatus("Saving portfolio videos...");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code, items: prepared }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus(data?.message || "Portfolio cannot be saved.");
        return;
      }
      setItems(Array.isArray(data.items) ? data.items : prepared);
      setStatus("Portfolio saved. Public portfolio page will load these videos automatically.");
    } catch {
      setStatus("Portfolio cannot be saved. Check Redis and admin code.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">Portfolio Video Manager</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-500 dark:text-[#d8c4a3]">Add, edit, reorder, preview, and publish YouTube portfolio videos. Public portfolio page reads these saved videos from the backend.</p>
          </div>
          <a href="/portfolio?adminPreview=1" className="rounded-xl border border-[#be9537]/35 px-4 py-3 text-sm font-black text-[#911923] transition hover:bg-[#fff3e3] dark:text-[#e3bc61]">Preview Public Portfolio</a>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <input value={code} onChange={(event) => setCode(event.target.value)} type="password" placeholder="ADMIN_CONTROL code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <button disabled={loading} onClick={() => void loadPortfolio()} className="rounded-xl border border-[#be9537]/35 px-5 py-3 font-extrabold text-[#911923] disabled:opacity-50 dark:text-[#e3bc61]">Load</button>
          <button onClick={() => setItems((current) => [...current, emptyItem()])} className="rounded-xl border border-[#be9537]/35 px-5 py-3 font-extrabold text-[#911923] dark:text-[#e3bc61]">Add Video</button>
          <button disabled={saving || !items.length} onClick={() => void savePortfolio()} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save</button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-[#fff9f0] p-4 dark:bg-[#100708]"><p className="text-2xl font-black">{items.length}</p><p className="text-xs font-bold text-gray-500">Total Videos</p></div>
          <div className="rounded-2xl bg-[#fff9f0] p-4 dark:bg-[#100708]"><p className="text-2xl font-black">{totalFeatured}</p><p className="text-xs font-bold text-gray-500">Featured</p></div>
          <div className="rounded-2xl bg-[#fff9f0] p-4 dark:bg-[#100708]"><p className="text-xs font-bold text-gray-500">Status</p><p className="mt-1 text-sm font-bold text-[#911923] dark:text-[#e3bc61]">{status}</p></div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-6xl space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#be9537]/35 bg-white p-10 text-center text-gray-500 dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">No portfolio videos loaded yet. Click Load or Add Video.</div>
        ) : items.map((item, index) => {
          const videoId = cleanYoutube(item.src);
          return (
            <article key={item.id || index} className="rounded-[1.5rem] border border-[#be9537]/25 bg-white p-5 shadow dark:bg-[#1a0b0e]">
              <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
                <div>
                  <div className="aspect-video overflow-hidden rounded-2xl bg-[#100708]">
                    {videoId ? <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen title={item.titleEN || "Portfolio video"} /> : <div className="flex h-full items-center justify-center text-sm font-bold text-white/60">Preview</div>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => moveItem(index, -1)} className="rounded-xl border border-[#be9537]/35 px-3 py-2 text-xs font-bold text-[#911923] dark:text-[#e3bc61]">Move Up</button>
                    <button onClick={() => moveItem(index, 1)} className="rounded-xl border border-[#be9537]/35 px-3 py-2 text-xs font-bold text-[#911923] dark:text-[#e3bc61]">Move Down</button>
                    <button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Remove</button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.src} onChange={(event) => updateItem(index, "src", event.target.value)} placeholder="YouTube ID or URL" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708] md:col-span-2" />
                  <input value={item.titleEN} onChange={(event) => updateItem(index, "titleEN", event.target.value)} placeholder="English title" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
                  <input value={item.titleMM} onChange={(event) => updateItem(index, "titleMM", event.target.value)} placeholder="Myanmar title" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
                  <textarea value={item.descEN} onChange={(event) => updateItem(index, "descEN", event.target.value)} placeholder="English description" rows={3} className="resize-none rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
                  <textarea value={item.descMM} onChange={(event) => updateItem(index, "descMM", event.target.value)} placeholder="Myanmar description" rows={3} className="resize-none rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
                  <label className="flex items-center gap-2 text-sm font-bold md:col-span-2"><input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => updateItem(index, "featured", event.target.checked)} /> Featured on portfolio</label>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
