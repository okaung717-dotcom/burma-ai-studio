"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp,
  Clapperboard, CreditCard, Crown, FolderHeart, Globe2, Heart, ImageIcon, Info,
  KeyRound, Languages, Layers3, LockKeyhole, LogOut, Mail, Palette,
  ReceiptText, Settings2, ShieldCheck, Sparkles, UserRound, Wallet,
} from "lucide-react";
import "./settings-studio.css";

type SettingsSection = "account" | "billing" | "credits" | "preferences" | "security" | "creator" | "collections";
type AccountRole = "admin" | "member";
type SettingsUser = { displayName: string; email: string; role: AccountRole };
type NavItem = { id: SettingsSection; label: string; Icon: typeof UserRound; subtitle: string };

const navigation: { heading: string; items: NavItem[] }[] = [
  { heading: "ACCOUNT", items: [
    { id: "account", label: "My profile", Icon: UserRound, subtitle: "Account overview" },
    { id: "billing", label: "Plan & billing", Icon: CreditCard, subtitle: "Subscription details" },
    { id: "credits", label: "Credit usage", Icon: Activity, subtitle: "Usage overview" },
  ] },
  { heading: "PREFERENCES", items: [
    { id: "preferences", label: "Settings", Icon: Settings2, subtitle: "Appearance & language" },
    { id: "security", label: "Security", Icon: ShieldCheck, subtitle: "Account access" },
  ] },
  { heading: "CREATIVE WORKSPACE", items: [
    { id: "creator", label: "Creator profile", Icon: Sparkles, subtitle: "Creative identity" },
    { id: "collections", label: "My collections", Icon: FolderHeart, subtitle: "Your media library" },
  ] },
];

const titleMap: Record<SettingsSection, { title: string; kicker: string; sub: string }> = {
  account: { title: "Account overview", kicker: "YOUR ACCOUNT", sub: "A clear view of your creative workspace and account identity." },
  billing: { title: "Plan & billing", kicker: "SUBSCRIPTION", sub: "Membership and payment details in one place." },
  credits: { title: "Credit usage", kicker: "USAGE", sub: "Understand how your creative generation credits are used." },
  preferences: { title: "Preferences", kicker: "WORKSPACE SETTINGS", sub: "Shape your interface and creative experience." },
  security: { title: "Security & access", kicker: "ACCOUNT PROTECTION", sub: "Your existing authentication and private workspace access." },
  creator: { title: "Creator profile", kicker: "CREATIVE IDENTITY", sub: "A future home for your portfolio and public-facing profile." },
  collections: { title: "My collections", kicker: "YOUR CREATIVE LIBRARY", sub: "Find the images, scenes and collections that matter." },
};

function formatRole(role: AccountRole) { return role === "admin" ? "Studio Owner / Admin" : "Studio Member"; }
function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map(value => value.slice(0, 1)).join("").toUpperCase() || "BA"; }

