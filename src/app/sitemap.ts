import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { TOWNS } from "@/lib/towns";
import { POSTS } from "@/lib/blog";
import { SITEMAP_CORE_PATHS, lastModifiedFor, PHASE3_CONTENT_DATE } from "@/lib/seo-inventory";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...SITEMAP_CORE_PATHS.map((p) => {
      const path = p === "/" ? "" : p;
      const date = lastModifiedFor(p);
      return {
        url: `${site.url}${path}`,
        lastModified: date,
        priority: p === "/" ? 1 : p.includes("free-assessment") || p.includes("new-deck-estimate") || p.includes("walkthrough") ? 0.9 : 0.7,
      };
    }),
    ...TOWNS.map((t) => ({
      url: `${site.url}/${t.slug}`,
      lastModified: PHASE3_CONTENT_DATE,
      priority: 0.6,
    })),
    ...POSTS.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.updated || p.published,
      priority: 0.55,
    })),
  ];
}
