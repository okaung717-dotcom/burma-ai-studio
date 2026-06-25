"use client";

import { useEffect, useMemo, useState } from "react";

type CountItem = { name: string; count: number };
type Lead = {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  projectDetails?: string;
  source?: string;
  userAgent?: string;
  status?: string;
  createdAt?: string;
};
type ChatThread = { visitorId: string; latestAt: string; latestMessage: string; latestRole: string; unread: number; state: string; messageCount: number };
type PortfolioItem = { id?: string; src?: string; titleEN?: string; titleMM?: string; featured?: boolean };
type Overview = {
  ok: boolean;
  message?: string;
  generatedAt?: string;
  stats?: {
    leads: number;
    newLeads: number;
    hotLeads: number;
    chatThreads: number;
    unreadThreads: number;
    totalViews: number;
    uniqueVisitors: number;
    portfolioItems: number;
    contentConfigured: boolean;
  };
  leads?: Lead[];
  leadStatusCounts?: Record<string, number>;
  chatThreads?: ChatThread[];
  chatStateCounts?: Record<string, number>;
  analytics?: { topPages?: CountItem[]; topSources?: CountItem[]; topDevices?: CountItem[]; recentEvents?: unknown[] };
  portfolioItems?: PortfolioItem[];
  recommendations?: string[];
};

const quickActions = [
  ["Reply Chat", "/admin6996/chat", "Visitor conversation"],
  ["Lead Ops", "/admin6996/ops", "Lead and chat status"],
  ["Portfolio", "/admin6996/portfolio", "Video proof"],
  ["Content CMS", "/admin6996/content", "Website copy"],
  ["Analytics", "/admin6996/analytics", "Traffic data"],
  ["Backup", "/admin6996/backup", "Export data"],
];

