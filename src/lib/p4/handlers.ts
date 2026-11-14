import "server-only";
import { db } from "./db";
import type { Handler, EventType } from "./outbox";
import { syncLeadToGhl } from "../server/ghl-api";
import { ghlApiReady, ghlConfig, type StageKey } from "@/config/ghl";
import type { LeadForGhl } from "../crm/ghl-map";
import { flags } from "./flags";
import { DECKCRAFT_RECIPES } from "../datamoon/recipes";
import { vendorContactToGhl } from "../datamoon/ghl";
import type { ImportedContact } from "../datamoon/importer";

/**
 * Outbox delivery handlers. ONLY first-party CRM updates (GHL contact tags / pipeline stage). No email, SMS or
 * proposal is ever sent from here, and no price, estimate total or margin is placed on a CRM payload.
 * With no GHL credentials the GHL client runs in LOG mode; the event is marked "skipped (log mode)".
 */
const STAGE: Partial<Record<EventType, { tag: string; stage?: StageKey }>> = {
  "walkthrough.requested": { tag: "walkthrough:requested" },
  "capture.started": { tag: "walkthrough:started" },
  "capture.submitted": { tag: "walkthrough:submitted", stage: "photos_received" },
  "capture.corrected": { tag: "walkthrough:corrected" },
  "capture.followup.requested": { tag: "walkthrough:followup-requested", stage: "follow_up" },
  "proposal.marked_sent_externally": { tag: "proposal:sent-by-owner", stage: "estimate_sent" },
};

function projectHandler(type: EventType): Handler {
  return async (ev) => {
    const brand = String(ev.brand);
    const projectId = String(ev.payload?.project_id ?? ev.ref_id);
    const project = await db.get("projects", brand, projectId);
    if (!project) return { ok: true, skipped: "project not found for brand" };
    const c = project.customer as { email?: string; first_name?: string; last_name?: string; town?: string } | undefined;
    if (!c?.email) return { ok: true, skipped: "no customer email" };
    const m = STAGE[type]!;
    const commercial = project.customer_type && project.customer_type !== "homeowner";
    const pipeline = commercial ? "commercial" : "residential";
    const stage: StageKey | undefined = commercial ? (m.stage === "photos_received" ? "property_review" : undefined) : m.stage;
    const l: LeadForGhl = {
      lead_id: String(project.lead_id ?? project.id), email: c.email, first_name: c.first_name, last_name: c.last_name, town: c.town,
      pipeline: stage ? pipeline : "none", stage, score: Number(project.lead_score ?? 0), tier: String(project.lead_tier ?? "walkthrough"),
      tags: [m.tag, `service:${project.service}`], fields: {}, opportunity_name: `${c.first_name ?? "Customer"} · ${project.service}`,
    };
    const cfg = ghlConfig();
    const r = await syncLeadToGhl(l, [], cfg);
    if (!ghlApiReady(cfg)) return { ok: true, skipped: "GHL log mode (no credentials)" };
    return r.ok ? { ok: true, detail: { contactId: r.contactId ?? null } } : { ok: false, error: r.error };
  };
}

const crmSync: Handler = async (ev) => {
  const brand = String(ev.brand);
  if (!flags().datamoonCrmSync) return { ok: true, skipped: "DataMoon CRM sync flag off" };
  const contact = await db.get("vendor_contacts", brand, String(ev.ref_id));
  if (!contact) return { ok: true, skipped: "vendor contact not found" };
  const recipe = DECKCRAFT_RECIPES.find((r) => r.id === contact.recipe_id) ?? (await db.get("audience_recipes", brand, String(contact.recipe_id)))?.recipe as never;
  if (!recipe) return { ok: true, skipped: "recipe not found" };
  const supp = contact.email_hash ? await db.findOne("suppressions", brand, { email_hash: String(contact.email_hash) }) : null;
  const l = vendorContactToGhl(contact as unknown as ImportedContact, recipe, { crmSyncEnabled: true, optedOut: Boolean(supp) });
  if (!l) return { ok: true, skipped: "not eligible (approval, suppression or no email)" };
  const cfg = ghlConfig();
  const r = await syncLeadToGhl(l, [], cfg);
  if (!ghlApiReady(cfg)) return { ok: true, skipped: "GHL log mode (no credentials)" };
  return r.ok ? { ok: true } : { ok: false, error: r.error };
};

export function outboxHandlers(): Partial<Record<EventType, Handler>> {
  const h: Partial<Record<EventType, Handler>> = { "crm.sync": crmSync };
  for (const t of Object.keys(STAGE) as EventType[]) h[t] = projectHandler(t);
  return h;
}
