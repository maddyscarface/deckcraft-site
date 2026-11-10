# 04 — Meta (Facebook + Instagram) Campaigns and Creative

## Compliance first: run under the Housing Special Ad Category

Meta's Housing Special Ad Category covers ads for **housing repairs** as well as listings, mortgages and homeowners insurance. Run **every DeckCraft residential and property campaign** under Special Ad Category = Housing, country = United States. Within that category, expect:
- No age, gender or ZIP-code targeting. Location must use a radius around a point (15-mile minimum) or a city/region.
- No lookalike audiences. Detailed targeting is heavily restricted, and exclusion targeting is removed.
- Website custom audiences (retargeting) are generally still allowed. Confirm what Ads Manager offers when you set it up, because Meta changes these rules.

So the plan relies on **creative + broad geography + first-party retargeting**, not demographic targeting. The "audience hypothesis" on each ad below describes *who the creative is written for*. It does not mean targeting that audience.

Do not label a non-housing ad set "None" to get around the restrictions. Meta auto-detects housing content, and misclassifying can get the account restricted.

## Account structure

| Campaign | Objective | Ad sets | Budget share (peak) |
|---|---|---|---|
| DC-HSG-Prospecting-Residential | Leads (website conversion: `Lead`) | Boston 15-mi radius (Advantage+ placements). One ad set per creative theme: Repair, Stain/Seal, Safety, Fencing | 55% |
| DC-HSG-Retargeting | Leads | Site visitors 30d (excl. leads 180d), video viewers 50% 30d, assessment page visitors 30d | 20% |
| DC-HSG-Property-Programs | Leads (website `Lead` on walkthrough) | Broad Boston radius with property creative + 90-day visitors to /property-programs, /hoa-condo, /landlords, /commercial | 15% |
| DC-HSG-Seasonal | Leads | Seasonal creative set for the current window (see calendar) | 10% |

Optimization event: the `Lead` website event (Pixel + CAPI, deduplicated by `event_id`). Once you have 50+ qualified leads a month flowing back from GHL as `QualifiedLead`, test optimizing toward it.

**Landing page vs instant form:** begin with landing pages, which give higher intent and photos. Run one instant-form test in month 2, with a "send photos" step in the follow-up SMS. Keep whichever wins on **cost per booked estimate**, not CPL.

**UTMs on every ad:** `utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`

**Creative refresh:** every 2–4 weeks, or when frequency is above 3 and CTR is down 30% from week 1.

## Seasonal calendar

| Window | Theme | Weighting |
|---|---|---|
| Mar–May | "Winter Was Hard on Your Deck." | Repair, Safety, Spring booking |
| Jun–Sep | "Make Your Deck Ready for Summer." | Stain/Seal, Fencing |
| Oct–Nov | "Seal Before the Freeze." | Stain/Seal, Safety, Property inspections |
| Dec–Feb | "Reserve Your Spring Deck Project." | Spring booking, New decks, Property budget planning |

## Creative rules
- Real DeckCraft job photos and video first. Label illustrations or AI images as "Example". Never pair two unrelated photos as a before/after.
- No invented reviews, ratings, project counts, licenses, warranties or guarantees.
- Don't imply a tool or photo review is an inspection or safety certification.
- Capture footage in sets: **triple-decker rear porches, suburban backyard decks, deteriorating railings, weathered wood close-ups, fences, commercial properties, condo associations.**

---

## A. Deck Repair (5)

