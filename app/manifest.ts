import type { MetadataRoute } from "next";

const iconUrl = "/burma-ai-icon.svg?v=8";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Burma AI Studio",
    short_name: "Burma AI",
    description: "Private AI image and video production workspace.",
    start_url: "/studio/spaces",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b10",
    theme_color: "#0b0b10",
    orientation: "any",
    categories: ["productivity", "photo", "video"],
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
