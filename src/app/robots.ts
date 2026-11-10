import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: [
    { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/thank-you"] },
    // ChatGPT ads review + ChatGPT search must be able to read landing pages.
    { userAgent: ["OAI-AdsBot", "OAI-SearchBot"], allow: "/", disallow: ["/admin", "/api/"] },
  ], sitemap: `${site.url}/sitemap.xml` };
}