function dateShort(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function text(value?: string, fallback = "—", limit = 90) {
  const clean = typeof value === "string" ? value.trim() : "";
  if (!clean) return fallback;
  return clean.length > limit ? `${clean.slice(0, limit)}...` : clean;
}

function leadName(lead?: Lead) {
  if (!lead) return "Unknown lead";
  const combined = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();
  return text(lead.fullName || lead.name || combined || lead.email, "Unknown lead", 80);
}

function leadMessage(lead?: Lead, limit = 120) {
  if (!lead) return "No message";
  return text(lead.message || lead.projectDetails || lead.service, "No message", limit);
}

function leadSource(lead?: Lead) {
  return text(lead?.source || lead?.service, "contact-page", 60);
}

function StatCard({ label, value, note }: { label: string; value: number | string; note: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#be9537]/20 bg-white p-5 shadow-sm dark:bg-[#1a0b0e]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-[#d8c4a3]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[#911923] dark:text-[#e3bc61]">{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-500 dark:text-[#d8c4a3]">{note}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-[#be9537]/35 p-5 text-sm font-bold text-gray-500 dark:text-[#d8c4a3]">{text}</div>;
}

export default function AdminControlOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [copyNote, setCopyNote] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/overview", { cache: "no-store" }).catch(() => null);
    const body = (await response?.json().catch(() => null)) as Overview | null;
    if (!response?.ok || !body?.ok) {
      setError(body?.message || "Real admin data cannot be loaded.");
      setData(null);
    } else {
      setData(body);
    }
    setLoading(false);
  }

  async function copyLead(lead?: Lead) {
    if (!lead) return;
    const value = [
      `Name: ${leadName(lead)}`,
      `Email: ${lead.email || "—"}`,
      `Phone: ${lead.phone || "—"}`,
      `Status: ${lead.status || "New"}`,
      `Source: ${leadSource(lead)}`,
      `Time: ${dateShort(lead.createdAt)}`,
      "",
      leadMessage(lead, 3000),
    ].join("\n");
    await navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopyNote("Lead copied.");
    window.setTimeout(() => setCopyNote(""), 1800);
  }

  useEffect(() => {
    void load();
  }, []);

  const maxPageCount = useMemo(() => Math.max(1, ...(data?.analytics?.topPages || []).map((item) => item.count)), [data]);

  if (loading) {
    return <main className="rounded-[2rem] border border-[#be9537]/20 bg-white p-8 dark:bg-[#1a0b0e]"><p className="font-black text-[#911923] dark:text-[#e3bc61]">Loading real admin data...</p></main>;
  }

  if (error) {
    return (
      <main className="space-y-5">
        <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="text-xs font-black uppercase tracking-[0.22em]">Admin data issue</p>
          <h2 className="mt-2 text-2xl font-black">{error}</h2>
          <button onClick={() => void load()} className="mt-4 rounded-full bg-[#911923] px-5 py-3 text-sm font-black text-white">Retry</button>
        </section>
      </main>
    );
  }

  const stats = data?.stats || { leads: 0, newLeads: 0, hotLeads: 0, chatThreads: 0, unreadThreads: 0, totalViews: 0, uniqueVisitors: 0, portfolioItems: 0, contentConfigured: false };
  const leads = data?.leads || [];
  const threads = data?.chatThreads || [];
  const pages = data?.analytics?.topPages || [];
  const sources = data?.analytics?.topSources || [];
  const portfolio = data?.portfolioItems || [];
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || leads[0];

  return (
    <main className="space-y-5">
      <section className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Real Data Admin Control</p>
            <h2 className="mt-3 text-4xl font-black">Burma AI Studio Command Center</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">Only live website data is shown here: leads, chat threads, analytics, portfolio CMS and content status. No fake dashboard numbers.</p>
          </div>
          <button onClick={() => void load()} className="rounded-full border border-[#be9537]/35 px-5 py-3 text-sm font-black text-[#e3bc61]">Refresh real data</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads" value={stats.leads} note={`${stats.newLeads} new • ${stats.hotLeads} hot`} />
        <StatCard label="Chat Threads" value={stats.chatThreads} note={`${stats.unreadThreads} need reply`} />
        <StatCard label="Visitors" value={stats.uniqueVisitors} note={`${stats.totalViews} page views`} />
        <StatCard label="Portfolio" value={stats.portfolioItems} note={stats.contentConfigured ? "CMS content configured" : "CMS using default content"} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Priority Queue</p><h3 className="mt-1 text-2xl font-black">Latest Leads</h3></div>
            <a href="/admin6996/ops" className="rounded-full bg-[#be9537] px-4 py-2 text-xs font-black text-[#100708]">Manage</a>
          </div>
          <div className="mt-3 rounded-2xl bg-[#fff4dc] px-4 py-3 text-xs font-bold text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">
            Click any lead below to read the full website contact message here.
          </div>
          <div className="mt-5 space-y-3">
            {leads.length ? leads.map((lead, index) => {
              const active = (selectedLead?.id || "") === (lead.id || "") || (!selectedLead?.id && index === 0);
              return (
                <button
                  type="button"
                  key={lead.id || index}
                  onClick={() => setSelectedLeadId(lead.id || `${index}`)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${active ? "border-[#be9537] bg-[#911923] text-white shadow-lg" : "border-[#be9537]/15 bg-[#fff9f0] dark:bg-[#100708]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-black ${active ? "text-[#ffe28a]" : "text-[#911923] dark:text-[#e3bc61]"}`}>{leadName(lead)}</p>
                      <p className={`mt-1 text-xs font-bold ${active ? "text-white/80" : "text-gray-500 dark:text-[#d8c4a3]"}`}>{leadMessage(lead, 130)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? "bg-white/10 text-[#ffe28a]" : "bg-white text-[#911923] dark:bg-[#1a0b0e] dark:text-[#e3bc61]"}`}>{lead.status || "New"}</span>
                  </div>
                  <p className={`mt-2 text-[11px] font-bold ${active ? "text-white/55" : "text-gray-400"}`}>{dateShort(lead.createdAt)}</p>
                </button>
              );
            }) : <EmptyState text="No real lead has arrived yet." />}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Contact Message Reader</p>
              <h3 className="mt-1 text-2xl font-black">Lead Detail</h3>
            </div>
            {selectedLead ? <span className="rounded-full bg-[#be9537] px-4 py-2 text-xs font-black text-[#100708]">{selectedLead.status || "New"}</span> : null}
          </div>

          {selectedLead ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Client</p>
                  <p className="mt-1 font-black text-[#911923] dark:text-[#e3bc61]">{leadName(selectedLead)}</p>
                </div>
                <div className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Received</p>
                  <p className="mt-1 font-black text-[#911923] dark:text-[#e3bc61]">{dateShort(selectedLead.createdAt)}</p>
                </div>
                <div className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Email</p>
                  <p className="mt-1 break-words font-black text-[#911923] dark:text-[#e3bc61]">{selectedLead.email || "—"}</p>
                </div>
                <div className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Source</p>
                  <p className="mt-1 font-black text-[#911923] dark:text-[#e3bc61]">{leadSource(selectedLead)}</p>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[#be9537]/25 bg-[#100708] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e3bc61]">Full Contact Message</p>
                <p className="mt-4 whitespace-pre-wrap text-base font-bold leading-relaxed text-white/90">{leadMessage(selectedLead, 3000)}</p>
              </div>

              <div className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 text-xs font-bold text-gray-500 dark:bg-[#100708] dark:text-[#d8c4a3]">
                <p><span className="font-black text-[#911923] dark:text-[#e3bc61]">Lead ID:</span> {selectedLead.id || "—"}</p>
                {selectedLead.userAgent ? <p className="mt-2 break-words"><span className="font-black text-[#911923] dark:text-[#e3bc61]">Device:</span> {selectedLead.userAgent}</p> : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedLead.email ? <a href={`mailto:${selectedLead.email}?subject=Burma AI Studio project inquiry`} className="rounded-full bg-[#911923] px-5 py-3 text-sm font-black text-white">Email Client</a> : null}
                <button onClick={() => void copyLead(selectedLead)} className="rounded-full border border-[#be9537]/35 px-5 py-3 text-sm font-black text-[#911923] dark:text-[#e3bc61]">Copy Lead</button>
                <a href="/admin6996/ops" className="rounded-full border border-[#be9537]/35 px-5 py-3 text-sm font-black text-[#911923] dark:text-[#e3bc61]">Update Status</a>
                {copyNote ? <span className="self-center text-sm font-black text-[#be9537]">{copyNote}</span> : null}
              </div>
            </div>
          ) : <EmptyState text="Select a real lead to read the full contact message." />}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Conversation Radar</p><h3 className="mt-1 text-2xl font-black">Latest Chats</h3></div>
            <a href="/admin6996/chat" className="rounded-full bg-[#be9537] px-4 py-2 text-xs font-black text-[#100708]">Reply</a>
          </div>
          <div className="mt-5 space-y-3">
            {threads.length ? threads.map((thread) => (
              <div key={thread.visitorId} className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]">
                <div className="flex items-start justify-between gap-3"><p className="font-black text-[#911923] dark:text-[#e3bc61]">{text(thread.visitorId, "visitor", 22)}</p><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#911923] dark:bg-[#1a0b0e] dark:text-[#e3bc61]">{thread.state}</span></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-[#d8c4a3]">{text(thread.latestMessage, "No message", 120)}</p>
                <p className="mt-2 text-[11px] font-bold text-gray-400">{dateShort(thread.latestAt)} • {thread.messageCount} messages</p>
              </div>
            )) : <EmptyState text="No real chat thread yet." />}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e3bc61]">Project Manager Notes</p>
          <h3 className="mt-1 text-2xl font-black">Recommended Actions</h3>
          <div className="mt-5 space-y-3">
            {(data?.recommendations || []).map((item) => <div key={item} className="rounded-2xl bg-white/5 p-4 text-sm font-bold text-white/75">{item}</div>)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Traffic Pulse</p>
          <h3 className="mt-1 text-2xl font-black">Top Real Pages</h3>
          <div className="mt-5 space-y-3">
            {pages.length ? pages.map((page) => (
              <div key={page.name}>
                <div className="mb-1 flex items-center justify-between text-sm font-bold"><span>{text(page.name, "/", 45)}</span><span>{page.count}</span></div>
                <div className="h-2 rounded-full bg-[#f0dfbd] dark:bg-white/10"><div className="h-full rounded-full bg-[#be9537]" style={{ width: `${Math.max(8, (page.count / maxPageCount) * 100)}%` }} /></div>
              </div>
            )) : <EmptyState text="No real analytics event yet." />}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Source Snapshot</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {sources.length ? sources.map((source) => <div key={source.name} className="rounded-2xl border border-[#be9537]/15 p-4"><p className="font-black text-[#911923] dark:text-[#e3bc61]">{source.name}</p><p className="text-sm text-gray-500 dark:text-[#d8c4a3]">{source.count} visits</p></div>) : <EmptyState text="No traffic source yet." />}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Essential Tools Only</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map(([title, href, note]) => <a key={href} href={href} className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 transition hover:-translate-y-1 dark:bg-[#100708]"><p className="font-black text-[#911923] dark:text-[#e3bc61]">{title}</p><p className="mt-1 text-xs text-gray-500 dark:text-[#d8c4a3]">{note}</p></a>)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Portfolio CMS Data</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {portfolio.length ? portfolio.slice(0, 4).map((item) => <div key={item.id || item.src} className="rounded-2xl border border-[#be9537]/15 bg-[#fff9f0] p-4 dark:bg-[#100708]"><p className="font-black text-[#911923] dark:text-[#e3bc61]">{text(item.titleEN || item.titleMM, "Portfolio item", 60)}</p><p className="mt-1 text-xs text-gray-500 dark:text-[#d8c4a3]">{item.featured ? "Featured" : "Standard"}</p></div>) : <EmptyState text="No custom portfolio item has been saved in CMS yet." />}
          </div>
        </div>
      </section>
    </main>
  );
}
