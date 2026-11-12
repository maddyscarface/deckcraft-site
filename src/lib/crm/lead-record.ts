import type { LeadForGhl } from "./ghl-map";
import type { CustomFieldKey, PipelineKey, StageKey } from "@/config/ghl";
import { CUSTOM_FIELDS } from "@/config/ghl";
import { tierFor } from "@/config/lead-scoring";

type Rec = Record<string, unknown>;
const str = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : Array.isArray(v) ? v.join(", ") : String(v));

/** Builds the GHL sync shape from either the webhook payload (submit) or a stored lead row (retry cron). */
export function toLeadForGhl(r: Rec, extraTags: string[] = []): LeadForGhl {
  const score = Number(r.lead_score ?? 0);
  const tier = String(r.lead_tier ?? tierFor(score));
  const tags = (Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? "").split(",")).map((t) => t.trim()).filter(Boolean);
  const services = str(r.services);
  const pipeline = (["residential", "commercial"].includes(String(r.pipeline)) ? r.pipeline : "none") as PipelineKey | "none";
  const hasPhotos = Number(r.photo_count ?? (Array.isArray(r.photo_urls) ? r.photo_urls.length : 0)) > 0;
  const fields: Partial<Record<CustomFieldKey, string | number | undefined>> = {};
  for (const k of CUSTOM_FIELDS) {
    const src = k.startsWith("dc_") ? k.slice(3) : k;
    const v = k === "dc_lead_id" ? (r.lead_id ?? r.id) : k === "dc_lead_score" ? score : k === "dc_lead_tier" ? tier : k === "dc_services" ? services : r[src];
    const s = str(v);
    if (s !== undefined) fields[k] = s;
  }
  const who = str(r.company_name) || [str(r.first_name), str(r.last_name)].filter(Boolean).join(" ") || String(r.email);
  return {
    lead_id: String(r.lead_id ?? r.id),
    first_name: str(r.first_name), last_name: str(r.last_name), email: String(r.email), phone: str(r.phone),
    company_name: str(r.company_name), town: str(r.town),
    pipeline,
    stage: (hasPhotos ? "photos_received" : "new_lead") as StageKey,
    score, tier, tags: [...new Set([...tags, ...extraTags])], fields,
    opportunity_name: `${who}${services ? ` · ${services}` : ""}${r.town ? ` · ${r.town}` : ""}`.slice(0, 120),
  };
}
