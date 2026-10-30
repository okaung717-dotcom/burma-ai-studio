"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Sparkles } from "lucide-react";

export default function EmailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/account/email-sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) { setError(result?.error || "Sign in failed."); return; }
      router.replace("/studio/spaces");
      router.refresh();
    } catch { setError("Unable to reach the sign-in service."); }
    finally { setLoading(false); }
  }

  return <main className="studio-login">
    <section className="studio-login-visual">
      <div className="login-brand"><span>BA</span><strong>Burma AI Studio</strong></div>
      <div className="login-visual-copy">
        <p><Sparkles/>PRIVATE CREATIVE WORKSPACE</p>
        <h1>Ideas become<br/><em>moving worlds.</em></h1>
        <span>Image, video and audio production in one connected canvas.</span>
      </div>
      <div className="login-orbit" aria-hidden="true"><i/><i/><i/></div>
      <small>Invite-only accounts · Account access managed by Studio Owner</small>
    </section>
    <section className="studio-login-panel">
      <form onSubmit={submit}>
        <div className="login-lock"><LockKeyhole/></div>
        <p>MEMBER ACCESS</p><h2>Welcome to Burma AI Studio</h2>
        <span>Sign in with your invited account.</span>
        <label>Email Address
          <input type="email" autoComplete="email" inputMode="email" value={email}
            onChange={event=>setEmail(event.target.value)} required maxLength={254}
            autoCapitalize="none" spellCheck={false} placeholder="you@example.com"/>
        </label>
        <label>Password
          <div>
            <input type={visible?"text":"password"} autoComplete="current-password"
              value={password} onChange={event=>setPassword(event.target.value)}
              minLength={8} maxLength={128} required placeholder="Enter your password"/>
            <button type="button" onClick={()=>setVisible(v=>!v)}
              aria-label={visible?"Hide password":"Show password"}>{visible?<EyeOff/>:<Eye/>}</button>
          </div>
        </label>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button className="login-submit" disabled={loading}>
          {loading?<Loader2 className="spin"/>:<>Sign In<ArrowRight/></>}
        </button>
        <footer>Invitation required · For password recovery contact the Studio Owner</footer>
      </form>
    </section>
  </main>;
}
