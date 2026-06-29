import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import AppShell from "./AppShell";
import StartupLaunchGate from "./StartupLaunchGate";
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
const appleIconUrl = "/apple-touch-icon.png?v=10";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#911923" },
    { media: "(prefers-color-scheme: dark)", color: "#100708" },
  ],
};

export const metadata: Metadata = {
  title: "Burma AI Studio",
  description: "AI video creation service for brands and businesses.",
  applicationName: "Burma AI Studio",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Burma AI Studio",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: iconUrl, type: "image/svg+xml" }],
    shortcut: [{ url: iconUrl, type: "image/svg+xml" }],
    apple: [{ url: appleIconUrl, sizes: "180x180", type: "image/png" }],
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Burma AI Studio" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="Burma AI Studio" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href={iconUrl} type="image/svg+xml" />
        <link rel="shortcut icon" href={iconUrl} type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href={appleIconUrl} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var search = new URLSearchParams(window.location.search);
                var ua = navigator.userAgent || '';
                var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
                var iosStandalone = 'standalone' in navigator && !!navigator.standalone;
                var androidWebView = /Android/i.test(ua) && /; wv\\)/i.test(ua);
                var explicitApp = search.get('source') === 'pwa' || search.get('source') === 'app' || search.get('source') === 'native' || search.get('platform') === 'ios' || search.get('platform') === 'android';
                var nativeBridge = typeof window.Capacitor !== 'undefined';
                var realApp = standalone || iosStandalone || androidWebView || explicitApp || nativeBridge;

                if (!realApp) {
                  localStorage.removeItem('bas-app-mode');
                  document.documentElement.classList.remove('bas-app-mode');
                }
              } catch (e) {}
            `,
          }}
        />
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
        <StartupLaunchGate />

        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
