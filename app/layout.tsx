import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const iconUrl = "/burma-ai-icon.svg?v=10";

export const metadata: Metadata = {
  title: "Burma AI Studio",
  description: "AI video creation service for brands and businesses.",
  applicationName: "Burma AI Studio",
  manifest: "/manifest.webmanifest",
  themeColor: "#911923",
  appleWebApp: {
    capable: true,
    title: "Burma AI Studio",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: iconUrl, type: "image/svg+xml" }],
    shortcut: [{ url: iconUrl, type: "image/svg+xml" }],
    apple: [{ url: iconUrl, type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Burma AI Studio",
    description: "High-quality AI promotional videos for brands and businesses.",
    siteName: "Burma AI Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={iconUrl} type="image/svg+xml" />
        <link rel="shortcut icon" href={iconUrl} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={iconUrl} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col w-full overflow-x-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
