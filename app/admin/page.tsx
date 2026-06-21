"use client";

import { useMemo, useState } from "react";

type Lead = { id?: string; createdAt?: string; fullName?: string; email?: string; projectDetails?: string; source?: string };
type PortfolioItem = { id: string; src: string; titleEN: string; descEN: string; titleMM: string; descMM: string; featured?: boolean };

const emptyItem = (): PortfolioItem => ({ id: `${Date.now()}`, src: "", titleEN: "", descEN: "", titleMM: "", descMM: "", featured: true });
const modules = [
  { title: "AI Chat Inbox", desc: "Visitor chatbot messages and manual replies", href: "/admin/chat" },
  { title: "Website Analytics", desc: "Countries, pages, sources, devices, video views", href: "/admin/analytics" },
  { title: "Project Messages", desc: "Contact form leads and client inquiries", href: "#messages" },
  { title: "Portfolio Manager", desc: "Add or edit YouTube portfolio videos", href: "#portfolio" },
];

function formatDate(value?: string) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Enter ADMIN_CONTROL code and load inbox.");
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioStatus, setPortfolioStatus] = useState("Load portfolio before editing videos.");
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter((lead) => `${lead.fullName || ""} ${lead.email || ""} ${lead.projectDetails || ""}`.toLowerCase().includes(q));
  }, [leads, query]);

  async function loadInbox(nextCode = activeCode || code) {
    setLoading(true);
    setStatus("Loading inbox...");
    try {
      const res = await fetch("/api/inbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: nextCode }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setStatus(data?.message || "Inbox cannot be loaded."); return; }
      const nextLeads = Array.isArray(data.leads) ? data.leads : [];
      setActiveCode(nextCode);
      setLeads(nextLeads);
      setStatus(`Loaded ${nextLeads.length} message${nextLeads.length === 1 ? "" : "s"}.`);
    } catch { setStatus("Inbox cannot be loaded. Check REDIS_URL, ADMIN_CONTROL, and redeploy."); }
    finally { setLoading(false); }
  }

  async function loadPortfolio() {
    setPortfolioStatus("Loading portfolio videos...");
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const items = Array.isArray(data?.items) ? data.items : [];
      setPortfolio(items);
      setPortfolioStatus(`Loaded ${items.length} portfolio video${items.length === 1 ? "" : "s"}.`);
    } catch { setPortfolioStatus("Portfolio cannot be loaded yet."); }
  }

  async function savePortfolio() {
    const adminCode = activeCode || code;
    if (!adminCode) { setPortfolioStatus("Enter ADMIN_CONTROL code first."); return; }
    setSavingPortfolio(true);
    setPortfolioStatus("Saving portfolio...");
    try {
      const res = await fetch("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: adminCode, items: portfolio }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setPortfolioStatus(data?.message || "Portfolio cannot be saved."); return; }
      setPortfolio(Array.isArray(data.items) ? data.items : portfolio);
      setPortfolioStatus("Portfolio saved. Open Portfolio page and refresh to see changes.");
    } catch { setPortfolioStatus("Portfolio cannot be saved. Check Redis and ADMIN_CONTROL."); }
    finally { setSavingPortfolio(false); }
  }

  function updatePortfolio(index: number, field: keyof PortfolioItem, value: string | boolean) {
    setPortfolio((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `burma-ai-studio-messages-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Main Admin Control Center</h1>
          <p className="mt-3 text-gray-600 dark:text-[#d8c4a3]">Manage messages, AI chatbot inbox, analytics, portfolio videos, replies, and business operations from one control center.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {modules.map((item) => <a key={item.title} href={item.href} className="rounded-2xl border border-[#be9537]/25 bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a0b0e]"><p className="text-lg font-black text-[#911923] dark:text-[#e3bc61]">{item.title}</p><p className="mt-2 text-sm text-gray-500 dark:text-[#d8c4a3]">{item.desc}</p></a>)}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{leads.length}</p><p className="text-sm font-bold text-gray-500">Total Messages</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{portfolio.length}</p><p className="text-sm font-bold text-gray-500">Portfolio Videos</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-sm font-bold text-gray-500">Status</p><p className="mt-1 text-sm">{status}</p></div>
        </section>

        <section id="messages" className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <h2 className="mb-4 text-2xl font-black">Project Message Inbox</h2>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]"><input value={code} onChange={(event) => setCode(event.target.value)} type="password" placeholder="Enter ADMIN_CONTROL code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" /><button disabled={loading || !code} onClick={() => void loadInbox(code)} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Load Inbox</button><button disabled={loading || !activeCode} onClick={() => void loadInbox()} className="rounded-xl border border-[#be9537]/30 px-5 py-3 font-extrabold text-[#911923] disabled:opacity-50 dark:text-[#e3bc61]">Refresh</button></div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or message..." className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" /><button disabled={leads.length === 0} onClick={exportJson} className="rounded-xl bg-[#be9537] px-5 py-3 font-extrabold text-white disabled:opacity-50">Export JSON</button></div>
        </section>

        <section id="portfolio" className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black">Portfolio Video Manager</h2><p className="mt-1 text-sm text-gray-500 dark:text-[#d8c4a3]">Paste YouTube video ID or URL, edit titles, then save.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => void loadPortfolio()} className="rounded-xl border border-[#be9537]/30 px-4 py-2 font-bold text-[#911923] dark:text-[#e3bc61]">Load Portfolio</button><button onClick={() => setPortfolio((current) => [...current, emptyItem()])} className="rounded-xl border border-[#be9537]/30 px-4 py-2 font-bold text-[#911923] dark:text-[#e3bc61]">Add Video</button><button disabled={savingPortfolio || portfolio.length === 0} onClick={() => void savePortfolio()} className="rounded-xl bg-[#911923] px-4 py-2 font-bold text-white disabled:opacity-50">Save Portfolio</button></div></div>
          <p className="mt-3 rounded-xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{portfolioStatus}</p>
          <div className="mt-5 space-y-4">{portfolio.map((item, index) => <div key={item.id || index} className="rounded-2xl border border-[#be9537]/20 bg-[#fffdf8] p-4 dark:bg-[#100708]"><div className="grid gap-3 md:grid-cols-2"><input value={item.src} onChange={(event) => updatePortfolio(index, "src", event.target.value)} placeholder="YouTube ID or URL" className="rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e]" /><input value={item.titleEN} onChange={(event) => updatePortfolio(index, "titleEN", event.target.value)} placeholder="English title" className="rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e]" /><input value={item.descEN} onChange={(event) => updatePortfolio(index, "descEN", event.target.value)} placeholder="English description" className="rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e]" /><input value={item.titleMM} onChange={(event) => updatePortfolio(index, "titleMM", event.target.value)} placeholder="Myanmar title" className="rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e]" /><input value={item.descMM} onChange={(event) => updatePortfolio(index, "descMM", event.target.value)} placeholder="Myanmar description" className="rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e] md:col-span-2" /></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => updatePortfolio(index, "featured", event.target.checked)} /> Featured</label><button onClick={() => setPortfolio((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Remove</button></div></div>)}</div>
        </section>

        <section className="space-y-4">{filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#be9537]/35 bg-white p-10 text-center text-gray-500 dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">No messages loaded yet. Submit a test message from Contact page first.</div> : filtered.map((lead, index) => <article key={lead.id || index} className="rounded-2xl border border-[#be9537]/25 bg-white p-5 shadow dark:bg-[#1a0b0e]"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><h2 className="text-xl font-black">{lead.fullName || "New Client"}</h2><p className="text-sm text-gray-500 dark:text-[#d8c4a3]">{formatDate(lead.createdAt)} • {lead.source || "contact-page"}</p>{lead.email && <a href={`mailto:${lead.email}`} className="mt-1 inline-block font-bold text-[#911923] dark:text-[#e3bc61]">{lead.email}</a>}</div>{lead.email && <a href={`mailto:${lead.email}`} className="rounded-xl bg-[#911923] px-4 py-2 text-sm font-bold text-white">Reply Email</a>}</div><p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#fff9f0] p-4 text-sm leading-relaxed dark:bg-[#100708]">{lead.projectDetails || "No project details provided."}</p></article>)}</section>
      </div>
    </main>
  );
}
