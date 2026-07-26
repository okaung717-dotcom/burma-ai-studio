import type { Metadata } from "next";

const siteUrl = "https://burmaaistudio.com";

export const metadata: Metadata = {
  title: "AI Video Services",
  description:
    "Explore Burma AI Studio services for brands in Myanmar: cinematic commercials, AI presenter campaigns, product and process films, TikTok videos and Reels.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "AI Video Services | Burma AI Studio",
    description:
      "Cinematic commercials, AI presenters, product and process films, TikTok videos and Reels for brands in Myanmar.",
    url: "/services",
    type: "website",
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Burma AI Studio",
      item: `${siteUrl}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "AI Video Services",
      item: `${siteUrl}/services`,
    },
  ],
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {children}
    </>
  );
}
