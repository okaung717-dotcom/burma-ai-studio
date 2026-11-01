"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Sparkles } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    const response = await fetch("/api/account/sign-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) { setError(result?.error || "Unable to sign in."); setLoading(false); return; }
    router.replace("/"); router.refresh();
  }

  return <main className="studio-login">
    <section className="studio-login-visual"><div className="login-brand"><span>BA</span><strong>Burma AI Studio</strong></div><div className="login-visual-copy"><p><Sparkles/>PRIVATE CREATIVE WORKSPACE</p><h1>Ideas become<br/><em>moving worlds.</em></h1><span>Direct images, motion and cinematic stories from one connected canvas.</span></div><div className="login-orbit" aria-hidden="true"><i/><i/><i/></div><small>Invite-only beta · Protected production environment</small></section>
    <section className="studio-login-panel"><form onSubmit={submit}><div className="login-lock"><LockKeyhole/></div><p>PRIVATE BETA</p><h2>Welcome to Burma AI Studio</h2><span>Sign in to open your private creative workspace.</span><label>Username<input type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength={64} autoCapitalize="none" spellCheck={false} placeholder="Enter username"/></label><label>Password<div><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={14} maxLength={128} required placeholder="Enter your secure password"/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>{error && <div className="login-error" role="alert">{error}</div>}<button className="login-submit" disabled={loading}>{loading ? <Loader2 className="spin"/> : <>Sign In<ArrowRight/></>}</button><footer>Administrator access only · Sessions expire after 12 hours.</footer></form></section>
  </main>;
}
