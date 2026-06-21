"use client";

import { useMemo, useState } from "react";

type Log = { id?: string; visitorId?: string; role?: "user" | "assistant" | "admin"; content?: string; page?: string; language?: string; createdAt?: string };
type Thread = { visitorId: string; latestAt: string; latestMessage: string; unread: number; messages: Log[] };

function formatDate(value?: string) {
  if (!value) return "Unknown time";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminChatPage() {
  const [code, setCode] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState("");
  const [reply, setReply] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Enter ADMIN_CONTROL code and load chatbot inbox.");
  const [loading, setLoading] = useState(false);

  const filteredThreads = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return threads;
    return threads.filter((thread) => `${thread.visitorId} ${thread.latestMessage} ${thread.messages.map((m) => m.content).join(" ")}`.toLowerCase().includes(q));
  }, [threads, query]);

  const currentThread = filteredThreads.find((thread) => thread.visitorId === selected) || filteredThreads[0];

  async function loadChats(nextCode = activeCode || code) {
    setLoading(true);
    setStatus("Loading chatbot conversations...");
    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nextCode, action: "list" }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setStatus(data?.message || "Chat inbox cannot be loaded.");
        return;
      }
      const nextThreads = Array.isArray(data.threads) ? data.threads : [];
      setActiveCode(nextCode);
      setThreads(nextThreads);
      if (!selected && nextThreads[0]?.visitorId) setSelected(nextThreads[0].visitorId);
      setStatus(`Loaded ${nextThreads.length} conversation${nextThreads.length === 1 ? "" : "s"}.`);
    } catch {
      setStatus("Chat inbox cannot be loaded. Check REDIS_URL, ADMIN_CONTROL, and redeploy.");
    } finally {
      setLoading(false);
    }
  }

  async function sendReply() {
    const adminCode = activeCode || code;
    const visitorId = currentThread?.visitorId || selected;
    const clean = reply.trim();
    if (!adminCode || !visitorId || !clean) {
      setStatus("Select a conversation and write a reply first.");
      return;
    }
    setLoading(true);
    setStatus("Sending admin reply...");
    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: adminCode, action: "reply", visitorId, content: clean }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setStatus(data?.message || "Reply cannot be sent.");
        return;
      }
      setReply("");
      setStatus("Reply sent. It will appear in the visitor's chatbot when their chat is open.");
      await loadChats(adminCode);
    } catch {
      setStatus("Reply cannot be sent. Check Redis and admin code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio Admin Control</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">AI Chatbot Inbox</h1>
          <p className="mt-3 text-gray-600 dark:text-[#d8c4a3]">See what visitors ask, review AI answers, and reply manually like a professional support inbox.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{threads.length}</p><p className="text-sm font-bold text-gray-500">Conversations</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{threads.reduce((sum, t) => sum + t.messages.length, 0)}</p><p className="text-sm font-bold text-gray-500">Messages</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-3xl font-black">{threads.reduce((sum, t) => sum + t.unread, 0)}</p><p className="text-sm font-bold text-gray-500">User Messages</p></div>
          <div className="rounded-2xl bg-white p-5 shadow dark:bg-[#1a0b0e]"><p className="text-sm font-bold text-gray-500">Status</p><p className="mt-1 text-sm">{status}</p></div>
        </section>

        <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input value={code} onChange={(event) => setCode(event.target.value)} type="password" placeholder="Enter ADMIN_CONTROL code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <button disabled={loading || !code} onClick={() => void loadChats(code)} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Load Chats</button>
            <button disabled={loading || !activeCode} onClick={() => void loadChats()} className="rounded-xl border border-[#be9537]/30 px-5 py-3 font-extrabold text-[#911923] disabled:opacity-50 dark:text-[#e3bc61]">Refresh</button>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search visitor id or message..." className="mt-3 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        </section>

        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-3 rounded-[2rem] border border-[#be9537]/25 bg-white p-4 shadow-xl dark:bg-[#1a0b0e]">
            <h2 className="px-2 text-xl font-black">Conversations</h2>
            {filteredThreads.length === 0 ? <p className="px-2 text-sm text-gray-500">No chats yet. Ask something from the website chatbot first.</p> : filteredThreads.map((thread) => (
              <button key={thread.visitorId} onClick={() => setSelected(thread.visitorId)} className={`block w-full rounded-2xl p-4 text-left transition ${currentThread?.visitorId === thread.visitorId ? "bg-[#911923] text-white" : "bg-[#fff9f0] hover:bg-[#fff3e3] dark:bg-[#100708]"}`}>
                <p className="truncate text-sm font-black">Visitor {thread.visitorId.slice(0, 10)}...</p>
                <p className="mt-1 line-clamp-2 text-xs opacity-80">{thread.latestMessage || "No message"}</p>
                <p className="mt-2 text-[11px] opacity-70">{formatDate(thread.latestAt)} • {thread.messages.length} msgs</p>
              </button>
            ))}
          </aside>

          <section className="rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div><h2 className="text-2xl font-black">Conversation Detail</h2><p className="text-sm text-gray-500 dark:text-[#d8c4a3]">{currentThread ? `Visitor ${currentThread.visitorId}` : "No conversation selected"}</p></div>
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto rounded-2xl bg-[#fffdf8] p-4 dark:bg-[#100708]">
              {!currentThread ? <p className="text-center text-gray-500">No conversation selected.</p> : currentThread.messages.slice().reverse().map((message, index) => (
                <div key={message.id || index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-[#911923] text-white" : message.role === "admin" ? "bg-[#be9537] text-white" : "bg-white text-gray-700 dark:bg-[#1a0b0e] dark:text-[#fff7eb]"}`}>
                    <p className="mb-1 text-[11px] font-black uppercase opacity-70">{message.role === "admin" ? "Admin Reply" : message.role === "assistant" ? "AI Assistant" : "Visitor"}</p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="mt-2 text-[10px] opacity-60">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#be9537]/20 bg-[#fff9f0] p-4 dark:bg-[#100708]">
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={4} placeholder="Write your manual reply to this visitor..." className="w-full resize-none rounded-xl border border-[#be9537]/30 bg-white px-4 py-3 outline-none dark:bg-[#1a0b0e]" />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500 dark:text-[#d8c4a3]">Reply appears in the visitor chatbot while their chat is open.</p>
                <button disabled={loading || !reply.trim() || !currentThread} onClick={() => void sendReply()} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Send Admin Reply</button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