export default function SettingsStudio({ user }: { user: SettingsUser }) {
  const router = useRouter();
  const [active, setActive] = useState<SettingsSection>("account");
  const [language, setLanguage] = useState("en");
  const [appearance, setAppearance] = useState("light");
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const page = titleMap[active];
  const identity = user.displayName.trim() || "Studio account";
  const emailLabel = user.email || "Email not provided for this sign-in method";

  async function signOut() {
    if (signingOut) return;
    setSignOutError("");
    setSigningOut(true);
    try {
      const response = await fetch("/api/account/sign-out", { method: "POST" });
      if (!response.ok) {
        setSignOutError("Sign-out could not be confirmed. Please retry or use the existing sidebar Sign out control.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setSignOutError("Could not reach the sign-out service. Please check your connection and retry.");
    } finally { setSigningOut(false); }
  }

  return (
    <section className="settings-studio" aria-labelledby="settings-page-title">
      <aside className="settings-sidebar">
        <header className="settings-sidebar-head">
          <span>PERSONAL PROJECT <ArrowRight aria-hidden="true" /> ACCOUNT</span>
          <h1>Settings</h1>
          <p>Personal account · Studio preferences</p>
        </header>
        <div className="settings-side-scroll">
          <button type="button" className="settings-identity-card" onClick={() => setActive("account")} aria-label="Open account overview">
            <span className="settings-identity-avatar">{initials(identity)}</span>
            <span className="settings-identity-copy"><strong>{identity}</strong><small>{user.email || formatRole(user.role)}</small></span>
            <ChevronRight aria-hidden="true" />
          </button>
          {navigation.map(group => (
            <section className="settings-nav-group" key={group.heading} aria-label={group.heading}>
              <h2>{group.heading}</h2>
              {group.items.map(({ id, label, Icon, subtitle }) => (
                <button type="button" key={id} className={"settings-nav-item" + (active === id ? " active" : "")} onClick={() => setActive(id)} aria-current={active === id ? "page" : undefined} title={subtitle}>
                  <Icon aria-hidden="true" /><span>{label}</span><ChevronRight className="settings-nav-chevron" aria-hidden="true" />
                </button>
              ))}
            </section>
          ))}
          <div className="settings-side-status"><ShieldCheck /><div><b>Private Studio</b><span>Existing account authentication remains in place.</span></div></div>
        </div>
        <footer className="settings-side-footer">
          <button type="button" onClick={signOut} disabled={signingOut}><LogOut />{signingOut ? "Signing out…" : "Log out"}<ArrowRight /></button>
          {signOutError && <p role="alert">{signOutError}</p>}
          <span><Check /> UI design refresh · Existing access controls unchanged</span>
        </footer>
      </aside>

      <div className="settings-workspace">
        <header className="settings-topbar">
          <div className="settings-breadcrumb"><Settings2 /><span>Account</span><ChevronRight /><strong>{page.title}</strong></div>
          <div className="settings-topbar-right">
            <span className="settings-privacy"><LockKeyhole /> Private workspace</span>
            <span className="settings-topbar-avatar" aria-label={"Signed in as " + identity}>{initials(identity)}</span>
          </div>
        </header>
        <div className="settings-content">
          <div className="settings-title-row">
            <div><span className="settings-eyebrow">{page.kicker}</span><h2 id="settings-page-title">{page.title}</h2><p>{page.sub}</p></div>
            <span className="settings-session-pill"><Check /> Signed in</span>
          </div>

          {active === "account" && <>
            <section className="settings-profile-hero">
              <div className="settings-profile-hero-top"><div className="settings-big-avatar">{initials(identity)}</div><div><span>BURMA AI STUDIO MEMBER</span><h3>{identity}</h3><p>{emailLabel}</p></div><span className="settings-role-badge"><Crown /> {formatRole(user.role)}</span></div>
              <div className="settings-hero-meta">
                <span><ShieldCheck /> Protected account session</span>
                <span><Sparkles /> Private creative workspace</span>
              </div>
            </section>
            <div className="settings-overview-grid">
              <button type="button" onClick={() => setActive("billing")}><span><Wallet /></span><small>PLAN & BILLING</small><strong>View membership</strong><p>Subscription details and payment settings</p><ArrowRight /></button>
              <button type="button" onClick={() => setActive("credits")}><span><Activity /></span><small>CREDIT USAGE</small><strong>Usage details</strong><p>Credit balance requires provider integration</p><ArrowRight /></button>
              <button type="button" onClick={() => setActive("security")}><span><ShieldCheck /></span><small>SECURITY</small><strong>Account protection</strong><p>Access and sign-in information</p><ArrowRight /></button>
            </div>
            <section className="settings-surface-card">
              <div className="settings-card-heading"><div><span><UserRound /></span><div><h3>Personal information</h3><p>Your signed-in identity, shown securely.</p></div></div><span className="settings-static-pill">Read only</span></div>
              <div className="settings-detail-grid">
                <div><label>DISPLAY NAME</label><strong>{identity}</strong></div>
                <div><label>EMAIL ADDRESS</label><strong>{user.email || "Not supplied"}</strong></div>
                <div><label>ACCESS ROLE</label><strong>{formatRole(user.role)}</strong></div>
                <div><label>ACCOUNT TYPE</label><strong>Private workspace</strong></div>
              </div>
              <p className="settings-note"><Info /> Editing account details isn't part of this UI refresh. Your existing account data is unchanged.</p>
            </section>
          </>}

          {active === "billing" && <>
            <div className="settings-billing-hero"><div className="settings-billing-icon"><Crown /></div><div><span>BURMA AI STUDIO</span><h3>Membership & billing</h3><p>Plan upgrades and payment management are not connected in this design preview.</p></div><span className="settings-static-pill">Unavailable</span></div>
            <div className="settings-dual-grid">
              <section className="settings-surface-card"><div className="settings-card-heading"><div><span><CreditCard /></span><div><h3>Current plan</h3><p>Subscription information</p></div></div></div><div className="settings-metric-placeholder"><span>PLAN STATUS</span><strong>Not connected</strong><p>No paid tier is inferred from your sign-in status.</p></div></section>
              <section className="settings-surface-card"><div className="settings-card-heading"><div><span><ReceiptText /></span><div><h3>Payment & invoices</h3><p>Billing history</p></div></div></div><div className="settings-metric-placeholder"><span>PAYMENT METHOD</span><strong>Unavailable</strong><p>No payment card or invoice data is loaded.</p></div></section>
            </div>
            <p className="settings-wide-note"><LockKeyhole /> This screen is a visual layout only. It does not charge, upgrade, cancel or access a payment provider.</p>
          </>}

          {active === "credits" && <>
            <section className="settings-surface-card settings-credit-card">
              <div className="settings-card-heading"><div><span><Activity /></span><div><h3>Generation credits</h3><p>Usage and credit balance</p></div></div><span className="settings-static-pill">Not connected</span></div>
              <div className="settings-credit-metrics">
                <div><span>AVAILABLE CREDITS</span><strong>—</strong><small>Not available</small></div>
                <div><span>USED CREDITS</span><strong>—</strong><small>Not available</small></div>
                <div><span>RENEWAL</span><strong>—</strong><small>Not configured</small></div>
              </div>
              <div className="settings-credit-track"><div /></div>
              <p className="settings-note"><Info /> A real credit meter will require an authenticated usage service. No usage or balance is fabricated here.</p>
            </section>
            <div className="settings-overview-grid settings-credits-links">
              <Link href="/studio/image"><ImageIcon /><strong>Image Studio</strong><span>Open image workflow</span><ArrowRight /></Link>
              <Link href="/studio/video"><Clapperboard /><strong>Video Studio</strong><span>Open motion workflow</span><ArrowRight /></Link>
              <Link href="/studio/spaces"><Layers3 /><strong>Studio Canvas</strong><span>Open node workspace</span><ArrowRight /></Link>
            </div>
          </>}

          {active === "preferences" && <>
            <section className="settings-surface-card">
              <div className="settings-card-heading"><div><span><Languages /></span><div><h3>Language</h3><p>Choose a preferred interface language preview.</p></div></div></div>
              <div className="settings-pref-row"><div><strong>Display language</strong><p>Language choice is shown only in this page.</p></div><label className="settings-pref-select"><span className="sr-only">Display language</span><select aria-label="Display language" value={language} onChange={event => setLanguage(event.target.value)}><option value="en">English</option><option value="my">မြန်မာ (Burmese)</option></select><ChevronDown /></label></div>
              <p className="settings-note"><Info /> This selection is not saved, and it does not translate the rest of the application.</p>
            </section>
            <section className="settings-surface-card">
              <div className="settings-card-heading"><div><span><Palette /></span><div><h3>Appearance</h3><p>Current design system and theme preference preview.</p></div></div></div>
              <div className="settings-appearance-options" role="group" aria-label="Appearance preview"><button type="button" aria-pressed={appearance === "light"} className={appearance === "light" ? "active" : ""} onClick={() => setAppearance("light")}><span className="settings-theme-illustration light"><i /><i /></span><strong>Light</strong><small>{appearance === "light" ? "Selected" : "Preview"}</small></button><button type="button" aria-pressed={appearance === "dark"} className={appearance === "dark" ? "active" : ""} onClick={() => setAppearance("dark")}><span className="settings-theme-illustration dark"><i /><i /></span><strong>Dark</strong><small>{appearance === "dark" ? "Selected" : "Preview only"}</small></button></div>
              <p className="settings-note"><Info /> Appearance choices are visual previews only. The existing light theme remains active across Studio.</p>
            </section>
          </>}

          {active === "security" && <>
            <section className="settings-security-hero"><ShieldCheck /><div><span>ACCOUNT PROTECTION</span><h3>Your session is active</h3><p>Your identity is provided by the application's existing session verification. No authentication settings are changed on this page.</p></div></section>
            <div className="settings-dual-grid">
              <section className="settings-surface-card"><div className="settings-card-heading"><div><span><LockKeyhole /></span><div><h3>Sign-in access</h3><p>Current account</p></div></div></div><div className="settings-metric-placeholder"><span>ACCOUNT ROLE</span><strong>{formatRole(user.role)}</strong><p>Access is controlled by your existing authentication and membership rules.</p></div></section>
              <section className="settings-surface-card"><div className="settings-card-heading"><div><span><KeyRound /></span><div><h3>Password & sessions</h3><p>Existing security settings</p></div></div></div><div className="settings-metric-placeholder"><span>ACCOUNT SECURITY</span><strong>Managed by sign-in</strong><p>No password or secret is displayed here.</p></div></section>
            </div>
            <section className="settings-surface-card settings-signout-card"><div><LogOut /><div><h3>End your session</h3><p>Use the existing sign-out service to leave your private workspace.</p></div></div><button type="button" onClick={signOut} disabled={signingOut}>{signingOut ? "Signing out…" : "Log out"} <ArrowRight /></button></section>
            {signOutError && <p className="settings-wide-note" role="alert">{signOutError}</p>}
          </>}

          {active === "creator" && <>
            <section className="settings-coming-soon"><span><Sparkles /></span><small>CREATOR IDENTITY</small><h3>Your next creative chapter</h3><p>A future-ready layout for your creative profile, portfolio and public project identity. The account profile is private by default.</p><button type="button" onClick={() => setActive("account")}>View private profile <ArrowRight /></button></section>
            <p className="settings-wide-note"><Info /> No creator profile is published or shared by this interface.</p>
          </>}

          {active === "collections" && <>
            <section className="settings-coming-soon"><span><FolderHeart /></span><small>ORGANIZED WORKSPACE</small><h3>Your creative collection</h3><p>Find media and organize projects within your existing Assets Library. Collections here are not backed by a new service.</p><Link href="/studio/assets">Open Assets Library <ArrowRight /></Link></section>
            <div className="settings-dual-grid settings-library-shortcuts"><Link href="/studio/image"><ImageIcon /><span>Image Studio</span><ArrowRight /></Link><Link href="/studio/video"><Clapperboard /><span>Video Studio</span><ArrowRight /></Link></div>
          </>}

          <footer className="settings-content-footer"><span><ShieldCheck /> Your existing access, billing and media data are unchanged.</span><button type="button" onClick={() => setActive("security")}><CircleHelp /> Security information <ArrowRight /></button></footer>
        </div>
      </div>
    </section>
  );
}
