import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Tracking } from "@/components/layout/Tracking";
import { consentInitScript } from "@/lib/consent";
import { site } from "@/config/site";

// Self-hosted variable fonts (no runtime call to Google Fonts; better privacy and LCP).
const fraunces = localFont({ src: "../fonts/fraunces.woff2", weight: "100 900", variable: "--font-fraunces", display: "swap" });
const inter = localFont({ src: "../fonts/inter.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });

export const revalidate = 86400; // seasonal bar refreshes daily

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "DeckCraft Boston", template: "%s | DeckCraft Boston" },
  applicationName: "DeckCraft Boston",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#1A3828", width: "device-width", initialScale: 1 };

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />
      </head>
      <body className="antialiased">
        {GTM && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-linen focus:p-3">Skip to content</a>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Tracking />
      </body>
    </html>
  );
}
