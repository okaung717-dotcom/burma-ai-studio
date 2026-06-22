"use client";

import { useState } from "react";

const states = ["Open", "Replied", "Closed", "Unread"];

export default function StatePanel() {
  const [code, setCode] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [state, setState] = useState("Open");
  const [note, setNote] = useState("Set conversation state here.");

  async function save() {
    setNote("Saving...");
    const res = await fetch("/api/chat-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, visitorId, state }),
    });
    const data = await res.json().catch(() => null);
    setNote(data?.ok ? "Chat state saved." : data?.message || "State save failed.");
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Chat Status</p>
        <h2 className="mt-3 text-4xl font-black">Conversation Control</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">Update visitor conversation state without touching the main chat thread. Use this for admin workflow tracking.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {states.map((item) => <div key={item} className="rounded-2xl bg-white/5 p-4"><p className="text-xl font-black">{item}</p><p className="text-xs text-white/55">State</p></div>)}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ADMIN_CONTROL code" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} placeholder="Visitor ID" className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
          <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
            {states.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button disabled={!code || !visitorId} onClick={() => void save()} className="rounded-2xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save</button>
        </div>
        <p className="mt-4 rounded-2xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{note}</p>
      </div>
    </section>
  );
}
