import type { CustomFieldKey, GhlConfig, PipelineKey, StageKey } from "@/config/ghl";
import { DECKCRAFT_PIPELINES } from "@/config/ghl";

/** Pure mapping from a DeckCraft lead record to GHL API v2 request bodies (unit-tested, no I/O). */
export type LeadForGhl = {
  lead_id: string;
  first_name?: string; last_name?: string; email: string; phone?: string;
  company_name?: string; town?: string;
  pipeline: PipelineKey | "none";
  stage?: StageKey;
  score: number; tier: string; tags: string[];
  fields: Partial<Record<CustomFieldKey, string | number | null | undefined>>;
  opportunity_name: string;
  value?: number;
};

export function contactBody(l: LeadForGhl, c: GhlConfig) {
  const customFields = Object.entries(l.fields)
    .filter(([k, v]) => v !== undefined && v !== null && v !== "" && c.fields[k as CustomFieldKey])
    .map(([k, v]) => ({ id: c.fields[k as CustomFieldKey]!, field_value: String(v) }));
  return {
    locationId: c.locationId,
    firstName: l.first_name,
    lastName: l.last_name,
    email: l.email,
    phone: l.phone,
    companyName: l.company_name,
    city: l.town,
    state: "MA",
    country: "US",
    source: "deckcraftbuild.com",
    tags: [...new Set([...l.tags, `score:${l.score}`, `tier:${l.tier}`, "brand:deckcraft"])],
    ...(customFields.length ? { customFields } : {}),
  };
}

export function opportunityBody(l: LeadForGhl, c: GhlConfig, contactId: string) {
  if (l.pipeline === "none") return null;
  const pipelineId = c.pipelines[l.pipeline];
  const stageId = c.stages[l.pipeline]?.[l.stage ?? "new_lead"];
  if (!pipelineId || !stageId) return null;
  return {
    locationId: c.locationId,
    pipelineId,
    pipelineStageId: stageId,
    contactId,
    name: l.opportunity_name,
    status: l.stage === "won" || l.stage === "paid" ? "won" : l.stage === "lost" ? "lost" : "open",
    source: "deckcraftbuild.com",
    ...(l.value ? { monetaryValue: l.value } : {}),
  };
}

export const pipelineLabel = (p: PipelineKey | "none") => (p === "none" ? "none" : DECKCRAFT_PIPELINES[p].name);
