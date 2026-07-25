"use client";

import { useEffect, useState } from "react";

type VideoItem = { src: string; titleEN?: string; descEN?: string; titleMM?: string; descMM?: string };

/* Website portfolio curation: keep the approved cinematic trailer and hide the three retired samples.
   The API/admin portfolio data is intentionally left untouched so app/admin workflows are not changed. */
const RETIRED_WEBSITE_VIDEO_IDS = new Set([
  "IrukbYGHhQs", // Architecture AI Videos
  "T9p2lqcETCE", // Cinematic Commercial
  "wJjyMQ3bjt4", // Virtual Presenter Campaign
]);

const fallback: VideoItem[] = [
  { src: "DVM3o2Wqcys", titleEN: "Cinematic Trailer · Mahura Myaing", descEN: "A cinematic AI film crafted by Burma AI Studio", titleMM: "Cinematic Trailers AI Video", descMM: "TikTok, YouTube, Facebook AI videos" },
];

function websiteItems(items: VideoItem[]) {
  return items.filter((item) => !RETIRED_WEBSITE_VIDEO_IDS.has(item.src));
}

export default function VideoGrid() {
  const [items, setItems] = useState<VideoItem[]>(fallback);

  useEffect(() => {
    fetch("/api/portfolio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data?.items)) return;
        const curated = websiteItems(data.items);
        setItems(curated.length ? curated : fallback);
      })
      .catch(() => undefined);
  }, []);

  const gridClass = items.length === 1
    ? "grid grid-cols-1 gap-6"
    : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <article key={item.src} data-portfolio-video data-video-id={item.src} data-video-title={item.titleEN || item.titleMM || "AI Video"} className="group">
          <div className={`${items.length === 1 ? "aspect-[16/7]" : "aspect-video"} overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-lg dark:border-gray-800 dark:bg-gray-900`}>
            <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${item.src}`} allowFullScreen title={item.titleEN || "AI Video"} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{item.titleEN || item.titleMM || "AI Video"}</h3>
          <p className="text-gray-500 dark:text-gray-400">{item.descEN || item.descMM || "Burma AI Studio"}</p>
        </article>
      ))}
    </div>
  );
}
