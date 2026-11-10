import "server-only";

/** Server-only secrets. Never import from client components. */
export const env = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ghlWebhookUrl: process.env.GHL_WEBHOOK_URL, // DeckCraft sub-account inbound webhook
  ghlWebhookSecret: process.env.GHL_WEBHOOK_SECRET, // shared secret GHL sends back to /api/crm-webhook
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  metaCapiToken: process.env.META_CAPI_ACCESS_TOKEN,
  metaTestEventCode: process.env.META_TEST_EVENT_CODE,
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_ID,
  ga4ApiSecret: process.env.GA4_API_SECRET,
  adminPassword: process.env.ADMIN_PASSWORD,
  ownerAlertEmail: process.env.OWNER_ALERT_EMAIL,
  resendKey: process.env.RESEND_API_KEY,
  /** Team lead-brief email. Comma-separated recipients; falls back to OWNER_ALERT_EMAIL. */
  leadBriefTo: process.env.LEAD_BRIEF_TO || process.env.OWNER_ALERT_EMAIL,
  leadBriefFrom: process.env.LEAD_BRIEF_FROM,
  openaiPixelId: process.env.OPENAI_ADS_PIXEL_ID || process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID,
  openaiApiKey: process.env.OPENAI_ADS_API_KEY,
  isProd: process.env.NODE_ENV === "production",
};

export function integrationStatus() {
  return {
    supabase: Boolean(env.supabaseUrl && env.supabaseServiceKey),
    ghl: Boolean(env.ghlWebhookUrl),
    metaCapi: Boolean(env.metaPixelId && env.metaCapiToken),
    ga4Mp: Boolean(env.ga4MeasurementId && env.ga4ApiSecret),
    resend: Boolean(env.resendKey && env.ownerAlertEmail),
    leadBrief: Boolean(env.resendKey && env.leadBriefFrom && env.leadBriefTo),
    openaiCapi: Boolean(env.openaiPixelId && env.openaiApiKey),
  };
}
