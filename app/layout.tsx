import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
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

export const metadata: Metadata = {
  title: "Burma AI Studio",
  description: "Next-Gen Video Production",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* စာမျက်နှာ မပွင့်ခင် Theme ကွဲလွဲမှုကို ကာကွယ်ပေးသည့် Script */}
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
            <Navbar />
            <main className="w-full flex-grow">
              {children}
            </main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}