"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Globe2,
  LogOut,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeProvider";

const PROFILE_STORAGE_KEY = "bas_website_profile";
const COMPACT_BREAKPOINT = 1024;

type LocalProfile = {
  displayName: string;
  email: string;
  company: string;
};

const copy = {
  EN: {
    profile: "Profile",
    subtitle: "Account, appearance and project access",
    displayName: "Display name",
    email: "Email",
    company: "Company / brand",
    save: "Save profile",
    saved: "Profile saved",
    appearance: "Appearance",
    light: "Light mode",
    dark: "Dark mode",
    language: "Language",
    english: "English",
    myanmar: "Myanmar",
    projects: "Project Center",
    projectsHint: "View work or start a new project",
    privacy: "Privacy & Security",
    privacyHint: "Review policies and privacy choices",
    logout: "Log out",
    close: "Close profile",
  },
  MM: {
    profile: "Profile",
    subtitle: "Account၊ Theme နဲ့ Project Access",
    displayName: "Display name",
    email: "Email",
    company: "Company / Brand",
    save: "Profile သိမ်းရန်",
    saved: "Profile သိမ်းပြီးပါပြီ",
    appearance: "Theme",
    light: "Light Mode",
    dark: "Dark Mode",
    language: "Language",
    english: "English",
    myanmar: "မြန်မာ",
    projects: "Project Center",
    projectsHint: "လက်ရာများကြည့်ရန် / Project အသစ်စရန်",
    privacy: "Privacy & Security",
    privacyHint: "Policy နဲ့ Privacy Choices စစ်ရန်",
    logout: "Log out",
    close: "Profile ပိတ်ရန်",
  },
} as const;

function isCompactWebsite() {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < COMPACT_BREAKPOINT &&
    document.documentElement.classList.contains("bas-website-context") &&
    !document.body.classList.contains("bas-app-mode")
  );
}

