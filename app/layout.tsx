import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://burmaaistudio.com";
const iconUrl = "/burma-ai-icon.svg?v=11";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b10",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Burma AI Studio", template: "%s | Burma AI Studio" },
  description: "A private AI image and video production workspace for connected creative workflows.",
  applicationName: "Burma AI Studio",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: iconUrl, type: "image/svg+xml" }],
    shortcut: [{ url: iconUrl, type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png?v=11", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
