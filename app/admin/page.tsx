"use client";

import { useMemo, useState } from "react";

type Lead = {
  id?: string;
  createdAt?: string;
  fullName?: string;
  email?: string;
  projectDetails?: string;
  source?: string;
};

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter((lead) => `${lead.fullName || ""} ${lead.email || ""} ${lead.projectDetails || ""}`.toLowerCase().includes(q));
  }, [leads, query]);

  async function loadInbox(nextCode = activeCode || code) {
    setLoading(true);
    setStatus("Loading inbox...");
    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nextCode }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus(data?.message || "Inbox cannot be loaded.");
        return;
      }
      const nextLeads = Array.isArray(data.leads) ? data.leads : [];
      setActiveCode(nextCode);
      setLeads(nextLeads);
      setStatus(`Loaded ${nextLeads.length} message${nextLeads.length === 1 ? "" : "s"}.`);
    } catch {
      setStatus("Inbox cannot be loaded. Check REDIS_URL, ADMIN_CONTROL, and redeploy.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Admin Control</h1>
          <p className="mt-3 text-gray-600 dark:text-[#d8c4a3]">View contact form messages, search leads, reply by email, refresh inbox, and export data.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{leads.length}</p><p className="text-sm font-bold text-gray-500">Total Messages</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{filtered.length}</p><p className="text-sm font-bold text-gray-500">Showing</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-sm font-bold text-gray-500">Status</p><p className="mt-1 text-sm">{status}</p></div>
        </section>

        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input value={code} onChange={(event) => setCode(event.target.value)} type="password" placeholder="Enter ADMIN_CONTROL code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <button disabled={loading || !code} onClick={() => void loadInbox(code)} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Load Inbox</button>
            <button disabled={loading || !activeCode} onClick={() => void loadInbox()} className="rounded-xl border border-[#be9537]/30 px-5 py-3 font-extrabold text-[#911923] disabled:opacity-50 dark:text-[#e3bc61]">Refresh</button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or message..." className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <button disabled={leads.length === 0} onClick={exportJson} className="rounded-xl bg-[#be9537] px-5 py-3 font-extrabold text-white disabled:opacity-50">Export JSON</button>
          </div>
        </section>

        <section className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#be9537]/35 bg-white p-10 text-center text-gray-500 dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">No messages loaded yet. Submit a test message from Contact page first.</div>
          ) : (
            filtered.map((lead, index) => (
              <article key={lead.id || index} className="rounded-2xl border border-[#be9537]/25 bg-white p-5 shadow dark:bg-[#1a0b0e]">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-black">{lead.fullName || "New Client"}</h2>
                    <p className="text-sm text-gray-500 dark:text-[#d8c4a3]">{formatDate(lead.createdAt)} • {lead.source || "contact-page"}</p>
                    {lead.email && <a href={`mailto:${lead.email}`} className="mt-1 inline-block font-bold text-[#911923] dark:text-[#e3bc61]">{lead.email}</a>}
                  </div>
                  {lead.email && <a href={`mailto:${lead.email}`} className="rounded-xl bg-[#911923] px-4 py-2 text-sm font-bold text-white">Reply Email</a>}
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#fff9f0] p-4 text-sm leading-relaxed dark:bg-[#100708]">{lead.projectDetails || "No project details provided."}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
