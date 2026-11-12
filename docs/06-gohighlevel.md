# 06 — GoHighLevel: Sub-account, Pipelines, Field Map, Workflows

## 1. Sub-account
Create a **dedicated DeckCraft Boston sub-account**: its own phone number, email sending domain (mail.deckcraftboston.com), A2P 10DLC brand + campaign, calendars, pipelines and review link. Never share a sub-account with any sister business.

**A2P 10DLC:** register the brand (DeckCraft Boston legal entity, EIN) and a "Customer care / Mixed" campaign. Use the opt-in language from the site forms and the privacy/terms URLs. **No SMS sends until it's approved.** Text only contacts with `sms_consent = true`.

## 2. Inbound webhook (website → GHL)
Workflow **"WEB | Inbound lead"**, trigger: *Inbound Webhook*. Copy the URL into `GHL_WEBHOOK_URL`.

### Field map
| Webhook field | GHL field | Type |
|---|---|---|
| first_name, last_name, email, phone | Contact standard | — |
| sms_consent, sms_consent_at | `SMS Consent` (checkbox), `SMS Consent At` (date) | custom |
| customer_type | `Customer Type` (dropdown: homeowner/hoa_condo/landlord_pm/commercial) | custom |
| company_name | Company Name | standard |
| role | `Role` | custom text |
| town / towns | City / `Towns` | standard / custom |
| services | `Services Requested` (multi-select) | custom |
| material, size_estimate | `Material`, `Size Estimate` | custom |
| property_count, unit_count, structure_count, fence_linear_ft | `Properties`, `Units`, `Structures`, `Fence LF` | custom number |
| timeline, board_meeting_date, budget_process, maintenance_frequency | matching custom fields | custom |
| message | `Project Notes` | custom large text |
| photo_urls (newline list of 14-day signed links), photo_count | `Photo Links`, `Photo Count` | custom |
| file_urls | `Property Files` | custom |
| checker_result | `Checker Result` | custom |
| funnel, pipeline, lead_score, tags | `Funnel`, `Pipeline`, `Lead Score`; tags via "Add Tag" from the comma list | custom |
| utm_*, gclid, gbraid, wbraid, fbclid, fbc, fbp, landing_page, referrer, first_touch_at | matching `Attribution –` custom fields | custom |
| lead_id, event_id | `Website Lead ID`, `Event ID` | custom |

The signed photo links expire after 14 days. During the first review, the reviewer should download the photos into the contact's files.

### Workflow steps
1. Create/Update Contact (match on email, then phone).
2. Map fields as above. Add tags from `tags`.
3. **If pipeline = residential:** Create Opportunity in **Residential** at stage *New Lead*, or *Photos Received* if photo_count > 0, otherwise *Photos Requested*.
4. **If pipeline = commercial:** Create Opportunity in **Property Accounts** at stage *Property Inquiry*. Send an internal SMS + email alert to the owner immediately.
5. If form_type = newsletter: add tag `newsletter`, add to the "Seasonal Tips" email list, stop.
6. Start the speed-to-lead workflow below.

## 3. Pipelines
**Residential:** New Lead → Photos Requested → Photos Received → Qualified → Estimate Booked → Estimate Sent → Follow-Up → Won → Scheduled → Completed → Paid → Lost/Nurture

**Property Accounts:** Property Inquiry → Qualified Portfolio → Walkthrough → Proposal → Board/Owner Approval → Contract → Active Work → Renewal (Lost/Nurture as a side status)

Required opportunity fields: Service, Town, Value (estimate total), Lost Reason (Price / Timing / Went DIY / Chose other / No response / Out of area / Not a fit).

## 4. Tags (created automatically by the site)
`src:website`, `form:{assessment|walkthrough|short|checker|newsletter}`, `funnel:{A_deck_repair|B_staining|C_repair_or_replace|D_fencing|E_property_programs}`, `seg:{homeowner|hoa_condo|landlord_pm|commercial}`, `svc:{…}`, `town:{slug}`, `timeline:{…}`, `photos:{received|requested}`, `sms:opt-in`, `paid:{google|meta}`, `cmp:{campaign}`, `checker:{result}`.

## 5. Automations

