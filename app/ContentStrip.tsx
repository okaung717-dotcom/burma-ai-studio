"use client";

import { useEffect, useState } from "react";

type SiteContent = {
  homeTitle?: string;
  homeSubtitle?: string;
  servicesTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export default function ContentStrip({ type }: { type: "home" | "services" | "contact" }) {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setContent(data?.content || null))
      .catch(() => undefined);
  }, []);

  if (!content) return null;

  if (type === "home") {
    return (
      <section className="mx-6 mb-8 rounded-[2rem] border border-[#00C2FF]/20 bg-white/70 p-6 shadow-sm dark:bg-gray-900/60 md:mx-16 lg:mx-24">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00C2FF]">Live CMS</p>
        <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{content.homeTitle}</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{content.homeSubtitle}</p>
      </section>
    );
  }

  if (type === "services") {
    return <h2 className="mb-6 text-center text-3xl font-black text-gray-900 dark:text-white">{content.servicesTitle}</h2>;
  }

  return (
    <div className="rounded-2xl border border-[#be9537]/25 bg-[#fff9f0] p-5 text-sm font-bold text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">
      <p>Email: {content.contactEmail}</p>
      <p>Phone: {content.contactPhone}</p>
    </div>
  );
}
