import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { intentConfig, intentTags } from "@/lib/intent/adapter";
import { syncLeadToGhl } from "@/lib/server/ghl-api";

export const runtime = "nodejs";

/** Intent-data webhook (DataMoon / AudienceLab). 404 unless INTENT_ENABLED=true with a provider + secret. */
export async function POST(req: Request) {
  const cfg = intentConfig();
  if (!cfg.enabled || !cfg.secret) return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  const got = req.headers.get("x-intent-secret") || "";
  if (got.length !== cfg.secret.length || !timingSafeEqual(Buffer.from(got), Buffer.from(cfg.secret))) return NextResponse.json({ ok: false }, { status: 401 });
  const sig = cfg.provider!.normalize(await req.json().catch(() => null));
  if (!sig?.email) return NextResponse.json({ ok: true, ignored: "no email" });
  if (sig.score < cfg.minScore) return NextResponse.json({ ok: true, ignored: "below min score" });
  const r = await syncLeadToGhl({
    lead_id: `intent_${sig.provider}`, email: sig.email, first_name: sig.first_name, last_name: sig.last_name, company_name: sig.company, town: sig.city,
    pipeline: "none", score: sig.score, tier: "nurture", tags: intentTags(sig), fields: {}, opportunity_name: "",
  }, []);
  return NextResponse.json({ ok: r.ok, mode: r.mode });
}
