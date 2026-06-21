"use client";

import { useState } from "react";

const leadOptions = ["New", "Contacted", "Hot", "Warm", "Closed", "Archived"];
const chatOptions = ["Open", "Replied", "Closed", "Unread"];

export default function OpsPage() {
  const [code, setCode] = useState("");
  const [leadId, setLeadId] = useState("");
  const [leadStatus, setLeadStatus] = useState("New");
  const [visitorId, setVisitorId] = useState("");
  const [chatState, setChatState] = useState("Open");
  const [note, setNote] = useState("Ready.");

  async function saveLead() {
    setNote("Saving lead status...");
    const res = await fetch("/api/inbox-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, id: leadId, status: leadStatus }),
    });
    const data = await res.json().catch(() => null);
    setNote(data?.ok ? "Lead status saved." : data?.message || "Lead status failed.");
  }

  async function saveChat() {
    setNote("Saving chat state...");
    const res = await fetch("/api/chat-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, visitorId, state: chatState }),
    });
    const data = await res.json().catch(() => null);
    setNote(data?.ok ? "Chat state saved." : data?.message || "Chat state failed.");
  }

  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-3 text-3xl font-black">Operations Control</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-[#d8c4a3]">Status tools for leads and chat conversations.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Control code" className="mt-6 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#be9537]/20 p-4">
            <h2 className="text-xl font-black">Lead Status</h2>
            <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead ID" className="mt-4 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)} className="mt-3 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
              {leadOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button disabled={!code || !leadId} onClick={() => void saveLead()} className="mt-4 w-full rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save Lead Status</button>
          </div>

          <div className="rounded-2xl border border-[#be9537]/20 p-4">
            <h2 className="text-xl font-black">Chat State</h2>
            <input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} placeholder="Visitor ID" className="mt-4 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
            <select value={chatState} onChange={(e) => setChatState(e.target.value)} className="mt-3 w-full rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
              {chatOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button disabled={!code || !visitorId} onClick={() => void saveChat()} className="mt-4 w-full rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save Chat State</button>
          </div>
        </div>

        <p className="mt-6 rounded-xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">{note}</p>
      </section>
    </main>
  );
}