### R1 — "Soft spot"
- **Hook:** "That soft board isn't going to fix itself."
- **Primary:** Soft spots usually mean water has found its way in. Catch it at the board and it's a repair. Wait until it reaches the framing and it's a rebuild. Send us 3 photos and we'll tell you which one you're looking at, with a price range. Free, no pressure.
- **Headline:** Send 3 Photos. Get a Straight Answer.
- **Description:** Greater Boston deck repair
- **CTA:** Get Quote
- **Audience hypothesis:** Suburban homeowners with 15+ year-old wood decks.
- **Placement:** Feed + Reels (4:5 and 9:16)
- **Creative direction:** Close-up of a boot pressing a spongy board, then pull back to the full deck. Handheld, natural light.
- **15s Reel:** 0–3s boot presses soft board ("That give? That's water.") · 3–9s quick cuts: rotted board edge, joist check with flashlight · 9–15s text "Send 3 photos → free assessment" + phone screen showing the form.
- **30s Reel:** 0–4s hook as above · 4–12s tech explains: "Soft boards mean water's in the wood. The question is whether it's reached the joists." · 12–22s shows checking joists and ledger · 22–30s "Snap the deck, the worst spot, the stairs. We'll tell you if it's a repair or a rebuild." End card + CTA.
- **Landing page:** /services/deck-repair
- **Conversion event:** Lead (generate_lead, form_type=assessment)

### R2 — "Repair, not replace"
- **Hook:** "Most decks don't need replacing. They need the right repair."
- **Primary:** If the framing is sound, we replace what failed and keep what's good. You get a written price before we start. Send 3 photos for a free assessment.
- **Headline:** Repair What Failed. Keep What's Sound.
- **Description:** Written price before work starts
- **CTA:** Learn More
- **Audience hypothesis:** Homeowners who got a big replacement quote and are skeptical.
- **Placement:** Feed, Stories
- **Creative direction:** Split screen: crew pulling 4 bad boards versus the whole deck. Text overlay "Same deck. Different answer."
- **15s:** Bad boards out, new boards in, "Repair, not replace" overlay, CTA.
- **30s:** Talking head: "We get calls from people quoted $20k for a new deck. Sometimes that's right. Often the framing's fine." Cut to repair process, then the finished deck. CTA.
- **Landing page:** /services/deck-repair · **Event:** Lead

### R3 — Triple-decker rear porch
- **Hook:** "Three porches. One set of stairs everyone uses."
- **Primary:** Rear porches on Boston two- and three-families take more traffic and less care than any deck. We repair stairs, railings and boards on every level, with photos so you don't have to climb them yourself.
- **Headline:** Rear Porch Repair, Every Level
- **Description:** Owners and landlords welcome
- **CTA:** Get Quote
- **Audience hypothesis:** Owners of triple-deckers and two-families (Dorchester, Somerville, JP, Medford).
- **Placement:** Feed, Reels
- **Creative direction:** Drone or low-angle shot up the stacked porches. Then cracked treads and a loose baluster.
- **15s:** Look up the porch stack, "Every level. Every stair." Cuts of repairs. CTA "Send photos."
- **30s:** Walk the stairs from the ground floor up, pointing out issues on each level. "We scope all three, one price, one visit." CTA, plus a "Multiple buildings? Request a walkthrough" end card.
- **Landing page:** /services/board-railing-stairs (owners) · **Event:** Lead

### R4 — Ledger
- **Hook:** "The most important board on your deck is the one you can't see."
- **Primary:** The ledger ties your deck to the house. When water gets behind it, that's where serious problems start. We look there first on every repair. Send 3 photos to start.
- **Headline:** We Check Where It Matters
- **Description:** Free photo assessment
- **CTA:** Learn More
- **Audience hypothesis:** Detail-oriented homeowners and pre-sale sellers.
- **Placement:** Feed
- **Creative direction:** Flashlight under the deck at the ledger, with a simple diagram overlay.
- **15s:** Flashlight reveal, label "Ledger board", "We look here first." CTA.
- **30s:** Explainer with a diagram animation (illustrative), then a real inspection clip. CTA. Avoid saying "unsafe" or "code violation" as a blanket claim.
- **Landing page:** /repair-or-replace · **Event:** Lead (form_type=checker)

