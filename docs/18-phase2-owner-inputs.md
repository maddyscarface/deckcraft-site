# Phase 2: what shipped, what runs in mock mode, and what we need from you

Branch `phase2-dev` → staging `https://deckcraft-staging.vercel.app` (noindex). Production (`deckcraft-site.vercel.app`) is untouched.

## Shipped
- **New identity, "Cedar & Charcoal":** charcoal (#1b1a17), cedar (#b4542b), bone (#f6f3ee). Archivo Expanded display type with Instrument Serif italic accents. New plank wordmark and favicon. Photo-led layouts.
- **Photography:** 16 Pexels-licensed photos, served through next/image (AVIF/WebP). Each one is listed in `src/lib/photos.ts` and on `/photo-credits`. The site labels them as licensed stock and never as DeckCraft jobs. See `17-photo-assets.md`.
- **Contact:** the email is info@deckcraftbuild.com. The phone number and every click-to-call stay hidden until `NEXT_PUBLIC_PHONE` and `NEXT_PUBLIC_PHONE_E164` are both set. Social links render only when their URLs are set.
- **Honesty:** `[OWNER TO CONFIRM]` placeholders are removed. Fence prices say "quoted from your photos". The reviews, gallery and credentials sections show honest empty states until real items exist.
- **GoHighLevel API v2:**
  - Separate DeckCraft pipelines: "DeckCraft · Residential" and "DeckCraft · Property Programs".
  - Contacts and opportunities are written with duplicate-safe upserts.
  - Lead score and tier sync as tags (`score:N`, `tier:hot|warm|nurture`) and as custom fields.
  - Follow-up sequences are applied as `wf:*` tags. Leads are enrolled in workflows directly when you provide workflow IDs.
  - Stage webhooks write revenue back to the lead record and trigger stage sequences such as review requests and lost-lead re-engagement.
  - Without credentials it runs in LOG mode and sends nothing.
- **Tracking:**
  - GTM or direct GA4 and Google Ads gtag. The direct tag loads only when there is no GTM container, so nothing is counted twice.
  - Google Ads lead conversions use `transaction_id = event_id`, and enhanced conversions run only when ad consent is granted.
  - Meta Pixel plus CAPI, and OpenAI Ads pixel plus CAPI, both de-duplicated on the shared event_id.
  - Consent Mode v2, with Global Privacy Control respected.
  - Persists UTMs, gclid/gbraid/wbraid/fbclid/msclkid/ttclid, first-touch campaign and the GA client id.
  - Each tag stays inactive until its ID is set.
- **Revenue attribution:** `/api/admin/attribution` (needs ADMIN_PASSWORD) reports leads, wins and revenue by channel and campaign. Add `?format=gads` to get a Google Ads offline-conversion CSV for won and paid jobs.
- **Intent data:** a DataMoon or AudienceLab adapter at `/api/intent/webhook`. It is disabled by default and returns 404. When enabled it only tags contacts for email and audience use (`intent:no-sms`), never SMS. The browser pixel loads only after consent.
- **`/api/health`:** now reports every integration as a true/false flag. It never shows secret values.

## Mock or inactive until you provide these
| Item | Env vars | Effect until set |
|---|---|---|
| GHL API | `GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_*_ID`, `GHL_STAGE_IDS`, `GHL_CUSTOM_FIELD_IDS`, `GHL_WORKFLOW_IDS` | Uses the webhook if `GHL_WEBHOOK_URL` is set. Otherwise LOG mode, and nothing is sent. |
| Lead database and photo storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (run `supabase/schema.sql`, create the `assessment-photos` and `property-files` buckets) | Staging writes leads and photos to temporary function storage (`ALLOW_LOCAL_STORE=1`). Nothing is kept, so production must not launch without Supabase. |
| GA4 / GTM | `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_ID`, `GA4_API_SECRET` | No analytics. |
| Google Ads | `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`, `GOOGLE_ADS_OFFLINE_CONVERSION_NAME` | No conversions are sent. |
| Meta | `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN` | Inactive. |
| OpenAI Ads | `NEXT_PUBLIC_OPENAI_PIXEL_ID`, `OPENAI_ADS_*` (`VALIDATE_ONLY=true` on staging) | Inactive or validate-only. |
| Emails | `RESEND_API_KEY`, `OWNER_ALERT_EMAIL`, `LEAD_BRIEF_*` | No owner alert or lead-brief emails. |
| Intent | `INTENT_*` | Disabled, and the webhook returns 404. |
| Phone | `NEXT_PUBLIC_PHONE` + `NEXT_PUBLIC_PHONE_E164` | Hidden everywhere. |

## Open owner inputs
1. **Phone number.** Nothing shows until you give us one.
2. **DNS for deckcraftbuild.com** pointed at Vercel, and **mailbox and sending domain** for info@deckcraftbuild.com (SPF, DKIM and DMARC for Resend and GHL).
3. **GHL DeckCraft sub-account:** the two pipelines with the stage names in `src/config/ghl.ts`, the custom fields, a Private Integration token and the workflow IDs.
4. **Ad account IDs:** GTM, GA4, Google Ads with a conversion label, Meta pixel and CAPI token, and OpenAI Ads.
5. **Real job photos** (before, during and after) to replace the stock, plus **real reviews**, **licence and insurance details** and **warranty terms** before any of them are shown.
6. **Price confirmation** for the repair, staining and replacement ranges in `src/lib/services.ts`.
7. **The five Phase 2 spec files never reached the build box.** Phase 2 was built from the brief and the scoping page. Please re-send the specs so we can reconcile any gaps.
8. **Intent data:** a privacy review, then the provider choice and its secret.