| # | Workflow | Trigger | Actions |
|---|---|---|---|
| 1 | Instant acknowledgment | Inbound lead | If `sms:opt-in`: SMS within 60s (below). Email within 2 min. Business hours: create a call task due in 5 min, assigned round-robin to the BDR. After hours: task due at 8:30am the next business day |
| 2 | Photo request reminders | Stage = Photos Requested | Day 0 +2h SMS/email with an upload link (`/free-assessment`) or "reply with photos". +1 day reminder. +3 days final. Then move to Nurture. Stop when stage changes |
| 3 | Missed-call text-back | Missed inbound call on the DeckCraft number | Send SMS: "Sorry we missed you — this is DeckCraft Boston. Reply here or send photos at deckcraftboston.com/free-assessment." **Only where permissible:** responding to a caller's own inbound call is generally treated as a response to their request, but confirm with counsel. Do not add them to marketing sequences without consent |
| 4 | Estimate reminders | Appointment booked (calendar "Estimate Visit") | Confirmation now, then reminders at 24h and 2h (SMS if consented, else email). Includes what to expect and access notes |
| 5 | No-show | Appointment status = no-show | +15 min SMS "We missed you — want to rebook?" with a calendar link. +1 day email. Task for the BDR |
| 6 | Estimate/proposal follow-up | Stage = Estimate Sent (or Proposal) | Day 2 check-in, day 5 "questions?", day 10 "should we hold your slot?", day 21 move to Follow-Up/Nurture. Property: day 2 and day 5, then align to the board meeting date if known |
| 7 | Job preparation | Stage = Scheduled | 3 days before: prep checklist (move furniture, pets, access, water spigot). 1 day before: crew arrival window |
| 8 | Completion confirmation | Stage = Completed | Same day: thank you, before/after photos, and a request for permission to share photos (separate yes/no). Owner review task |
| 9 | Review request | Stage = Paid | +1 day review request with the Google review link. +4 days one reminder. Ask every customer the same way; never gate reviews (only asking happy customers) and never offer incentives |
| 10 | Seasonal maintenance | Tag `customer` + service staining | Email (and SMS if consented) at the next Oct and Apr windows: "Time for the water test" |
| 11 | Annual inspection renewal | Property Accounts stage = Active Work → Renewal | 60 days before the anniversary: renewal email + task. 30 days: call task |
| 12 | Sync failure alert | (website side) 3 failed GHL attempts | Website cron sets status failed. Owner email alert (Resend) |
| 13 | Stage → ad platforms | Opportunity stage changes to Qualified / Estimate Booked / Walkthrough / Estimate Sent / Won / Paid | Webhook POST to `https://deckcraftboston.com/api/crm-webhook` with header `x-dc-secret`, body `{stage, lead_id, opportunity_id, email, phone, first_name, last_name, town, value, service, fbc, fbp}`. Stage keys: `qualified`, `estimate_booked`, `walkthrough_booked`, `estimate_sent`, `won`, `paid` |

**Opt-out handling:** GHL handles STOP/UNSUBSCRIBE automatically. Make sure "DND" applies across workflows. Never re-add opted-out contacts.

## 6. Message copy

**SMS — homeowner acknowledgment**
> Hi {{contact.first_name}}, this is DeckCraft Boston. We got your request{{#if photos}} and photos{{/if}} and we're reviewing them now. We'll reply soon with what we see. Reply here anytime. Reply STOP to opt out.

**SMS — photos requested**
> Hi {{contact.first_name}}, it's DeckCraft Boston. To give you a range, can you reply with 3 photos: the whole deck or fence, the worst spot, and the stairs or gate? Phone photos are perfect.

**Email — acknowledgment (homeowner)**
Subject: We got your request — DeckCraft Boston
> Hi {{first_name}}, thanks for reaching out. Here's what happens next: (1) we review your photos, (2) we reply with what we see and a price range, (3) if it makes sense, a short visit confirms scope and locks your price in writing. No photos yet? Reply to this email with 3 and we'll get started. — The DeckCraft Boston team

**Email — property inquiry**
Subject: Your walkthrough request — DeckCraft Boston
> Hi {{first_name}}, thanks for the details on {{company_name}}. A project lead will call to confirm the property list and a walkthrough date. Book directly here: {{calendar_link}}. If you have a reserve study, prior inspection or property list, reply with it. It helps us scope accurately.

**Owner alert (property)**
> NEW PROPERTY LEAD: {{company_name}} · {{customer_type}} · {{Properties}} properties · {{Towns}} · score {{Lead Score}} · {{phone}}

## 7. Calendars
- **Estimate Visit** (residential): 45 min, buffer 30, service-area routing by town if possible.
- **Property Walkthrough**: 90 min, owner/project lead only. Embed URL in `NEXT_PUBLIC_GHL_CALENDAR_URL`.

## 8. Testing (do not mark live until all pass)
1. Submit a test lead on the website with `?utm_source=test&gclid=TEST123` and confirm the contact, all fields, tags and opportunity stage.
2. Confirm the SMS arrives only when consent is checked and the email always arrives.
3. Move the opportunity to Estimate Booked and confirm `/api/crm-webhook` returns 200 (GHL execution log) and Meta Events Manager shows `Schedule` (test code).
4. Reply STOP to the SMS and confirm DND is set and later workflows skip it.

## Phase 2: API v2 sync (supersedes the webhook as the primary path)
- **Order:** API v2 (`GHL_API_TOKEN` + `GHL_LOCATION_ID`), then the inbound webhook (`GHL_WEBHOOK_URL`), then LOG mode.
- **Contacts:** `POST /contacts/upsert`. GHL de-duplicates on email and phone, so retries and repeat forms update a single contact.
- **Opportunities:** `POST /opportunities/upsert` into "DeckCraft · Residential" or "DeckCraft · Property Programs". Stage ids come from `GHL_STAGE_IDS`.
- **Scoring:** tags `score:N` and `tier:hot|warm|nurture` (hot ≥ 70, warm ≥ 45), plus the `dc_lead_score` and `dc_lead_tier` custom fields. Weights live in `src/config/lead-scoring.ts`.
- **Follow-up:**
  - Sequences are applied as `wf:<key>` tags: speed_to_lead, hot_lead_alert, property_walkthrough, photo_reminder, long_nurture, no_response_recovery and newsletter_welcome.
  - Use those tags as workflow triggers, or map keys to workflow IDs in `GHL_WORKFLOW_IDS` for direct enrollment.
  - SMS steps run only when `sms_consent` is true.
- **Stage webhook** (`/api/crm-webhook`, `x-dc-secret`):
  - Send `{lead_id, stage, value?, contact_id?}`.
  - Writes `revenue_won` and `revenue_paid` back to the lead for attribution.
  - Tags `stage:<stage>` and `wf:<seq>`: visit_reminders, estimate_follow_up, review_request and lost_reengage.
- **Failed syncs** are retried by `/api/cron/retry-ghl`.