### R5 — Pre-listing
- **Hook:** "Selling in the spring? Buyers walk out on the deck."
- **Primary:** A refreshed deck and fence photograph better and can come up during inspection. Send 3 photos and we'll tell you what's worth doing before you list, and what isn't.
- **Headline:** Pre-Listing Deck Touch-Ups
- **Description:** Honest about what's worth it
- **CTA:** Get Quote
- **Audience hypothesis:** Homeowners preparing to sell in the inner suburbs.
- **Placement:** Feed, Stories
- **Creative direction:** Gray deck turning into a stained deck (real job). Staging furniture added.
- **15s / 30s:** Before → after reveal, then "What's worth fixing before you list?" with the CTA (30s adds a short tip list: boards, railings, stain).
- **Landing page:** /homeowners · **Event:** Lead

## B. Staining and Sealing (5)

### S1 — "Gray isn't old"
- **Hook:** "Gray isn't old. It's unprotected."
- **Primary:** Gray wood is wood breaking down at the surface. Clean, brighten, stain and seal, and most decks look new again in a couple of days. Send 3 photos for a free assessment and a price range.
- **Headline:** Bring Your Deck Back
- **Description:** Staining and sealing, Greater Boston
- **CTA:** Get Quote · **Audience:** Homeowners with weathered cedar or PT decks · **Placement:** Reels, Feed
- **Creative:** Hard-cut before/after of the same deck (real). Satisfying wash-and-stain sequence.
- **15s:** Pressure-wash stripe reveal, then stain brush, then final pan. Text "Gray → protected." CTA.
- **30s:** Process in 4 beats (clean, brighten, stain, seal) with captions, then "Send 3 photos." CTA.
- **Landing page:** /services/deck-staining-sealing · **Event:** Lead

### S2 — Water test
- **Hook:** "Pour a cup of water on your deck. Does it bead or soak in?"
- **Primary:** If it soaks in, your deck is unprotected going into winter. Sealing now keeps water out of the boards through freeze-thaw. Send 3 photos and we'll tell you what it needs.
- **Headline:** Take the 10-Second Water Test
- **Description:** Then send us 3 photos
- **CTA:** Learn More · **Audience:** DIY-curious homeowners · **Placement:** Reels
- **Creative:** POV cup pour on dry gray wood (soaks) versus a sealed board (beads).
- **15s:** Pour, soak, "Soaks in? Time to seal." CTA.
- **30s:** Both boards, explanation of freeze-thaw, CTA.
- **Landing page:** /blog/when-to-seal-deck-massachusetts → CTA to /services/deck-staining-sealing · **Event:** ViewContent → Lead

### S3 — Seal before the freeze (Oct–Nov)
- **Hook:** "Seal before the freeze."
- **Primary:** Water that soaks into unsealed boards this fall freezes, expands and splits them by spring. Fall sealing slots are limited by weather. Send 3 photos now.
- **Headline:** Fall Sealing Slots Are Open
- **Description:** Weather-dependent scheduling
- **CTA:** Get Quote · **Audience:** All homeowners in radius · **Placement:** Feed, Stories, Reels
- **Creative:** Leaves on a gray deck, then a frost overlay animation (labelled illustration), then a sealed deck.
- **15s:** Leaves, frost, "Don't let winter in." CTA.
- **30s:** Tech: "Every winter, water in the wood freezes and splits it. A sealer now saves boards in April." CTA.
- **Landing page:** /services/deck-staining-sealing · **Event:** Lead

### S4 — Summer ready (Jun–Sep)
- **Hook:** "Make your deck ready for summer."
- **Primary:** Most decks are cleaned, stained and sealed in 1–2 days, weather permitting. Send photos and get a range today.
- **Headline:** Summer-Ready in Days
- **Description:** Free photo assessment
- **CTA:** Get Quote · **Audience:** Families and entertainers · **Placement:** Feed, Reels
- **Creative:** Finished deck at golden hour with a family or grill (real client with permission, or staged team footage).
- **15s / 30s:** After shot first, then a rewind to before, then the process montage, then CTA. Confirm the "1–2 days" claim with the owner before running.
- **Landing page:** /services/deck-staining-sealing · **Event:** Lead

