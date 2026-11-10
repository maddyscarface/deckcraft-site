# 02 — Sitemap, Page Purpose and Where the Copy Lives

The final page copy lives in code (single source of truth). Edit it there.

| Route | Purpose / primary keyword | Conversion | Copy source |
|---|---|---|---|
| / | deck repair Boston; 16-section homepage per master brief §5 | Photo assessment, walkthrough | src/app/page.tsx |
| /homeowners | deck and fence repair Greater Boston | Photo assessment | src/app/homeowners/page.tsx |
| /services/deck-repair | deck repair Boston | Photo assessment (Funnel A) | src/lib/services.ts |
| /services/deck-staining-sealing | deck staining Boston | Photo assessment (Funnel B) | src/lib/services.ts |
| /services/board-railing-stairs | deck railing repair Boston | Photo assessment | src/lib/services.ts |
| /services/new-decks | deck builder Greater Boston | Photo assessment | src/lib/services.ts |
| /fencing | fence contractor Greater Boston | Route to res/com | src/app/fencing/page.tsx |
| /fencing/residential | fence installation Boston | Photo assessment (Funnel D) | src/lib/services.ts |
| /fencing/commercial | commercial fence contractor MA | Walkthrough (Funnel D/E) | src/lib/services.ts |
| /property-programs | deck and fence contractor property management | Walkthrough (Funnel E) | src/app/property-programs/page.tsx, src/lib/programs.ts |
| /hoa-condo | condo association deck repair Boston | Walkthrough | src/app/hoa-condo/page.tsx |
| /landlords | rental property deck repair Boston | Walkthrough | src/app/landlords/page.tsx |
| /commercial | commercial deck repair MA | Walkthrough | src/app/commercial/page.tsx |
| /free-assessment | free deck assessment Boston | 4-step photo form; `?service=`, `?seg=`, `?town=` presets | src/app/free-assessment/page.tsx |
| /request-walkthrough | property deck inspection Boston | 5-step walkthrough; `?properties=`, `?type=`, `?service=` prefill | src/app/request-walkthrough/page.tsx |
| /repair-or-replace | deck repair vs replace | Checker → photo form (Funnel C) | src/lib/checker.ts |
| /portfolio-inspection-planner | deck inspection condo association | Planner → walkthrough | src/components/tools/PortfolioPlanner.tsx |
| /gallery | deck before and after Boston | CTA | src/lib/gallery.ts (real jobs only) |
| /about, /service-areas, /blog, /blog/[slug], /contact | trust, local, SEO | CTA / short form | respective files, src/lib/blog.ts |
| /[town] ×15 | deck and fence repair {town} MA | Photo assessment with town preset | src/lib/towns.ts |
| /thank-you | post-conversion (noindex) | — | src/app/thank-you/page.tsx |
| /privacy, /terms (#sms, #accessibility) | legal (drafts) | — | |
| /admin, /admin?view=bdr | internal dashboards (auth, noindex) | — | src/app/admin/page.tsx |

## Differences from the PDF spec (deliberate, per master brief)
| Item | PDF spec | Built | Why |
|---|---|---|---|
| Town pages | newton…winchester, natick, worcester | Boston, Cambridge, Somerville, Brookline, Newton, Wellesley, Needham, Arlington, Belmont, Watertown, Waltham, Medford, Lexington, Quincy, Milton | Master brief list. Winchester, Natick, Worcester, Dedham, Framingham and the South Shore are held as candidates until crew coverage is confirmed |
| Hero subhead | "…get an honest price range." | "…start with a professional assessment." | Master brief wording |
| Primary CTA | "Send Us 3 Photos: Free Assessment" | "Send 3 Photos — Get a Free Assessment" | Master brief |
| Checker results | 4 labels, 5 questions | 3 labels from the master brief; 7 questions (adds age, railings, stairs); dimensions + photos captured in the follow-on form; structural flags always → inspection | Master brief §7 |
| Trust bar | "Licensed and Insured", "Serving 25+ towns" | Hidden until credentials are verified; count derived from real town pages | No unverified claims |
| Trust/credentials "Built to Code", "Walkthrough Guarantee" | Included | Omitted; process promises (written scope, permits where required) used instead | Master brief: no invented guarantees until the owner confirms wording |
| Muted text | #8A9A80 | #B7C4B0 for body on hunter | Contrast/accessibility |
| Stack | Lovable React + Supabase edge function | Next.js + server routes (same Supabase schema, GHL payload) | Master brief preference; Lovable path documented |
| /repair-or-replace, /portfolio-inspection-planner, /thank-you, /privacy, /terms | Not separate routes | Added | Master brief route list |
