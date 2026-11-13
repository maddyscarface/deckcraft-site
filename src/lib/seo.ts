import type { Metadata } from "next";
import { site, noIndex } from "@/config/site";
import { TOWNS } from "./towns";
import type { Faq } from "./services";
import type { Post } from "./blog";

export const CONTENT_UPDATED = "2026-11-13";

export function canonicalUrl(path: string): string {
  const p = path === "/" ? "" : path;
  return `${site.url}${p}`;
}

export function meta(
  path: string,
  title: string,
  description: string,
  opts: { noindex?: boolean; type?: "website" | "article"; image?: string; published?: string; modified?: string } = {},
): Metadata {
  const url = canonicalUrl(path);
  const image = opts.image || "/og.png";
  const robots = opts.noindex || noIndex ? { index: false, follow: false } : { index: true, follow: true };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: opts.type === "article" ? "article" : "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(opts.published ? { publishedTime: opts.published } : {}),
      ...(opts.modified ? { modifiedTime: opts.modified } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function businessNode() {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description:
      "Deck building, repair, staining, railings and residential and commercial fencing for Greater Boston homeowners, associations, landlords and businesses.",
    url: site.url,
    email: site.email,
    ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
    areaServed: TOWNS.map((t) => ({ "@type": "City", name: `${t.name}, MA`, "@id": `${site.url}/${t.slug}#place` })),
    knowsAbout: [
      "Deck building",
      "Deck replacement",
      "Deck repair",
      "Deck staining and sealing",
      "Deck railings and stairs",
      "Fence installation",
      "Fence repair",
      "Commercial fencing",
    ],
    ...(site.hours
      ? { openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }] }
      : {}),
    sameAs: Object.values(site.social).filter(Boolean),
    // Reviews, street address, licences and aggregate ratings are omitted until the owner verifies them.
  };
}

function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: "Deck building, repair and fencing for Greater Boston homeowners and property managers.",
    publisher: { "@id": `${site.url}/#business` },
    inLanguage: "en-US",
  };
}

/** Organization graph used on the homepage. Does not invent address, reviews or hours. */
export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [businessNode(), webSiteNode()],
  };
}

export function webPageSchema(path: string, name: string, description?: string) {
  return {
    "@type": "WebPage",
    "@id": `${canonicalUrl(path)}#webpage`,
    url: canonicalUrl(path),
    name,
    ...(description ? { description } : {}),
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#business` },
    inLanguage: "en-US",
  };
}

export function serviceSchema(serviceType: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl(path)}#service`,
    name: serviceType,
    serviceType,
    url: canonicalUrl(path),
    provider: { "@id": `${site.url}/#business` },
    areaServed: TOWNS.map((t) => ({ "@type": "City", name: `${t.name}, MA` })),
    mainEntityOfPage: { "@id": `${canonicalUrl(path)}#webpage` },
  };
}

/** FAQ schema only for Q&A that is literally rendered on the page. */
export function faqSchema(faqs: Faq[], path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: canonicalUrl(path),
    })),
  };
}

export function articleSchema(post: Post) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated || post.published,
    author: { "@type": "Organization", name: site.name, "@id": `${site.url}/#business` },
    publisher: { "@id": `${site.url}/#business` },
    image: `${site.url}/og.png`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    inLanguage: "en-US",
  };
}

/** Compose a single graph so layout and page do not emit conflicting duplicates. */
export function pageGraph(nodes: object[]) {
  const clean = nodes.map((n) => {
    const rest = { ...(n as Record<string, unknown>) };
    delete rest["@context"];
    return rest;
  });
  return { "@context": "https://schema.org", "@graph": clean };
}
