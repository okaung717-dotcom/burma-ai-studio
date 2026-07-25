"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Globe2,
  LogOut,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageContext";

type PanelView = "menu" | "upgrade" | "profile" | "projects" | "personalization" | "help" | "privacy";

type LocalProfile = {
  displayName: string;
  email: string;
  company: string;
};

const PROFILE_STORAGE_KEY = "bas_website_profile";

const copy = {
  EN: {
    workspace: "Burma AI Studio Workspace",
    guest: "Guest access · Website",
    upgrade: "Upgrade plan",
    upgradeHint: "Premium service access",
    profile: "Profile",
    profileHint: "Name, email and company",
    projects: "Project Center",
    projectsHint: "Portfolio and new project request",
    personalization: "Personalization",
    personalizationHint: "Theme and language",
    help: "Help & Support",
    helpHint: "Get help or contact the studio",
    privacy: "Privacy & Security",
    privacyHint: "Policies and data choices",
    logout: "Log out",
    logoutHint: "Clear this browser profile session",
    currentAccess: "Current access",
    guestAccess: "Guest website access",
    billingNote: "Online billing is not enabled yet. Upgrade requests are handled directly by Burma AI Studio so the correct production package can be matched to your project.",
    requestUpgrade: "Request an upgrade",
    back: "Back",
    displayName: "Display name",
    email: "Email",
    company: "Company / brand",
    saveProfile: "Save profile",
    savedBrowser: "Saved on this browser only",
    portfolio: "View portfolio",
    startProject: "Start a project",
    projectNote: "Use Project Center to review Burma AI Studio work or open a new production request.",
    theme: "Appearance",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    myanmar: "Myanmar",
    contactStudio: "Contact Burma AI Studio",
    projectPolicy: "Project policy",
    privacyPolicy: "Privacy policy",
    helpNote: "For project, delivery, revision or service questions, contact the studio directly from the website.",
    privacyNote: "Review how project information, website data and privacy choices are handled.",
    privacyChoices: "Privacy choices",
    sessionCleared: "Website profile session cleared",
    profileSaved: "Profile saved",
  },
  MM: {
    workspace: "Burma AI Studio Workspace",
    guest: "Guest access · Website",
    upgrade: "Plan မြှင့်ရန်",
    upgradeHint: "Premium service access",
    profile: "Profile",
    profileHint: "အမည်၊ Email နဲ့ Company",
    projects: "Project Center",
    projectsHint: "Portfolio နဲ့ Project အသစ်တင်ရန်",
    personalization: "Personalization",
    personalizationHint: "Theme နဲ့ Language",
    help: "Help & Support",
    helpHint: "အကူအညီယူရန် / Studio ကိုဆက်သွယ်ရန်",
    privacy: "Privacy & Security",
    privacyHint: "Policy နဲ့ Data choices",
    logout: "Log out",
    logoutHint: "ဒီ Browser ရဲ့ Profile session ကိုရှင်းမယ်",
    currentAccess: "လက်ရှိ Access",
    guestAccess: "Guest website access",
    billingNote: "Online billing စနစ်ကို Website မှာ မဖွင့်ရသေးပါဘူး။ သင့် Project နဲ့ကိုက်ညီတဲ့ production package ကိုရွေးပေးနိုင်ဖို့ Upgrade request ကို Burma AI Studio နဲ့ တိုက်ရိုက်ဆက်သွယ်စနစ်နဲ့ထားပါတယ်။",
    requestUpgrade: "Upgrade တောင်းဆိုရန်",
    back: "နောက်သို့",
    displayName: "Display name",
    email: "Email",
    company: "Company / Brand",
    saveProfile: "Profile သိမ်းရန်",
    savedBrowser: "ဒီ Browser ထဲမှာပဲ သိမ်းထားမယ်",
    portfolio: "Portfolio ကြည့်ရန်",
    startProject: "Project စတင်ရန်",
    projectNote: "Burma AI Studio ရဲ့လက်ရာတွေကြည့်ရန် သို့မဟုတ် Production request အသစ်တင်ရန် Project Center ကိုသုံးနိုင်ပါတယ်။",
    theme: "Appearance",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    myanmar: "Myanmar",
    contactStudio: "Burma AI Studio ကိုဆက်သွယ်ရန်",
    projectPolicy: "Project policy",
    privacyPolicy: "Privacy policy",
    helpNote: "Project, delivery, revision သို့မဟုတ် service မေးခွန်းတွေရှိရင် Website ကနေ Studio ကို တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်။",
    privacyNote: "Project information, Website data နဲ့ privacy choices တွေကို ဘယ်လိုစီမံထားလဲ စစ်ဆေးနိုင်ပါတယ်။",
    privacyChoices: "Privacy choices",
    sessionCleared: "Website profile session ကိုရှင်းပြီးပါပြီ",
    profileSaved: "Profile သိမ်းပြီးပါပြီ",
  },
} as const;

