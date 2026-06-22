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
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Operations</p>
        <h2 className="mt-3 text-4xl font-black">Lead & Chat Control</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">Update client lead progress and visitor chat states from a single operation workspace.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {leadOptions.slice(0, 4).map((item) => <div key={item} className="rounded-2xl bg-white/5 p-4"><p className="text-xl font-black">{item}</p><p className="text-xs text-white/55">Lead state</p></div>)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">Lead Pipeline</p>
          <h3 className="mt-3 text-2xl font-black">Lead Status</h3>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ADMIN_CONTROL code" className="mt-5 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead ID" className="mt-3 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)} className="mt-3 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
            {leadOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button disabled={!code || !leadId} onClick={() => void saveLead()} className="mt-4 w-full rounded-2xl bg-[#911923] px-5 py-4 font-extrabold text-white disabled:opacity-50">Save Lead Status</button>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#911923] dark:text-[#e3bc61]">Conversation State</p>
          <h3 className="mt-3 text-2xl font-black">Chat Status</h3>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ADMIN_CONTROL code" className="mt-5 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} placeholder="Visitor ID" className="mt-3 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <select value={chatState} onChange={(e) => setChatState(e.target.value)} className="mt-3 w-full rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
            {chatOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button disabled={!code || !visitorId} onClick={() => void saveChat()} className="mt-4 w-full rounded-2xl bg-[#911923] px-5 py-4 font-extrabold text-white disabled:opacity-50">Save Chat State</button>
        </div>
      </section>

      <p className="rounded-2xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#1a0b0e] dark:text-[#e3bc61]">{note}</p>
    </main>
  );
}
