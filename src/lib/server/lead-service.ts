import "server-only";
import type { LeadInput } from "../lead-schema";
import { funnelFor, pipelineFor, scoreLead, tagsFor } from "../routing";
import { findByEventId, insertLead, signedUrl, updateLead, type StoredLead } from "./store";
import { sendCapi, sendToGhl } from "./integrations";
import { env } from "./env";
import { sendOpenAiEvent } from "../openai-ads/server";
import { budgetFit, qualifierFields, qualifierScore, sanitizeQualifiers, type Qualifiers } from "../estimate/qualifiers";
import { renderLeadBrief, sendLeadBrief } from "../estimate/lead-brief";
import { START_TO_TIMELINE, estimateConfig, briefTheme } from "@/config/estimate";
import { SERVICE_LABELS } from "../lead-schema";

/** Build the exact payload GHL's inbound webhook receives (field map in docs/06-gohighlevel.md). */
export async function ghlPayload(lead: LeadInput, stored: { id: string; score: number }, q?: Qualifiers) {
  const photos = await Promise.all((lead.photo_urls ?? []).map((p) => signedUrl(p)));
  const files = await Promise.all((lead.file_urls ?? []).map((p) => signedUrl(p)));
  const a = lead.attribution ?? {};
  return {
    lead_id: stored.id,
    event_id: lead.event_id,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    sms_consent: lead.sms_consent,
    sms_consent_at: lead.sms_consent ? new Date().toISOString() : null,
    customer_type: lead.customer_type,
    company_name: lead.company_name,
    role: lead.role,
    town: lead.town ?? lead.towns?.join(", "),
    towns: lead.towns,
    services: lead.services?.join(", "),
    material: lead.material,
    size_estimate: lead.size_estimate,
    property_count: lead.property_count,
    unit_count: lead.unit_count,
    structure_count: lead.structure_count,
    fence_linear_ft: lead.fence_linear_ft,
    timeline: lead.timeline,
    board_meeting_date: lead.board_meeting_date,
    budget_process: lead.budget_process,
    maintenance_frequency: lead.maintenance_frequency,
    message: lead.message,
    checker_result: lead.checker_result,
    photo_urls: photos.join("\n"),
    photo_count: photos.length,
    file_urls: files.join("\n"),
    source_page: lead.source_page,
    form_type: lead.form_type,
    funnel: funnelFor(lead),
    pipeline: pipelineFor(lead),
    lead_score: stored.score,
    tags: tagsFor(lead).join(","),
    utm_source: a.utm_source, utm_medium: a.utm_medium, utm_campaign: a.utm_campaign, utm_content: a.utm_content, utm_term: a.utm_term,
    gclid: a.gclid, gbraid: a.gbraid, wbraid: a.wbraid, fbclid: a.fbclid, fbc: a.fbc, fbp: a.fbp,
    landing_page: a.landing_page, referrer: a.referrer, first_touch_at: a.first_touch_at,
    openai_obref: a.openai_obref, openai_oppref: a.openai_oppref,
    ...qualifierFields(estimateConfig, q),
  };
}

export type SubmitResult = { id: string; duplicate: boolean; ghl: string; capi: string; openai?: string; brief?: string; funnel: string };

const siteOrigin = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://deckcraftboston.com").replace(/\/$/, "");