### S5 — Deck + fence match
- **Hook:** "Your deck and fence, matched in one visit."
- **Primary:** Stain your deck and fence together so they match, with one visit and one invoice. Send 3 photos of each.
- **Headline:** Deck + Fence, One Visit
- **Description:** Staining and sealing
- **CTA:** Get Quote · **Audience:** Homeowners with both · **Placement:** Feed carousel
- **Creative:** Carousel of 3 cards: deck before/after, fence before/after, both together.
- **15s / 30s:** Wide yard shot as the camera swings from deck to fence. CTA.
- **Landing page:** /fencing/residential · **Event:** Lead

## C. Deck Safety Assessment (4)
*(These offer a free photo assessment. Never call it an inspection or a certification.)*

### F1 — Four signs
- **Hook:** "4 signs your deck needs a closer look."
- **Primary:** Soft boards. Posts that move. Wobbly railings. Rot where the deck meets the house. If you see any of these, keep people off that area and send us photos. We'll tell you what we see.
- **Headline:** Check These 4 Things Today
- **Description:** Free photo assessment
- **CTA:** Learn More · **Audience:** Owners of older decks · **Placement:** Reels, carousel
- **Creative:** 4-card carousel with real close-ups of each sign.
- **15s:** Rapid 4-sign cut with numbers. CTA.
- **30s:** Tech walks the 4 signs on a real deck. Ends with "This isn't an inspection. It's how you know you need one." CTA.
- **Landing page:** /repair-or-replace · **Event:** Lead (checker)

### F2 — Railing wobble
- **Hook:** "If your railing moves when you lean on it, that's the sign."
- **Primary:** Railings and stairs are safety, not style. We re-secure or replace posts, balusters and treads properly, with permits where required. Send photos.
- **Headline:** Fix the Wobble
- **Description:** Railing and stair repair
- **CTA:** Get Quote · **Audience:** Homeowners and landlords · **Placement:** Reels
- **Creative:** A hand shaking a loose post (a real one, safely), then the repair, then the same shake test passing.
- **15s / 30s:** Shake → repair → shake test. CTA.
- **Landing page:** /services/board-railing-stairs · **Event:** Lead

### F3 — Repair-or-Replace Checker
- **Hook:** "Repair or replace? Find out in 60 seconds."
- **Primary:** Seven quick questions give you a preliminary read on your deck. Then send photos and we'll confirm. Free, informational, no obligation.
- **Headline:** Take the Deck Checker
- **Description:** Then confirm with photos
- **CTA:** Learn More · **Audience:** Researchers and comparison shoppers · **Placement:** Feed, Stories
- **Creative:** Screen recording of the checker on a phone, with the result card (illustrative).
- **15s / 30s:** Phone UI walkthrough. The 30s version adds the three possible results and the disclaimer.
- **Landing page:** /repair-or-replace · **Event:** Lead (checker), tool_complete

### F4 — Spring check (Mar–May)
- **Hook:** "Winter was hard on your deck."
- **Primary:** Freeze-thaw, snow load and ice melt all show up in spring. Book a spring check-in: send 3 photos and we'll tell you what winter did.
- **Headline:** Book a Spring Deck Check
- **Description:** Free photo assessment
- **CTA:** Book Now · **Audience:** All homeowners in radius · **Placement:** Feed, Reels
- **Creative:** Snow melting off boards, then spring close-ups of cracks and popped nails.
- **15s / 30s:** Melt, damage close-ups, CTA.
- **Landing page:** /free-assessment · **Event:** Lead

## D. Fencing (4)

