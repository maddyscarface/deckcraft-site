# 05 — Google Search Ads and Local Services Ads

> **Validate before forecasting.** The sandbox could not query Keyword Planner. Before setting budgets, pull 12-month average monthly searches and top-of-page bid ranges for every keyword below. Use Keyword Planner, location = the 15 town pages plus Boston, inside the DeckCraft Google Ads account. Drop keywords with fewer than 10 searches a month unless they are high-intent and very specific. Record the results in the "Keyword validation" table at the bottom.

## Account settings
- Account owned by DeckCraft Boston and billed to DeckCraft's card. Freelancers get manager access only.
- **Location:** "Presence: people in or regularly in your targeted locations". Target the 15 town pages plus the Boston neighborhoods; exclude areas you don't serve.
- **Networks:** Search only. Turn off Display expansion and Search Partners at launch.
- **Schedule:** all hours. Apply a −30% bid adjustment overnight (10pm–6am) for call extensions if calls go unanswered.
- **Conversions** (see docs/08): Primary = `generate_lead` (website, enhanced conversions on) plus Calls from ads ≥60s. Secondary, then promote to primary once there are 30+ a month: `qualified_lead`, `appointment_booked`, `contract_signed`/`purchase` via offline import from GHL using GCLID.
- **Bidding:** Maximize Conversions while you have fewer than 30 conversions/month per campaign, then Target CPA. Once booked-estimate imports are steady, switch the primary goal to `appointment_booked` and bid toward a target cost per booked estimate.

## Campaigns, ad groups, keywords
Match types: **[exact]** and **"phrase"** only at launch. No broad match until conversion volume supports Smart Bidding.

| Campaign | Ad group | Keywords | Landing page |
|---|---|---|---|
| DC-Search-Deck-Repair | Deck repair | [deck repair], "deck repair near me", "deck repair boston", "deck repair contractor", [deck repair company] | /services/deck-repair |
| | Deck repair + town | "deck repair newton", "deck repair brookline", "deck repair cambridge", "deck repair wellesley", "deck repair lexington" (one per town page) | /{town} |
| | Rot / boards | "rotted deck boards", "replace deck boards", "deck board replacement", "soft deck boards" | /services/deck-repair |
| | Porch repair | "porch repair boston", "rear porch repair", "back porch repair", "triple decker porch repair" | /services/board-railing-stairs |
| DC-Search-Stain-Seal | Staining | "deck staining", "deck staining boston", "deck stain contractor", "deck staining near me" | /services/deck-staining-sealing |
| | Sealing / refinishing | "deck sealing", "deck refinishing", "deck restoration", "deck cleaning and sealing" | /services/deck-staining-sealing |
| | Fence staining | "fence staining", "fence stain contractor" | /fencing/residential |
| DC-Search-Rails-Stairs | Railings | "deck railing repair", "porch railing repair", "deck railing replacement" | /services/board-railing-stairs |
| | Stairs | "deck stair repair", "porch stairs repair", "deck steps repair" | /services/board-railing-stairs |
| DC-Search-New-Decks | New deck | "deck builder", "deck builders near me", "deck contractor boston", "new deck installation" | /services/new-decks |
| | Rebuild / composite | "deck replacement", "rebuild deck", "composite deck installation", "trex deck installer" (only if certified; otherwise "composite deck builder") | /services/new-decks |
| DC-Search-Fence-Res | Fence install | "fence installation", "fence company near me", "fence installers boston", "wood privacy fence" | /fencing/residential |
| | Fence repair | "fence repair", "fence repair near me", "fence post repair", "gate repair" | /fencing/residential |
| | Pool fence | "pool fence installation", "pool fence contractor" | /fencing/residential |
| DC-Search-Fence-Com | Commercial fence | "commercial fence contractor", "commercial fencing massachusetts", "dumpster enclosure contractor", "perimeter fencing contractor" | /fencing/commercial |
| DC-Search-Property | HOA / condo | "condo association deck repair", "hoa fence contractor", "condo balcony repair", "deck inspection condo association" | /hoa-condo |
| | Landlord / PM | "property management deck repair", "rental property porch repair", "landlord porch repair boston" | /landlords |
| | Commercial decks | "commercial deck repair", "restaurant patio deck repair" | /commercial |
| DC-Search-Brand | Brand | [deckcraft boston], [deckcraft], "deck craft boston" | / |

## Negative keywords (shared list "DC-Negatives")
DIY, how to, how do, youtube, video, jobs, job, hiring, careers, salary, apprentice, training, course, Home Depot, Lowe's, Menards, plans, blueprint, kit, kits, free, cheap, rental, rent, tool rental, pressure washer rental, stain colors, best stain, reviews of stain, Behr, Thompson's (product research), cost calculator (test first), paint, painting contractor (unless added), vinyl siding, roof, roofing, gutter, concrete, patio pavers, pergola kit, gazebo, dog fence invisible, electric fence, chain link supplies, wholesale, supplier, lumber, near Worcester (until coverage confirmed), Cape Cod, New Hampshire, Rhode Island.

