"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { PRIVACY_CONSENT_KEY, type PrivacyConsentValue } from "../PrivacyConsent";

function writeConsent(value: PrivacyConsentValue) {
  localStorage.setItem(PRIVACY_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("bas-privacy-consent-change", { detail: value }));
}

export default function PrivacyChoicesPage() {
  const { lang } = useLanguage();
  const isMm = lang === "MM";
  const [choice, setChoice] = useState<PrivacyConsentValue | "unset">("unset");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRIVACY_CONSENT_KEY);
      setChoice(stored === "analytics" || stored === "essential" ? stored : "unset");
    } catch {
      setChoice("unset");
    }
  }, []);

  const choose = (value: PrivacyConsentValue) => {
    writeConsent(value);
    setChoice(value);
  };

  return (
    <div className="min-h-screen bg-[#fff9f0] px-5 py-8 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb] md:px-12 md:py-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[2.2rem] border border-[#3a181e] bg-[#1a0b0e] p-6 text-white shadow-[0_24px_70px_rgba(26,11,14,0.18)] md:p-9 dark:border-[#6b4b2a]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e3bc61]"><ShieldCheck className="h-4 w-4" /> PRIVACY CONTROL</div>
          <h1 className={`mt-5 text-4xl font-black md:text-6xl ${isMm ? "leading-[1.45]" : "leading-tight"}`}>{isMm ? "Privacy Choices" : "Privacy Choices"}</h1>
          <p className={`mt-4 max-w-2xl text-sm font-medium text-[#f0dcc1] md:text-base ${isMm ? "leading-[1.9]" : "leading-7"}`}>
            {isMm ? "Optional analytics ကို ခွင့်ပြုမလား၊ Essential only ပဲသုံးမလား ဒီနေရာမှာ အချိန်မရွေးပြောင်းနိုင်ပါတယ်။" : "You can change your optional analytics preference here at any time. Core service features remain available with Essential only."}
          </p>
        </header>

        <section className="mt-5 rounded-[1.9rem] border border-[#ead9bd] bg-[#fffdf8] p-5 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e] md:p-7">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">Current choice</p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#fff3e3] p-4 dark:bg-[#241113]">
            <CheckCircle2 className="h-5 w-5 text-[#be9537]" />
            <p className="font-black">
              {choice === "analytics" ? (isMm ? "Analytics ခွင့်ပြုထားသည်" : "Analytics allowed") : choice === "essential" ? "Essential only" : (isMm ? "မရွေးရသေးပါ" : "Not selected yet")}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={() => choose("essential")} className={`rounded-2xl border px-5 py-4 text-sm font-black transition active:scale-[0.98] ${choice === "essential" ? "border-[#911923] bg-[#911923] text-white" : "border-[#ead9bd] bg-white text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#241113] dark:text-[#fff7eb]"}`}>Essential only</button>
            <button onClick={() => choose("analytics")} className={`rounded-2xl border px-5 py-4 text-sm font-black transition active:scale-[0.98] ${choice === "analytics" ? "border-[#911923] bg-[#911923] text-white dark:border-[#e3bc61] dark:bg-[#e3bc61] dark:text-[#100708]" : "border-[#ead9bd] bg-white text-[#1a0b0e] dark:border-[#6b4b2a] dark:bg-[#241113] dark:text-[#fff7eb]"}`}>{isMm ? "Analytics ခွင့်ပြုမယ်" : "Allow analytics"}</button>
          </div>
        </section>

        <section className="mt-5 rounded-[1.9rem] border border-[#ead9bd] bg-[#fffdf8] p-5 dark:border-[#4b2a1d] dark:bg-[#1a0b0e] md:p-7">
          <h2 className="text-xl font-black">{isMm ? "Personal data request" : "Personal data request"}</h2>
          <p className={`mt-3 text-sm font-medium text-[#6f5d50] dark:text-[#d8c4a3] ${isMm ? "leading-[1.9]" : "leading-7"}`}>
            {isMm ? "Burma AI Studio ထိန်းချုပ်ထားတဲ့ မင်းရဲ့ personal data ကို access၊ correct သို့မဟုတ် delete လုပ်ဖို့ email နဲ့ request ပို့နိုင်ပါတယ်။ Relevant project/inquiry ကိုရှာနိုင်လောက်တဲ့အချက်အလက်ပဲပေးပါ။" : "To request access, correction or deletion of personal information controlled by Burma AI Studio, email us with enough information to identify the relevant inquiry or project."}
          </p>
          <a href="mailto:okaung717@gmail.com?subject=Burma%20AI%20Studio%20Privacy%20Request" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#911923] px-5 py-3 text-sm font-black text-white dark:bg-[#e3bc61] dark:text-[#100708]"><Mail className="h-4 w-4" /> okaung717@gmail.com</a>
        </section>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/privacy" className="rounded-full border border-[#ead9bd] bg-white px-4 py-2.5 text-sm font-black text-[#911923] dark:border-[#6b4b2a] dark:bg-white/5 dark:text-[#e3bc61]">Privacy Policy</Link>
          <Link href="/legal" className="rounded-full border border-[#ead9bd] bg-white px-4 py-2.5 text-sm font-black text-[#911923] dark:border-[#6b4b2a] dark:bg-white/5 dark:text-[#e3bc61]">Legal Center</Link>
        </div>
      </div>
    </div>
  );
}
