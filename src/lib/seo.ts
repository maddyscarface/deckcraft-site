import type { Metadata } from "next";
import { site } from "@/config/site";
import { TOWNS } from "./towns";
import type { Faq } from "./services";

export function meta(path: string, title: string, description: string, opts: { noindex?: boolean } = {}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url, siteName: site.name, type: "website", locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: "Deck repair, staining, railings, and residential and commercial fencing for Greater Boston homeowners, associations, landlords, and businesses.",
    url: site.url,
    email: site.email,
    ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
    areaServed: TOWNS.map((t) => ({ "@type": "City", name: `${t.name}, MA` })),
    knowsAbout: ["Deck repair", "Deck staining", "Deck railings", "Fence installation", "Fence repair", "Commercial fencing"],
    ...(site.hours ? { openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }] } : {}),
    sameAs: Object.values(site.social),
    // aggregateRating intentionally omitted until it reflects real, first-party reviews.
  };
}

export function serviceSchema(serviceType: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    url: `${site.url}${path}`,
    provider: { "@id": `${site.url}/#business` },
    areaServed: { "@type": "Place", name: "Greater Boston, MA" },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path}` })),
  };
}
