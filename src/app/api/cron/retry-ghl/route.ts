import { NextResponse } from "next/server";
import { listFailedSync, updateLead } from "@/lib/server/store";
import { sendToGhl } from "@/lib/server/integrations";
import { syncLeadToGhl } from "@/lib/server/ghl-api";
import { ghlApiReady, ghlConfig } from "@/config/ghl";
import { toLeadForGhl } from "@/lib/crm/lead-record";
import { env } from "@/lib/server/env";
import { processOutbox } from "@/lib/p4/outbox";
import { outboxHandlers } from "@/lib/p4/handlers";
import { BRAND } from "@/lib/p4/flags";

export const runtime = "nodejs";

/**
 * Retry failed GHL syncs (Vercel Cron, see vercel.json). Uses the GHL API v2 upsert when configured,
 * so retries can never create duplicate contacts/opportunities; falls back to the inbound webhook.
 * After 3 failed attempts the lead stays "failed" and should alert the owner (docs/06).
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  // Phase 4: drain the durable event outbox first (CRM tags/stages only; no email, no prices).
  const outbox = await processOutbox(BRAND, outboxHandlers()).catch((e) => ({ error: String(e).slice(0, 200) }));
  const cfg = ghlConfig();
  const api = ghlApiReady(cfg);
  if (!api && !env.ghlWebhookUrl) return NextResponse.json({ ok: true, skipped: "GHL not configured", outbox });
  const rows = await listFailedSync();
  let sent = 0;
  for (const r of rows) {
    const { id, ...rest } = r;
    const res = api
      ? await syncLeadToGhl(toLeadForGhl({ ...r, lead_id: id }), [], cfg).then((x) => ({ ok: x.ok, error: x.error, contactId: x.contactId, opportunityId: x.opportunityId }))
      : await sendToGhl({ lead_id: id, retry: true, ...rest }).then((x) => ({ ok: x.ok, error: x.error, contactId: undefined, opportunityId: undefined }));
    const attempts = (r.ghl_attempts ?? 1) + 1;
    await updateLead(id, { ghl_sync_status: res.ok ? "sent" : "failed", ghl_attempts: attempts, ghl_last_error: res.error ?? null, ...(res.contactId ? { ghl_contact_id: res.contactId } : {}), ...(res.opportunityId ? { ghl_opportunity_id: res.opportunityId } : {}) });
    if (res.ok) sent++;
  }
  return NextResponse.json({ ok: true, mode: api ? "api" : "webhook", retried: rows.length, sent, outbox });
}
