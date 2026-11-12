/**
 * Intent-data / visitor-identification adapter (DataMoon or AudienceLab). DISABLED BY DEFAULT.
 *
 * Enable only after a privacy review (MA/FL state privacy law, platform terms):
 *   INTENT_ENABLED=true                   server kill switch (anything else = off; webhook returns 404)
 *   INTENT_PROVIDER=datamoon|audiencelab  which normalizer to use
 *   INTENT_WEBHOOK_SECRET=...             shared secret the provider sends in `x-intent-secret`
 *   INTENT_MIN_SCORE=60                   ignore weaker signals
 *   NEXT_PUBLIC_INTENT_ENABLED=true + NEXT_PUBLIC_INTENT_PIXEL_SRC + INTENT_PIXEL_HOST  (consent-gated browser pixel)
 *
 * Signals become GHL contact tags (`intent:*`) for email nurture and audience building only.
 * They are NEVER enrolled in SMS and never treated as a form lead or ad conversion.
 */
export type IntentSignal = {
  provider: "datamoon" | "audiencelab";
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  city?: string;
  state?: string;
  score: number; // 0–100
  topics: string[];
  pages: string[];
  seen_at: string;
};

export interface IntentProvider {
  id: IntentSignal["provider"];
  /** Map the provider's webhook body to a normalized signal (null = ignore). */
  normalize(body: unknown): IntentSignal | null;
}

type Obj = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const arr = (v: unknown) => (Array.isArray(v) ? v.map(String).filter(Boolean) : typeof v === "string" && v ? v.split(/[,|]/).map((x) => x.trim()).filter(Boolean) : []);
const n = (v: unknown) => { const x = Number(v); return Number.isFinite(x) ? Math.max(0, Math.min(100, x)) : 0; };

/** Field names follow each vendor's documented export columns; confirm against the live account before enabling. */
export const datamoon: IntentProvider = {
  id: "datamoon",
  normalize(body) {
    const b = (body ?? {}) as Obj;
    const p = ((b.person ?? b.contact ?? b) as Obj);
    return {
      provider: "datamoon",
      email: s(p.email)?.toLowerCase(), first_name: s(p.first_name ?? p.firstName), last_name: s(p.last_name ?? p.lastName),
      company: s(p.company ?? p.company_name), city: s(p.city), state: s(p.state),
      score: n(b.intent_score ?? b.score), topics: arr(b.topics ?? b.keywords), pages: arr(b.pages ?? b.page_urls),
      seen_at: s(b.timestamp ?? b.seen_at) ?? new Date().toISOString(),
    };
  },
};

export const audiencelab: IntentProvider = {
  id: "audiencelab",
  normalize(body) {
    const b = (body ?? {}) as Obj;
    return {
      provider: "audiencelab",
      email: (s(b.PERSONAL_EMAIL) ?? s(b.BUSINESS_EMAIL) ?? s(b.email))?.toLowerCase(),
      first_name: s(b.FIRST_NAME ?? b.first_name), last_name: s(b.LAST_NAME ?? b.last_name),
      company: s(b.COMPANY_NAME ?? b.company), city: s(b.PERSONAL_CITY ?? b.city), state: s(b.PERSONAL_STATE ?? b.state),
      score: n(b.SCORE ?? b.score ?? 70), topics: arr(b.SEGMENT ?? b.segments ?? b.topics), pages: arr(b.URL ?? b.pages),
      seen_at: s(b.EVENT_TIMESTAMP ?? b.timestamp) ?? new Date().toISOString(),
    };
  },
};

export const PROVIDERS: Record<string, IntentProvider> = { datamoon, audiencelab };

export function intentConfig(e: NodeJS.ProcessEnv = process.env) {
  const provider = PROVIDERS[String(e.INTENT_PROVIDER ?? "").toLowerCase()];
  return { enabled: e.INTENT_ENABLED === "true" && Boolean(provider), provider, secret: e.INTENT_WEBHOOK_SECRET, minScore: Number(e.INTENT_MIN_SCORE ?? 60) || 60 };
}

/** Tags written to GHL for a qualifying signal (email nurture / audiences only). */
export function intentTags(sig: IntentSignal): string[] {
  const band = sig.score >= 85 ? "high" : sig.score >= 70 ? "medium" : "low";
  return [`intent:${sig.provider}`, `intent:${band}`, "intent:no-sms", ...sig.topics.slice(0, 5).map((t) => `intent-topic:${t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`)];
}
