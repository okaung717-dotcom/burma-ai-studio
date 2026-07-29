"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
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
import "./website-intro-home-transition.css";

const PROFILE_STORAGE_KEY = "bas_website_profile";
const INTRO_UI_REVEAL_MS = 2800;
const ENTRY_TRANSITION_MS = 1480;
const HOME_REVEAL_START_MS = 650;
const HOME_REVEAL_CLEANUP_MS = 2300;
const ACCOUNT_GATE_EXEMPT_PATHS = [
  "/legal",
  "/privacy",
  "/terms",
  "/project-policy",
  "/ai-ip-policy",
  "/acceptable-use",
  "/copyright",
  "/privacy-choices",
  "/admin",
  "/admin6996",
];

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
    create: "Create account",
    signIn: "Sign in",
    authSignInTitle: "Welcome back.",
    authSignInCopy: "Sign in with your Burma AI Studio account to continue.",
    authSignUpTitle: "Create your studio account.",
    authSignUpCopy: "Create an account to enter Burma AI Studio. Your secure session will keep returning visits fast and seamless.",
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
    accountReady: "Account verified. Entering the studio…",
    legal: "By continuing, you agree to our Terms and Privacy Policy.",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO · CINEMATIC AI PRODUCTION",
    title1: "Brand ကို ပိုထင်ရှားစေမယ့်",
    title2: "AI Marketing Visuals.",
    desc: "Premium AI Film, Cinematic Campaign နဲ့ Original Stories တွေကို Human Creative Direction နဲ့ပေါင်းစပ်ပြီး Brand ကို ပိုထင်ရှားအောင်ဖန်တီးပေးပါတယ်။",
    create: "Account ဖွင့်ရန်",
    signIn: "Sign in",
    authSignInTitle: "ပြန်လည်ကြိုဆိုပါတယ်။",
    authSignInCopy: "Burma AI Studio Account နဲ့ Website ကို ဆက်သုံးဖို့ Sign in ဝင်ပါ။",
    authSignUpTitle: "Studio Account ဖွင့်ပါ။",
    authSignUpCopy: "Burma AI Studio Website ထဲဝင်ရန် Account ဖွင့်ပါ။ Secure session ကြောင့် နောက်တစ်ခါပြန်ဝင်တဲ့အခါ ပိုမြန်ပြီး တိုက်ရိုက်အသုံးပြုနိုင်ပါတယ်။",
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
    accountReady: "Account အတည်ပြုပြီးပါပြီ။ Studio ထဲဝင်နေပါတယ်…",
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

function isAccountGateExempt(pathname: string) {
  return ACCOUNT_GATE_EXEMPT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isMyanmar = lang === "MM";
  const gateExempt = isAccountGateExempt(pathname);

  useEffect(() => {
    if (isAccountGateExempt(pathname) || isAppExperience()) {
      setVisible(false);
      return;
    }

    let cancelled = false;

    fetch("/api/account/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean; user?: AccountUser }) => {
        if (cancelled) return;

        if (data.authenticated && data.user) {
          document.documentElement.classList.add("bas-intro-skip");
          document.body.classList.remove("bas-intro-transitioning", "bas-home-arriving");
          setVisible(false);
          return;
        }

        // Fail closed: every unauthenticated public-site visitor stays behind the account gate.
        document.documentElement.classList.remove("bas-intro-skip");
        setVisible(true);
      })
      .catch(() => {
        if (cancelled) return;
        document.documentElement.classList.remove("bas-intro-skip");
        setVisible(true);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!visible || gateExempt) {
      setUiReady(false);
      return;
    }

    setUiReady(false);
    const revealTimer = window.setTimeout(() => setUiReady(true), INTRO_UI_REVEAL_MS);
    return () => window.clearTimeout(revealTimer);
  }, [visible, gateExempt]);

  useEffect(() => {
    if (!visible || gateExempt) return;
    document.body.classList.add("bas-intro-open");
    return () => document.body.classList.remove("bas-intro-open");
  }, [visible, gateExempt]);

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
      // Authentication remains valid even when local profile storage is unavailable.
    }
  };

  const finishAuthenticatedEntry = (user: AccountUser) => {
    if (!user || leaving) return;

    persistProfile(user);

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    const transitionDuration = reduceMotion ? 180 : ENTRY_TRANSITION_MS;
    const homeRevealDelay = reduceMotion ? 0 : HOME_REVEAL_START_MS;
    const cleanupDelay = reduceMotion ? 260 : HOME_REVEAL_CLEANUP_MS;

    setLeaving(true);
    document.body.classList.add("bas-intro-transitioning");

    window.setTimeout(() => {
      document.body.classList.add("bas-home-arriving");
    }, homeRevealDelay);

    window.setTimeout(() => {
      document.documentElement.classList.add("bas-intro-skip");
      setVisible(false);
      setLeaving(false);
      setAuthMode(null);
    }, transitionDuration);

    window.setTimeout(() => {
      document.body.classList.remove("bas-intro-transitioning", "bas-home-arriving");
    }, cleanupDelay);
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

    const submittingMode = authMode;
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const endpoint = submittingMode === "signin" ? "/api/account/sign-in" : "/api/account/sign-up";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittingMode === "signin" ? { email, password } : { name, email, password }),
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

      const authenticated = submittingMode === "signin" || data.authenticated === true;
      if (authenticated && data.user) {
        setMessage(t.accountReady);
        window.setTimeout(() => finishAuthenticatedEntry(data.user || null), 420);
        return;
      }

      setError("Account verification was not completed. Please sign in to continue.");
    } catch {
      setError("Connection problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible || gateExempt) return null;

  return (
    <section
      className={`bas-intro${uiReady ? " is-ui-ready" : ""}${leaving ? " is-leaving" : ""}${isMyanmar ? " is-mm" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Burma AI Studio account introduction"
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

      <div className="bas-intro-exit-transition" aria-hidden="true">
        <span className="bas-intro-exit-panel is-left" />
        <span className="bas-intro-exit-panel is-right" />
        <span className="bas-intro-exit-beam" />
        <span className="bas-intro-exit-flare" />
        <span className="bas-intro-exit-orbit">BA</span>
      </div>

      <header className="bas-intro-header">
        <div className="bas-intro-brand bas-intro-brand-static" aria-label="Burma AI Studio">
          <span className="bas-intro-brand-mark">BA</span>
          <span><b>Burma AI Studio</b><small>Cinematic AI Production</small></span>
        </div>

        <div className="bas-intro-header-actions">
          <button type="button" className="bas-intro-icon-button" onClick={toggleLang} aria-label="Change language">
            <Globe2 className="h-4 w-4" /> <span>{lang === "MM" ? "MM" : "EN"}</span>
          </button>
          <button type="button" className="bas-intro-signin" onClick={() => openAuth("signin")}>{t.signIn}</button>
          <button type="button" className="bas-intro-signup" onClick={() => openAuth("signup")}>{t.create}</button>
        </div>
      </header>

      <div className="bas-intro-content">
        <p className="bas-intro-eyebrow"><Sparkles className="h-4 w-4" /> {t.eyebrow}</p>
        <h1><span>{t.title1}</span><em>{t.title2}</em></h1>
        <p className="bas-intro-desc">{t.desc}</p>
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
