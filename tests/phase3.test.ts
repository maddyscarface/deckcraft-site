import { describe, expect, it } from "vitest";
import { canonicalOrigin, isIndexableSite, INTENDED_PRODUCTION_ORIGIN } from "@/config/indexing";
import { noIndex, site } from "@/config/site";
import { businessSchema, canonicalUrl, CONTENT_UPDATED, faqSchema, meta } from "@/lib/seo";
import { POSTS } from "@/lib/blog";
import { TOWNS } from "@/lib/towns";
import { SERVICES } from "@/lib/services";
import { ROUTE_SEO, SITEMAP_CORE_PATHS, lastModifiedFor, PHASE3_CONTENT_DATE } from "@/lib/seo-inventory";
import { PRICING, pricingLabel } from "@/config/pricing";
import { SCOPING_STEPS } from "@/lib/scoping";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { GALLERY } from "@/lib/gallery";

const env = (o: Record<string, string | undefined>) => o as unknown as NodeJS.ProcessEnv;

describe("canonical host and indexing flag", () => {
  it("never uses a Vercel or localhost host as the canonical origin", () => {
    expect(canonicalOrigin(env({ NEXT_PUBLIC_SITE_URL: "https://deckcraft-staging.vercel.app" }))).toBe(INTENDED_PRODUCTION_ORIGIN);
    expect(canonicalOrigin(env({ NEXT_PUBLIC_SITE_URL: "https://deckcraft-site.vercel.app" }))).toBe(INTENDED_PRODUCTION_ORIGIN);
    expect(canonicalOrigin(env({ NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100" }))).toBe(INTENDED_PRODUCTION_ORIGIN);
    expect(canonicalOrigin(env({}))).toBe(INTENDED_PRODUCTION_ORIGIN);
    expect(canonicalOrigin(env({ NEXT_PUBLIC_SITE_URL: "https://deckcraftbuild.com" }))).toBe("https://deckcraftbuild.com");
    expect(canonicalOrigin(env({ NEXT_PUBLIC_SITE_URL: "https://www.deckcraftbuild.com/" }))).toBe("https://www.deckcraftbuild.com");
  });

  it("keeps the site noindex until the owner sets the production launch flag", () => {
    expect(isIndexableSite(env({}))).toBe(false);
    expect(isIndexableSite(env({ VERCEL_ENV: "preview" }))).toBe(false);
    expect(isIndexableSite(env({ VERCEL_ENV: "production" }))).toBe(false);
    expect(isIndexableSite(env({ VERCEL_ENV: "production", NEXT_PUBLIC_INDEXABLE_SITE: "true", SITE_NOINDEX: "1" }))).toBe(false);
    expect(isIndexableSite(env({ VERCEL_ENV: "production", NEXT_PUBLIC_INDEXABLE_SITE: "true" }))).toBe(true);
    expect(noIndex).toBe(true); // this test run has no launch flag
    expect(site.url).toBe(INTENDED_PRODUCTION_ORIGIN);
    expect(canonicalUrl("/newton")).toBe("https://deckcraftbuild.com/newton");
  });
});

describe("robots and sitemap", () => {
  it("blocks all crawlers when the site is not indexable", () => {
    const r = robots();
    expect(r.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(r).not.toHaveProperty("sitemap");
  });

  it("lists only public indexable routes, towns and posts, with content dates rather than build time", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://deckcraftbuild.com");
    expect(urls).toContain("https://deckcraftbuild.com/services/new-decks");
    expect(urls).toContain("https://deckcraftbuild.com/newton");
    expect(urls).toContain("https://deckcraftbuild.com/blog/how-a-written-deck-estimate-works");
    expect(urls.some((u) => u.includes("thank-you"))).toBe(false);
    expect(urls.some((u) => u.includes("photo-credits"))).toBe(false);
    expect(urls.some((u) => u.includes("admin"))).toBe(false);
    expect(urls.every((u) => !u.includes("vercel.app"))).toBe(true);
    for (const e of entries) {
      const raw = typeof e.lastModified === "string" ? e.lastModified : e.lastModified instanceof Date ? e.lastModified.toISOString() : "";
      expect(raw.startsWith("2026-")).toBe(true);
    }
    // Must not stamp every URL with today's clock — core pages share the inventory date.
    expect(lastModifiedFor("/")).toBe(PHASE3_CONTENT_DATE);
    expect(CONTENT_UPDATED).toBe(PHASE3_CONTENT_DATE);
  });

  it("includes every indexable inventory path", () => {
    const urls = new Set(sitemap().map((e) => e.url));
    for (const path of SITEMAP_CORE_PATHS) {
      const url = path === "/" ? "https://deckcraftbuild.com" : `https://deckcraftbuild.com${path}`;
      expect(urls.has(url)).toBe(true);
    }
  });
});

describe("metadata proposals from the Phase 3 brief", () => {
  it("uses the specified titles and descriptions on home, repair, new decks and fencing", () => {
    const want = {
      "/": ["Deck Builders & Repairs in Boston | DeckCraft", "Deck building, replacement, repair, staining and fencing across Greater Boston. Request a scoped estimate from DeckCraft."],
      "/services/deck-repair": ["Deck Repair in Greater Boston | DeckCraft", "Get a photo-based assessment for deck structure, boards, stairs or railings. DeckCraft serves Greater Boston homeowners."],
      "/services/new-decks": ["New Deck Construction in Boston | DeckCraft", "Plan a new deck in Greater Boston with a clear scope, materials discussion and written estimate from DeckCraft."],
      "/fencing": ["Fence Installation in Boston | DeckCraft", "Residential and commercial fencing services in Greater Boston. Explore materials and request a project assessment."],
    };
    for (const [path, [title, desc]] of Object.entries(want)) {
      const row = ROUTE_SEO.find((r) => r.path === path)!;
      expect(row.title).toBe(title);
      expect(row.description).toBe(desc);
    }
    expect(SERVICES["services/deck-repair"].title).toBe(want["/services/deck-repair"][0]);
    expect(SERVICES["services/new-decks"].title).toBe(want["/services/new-decks"][0]);
  });

  it("marks thank-you and photo-credits as noindex in the inventory", () => {
    expect(ROUTE_SEO.find((r) => r.path === "/thank-you")?.indexable).toBe(false);
    expect(ROUTE_SEO.find((r) => r.path === "/photo-credits")?.indexable).toBe(false);
    const m = meta("/thank-you", "Thank You | DeckCraft Boston", "Your request was received.", { noindex: true });
    expect(m.robots).toEqual({ index: false, follow: false });
    expect((m.alternates as { canonical?: string }).canonical).toBe("https://deckcraftbuild.com/thank-you");
  });
});

describe("schema", () => {
  it("describes a HomeAndConstructionBusiness with configured towns only, and no invented reviews", () => {
    const graph = businessSchema();
    const biz = (graph["@graph"] as { "@type": string; areaServed: { name: string }[]; aggregateRating?: unknown }[])[0];
    expect(biz["@type"]).toBe("HomeAndConstructionBusiness");
    expect(biz.areaServed).toHaveLength(TOWNS.length);
    expect(biz.areaServed.map((c) => c.name)).toContain("Newton, MA");
    expect(biz).not.toHaveProperty("aggregateRating");
    expect(JSON.stringify(graph)).not.toMatch(/"review"/i);
    expect(JSON.stringify(graph)).not.toContain("vercel.app");
  });

  it("escapes < in JSON-LD the same way the JsonLd component does", () => {
    const faqs = [{ q: "Is <script> safe?", a: "We escape < in structured data." }];
    const html = JSON.stringify(faqSchema(faqs, "/")).replace(/</g, "\\u003c");
    expect(html).toContain("\\u003c");
    expect(html).not.toContain("<script>");
  });
});

describe("editorial guides and towns", () => {
  it("publishes the five buyer guides with unique slugs and concise answers", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(slugs).toEqual(expect.arrayContaining([
      "deck-repair-vs-replace",
      "composite-vs-pressure-treated-deck-boards",
      "when-should-a-railing-be-inspected",
      "deck-maintenance-before-winter",
      "how-a-written-deck-estimate-works",
    ]));
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(POSTS.find((p) => p.slug === "deck-repair-vs-replace")?.title).toBe("Deck Repair vs Replacement in Massachusetts");
    for (const p of POSTS) {
      const words = p.answer.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(35);
      expect(words).toBeLessThanOrEqual(90);
      expect(p.published).toMatch(/^2026-/);
    }
  });

  it("keeps 15 unique town pages and a three-step scoping method", () => {
    expect(TOWNS).toHaveLength(15);
    expect(new Set(TOWNS.map((t) => t.intro)).size).toBe(15);
    expect(SCOPING_STEPS).toHaveLength(3);
  });

  it("does not treat empty gallery items as real jobs, and keeps pricing as planning assumptions", () => {
    expect(GALLERY).toEqual([]);
    expect(pricingLabel()).toMatch(/owner to confirm/i);
    expect(PRICING.newDeckStartPerSqFt).toBe(39.99);
  });
});

describe("brand icon files listed for staging verification", () => {
  it("names the public icon and manifest URLs the layout exposes", () => {
    const paths = ["/favicon.ico", "/favicon.svg", "/icon.svg", "/icon-32.png", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/site.webmanifest"];
    expect(paths).toHaveLength(8);
  });
});
