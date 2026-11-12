"use client";
import { oaiqLead, openAiRefs } from "./openai-ads/client";
/**
 * Client tracking helpers. All tags load through GTM / Pixel only when IDs are configured,
 * and respect Consent Mode v2. Browser events share an event_id with the server (CAPI) call
 * so Meta deduplicates them.
 */
type DL = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer?: DL[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const ATTR_KEY = "dc_attr_v1";
const CLICK_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const TTL_DAYS = 90;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_KEYS)[number] | "landing_page" | "referrer" | "first_touch_at" | "fbc" | "fbp" | "openai_obref" | "openai_oppref" | "ft_source" | "ft_medium" | "ft_campaign" | "ga_client_id", string>>;

function readStore(): { first?: Attribution; last?: Attribution; ts?: number } {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw);
    if (v.ts && Date.now() - v.ts > TTL_DAYS * 864e5) return {};
    return v;
  } catch {
    return {};
  }
}

/** Call once per page load. Persists first touch and last non-direct touch for 90 days. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(location.search);
  const touch: Attribution = {};
  for (const k of [...UTM_KEYS, ...CLICK_KEYS]) {
    const v = p.get(k);
    if (v) touch[k] = v.slice(0, 300);
  }
  const store = readStore();
  const hasTouch = Object.keys(touch).length > 0;
  const now = new Date().toISOString();
  if (!store.first) {
    store.first = { ...touch, landing_page: location.pathname, referrer: document.referrer.slice(0, 300) || undefined, first_touch_at: now };
  }
  if (hasTouch) store.last = { ...touch, landing_page: location.pathname, referrer: document.referrer.slice(0, 300) || undefined };
  if (touch.fbclid) {
    // Meta click-id cookie format: fb.1.<ms>.<fbclid>
    const fbc = `fb.1.${Date.now()}.${touch.fbclid}`;
    try { document.cookie = `_fbc=${fbc}; path=/; max-age=${TTL_DAYS * 86400}; SameSite=Lax`; } catch {}
  }
  if (touch.gclid) {
    try { document.cookie = `dc_gclid=${encodeURIComponent(touch.gclid)}; path=/; max-age=${TTL_DAYS * 86400}; SameSite=Lax; Secure`; } catch {}
  }
  store.ts = store.ts ?? Date.now();
  try { localStorage.setItem(ATTR_KEY, JSON.stringify(store)); } catch {}
}

function cookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1];
}

/** Last touch wins for click IDs/UTMs; first touch fills gaps. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const s = readStore();
  const merged: Attribution = { ...(s.first ?? {}), ...(s.last ?? {}) };
  merged.landing_page = s.first?.landing_page;
  merged.first_touch_at = s.first?.first_touch_at;
  // First-touch campaign kept alongside last-touch so revenue can be credited either way.
  if (s.first?.utm_source) merged.ft_source = s.first.utm_source;
  if (s.first?.utm_medium) merged.ft_medium = s.first.utm_medium;
  if (s.first?.utm_campaign) merged.ft_campaign = s.first.utm_campaign;
  const ga = cookie("_ga"); // GA1.1.<cid1>.<cid2> → client_id for GA4 Measurement Protocol stage events
  if (ga) merged.ga_client_id = ga.split(".").slice(-2).join(".");
  const fbc = cookie("_fbc");
  const fbp = cookie("_fbp");
  if (fbc) merged.fbc = decodeURIComponent(fbc);
  const gc = cookie("dc_gclid");
  if (!merged.gclid && gc) merged.gclid = decodeURIComponent(gc);
  if (fbp) merged.fbp = decodeURIComponent(fbp);
  Object.assign(merged, openAiRefs());
  return merged;
}

export function newEventId(prefix = "lead") {
  const r = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}_${r}`;
}

export function dl(event: string, params: DL = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function fb(kind: "track" | "trackCustom", name: string, params: DL = {}, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) window.fbq(kind, name, params, { eventID: eventId });
  else window.fbq(kind, name, params);
}

/** Standard event names from master brief §13. */
export const track = {
  viewService(service: string) { dl("view_service", { service }); fb("track", "ViewContent", { content_name: service }); },
  formStart(form_type: string) { dl("form_start", { form_type }); },
  /** Spec §4: assessment / estimate form viewed. */
  assessmentView(form_type: string) { dl("assessment_view", { form_type }); },
  /** Spec §4 photos_uploaded (+ legacy photo_upload_success). A photo upload is NOT a conversion or a sale. */
  photoUploadSuccess(count: number, form_type: string) { dl("photo_upload_success", { count, form_type }); dl("photos_uploaded", { count, form_type }); fb("trackCustom", "PhotosUploaded", { count }); },
  /** Spec §4 qualified_lead (browser side): only hot/warm tiers. The CRM "Qualified" stage sends the server-side one. */
  qualifiedLead(p: { event_id: string; form_type: string; tier: string }) { dl("qualified_lead", p); },
  generateLead(p: { event_id: string; form_type: string; customer_type?: string; funnel?: string; value?: number }) {
    dl("generate_lead", { ...p, currency: "USD" });
    if (p.form_type === "walkthrough") dl("walkthrough_request", { event_id: p.event_id, customer_type: p.customer_type });
    fb("track", "Lead", {
      content_name: p.form_type === "walkthrough" ? "Property Walkthrough" : p.form_type === "newsletter" ? "Newsletter" : "Free Photo Assessment",
      content_category: p.customer_type && p.customer_type !== "homeowner" ? "Property Programs" : "Residential",
    }, p.event_id);
    // Google tag (direct gtag only; with GTM the container handles generate_lead from the dataLayer).
    googleLead(p.event_id, p.form_type);
    // OpenAI Ads: same event_id as the server Conversions API call → one conversion.
    if (p.form_type !== "newsletter" && (window as unknown as { __dcAdsConsent?: string }).__dcAdsConsent === "granted") oaiqLead(p.event_id);
  },
  phoneClick(location: string) { dl("phone_click", { location }); fb("track", "Contact"); },
  toolComplete(tool: string, result: string) { dl("tool_complete", { tool, result }); },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
const HAS_GTM = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

/** Enhanced conversions: Google's tag hashes these client-side; only set when ad consent is granted. */
export function setGoogleUserData(email?: string, phoneE164?: string) {
  if (typeof window === "undefined" || !window.gtag || HAS_GTM) return;
  if ((window as unknown as { __dcAdsConsent?: string }).__dcAdsConsent !== "granted") return;
  window.gtag("set", "user_data", { email, phone_number: phoneE164 });
}

function googleLead(eventId: string, formType: string) {
  if (typeof window === "undefined" || !window.gtag || HAS_GTM || formType === "newsletter") return;
  if (GA4_ID) window.gtag("event", "generate_lead", { form_type: formType, event_id: eventId });
  // transaction_id = event_id → Google de-duplicates repeat fires of the same submission.
  if (GADS_ID && GADS_LEAD_LABEL) window.gtag("event", "conversion", { send_to: `${GADS_ID}/${GADS_LEAD_LABEL}`, transaction_id: eventId });
}
