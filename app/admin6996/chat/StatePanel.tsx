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
    <section className="mx-auto mt-6 max-w-7xl rounded-[2rem] border border-[#be9537]/25 bg-white p-5 shadow-xl dark:bg-[#1a0b0e]">
      <h2 className="text-2xl font-black">Chat Status Control</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Control code" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        <input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} placeholder="Visitor ID" className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]" />
        <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 outline-none dark:bg-[#100708]">
          {states.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button disabled={!code || !visitorId} onClick={() => void save()} className="rounded-xl bg-[#911923] px-5 py-3 font-extrabold text-white disabled:opacity-50">Save</button>
      </div>
      <p className="mt-3 text-sm font-bold text-[#911923] dark:text-[#e3bc61]">{note}</p>
    </section>
  );
}
