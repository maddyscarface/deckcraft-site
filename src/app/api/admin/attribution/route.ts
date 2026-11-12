import { NextResponse } from "next/server";
import { listLeads } from "@/lib/server/store";
import { googleAdsOfflineCsv, summarize } from "@/lib/crm/attribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Revenue attribution by channel + campaign (protected by ADMIN_PASSWORD via middleware).
 *   GET /api/admin/attribution                → JSON summary
 *   GET /api/admin/attribution?format=gads    → Google Ads offline-conversion CSV (won/paid jobs with a gclid)
 */
export async function GET(req: Request) {
  const leads = await listLeads(2000).catch(() => []);
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "gads") {
    return new NextResponse(googleAdsOfflineCsv(leads, process.env.GOOGLE_ADS_OFFLINE_CONVERSION_NAME || undefined), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="deckcraft-google-ads-offline.csv"' },
    });
  }
  return NextResponse.json({ ok: true, leads: leads.length, rows: summarize(leads) });
}
