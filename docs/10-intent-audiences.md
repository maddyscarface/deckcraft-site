# 10 — Intent-Based Audience Tests (DataMoon, AudienceLab, others)

> Vendor claims about "intent" data vary widely. Treat every provider as a **paid test with a kill switch**, not a lead source. Nothing here has been purchased or validated yet.

## Two separate lanes — never mix them
| | Consumer lane (homeowners) | Commercial lane (HOAs, PMs, commercial owners) |
|---|---|---|
| What you buy | **Audiences for ad activation** (Meta/Google custom audiences via a vendor's direct integration or hashed upload), not contact lists to cold-text | Business contact data (name, role, company, business email/phone) for B2B outreach |
| Allowed use | Paid ads only, inside each platform's rules. For Meta under the Housing SAC, custom-audience uploads may still be allowed but lookalikes are not; confirm in Ads Manager | Email outreach that complies with CAN-SPAM (identify sender, physical address, working opt-out). Phone outreach only with TCPA/DNC scrubbing, **no** autodialed/prerecorded calls or texts to cell phones without consent |
| Never | Import into GHL SMS/email sequences without the person's own opt-in on DeckCraft forms | Text business mobiles without consent; buy "opted-in" lists without proof of the consent language naming DeckCraft or a clear partner scope |

## Candidate signals to request from vendors
Deck repair research · fence installation intent · home exterior improvement · renovation planning · property maintenance procurement · HOA facility maintenance · multifamily capital improvement planning. Geography = the 15 towns plus Boston neighborhoods.

## Vendor due-diligence questions (score 1–5 each, require written answers)
1. **Source & consent:** where do signals come from (bidstream, co-op, publisher panels, search)? What consent/notice covers activation by an advertiser like DeckCraft? Share the consent text.
2. **Coverage:** estimated audience size for the 15 towns per signal, and how it's deduplicated.
3. **Freshness:** signal recency window (7/14/30 days). How often is it refreshed?
4. **Match rates:** expected match rate into Meta and Google (ask for a sample from a home-services client).
5. **Activation channels:** direct integrations versus CSV, and whether hashed PII leaves their system.
6. **Housing-policy fit:** confirm they won't build or send segments based on protected characteristics, and that segments are compatible with Meta's Housing SAC.
7. **Contract:** month-to-month, test pricing, data deletion on termination, and DeckCraft owns all outputs and performance data.
8. **Massachusetts / state privacy:** opt-out handling and sensitive-data exclusions.

## Test design (per vendor, 4 weeks)
- **Control:** the same creative and budget on broad geography (Housing SAC) without the vendor audience.
- **Test:** vendor audience as a custom audience (where allowed) or as a Google Customer Match / Display list.
- **Budget:** fixed, e.g. $750–$1,500 per arm per month. Pick a number you're willing to lose.
- **Success metric:** cost per **booked estimate** (GHL) ≤ 80% of control, with ≥10 booked estimates in the test arm. Secondary: CPL, match rate, frequency.
- **Kill rules:** match rate < 30%, or CPL > 1.5× control after 50% of the budget, or any compliance doubt.

## Importing usable leads into GoHighLevel
Only these can enter GHL:
1. People who submitted DeckCraft's own forms (already handled by the site).
2. Commercial contacts you have a lawful basis to email, imported into a **separate GHL pipeline/tag `src:b2b-list:{vendor}`** with email-only workflows that include a CAN-SPAM footer and one-click unsubscribe. **SMS off.** Calls are manual only, after a DNC scrub.
3. Vendor-provided "opted-in" consumer leads **only** if the vendor shows the consent screen naming DeckCraft (or a scope that clearly covers it), timestamp, IP and page URL per record. Store those fields on the contact. Otherwise do not import.

Import procedure: CSV → validate emails (bounce check) → DNC scrub phones → dedupe against existing contacts → import with source tags + consent fields → start the matching workflow → review the first 50 results by hand.

## First-party remarketing (start here, it's free)
Website visitors 30/90 days, assessment-page visitors, property-page visitors 90 days, video viewers, and GHL customer lists (as exclusions and for upsell, with the customer relationship as basis). These usually outperform purchased intent data for a local business.
