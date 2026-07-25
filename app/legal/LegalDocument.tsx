"use client";

import Link from "next/link";
import { ArrowLeft, FileCheck2, ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import {
  getLegalDocument,
  legalLinks,
  LEGAL_EFFECTIVE_DATE,
  LEGAL_VERSION,
  type LegalDocumentKey,
} from "./legalData";

export default function LegalDocument({
  documentKey,
  embedded = false,
}: {
  documentKey: LegalDocumentKey;
  embedded?: boolean;
}) {
  const { lang } = useLanguage();
  const language = lang === "MM" ? "MM" : "EN";
  const document = getLegalDocument(documentKey, language);

  const body = (
    <div className="mx-auto w-full max-w-5xl">
      {!embedded && documentKey !== "legal" && (
        <Link
          href="/legal"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ead9bd] bg-white/80 px-4 py-2 text-sm font-black text-[#911923] transition hover:border-[#911923]/40 dark:border-[#6b4b2a] dark:bg-white/5 dark:text-[#e3bc61]"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "MM" ? "Legal Center သို့ပြန်ရန်" : "Back to Legal Center"}
        </Link>
      )}

      <header className="overflow-hidden rounded-[2.2rem] border border-[#3a181e] bg-[#1a0b0e] p-6 text-white shadow-[0_24px_70px_rgba(26,11,14,0.18)] md:p-9 dark:border-[#6b4b2a]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e3bc61]">
          <ShieldCheck className="h-4 w-4" /> {document.eyebrow}
        </div>
        <h1 className={`mt-5 font-black tracking-tight ${embedded ? "text-3xl" : "text-4xl md:text-6xl"} ${language === "MM" ? "leading-[1.45]" : "leading-tight"}`}>
          {document.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-[#f0dcc1] md:text-base">{document.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/75">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Version {LEGAL_VERSION}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Effective {LEGAL_EFFECTIVE_DATE}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Website · Android · iOS</span>
        </div>
      </header>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {legalLinks.map((item) => {
          const active = item.key === documentKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-black transition ${
                active
                  ? "border-[#911923] bg-[#911923] text-white dark:border-[#e3bc61] dark:bg-[#e3bc61] dark:text-[#100708]"
                  : "border-[#ead9bd] bg-[#fffdf8] text-[#6f5d50] hover:border-[#911923]/40 dark:border-[#6b4b2a] dark:bg-[#1a0b0e] dark:text-[#d8c4a3]"
              }`}
            >
              {language === "MM" ? item.labelMM : item.labelEN}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-4">
        {document.sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[1.8rem] border border-[#ead9bd] bg-[#fffdf8] p-5 shadow-sm dark:border-[#4b2a1d] dark:bg-[#1a0b0e] md:p-7"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#fff3e3] text-[#911923] dark:bg-[#241113] dark:text-[#e3bc61]">
                <FileCheck2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className={`text-lg font-black text-[#1a0b0e] dark:text-[#fff7eb] md:text-xl ${language === "MM" ? "leading-[1.65]" : "leading-snug"}`}>
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph, index) => (
                  <p
                    key={`${section.title}-p-${index}`}
                    className={`mt-3 text-sm font-medium text-[#6f5d50] dark:text-[#d8c4a3] md:text-[15px] ${language === "MM" ? "leading-[1.9]" : "leading-7"}`}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 space-y-2.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className={`flex gap-3 text-sm font-medium text-[#6f5d50] dark:text-[#d8c4a3] md:text-[15px] ${language === "MM" ? "leading-[1.85]" : "leading-7"}`}>
                        <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#be9537]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-[#be9537]/35 bg-[#fff3e3] p-5 text-sm font-bold leading-7 text-[#5f4030] dark:border-[#6b4b2a] dark:bg-[#241113] dark:text-[#ead9bd]">
        {language === "MM"
          ? "ဒီ policy များသည် service workflow ကိုရှင်းလင်းစေရန် ရေးသားထားသော business terms ဖြစ်ပါတယ်။ မဖြုတ်နိုင်သော ဥပဒေအခွင့်အရေးများနှင့် သက်ဆိုင်ရာ mandatory law များသည် ဆက်လက်သက်ရောက်ပါတယ်။"
          : "These policies are business terms intended to make the service workflow clear. Mandatory legal rights and protections that cannot lawfully be excluded continue to apply."}
      </div>
    </div>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen bg-[#fff9f0] px-5 py-8 text-[#1a0b0e] transition-colors duration-300 dark:bg-[#100708] dark:text-[#fff7eb] md:px-12 md:py-12 lg:px-24">
      {body}
    </div>
  );
}
