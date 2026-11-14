import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Tracking } from "@/components/layout/Tracking";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { consentInitScript } from "@/lib/consent";
import { site, noIndex } from "@/config/site";

// Self-hosted variable fonts (no runtime call to Google Fonts; better privacy and LCP).
// Archivo variable (wght 100–900, wdth 62–125) for display + UI; Instrument Serif for editorial accents.
const archivo = localFont({ src: "../fonts/archivo.woff2", weight: "100 900", style: "normal", variable: "--font-archivo", display: "swap", declarations: [{ prop: "font-stretch", value: "62% 125%" }] });
const instrument = localFont({
  src: [{ path: "../fonts/instrument-serif.woff2", weight: "400", style: "normal" }, { path: "../fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-instrument", display: "swap",
});

export const revalidate = 86400; // seasonal bar refreshes daily

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "DeckCraft Boston", template: "%s | DeckCraft Boston" },
  applicationName: "DeckCraft Boston",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  ...(noIndex ? { robots: { index: false, follow: false } } : {}),
};
export const viewport: Viewport = { themeColor: "#172637", width: "device-width", initialScale: 1 };

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />
      </head>
      <body className="antialiased" data-env={noIndex ? "staging" : undefined}>
        {GTM && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-cedar focus:p-3 focus:text-white">Skip to content</a>
        <SiteChrome><AnnouncementBar /><Header /></SiteChrome>
        <main id="main">{children}</main>
        <SiteChrome><Footer /></SiteChrome>
        <Tracking />
      </body>
    </html>
  );
}
