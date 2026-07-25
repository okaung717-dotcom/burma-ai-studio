"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const PRIVACY_CONSENT_KEY = "bas_privacy_consent_v1";
export type PrivacyConsentValue = "analytics" | "essential";

function saveConsent(value: PrivacyConsentValue) {
  localStorage.setItem(PRIVACY_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("bas-privacy-consent-change", { detail: value }));
}

export default function PrivacyConsent() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(PRIVACY_CONSENT_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const isMm = lang === "MM";
  const choose = (value: PrivacyConsentValue) => {
    try {
      saveConsent(value);
    } finally {
      setVisible(false);
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] z-[12000] mx-auto max-w-2xl rounded-[1.8rem] border border-[#ead9bd] bg-[#fffdf8]/[0.98] p-4 text-[#1a0b0e] shadow-[0_26px_90px_rgba(26,11,14,0.3)] backdrop-blur-2xl dark:border-[#6b4b2a] dark:bg-[#1a0b0e]/[0.98] dark:text-[#fff7eb] md:bottom-5 md:p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#911923] text-white dark:bg-[#e3bc61] dark:text-[#100708]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={`text-base font-black md:text-lg ${isMm ? "leading-[1.55]" : "leading-snug"}`}>
            {isMm ? "Privacy နဲ့ Analytics ရွေးချယ်မှု" : "Privacy & analytics choice"}
          </h2>
          <p className={`mt-1.5 text-xs font-medium text-[#6f5d50] dark:text-[#d8c4a3] md:text-sm ${isMm ? "leading-[1.8]" : "leading-6"}`}>
            {isMm
              ? "Optional analytics ကို မင်းခွင့်ပြုမှသာ ဖွင့်ပါမယ်။ Essential only ကိုရွေးလည်း website/app ရဲ့ အဓိကလုပ်ဆောင်ချက်တွေ ဆက်သုံးနိုင်ပါတယ်။"
              : "Optional analytics is enabled only after you allow it. Choosing Essential only keeps the core website and app features available."}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-black">
            <Link href="/privacy" className="text-[#911923] underline decoration-[#be9537]/60 underline-offset-4 dark:text-[#e3bc61]">
              {isMm ? "Privacy Policy" : "Privacy Policy"}
            </Link>
            <Link href="/privacy-choices" className="text-[#911923] underline decoration-[#be9537]/60 underline-offset-4 dark:text-[#e3bc61]">
              {isMm ? "Privacy Choices" : "Privacy Choices"}
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => choose("essential")}
          className="rounded-2xl border border-[#ead9bd] bg-white px-3 py-3 text-xs font-black text-[#1a0b0e] transition active:scale-[0.98] dark:border-[#6b4b2a] dark:bg-[#241113] dark:text-[#fff7eb]"
        >
          {isMm ? "Essential only" : "Essential only"}
        </button>
        <button
          type="button"
          onClick={() => choose("analytics")}
          className="rounded-2xl bg-[#911923] px-3 py-3 text-xs font-black text-white shadow-lg shadow-[#911923]/20 transition active:scale-[0.98] dark:bg-[#e3bc61] dark:text-[#100708]"
        >
          {isMm ? "Analytics ခွင့်ပြုမယ်" : "Allow analytics"}
        </button>
      </div>
    </div>
  );
}
