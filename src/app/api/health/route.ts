import { NextResponse } from "next/server";
import { integrationStatus } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/**
 * Reports which integrations have credentials present. "configured" ≠ "working": verify each one
 * end-to-end with the QA / launch checklist before going live. Booleans only — never secret values.
 */
export function GET() {
  return NextResponse.json({
    ok: true,
    configured: {
      ...integrationStatus(),
      gtm: Boolean(process.env.NEXT_PUBLIC_GTM_ID),
      crm_webhook_secret: Boolean(process.env.GHL_WEBHOOK_SECRET),
      admin_password: Boolean(process.env.ADMIN_PASSWORD),
      openai_pixel: Boolean(process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID),
      openai_validate_only: process.env.OPENAI_ADS_VALIDATE_ONLY !== "false",
    },
    note: "Credentials present does not mean the integration is verified. See docs/15-launch-checklist.md.",
  });
}
