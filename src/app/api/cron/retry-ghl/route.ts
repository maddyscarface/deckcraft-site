import { NextResponse } from "next/server";
import { listFailedSync, updateLead } from "@/lib/server/store";
import { sendToGhl } from "@/lib/server/integrations";
import { env } from "@/lib/server/env";

export const runtime = "nodejs";

/**
 * Retry failed GHL syncs. Schedule every 15 minutes (Vercel Cron / Supabase pg_cron).
 * After 3 failed attempts the lead stays "failed" and should alert the owner (docs/06).
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!env.ghlWebhookUrl) return NextResponse.json({ ok: true, skipped: "GHL not configured" });
  const rows = await listFailedSync();
  let sent = 0;
  for (const r of rows) {
    const { id, ...rest } = r;
    const res = await sendToGhl({ lead_id: id, retry: true, ...rest });
    const attempts = (r.ghl_attempts ?? 1) + 1;
    await updateLead(id, { ghl_sync_status: res.ok ? "sent" : "failed", ghl_attempts: attempts, ghl_last_error: res.error ?? null });
    if (res.ok) sent++;
  }
  return NextResponse.json({ ok: true, retried: rows.length, sent });
}
