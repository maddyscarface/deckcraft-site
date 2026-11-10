import type { LeadInput } from "./lead-schema";

/** Maps a validated lead to funnel, GHL pipeline, tags and a simple priority score. Pure + unit-tested. */

export type Funnel = "A_deck_repair" | "B_staining" | "C_repair_or_replace" | "D_fencing" | "E_property_programs" | "newsletter" | "general";

export function funnelFor(lead: Pick<LeadInput, "form_type" | "customer_type" | "services" | "source_page">): Funnel {
  if (lead.form_type === "newsletter") return "newsletter";
  if (lead.form_type === "walkthrough" || lead.form_type === "planner") return "E_property_programs";
  if (lead.customer_type && lead.customer_type !== "homeowner") return "E_property_programs";
  if (lead.form_type === "checker" || lead.source_page?.startsWith("/repair-or-replace")) return "C_repair_or_replace";
  const s = new Set(lead.services ?? []);
  const fence = ["fence_repair", "new_fence", "fence_staining", "gate"].some((k) => s.has(k as never));
  const deck = ["deck_repair", "railings_stairs", "new_deck"].some((k) => s.has(k as never));
  if (s.has("staining") && !deck && !fence) return "B_staining";
  if (fence && !deck && !s.has("staining")) return "D_fencing";
  if (deck || s.has("staining")) return "A_deck_repair";
  if (lead.source_page?.startsWith("/fencing")) return "D_fencing";
  if (lead.source_page?.includes("staining")) return "B_staining";
  return "general";
}

export function pipelineFor(lead: Pick<LeadInput, "form_type" | "customer_type">): "residential" | "commercial" | "none" {
  if (lead.form_type === "newsletter") return "none";
  if (lead.form_type === "walkthrough" || lead.form_type === "planner") return "commercial";
  return lead.customer_type && lead.customer_type !== "homeowner" ? "commercial" : "residential";
}

export function tagsFor(lead: LeadInput): string[] {
  const t = new Set<string>(["src:website", `form:${lead.form_type}`, `funnel:${funnelFor(lead)}`]);
  if (lead.customer_type) t.add(`seg:${lead.customer_type}`);
  for (const s of lead.services ?? []) t.add(`svc:${s}`);
  if (lead.town) t.add(`town:${slug(lead.town)}`);
  if (lead.timeline) t.add(`timeline:${lead.timeline}`);
  if (lead.photo_urls?.length) t.add("photos:received");
  else if (lead.form_type === "assessment" || lead.form_type === "short") t.add("photos:requested");
  if (lead.sms_consent) t.add("sms:opt-in");
  if (lead.form_type === "newsletter") t.add("newsletter");
  if (lead.checker_result) t.add(`checker:${slug(lead.checker_result)}`);
  const a = lead.attribution ?? {};
  if (a.gclid || a.gbraid || a.wbraid) t.add("paid:google");
  if (a.fbclid || a.utm_source?.match(/facebook|instagram|meta|fb|ig/i)) t.add("paid:meta");
  if (a.utm_campaign) t.add(`cmp:${slug(a.utm_campaign)}`);
  return [...t];
}

/** 0–100. Used to order the BDR call list; not shown to customers. Weights are owner-editable. */
export function scoreLead(lead: LeadInput): number {
  let s = 20;
  if (lead.form_type === "walkthrough") s += 25;
  if (lead.customer_type && lead.customer_type !== "homeowner") s += 15;
  if ((lead.property_count ?? 0) >= 5) s += 10;
  if ((lead.property_count ?? 0) >= 20) s += 10;
  if (lead.photo_urls?.length) s += 15;
  if (lead.timeline === "asap") s += 15;
  else if (lead.timeline === "this_season") s += 10;
  if (lead.services?.some((x) => ["deck_repair", "railings_stairs", "new_deck", "new_fence"].includes(x))) s += 5;
  if (lead.checker_result === "inspection_recommended") s += 5;
  if (lead.phone) s += 5;
  return Math.max(0, Math.min(100, s));
}

export function slug(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
