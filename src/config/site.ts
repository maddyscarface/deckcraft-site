/**
 * Single source of truth for business facts.
 * Anything marked OWNER_TO_CONFIRM renders as a visible placeholder or is hidden
 * until the owner supplies a real value. Never invent credentials, reviews or guarantees.
 */
export const OWNER_TO_CONFIRM = "[OWNER TO CONFIRM]";

export const site = {
  name: "DeckCraft Boston",
  domain: "deckcraftboston.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://deckcraftboston.com",
  tagline: "Deck Repair. Done Right. Built for Boston.",
  secondaryTagline: "Repair. Restore. Protect. Build.",
  email: "hello@deckcraftboston.com",

  /** Replace before launch. `null` hides phone CTAs and shows "Send photos" instead. */
  phone: process.env.NEXT_PUBLIC_PHONE || null as string | null, // e.g. "(617) 555-0100"
  phoneE164: process.env.NEXT_PUBLIC_PHONE_E164 || null as string | null, // e.g. "+16175550100"

  /** Business-hour response promise. null → copy says "within one business day" is NOT claimed; neutral wording used. */
  responseHours: process.env.NEXT_PUBLIC_RESPONSE_HOURS || null as string | null, // e.g. "4"
  walkthroughFindingsDays: null as string | null,
  coiHours: null as string | null, // e.g. "24"

  hours: null as null | { days: string[]; opens: string; closes: string; label: string },

  social: {
    instagram: "https://www.instagram.com/deckcraftboston",
    facebook: "https://www.facebook.com/deckcraftboston",
    tiktok: "https://www.tiktok.com/@deckcraftboston",
  },

  /** Credentials: leave false/null until verified with documents. */
  credentials: {
    licensedAndInsuredVerified: false,
    hicRegistration: null as string | null, // MA Home Improvement Contractor reg #
    csl: null as string | null, // MA Construction Supervisor License #
    insuranceCarrier: null as string | null,
  },

  /** Reviews: only real Google reviews, quoted with permission. */
  reviews: {
    live: false,
    rating: null as number | null,
    count: null as number | null,
    googleProfileUrl: null as string | null,
    items: [] as { text: string; name: string; town: string; source: "Google" }[],
  },

  inspectionsPerDay: 8, // OWNER TO CONFIRM — Portfolio Inspection Planner rate
} as const;

export function responsePhrase() {
  return site.responseHours
    ? `within ${site.responseHours} business hours`
    : "as soon as we've reviewed your photos"; // neutral until the owner sets a real SLA
}

export function phoneHref() {
  return site.phoneE164 ? `tel:${site.phoneE164}` : null;
}
