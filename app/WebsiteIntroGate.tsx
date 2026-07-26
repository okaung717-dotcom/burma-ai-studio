"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Film,
  Globe2,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import "./website-intro-gate.css";

const INTRO_SESSION_KEY = "bas_website_intro_seen_v1";
const PROFILE_STORAGE_KEY = "bas_website_profile";
const INTRO_UI_REVEAL_MS = 2800;

type AuthMode = "signin" | "signup" | null;
type AccountUser = { id?: string; email?: string; displayName?: string } | null;

type AuthResponse = {
  ok?: boolean;
  authenticated?: boolean;
  requiresEmailConfirmation?: boolean;
  error?: string;
  user?: AccountUser;
};

const copy = {
  EN: {
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    title1: "Make Every Frame",
    title2: "Feel Expensive.",
    desc: "Premium AI films, cinematic campaigns and original stories — shaped with human creative direction for brands that want to be remembered.",
    enter: "Enter Studio",
    create: "Create account",
    signIn: "Sign in",
    signedIn: "Signed in",
    guestNote: "Public website access is free. An account is optional for now.",
    authSignInTitle: "Welcome back.",
    authSignInCopy: "Sign in to continue with your Burma AI Studio account.",
    authSignUpTitle: "Create your studio account.",
    authSignUpCopy: "Create an account for a more personal client experience as account features expand.",
    name: "Your name",
    email: "Email address",
    password: "Password",
    passwordHint: "At least 8 characters",
    submitSignIn: "Sign in",
    submitSignUp: "Create account",
    working: "Please wait…",
    switchToSignUp: "New here? Create an account",
    switchToSignIn: "Already have an account? Sign in",
    emailConfirmation: "Account created. Check your email to confirm it, then sign in.",
    accountReady: "You're signed in. Entering the studio…",
    legal: "By continuing, you agree to our Terms and Privacy Policy.",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    title1: "စိတ်ကူးတိုင်းကို အသက်ဝင်စေမယ့်",
    title2: "Cinematic AI Storytelling.",
    desc: "Premium AI Film, Cinematic Campaign နဲ့ Original Stories တွေကို Human Creative Direction နဲ့ပေါင်းစပ်ပြီး Brand ကို ပိုထင်ရှားအောင်ဖန်တီးပေးပါတယ်။",
    enter: "Studio ထဲဝင်ရန်",
    create: "Account ဖွင့်ရန်",
    signIn: "Sign in",
    signedIn: "Signed in",
    guestNote: "Public Website ကို လူတိုင်းအခမဲ့သုံးနိုင်ပါတယ်။ လက်ရှိအချိန်မှာ Account မရှိလည်းဝင်ကြည့်နိုင်ပါတယ်။",
    authSignInTitle: "ပြန်လည်ကြိုဆိုပါတယ်။",
    authSignInCopy: "Burma AI Studio Account နဲ့ ဆက်သုံးဖို့ Sign in ဝင်ပါ။",
    authSignUpTitle: "Studio Account ဖွင့်ပါ။",
    authSignUpCopy: "နောက်ပိုင်း Client features တွေတိုးလာတဲ့အခါ ပိုကိုယ်ပိုင်ဆန်တဲ့ experience ရဖို့ Account ဖွင့်ထားနိုင်ပါတယ်။",
    name: "အမည်",
    email: "Email လိပ်စာ",
    password: "Password",
    passwordHint: "အနည်းဆုံး 8 လုံး",
    submitSignIn: "Sign in ဝင်ရန်",
    submitSignUp: "Account ဖွင့်ရန်",
    working: "ခဏစောင့်ပါ…",
    switchToSignUp: "Account မရှိသေးဘူးလား? Account ဖွင့်ရန်",
    switchToSignIn: "Account ရှိပြီးသားလား? Sign in ဝင်ရန်",
    emailConfirmation: "Account ဖွင့်ပြီးပါပြီ။ Email ကို Confirm လုပ်ပြီး Sign in ပြန်ဝင်ပါ။",
    accountReady: "Sign in အောင်မြင်ပါပြီ။ Studio ထဲဝင်နေပါတယ်…",
    legal: "ဆက်လုပ်ခြင်းဖြင့် Terms နဲ့ Privacy Policy ကို သဘောတူပြီးဖြစ်ပါတယ်။",
  },
} as const;

