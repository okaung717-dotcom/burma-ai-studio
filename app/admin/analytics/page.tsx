"use client";

import { useState } from "react";

type CountItem = { name: string; count: number };
type Visit = { createdAt?: string; page?: string; source?: string; device?: string; country?: string; language?: string };
type Summary = { totalViews: number; uniqueVisitors: number; countries: CountItem[]; pages: CountItem[]; sources: CountItem[]; devices: CountItem[]; languages: CountItem[]; days: CountItem[]; recentEvents: Visit[] };

function formatDate(value?: string) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function ListBox({ title, items }: { title: string; items: CountItem[] }) {
  return (
    <div className="rounded-2xl border border-[#be9537]/25 bg-white p-5 shadow dark:bg-[#1a0b0e]">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-gray-500">No data yet.</p> : items.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl bg-[#fff9f0] px-3 py-2 text-sm dark:bg-[#100708]">
            <span className="font-bold">{item.name}</span>
            <span className="rounded-full bg-[#911923] px-2 py-1 text-xs font-black text-white">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [code, setCode] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState("Enter ADMIN_CONTROL code and load analytics.");
  const [loading, setLoading] = useState(false);

  async function loadAnalytics() {
    setLoading(true);
    setStatus("Loading analytics...");
    try {
      const res = await fetch("/api/analytics/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus(data?.message || "Analytics cannot be loaded.");
        return;
      }
      setSummary(data.summary as Summary);
      setStatus("Analytics loaded. New views appear after visitors open pages.");
    } catch {
      setStatus("Analytics cannot be loaded. Check REDIS_URL, ADMIN_CONTROL, and redeploy.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio Admin Control</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Website Analytics</h1>
          <p className="mt-3 text-gray-600 dark:text-[#d8c4a3]">View visitors, countries, page views, traffic apps/sources, devices, languages, and recent visits.</p>
        </section>

        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input value={code} onChange={(event) => setCode(event.target.value)} type="password" placeholder="Enter ADMIN_CONTROL code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <button disabled={loading || !code} onClick={() => void loadAnalytics()} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Load Analytics</button>
          </div>
          <p className="mt-3 rounded-xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{status}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{summary?.totalViews || 0}</p><p className="text-sm font-bold text-gray-500">Total Views</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{summary?.uniqueVisitors || 0}</p><p className="text-sm font-bold text-gray-500">Visitors</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{summary?.countries?.length || 0}</p><p className="text-sm font-bold text-gray-500">Countries</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{summary?.pages?.length || 0}</p><p className="text-sm font-bold text-gray-500">Pages</p></div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ListBox title="Countries" items={summary?.countries || []} />
          <ListBox title="Apps / Traffic Sources" items={summary?.sources || []} />
          <ListBox title="Devices" items={summary?.devices || []} />
          <ListBox title="Pages" items={summary?.pages || []} />
          <ListBox title="Languages" items={summary?.languages || []} />
          <ListBox title="Daily Views" items={summary?.days || []} />
        </section>

        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <h2 className="mb-4 text-2xl font-black">Recent Visits</h2>
          <div className="space-y-3">
            {(summary?.recentEvents || []).length === 0 ? <p className="text-gray-500">No recent visits yet.</p> : summary?.recentEvents.map((event, index) => (
              <div key={index} className="rounded-xl bg-[#fff9f0] p-4 text-sm dark:bg-[#100708]">
                <p className="font-black">{event.page || "/"}</p>
                <p className="mt-1 text-gray-600 dark:text-[#d8c4a3]">{event.country || "Unknown"} • {event.source || "Direct"} • {event.device || "Unknown"} • {event.language || "Unknown"}</p>
                <p className="mt-1 text-xs text-gray-500">{formatDate(event.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
