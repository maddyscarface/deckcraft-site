/**
 * DeckCraft's own GoHighLevel mapping (separate sub-account / location from BuildGhana, PortfolioWorks
 * and StoneCraft). IDs come from env so nothing account-specific is committed.
 *
 *   GHL_API_TOKEN                 Private Integration token for the DeckCraft sub-account (server only)
 *   GHL_LOCATION_ID               DeckCraft location (sub-account) ID
 *   GHL_PIPELINE_RESIDENTIAL_ID   "DeckCraft · Residential" pipeline
 *   GHL_PIPELINE_COMMERCIAL_ID    "DeckCraft · Property Programs" pipeline (HOA, landlord, commercial)
 *   GHL_STAGE_IDS                 JSON: { "residential": { "<stage>": "<id>" }, "commercial": { ... } }
 *   GHL_CUSTOM_FIELD_IDS          JSON: { "<field key>": "<GHL custom field id>" } (keys below)
 *   GHL_WORKFLOW_IDS              JSON: { "<sequence key>": "<workflow id>" } (optional; tags also trigger workflows)
 */
export const DECKCRAFT_PIPELINES = {
  residential: { name: "DeckCraft · Residential", env: "GHL_PIPELINE_RESIDENTIAL_ID" },
  commercial: { name: "DeckCraft · Property Programs", env: "GHL_PIPELINE_COMMERCIAL_ID" },
} as const;
export type PipelineKey = keyof typeof DECKCRAFT_PIPELINES;

/** Stage order in both pipelines. Create these stages in GHL with the same names. */
export const STAGES = [
  { key: "new_lead", name: "New lead" },
  { key: "photos_received", name: "Photos received" },
  { key: "qualified", name: "Qualified" },
  { key: "estimate_booked", name: "Site visit booked" },
  { key: "walkthrough_booked", name: "Walkthrough booked" },
  { key: "estimate_sent", name: "Estimate sent" },
  { key: "won", name: "Won / contract signed" },
  { key: "paid", name: "Paid" },
  { key: "lost", name: "Lost" },
] as const;
export type StageKey = (typeof STAGES)[number]["key"];

/** Custom fields to create on the DeckCraft contact (Settings → Custom Fields), mapped via GHL_CUSTOM_FIELD_IDS. */
export const CUSTOM_FIELDS = [
  "dc_lead_id", "dc_lead_score", "dc_lead_tier", "dc_funnel", "dc_customer_type", "dc_services", "dc_town",
  "dc_timeline", "dc_property_count", "dc_photo_urls", "dc_source_page",
  "dc_utm_source", "dc_utm_medium", "dc_utm_campaign", "dc_utm_term", "dc_utm_content",
  "dc_gclid", "dc_gbraid", "dc_wbraid", "dc_fbclid", "dc_msclkid", "dc_landing_page", "dc_first_touch_at",
  "dc_openai_obref", "dc_openai_oppref",
  "est_project_type", "est_size", "est_add_ons", "est_budget", "est_typical_range", "est_budget_fit", "est_offer_guidance",
  "est_start", "est_preferred_date", "est_preferred_time", "est_favorites", "est_saw_pricing", "est_address",
  "dc_revenue_won", "dc_revenue_paid",
] as const;
export type CustomFieldKey = (typeof CUSTOM_FIELDS)[number];

function json<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export type GhlConfig = {
  token?: string;
  locationId?: string;
  pipelines: Record<PipelineKey, string | undefined>;
  stages: Partial<Record<PipelineKey, Partial<Record<StageKey, string>>>>;
  fields: Partial<Record<CustomFieldKey, string>>;
  workflows: Record<string, string>;
};

export function ghlConfig(e: NodeJS.ProcessEnv = process.env): GhlConfig {
  return {
    token: e.GHL_API_TOKEN,
    locationId: e.GHL_LOCATION_ID,
    pipelines: { residential: e.GHL_PIPELINE_RESIDENTIAL_ID, commercial: e.GHL_PIPELINE_COMMERCIAL_ID },
    stages: json(e.GHL_STAGE_IDS, {}),
    fields: json(e.GHL_CUSTOM_FIELD_IDS, {}),
    workflows: json(e.GHL_WORKFLOW_IDS, {}),
  };
}

export const ghlApiReady = (c: GhlConfig) => Boolean(c.token && c.locationId);
