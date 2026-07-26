import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Portfolio & Brand Films",
  description:
    "Watch selected Burma AI Studio work: cinematic AI films, brand commercials, product visuals, presenter campaigns and premium social video content.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "AI Video Portfolio & Brand Films | Burma AI Studio",
    description:
      "Selected cinematic AI films, brand commercials, product visuals and presenter campaigns by Burma AI Studio.",
    url: "/portfolio",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
