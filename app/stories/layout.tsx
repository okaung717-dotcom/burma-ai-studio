import type { Metadata } from "next";

const siteUrl = "https://burmaaistudio.com";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Discover original cinematic AI stories and visual storytelling projects from Burma AI Studio, created with human creative direction.",
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title: "Stories | Burma AI Studio",
    description:
      "Original cinematic AI stories and visual storytelling projects from Burma AI Studio.",
    url: "/stories",
    type: "website",
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Burma AI Studio", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Stories", item: `${siteUrl}/stories` },
  ],
};

export default function StoriesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
