"use client";

import { ArrowDown, Film, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const copy = {
  EN: {
    eyebrow: "BURMA AI STUDIO ORIGINALS",
    title: "Watch Our Stories, One Episode at a Time.",
    subtitle:
      "Original films and series from Burma AI Studio. New episodes will appear here as they are released — free for everyone to watch.",
    browse: "Browse stories",
    free: "Free to watch",
    noAccount: "No account needed",
    libraryEyebrow: "STORIES & SERIES",
    libraryTitle: "Your next story starts here.",
    libraryText:
      "There are no published series yet. When the first story arrives, you will be able to open a series, choose an episode and keep watching from one simple place.",
    coming: "COMING SOON",
    comingTitle: "New original stories are on the way.",
    comingText:
      "Check back for the first Burma AI Studio Original series and episode releases.",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO ORIGINALS",
    title: "ဇာတ်လမ်းတွေကို အပိုင်းလိုက် အေးအေးဆေးဆေး ကြည့်ပါ။",
    subtitle:
      "Burma AI Studio ရဲ့ Original Film နဲ့ Series တွေကို ဒီနေရာမှာ တစ်စုတစ်စည်းတည်း ကြည့်နိုင်မယ်။ Episode အသစ်တင်တိုင်း ဒီမှာပေါ်လာပြီး လူတိုင်း အခမဲ့ကြည့်နိုင်မယ်။",
    browse: "ဇာတ်လမ်းများကြည့်ရန်",
    free: "လူတိုင်း အခမဲ့ကြည့်နိုင်သည်",
    noAccount: "Account မလိုဘဲ ကြည့်နိုင်သည်",
    libraryEyebrow: "ဇာတ်လမ်းများနှင့် SERIES များ",
    libraryTitle: "နောက်ထပ်ကြည့်မယ့် ဇာတ်လမ်းကို ဒီမှာရှာပါ။",
    libraryText:
      "လက်ရှိမှာ ထုတ်လွှင့်ထားတဲ့ Series မရှိသေးပါဘူး။ ပထမဆုံး Series တင်လာတဲ့အခါ Series ကိုဖွင့်ပြီး Episode တစ်ပိုင်းချင်းစီကို ဒီနေရာကနေ တိုက်ရိုက်ကြည့်နိုင်မယ်။",
    coming: "မကြာမီလာမည်",
    comingTitle: "Original ဇာတ်လမ်းအသစ်တွေ မကြာမီလာမယ်။",
    comingText:
      "Burma AI Studio ရဲ့ ပထမဆုံး Series နဲ့ Episodes တွေကို ဒီနေရာမှာ အရင်ဆုံးကြည့်နိုင်မယ်။",
  },
} as const;

export default function StoriesPageClient() {
  const { lang } = useLanguage();
  const isMyanmar = lang === "MM";
  const t = copy[isMyanmar ? "MM" : "EN"];

  return (
    <div className={`bas-stories-page${isMyanmar ? " is-mm" : ""}`}>
      <section className="bas-stories-hero" aria-labelledby="stories-title">
        <div className="bas-stories-hero-inner">
          <div className="bas-stories-kicker">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t.eyebrow}
          </div>

          <h1 id="stories-title">{t.title}</h1>
          <p className="bas-stories-hero-copy">{t.subtitle}</p>

          <div className="bas-stories-hero-actions">
            <a href="#stories-library" className="bas-stories-primary">
              {t.browse}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="bas-stories-trust" aria-label="Viewing access">
            <span>{t.free}</span>
            <span aria-hidden="true" className="bas-stories-dot" />
            <span>{t.noAccount}</span>
          </div>
        </div>
      </section>

      <section id="stories-library" className="bas-stories-library" aria-labelledby="stories-library-title">
        <div className="bas-stories-library-head">
          <span>{t.libraryEyebrow}</span>
          <h2 id="stories-library-title">{t.libraryTitle}</h2>
          <p>{t.libraryText}</p>
        </div>

        <article className="bas-stories-coming-card">
          <div className="bas-stories-coming-icon" aria-hidden="true">
            <Film className="h-6 w-6" />
          </div>
          <div className="bas-stories-coming-copy">
            <span>{t.coming}</span>
            <h3>{t.comingTitle}</h3>
            <p>{t.comingText}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
