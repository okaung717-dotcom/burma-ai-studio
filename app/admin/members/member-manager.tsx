"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LogOut, RefreshCw, Send, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";

type MemberRow = {
  user_id: string;
  email: string;
  status: string;
  plan_code: string;
  expires_at: string | null;
  created_at: string;
};

export default function MemberManager({ ownerEmail }: { ownerEmail: string }) {
  const router = useRouter();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function reload() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/members", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Members unavailable.");
      setMembers(Array.isArray(data.members) ? data.members : []);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load members."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/members", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Invitation failed.");
      setMessage(data.message || "Invitation sent.");
      setEmail("");
      await reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Invitation failed."); }
    finally { setSending(false); }
  }

  async function signOut() {
    await fetch("/api/account/sign-out", { method: "POST" });
    router.replace("/login"); router.refresh();
  }

  return <main className="min-h-screen bg-[#111018] px-5 py-9 text-white">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="flex items-center gap-2 text-xs font-bold tracking-[.18em] text-violet-300"><ShieldCheck size={17}/> OWNER CONTROL</div>
          <h1 className="mt-2 text-4xl font-semibold">Members</h1>
          <p className="mt-2 text-sm text-[#aba5b9]">Invite-only private beta · Signed in as {ownerEmail}</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm"><LogOut size={16}/> Sign out</button>
      </header>

      <section className="mt-9 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#1d1928] p-5">
          <Users className="text-violet-400"/><p className="mt-4 text-3xl font-semibold">{members.length}</p>
          <p className="text-sm text-[#a7a1b3]">Members (first 100)</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1d1928] p-5">
          <p className="text-sm text-[#a7a1b3]">Active accounts</p>
          <p className="mt-5 text-3xl font-semibold">{members.filter(x=>x.status==="active").length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1d1928] p-5">
          <p className="text-sm text-[#a7a1b3]">Generation billing</p>
          <p className="mt-5 text-lg font-semibold">Disabled in private beta</p>
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-white/10 bg-[#1d1928] p-6">
        <h2 className="text-xl font-semibold">Invite member</h2>
        <p className="mt-1 text-sm text-[#aaa4b8]">Your member will set their own password. New accounts receive zero credits.</p>
        <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_180px_auto]" onSubmit={invite}>
          <input aria-label="Member email" type="email" placeholder="member@example.com" value={email}
            onChange={e=>setEmail(e.target.value)} required maxLength={254}
            className="min-w-0 rounded-xl border border-white/15 bg-[#14111e] px-4 py-3"/>
          <select aria-label="Member plan" value={plan} onChange={e=>setPlan(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#14111e] px-4 py-3">
            <option value="starter">Starter</option><option value="pro">Pro</option><option value="premium">Premium</option>
          </select>
          <button disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold disabled:opacity-60"><Send size={16}/>{sending?"Sending...":"Send invite"}</button>
        </form>
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
        {message && <p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-[#1d1928]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold">Accounts</h2>
          <button disabled={loading} onClick={()=>void reload()} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><RefreshCw size={15}/> Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[#171320] text-[#aea7bd]"><tr>
              <th className="px-5 py-3">Email</th><th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Status</th><th className="px-5 py-3">Expires</th>
            </tr></thead>
            <tbody>{members.map(member=><tr key={member.user_id} className="border-t border-white/10">
              <td className="px-5 py-4">{member.email}</td><td className="px-5 py-4 capitalize">{member.plan_code}</td>
              <td className="px-5 py-4 capitalize">{member.status}</td>
              <td className="px-5 py-4">{member.expires_at?new Date(member.expires_at).toLocaleDateString():"—"}</td>
            </tr>)}</tbody>
          </table>
          {!members.length && <p className="p-6 text-sm text-[#aaa4b8]">{loading?"Loading accounts...":"No member records yet."}</p>}
        </div>
      </section>
      <p className="mt-5 text-xs text-[#9992a8]">Private beta foundation only. Payment processing, account suspension controls and paid AI usage are not enabled.</p>
    </div>
  </main>;
}
