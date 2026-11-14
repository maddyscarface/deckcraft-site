import { z } from "zod";
import { MAIN, PROHIBITED_FIELDS } from "./catalog";

/**
 * Audience recipe = a reviewed, owner-approved plan for one DataMoon pull. Topics and criteria start as research
 * HYPOTHESES (no topic id) and must be replaced with ids/fields returned by the vendor's own discovery endpoints
 * before activation. Separate approvals: legal/data-purpose, export (credits), CRM sync.
 */
export const PERSONAS = ["homeowner_replacement", "seasonal_repair", "hoa_property_manager", "commercial_facilities"] as const;
export const DESTINATIONS = ["internal_review_only", "ghl_email_nurture", "meta_custom_audience", "google_customer_match"] as const;

const topic = z.object({ label: z.string().min(2).max(120), id: z.union([z.number().int(), z.string().max(80)]).nullable(), source: z.enum(["hypothesis", "catalog"]), reviewed_at: z.string().nullable() });
const criterion = z.object({ field: z.string().min(2).max(60), operator: z.string().max(12), value: z.union([z.string().max(200), z.array(z.string().max(80)).max(50)]).nullable(), verified: z.boolean(), discovered_at: z.string().nullable().optional() });

export const recipeSchema = z.object({
  id: z.string().max(60).optional(),
  brand: z.literal("deckcraft"),
  name: z.string().min(3).max(120),
  market: z.string().max(80),
  persona: z.enum(PERSONAS),
  audience_type: z.enum(["b2c", "b2b"]),
  api_family: z.enum(["main_module", "main_ext", "intent"]),
  topics: z.array(topic).max(10),
  geography: z.object({ states: z.array(z.string().length(2)).max(5), zips: z.array(z.string().regex(/^\d{5}$/)).max(400) }),
  lookback_days: z.number().int().min(1).max(90),
  criteria: z.array(criterion).max(20),
  max_records: z.number().int().min(0).max(1_000_000),
  estimated_credits: z.number().int().min(0).max(1_000_000),
  purpose: z.string().min(10).max(500),
  legal_basis: z.string().max(300),
  consent_basis: z.string().max(300),
  approved_destinations: z.array(z.enum(DESTINATIONS)).max(4),
  owner: z.string().max(80),
  status: z.enum(["draft", "pending_approval", "approved", "paused"]),
  approvals: z.object({ legal: z.string().nullable(), export: z.string().nullable(), crm_sync: z.string().nullable() }),
  last_run_at: z.string().nullable(),
  conversion_cta: z.string().max(80),
});
export type Recipe = z.infer<typeof recipeSchema>;

const MA_CORE_ZIPS: string[] = []; // Intentionally empty: ZIP list is an owner decision (served towns), not invented here.

const base = (o: Partial<Recipe> & Pick<Recipe, "id" | "name" | "persona" | "audience_type" | "api_family" | "topics" | "criteria" | "purpose" | "conversion_cta">): Recipe => ({
  brand: "deckcraft", market: "Greater Boston / Worcester (MA)", geography: { states: ["MA"], zips: MA_CORE_ZIPS }, lookback_days: 14,
  max_records: 0, estimated_credits: 0, legal_basis: "TO BE CONFIRMED by owner/legal review", consent_basis: "None for outbound contact: ads audiences and permissioned first-party follow-up only",
  approved_destinations: ["internal_review_only"], owner: "Justin Spillers (owner)", status: "draft", approvals: { legal: null, export: null, crm_sync: null }, last_run_at: null, ...o,
}) as Recipe;

