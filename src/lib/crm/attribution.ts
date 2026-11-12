/**
 * Revenue attribution (pure, unit-tested). Leads carry first/last-touch UTMs + click IDs captured in the
 * browser (src/lib/tracking.ts) and stored with the lead; /api/crm-webhook writes won/paid values back.
 */
type Row = Record<string, unknown>;

export type Channel = "google_ads" | "meta_ads" | "chatgpt_ads" | "microsoft_ads" | "email" | "organic_search" | "referral" | "direct" | "other_paid";

export function channelOf(r: Row): Channel {
  const src = String(r.utm_source ?? "").toLowerCase();
  const med = String(r.utm_medium ?? "").toLowerCase();
  if (r.gclid || r.gbraid || r.wbraid || (src === "google" && /cpc|paid|ppc/.test(med))) return "google_ads";
  if (r.openai_oppref || r.openai_obref || /chatgpt|openai/.test(src)) return "chatgpt_ads";
  if (r.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(src)) return "meta_ads";
  if (r.msclkid || /bing|microsoft/.test(src)) return "microsoft_ads";
  if (/email|newsletter/.test(med) || src === "ghl") return "email";
  if (/cpc|paid|ppc|display/.test(med)) return "other_paid";
  const ref = String(r.referrer ?? "");
  if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(ref)) return "organic_search";
  if (ref) return "referral";
  return "direct";
}

const num = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;

export type AttributionRow = { channel: Channel; campaign: string; leads: number; won: number; paid: number; revenue_won: number; revenue_paid: number };

export function summarize(leads: Row[]): AttributionRow[] {
  const m = new Map<string, AttributionRow>();
  for (const l of leads) {
    if (l.form_type === "newsletter") continue;
    const channel = channelOf(l);
    const campaign = String(l.utm_campaign ?? "(none)");
    const k = `${channel}|${campaign}`;
    const row = m.get(k) ?? { channel, campaign, leads: 0, won: 0, paid: 0, revenue_won: 0, revenue_paid: 0 };
    row.leads++;
    if (num(l.revenue_won) > 0) { row.won++; row.revenue_won += num(l.revenue_won); }
    if (num(l.revenue_paid) > 0) { row.paid++; row.revenue_paid += num(l.revenue_paid); }
    m.set(k, row);
  }
  return [...m.values()].sort((a, b) => b.revenue_paid + b.revenue_won - (a.revenue_paid + a.revenue_won) || b.leads - a.leads);
}

/** Google Ads offline conversion import (Upload → "Conversions from clicks" CSV template). */
export function googleAdsOfflineCsv(leads: Row[], conversionName = "DeckCraft Won Job", tz = "America/New_York"): string {
  const lines = [`Parameters:TimeZone=${tz}`, "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency"];
  for (const l of leads) {
    const gclid = l.gclid ? String(l.gclid) : "";
    const value = num(l.revenue_paid) || num(l.revenue_won);
    const at = String(l.paid_at ?? l.won_at ?? "");
    if (!gclid || !value || !at) continue;
    const t = new Date(at);
    if (Number.isNaN(t.getTime())) continue;
    const stamp = t.toISOString().replace("T", " ").slice(0, 19) + "+0000";
    lines.push([gclid, conversionName, stamp, value.toFixed(2), "USD"].map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(","));
  }
  return lines.join("\n") + "\n";
}
