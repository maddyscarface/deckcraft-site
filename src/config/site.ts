/**
 * Single source of truth for business facts.
 * Anything marked OWNER_TO_CONFIRM renders as a visible placeholder or is hidden
 * until the owner supplies a real value. Never invent credentials, reviews or guarantees.
 */
export const OWNER_TO_CONFIRM = "[OWNER TO CONFIRM]";

export const site = {
  name: "DeckCraft Boston",
  domain: "deckcraftbuild.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://deckcraftbuild.com",
  tagline: "Decks Built for New England. Work You Can See.",
  secondaryTagline: "Repair. Restore. Protect. Build.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@deckcraftbuild.com",

  /**
   * No business number yet. Phone + click-to-call render ONLY when BOTH env vars are set
   * (display format + E.164). Never hard-code or show a placeholder number.
   */
  phone: (process.env.NEXT_PUBLIC_PHONE && process.env.NEXT_PUBLIC_PHONE_E164 ? process.env.NEXT_PUBLIC_PHONE : null) as string | null,
  phoneE164: (process.env.NEXT_PUBLIC_PHONE && process.env.NEXT_PUBLIC_PHONE_E164 ? process.env.NEXT_PUBLIC_PHONE_E164 : null) as string | null,

  /** Business-hour response promise. null → copy says "within one business day" is NOT claimed; neutral wording used. */
  responseHours: process.env.NEXT_PUBLIC_RESPONSE_HOURS || null as string | null, // e.g. "4"
  walkthroughFindingsDays: null as string | null,
  coiHours: null as string | null, // e.g. "24"

  hours: null as null | { days: string[]; opens: string; closes: string; label: string },

  /** Social profiles: unverified handles are hidden. Set the env var once the profile exists. */
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || null,
  } as Record<"instagram" | "facebook" | "tiktok", string | null>,

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

/** Staging / preview builds must never be indexed. Production on Vercel has VERCEL_ENV=production. */
export const noIndex = process.env.SITE_NOINDEX === "1" || process.env.VERCEL_ENV === "preview";

export function responsePhrase() {
  return site.responseHours
    ? `within ${site.responseHours} business hours`
    : "as soon as we've reviewed your photos"; // neutral until the owner sets a real SLA
}

export function phoneHref() {
  return site.phoneE164 ? `tel:${site.phoneE164}` : null;
}
