"use client";

import { useEffect, useMemo, useState } from "react";

type Message = {
  id?: string;
  role?: "user" | "assistant" | "admin";
  content?: string;
  createdAt?: string;
};

type Thread = {
  visitorId: string;
  latestAt: string;
  latestMessage: string;
  latestRole?: string;
  unread: number;
  state?: string;
  messageCount?: number;
  messages?: Message[];
};

type Overview = {
  ok?: boolean;
  message?: string;
  chatThreads?: Thread[];
};

function shortDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ChatInboxClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading real visitor messages...");
  const [loading, setLoading] = useState(false);

  async function loadChats() {
    setLoading(true);
    const response = await fetch("/api/admin/overview", { cache: "no-store" }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as Overview | null;
    if (!response?.ok || !data?.ok) {
      setThreads([]);
      setStatus(data?.message || "Chat messages cannot be loaded. Please login again.");
      setLoading(false);
      return;
    }
    const next = Array.isArray(data.chatThreads) ? data.chatThreads : [];
    setThreads(next);
    if (!selected && next[0]?.visitorId) setSelected(next[0].visitorId);
    setStatus(next.length ? `${next.length} real chat conversation loaded.` : "No visitor message yet. Send a test message from Ask AI.");
    setLoading(false);
  }

  useEffect(() => {
    void loadChats();
    const timer = window.setInterval(() => void loadChats(), 10000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return threads;
    return threads.filter((thread) => `${thread.visitorId} ${thread.latestMessage} ${(thread.messages || []).map((message) => message.content).join(" ")}`.toLowerCase().includes(q));
  }, [threads, query]);

  const current = filtered.find((thread) => thread.visitorId === selected) || filtered[0];

  return (
    <main className="space-y-5 p-5">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-[#fff9f0] p-5 dark:bg-[#100708]"><p className="text-3xl font-black">{threads.length}</p><p className="text-sm font-bold text-gray-500">Conversations</p></div>
        <div className="rounded-2xl bg-[#fff9f0] p-5 dark:bg-[#100708]"><p className="text-3xl font-black">{threads.reduce((sum, item) => sum + (item.messageCount || item.messages?.length || 0), 0)}</p><p className="text-sm font-bold text-gray-500">Messages</p></div>
        <div className="rounded-2xl bg-[#fff9f0] p-5 dark:bg-[#100708]"><p className="text-3xl font-black">{threads.reduce((sum, item) => sum + item.unread, 0)}</p><p className="text-sm font-bold text-gray-500">User Messages</p></div>
        <div className="rounded-2xl bg-[#fff9f0] p-5 dark:bg-[#100708]"><p className="text-sm font-bold text-gray-500">Status</p><p className="mt-1 text-sm">{status}</p></div>
      </section>

      <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-sm dark:bg-[#1a0b0e]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search visitor id or message..." className="min-w-0 flex-1 rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <button disabled={loading} onClick={() => void loadChats()} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Refresh</button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-3 rounded-[2rem] border border-[#be9537]/25 bg-white p-4 shadow-sm dark:bg-[#1a0b0e]">
          <h2 className="px-2 text-xl font-black">Conversations</h2>
          {filtered.length === 0 ? (
            <p className="px-2 text-sm text-gray-500 dark:text-[#d8c4a3]">No chats yet. Open the public Ask AI widget and send a test message.</p>
          ) : filtered.map((thread) => (
            <button key={thread.visitorId} onClick={() => setSelected(thread.visitorId)} className={`block w-full rounded-2xl p-4 text-left transition ${current?.visitorId === thread.visitorId ? "bg-[#911923] text-white" : "bg-[#fff9f0] hover:bg-[#fff3e3] dark:bg-[#100708]"}`}>
              <p className="truncate text-sm font-black">Visitor {thread.visitorId.slice(0, 12)}...</p>
              <p className="mt-1 line-clamp-2 text-xs opacity-80">{thread.latestMessage || "No message"}</p>
              <p className="mt-2 text-[11px] opacity-70">{shortDate(thread.latestAt)} • {thread.messageCount || thread.messages?.length || 0} msgs</p>
            </button>
          ))}
        </aside>

        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-sm dark:bg-[#1a0b0e]">
          <h2 className="text-2xl font-black">Conversation Detail</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-[#d8c4a3]">{current ? `Visitor ${current.visitorId}` : "No conversation selected"}</p>
          <div className="mt-4 max-h-[560px] space-y-3 overflow-y-auto rounded-2xl bg-[#fffdf8] p-4 dark:bg-[#100708]">
            {!current ? <p className="text-center text-gray-500">No conversation selected.</p> : (current.messages || []).slice().reverse().map((message, index) => (
              <div key={message.id || index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-[#911923] text-white" : message.role === "admin" ? "bg-[#be9537] text-[#100708]" : "bg-white text-gray-700 dark:bg-[#1a0b0e] dark:text-[#fff7eb]"}`}>
                  <p className="mb-1 text-[11px] font-black uppercase opacity-70">{message.role === "admin" ? "Admin Reply" : message.role === "assistant" ? "AI Assistant" : "Visitor"}</p>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-2 text-[10px] opacity-60">{shortDate(message.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
