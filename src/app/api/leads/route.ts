import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/server/ratelimit";
import { submitLead } from "@/lib/server/lead-service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = req.headers.get("user-agent") || undefined;

  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join("."), i.message]));
    // Honeypot or too-fast bot: return a fake success so bots don't learn.
    if ("website" in fields) return NextResponse.json({ ok: true, id: "ignored" });
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }
  const lead = parsed.data;
  if (lead.elapsed_ms !== undefined && lead.elapsed_ms < 2500 && lead.form_type !== "newsletter") {
    return NextResponse.json({ ok: true, id: "ignored" });
  }
  // Link-spam heuristic: real customers almost never paste several URLs into a deck request.
  if (((lead.message ?? "").match(/https?:\/\//gi)?.length ?? 0) > 2) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }
  if (!rateLimit(`lead:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please wait a minute and try again, or email info@deckcraftbuild.com." }, { status: 429 });
  }

  try {
    const res = await submitLead(lead, { ip, ua, url: req.headers.get("referer") || undefined });
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    console.error("[lead] store failure", e);
    return NextResponse.json({ ok: false, error: "We couldn't save your request. Please try again or email info@deckcraftbuild.com." }, { status: 500 });
  }
}
