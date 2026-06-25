import type { MetadataRoute } from "next";

const iconUrl = "/burma-ai-icon.svg?v=8";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Burma AI Studio",
    short_name: "Burma AI",
    description: "AI video creation service for brands and businesses.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#911923",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "photo", "video"],
    icons: [
      {
        src: iconUrl,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: iconUrl,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
