import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin6996"],
    },
    sitemap: "https://burmaaistudio.com/sitemap.xml",
    host: "https://burmaaistudio.com",
  };
}
