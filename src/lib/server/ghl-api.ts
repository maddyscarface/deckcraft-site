import "server-only";
import { ghlApiReady, ghlConfig, type GhlConfig } from "@/config/ghl";
import { contactBody, opportunityBody, pipelineLabel, type LeadForGhl } from "../crm/ghl-map";
import type { Sequence } from "../crm/follow-up";

/**
 * GoHighLevel API v2 client for the DeckCraft sub-account.
 * - Contacts: POST /contacts/upsert (GHL de-duplicates on email/phone per the location's duplicate rules),
 *   so retries and repeat submissions update one contact instead of creating copies.
 * - Opportunities: POST /opportunities/upsert (one opportunity per contact + pipeline).
 * - Follow-up: tags `wf:*` always; direct workflow enrollment when GHL_WORKFLOW_IDS has the key.
 * Without GHL_API_TOKEN + GHL_LOCATION_ID it runs in LOG mode: nothing is sent; a redacted summary is logged.
 */
const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

export type GhlSyncResult = {
  mode: "api" | "log";
  ok: boolean;
  contactId?: string;
  opportunityId?: string;
  workflows?: string[];
  error?: string;
};

async function call(c: GhlConfig, path: string, body: unknown, attempt = 0): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  try {
    const r = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${c.token}`, Version: VERSION, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if ((r.status === 429 || r.status >= 500) && attempt < 2) {
      await new Promise((res) => setTimeout(res, 400 * 2 ** attempt));
      return call(c, path, body, attempt + 1);
    }
    const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: r.ok, status: r.status, json };
  } catch (e) {
    if (attempt < 2) return call(c, path, body, attempt + 1);
    return { ok: false, status: 0, json: { error: String(e).slice(0, 200) } };
  }
}

const redact = (email: string) => email.replace(/^(.).*(@.*)$/, "$1***$2");

export async function syncLeadToGhl(l: LeadForGhl, plan: Sequence[], c: GhlConfig = ghlConfig()): Promise<GhlSyncResult> {
  if (!ghlApiReady(c)) {
    console.info("[ghl:log]", JSON.stringify({ lead: l.lead_id, email: redact(l.email), pipeline: pipelineLabel(l.pipeline), stage: l.stage ?? "new_lead", score: l.score, tier: l.tier, tags: l.tags.length, sequences: plan.map((s) => s.key) }));
    return { mode: "log", ok: true, workflows: plan.map((s) => s.key) };
  }
  const contact = await call(c, "/contacts/upsert", contactBody(l, c));
  const contactId = ((contact.json.contact as { id?: string } | undefined)?.id) ?? (contact.json.id as string | undefined);
  if (!contact.ok || !contactId) return { mode: "api", ok: false, error: `contact upsert ${contact.status}: ${JSON.stringify(contact.json).slice(0, 200)}` };

  let opportunityId: string | undefined;
  const ob = opportunityBody(l, c, contactId);
  if (ob) {
    const opp = await call(c, "/opportunities/upsert", ob);
    opportunityId = ((opp.json.opportunity as { id?: string } | undefined)?.id) ?? (opp.json.id as string | undefined);
    if (!opp.ok) return { mode: "api", ok: false, contactId, error: `opportunity upsert ${opp.status}` };
  }

  const enrolled: string[] = [];
  for (const s of plan) {
    const wf = c.workflows[s.key];
    if (!wf) continue;
    const r = await call(c, `/contacts/${contactId}/workflow/${wf}`, {});
    if (r.ok) enrolled.push(s.key);
  }
  return { mode: "api", ok: true, contactId, opportunityId, workflows: enrolled };
}

/** Adds tags to a contact (stage-driven follow-up from /api/crm-webhook). */
export async function tagContact(contactId: string, tags: string[], c: GhlConfig = ghlConfig()) {
  if (!ghlApiReady(c)) { console.info("[ghl:log] tag", contactId, tags.join(",")); return { mode: "log" as const, ok: true }; }
  const r = await call(c, `/contacts/${contactId}/tags`, { tags });
  return { mode: "api" as const, ok: r.ok };
}