### N1 — Leaning fence
- **Hook:** "Frost heave got your fence?"
- **Primary:** Leaning sections and lifted posts are classic New England fence damage. We repair single sections or replace runs, and call Dig Safe before every dig. Send 3 photos.
- **Headline:** Fence Repair, Greater Boston
- **Description:** Sections, posts and gates
- **CTA:** Get Quote · **Audience:** Homeowners with older wood fences · **Placement:** Feed, Reels
- **Creative:** Level on a leaning post, then reset, then plumb.
- **15s / 30s:** Level-bubble reveal. The 30s adds the Dig Safe flag and post-setting. CTA.
- **Landing page:** /fencing/residential · **Event:** Lead

### N2 — Privacy fence
- **Hook:** "Privacy that holds up to a Boston winter."
- **Primary:** Cedar and pressure-treated privacy fencing, plus vinyl and aluminum options, installed with permits where your town requires them. Send photos and rough measurements.
- **Headline:** New Privacy Fence
- **Description:** Free assessment
- **CTA:** Get Quote · **Audience:** New homeowners and families · **Placement:** Feed
- **Creative:** Timelapse of a new fence going up (real job).
- **15s / 30s:** Timelapse, finished yard, CTA.
- **Landing page:** /fencing/residential · **Event:** Lead

### N3 — Pool fence and gates
- **Hook:** "Is your pool gate self-closing?"
- **Primary:** Pool fencing and self-closing, self-latching gates, built to Massachusetts barrier requirements and confirmed with your town before work starts.
- **Headline:** Pool Fence and Gate Work
- **Description:** Residential and amenity pools
- **CTA:** Learn More · **Audience:** Pool owners, clubs, associations · **Placement:** Feed
- **Creative:** A gate swinging shut and latching on its own.
- **15s / 30s:** Gate test, then the repaired hardware. CTA. No claims of "code-certified".
- **Landing page:** /fencing/residential (residential) or /fencing/commercial (amenity) · **Event:** Lead

### N4 — Commercial enclosures
- **Hook:** "The dumpster enclosure is the first thing tenants see."
- **Primary:** Dumpster and utility enclosures, perimeter fencing and storm repairs for properties and businesses, scheduled around your hours. Request a walkthrough.
- **Headline:** Commercial Fencing
- **Description:** Walkthroughs for property managers
- **CTA:** Learn More · **Audience:** Property and facilities managers · **Placement:** Feed, Facebook right column
- **Creative:** Before/after enclosure at a real multifamily site.
- **15s / 30s:** Reveal, then the "one contact, photo reports" checklist. CTA.
- **Landing page:** /fencing/commercial · **Event:** Lead (walkthrough)

## E. HOA / Property Manager (4)

### P1 — Twenty decks, one schedule
- **Hook:** "Twenty decks. One schedule. One contact."
- **Primary:** Condo boards and property managers: we inspect every deck, balcony, stair and fence, rank what's urgent, and give you one written schedule with photo reports for every property.
- **Headline:** Request a Property Walkthrough
- **Description:** Associations · Landlords · Commercial
- **CTA:** Learn More · **Audience:** Board members, community association managers · **Placement:** Feed, Facebook
- **Creative:** Clean motion graphic showing a property list, priority labels, then a photo report PDF (sample, clearly marked).
- **15s / 30s:** Motion-graphic walkthrough of the board package. CTA.
- **Landing page:** /property-programs · **Event:** Lead (walkthrough)

### P2 — Board-ready
- **Hook:** "Give your board something it can actually vote on."
- **Primary:** Condition reports with photos, priority rankings, per-building pricing and phased options matched to your reserve plan. We'll present at a board meeting on request.
- **Headline:** Board-Ready Proposals
- **Description:** HOA and condo associations
- **CTA:** Learn More · **Audience:** Self-managed condo boards · **Placement:** Feed
- **Creative:** Sample report pages (template, clearly labelled "Sample").
- **15s / 30s:** Page-flip through the sample report. CTA.
- **Landing page:** /hoa-condo · **Event:** Lead (walkthrough)

