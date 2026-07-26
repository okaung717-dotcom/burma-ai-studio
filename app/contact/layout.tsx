import type { Metadata } from "next";

const siteUrl = "https://burmaaistudio.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Burma AI Studio to plan a cinematic AI video, brand commercial, product campaign, AI presenter video, TikTok or Reels project.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Burma AI Studio",
    description:
      "Plan a cinematic AI video, brand commercial, product campaign, AI presenter video or social campaign with Burma AI Studio.",
    url: "/contact",
    type: "website",
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Burma AI Studio", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
  ],
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
