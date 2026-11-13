import type { MetadataRoute } from "next";
import { site, noIndex } from "@/config/site";

const PRIVATE = ["/admin", "/admin/", "/api/", "/thank-you", "/photo-credits"];

export default function robots(): MetadataRoute.Robots {
  // Staging, preview and unapproved hosts: block all crawlers. robots.txt is not access control.
  if (noIndex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // ChatGPT ads review and ChatGPT search may read public landing pages.
      { userAgent: ["OAI-AdsBot", "OAI-SearchBot"], allow: "/", disallow: PRIVATE },
    ],
    // Always the canonical production host — never a Vercel staging URL.
    sitemap: `${site.url}/sitemap.xml`,
  };
}
