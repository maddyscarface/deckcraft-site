import { z } from "zod";
import { leadSchema } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/server/ratelimit";
import { submitLead } from "@/lib/server/lead-service";
import { BRAND, flags } from "@/lib/p4/flags";
import { db } from "@/lib/p4/db";
import { enqueue } from "@/lib/p4/outbox";
import { createInvite, createProject } from "@/lib/walkthrough/service";
import { WALKTHROUGH_SERVICES, type WalkthroughService } from "@/lib/walkthrough/templates";
import { json } from "@/lib/walkthrough/http";

export const runtime = "nodejs";

const LEAD_SERVICE: Record<WalkthroughService, "new_deck" | "deck_repair" | "staining" | "railings_stairs" | "fence_repair" | "inspection"> = {
  new_deck: "new_deck", deck_repair: "deck_repair", resurfacing_staining: "staining", railings_stairs: "railings_stairs", fence: "fence_repair", property_inspection: "inspection",
};
const extra = z.object({ service: z.enum(WALKTHROUGH_SERVICES), sqft: z.coerce.number().int().min(0).max(20000).optional() });

/**
 * Starts a guided walkthrough from the website. Reuses the existing lead pipeline (validation, idempotency, GHL,
 * CAPI/attribution) and then creates a private project + 14-day customer link. Never returns a price.
 */
export async function POST(req: Request) {
  if (!flags().walkthrough) return json({ ok: false, error: "Not available" }, 404);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "Invalid JSON" }, 400); }
  const ex = extra.safeParse(body);
  if (!ex.success) return json({ ok: false, error: "Choose what you'd like to show us.", fields: { service: "Required" } }, 422);
  const { service, sqft } = ex.data;
  const parsed = leadSchema.safeParse({
    ...body, form_type: "assessment", walkthrough_requested: true, services: [LEAD_SERVICE[service]],
    size_estimate: sqft ? `${sqft} sq ft (customer plan)` : (body.size_estimate as string | undefined), source_page: (body.source_page as string | undefined) ?? "/walkthrough/start",
  });
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join("."), i.message]));
    if ("website" in fields) return json({ ok: true, id: "ignored" });
    return json({ ok: false, error: "Please check the highlighted fields.", fields }, 422);
  }
  const lead = parsed.data;
  if (lead.elapsed_ms !== undefined && lead.elapsed_ms < 2500) return json({ ok: true, id: "ignored" });
  if (!rateLimit(`wstart:${ip}`, 6)) return json({ ok: false, error: "Too many requests. Please wait a minute and try again, or email info@deckcraftbuild.com." }, 429);
  try {
    const res = await submitLead(lead, { ip, ua: req.headers.get("user-agent") || undefined, url: req.headers.get("referer") || undefined });
    const existing = await db.findOne("projects", BRAND, { lead_id: res.id });
    const project = existing ?? await createProject(BRAND, {
      lead_id: res.id, service, source: "website", customer_type: lead.customer_type,
      customer: { first_name: lead.first_name, last_name: lead.last_name, email: lead.email, phone: lead.phone, town: lead.town, zip: lead.zip }, actor: "system",
    });
    if (!existing) await db.update("projects", BRAND, project.id, { lead_score: null, plan_sqft: sqft ?? null });
    const { token } = await createInvite(BRAND, project.id, { kind: "initial", actor: "system" });
    await enqueue(BRAND, { type: "walkthrough.requested", ref_type: "project", ref_id: project.id, idempotency_key: `walkthrough.requested:${project.id}`, payload: { project_id: project.id, lead_id: res.id, service } });
    return json({ ok: true, id: res.id, funnel: res.funnel, tier: res.tier, url: `/w/${token}` });
  } catch (e) {
    console.error("[walkthrough:start]", e instanceof Error ? e.message : e);
    return json({ ok: false, error: "We couldn't start your walkthrough. Please try again or email info@deckcraftbuild.com." }, 500);
  }
}
