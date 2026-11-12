import { NextResponse } from "next/server";
import { integrationStatus } from "@/lib/server/env";
import { ghlApiReady, ghlConfig } from "@/config/ghl";
import { intentConfig } from "@/lib/intent/adapter";
import { site, noIndex } from "@/config/site";

export const dynamic = "force-dynamic";

/**
 * Reports which integrations have credentials present. "configured" ≠ "working": verify each one
 * end-to-end with the QA / launch checklist before going live. Booleans only — never secret values.
 */
export function GET() {
  const g = ghlConfig();
  return NextResponse.json({
    ok: true,
    env: process.env.VERCEL_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "development"),
    noindex: noIndex,
    configured: {
      ...integrationStatus(),
      ghl_api: ghlApiReady(g),
      ghl_mode: ghlApiReady(g) ? "api" : process.env.GHL_WEBHOOK_URL ? "webhook" : "log",
      ghl_pipelines: { residential: Boolean(g.pipelines.residential), commercial: Boolean(g.pipelines.commercial) },
      ghl_custom_fields_mapped: Object.keys(g.fields).length,
      ghl_workflows_mapped: Object.keys(g.workflows).length,
      gtm: Boolean(process.env.NEXT_PUBLIC_GTM_ID),
      ga4_tag: Boolean(process.env.NEXT_PUBLIC_GA4_ID),
      google_ads: Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
      meta_pixel: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
      crm_webhook_secret: Boolean(process.env.GHL_WEBHOOK_SECRET),
      admin_password: Boolean(process.env.ADMIN_PASSWORD),
      openai_pixel: Boolean(process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID),
      openai_validate_only: process.env.OPENAI_ADS_VALIDATE_ONLY !== "false",
      intent: intentConfig().enabled,
      phone_shown: Boolean(site.phone),
    },
    note: "Credentials present does not mean the integration is verified. See docs/15-launch-checklist.md.",
  });
}
