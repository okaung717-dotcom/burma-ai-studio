"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Enter your admin username and password.");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setStatus("Checking login...");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setStatus(data?.message || "Login failed.");
        return;
      }
      setStatus("Login success. Opening admin control...");
      window.location.href = "/admin6996/tools";
    } catch {
      setStatus("Login cannot be completed yet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#100708] px-5 text-[#fff7eb]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#be9537]/25 bg-[#1a0b0e] p-7 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-3 text-3xl font-black">Admin Login</h1>
        <p className="mt-2 text-sm text-[#d8c4a3]">Username and password are required before opening the control center.</p>
        <div className="mt-6 space-y-3">
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" className="w-full rounded-xl border border-[#be9537]/30 bg-[#100708] px-4 py-3 text-white outline-none" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-[#be9537]/30 bg-[#100708] px-4 py-3 text-white outline-none" />
        </div>
        <button disabled={loading || !username || !password} onClick={() => void login()} className="mt-4 w-full rounded-xl bg-[#be9537] px-5 py-3 font-extrabold text-[#100708] disabled:opacity-50">Login</button>
        <p className="mt-4 rounded-xl bg-[#100708] px-4 py-3 text-sm font-bold text-[#e3bc61]">{status}</p>
      </section>
    </main>
  );
}
