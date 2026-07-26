"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Film,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

const copy = {
  EN: {
    eyebrow: "BURMA AI STUDIO · STUDIO PLANS",
    title: "Choose the way you want to work with the studio.",
    subtitle:
      "Start with one campaign or build an ongoing creative partnership. Every plan is shaped around your brief, production needs and brand direction — without forcing you into a one-size-fits-all subscription.",
    publicAccess: "Website access stays free",
    publicAccessText: "Portfolio, Stories and public website features remain open to everyone.",
    plansEyebrow: "PRODUCTION OPTIONS",
    plansTitle: "Three clear ways to work together.",
    plansText:
      "Choose the level that matches how often you create and how closely you want Burma AI Studio involved in your brand.",
    recommended: "RECOMMENDED",
    customQuote: "Custom quote",
    projectBased: "Project-based",
    ongoing: "Ongoing production",
    partnership: "Custom partnership",
    projectStart: "Project Start",
    projectStartFor: "For one campaign, launch or focused video project.",
    projectStartFeatures: [
      "Creative direction built around your brief",
      "AI video production for one defined campaign",
      "Scope and timeline confirmed before production",
      "Direct studio communication from brief to delivery",
    ],
    projectStartCta: "Start a project",
    studioPro: "Studio Pro",
    studioProFor: "For creators and brands producing content regularly.",
    studioProFeatures: [
      "Ongoing production planning for repeat content",
      "Priority scheduling for returning projects",
      "More consistent visual direction across releases",
      "Faster repeat-project setup with an established creative direction",
    ],
    studioProCta: "Choose Studio Pro",
    brandPartner: "Brand Partner",
    brandPartnerFor: "For businesses and agencies managing multiple campaigns.",
    brandPartnerFeatures: [
      "Campaign-level creative partnership",
      "Multi-format production planning across projects",
      "Brand continuity from one release to the next",
      "Priority coordination with a custom production scope",
    ],
    brandPartnerCta: "Talk about a partnership",
    processEyebrow: "SIMPLE PROCESS",
    processTitle: "No automatic billing. No surprise scope.",
    step1: "Choose",
    step1Text: "Pick the plan that feels closest to your current production needs.",
    step2: "Brief",
    step2Text: "Tell us the campaign, platform, timeline and result you want.",
    step3: "Confirm",
    step3Text: "Burma AI Studio confirms the final scope, timeline and quote before work begins.",
    noteTitle: "Your plan starts only after you approve the project scope.",
    noteText:
      "The website does not charge you automatically. Final pricing depends on the production brief, complexity, length, revisions and delivery requirements.",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO · STUDIO PLANS",
    title: "သင့် Brand နဲ့ လိုက်ဖက်တဲ့ လက်တွဲပုံကို ရွေးပါ။",
    subtitle:
      "Campaign တစ်ခုတည်းကနေ ဆက်တိုက် Content Production အထိ သင့် Project အရွယ်အစား၊ လိုအပ်ချက်နဲ့ Brand direction အပေါ်မူတည်ပြီး Plan ကိုရွေးနိုင်ပါတယ်။ မလိုအပ်တဲ့ Subscription ပုံစံတစ်မျိုးတည်းကို အတင်းမသတ်မှတ်ထားပါဘူး။",
    publicAccess: "Website ကို လူတိုင်း အခမဲ့သုံးနိုင်သည်",
    publicAccessText: "Portfolio, Stories နဲ့ Public Website features တွေကို Plan မဝယ်ဘဲ ဆက်သုံးနိုင်ပါတယ်။",
    plansEyebrow: "PRODUCTION OPTIONS",
    plansTitle: "Burma AI Studio နဲ့ လက်တွဲဖို့ ရှင်းလင်းတဲ့ Plan သုံးမျိုး။",
    plansText:
      "Content ဘယ်လောက်မကြာခဏလုပ်မလဲ၊ Studio ကို Brand ရဲ့ Creative Partner အဖြစ် ဘယ်လောက်အထိ လက်တွဲချင်လဲဆိုတာအပေါ်မူတည်ပြီး ရွေးနိုင်ပါတယ်။",
    recommended: "အကြံပြုထားသည်",
    customQuote: "Project အလိုက် ဈေးနှုန်း",
    projectBased: "Project တစ်ခုချင်း",
    ongoing: "ဆက်တိုက် Production",
    partnership: "Custom Partnership",
    projectStart: "Project Start",
    projectStartFor: "Campaign တစ်ခု၊ Product launch တစ်ခု သို့မဟုတ် Video Project တစ်ခုအတွက်။",
    projectStartFeatures: [
      "သင့် Brief အပေါ်မူတည်တဲ့ Creative Direction",
      "သတ်မှတ်ထားတဲ့ Campaign တစ်ခုအတွက် AI Video Production",
      "Production မစခင် Scope နဲ့ Timeline ကိုအတည်ပြုမယ်",
      "Brief ကနေ Delivery အထိ Studio နဲ့ တိုက်ရိုက်ဆက်သွယ်နိုင်မယ်",
    ],
    projectStartCta: "Project စတင်ရန်",
    studioPro: "Studio Pro",
    studioProFor: "Content ကို ပုံမှန်ထုတ်လုပ်နေတဲ့ Creator နဲ့ Brand တွေအတွက်။",
    studioProFeatures: [
      "Repeat Content အတွက် ဆက်တိုက် Production Planning",
      "ပြန်လာတဲ့ Project တွေအတွက် Priority Scheduling",
      "Release တစ်ခုနဲ့တစ်ခုကြား Visual Direction ပိုတည်ငြိမ်မယ်",
      "Creative Direction သိပြီးသားဖြစ်လို့ နောက် Project တွေ Setup ပိုမြန်မယ်",
    ],
    studioProCta: "Studio Pro ရွေးရန်",
    brandPartner: "Brand Partner",
    brandPartnerFor: "Campaign မျိုးစုံလုပ်နေတဲ့ Business နဲ့ Agency တွေအတွက်။",
    brandPartnerFeatures: [
      "Campaign အဆင့် Creative Partnership",
      "Project မျိုးစုံအတွက် Multi-format Production Planning",
      "Release တစ်ခုကနေ နောက်တစ်ခုအထိ Brand Visual ပိုညီမယ်",
      "Custom Production Scope နဲ့ Priority Coordination",
    ],
    brandPartnerCta: "Partnership ဆွေးနွေးရန်",
    processEyebrow: "SIMPLE PROCESS",
    processTitle: "Auto Billing မရှိဘူး။ Scope မသေချာဘဲ အလုပ်မစဘူး။",
    step1: "Plan ရွေးမယ်",
    step1Text: "လက်ရှိ Production လိုအပ်ချက်နဲ့ အနီးစပ်ဆုံး Plan ကိုရွေးပါ။",
    step2: "Brief ပေးမယ်",
    step2Text: "Campaign, Platform, Timeline နဲ့ သင်လိုချင်တဲ့ Result ကိုပြောပါ။",
    step3: "အတည်ပြုမယ်",
    step3Text: "အလုပ်မစခင် Burma AI Studio က Final Scope, Timeline နဲ့ Quote ကို အတည်ပြုပေးမယ်။",
    noteTitle: "Project Scope ကို သင်အတည်ပြုပြီးမှ Plan စတင်မယ်။",
    noteText:
      "Website ကနေ Auto Charge မလုပ်ပါဘူး။ Final Pricing က Production brief, complexity, video length, revisions နဲ့ delivery requirements အပေါ်မူတည်ပါတယ်။",
  },
} as const;

