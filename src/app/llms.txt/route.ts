import { site } from "@/config/site";
import { SITEMAP_CORE_PATHS } from "@/lib/seo-inventory";
import { POSTS } from "@/lib/blog";
import { TOWNS } from "@/lib/towns";

/**
 * Optional human-readable facts index for AI systems. Not a Google ranking signal.
 * Uses the canonical production origin, never a staging host. No private routes.
 */
export function GET() {
  const base = site.url;
  const publicPaths = SITEMAP_CORE_PATHS.filter((p) => !["/privacy", "/terms"].includes(p));
  const services = publicPaths.filter((p) => p.startsWith("/services") || p === "/fencing" || p.startsWith("/fencing/"));
  const body = `# DeckCraft Boston

> Deck building, repair and fencing for Greater Boston homeowners and property managers.

- Website: ${base}/
- Contact: ${base}/contact
- Email: ${site.email}
- Services: See the public service pages linked below.
- Geography: ${TOWNS.map((t) => t.name).join(", ")}. Coverage of each listed town is confirmed against crew routing before a visit is scheduled. This list is not a claim that every Massachusetts ZIP is served.
- Accuracy: Pricing and availability are subject to individual assessment. Public figures are planning assumptions, labelled as such. No legal, permitting or engineering clearance is implied unless it is documented in a written estimate.

## Public information
- Home: ${base}/
- New decks: ${base}/services/new-decks
- Deck repair: ${base}/services/deck-repair
- Fencing: ${base}/fencing
- Photo assessment: ${base}/free-assessment
- New deck estimate: ${base}/new-deck-estimate
- Service areas: ${base}/service-areas
- Resources: ${base}/blog
${services.map((p) => `- ${base}${p}`).join("\n")}

## Guides
${POSTS.map((p) => `- ${p.title}: ${base}/blog/${p.slug}`).join("\n")}

## Exclusions
Private cases, customer files, uploaded photos, the admin dashboard, thank-you pages, APIs and customer inquiries are not public reference material.
`.trimStart();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
