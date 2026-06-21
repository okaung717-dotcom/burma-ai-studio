"use client";

import { useEffect, useState } from "react";

type VideoItem = { src: string; titleEN?: string; descEN?: string; titleMM?: string; descMM?: string };

const fallback: VideoItem[] = [
  { src: "DVM3o2Wqcys", titleEN: "Cinematic AI Video", descEN: "AI video portfolio" },
  { src: "IrukbYGHhQs", titleEN: "Architecture AI Video", descEN: "AI video portfolio" },
  { src: "T9p2lqcETCE", titleEN: "Commercial AI Video", descEN: "AI video portfolio" },
  { src: "wJjyMQ3bjt4", titleEN: "AI Presenter Video", descEN: "AI video portfolio" },
];

export default function VideoGrid() {
  const [items, setItems] = useState<VideoItem[]>(fallback);

  useEffect(() => {
    fetch("/api/portfolio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.items) && data.items.length) setItems(data.items);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.src} data-portfolio-video data-video-id={item.src} data-video-title={item.titleEN || item.titleMM || "AI Video"} className="group">
          <div className="aspect-video overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${item.src}`} allowFullScreen title={item.titleEN || "AI Video"} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{item.titleEN || item.titleMM || "AI Video"}</h3>
          <p className="text-gray-500 dark:text-gray-400">{item.descEN || item.descMM || "Burma AI Studio"}</p>
        </article>
      ))}
    </div>
  );
}
