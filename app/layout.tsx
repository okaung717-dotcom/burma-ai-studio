import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import { LanguageProvider } from "./LanguageContext";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased min-h-full flex flex-col w-full overflow-x-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <LanguageProvider>
          <Navbar />
          <div className="w-full">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}