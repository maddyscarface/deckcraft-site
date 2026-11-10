# 09 — Google Business Profile, Local SEO and AEO

## Google Business Profile
- **Create or claim** as "DeckCraft Boston" (exact legal/brand name, no keyword stuffing). Owner = DeckCraft's Google account. The agency is a Manager.
- **Type:** service-area business (hide the address unless customers visit). Service areas: the towns you actually serve. Google allows up to 20 areas; list the 15 page towns first.
- **Categories:** primary = "Deck builder" (closest available match; verify in the GBP picker). Secondary = "Fence contractor", "Carpenter", "Contractor"; add "Wood stain" type categories only if they exist and fit.
- **Services:** one entry per service page with a 1–2 sentence description taken from `src/lib/services.ts`.
- **Description (≤750 chars):** "DeckCraft Boston repairs, restores and builds decks and fences across Greater Boston. We handle deck repair, staining and sealing, railings and stairs, new decks and rebuilds, and residential and commercial fencing. Homeowners can start with a free photo assessment: send 3 photos and we'll tell you whether it's a repair, a refinish or a rebuild, with a price range. Condo associations, HOAs, landlords and property managers can request a walkthrough for inspections, phased repair programs and multi-property work, with written scopes and photo reports."
- **Hours, phone** (GHL tracking number for GBP, with the main number as an additional phone), **website** = `https://deckcraftboston.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`, **booking link** = /free-assessment.
- **Photos:** logo, cover, and 10+ real job photos a month (geo-relevant captions, no fake geotags). No stock.
- **Posts:** 2 a week (offer, before/after, seasonal tip, FAQ).
- **Q&A:** seed with real FAQs from the site, answered by the owner.
- **Reviews:** GHL workflow 9 asks every completed customer. Respond to every review within 48h. Never incentivize or gate reviews.

## Consistent NAP / citations
Apple Business Connect, Bing Places (import from GBP), Yelp, BBB, Angi, Houzz, Nextdoor, Thumbtack, Facebook. Identical name, phone and website everywhere. Keep a citation tracker sheet with logins owned by DeckCraft.

## Search Console and Bing
Verify the domain property (DNS TXT). Submit `/sitemap.xml`. Bing Webmaster: import from GSC. Monitor coverage, Core Web Vitals and queries monthly.

## Schema (implemented)
- Homepage: `HomeAndConstructionBusiness` (no `aggregateRating` until real first-party reviews exist; even then, Google doesn't show self-serving review stars for LocalBusiness, so leave it out).
- Service pages + town pages: `Service` with provider `@id`, plus `BreadcrumbList`.
- FAQ sections: `FAQPage` (helps AEO even where Google limits rich results).
- Blog: `Article` + a short-answer `FAQPage`.
- Validate with the Rich Results Test and Schema.org validator before launch.

## Internal linking rules
- Every service page → 3 related pages + the form. Every town page → 3–4 nearby towns + all 6 services.
- Every blog post → its money page + /free-assessment (or /request-walkthrough for property topics).
- Homepage → all hubs. Footer → all services and programs.

## Local case-study template (one per real job; ≈300–500 words, with owner permission)
Title: "{Service} in {Town}: {short outcome}" → Situation (what the owner saw, age/material) → What we found (photos) → What we did (scope, days) → Result (before/after slider) → Cost range bracket (optional, with permission) → CTA. Tag it to the town page's gallery filter.

## AEO approach
Each answer page leads with a **40–60 word direct answer** (see `answer` in `src/lib/blog.ts`), then detail. Use question-form H2s, specific Greater Boston ranges, dates and conditions, and no unsupported code/safety claims. Always say "confirm with your local building department" on permits/pool rules.

## 20 SEO / AEO topics
| # | Title | Target | Links to | Status |
|---|---|---|---|---|
| 1 | How Much Does Deck Repair Cost in Boston? | deck repair cost boston | /services/deck-repair | **Published (draft for owner review)** |
| 2 | Repair or Replace? How to Tell What Your Deck Actually Needs | deck repair vs replace | /repair-or-replace | **Published (draft)** |
| 3 | When Should You Seal a Deck in Massachusetts? | when to seal deck massachusetts | /services/deck-staining-sealing | **Published (draft)** |
| 4 | Does an Older Deck Need a Structural Inspection? | older deck inspection | /repair-or-replace | Planned |
| 5 | Who Repairs Triple-Decker Porches in Boston? | triple decker porch repair boston | /landlords | Planned |
| 6 | What Should a Condo Board Budget for Deck Repairs? | condo association deck repair budget | /hoa-condo | Planned |
| 7 | What New England Winters Do to Your Deck | winter deck damage boston | /services/deck-repair | Planned |
| 8 | Fence Permits in Greater Boston: What Homeowners Should Know | fence permit massachusetts | /fencing/residential | Planned (owner review) |
| 9 | Wood vs Vinyl vs Aluminum Fencing for New England | best fence material new england | /fencing/residential | Planned |
| 10 | Pool Fence Requirements in Massachusetts: A Plain-English Guide | pool fence requirements massachusetts | /fencing/residential | Planned (owner + local review) |
| 11 | Condo Board Guide: Annual Deck and Balcony Inspections | condo association deck inspection | /hoa-condo | Planned |
| 12 | Landlord Checklist: Rear Porch and Deck Safety for Boston Rentals | rental porch safety boston | /landlords | Planned |
| 13 | 4 Signs Your Deck Isn't Safe This Winter | is my deck safe | /repair-or-replace | Planned |
| 14 | Newton Homeowners: Pre-Listing Deck and Fence Checklist | deck repair before selling newton | /newton | Planned |
| 15 | Composite vs Wood Decks: The Real Cost in Boston | composite vs wood deck boston | /services/new-decks | Planned |
| 16 | How Long Does Deck Stain Last in New England? | how long does deck stain last | /services/deck-staining-sealing | Planned |
| 17 | Transparent, Semi or Solid Stain: Which Is Right for Your Deck? | best deck stain type | /services/deck-staining-sealing | Planned |
| 18 | Frost Heave and Your Fence: Why Posts Lean | fence post frost heave | /fencing/residential | Planned |
| 19 | Dumpster Enclosures for Multifamily Properties: Options and Costs | dumpster enclosure fence | /fencing/commercial | Planned |
| 20 | Ledger Boards Explained: Where Deck Failures Start | deck ledger board | /services/deck-repair | Planned |

## 90-day publishing calendar (2 posts/week weeks 1–6, then 1/week + case studies)
| Week | Publish | GBP posts | Other |
|---|---|---|---|
| 1 | #1, #2, #3 (launch) | Seal-before-freeze offer; FAQ | Submit sitemap; citations batch 1 |
| 2 | #13, #7 | Before/after; water test tip | Citations batch 2 |
| 3 | #6, #11 | Property programs | Outreach to CAI New England / MassLandlords for resources listing |
| 4 | #5, #12 | Porch repair | First real case study |
| 5 | #4, #20 | Ledger tip; spring booking teaser | GSC review: queries to expand |
| 6 | #19, #18 | Commercial fencing | Case study 2 |
| 7 | #15 | Winter design-and-permit | Refresh town pages with first local jobs |
| 8 | #9 | Fence materials | |
| 9 | #14 | Pre-listing | Local link: realtor partner page |
| 10 | #16 | Stain longevity | Case study 3 |
| 11 | #17 | Stain types | |
| 12 | #8, #10 (after owner + local review) | Spring safety check | 90-day SEO report: rankings, GBP actions, leads by landing page |
