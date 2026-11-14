/**
 * PHASE 4: INTERNAL ONLY. The public site shows NO prices, starting rates, bands or calculations (owner rule:
 * customers never see pricing; prices exist only in owner-approved written proposals). These reference figures are
 * kept for internal lead triage only and are guarded by tests/p4-public-leak.test.ts. Phase 2 note follows.
 *
 * (Phase 2) The ONLY prices the public site may show (Phase 2 spec §2).
 *
 * OWNER TO CONFIRM: both figures come from the owner's reference notes. Keep `confirmed: false` until the owner
 * confirms they reflect the current offering. While false, every place they appear carries an
 * "assumption, to be confirmed" label. Repair, staining and sealing are NOT priced publicly. They are quoted
 * from photos, separately from new-deck pricing.
 */
export const PRICING = {
  confirmed: false,
  newDeckStartPerSqFt: 39.99,
  planningBands: [
    { id: "8_15k", label: "$8k–15k", min: 8000, max: 15000, fits: "Smaller ground-level decks, simple stairs" },
    { id: "15_25k", label: "$15k–25k", min: 15000, max: 25000, fits: "Mid-size decks, upgraded railings or composite" },
    { id: "25kp", label: "$25k+", min: 25000, max: null as number | null, fits: "Large, elevated or multi-level decks" },
  ],
  assumptions: [
    "Starting assumption for a new pressure-treated deck on a straightforward site, per square foot of deck surface.",
    "Composite, cedar, elevated or multi-level decks, upgraded railings, lighting and complex stairs cost more.",
  ],
  exclusions: "Your written estimate lists exactly what is included, such as permits and drawings, removal of an old deck, footings, electrical work or HOA review.",
  noGuarantee: "We don\u2019t publish prices or calculators. Your price is set only in a written estimate after we review your project and confirm the site in person.",
  repairNote: "Repairs, staining, sealing, railings and fences are scoped from your photos or guided walkthrough, then confirmed on site.",
} as const;

/** Short eyebrow + separate flag so the "owner to confirm" status never wraps a heading line. */
export const pricingEyebrow = () => "How we quote";
export const pricingFlag = (): string | null => null;
export const pricingLabel = () => (PRICING.confirmed ? "Planning pricing" : "Planning assumption (owner to confirm)");

/** Starting figure for a deck of `sqft` (never shown as a final price). */
export function newDeckStartingAt(sqft: number): number {
  return Math.round(Math.max(0, sqft) * PRICING.newDeckStartPerSqFt);
}

export function bandFor(amount: number) {
  return PRICING.planningBands.find((b) => amount >= b.min && (b.max === null || amount < b.max)) ?? null;
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
