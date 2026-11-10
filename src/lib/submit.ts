"use client";
import { dl, getAttribution, newEventId, track } from "./tracking";

export type SubmitResponse = { ok: boolean; id?: string; error?: string; fields?: Record<string, string>; funnel?: string };

/** Uploads files one by one (progress-friendly, avoids body-size limits). Returns storage paths. */
export async function uploadFiles(files: File[], kind: "assessment" | "property", onProgress?: (done: number) => void): Promise<string[]> {
  const paths: string[] = [];
  for (const [i, f] of files.entries()) {
    const fd = new FormData();
    fd.append("file", f);
    fd.append("kind", kind);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.error || `Upload failed for ${f.name}`);
    paths.push(j.path);
    onProgress?.(i + 1);
  }
  return paths;
}

/**
 * Posts a lead. event_id is generated once per form instance and reused on retry,
 * so the server's idempotency check and Meta's dedup both hold.
 */
export async function submitLead(payload: Record<string, unknown>, eventId: string, startedAt: number): Promise<SubmitResponse> {
  const body = {
    ...payload,
    event_id: eventId,
    source_page: location.pathname + location.search,
    attribution: getAttribution(),
    elapsed_ms: Date.now() - startedAt,
    ads_consent: (window as unknown as { __dcAdsConsent?: string }).__dcAdsConsent !== "denied",
  };
  const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = (await r.json().catch(() => ({ ok: false, error: "Network error" }))) as SubmitResponse;
  if (j.ok && j.id !== "ignored") {
    // Enhanced conversions for leads: GTM's Google tag hashes this before sending.
    const digits = String(payload.phone ?? "").replace(/\D/g, "");
    dl("user_data", { user_data: { email: payload.email, phone_number: digits.length === 10 ? `+1${digits}` : digits ? `+${digits}` : undefined } });
    track.generateLead({ event_id: eventId, form_type: String(payload.form_type), customer_type: payload.customer_type as string | undefined, funnel: j.funnel });
  }
  return j;
}

export { newEventId };
