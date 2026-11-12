/**
 * Lead-scoring weights and tiers (owner-editable). Score = these rules + the estimate-qualifier score,
 * clamped 0–100. Tier is synced to GoHighLevel as a tag (`tier:hot|warm|nurture`) and custom field.
 */
export const SCORING = {
  base: 20,
  walkthroughForm: 25,
  propertyCustomer: 15, // any customer_type other than homeowner
  portfolio5Plus: 10,
  portfolio20Plus: 10,
  photosAttached: 15,
  timelineAsap: 15,
  timelineThisSeason: 10,
  highValueService: 5, // deck repair, railings/stairs, new deck, new fence
  highValueServices: ["deck_repair", "railings_stairs", "new_deck", "new_fence"],
  checkerInspection: 5,
  phoneProvided: 5,
} as const;

export const TIERS = [
  { tier: "hot", min: 70, label: "Hot: call within the hour" },
  { tier: "warm", min: 45, label: "Warm: same-day follow-up" },
  { tier: "nurture", min: 0, label: "Nurture: automated sequence" },
] as const;

export type Tier = (typeof TIERS)[number]["tier"];

export function tierFor(score: number): Tier {
  return (TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1]).tier;
}