export default function MobileWebsiteProfileBridge() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = copy[lang === "MM" ? "MM" : "EN"];

  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState<LocalProfile>({
    displayName: "Burma AI Studio Client",
    email: "",
    company: "",
  });

  const initials = useMemo(() => {
    const value = profile.displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    return value || "BA";
  }, [profile.displayName]);

  useEffect(() => {
    const sync = () => {
      const nextCompact = isCompactWebsite();
      setCompact(nextCompact);
      if (!nextCompact) setOpen(false);
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<LocalProfile>;
      setProfile({
        displayName:
          typeof parsed.displayName === "string" && parsed.displayName.trim()
            ? parsed.displayName
            : "Burma AI Studio Client",
        email: typeof parsed.email === "string" ? parsed.email : "",
        company: typeof parsed.company === "string" ? parsed.company : "",
      });
    } catch {
      // Keep safe defaults when browser storage is unavailable or malformed.
    }
  }, []);

  useEffect(() => {
    if (!compact) return;

    let activeTarget: HTMLAnchorElement | null = null;
    let activeHandler: ((event: Event) => void) | null = null;

    const detach = () => {
      if (activeTarget && activeHandler) activeTarget.removeEventListener("click", activeHandler);
      activeTarget = null;
      activeHandler = null;
    };

    const attach = () => {
      const drawer = document.querySelector<HTMLElement>(
        'body:not(.bas-app-mode) > nav div[class*="md:hidden"][class*="absolute"][class*="top-full"]'
      );
      if (!drawer) {
        detach();
        return;
      }

      const actions = drawer.querySelector<HTMLElement>(":scope > div:last-child");
      const candidate = actions?.querySelector<HTMLAnchorElement>('a[href="/contact"], a[href="#profile"]');
      if (!candidate) {
        detach();
        return;
      }

      if (!candidate.classList.contains("bas-mobile-profile-trigger")) {
        candidate.classList.add("bas-mobile-profile-trigger");
      }
      if (candidate.getAttribute("href") !== "#profile") candidate.setAttribute("href", "#profile");
      if (candidate.getAttribute("role") !== "button") candidate.setAttribute("role", "button");
      if (candidate.getAttribute("aria-haspopup") !== "dialog") candidate.setAttribute("aria-haspopup", "dialog");
      if (candidate.getAttribute("aria-controls") !== "bas-mobile-profile-panel") {
        candidate.setAttribute("aria-controls", "bas-mobile-profile-panel");
      }
      if (candidate.getAttribute("aria-label") !== t.profile) candidate.setAttribute("aria-label", t.profile);
      if ((candidate.textContent || "").trim() !== t.profile) candidate.textContent = t.profile;

      if (candidate === activeTarget) return;
      detach();

      const handler = (event: Event) => {
        event.preventDefault();
        const menuButton = document.querySelector<HTMLButtonElement>(
          'body:not(.bas-app-mode) > nav button[class*="md:hidden"]'
        );
        menuButton?.click();
        window.setTimeout(() => setOpen(true), 40);
      };

      candidate.addEventListener("click", handler);
      activeTarget = candidate;
      activeHandler = handler;
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      observer.disconnect();
      detach();
    };
  }, [compact, t.profile]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("bas-mobile-profile-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("bas-mobile-profile-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const safeProfile: LocalProfile = {
      displayName: profile.displayName.trim() || "Burma AI Studio Client",
      email: profile.email.trim(),
      company: profile.company.trim(),
    };

    setProfile(safeProfile);
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(safeProfile));
    } catch {
      // Saving the form UI must remain usable when local storage is restricted.
    }
    setToast(t.saved);
    window.setTimeout(() => setToast(""), 2200);
    window.setTimeout(() => setSaving(false), 180);
  };

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const signOut = async () => {
    try {
      await fetch("/api/account/sign-out", {
        method: "POST",
        cache: "no-store",
        credentials: "same-origin",
        keepalive: true,
      });
    } catch {
      // The secure account gate rechecks the server session after navigation.
    }

    try {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {
      // Storage restrictions must not block sign out.
    }

    document.documentElement.classList.remove("bas-intro-skip");
    document.body.classList.remove("bas-mobile-profile-open");
    window.location.replace("/");
  };

  if (!compact || !open) return null;

  return (
    <div className="bas-mobile-profile-layer">
      <button
        type="button"
        className="bas-mobile-profile-backdrop"
        aria-label={t.close}
        onClick={() => setOpen(false)}
      />

      <section
        id="bas-mobile-profile-panel"
        className="bas-mobile-profile-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.profile}
      >
        <header className="bas-mobile-profile-header">
          <div className="bas-mobile-profile-avatar" aria-hidden="true">{initials}</div>
          <div>
            <p>{t.profile}</p>
            <span>{t.subtitle}</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label={t.close}>
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="bas-mobile-profile-scroll">
          {toast ? (
            <div className="bas-mobile-profile-toast" role="status">
              <Check className="h-4 w-4" /> {toast}
            </div>
          ) : null}

          <form className="bas-mobile-profile-form" onSubmit={saveProfile}>
            <label>
              <span>{t.displayName}</span>
              <div><UserRound className="h-4 w-4" /><input value={profile.displayName} onChange={(event) => setProfile((value) => ({ ...value, displayName: event.target.value }))} maxLength={80} /></div>
            </label>
            <label>
              <span>{t.email}</span>
              <div><input type="email" value={profile.email} onChange={(event) => setProfile((value) => ({ ...value, email: event.target.value }))} maxLength={254} /></div>
            </label>
            <label>
              <span>{t.company}</span>
              <div><BriefcaseBusiness className="h-4 w-4" /><input value={profile.company} onChange={(event) => setProfile((value) => ({ ...value, company: event.target.value }))} maxLength={100} /></div>
            </label>
            <button type="submit" className="bas-mobile-profile-save" disabled={saving}>
              <Save className="h-4 w-4" /> {t.save}
            </button>
          </form>

          <div className="bas-mobile-profile-section">
            <p>{t.appearance}</p>
            <div className="bas-mobile-profile-two-column">
              <button type="button" onClick={toggleTheme}>
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span>{theme === "dark" ? t.dark : t.light}</span>
              </button>
              <button type="button" onClick={toggleLang}>
                <Globe2 className="h-5 w-5" />
                <span>{lang === "MM" ? t.myanmar : t.english}</span>
              </button>
            </div>
          </div>

          <div className="bas-mobile-profile-section bas-mobile-profile-links">
            <button type="button" onClick={() => navigate("/portfolio")}>
              <span><BriefcaseBusiness className="h-5 w-5" /><b>{t.projects}</b><small>{t.projectsHint}</small></span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate("/privacy-choices")}>
              <span><ShieldCheck className="h-5 w-5" /><b>{t.privacy}</b><small>{t.privacyHint}</small></span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button type="button" className="bas-mobile-profile-logout" onClick={signOut}>
            <LogOut className="h-4 w-4" /> {t.logout}
          </button>
        </div>
      </section>
    </div>
  );
}