type PlanCardProps = {
  icon: React.ReactNode;
  title: string;
  audience: string;
  label: string;
  price: string;
  features: readonly string[];
  cta: string;
  href: string;
  recommended?: boolean;
  recommendedLabel: string;
};

function PlanCard({
  icon,
  title,
  audience,
  label,
  price,
  features,
  cta,
  href,
  recommended = false,
  recommendedLabel,
}: PlanCardProps) {
  return (
    <article className={`bas-plan-card${recommended ? " is-recommended" : ""}`}>
      {recommended ? <span className="bas-plan-recommended">{recommendedLabel}</span> : null}
      <div className="bas-plan-card-top">
        <span className="bas-plan-icon" aria-hidden="true">{icon}</span>
        <span className="bas-plan-label">{label}</span>
      </div>
      <h3>{title}</h3>
      <p className="bas-plan-audience">{audience}</p>
      <p className="bas-plan-price">{price}</p>
      <div className="bas-plan-divider" />
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className="bas-plan-cta">
        {cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function PlansPageClient() {
  const { lang } = useLanguage();
  const isMyanmar = lang === "MM";
  const t = copy[isMyanmar ? "MM" : "EN"];

  return (
    <div className={`bas-plans-page${isMyanmar ? " is-mm" : ""}`}>
      <section className="bas-plans-hero" aria-labelledby="plans-title">
        <div className="bas-plans-hero-copy">
          <span className="bas-plans-kicker"><Sparkles className="h-4 w-4" /> {t.eyebrow}</span>
          <h1 id="plans-title">{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="bas-plans-access-note">
          <span className="bas-plans-access-icon"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <strong>{t.publicAccess}</strong>
            <p>{t.publicAccessText}</p>
          </div>
        </div>
      </section>

      <section className="bas-plans-section" aria-labelledby="plans-options-title">
        <div className="bas-plans-section-head">
          <span>{t.plansEyebrow}</span>
          <h2 id="plans-options-title">{t.plansTitle}</h2>
          <p>{t.plansText}</p>
        </div>

        <div className="bas-plans-grid">
          <PlanCard
            icon={<Film className="h-5 w-5" />}
            title={t.projectStart}
            audience={t.projectStartFor}
            label={t.projectBased}
            price={t.customQuote}
            features={t.projectStartFeatures}
            cta={t.projectStartCta}
            href="/contact?intent=plan&plan=project-start"
            recommendedLabel={t.recommended}
          />
          <PlanCard
            icon={<Zap className="h-5 w-5" />}
            title={t.studioPro}
            audience={t.studioProFor}
            label={t.ongoing}
            price={t.customQuote}
            features={t.studioProFeatures}
            cta={t.studioProCta}
            href="/contact?intent=plan&plan=studio-pro"
            recommended
            recommendedLabel={t.recommended}
          />
          <PlanCard
            icon={<Building2 className="h-5 w-5" />}
            title={t.brandPartner}
            audience={t.brandPartnerFor}
            label={t.partnership}
            price={t.customQuote}
            features={t.brandPartnerFeatures}
            cta={t.brandPartnerCta}
            href="/contact?intent=plan&plan=brand-partner"
            recommendedLabel={t.recommended}
          />
        </div>
      </section>

      <section className="bas-plans-process" aria-labelledby="plans-process-title">
        <div className="bas-plans-section-head bas-plans-section-head-compact">
          <span>{t.processEyebrow}</span>
          <h2 id="plans-process-title">{t.processTitle}</h2>
        </div>

        <div className="bas-plans-process-grid">
          <article><b>01</b><span><BriefcaseBusiness className="h-5 w-5" /></span><h3>{t.step1}</h3><p>{t.step1Text}</p></article>
          <article><b>02</b><span><Film className="h-5 w-5" /></span><h3>{t.step2}</h3><p>{t.step2Text}</p></article>
          <article><b>03</b><span><Check className="h-5 w-5" /></span><h3>{t.step3}</h3><p>{t.step3Text}</p></article>
        </div>

        <div className="bas-plans-final-note">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <div>
            <strong>{t.noteTitle}</strong>
            <p>{t.noteText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
