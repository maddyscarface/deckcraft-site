import type { LeadInput } from "../lead-schema";
import type { Tier } from "@/config/lead-scoring";

/**
 * Automated follow-up plan. Every sequence is expressed as a `wf:<key>` tag (GHL workflows can trigger on
 * "tag added"), and optionally enrolled directly when GHL_WORKFLOW_IDS maps the key to a workflow ID.
 * SMS-based sequences are only planned when the lead gave explicit SMS consent (TCPA / A2P).
 */
export type Sequence = { key: string; channel: "email" | "sms" | "email+sms" | "internal"; why: string };

export function followUpPlan(lead: Pick<LeadInput, "form_type" | "customer_type" | "photo_urls" | "sms_consent" | "timeline">, tier: Tier): Sequence[] {
  if (lead.form_type === "newsletter") return [{ key: "newsletter_welcome", channel: "email", why: "Newsletter signup" }];
  const sms = Boolean(lead.sms_consent);
  const both = sms ? "email+sms" : "email";
  const out: Sequence[] = [{ key: "speed_to_lead", channel: both, why: "Instant confirmation + owner alert" }];
  if (tier === "hot") out.push({ key: "hot_lead_alert", channel: "internal", why: "Score ≥ 70: call within the hour" });
  const property = lead.form_type === "walkthrough" || lead.form_type === "planner" || (lead.customer_type && lead.customer_type !== "homeowner");
  if (property) out.push({ key: "property_walkthrough", channel: both, why: "Schedule walkthrough, send COI/W-9 pack" });
  else if (!lead.photo_urls?.length && (lead.form_type === "assessment" || lead.form_type === "short")) out.push({ key: "photo_reminder", channel: both, why: "No photos yet: remind at 2h / 24h" });
  if (tier === "nurture" || lead.timeline === "next_spring" || lead.timeline === "planning" || lead.timeline === "budget_planning") out.push({ key: "long_nurture", channel: "email", why: "Not ready yet: seasonal nurture" });
  out.push({ key: "no_response_recovery", channel: both, why: "No reply in 48h: recovery touches, stop on reply" });
  return out;
}

export const followUpTags = (plan: Sequence[]) => plan.map((s) => `wf:${s.key}`);

/** Stage-driven sequences fired from the CRM stage webhook (opportunity moves in GHL). */
export const STAGE_SEQUENCES: Partial<Record<string, Sequence>> = {
  estimate_booked: { key: "visit_reminders", channel: "email+sms", why: "Reminders 24h and 2h before the site visit" },
  walkthrough_booked: { key: "visit_reminders", channel: "email+sms", why: "Reminders before the walkthrough" },
  estimate_sent: { key: "estimate_follow_up", channel: "email", why: "Day 2 / 5 / 10 follow-up on the written estimate" },
  paid: { key: "review_request", channel: "email", why: "Ask for a Google review after payment" },
  lost: { key: "lost_reengage", channel: "email", why: "Seasonal re-engagement in 6 months" },
};
