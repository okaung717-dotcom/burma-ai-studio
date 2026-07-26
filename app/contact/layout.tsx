import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start an AI Video Project",
  description:
    "Contact Burma AI Studio to plan a cinematic AI video, brand commercial, product campaign, AI presenter video, TikTok or Reels project.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Start an AI Video Project | Burma AI Studio",
    description:
      "Plan a cinematic AI video, brand commercial, product campaign, AI presenter video or social campaign with Burma AI Studio.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
