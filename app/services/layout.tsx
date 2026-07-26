import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Production Services in Myanmar",
  description:
    "Explore Burma AI Studio services for brands in Myanmar: cinematic commercials, AI presenter campaigns, product and process films, TikTok videos and Reels.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "AI Video Production Services in Myanmar | Burma AI Studio",
    description:
      "Cinematic commercials, AI presenters, product and process films, TikTok videos and Reels for brands in Myanmar.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
