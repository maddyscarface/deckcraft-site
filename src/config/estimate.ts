import type { EstimateConfig } from "@/lib/estimate/qualifiers";
import type { BriefTheme } from "@/lib/estimate/lead-brief";
import type { QualifierTheme } from "@/components/estimate/EstimateQualifiers";

/**
 * DeckCraft pre-estimate qualifiers: PUBLIC, client-safe config.
 *
 * PHASE 4: customers never see prices, ranges, budget brackets or calculations. This file is bundled into client
 * components, so it carries NO numbers. Internal typical ranges live in ./estimate-internal.ts (server-only).
 *
 * favorites: there are no real gallery jobs yet (src/lib/gallery.ts is empty), so customers pick styles.
 */
const sq = (w: number, l: number) => `${w}×${l} (${w * l} sq ft)`;

export const estimateConfig: EstimateConfig = {
  brand: "DeckCraft Boston",
  visitLabel: "site visit",
  timezone: "America/New_York",
  tzLabel: "Eastern Time",
  projectTypes: [
    {
      id: "deck_repair", label: "Deck repair",
      sizes: [
        { id: "small", label: "Small fix", hint: "A few boards or one step" },
        { id: "medium", label: "Several boards or a railing section" },
        { id: "large", label: "Major repair", hint: "Framing, stairs or large areas" },
      ],
      addOns: [
        { id: "railing_repair", label: "Railing repair" },
        { id: "stairs_repair", label: "Stair repair" },
      ],
    },
    {
      id: "staining", label: "Staining or sealing",
      sizes: [
        { id: "s150", label: "Up to 150 sq ft", hint: "About 12×12" },
        { id: "s300", label: "150–300 sq ft" },
        { id: "s500", label: "300–500 sq ft" },
        { id: "s500p", label: "500+ sq ft" },
      ],
      addOns: [
        { id: "rail_stain", label: "Railings" },
        { id: "stairs_stain", label: "Stairs" },
      ],
    },
    {
      id: "resurface", label: "Resurface (new boards, keep frame)",
      sizes: [
        { id: "12x12", label: sq(12, 12) },
        { id: "12x16", label: sq(12, 16) },
        { id: "16x20", label: sq(16, 20) },
        { id: "20x24", label: sq(20, 24) },
      ],
    },
    {
      id: "new_deck_wood", label: "New deck: pressure-treated wood",
      sizes: [
        { id: "12x12", label: sq(12, 12) },
        { id: "12x16", label: sq(12, 16) },
        { id: "16x20", label: sq(16, 20) },
        { id: "20x24", label: sq(20, 24) },
      ],
      addOns: [
        { id: "stairs", label: "Stairs" },
        { id: "rail_upgrade", label: "Upgraded railings (aluminum or cable)" },
        { id: "lighting", label: "Built-in lighting" },
        { id: "demo", label: "Remove the old deck" },
      ],
    },
    {
      id: "new_deck_composite", label: "New deck: composite",
      sizes: [
        { id: "12x12", label: sq(12, 12) },
        { id: "12x16", label: sq(12, 16) },
        { id: "16x20", label: sq(16, 20) },
        { id: "20x24", label: sq(20, 24) },
      ],
      addOns: [
        { id: "stairs", label: "Stairs" },
        { id: "rail_upgrade", label: "Upgraded railings (aluminum or cable)" },
        { id: "lighting", label: "Built-in lighting" },
        { id: "demo", label: "Remove the old deck" },
      ],
    },
    {
      id: "fence", label: "Fence",
      sizes: [
        { id: "repair", label: "Fence or gate repair" },
        { id: "lf100", label: "New fence, up to 100 ft" },
        { id: "lf200", label: "New fence, 100–200 ft" },
        { id: "lf200p", label: "New fence, 200+ ft" },
      ],
      addOns: [{ id: "gate", label: "New gate" }],
    },
  ],
  // Phase 4: no budget question and no budget brackets on the public site.
  budgetBands: [],

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
  rangeNote: "",
  rangesConfirmed: false,
  addressRequired: true,
  addressLabel: "Property address (so we can check access and permits)",
};

export const briefTheme: BriefTheme = { dark: "#172637", accent: "#ad7047", accentSoft: "#f5f2ec", ink: "#24282d", muted: "#617080" };

export const qualifierTheme: QualifierTheme = {
  input: "field",
  label: "label",
  chip: "choice",
  chipOn: "choice",
  box: "border border-line border-l-[3px] border-l-copper bg-bone p-4",
  muted: "text-stone",
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
