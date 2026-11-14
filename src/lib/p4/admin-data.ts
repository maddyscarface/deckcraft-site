import "server-only";
import { db, type Row } from "./db";
import { BRAND, flags } from "./flags";
import { can, type Staff } from "./rbac";
import { maskEmail } from "./pii";
import { staffEstimateView } from "../estimator/service";
import { listLeads, type StoredLead } from "../server/store";
import { integrationStatus } from "../server/env";
import { ghlApiReady, ghlConfig } from "@/config/ghl";
import { dmStatus } from "../datamoon/config";
import { measurementProviders } from "../measure/providers";
import { storageMode } from "./db";
import { listConfiguredStaff } from "./auth";

/** Everything the project page needs, filtered by role (PII masked without pii.read; estimates hidden without estimate.read). */
export async function projectDetail(id: string, staff: Staff) {
  const project = await db.get("projects", BRAND, id);
  if (!project) return null;
  const pii = can(staff, "pii.read", BRAND);
  const [sessions, media, revisions, estimates, followups, exports] = await Promise.all([
    db.list("capture_sessions", BRAND, { project_id: id }), db.list("media_assets", BRAND, { project_id: id }, { asc: true }), db.list("measurement_revisions", BRAND, { project_id: id }),
    can(staff, "estimate.read", BRAND) ? db.list("estimates", BRAND, { project_id: id }) : Promise.resolve([]), db.list("capture_followups", BRAND, { project_id: id }),
    can(staff, "proposal.export", BRAND) ? db.list("proposal_exports", BRAND, { project_id: id }) : Promise.resolve([]),
  ]);
  const c = project.customer as Record<string, string> | undefined;
  return {
    project: { ...project, customer: pii ? c : { first_name: c?.first_name, town: c?.town, email: maskEmail(c?.email) } } as Row,
    sessions: sessions.map(({ token_hash: _t, ...s }) => s),
    media: can(staff, "media.read", BRAND) ? media.filter((m) => m.status === "validated") : [],
    revisions, followups, exports,
    estimates: estimates.map((e) => staffEstimateView(e, staff, BRAND)),
  };
}

export async function safeLeads(limit = 1000): Promise<{ rows: StoredLead[]; error: string }> {
  try { return { rows: await listLeads(limit), error: "" }; } catch (e) { return { rows: [], error: e instanceof Error ? e.message : String(e) }; }
}

/** Global staff search across leads, projects and vendor prospects. */
export async function search(q: string, staff: Staff) {
  const s = q.toLowerCase().trim();
  if (s.length < 2) return { leads: [], projects: [], prospects: [] };
  const pii = can(staff, "pii.read", BRAND);
  const hit = (v: unknown) => JSON.stringify(v ?? "").toLowerCase().includes(s);
  const leads = can(staff, "leads.read", BRAND) ? (await safeLeads()).rows.filter((l) => hit([l.id, l.first_name, l.last_name, l.email, l.town, l.zip, l.company_name, l.services])).slice(0, 50)
    .map((l) => ({ id: l.id, name: [l.first_name, l.last_name].filter(Boolean).join(" "), email: pii ? l.email : maskEmail(String(l.email ?? "")), town: l.town, status: l.status, created_at: l.created_at })) : [];
  const projects = can(staff, "projects.read", BRAND) ? (await db.list("projects", BRAND, {}, { limit: 1000 })).filter((p) => hit([p.id, p.service, p.status, p.customer])).slice(0, 50)
    .map((p) => ({ id: p.id, service: p.service, status: p.status, name: (p.customer as { first_name?: string })?.first_name ?? "", town: (p.customer as { town?: string })?.town ?? "" })) : [];
  const prospects = can(staff, "datamoon.read", BRAND) ? (await db.list("vendor_contacts", BRAND, {}, { limit: 2000 })).filter((v) => hit([v.contact_id, v.first_name, v.last_name, v.city, v.zip])).slice(0, 50)
    .map((v) => ({ id: v.id, contact_id: v.contact_id, name: [v.first_name, v.last_name].filter(Boolean).join(" "), city: v.city, status: v.status, synthetic: v.synthetic })) : [];
  return { leads, projects, prospects };
}

export async function reports() {
  const { rows } = await safeLeads(2000);
  const projects = await db.list("projects", BRAND, {}, { limit: 2000 });
  const outbox = await db.list("event_outbox", BRAND, {}, { limit: 2000 });
  const by = <T,>(arr: T[], f: (x: T) => unknown) => { const m = new Map<string, number>(); for (const x of arr) { const k = String(f(x) ?? "—"); m.set(k, (m.get(k) ?? 0) + 1); } return [...m.entries()].sort((a, b) => b[1] - a[1]); };
  const d30 = rows.filter((r) => Date.now() - Date.parse(String(r.created_at)) < 30 * 864e5);
  return {
    leads30: d30.length, leadsTotal: rows.length,
    leadsBySource: by(d30, (r) => r.utm_source || (r.gclid ? "google (gclid)" : r.fbclid ? "meta (fbclid)" : "direct/unknown")),
    leadsByService: by(d30.flatMap((r) => (Array.isArray(r.services) ? r.services : [])), (s) => s),
    projectsByStatus: by(projects, (p) => p.status), projectsByService: by(projects, (p) => p.service),
    walkthroughFunnel: { requested: projects.length, started: projects.filter((p) => !["new", "walkthrough_invited"].includes(String(p.status))).length, submitted: projects.filter((p) => Number(p.current_revision_no ?? 0) > 0).length, exported: projects.filter((p) => ["exported", "sent_externally"].includes(String(p.status))).length },
    outboxByStatus: by(outbox, (e) => e.status),
  };
}

export function integrationHealth() {
  const st = integrationStatus();
  const ghl = ghlApiReady(ghlConfig());
  return {
    storage: storageMode(),
    rows: [
      { name: "Persistence (Supabase)", state: st.supabase ? "configured" : "fallback", detail: st.supabase ? "Supabase REST" : `Local ${storageMode()} store: not durable on Vercel` },
      { name: "GoHighLevel API v2", state: ghl ? "configured" : st.ghl ? "webhook" : "log mode", detail: ghl ? "Upserts via API" : st.ghl ? "Inbound webhook only" : "Nothing sent; payloads logged (redacted)" },
      { name: "GHL internal pricing fields", state: flags().ghlInternalPricingFields ? "ON" : "off", detail: "Off = typical range / budget fit / offer guidance are never sent to GHL" },
      { name: "Meta CAPI", state: st.metaCapi ? "configured" : "off", detail: "" },
      { name: "GA4 Measurement Protocol", state: st.ga4Mp ? "configured" : "off", detail: "" },
      { name: "Team lead brief email (Resend)", state: st.leadBrief ? "configured" : "off", detail: "Internal team email only; customers are never emailed by Phase 4 code" },
      { name: "OpenAI Ads CAPI", state: st.openaiCapi ? "configured" : "off", detail: "" },
      { name: "Walkthrough", state: flags().walkthrough ? "on" : "off", detail: "First-party; no vendor" },
      { name: "Estimator", state: flags().estimator ? "on" : "off", detail: "Manual pricing; price book ships blank" },
    ],
    datamoon: dmStatus(),
    measurement: measurementProviders().map((p) => ({ id: p.id, label: p.label, platform: p.platform, capability: p.capability({}), limits: p.limits })),
    staff: listConfiguredStaff().map((s) => ({ user: s.user, role: s.role, brands: s.brands })),
  };
}
