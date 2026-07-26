import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Original AI Cinematic Stories",
  description:
    "Discover original cinematic AI stories and visual storytelling projects from Burma AI Studio, created with human creative direction.",
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title: "Original AI Cinematic Stories | Burma AI Studio",
    description:
      "Original cinematic AI stories and visual storytelling projects from Burma AI Studio.",
    url: "/stories",
    type: "website",
  },
};

export default function StoriesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
