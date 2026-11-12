# 08 — Tracking, Pixels, Conversions API and Attribution

## What the code already does (verified in sandbox E2E)
- **Attribution capture** (`src/lib/tracking.ts`): on every page load it stores first touch + last non-direct touch for 90 days in localStorage: `utm_source/medium/campaign/content/term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, landing page, referrer, first-touch time. It writes the `_fbc` cookie from `fbclid` and reads `_fbc`/`_fbp`. Everything is sent with each lead into the store and the GHL payload. *Verified: gclid + utm_campaign + landing page arrived in the mock GHL payload.*
- **Consent Mode v2 defaults** in `<head>` before any tag (`src/lib/consent.ts`): default granted (US opt-out model) or denied via `NEXT_PUBLIC_CONSENT_DEFAULT`. **Global Privacy Control denies ad storage.** The Pixel is revoked when ads consent is denied. A "Change your cookie choices" control is on /privacy.
- **GTM and Meta Pixel** load only when their IDs are set.
- **Events pushed to `dataLayer`** (and Pixel where noted):

| Event | When | Pixel |
|---|---|---|
| page_view | GA4 config tag in GTM (+ `virtual_page_view` on client route changes) | PageView (base code) |
| view_service | service, assessment and walkthrough pages | ViewContent |
| form_start | first interaction with any lead form | — |
| photo_upload_success | files added to the dropzone | PhotosUploaded (custom) |
| generate_lead | server confirmed the lead (`event_id`, `form_type`, `customer_type`, `funnel`) | Lead with `eventID` = event_id |
| walkthrough_request | walkthrough leads (in addition to generate_lead) | — |
| phone_click | any tel: link | Contact |
| tool_complete | checker/planner finished | — |
| qualified_lead, appointment_booked, estimate_sent, contract_signed, purchase | GHL stage change → `/api/crm-webhook` → GA4 Measurement Protocol + Meta CAPI | QualifiedLead, Schedule, EstimateSent, SubmitApplication, Purchase (server) |

- **Deduplication:** the browser generates `event_id` once per form instance. The server stores it (unique) and sends CAPI `Lead` with the same `event_id`, so Meta dedups browser and server. Replays of the same `event_id` return `duplicate: true` and do **not** re-post to GHL or CAPI. *Verified.* Stage events use the deterministic id `{opportunity_id}:{stage}` so GHL retries never double count.
- **Hashing:** CAPI user data (email, phone E.164, name, city, state, country, external_id) is SHA-256 hashed server-side. Tokens live only in server env vars. **No private key is in client code.**

## GTM container (build this)
Variables: DLV event_id, form_type, customer_type, funnel, value; user-provided data variable (email/phone from a `user_data` push; see below).

| Tag | Type | Trigger | Notes |
|---|---|---|---|
| GA4 Config | Google tag (G-…) | Initialization – All Pages | Consent: analytics_storage |
| GA4 – generate_lead | GA4 event | CE generate_lead | params form_type, customer_type, funnel; mark as **key event** |
| GA4 – walkthrough_request | GA4 event | CE walkthrough_request | key event |
| GA4 – form_start / photo_upload_success / view_service / phone_click / tool_complete | GA4 event | matching CE | |
| Google Ads – Lead | Google Ads conversion | CE generate_lead | Transaction ID = event_id (dedup); **enhanced conversions: on** with user-provided data |
| Google Ads – Phone click | Google Ads conversion | CE phone_click | secondary |
| Conversion Linker | | All pages | required for gclid |

**Enhanced conversions for leads:** `src/lib/submit.ts` already pushes `{event: "user_data", user_data: {email, phone_number (E.164)}}` right before `generate_lead`. In GTM, create a *User-Provided Data* variable from the DLV `user_data` and attach it to the Google Ads Lead tag. Then turn on "Enhanced conversions for leads" in Google Ads → Conversions → Settings.

## Offline conversions back to Google Ads
GCLID/GBRAID/WBRAID are stored on the GHL contact. Two options:
1. **GHL native Google Ads integration** (if enabled on your plan): map the Estimate Booked / Won / Paid stages to Google Ads conversion actions.
2. **Scheduled upload:** GHL workflow → Google Sheet row `{gclid, conversion name, time, value}` → Google Ads "Scheduled uploads" from Sheets, daily. Conversion actions: `DC – Qualified`, `DC – Estimate Booked`, `DC – Won (value)`.

Use **enhanced conversions for leads** (hashed email/phone) as a fallback match when no gclid exists.

## Call tracking
Use GHL numbers (or CallRail) per source: Google Ads call asset, GBP, website default, Meta. Dynamic number insertion on the site keyed off `utm_source`/gclid when you enable it. Record calls, and treat calls ≥60s as conversions. Set `NEXT_PUBLIC_PHONE` to the website default number.

## End-to-end verification checklist (run before calling anything "live")
1. Open `https://deckcraftboston.com/services/deck-repair?utm_source=test&utm_medium=cpc&utm_campaign=verify&gclid=TEST-GCLID-001` in a fresh browser with GTM Preview and Meta Pixel Helper.
2. **GTM Preview:** `virtual_page_view` and the GA4 config fire, and Conversion Linker fires.
3. Go to /free-assessment and complete the form with a test email `test+{date}@deckcraftboston.com`, consent checked, 2 photos.
4. GTM Preview: `form_start` → `photo_upload_success` → `generate_lead` (note the `event_id`). GA4 + Ads Lead tags fired once.
5. **Pixel Helper:** `Lead` with `eventID` = the same event_id.
6. **Supabase:** a `leads` row with that event_id, `gclid = TEST-GCLID-001`, `utm_campaign = verify`, 2 `photo_urls`, `ghl_sync_status = sent`.
7. **GHL:** the contact exists with every mapped field and tag, the Residential opportunity is at Photos Received, the SMS + email arrived, and the photo links open.
8. **Meta Events Manager → Test Events** (set `META_TEST_EVENT_CODE`): `Lead` from both Browser and Server, shown as **deduplicated**.
9. **GA4 DebugView / Realtime:** `generate_lead` with params.
10. Reload /thank-you: no second `generate_lead`.
11. Move the GHL opportunity to Estimate Booked. The GHL execution log shows 200 from `/api/crm-webhook`, Meta Test Events shows `Schedule` (server), and GA4 shows `appointment_booked`.
12. Google Ads → Conversions → the Lead action shows "Recording conversions" within 24–48h. Upload the test gclid conversion via Sheets and confirm it's accepted (test gclids will error "not found"; use a real ad click for final validation).
13. Repeat 3–11 for /request-walkthrough (Property Accounts pipeline + owner alert + `walkthrough_request`).
14. Remove `META_TEST_EVENT_CODE`. Delete the test contacts/leads.

