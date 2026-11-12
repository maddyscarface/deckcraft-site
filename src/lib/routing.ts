import type { LeadInput } from "./lead-schema";
import { SCORING } from "@/config/lead-scoring";

/** Maps a validated lead to funnel, GHL pipeline, tags and a simple priority score. Pure + unit-tested. */

/**
 * Funnels. `F_new_deck` (Phase 2) separates new-deck builds from repair work so ads, GHL workflows and reporting
 * can treat them differently. `A_deck_repair` remains a valid value (repairs, and every lead stored before this
 * change); treat both as residential deck funnels when filtering.
 */
export const FUNNELS = ["A_deck_repair", "B_staining", "C_repair_or_replace", "D_fencing", "E_property_programs", "F_new_deck", "newsletter", "general"] as const;
export type Funnel = (typeof FUNNELS)[number];
export const isFunnel = (v: unknown): v is Funnel => typeof v === "string" && (FUNNELS as readonly string[]).includes(v);
/** Residential deck funnels, including the legacy value used for new decks before F_new_deck existed. */
export const DECK_FUNNELS: readonly Funnel[] = ["A_deck_repair", "F_new_deck"];

export function funnelFor(lead: Pick<LeadInput, "form_type" | "customer_type" | "services" | "source_page"> & Partial<Pick<LeadInput, "work_type">>): Funnel {
  if (lead.form_type === "newsletter") return "newsletter";
  if (lead.form_type === "walkthrough" || lead.form_type === "planner") return "E_property_programs";
  if (lead.customer_type && lead.customer_type !== "homeowner") return "E_property_programs";
  if (lead.form_type === "checker" || lead.source_page?.startsWith("/repair-or-replace")) return "C_repair_or_replace";
  // New-deck intent stated explicitly (form answer or the new-deck estimate page) wins over service chips.
  if (lead.work_type === "new" || lead.source_page?.startsWith("/new-deck-estimate")) return "F_new_deck";
  const s = new Set(lead.services ?? []);
  const fence = ["fence_repair", "new_fence", "fence_staining", "gate"].some((k) => s.has(k as never));
  const deck = ["deck_repair", "railings_stairs", "new_deck"].some((k) => s.has(k as never));
  if (s.has("staining") && !deck && !fence) return "B_staining";
  if (fence && !deck && !s.has("staining")) return "D_fencing";
  // New-deck intent: an explicit "new build" answer, the new-deck estimate page, or new_deck without repair work.
  const repairWork = s.has("deck_repair") || s.has("railings_stairs");
  if (s.has("new_deck") && !repairWork && lead.work_type !== "repair") return "F_new_deck";
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

/** 0–100. Used to order the BDR call list; not shown to customers. Weights live in src/config/lead-scoring.ts. */
export function scoreLead(lead: LeadInput): number {
  const W = SCORING;
  let s: number = W.base;
  if (lead.form_type === "walkthrough") s += W.walkthroughForm;
  if (lead.customer_type && lead.customer_type !== "homeowner") s += W.propertyCustomer;
  if ((lead.property_count ?? 0) >= 5) s += W.portfolio5Plus;
  if ((lead.property_count ?? 0) >= 20) s += W.portfolio20Plus;
  if (lead.photo_urls?.length) s += W.photosAttached;
  if (lead.timeline === "asap") s += W.timelineAsap;
  else if (lead.timeline === "this_season") s += W.timelineThisSeason;
  if (lead.services?.some((x) => (W.highValueServices as readonly string[]).includes(x))) s += W.highValueService;
  if (lead.checker_result === "inspection_recommended") s += W.checkerInspection;
  if (lead.phone) s += W.phoneProvided;
  return Math.max(0, Math.min(100, s));
}

export function slug(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