function isAppExperience() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  const search = new URLSearchParams(window.location.search);
  const ua = navigator.userAgent || "";
  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
      nav.standalone === true ||
      (ua.includes("Android") && ua.includes("; wv")) ||
      search.get("source") === "pwa" ||
      search.get("source") === "app" ||
      search.get("source") === "native" ||
      search.get("platform") === "ios" ||
      search.get("platform") === "android"
  );
}

export default function WebsiteIntroGate() {
  const pathname = usePathname() || "/";
  const { lang, toggleLang } = useLanguage();
  const t = copy[lang === "MM" ? "MM" : "EN"];

  const [visible, setVisible] = useState(true);
  const [uiReady, setUiReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [account, setAccount] = useState<AccountUser>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isMyanmar = lang === "MM";
  const signedInLabel = useMemo(() => {
    if (!account?.email) return t.signedIn;
    return account.email.length > 28 ? `${account.email.slice(0, 25)}…` : account.email;
  }, [account?.email, t.signedIn]);

  useEffect(() => {
    if (pathname !== "/" || isAppExperience()) {
      setVisible(false);
      return;
    }

    const forceIntro = new URLSearchParams(window.location.search).get("intro") === "1";
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {
      alreadySeen = false;
    }
    setVisible(forceIntro || !alreadySeen);

    fetch("/api/account/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean; user?: AccountUser }) => {
        if (data.authenticated && data.user) setAccount(data.user);
      })
      .catch(() => undefined);
  }, [pathname]);

  useEffect(() => {
    if (!visible || pathname !== "/") {
      setUiReady(false);
      return;
    }

    setUiReady(false);
    const revealTimer = window.setTimeout(() => setUiReady(true), INTRO_UI_REVEAL_MS);
    return () => window.clearTimeout(revealTimer);
  }, [visible, pathname]);

  useEffect(() => {
    if (!visible) return;
    document.body.classList.add("bas-intro-open");
    return () => document.body.classList.remove("bas-intro-open");
  }, [visible]);

  const persistProfile = (user: AccountUser) => {
    if (!user) return;
    try {
      const existingRaw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify({
          displayName: user.displayName || existing.displayName || "Burma AI Studio Client",
          email: user.email || existing.email || "",
          company: existing.company || "",
        })
      );
    } catch {
      // Account entry remains usable even when browser storage is unavailable.
    }
  };

  const enterStudio = (user?: AccountUser) => {
    if (user) persistProfile(user);
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // The Intro can still close when session storage is unavailable.
    }
    setLeaving(true);
    window.setTimeout(() => {
      document.documentElement.classList.add("bas-intro-skip");
      setVisible(false);
      setLeaving(false);
      setAuthMode(null);
    }, 520);
  };

  const openAuth = (mode: Exclude<AuthMode, null>) => {
    setError("");
    setMessage("");
    setPassword("");
    setAuthMode(mode);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authMode || submitting) return;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const endpoint = authMode === "signin" ? "/api/account/sign-in" : "/api/account/sign-up";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authMode === "signin" ? { email, password } : { name, email, password }),
      });
      const data = (await response.json().catch(() => null)) as AuthResponse | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.requiresEmailConfirmation) {
        setMessage(t.emailConfirmation);
        setAuthMode("signin");
        setPassword("");
        return;
      }

      if (data.user) {
        setAccount(data.user);
        setMessage(t.accountReady);
        window.setTimeout(() => enterStudio(data.user), 560);
      }
    } catch {
      setError("Connection problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible || pathname !== "/") return null;

  return (
    <section
      className={`bas-intro${uiReady ? " is-ui-ready" : ""}${leaving ? " is-leaving" : ""}${isMyanmar ? " is-mm" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Burma AI Studio introduction"
    >
      <div className="bas-intro-media" aria-hidden="true">
        <video
          src="/burma-ai-studio-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.035)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
      <div className="bas-intro-shade" aria-hidden="true" />
      <div className="bas-intro-grain" aria-hidden="true" />

      <header className="bas-intro-header">
        <button type="button" className="bas-intro-brand" onClick={() => enterStudio()} aria-label="Enter Burma AI Studio">
          <span className="bas-intro-brand-mark">BA</span>
          <span><b>Burma AI Studio</b><small>Cinematic AI Production</small></span>
        </button>

        <div className="bas-intro-header-actions">
          <button type="button" className="bas-intro-icon-button" onClick={toggleLang} aria-label="Change language">
            <Globe2 className="h-4 w-4" /> <span>{lang === "MM" ? "MM" : "EN"}</span>
          </button>
          {account ? (
            <button type="button" className="bas-intro-account-chip" onClick={() => enterStudio(account)}>
              <CheckCircle2 className="h-4 w-4" /> {signedInLabel}
            </button>
          ) : (
            <>
              <button type="button" className="bas-intro-signin" onClick={() => openAuth("signin")}>{t.signIn}</button>
              <button type="button" className="bas-intro-signup" onClick={() => openAuth("signup")}>{t.create}</button>
            </>
          )}
        </div>
      </header>

      <div className="bas-intro-content">
        <p className="bas-intro-eyebrow"><Sparkles className="h-4 w-4" /> {t.eyebrow}</p>
        <h1><span>{t.title1}</span><em>{t.title2}</em></h1>
        <p className="bas-intro-desc">{t.desc}</p>

        <div className="bas-intro-cta-row">
          <button type="button" className="bas-intro-enter" onClick={() => enterStudio(account)}>
            {t.enter} <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <p className="bas-intro-guest-note">{t.guestNote}</p>
      </div>

      <div className="bas-intro-film-chip" aria-hidden="true"><Film className="h-4 w-4" /> ORIGINAL VISUALS</div>

      {authMode ? (
        <div className="bas-auth-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAuthMode(null);
        }}>
          <div className="bas-auth-card" role="dialog" aria-modal="true" aria-label={authMode === "signin" ? t.authSignInTitle : t.authSignUpTitle}>
            <button type="button" className="bas-auth-close" onClick={() => setAuthMode(null)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>

            <div className="bas-auth-mark"><Sparkles className="h-5 w-5" /></div>
            <p className="bas-auth-kicker">BURMA AI STUDIO ACCOUNT</p>
            <h2>{authMode === "signin" ? t.authSignInTitle : t.authSignUpTitle}</h2>
            <p className="bas-auth-copy">{authMode === "signin" ? t.authSignInCopy : t.authSignUpCopy}</p>

            <form onSubmit={submitAuth} className="bas-auth-form">
              {authMode === "signup" ? (
                <label>
                  <span>{t.name}</span>
                  <div className="bas-auth-input"><UserRound className="h-4 w-4" /><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={80} /></div>
                </label>
              ) : null}

              <label>
                <span>{t.email}</span>
                <div className="bas-auth-input"><Mail className="h-4 w-4" /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></div>
              </label>

              <label>
                <span>{t.password}</span>
                <div className="bas-auth-input">
                  <LockKeyhole className="h-4 w-4" />
                  <input type={showPassword ? "text" : "password"} autoComplete={authMode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} maxLength={128} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {authMode === "signup" ? <small>{t.passwordHint}</small> : null}
              </label>

              {error ? <p className="bas-auth-error">{error}</p> : null}
              {message ? <p className="bas-auth-success">{message}</p> : null}

              <button type="submit" className="bas-auth-submit" disabled={submitting}>
                {submitting ? t.working : authMode === "signin" ? t.submitSignIn : t.submitSignUp}
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <button type="button" className="bas-auth-switch" onClick={() => openAuth(authMode === "signin" ? "signup" : "signin")}>
              {authMode === "signin" ? t.switchToSignUp : t.switchToSignIn}
            </button>

            <p className="bas-auth-legal">{t.legal} <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
