import type { EstimateConfig } from "@/lib/estimate/qualifiers";
import type { BriefTheme } from "@/lib/estimate/lead-brief";
import type { QualifierTheme } from "@/components/estimate/EstimateQualifiers";

/**
 * DeckCraft pre-estimate qualifiers.
 *
 * [OWNER TO CONFIRM] Every `typical` range below is a planning placeholder. Repair, staining and
 * resurfacing are derived from PRICE_GUIDE in src/lib/services.ts; new-deck and fence ranges are
 * assumptions (~$45–75/sq ft wood, ~$60–110/sq ft composite installed). Replace with your own
 * job history, then set rangesConfirmed: true.
 *
 * favorites: there are no real gallery jobs yet (src/lib/gallery.ts is empty), so customers pick
 * styles. When you publish real jobs with permission, add them here, e.g.
 * { id: "maple-ave", label: "Maple Ave, Newton", hint: "Gray composite + cable rail" }.
 */
const sq = (w: number, l: number) => `${w}×${l} (${w * l} sq ft)`;

export const estimateConfig: EstimateConfig = {
  brand: "DeckCraft Boston",
  visitLabel: "estimate visit",
  timezone: "America/New_York",
  tzLabel: "Eastern Time",
  projectTypes: [
    {
      id: "deck_repair", label: "Deck repair",
      sizes: [
        { id: "small", label: "Small fix", hint: "A few boards or one step", typical: [400, 1200] },
        { id: "medium", label: "Several boards or a railing section", typical: [1160, 4161] },
        { id: "large", label: "Major repair", hint: "Framing, stairs or large areas", typical: [4000, 12000] },
      ],
      addOns: [
        { id: "railing_repair", label: "Railing repair", typical: [500, 2500] },
        { id: "stairs_repair", label: "Stair repair", typical: [600, 2500] },
      ],
    },
    {
      id: "staining", label: "Staining or sealing",
      sizes: [
        { id: "s150", label: "Up to 150 sq ft", hint: "About 12×12", typical: [800, 1350] },
        { id: "s300", label: "150–300 sq ft", typical: [1200, 2400] },
        { id: "s500", label: "300–500 sq ft", typical: [2000, 3800] },
        { id: "s500p", label: "500+ sq ft", typical: [3500, 6500] },
      ],
      addOns: [
        { id: "rail_stain", label: "Railings", typical: [300, 900] },
        { id: "stairs_stain", label: "Stairs", typical: [200, 600] },
      ],
    },
    {
      id: "resurface", label: "Resurface (new boards, keep frame)",
      sizes: [
        { id: "12x12", label: sq(12, 12), typical: [2200, 7200] },
        { id: "12x16", label: sq(12, 16), typical: [2900, 9600] },
        { id: "16x20", label: sq(16, 20), typical: [4800, 16000] },
        { id: "20x24", label: sq(20, 24), typical: [7200, 24000] },
      ],
    },
    {
      id: "new_deck_wood", label: "New deck: pressure-treated wood",
      sizes: [
        { id: "12x12", label: sq(12, 12), typical: [6500, 11000] },
        { id: "12x16", label: sq(12, 16), typical: [8500, 14500] },
        { id: "16x20", label: sq(16, 20), typical: [14500, 24000] },
        { id: "20x24", label: sq(20, 24), typical: [21500, 36000] },
      ],
      addOns: [
        { id: "stairs", label: "Stairs", typical: [1500, 4000] },
        { id: "rail_upgrade", label: "Upgraded railings (aluminum or cable)", typical: [2500, 8000] },
        { id: "lighting", label: "Built-in lighting", typical: [800, 2500] },
        { id: "demo", label: "Remove the old deck", typical: [1500, 4000] },
      ],
    },
    {
      id: "new_deck_composite", label: "New deck: composite",
      sizes: [
        { id: "12x12", label: sq(12, 12), typical: [9000, 16000] },
        { id: "12x16", label: sq(12, 16), typical: [11500, 21000] },
        { id: "16x20", label: sq(16, 20), typical: [19000, 35000] },
        { id: "20x24", label: sq(20, 24), typical: [29000, 53000] },
      ],
      addOns: [
        { id: "stairs", label: "Stairs", typical: [1800, 4500] },
        { id: "rail_upgrade", label: "Upgraded railings (aluminum or cable)", typical: [2500, 8000] },
        { id: "lighting", label: "Built-in lighting", typical: [800, 2500] },
        { id: "demo", label: "Remove the old deck", typical: [1500, 4000] },
      ],
    },
    {
      id: "fence", label: "Fence",
      sizes: [
        { id: "repair", label: "Fence or gate repair", typical: [400, 1500] },
        { id: "lf100", label: "New fence, up to 100 ft", typical: [4000, 9000] },
        { id: "lf200", label: "New fence, 100–200 ft", typical: [8000, 18000] },
        { id: "lf200p", label: "New fence, 200+ ft", typical: [16000, 35000] },
      ],
      addOns: [{ id: "gate", label: "New gate", typical: [600, 2000] }],
    },
  ],
  budgetBands: [
    { id: "lt2_5k", label: "Under $2.5k", min: 0, max: 2500 },
    { id: "2_5_5k", label: "$2.5–5k", min: 2500, max: 5000 },
    { id: "5_10k", label: "$5–10k", min: 5000, max: 10000 },
    { id: "10_25k", label: "$10–25k", min: 10000, max: 25000 },
    { id: "25_35k", label: "$25–35k", min: 25000, max: 35000 },
    { id: "35_50k", label: "$35–50k", min: 35000, max: 50000 },
    { id: "50kp", label: "$50k+", min: 50000, max: null },
    { id: "unsure", label: "Not sure yet", min: 0, max: null },
  ],
  startOptions: [
    { id: "asap", label: "As soon as possible" },
    { id: "within_30", label: "Within 30 days" },
    { id: "1_3m", label: "1–3 months" },
    { id: "next_spring", label: "Next spring" },
    { id: "researching", label: "Just researching" },
  ],
  timeWindows: [
    { id: "0800", label: "8:00 AM", start: "08:00", end: "09:00" },
    { id: "1000", label: "10:00 AM", start: "10:00", end: "11:00" },
    { id: "1200", label: "12:00 PM", start: "12:00", end: "13:00" },
    { id: "1400", label: "2:00 PM", start: "14:00", end: "15:00" },
    { id: "1600", label: "4:00 PM", start: "16:00", end: "17:00" },
  ],
  minLeadDays: 1,
  favorites: {
    prompt: "Which looks do you like?",
    options: [
      { id: "modern_gray", label: "Modern gray composite" },
      { id: "warm_wood_tone", label: "Warm wood-tone composite" },
      { id: "natural_cedar", label: "Natural cedar" },
      { id: "black_metal_rail", label: "Black aluminum railings" },
      { id: "cable_rail", label: "Cable railings" },
      { id: "classic_white_rail", label: "Classic white railings" },
      { id: "wide_stairs", label: "Wide stairs or a landing" },
      { id: "lighting", label: "Step and post lighting" },
    ],
  },
  priceGuidePath: "/homeowners#price-guide",
  rangeNote: "Greater Boston planning range. Your exact price is confirmed in writing after the visit.",
  rangesConfirmed: false,
  addressRequired: true,
  addressLabel: "Property address (for the estimate visit)",
};

export const briefTheme: BriefTheme = { dark: "#1a3828", accent: "#d4b896", accentSoft: "#f5f0e8", ink: "#1a3828", muted: "#6b7c66" };

export const qualifierTheme: QualifierTheme = {
  input: "field",
  label: "label",
  chip: "choice",
  chipOn: "choice",
  box: "rounded-md border-2 border-hunter bg-cream p-4",
  muted: "text-hunter/70",
  link: "font-semibold underline",
};

/**
 * Qualifier start ids → the existing `timeline` enum (src/lib/lead-schema.ts TIMELINES), so routing
 * scores (asap +15, this_season +10), the timeline:* tag and GHL keep working. One question, one answer.
 */
export const START_TO_TIMELINE: Record<string, "asap" | "this_season" | "next_spring" | "planning"> = {
  asap: "asap",
  within_30: "this_season",
  "1_3m": "this_season",
  next_spring: "next_spring",
  researching: "planning",
};
