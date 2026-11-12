import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { TOWNS } from "@/lib/towns";
import { POSTS } from "@/lib/blog";

const CORE = ["", "/homeowners", "/services/deck-repair", "/services/deck-staining-sealing", "/services/board-railing-stairs", "/services/new-decks", "/services/deck-rebuild-resurfacing", "/project-calculator", "/new-deck-estimate",
  "/fencing", "/fencing/residential", "/fencing/commercial", "/property-programs", "/hoa-condo", "/landlords", "/commercial",
  "/free-assessment", "/request-walkthrough", "/repair-or-replace", "/portfolio-inspection-planner", "/gallery", "/about",
  "/service-areas", "/blog", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...CORE.map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === "" ? 1 : p.includes("free-assessment") || p.includes("walkthrough") ? 0.9 : 0.7 })),
    ...TOWNS.map((t) => ({ url: `${site.url}/${t.slug}`, lastModified: now, priority: 0.6 })),
    ...POSTS.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.published), priority: 0.5 })),
  ];
}
