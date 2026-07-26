"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Film, Layers3, Play, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const previewVideoId = "DVM3o2Wqcys";

const copy = {
  EN: {
    eyebrow: "BURMA AI STUDIO ORIGINALS",
    title: "Stories Worth Returning To.",
    subtitle:
      "A public home for Burma AI Studio original films, cinematic series and episodic stories — designed to grow into a real viewing library, not a portfolio page.",
    watchPreview: "Watch Studio Preview",
    explore: "Explore the Library",
    publicLabel: "PUBLIC ACCESS",
    publicText: "Original stories are designed for everyone to watch without an upgrade plan.",
    seriesLabel: "SERIES-FIRST",
    seriesText: "Each story can grow into seasons, episodes and a clean long-form archive.",
    episodeLabel: "EPISODE-READY",
    episodeText: "The layout is prepared for episode cards, release dates, durations and watch progression.",
    featuredEyebrow: "FEATURED PREVIEW",
    featuredTitle: "The visual world begins here.",
    featuredText:
      "This cinematic trailer is being used as the first public preview while the Originals library is prepared for full series and episode releases.",
    libraryEyebrow: "ORIGINALS LIBRARY",
    libraryTitle: "Built for the stories that come next.",
    libraryText:
      "No public series has been published yet. When the first series goes live, this section will become the permanent home for seasons, episodes and latest releases.",
    emptyTitle: "First original series coming soon",
    emptyText: "The library is ready for the first official Burma AI Studio episodic release.",
    structureEyebrow: "CONTENT ARCHITECTURE",
    structureTitle: "One clean path from series to episode.",
    series: "Series",
    seriesDesc: "Poster, title, genre, synopsis, status and season overview.",
    seasons: "Seasons",
    seasonsDesc: "Organized releases that keep long-running stories easy to browse.",
    episodes: "Episodes",
    episodesDesc: "Dedicated watch pages with episode number, duration, description and next episode flow.",
    footerTitle: "Public entertainment. Studio-grade presentation.",
    footerText:
      "Stories will remain separate from Portfolio so client work and original entertainment never compete for attention.",
    portfolio: "View Portfolio",
  },
  MM: {
    eyebrow: "BURMA AI STUDIO ORIGINALS",
    title: "ပြန်ကြည့်ချင်စေမယ့် ဇာတ်လမ်းတွေ။",
    subtitle:
      "Burma AI Studio ရဲ့ Original Film, Cinematic Series နဲ့ Episode အလိုက် ဇာတ်လမ်းတွေကို လူတိုင်းကြည့်နိုင်မယ့် public viewing library တစ်ခုအဖြစ် တည်ဆောက်ထားပါတယ်။ Portfolio နဲ့ မရောဘဲ သီးသန့် entertainment experience ဖြစ်ပါတယ်။",
    watchPreview: "Studio Preview ကြည့်ရန်",
    explore: "Library ကိုကြည့်ရန်",
    publicLabel: "PUBLIC ACCESS",
    publicText: "Original Stories တွေကို Upgrade Plan မလိုဘဲ လူတိုင်းကြည့်နိုင်အောင်ထားမယ်။",
    seriesLabel: "SERIES-FIRST",
    seriesText: "ဇာတ်လမ်းတစ်ခုချင်းစီကို Season နဲ့ Episode အလိုက် ရှင်းရှင်းလင်းလင်းတိုးချဲ့နိုင်မယ်။",
    episodeLabel: "EPISODE-READY",
    episodeText: "Episode card, release date, duration နဲ့ watch progression အတွက် layout ကိုအဆင်သင့်တည်ဆောက်ထားမယ်။",
    featuredEyebrow: "FEATURED PREVIEW",
    featuredTitle: "ဒီနေရာကနေ Burma AI Studio Originals ရဲ့ visual world စတင်မယ်။",
    featuredText:
      "Full Series နဲ့ Episodes မတင်ခင် အခု Cinematic Trailer ကို public preview အဖြစ်သုံးထားပါတယ်။",
    libraryEyebrow: "ORIGINALS LIBRARY",
    libraryTitle: "နောက်လာမယ့် ဇာတ်လမ်းတွေအတွက် အခုကတည်းက အဆင်သင့်။",
    libraryText:
      "Public Series မတင်ရသေးပါဘူး။ ပထမဆုံး Series တင်တဲ့အချိန်ကစပြီး ဒီနေရာက Seasons, Episodes နဲ့ Latest Releases တွေရဲ့ အမြဲတမ်း Home ဖြစ်သွားမယ်။",
    emptyTitle: "ပထမဆုံး Original Series မကြာမီလာမယ်",
    emptyText: "Burma AI Studio ရဲ့ ပထမဆုံး episodic release ကို လက်ခံဖို့ Library structure အဆင်သင့်ဖြစ်နေပြီ။",
    structureEyebrow: "CONTENT ARCHITECTURE",
    structureTitle: "Series ကနေ Episode အထိ တစ်လမ်းတည်းနဲ့ရှင်းနေမယ့် structure။",
    series: "Series",
    seriesDesc: "Poster, Title, Genre, Synopsis, Status နဲ့ Season overview။",
    seasons: "Seasons",
    seasonsDesc: "ရှည်လျားတဲ့ဇာတ်လမ်းတွေကိုလည်း မရှုပ်ဘဲ အပိုင်းလိုက် browse လုပ်နိုင်မယ်။",
    episodes: "Episodes",
    episodesDesc: "Episode number, duration, description နဲ့ Next Episode flow ပါတဲ့ dedicated watch pages။",
    footerTitle: "Public entertainment. Studio-grade presentation.",
    footerText:
      "Stories ကို Portfolio နဲ့ သီးသန့်ခွဲထားလို့ Client work နဲ့ Original entertainment နှစ်မျိုးလုံးကို professional ကျကျပြနိုင်မယ်။",
    portfolio: "Portfolio ကြည့်ရန်",
  },
} as const;

