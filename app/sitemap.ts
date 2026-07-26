import type { MetadataRoute } from "next";

const baseUrl = "https://burmaaistudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/services` },
    { url: `${baseUrl}/portfolio` },
    { url: `${baseUrl}/stories` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ];
}