function MenuRow({
  icon,
  title,
  hint,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200 hover:-translate-y-px hover:bg-white/80 hover:shadow-[0_10px_28px_rgba(26,11,14,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9537]/60 dark:hover:bg-white/[0.07] ${
        danger ? "text-[#a51e2b] dark:text-[#ffb9b9]" : "text-[#241317] dark:text-[#fff7eb]"
      }`}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${danger ? "border-[#a51e2b]/20 bg-[#a51e2b]/5" : "border-[#be9537]/20 bg-[#be9537]/[0.07]"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-black leading-tight">{title}</span>
        <span className="mt-1 block truncate text-[11px] font-semibold text-[#816f62] dark:text-[#cbb9a9]">{hint}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
    </button>
  );
}

function ActionButton({ children, onClick, secondary = false }: { children: React.ReactNode; onClick: () => void; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={secondary
        ? "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#be9537]/30 bg-white/65 px-4 text-sm font-black text-[#6d4e2e] transition hover:-translate-y-px hover:bg-white dark:bg-white/5 dark:text-[#f3d88c]"
        : "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#911923] px-4 text-sm font-black text-white shadow-lg shadow-[#911923]/20 transition hover:-translate-y-px hover:bg-[#7d1420] dark:bg-[#e3bc61] dark:text-[#100708] dark:hover:bg-[#f0ca71]"}
    >
      {children}
    </button>
  );
}

export default function WebsiteNavbarProfile() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>("menu");
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState<LocalProfile>({ displayName: "Burma AI Studio Client", email: "", company: "" });
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const t = copy[lang === "MM" ? "MM" : "EN"];

  const initials = useMemo(() => {
    const parts = profile.displayName.trim().split(/\s+/).filter(Boolean);
    const value = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
    return value || "BA";
  }, [profile.displayName]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<LocalProfile>;
        setProfile({
          displayName: typeof parsed.displayName === "string" && parsed.displayName.trim() ? parsed.displayName : "Burma AI Studio Client",
          email: typeof parsed.email === "string" ? parsed.email : "",
          company: typeof parsed.company === "string" ? parsed.company : "",
        });
      }
    } catch {
      // Keep the safe local defaults when stored browser data is malformed.
    }
  }, []);

  useEffect(() => {
    const attach = () => {
      if (window.innerWidth < 1024 || document.body.classList.contains("bas-app-mode")) return;

      const link = document.querySelector<HTMLAnchorElement>(
        'body:not(.bas-app-mode) > nav a[href="/contact"].hidden.md\\:inline-flex, body:not(.bas-app-mode) > nav a.bas-navbar-profile'
      );
      if (!link || link.dataset.profileReady === "1") return;

      link.dataset.profileReady = "1";
      link.classList.add("bas-navbar-profile");
      link.setAttribute("href", "#profile");
      link.setAttribute("role", "button");
      link.setAttribute("aria-label", "Open profile menu");
      link.setAttribute("aria-haspopup", "dialog");
      link.setAttribute("aria-controls", "bas-profile-menu");
      link.setAttribute("title", "Profile");

      const activate = (event: Event) => {
        event.preventDefault();
        setView("menu");
        setOpen((value) => !value);
      };

      link.addEventListener("click", activate);
      return () => link.removeEventListener("click", activate);
    };

    let cleanup = attach();
    const timer = window.setInterval(() => {
      if (!cleanup) cleanup = attach();
    }, 500);

    const onResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cleanup?.();
      window.clearInterval(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const link = document.querySelector<HTMLAnchorElement>('body:not(.bas-app-mode) > nav a.bas-navbar-profile');
    link?.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setView("menu");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setView("menu");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const navigate = (href: string) => {
    setOpen(false);
    setView("menu");
    router.push(href);
  };

  const saveProfile = () => {
    const safeProfile: LocalProfile = {
      displayName: profile.displayName.trim() || "Burma AI Studio Client",
      email: profile.email.trim(),
      company: profile.company.trim(),
    };
    setProfile(safeProfile);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(safeProfile));
    showToast(t.profileSaved);
  };

  const logOut = () => {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfile({ displayName: "Burma AI Studio Client", email: "", company: "" });
    setOpen(false);
    setView("menu");
    showToast(t.sessionCleared);
    router.push("/");
  };

  const panelHeader = (title: string) => (
    <div className="flex items-center gap-3 border-b border-[#be9537]/15 px-4 pb-3 pt-1 dark:border-white/10">
      <button
        type="button"
        onClick={() => setView("menu")}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#be9537]/20 bg-white/65 text-[#7b572e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be9537]/50 dark:bg-white/5 dark:text-[#f0ce78]"
        aria-label={t.back}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <p className="min-w-0 flex-1 truncate text-base font-black">{title}</p>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#806c5d] transition hover:bg-black/5 dark:text-[#d7c5b5] dark:hover:bg-white/5"
        aria-label="Close profile menu"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      {toast ? (
        <div className="fixed right-8 top-5 z-[10020] hidden items-center gap-2 rounded-2xl border border-[#be9537]/30 bg-[#fffaf1]/95 px-4 py-3 text-sm font-black text-[#442e22] shadow-[0_14px_42px_rgba(26,11,14,0.18)] backdrop-blur-2xl dark:bg-[#1a0b0e]/95 dark:text-[#fff7eb] lg:flex">
          <Check className="h-4 w-4 text-[#911923] dark:text-[#e3bc61]" /> {toast}
        </div>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close profile menu"
            className="fixed inset-0 z-[9997] hidden bg-black/[0.06] backdrop-blur-[1px] lg:block"
            onClick={() => {
              setOpen(false);
              setView("menu");
            }}
          />

          <section
            id="bas-profile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Burma AI Studio profile menu"
            className="fixed right-8 top-[8.6rem] z-[9998] hidden max-h-[calc(100vh-10rem)] w-[24rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[1.9rem] border border-[#be9537]/30 bg-[#fffaf1]/95 p-3 text-[#1a0b0e] shadow-[0_28px_90px_rgba(26,11,14,0.30)] backdrop-blur-2xl dark:border-[#e3bc61]/20 dark:bg-[#160b0d]/96 dark:text-[#fff7eb] lg:block"
          >
            {view === "menu" ? (
              <>
                <div className="flex items-center gap-3 px-3 pb-3 pt-2">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e3bc61] to-[#be9537] text-sm font-black text-[#241317] shadow-[0_8px_24px_rgba(190,149,55,0.28)]">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-black leading-tight">{profile.displayName || t.workspace}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-[#8a7667] dark:text-[#cab7a7]">{profile.company || t.guest}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#806c5d] transition hover:bg-black/5 dark:text-[#d7c5b5] dark:hover:bg-white/5"
                    aria-label="Close profile menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-px bg-[#be9537]/20 dark:bg-white/10" />
                <div className="space-y-0.5 py-2">
                  <MenuRow icon={<Sparkles className="h-5 w-5" />} title={t.upgrade} hint={t.upgradeHint} onClick={() => setView("upgrade")} />
                  <MenuRow icon={<UserRound className="h-5 w-5" />} title={t.profile} hint={t.profileHint} onClick={() => setView("profile")} />
                  <MenuRow icon={<BriefcaseBusiness className="h-5 w-5" />} title={t.projects} hint={t.projectsHint} onClick={() => setView("projects")} />
                  <MenuRow icon={<Palette className="h-5 w-5" />} title={t.personalization} hint={t.personalizationHint} onClick={() => setView("personalization")} />
                </div>

                <div className="h-px bg-[#be9537]/20 dark:bg-white/10" />
                <div className="space-y-0.5 py-2">
                  <MenuRow icon={<CircleHelp className="h-5 w-5" />} title={t.help} hint={t.helpHint} onClick={() => setView("help")} />
                  <MenuRow icon={<ShieldCheck className="h-5 w-5" />} title={t.privacy} hint={t.privacyHint} onClick={() => setView("privacy")} />
                </div>

                <div className="h-px bg-[#be9537]/20 dark:bg-white/10" />
                <div className="pt-2">
                  <MenuRow icon={<LogOut className="h-5 w-5" />} title={t.logout} hint={t.logoutHint} danger onClick={logOut} />
                </div>
              </>
            ) : null}

            {view === "upgrade" ? (
              <div>
                {panelHeader(t.upgrade)}
                <div className="space-y-4 p-4">
                  <div className="rounded-2xl border border-[#be9537]/25 bg-gradient-to-br from-[#be9537]/10 to-[#911923]/5 p-4 dark:from-[#e3bc61]/10 dark:to-[#911923]/15">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a47b28]">{t.currentAccess}</p>
                    <p className="mt-2 text-lg font-black">{t.guestAccess}</p>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-[#715f53] dark:text-[#d8c7b8]">{t.billingNote}</p>
                  <ActionButton onClick={() => navigate("/contact?intent=upgrade")}> <Sparkles className="h-4 w-4" /> {t.requestUpgrade}</ActionButton>
                </div>
              </div>
            ) : null}

            {view === "profile" ? (
              <div>
                {panelHeader(t.profile)}
                <div className="space-y-4 p-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#be9537]/20 bg-white/55 p-3 dark:bg-white/5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#e3bc61] to-[#be9537] text-sm font-black text-[#241317]">{initials}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">{profile.displayName || t.workspace}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#8a7667] dark:text-[#cbb9a9]">{t.savedBrowser}</p>
                    </div>
                  </div>
                  <label className="block text-xs font-black text-[#6f5948] dark:text-[#e7d4c2]">
                    {t.displayName}
                    <input value={profile.displayName} onChange={(event) => setProfile((value) => ({ ...value, displayName: event.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-[#be9537]/25 bg-white/75 px-3 text-sm font-bold text-[#241317] outline-none transition focus:border-[#be9537]/70 focus:ring-2 focus:ring-[#be9537]/15 dark:bg-white/5 dark:text-[#fff7eb]" />
                  </label>
                  <label className="block text-xs font-black text-[#6f5948] dark:text-[#e7d4c2]">
                    {t.email}
                    <input type="email" value={profile.email} onChange={(event) => setProfile((value) => ({ ...value, email: event.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-[#be9537]/25 bg-white/75 px-3 text-sm font-bold text-[#241317] outline-none transition focus:border-[#be9537]/70 focus:ring-2 focus:ring-[#be9537]/15 dark:bg-white/5 dark:text-[#fff7eb]" />
                  </label>
                  <label className="block text-xs font-black text-[#6f5948] dark:text-[#e7d4c2]">
                    {t.company}
                    <input value={profile.company} onChange={(event) => setProfile((value) => ({ ...value, company: event.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-[#be9537]/25 bg-white/75 px-3 text-sm font-bold text-[#241317] outline-none transition focus:border-[#be9537]/70 focus:ring-2 focus:ring-[#be9537]/15 dark:bg-white/5 dark:text-[#fff7eb]" />
                  </label>
                  <ActionButton onClick={saveProfile}><Save className="h-4 w-4" /> {t.saveProfile}</ActionButton>
                </div>
              </div>
            ) : null}

            {view === "projects" ? (
              <div>
                {panelHeader(t.projects)}
                <div className="space-y-4 p-4">
                  <p className="text-sm font-semibold leading-6 text-[#715f53] dark:text-[#d8c7b8]">{t.projectNote}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton secondary onClick={() => navigate("/portfolio")}><ExternalLink className="h-4 w-4" /> {t.portfolio}</ActionButton>
                    <ActionButton onClick={() => navigate("/contact?intent=project")}><BriefcaseBusiness className="h-4 w-4" /> {t.startProject}</ActionButton>
                  </div>
                </div>
              </div>
            ) : null}

            {view === "personalization" ? (
              <div>
                {panelHeader(t.personalization)}
                <div className="space-y-5 p-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#8a6a32] dark:text-[#e2c375]">{t.theme}</p>
                    <button type="button" onClick={toggleTheme} className="flex w-full items-center justify-between rounded-2xl border border-[#be9537]/20 bg-white/60 px-4 py-3 text-left transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/[0.08]">
                      <span className="flex items-center gap-3 text-sm font-black">{theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} {theme === "dark" ? t.dark : t.light}</span>
                      <span className="text-[11px] font-black text-[#9a7d54]">{theme === "dark" ? t.light : t.dark} →</span>
                    </button>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#8a6a32] dark:text-[#e2c375]">{t.language}</p>
                    <button type="button" onClick={toggleLang} className="flex w-full items-center justify-between rounded-2xl border border-[#be9537]/20 bg-white/60 px-4 py-3 text-left transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/[0.08]">
                      <span className="flex items-center gap-3 text-sm font-black"><Globe2 className="h-5 w-5" /> {lang === "MM" ? t.myanmar : t.english}</span>
                      <span className="text-[11px] font-black text-[#9a7d54]">{lang === "MM" ? "EN" : "MM"} →</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {view === "help" ? (
              <div>
                {panelHeader(t.help)}
                <div className="space-y-4 p-4">
                  <p className="text-sm font-semibold leading-6 text-[#715f53] dark:text-[#d8c7b8]">{t.helpNote}</p>
                  <div className="space-y-2">
                    <MenuRow icon={<CircleHelp className="h-5 w-5" />} title={t.contactStudio} hint={t.helpHint} onClick={() => navigate("/contact?intent=support")} />
                    <MenuRow icon={<ShieldCheck className="h-5 w-5" />} title={t.projectPolicy} hint="Terms, revisions and project workflow" onClick={() => navigate("/project-policy")} />
                  </div>
                </div>
              </div>
            ) : null}

            {view === "privacy" ? (
              <div>
                {panelHeader(t.privacy)}
                <div className="space-y-4 p-4">
                  <p className="text-sm font-semibold leading-6 text-[#715f53] dark:text-[#d8c7b8]">{t.privacyNote}</p>
                  <div className="space-y-2">
                    <MenuRow icon={<ShieldCheck className="h-5 w-5" />} title={t.privacyPolicy} hint="Privacy and website data" onClick={() => navigate("/privacy")} />
                    <MenuRow icon={<Globe2 className="h-5 w-5" />} title={t.privacyChoices} hint="Manage website privacy choices" onClick={() => navigate("/privacy-choices")} />
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : null}
    </>
  );
}
