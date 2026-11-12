/**
 * DeckCraft's own GoHighLevel mapping (separate sub-account / location from BuildGhana, PortfolioWorks
 * and StoneCraft). IDs come from env so nothing account-specific is committed.
 *
 *   GHL_API_TOKEN                 Private Integration token for the DeckCraft sub-account (server only)
 *   GHL_LOCATION_ID               DeckCraft location (sub-account) ID
 *   GHL_PIPELINE_RESIDENTIAL_ID   "DeckCraft · Homeowner Projects" pipeline
 *   GHL_PIPELINE_COMMERCIAL_ID    "DeckCraft · HOA / Commercial" pipeline
 *   GHL_STAGE_IDS                 JSON: { "residential": { "<stage>": "<id>" }, "commercial": { ... } }
 *   GHL_CUSTOM_FIELD_IDS          JSON: { "<field key>": "<GHL custom field id>" } (keys below)
 *   GHL_WORKFLOW_IDS              JSON: { "<sequence key>": "<workflow id>" } (optional; tags also trigger workflows)
 *   GHL_OWNER_IDS                 JSON: { "residential"|"commercial"|"<geography>": "<GHL user id>" } (sales owner)
 */
export const DECKCRAFT_PIPELINES = {
  residential: { name: "DeckCraft · Homeowner Projects", env: "GHL_PIPELINE_RESIDENTIAL_ID" },
  commercial: { name: "DeckCraft · HOA / Commercial", env: "GHL_PIPELINE_COMMERCIAL_ID" },
} as const;
export type PipelineKey = keyof typeof DECKCRAFT_PIPELINES;

/**
 * Stage names EXACTLY as the Phase 2 spec §3. Create them in GHL with these names, in this order.
 * (a) Homeowner: New → Contact attempted → Photos received → Qualified → Inspection booked → Estimate sent → Follow-up → Won/Lost
 * (b) HOA/commercial: Inquiry → Property review → Walkthrough → Bid/RFP → Negotiation → Won/Lost
 * "Won/Lost" is one closing stage; the opportunity STATUS (won | lost) records the outcome.
 */
export const RESIDENTIAL_STAGES = [
  { key: "new", name: "New" },
  { key: "contact_attempted", name: "Contact attempted" },
  { key: "photos_received", name: "Photos received" },
  { key: "qualified", name: "Qualified" },
  { key: "inspection_booked", name: "Inspection booked" },
  { key: "estimate_sent", name: "Estimate sent" },
  { key: "follow_up", name: "Follow-up" },
  { key: "won_lost", name: "Won/Lost" },
] as const;
export const COMMERCIAL_STAGES = [
  { key: "inquiry", name: "Inquiry" },
  { key: "property_review", name: "Property review" },
  { key: "walkthrough", name: "Walkthrough" },
  { key: "bid_rfp", name: "Bid/RFP" },
  { key: "negotiation", name: "Negotiation" },
  { key: "won_lost", name: "Won/Lost" },
] as const;
export const PIPELINE_STAGES = { residential: RESIDENTIAL_STAGES, commercial: COMMERCIAL_STAGES } as const;
export type StageKey = (typeof RESIDENTIAL_STAGES)[number]["key"] | (typeof COMMERCIAL_STAGES)[number]["key"];
/** Kept for docs / health output. */
export const STAGES = [...RESIDENTIAL_STAGES, ...COMMERCIAL_STAGES.filter((s) => s.key !== "won_lost")];

/**
 * Events the CRM stage webhook accepts. Each resolves to a pipeline stage (+ won/lost status) and, where relevant,
 * a measurement event. `paid` is a revenue event (no stage move); `no_show` only triggers the no-show sequence.
 * Legacy names (estimate_booked, walkthrough_booked, new_lead) are accepted so existing GHL workflows keep working.
 */
export const CRM_EVENTS = {
  new: { stage: "new" }, new_lead: { stage: "new" }, contact_attempted: { stage: "contact_attempted" },
  photos_received: { stage: "photos_received" }, qualified: { stage: "qualified" },
  inspection_booked: { stage: "inspection_booked" }, estimate_booked: { stage: "inspection_booked" },
  estimate_sent: { stage: "estimate_sent" }, follow_up: { stage: "follow_up" },
  inquiry: { stage: "inquiry" }, property_review: { stage: "property_review" },
  walkthrough: { stage: "walkthrough" }, walkthrough_booked: { stage: "walkthrough" },
  bid_rfp: { stage: "bid_rfp" }, negotiation: { stage: "negotiation" },
  won: { stage: "won_lost", status: "won" }, lost: { stage: "won_lost", status: "lost" },
  paid: { stage: null }, no_show: { stage: null },
} as const satisfies Record<string, { stage: StageKey | null; status?: "won" | "lost" }>;
export type CrmEvent = keyof typeof CRM_EVENTS;

/** Geography (from the town's region) and sales-owner assignment. */
export const GEOGRAPHIES = ["Boston", "Inner suburbs", "MetroWest", "North", "South", "Other"] as const;

/** Custom fields to create on the DeckCraft contact (Settings → Custom Fields), mapped via GHL_CUSTOM_FIELD_IDS. */
export const CUSTOM_FIELDS = [
  "dc_lead_id", "dc_lead_score", "dc_lead_tier", "dc_funnel", "dc_customer_type", "dc_services", "dc_town",
  "dc_timeline", "dc_property_count", "dc_photo_urls", "dc_source_page",
  "dc_utm_source", "dc_utm_medium", "dc_utm_campaign", "dc_utm_term", "dc_utm_content",
  "dc_gclid", "dc_gbraid", "dc_wbraid", "dc_fbclid", "dc_msclkid", "dc_landing_page", "dc_first_touch_at",
  "dc_openai_obref", "dc_openai_oppref",
  "est_project_type", "est_size", "est_add_ons", "est_budget", "est_typical_range", "est_budget_fit", "est_offer_guidance",
  "est_start", "est_preferred_date", "est_preferred_time", "est_favorites", "est_saw_pricing", "est_address",
  "dc_revenue_won", "dc_revenue_paid", "dc_geography", "dc_zip", "dc_work_type", "dc_current_structure",
  "dc_material_preference", "dc_access", "dc_hoa_permit", "dc_availability", "dc_urgency", "dc_procurement",
  "dc_preferred_contact", "dc_structure_count",
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
  /** GHL user IDs: { "residential": "...", "commercial": "...", "<geography>": "..." } (geography wins). */
  owners: Record<string, string>;
};

export function ghlConfig(e: NodeJS.ProcessEnv = process.env): GhlConfig {
  return {
    token: e.GHL_API_TOKEN,
    locationId: e.GHL_LOCATION_ID,
    pipelines: { residential: e.GHL_PIPELINE_RESIDENTIAL_ID, commercial: e.GHL_PIPELINE_COMMERCIAL_ID },
    stages: json(e.GHL_STAGE_IDS, {}),
    fields: json(e.GHL_CUSTOM_FIELD_IDS, {}),
    workflows: json(e.GHL_WORKFLOW_IDS, {}),
    owners: json(e.GHL_OWNER_IDS, {}),
  };
}

export const ghlApiReady = (c: GhlConfig) => Boolean(c.token && c.locationId);

export function ownerFor(c: GhlConfig, pipeline: PipelineKey | "none", geography?: string): string | undefined {
  return (geography && c.owners[geography]) || (pipeline !== "none" ? c.owners[pipeline] : undefined) || undefined;
}