### P3 — Landlord turnover
- **Hook:** "Tenant moving out in June? Fix the porch in between."
- **Primary:** Exterior deck, porch and fence repairs and staining scheduled between tenants on a committed timeline, with photos so you don't drive out.
- **Headline:** Turnover Exterior Repairs
- **Description:** Landlords and PMs
- **CTA:** Learn More · **Audience:** Small landlords (2–50 units) · **Placement:** Feed, Facebook
- **Creative:** Calendar graphic showing move-out, repair window and move-in, then a porch before/after.
- **15s / 30s:** Calendar animation, then the porch reveal. CTA.
- **Landing page:** /landlords · **Event:** Lead (walkthrough)

### P4 — Inspection planner
- **Hook:** "How many days to inspect every deck you manage?"
- **Primary:** Plug in your property count and get a preliminary inspection schedule in a minute. Then book a walkthrough to make it real.
- **Headline:** Plan Your Inspection Round
- **Description:** Free planning tool
- **CTA:** Learn More · **Audience:** Property managers, retargeting property-page visitors · **Placement:** Feed, Stories
- **Creative:** Phone screen of the planner, with the number ticking up and the result updating.
- **15s / 30s:** UI demo. CTA.
- **Landing page:** /portfolio-inspection-planner · **Event:** tool_complete → Lead

## F. Seasonal Spring Booking (3) — Dec to Feb

### W1 — Reserve spring
- **Hook:** "Spring calendars fill by March."
- **Primary:** Planning a new deck, rebuild or fence this spring? Design and permits take time. Reserve your spot now. Send photos and what you have in mind.
- **Headline:** Reserve Your Spring Project
- **Description:** New decks, rebuilds and fences
- **CTA:** Book Now · **Audience:** Planners, renovation intenders · **Placement:** Feed, Reels
- **Creative:** Winter yard covered in snow, then a rendered sketch (labelled "Concept"), then a finished spring deck (real job).
- **15s / 30s:** Snow, sketch, finished deck. The 30s adds a permits/design timeline graphic. CTA.
- **Landing page:** /services/new-decks · **Event:** Lead

### W2 — Board budget season
- **Hook:** "Budgeting for next season? Start with the decks."
- **Primary:** Boards and owners setting next year's budget: a winter walkthrough gives you priced, prioritized deck and fence work before spring bids get crowded.
- **Headline:** Winter Walkthroughs
- **Description:** For associations and landlords
- **CTA:** Learn More · **Audience:** HOA boards, PMs · **Placement:** Feed
- **Creative:** Clipboard walk on a snowy property, then the report.
- **15s / 30s:** Walk, report, CTA.
- **Landing page:** /request-walkthrough · **Event:** Lead (walkthrough)

### W3 — Fence before the thaw
- **Hook:** "Get on the list before the ground thaws."
- **Primary:** Fence installs start when the ground allows. Send photos and measurements now to hold an early spring install window.
- **Headline:** Early Spring Fence Installs
- **Description:** Residential and commercial
- **CTA:** Book Now · **Audience:** Homeowners planning fences · **Placement:** Feed, Stories
- **Creative:** Snowy yard with an outline overlay of the planned fence line.
- **15s / 30s:** Overlay animation, then a finished spring fence. CTA.
- **Landing page:** /fencing/residential · **Event:** Lead

## Weekly Meta optimization procedure
1. Pull cost per lead, cost per booked estimate (from GHL), CTR, frequency and hook rate (3s views / impressions) by ad.
2. Pause ads with a CPL more than 2× the account average after 1.5× the target CPL in spend and no booked estimates.
3. Move 20% of budget toward the ad set with the lowest **cost per booked estimate**.
4. Launch 2 new creatives per week in the best-performing theme. Retire anything over frequency 3 with declining CTR.
5. Check Events Manager: event match quality, dedup rate (browser vs server), and any diagnostics.
6. Log changes in the weekly report.
