import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
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

const siteUrl = "https://burmaaistudio.com";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Burma AI Studio | AI Video Production for Brands",
    template: "%s | Burma AI Studio",
  },
  description:
    "Burma AI Studio creates premium AI video ads, cinematic brand films, AI presenter campaigns, product videos, Reels and TikTok content for brands in Myanmar.",
  applicationName: "Burma AI Studio",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
    title: "Burma AI Studio | AI Video Production for Brands",
    description:
      "Premium AI video ads, cinematic brand films, AI presenters, product stories and social campaigns for brands in Myanmar.",
    url: siteUrl,
    siteName: "Burma AI Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burma AI Studio | AI Video Production for Brands",
    description:
      "Premium AI video ads, cinematic brand films, AI presenters, product stories and social campaigns for brands in Myanmar.",
  },
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: "Burma AI Studio",
  alternateName: "BurmaAiStudio",
  description:
    "Premium AI video production, cinematic brand films, AI presenter campaigns and social video content for brands in Myanmar.",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Burma AI Studio",
  alternateName: "BurmaAiStudio",
  url: `${siteUrl}/`,
  logo: `${siteUrl}/apple-touch-icon.png?v=10`,
  description:
    "AI video production studio creating cinematic brand films, AI presenter campaigns, product videos and short-form social content.",
  areaServed: {
    "@type": "Country",
    name: "Myanmar",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasWebsiteAuthCookie = Boolean(
    cookieStore.get("bas_account_access")?.value || cookieStore.get("bas_account_refresh")?.value
  );

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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <style>{`
          html.bas-website-context .bas-startup-launch-gate { display: none !important; }
          html.bas-real-app-context .bas-intro,
          html.bas-intro-skip .bas-intro { display: none !important; }
          html.bas-website-context:not(.bas-intro-skip) body { background: #090506; }

          /* First-paint account-gate protection.
             The Intro itself must be fully opaque from the very first browser paint.
             Its previous whole-screen fade-in exposed Home underneath for ~520ms.
             UI elements inside the Intro still keep their existing 3.03s cinematic reveal. */
          html.bas-website-context:not(.bas-intro-skip) .bas-intro {
            position: fixed !important;
            inset: 0 !important;
            z-index: 20000 !important;
            overflow: hidden !important;
            isolation: isolate !important;
            background: #090506 !important;
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }

          /* Even if a browser paints descendants while CSS chunks are settling,
             the protected Home surface cannot show through an unauthenticated Intro. */
          html.bas-website-context:not(.bas-intro-skip) .bas-intro-media {
            background: #080405 !important;
          }

          /* Critical first-paint guard: the public website intro's third-party
             player is never allowed to paint native transport chrome before
             the sanitizer removes playlist controls and marks it ready. */
          html.bas-website-context .bas-intro-media iframe:not(.bas-intro-video-ready) {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          html.bas-website-context .bas-intro-media iframe.bas-intro-video-ready {
            visibility: visible !important;
          }
        `}</style>
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
                var nativeBridge = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
                var realApp = standalone || iosStandalone || androidWebView || explicitApp || nativeBridge;
                var html = document.documentElement;

                html.classList.toggle('bas-real-app-context', !!realApp);
                html.classList.toggle('bas-website-context', !realApp);

                if (!realApp) {
                  localStorage.removeItem('bas-app-mode');
                  html.classList.remove('bas-app-mode');

                  var pathname = window.location.pathname || '/';
                  var exemptPrefixes = ['/legal', '/privacy', '/terms', '/project-policy', '/ai-ip-policy', '/acceptable-use', '/copyright', '/privacy-choices', '/admin', '/admin6996'];
                  var accountGateExempt = exemptPrefixes.some(function (path) {
                    return pathname === path || pathname.indexOf(path + '/') === 0;
                  });
                  var hasAccountSession = ${hasWebsiteAuthCookie ? "true" : "false"};
                  html.classList.toggle('bas-intro-skip', accountGateExempt || hasAccountSession);
                } else {
                  html.classList.add('bas-intro-skip');
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
      </body>
    </html>
  );
}
