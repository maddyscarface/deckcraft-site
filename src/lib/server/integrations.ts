import "server-only";
import { createHash } from "node:crypto";
import { env } from "./env";

const sha = (v?: string | null) => (v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined);
const digits = (v?: string | null) => (v ? v.replace(/\D/g, "").replace(/^(?!1)(\d{10})$/, "1$1") : undefined);

/* ---------------- GoHighLevel (inbound webhook) ---------------- */

export async function sendToGhl(payload: Record<string, unknown>): Promise<{ ok: boolean; status: number | "skipped"; error?: string }> {
  if (!env.ghlWebhookUrl) return { ok: false, status: "skipped", error: "GHL_WEBHOOK_URL not set" };
  try {
    const r = await fetch(env.ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    return { ok: r.ok, status: r.status, error: r.ok ? undefined : (await r.text()).slice(0, 300) };
  } catch (e) {
    return { ok: false, status: 0, error: String(e).slice(0, 300) };
  }
}

/* ---------------- Meta Conversions API ---------------- */

export type CapiEvent = {
  event_name: "Lead" | "Schedule" | "QualifiedLead" | "SubmitApplication" | "Purchase" | "Contact" | string;
  event_id: string;
  event_time?: number;
  action_source?: "website" | "system_generated" | "phone_call";
  event_source_url?: string;
  user: { email?: string; phone?: string; first_name?: string; last_name?: string; town?: string; external_id?: string; fbc?: string; fbp?: string; ip?: string; ua?: string };
  custom_data?: Record<string, unknown>;
};

export async function sendCapi(e: CapiEvent) {
  if (!env.metaPixelId || !env.metaCapiToken) return { ok: false, skipped: true };
  const body = {
    data: [{
      event_name: e.event_name,
      event_time: e.event_time ?? Math.floor(Date.now() / 1000),
      event_id: e.event_id,
      action_source: e.action_source ?? "website",
      event_source_url: e.event_source_url,
      user_data: {
        em: sha(e.user.email) ? [sha(e.user.email)] : undefined,
        ph: sha(digits(e.user.phone)) ? [sha(digits(e.user.phone))] : undefined,
        fn: sha(e.user.first_name) ? [sha(e.user.first_name)] : undefined,
        ln: sha(e.user.last_name) ? [sha(e.user.last_name)] : undefined,
        ct: sha(e.user.town?.replace(/\s/g, "")) ? [sha(e.user.town?.replace(/\s/g, ""))] : undefined,
        st: [sha("ma")],
        country: [sha("us")],
        external_id: e.user.external_id ? [sha(e.user.external_id)] : undefined,
        fbc: e.user.fbc,
        fbp: e.user.fbp,
        client_ip_address: e.user.ip,
        client_user_agent: e.user.ua,
      },
      custom_data: e.custom_data,
    }],
    test_event_code: env.metaTestEventCode || undefined,
  };
  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${env.metaPixelId}/events?access_token=${env.metaCapiToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    return { ok: r.ok, status: r.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/* ---------------- GA4 Measurement Protocol (server / offline stage events) ---------------- */

export async function sendGa4(clientId: string, name: string, params: Record<string, unknown>) {
  if (!env.ga4MeasurementId || !env.ga4ApiSecret) return { ok: false, skipped: true };
  const r = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${env.ga4MeasurementId}&api_secret=${env.ga4ApiSecret}`,
    { method: "POST", body: JSON.stringify({ client_id: clientId, events: [{ name, params }] }), signal: AbortSignal.timeout(8000) },
  ).catch(() => null);
  return { ok: Boolean(r && r.status < 300) };
}

export const hashForEnhancedConversions = { sha, digits };