/** DeckCraft starter recipes (Phase 4 spec §2). All DRAFT, all topics are hypotheses, no ZIPs, zero records. */
export const DECKCRAFT_RECIPES: Recipe[] = [
  base({ id: "dc-homeowner-replacement", name: "Homeowners: deck replacement / repair intent", persona: "homeowner_replacement", audience_type: "b2c", api_family: "main_module",
    topics: ["deck replacement", "deck repair", "composite decking", "outdoor living"].map((label) => ({ label, id: null, source: "hypothesis" as const, reviewed_at: null })),
    criteria: [{ field: "homeowner", operator: "in", value: ["y"], verified: true }, { field: "personal_state", operator: "in", value: ["ma"], verified: true },
      { field: "home_age", operator: ">=", value: "UNVERIFIED", verified: false }, { field: "property_value", operator: "in", value: "UNVERIFIED", verified: false }],
    purpose: "Ad audience and first-party nurture for homeowners researching deck replacement or repair in served MA towns.", conversion_cta: "Start virtual deck walkthrough" }),
  base({ id: "dc-seasonal-repair", name: "Seasonal repair / reseal intent", persona: "seasonal_repair", audience_type: "b2c", api_family: "intent",
    topics: ["deck staining", "deck sealing", "home improvement maintenance"].map((label) => ({ label, id: null, source: "hypothesis" as const, reviewed_at: null })),
    criteria: [], purpose: "Seasonal repair/reseal awareness audience; repair or replace assessment, no public price.", conversion_cta: "Repair or replace assessment" }),
  base({ id: "dc-hoa-pm", name: "HOA / condo boards and property managers", persona: "hoa_property_manager", audience_type: "b2b", api_family: "main_module",
    topics: ["property management", "HOA management", "condominium maintenance"].map((label) => ({ label, id: null, source: "hypothesis" as const, reviewed_at: null })),
    criteria: [{ field: "job_title", operator: "contains", value: "property manager", verified: true }, { field: "seniority_level", operator: "in", value: ["manager", "director"], verified: true }, { field: "company_state", operator: "in", value: ["ma"], verified: true }],
    purpose: "B2B awareness for property decision-makers who manage decks, balconies, stairs or fences.", conversion_cta: "Property inspection walkthrough" }),
  base({ id: "dc-commercial-facilities", name: "Commercial facilities decision-makers", persona: "commercial_facilities", audience_type: "b2b", api_family: "intent",
    topics: ["facilities maintenance", "commercial property maintenance"].map((label) => ({ label, id: null, source: "hypothesis" as const, reviewed_at: null })),
    criteria: [], purpose: "B2B awareness for facilities and maintenance decision-makers in MA.", conversion_cta: "Commercial assessment" }),
];

/** Validation for activation. Returns blocking issues; an empty list means the recipe is technically eligible. */
export function activationIssues(r: Recipe): string[] {
  const issues: string[] = [];
  const p = recipeSchema.safeParse(r);
  if (!p.success) return [`schema: ${p.error.issues.map((i) => i.path.join(".")).join(", ")}`];
  if (r.api_family !== "intent") {
    if (r.topics.length > MAIN.constraints.maxTopicIds) issues.push(`main API allows at most ${MAIN.constraints.maxTopicIds} topic ids`);
    if (r.lookback_days > MAIN.constraints.eventDateMaxDays) issues.push(`main API event_date must be within ${MAIN.constraints.eventDateMaxDays} days`);
  }
  const hyp = r.topics.filter((t) => t.source !== "catalog" || t.id === null);
  if (hyp.length) issues.push(`${hyp.length} topic(s) are hypotheses without a vendor-returned id`);
  for (const c of r.criteria) {
    if ((PROHIBITED_FIELDS as readonly string[]).includes(c.field)) issues.push(`criterion "${c.field}" is prohibited (sensitive / financial eligibility)`);
    else if (!c.verified) issues.push(`criterion "${c.field}" is UNVERIFIED`);
    else if (r.api_family === "intent" && !c.discovered_at) issues.push(`intent filter "${c.field}" must come from /filters/*/fields discovery`);
    else if (r.api_family !== "intent" && !(MAIN.documentedFields as readonly string[]).includes(c.field)) issues.push(`criterion "${c.field}" is not in the documented filter list`);
  }
  if (r.max_records <= 0) issues.push("max_records is 0 (owner must set a ceiling)");
  if (!r.approvals.legal) issues.push("legal / data-purpose approval missing");
  if (!r.approvals.export) issues.push("owner export (credit) approval missing");
  if (r.approved_destinations.some((d) => d !== "internal_review_only") && !r.approvals.crm_sync) issues.push("CRM/ads destination needs a separate approval");
  if (/TO BE CONFIRMED/i.test(r.legal_basis)) issues.push("legal basis not recorded");
  return issues;
}

/** Translate a recipe to a documented main-API BuildAudienceRequest (only verified, allowed criteria). */
export function toBuildRequest(r: Recipe) {
  const ids = r.topics.filter((t) => t.source === "catalog" && typeof t.id === "number").map((t) => t.id as number).slice(0, MAIN.constraints.maxTopicIds);
  const since = new Date(Date.now() - Math.min(r.lookback_days, 14) * 86400_000).toISOString().slice(0, 10);
  const filters = r.criteria.filter((c) => c.verified && !(PROHIBITED_FIELDS as readonly string[]).includes(c.field) && (MAIN.documentedFields as readonly string[]).includes(c.field)).map((c) => ({ field: c.field, operator: c.operator, value: c.value }));
  if (r.geography.zips.length) filters.push({ field: "personal_zip", operator: "in", value: r.geography.zips });
  return { name: `deckcraft:${r.id}`, type: r.audience_type, limit: r.max_records, topic_ids: ids, filters: [{ field: "event_date", operator: ">=", value: since }, ...filters] };
}