export async function submitLead(lead: LeadInput, ctx: { ip?: string; ua?: string; url?: string }): Promise<SubmitResult> {
  // Idempotency: the client generates event_id once per submission; retries return the original.
  const existing = await findByEventId(lead.event_id);
  if (existing) return { id: existing.id, duplicate: true, ghl: existing.ghl_sync_status, capi: "dedup", funnel: String(existing.funnel ?? "") };

  const q = lead.form_type === "newsletter" ? undefined : sanitizeQualifiers(estimateConfig, lead.qualifiers);
  // Server-side safety net: derive the legacy timeline from the qualifier start answer.
  if (!lead.timeline && q?.start && START_TO_TIMELINE[q.start]) lead = { ...lead, timeline: START_TO_TIMELINE[q.start] };
  const score = Math.max(0, Math.min(100, scoreLead(lead) + qualifierScore(estimateConfig, q)));
  const funnel = funnelFor(lead);
  const { attribution, website: _hp, elapsed_ms: _e, checker_answers, qualifiers: _q, ads_consent: _ac, ...rest } = lead;
  const stored = await insertLead({
    ...rest,
    ...(attribution ?? {}),
    checker_answers: checker_answers ? JSON.stringify(checker_answers) : undefined,
    qualifiers: q ?? null,
    budget_fit: q ? budgetFit(estimateConfig, q).fit : null,
    sms_consent_at: lead.sms_consent ? new Date().toISOString() : null,
    sms_consent_ip: lead.sms_consent ? ctx.ip : null,
    funnel,
    pipeline: pipelineFor(lead),
    tags: tagsFor(lead),
    lead_score: score,
    ghl_sync_status: "pending",
    ghl_attempts: 0,
    status: "new",
  } as Omit<StoredLead, "id" | "created_at">);

  const payload = await ghlPayload(lead, { id: stored.id, score }, q);
  const isLead = lead.form_type !== "newsletter";
  const [ghl, capi, openai, brief] = await Promise.all([
    sendToGhl(payload),
    lead.form_type === "newsletter"
      ? Promise.resolve({ ok: false, skipped: true })
      : sendCapi({
          event_name: "Lead",
          event_id: lead.event_id, // same ID the browser Pixel used → Meta deduplicates
          event_source_url: ctx.url,
          user: { email: lead.email, phone: lead.phone, first_name: lead.first_name, last_name: lead.last_name, town: lead.town, external_id: stored.id, fbc: attribution?.fbc, fbp: attribution?.fbp, ip: ctx.ip, ua: ctx.ua },
          custom_data: { content_name: lead.form_type, content_category: pipelineFor(lead), funnel },
        }),
    // OpenAI Ads Conversions API: id = the browser pixel's event_id → deduplicated.
    isLead && lead.ads_consent !== false
      ? sendOpenAiEvent({
          id: lead.event_id, type: "lead_created", actionSource: "web", sourceUrl: ctx.url || `${siteOrigin()}${lead.source_page ?? "/"}`,
          oppref: attribution?.openai_oppref,
          user: { email: lead.email, phone: lead.phone, firstName: lead.first_name, lastName: lead.last_name, externalId: stored.id, obref: attribution?.openai_obref, city: lead.town, region: "MA", country: "US", ip: ctx.ip, userAgent: ctx.ua },
        })
      : Promise.resolve({ sent: false, skipped: isLead ? "no ad consent" : "newsletter" }),
    isLead
      ? sendLeadBrief(renderLeadBrief({
          cfg: estimateConfig, theme: briefTheme, heading: lead.customer_type && lead.customer_type !== "homeowner" ? "New property estimate request" : "New deck estimate request",
          name: [lead.first_name, lead.last_name].filter(Boolean).join(" ") || lead.email, phone: lead.phone, email: lead.email,
          location: lead.town, q,
          details: [
            ["Services", lead.services?.map((s) => SERVICE_LABELS[s]).join(", ")], ["Material now", lead.material], ["Size noted", lead.size_estimate],
            ["Customer", lead.customer_type], ["Company", lead.company_name], ["Properties", lead.property_count ? String(lead.property_count) : undefined],
            ["Checker result", lead.checker_result], ["Notes", lead.message],
          ],
          photoUrls: String(payload.photo_urls || "").split("\n").filter(Boolean),
          score, source: [attribution?.utm_source, attribution?.utm_medium, attribution?.utm_campaign].filter(Boolean).join(" / ") || (attribution?.gclid ? "google" : "direct"),
          adminUrl: `${siteOrigin()}/admin`,
        }), { to: env.leadBriefTo, from: env.leadBriefFrom, replyTo: lead.email })
      : Promise.resolve({ sent: false, reason: "newsletter" }),
  ]);

  const ghlStatus = ghl.status === "skipped" ? "skipped" : ghl.ok ? "sent" : "failed";
  await updateLead(stored.id, { ghl_sync_status: ghlStatus, ghl_attempts: 1, ghl_last_error: ghl.error ?? null });

  return {
    id: stored.id, duplicate: false, ghl: ghlStatus,
    capi: "skipped" in capi && capi.skipped ? "skipped" : capi.ok ? "sent" : "failed",
    openai: openai.skipped ? "skipped" : openai.sent ? "sent" : "failed",
    brief: brief.sent ? "sent" : "skipped",
    funnel,
  };
}
