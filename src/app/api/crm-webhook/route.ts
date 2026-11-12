import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { env } from "@/lib/server/env";
import { sendCapi, sendGa4 } from "@/lib/server/integrations";
import { openAiStageEvent, sendOpenAiEvent } from "@/lib/openai-ads/server";
import { updateLead } from "@/lib/server/store";
import { tagContact } from "@/lib/server/ghl-api";
import { STAGE_SEQUENCES } from "@/lib/crm/follow-up";

export const runtime = "nodejs";

/**
 * GHL → site webhook. A GHL workflow fires this when an opportunity changes stage so ad platforms
 * learn which leads became real jobs. Google Ads offline conversions are uploaded from GHL/Sheets
 * (see docs/08-tracking.md) using the stored gclid; this endpoint handles Meta CAPI + GA4 MP.
 */
const STAGE_EVENTS = {
  qualified: { ga4: "qualified_lead", meta: "QualifiedLead" },
  estimate_booked: { ga4: "appointment_booked", meta: "Schedule" },
  walkthrough_booked: { ga4: "appointment_booked", meta: "Schedule" },
  estimate_sent: { ga4: "estimate_sent", meta: "EstimateSent" },
  won: { ga4: "contract_signed", meta: "SubmitApplication" },
  paid: { ga4: "purchase", meta: "Purchase" },
  lost: { ga4: "lead_lost", meta: "LeadLost" },
} as const;

const body = z.object({
  stage: z.enum(Object.keys(STAGE_EVENTS) as [keyof typeof STAGE_EVENTS, ...(keyof typeof STAGE_EVENTS)[]]),
  lead_id: z.string().min(1),
  opportunity_id: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  town: z.string().optional(),
  value: z.coerce.number().min(0).optional(),
  service: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  ga_client_id: z.string().optional(),
  openai_obref: z.string().optional(),
  openai_oppref: z.string().optional(),
  contact_id: z.string().optional(),
});

function authorized(req: Request) {
  const got = req.headers.get("x-dc-secret") || "";
  const want = env.ghlWebhookSecret || "";
  if (!want || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 422 });
  const d = parsed.data;
  const ev = STAGE_EVENTS[d.stage];
  // Deterministic event_id per opportunity+stage so GHL retries never double count.
  const eventId = `${d.opportunity_id}:${d.stage}`;
  const value = d.stage === "won" || d.stage === "paid" ? d.value : undefined;

  // Revenue attribution: write the stage + value back onto the lead so /api/admin/attribution and the
  // Google Ads offline-conversion export can tie revenue to the original click / campaign.
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { stage: d.stage, stage_at: now, ghl_opportunity_id: d.opportunity_id };
  if (d.stage === "won") Object.assign(patch, { revenue_won: d.value ?? null, won_at: now });
  if (d.stage === "paid") Object.assign(patch, { revenue_paid: d.value ?? null, paid_at: now });
  const stored = await updateLead(d.lead_id, patch).then(() => true).catch((e) => { console.error("[crm-webhook] lead update", String(e).slice(0, 200)); return false; });
  const seq = STAGE_SEQUENCES[d.stage];
  const followUp = seq && d.contact_id ? await tagContact(d.contact_id, [`wf:${seq.key}`, `stage:${d.stage}`]) : { skipped: true };

  if (d.stage === "lost") return NextResponse.json({ ok: true, event_id: eventId, stored, followUp });

  const oa = openAiStageEvent(d.stage);
  const [meta, ga4, openai] = await Promise.all([
    sendCapi({
      event_name: ev.meta,
      event_id: eventId,
      action_source: "system_generated",
      user: { email: d.email, phone: d.phone, first_name: d.first_name, last_name: d.last_name, town: d.town, external_id: d.lead_id, fbc: d.fbc, fbp: d.fbp },
      custom_data: { value, currency: value ? "USD" : undefined, content_name: d.service, stage: d.stage },
    }),
    sendGa4(d.ga_client_id || d.lead_id, ev.ga4, { value, currency: value ? "USD" : undefined, service: d.service, transaction_id: d.stage === "paid" ? d.opportunity_id : undefined }),
    // OpenAI Ads: booked visits → appointment_scheduled; later stages → custom events with value.
    oa
      ? sendOpenAiEvent({
          id: eventId, type: oa.type, customEventName: oa.customEventName, actionSource: "offline",
          value, oppref: d.openai_oppref, properties: oa.type === "custom" ? { stage: d.stage, service: d.service ?? null } : undefined,
          user: { email: d.email, phone: d.phone, firstName: d.first_name, lastName: d.last_name, externalId: d.lead_id, obref: d.openai_obref, city: d.town, region: "MA", country: "US" },
        })
      : Promise.resolve({ sent: false, skipped: "no mapping" }),
  ]);
  return NextResponse.json({ ok: true, event_id: eventId, stored, followUp, meta, ga4, openai });
}
