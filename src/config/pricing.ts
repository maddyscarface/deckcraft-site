/**
 * The ONLY prices the public site may show (Phase 2 spec §2).
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
  exclusions: "Excludes permits and drawings, demolition and disposal of an existing deck, footings in ledge or poor soil, electrical work and HOA review fees unless listed in your written estimate.",
  noGuarantee: "These are planning assumptions, not a quote. Your price is set only in a written estimate after we confirm the site in person.",
  repairNote: "Repair, staining and sealing are priced separately from new decks: we quote them from your photos and confirm on site.",
} as const;

/** Short eyebrow + separate flag so the "owner to confirm" status never wraps a heading line. */
export const pricingEyebrow = () => (PRICING.confirmed ? "Planning pricing" : "Planning assumption");
export const pricingFlag = () => (PRICING.confirmed ? null : "Owner to confirm");
export const pricingLabel = () => (PRICING.confirmed ? "Planning pricing" : "Planning assumption (owner to confirm)");

/** Starting figure for a deck of `sqft` (never shown as a final price). */
export function newDeckStartingAt(sqft: number): number {
  return Math.round(Math.max(0, sqft) * PRICING.newDeckStartPerSqFt);
}

export function bandFor(amount: number) {
  return PRICING.planningBands.find((b) => amount >= b.min && (b.max === null || amount < b.max)) ?? null;
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
