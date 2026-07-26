import type { Metadata } from "next";

const siteUrl = "https://burmaaistudio.com";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Watch selected Burma AI Studio work: cinematic AI films, brand commercials, product visuals, presenter campaigns and premium social video content.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio | Burma AI Studio",
    description:
      "Selected cinematic AI films, brand commercials, product visuals and presenter campaigns by Burma AI Studio.",
    url: "/portfolio",
    type: "website",
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Burma AI Studio", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: `${siteUrl}/portfolio` },
  ],
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
