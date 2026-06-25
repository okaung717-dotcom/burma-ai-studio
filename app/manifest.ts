import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Burma AI Studio",
    short_name: "Burma AI",
    description: "AI video creation service for brands and businesses.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fff9f0",
    theme_color: "#911923",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "photo", "video"],
    icons: [
      {
        src: "/burma-ai-icon.svg?v=5",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/burma-ai-icon.svg?v=5",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