export default function StoriesPageClient() {
  const { lang } = useLanguage();
  const t = copy[lang === "MM" ? "MM" : "EN"];

  return (
    <div className="bas-stories-page">
      <section className="bas-stories-hero" aria-labelledby="stories-title">
        <img
          className="bas-stories-hero-image"
          src={`https://i.ytimg.com/vi/${previewVideoId}/maxresdefault.jpg`}
          alt="Burma AI Studio cinematic original preview"
        />
        <div className="bas-stories-hero-shade" />
        <div className="bas-stories-hero-glow" />

        <div className="bas-stories-hero-content">
          <div className="bas-stories-kicker"><Sparkles className="h-4 w-4" /> {t.eyebrow}</div>
          <h1 id="stories-title">{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="bas-stories-actions">
            <a className="bas-stories-primary" href="#featured">
              <Play className="h-4 w-4 fill-current" /> {t.watchPreview}
            </a>
            <a className="bas-stories-secondary" href="#library">
              {t.explore} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bas-stories-principles" aria-label="Stories platform principles">
        <article>
          <span className="bas-stories-principle-icon"><Film className="h-5 w-5" /></span>
          <div><strong>{t.publicLabel}</strong><p>{t.publicText}</p></div>
        </article>
        <article>
          <span className="bas-stories-principle-icon"><Layers3 className="h-5 w-5" /></span>
          <div><strong>{t.seriesLabel}</strong><p>{t.seriesText}</p></div>
        </article>
        <article>
          <span className="bas-stories-principle-icon"><BookOpen className="h-5 w-5" /></span>
          <div><strong>{t.episodeLabel}</strong><p>{t.episodeText}</p></div>
        </article>
      </section>

      <section id="featured" className="bas-stories-featured">
        <div className="bas-stories-section-copy">
          <span>{t.featuredEyebrow}</span>
          <h2>{t.featuredTitle}</h2>
          <p>{t.featuredText}</p>
        </div>

        <div className="bas-stories-player-shell">
          <div className="bas-stories-player-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${previewVideoId}?rel=0&modestbranding=1&playsinline=1`}
              title="Burma AI Studio Originals cinematic preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="bas-stories-player-meta">
            <span>BURMA AI STUDIO ORIGINALS</span>
            <strong>Cinematic Preview</strong>
            <small>Public preview · Full original series library coming next</small>
          </div>
        </div>
      </section>

      <section id="library" className="bas-stories-library">
        <div className="bas-stories-section-copy bas-stories-section-copy-wide">
          <span>{t.libraryEyebrow}</span>
          <h2>{t.libraryTitle}</h2>
          <p>{t.libraryText}</p>
        </div>

        <div className="bas-stories-empty-state">
          <div className="bas-stories-empty-mark"><Film className="h-7 w-7" /></div>
          <div>
            <strong>{t.emptyTitle}</strong>
            <p>{t.emptyText}</p>
          </div>
          <span className="bas-stories-coming-pill">COMING SOON</span>
        </div>
      </section>

      <section className="bas-stories-structure">
        <div className="bas-stories-section-copy bas-stories-section-copy-wide">
          <span>{t.structureEyebrow}</span>
          <h2>{t.structureTitle}</h2>
        </div>

        <div className="bas-stories-structure-grid">
          <article><b>01</b><h3>{t.series}</h3><p>{t.seriesDesc}</p></article>
          <article><b>02</b><h3>{t.seasons}</h3><p>{t.seasonsDesc}</p></article>
          <article><b>03</b><h3>{t.episodes}</h3><p>{t.episodesDesc}</p></article>
        </div>
      </section>

      <section className="bas-stories-footer-cta">
        <div>
          <span>BURMA AI STUDIO · ORIGINALS</span>
          <h2>{t.footerTitle}</h2>
          <p>{t.footerText}</p>
        </div>
        <Link href="/portfolio" className="bas-stories-secondary bas-stories-footer-link">
          {t.portfolio} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