Per-campaign negatives: add the *other* service terms to stop cross-matching (for example "fence" negative in Deck-Repair; "deck" negative in Fence campaigns), except in Brand.

## Responsive Search Ads (one per ad group; example for Deck Repair)
Headlines (≤30 chars):
1. Deck Repair in Greater Boston
2. Send 3 Photos, Get a Range
3. Free Photo Assessment
4. Repair What Failed
5. Keep What's Still Sound
6. Written Price Before We Start
7. Rotted Boards and Soft Spots
8. Railings and Stairs Fixed
9. Repair or Replace? Ask Us
10. Built for Boston Winters
11. Homeowners, HOAs, Landlords
12. DeckCraft Boston
13. Deck Repair {LOCATION(City)} (fallback "Deck Repair Near You")
14. Seal Before the Freeze (seasonal; swap by month)
15. One Contact, Photo Reports

Descriptions (≤90 chars):
1. Send 3 photos and we'll tell you if it's a repair, refinish or rebuild, with a price range.
2. Boards, framing, ledger, railings and stairs. Written scope and price before work starts.
3. Serving Newton, Brookline, Cambridge, Wellesley and more. Property programs available.
4. Honest repair-or-replace advice. If it isn't worth fixing, we'll say so.

Pin H1 or H12 to position 1 only for Brand. Don't pin otherwise, and keep Ad Strength at Good or above. Write parallel sets for each campaign by swapping the service nouns, and make the town ad groups use town-specific headlines.

## Assets
- **Sitelinks:** Free Photo Assessment (/free-assessment) · Repair or Replace? (/repair-or-replace) · Staining and Sealing · Fence Repair · Property Programs (/property-programs) · Service Areas.
- **Callouts:** Free photo assessment · Written price before work · Dig Safe before every dig · Permits handled where required · Photo reports for property clients · Property programs.
- **Structured snippets:** Services: Deck repair, Staining, Sealing, Railings, Stairs, New decks, Fencing.
- **Call asset:** a Google forwarding number once the business phone is live, with call conversion ≥60s.
- **Image assets:** real job photos only, 1.91:1 and 1:1.
- **Location asset:** link the Google Business Profile.
- **Lead form asset:** test in month 2 against the landing page.

## Search-term optimization procedure (weekly)
1. Search terms report, last 7 days, sorted by cost.
2. Add irrelevant terms as negatives at the right level (account list for universal junk, campaign level for cross-service).
3. Add converting terms as exact keywords in the right ad group.
4. Check impression share lost to budget and to rank. Shift budget to campaigns with the lowest **cost per booked estimate** (from GHL offline import), not the lowest CPL.
5. Check landing-page conversion rate by ad group. If one is under 5% after 100 clicks, A/B test the hero/CTA or the form length.
6. Monthly: review the device, location and hour reports. Consider bid adjustments only under Manual/Enhanced CPC; Smart Bidding handles these itself.

## Local Services Ads (LSA)
Google's LSA category list includes **Fencing services**, **Carpenter**, **General contractor** and **Handyman**. It has **no deck-specific category**. Plan:
1. Apply in the **Fencing services** category first. This is the clearest fit.
2. Check whether deck repair/building job types are available under **Carpenter** or **General contractor** for Massachusetts. Choose the category whose job types actually match the work, and don't list services DeckCraft doesn't perform.
3. Complete Google's screening as it applies to the category and region: business license/registration, insurance, background checks for owners and field workers as required, and reviews. Expect MA HIC registration and proof of general liability to be requested. Confirm the current requirements in the LSA onboarding flow.
4. Budget: start at the spec's off-season $200–$500/month and peak $500–$1,500/month planning range. LSA is pay-per-lead.
5. Lead handling: answer LSA calls live (ranking depends on responsiveness). Forward LSA leads into GHL via Zapier/Make or GHL's LSA integration if available. Dispute invalid leads weekly.
6. Reviews: LSA uses Google reviews. The GHL review request (docs/06) feeds this.

## Keyword validation (fill in before launch)
| Keyword | Avg monthly searches (Boston DMA + towns) | Top-of-page bid low–high | Keep? |
|---|---|---|---|
| deck repair boston | | | |
| deck staining boston | | | |
| fence installation boston | | | |
| … | | | |

Forecast cost per lead only after this table is filled in: `(expected CPC × clicks needed per lead)`, where clicks per lead = 1 / landing-page conversion rate (assume 6–10% until measured).
