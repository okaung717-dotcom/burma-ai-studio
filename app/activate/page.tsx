"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token") || "";
    const refreshToken = hash.get("refresh_token") || "";
    // Avoid retaining bearer tokens in the browser history or URL after page load.
    window.history.replaceState(null, "", window.location.pathname);
    if (accessToken && refreshToken) setTokens({ accessToken, refreshToken });
    else setError("Invitation link is missing or expired. Ask the owner for a new invite.");
  }, []);

  async function activate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tokens) return;
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setWorking(true); setError("");
    try {
      const response = await fetch("/api/account/email-activate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tokens, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) { setError(data?.error || "Account activation failed."); return; }
      setTokens(null); setPassword(""); setConfirm("");
      router.replace("/studio/spaces"); router.refresh();
    } catch { setError("Activation service could not be reached."); }
    finally { setWorking(false); }
  }

  return <main className="min-h-screen bg-[#11101b] px-4 py-16 text-white">
    <div className="mx-auto max-w-md rounded-3xl border border-violet-400/25 bg-[#191525] p-8 shadow-2xl">
      <p className="text-sm font-semibold tracking-widest text-violet-300">BURMA AI STUDIO</p>
      <h1 className="mt-4 text-3xl font-bold">Activate your account</h1>
      <p className="mt-2 text-sm text-[#c6bfd5]">Create your own secure password. The Studio Owner cannot see it.</p>
      {error && <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-sm">{error}</div>}
      {tokens && <form className="mt-6 space-y-5" onSubmit={activate}>
        <label className="block text-sm">New password
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-[#211d2d] px-4 py-3 outline-none focus:border-violet-400"
            type="password" autoComplete="new-password" minLength={14} maxLength={128}
            value={password} onChange={e=>setPassword(e.target.value)} required/>
        </label>
        <label className="block text-sm">Confirm password
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-[#211d2d] px-4 py-3 outline-none focus:border-violet-400"
            type="password" autoComplete="new-password" minLength={14} maxLength={128}
            value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
        </label>
        <p className="text-xs text-[#afa8bd]">Use 14 or more characters, uppercase and lowercase letters, a number and a symbol.</p>
        <button disabled={working} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold disabled:opacity-60">
          {working?"Activating...":"Activate account"}
        </button>
      </form>}
    </div>
  </main>;
}