Only after every step passes: mark the pixel, CAPI, GA4, Ads and GHL as **live** in the launch checklist.

## Phase 2 additions
- **Direct Google tag:** loads only when `NEXT_PUBLIC_GTM_ID` is empty, so nothing is counted twice.
  - GA4 sends `generate_lead`.
  - Google Ads sends `conversion` with `send_to = AW-ID/LABEL` and `transaction_id = event_id`.
  - Enhanced conversions (`user_data`) are set only when ad consent is granted.
- **Click ids persisted:** gclid, gbraid, wbraid, fbclid, msclkid and ttclid. gclid is also mirrored in a first-party `dc_gclid` cookie for 90 days.
- **Also captured:** first-touch source, medium and campaign (`ft_*`) and the GA client id.
- **Revenue:** CRM stage webhooks store won and paid revenue. `/api/admin/attribution` summarizes it, and `?format=gads` exports Google Ads offline conversions.
- **Intent pixel:** loads only with `NEXT_PUBLIC_INTENT_ENABLED=true` and after ad consent is granted. See `10-intent-audiences.md`.

## Phase 2 spec §4 measurement events (source of truth `src/config/measurement.ts`)
| Event | Where it fires | Notes |
|---|---|---|
| `assessment_view` | Browser dataLayer: /free-assessment, /new-deck-estimate, /request-walkthrough | `form_type` = assessment / new_deck_estimate / walkthrough |
| `photos_uploaded` | Browser, after photos upload in a form (alongside legacy `photo_upload_success`) | **Not a conversion.** Never import it as a sale or bid on it as a purchase |
| `qualified_lead` | Browser at submit when tier is hot/warm; server (GA4 MP + Meta CAPI `QualifiedLead` + OpenAI custom) when GHL moves to *Qualified* | |
| `appointment_booked` | Server, GHL *Inspection booked* / *Walkthrough* | Meta `Schedule`, OpenAI `appointment_scheduled` |
| `estimate_sent` | Server, GHL *Estimate sent* / *Bid/RFP* | |
| `won_job` | Server, GHL won (with contract value) | Meta `WonJob` |
| `revenue` | Server, GHL `paid` event (with collected value, `transaction_id` = opportunity id) | Meta `Purchase`; Google Ads offline import via `/api/admin/attribution?format=gads` |

`generate_lead` still fires on every successful form so existing conversions keep working. All server events use
`event_id = <opportunity_id>:<event>` and the webhook is idempotent, so GHL retries never double count.
