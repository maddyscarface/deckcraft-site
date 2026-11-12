# 03 — The Five Acquisition Funnels

Each funnel has its own entry ads, landing page, qualification questions, CRM tags/pipeline and follow-up. The website assigns `funnel` automatically (`src/lib/routing.ts`, unit-tested) and passes it to GHL.

| | A — Deck Repair | B — Staining and Sealing | C — Repair or Replace | D — Fencing (Res + Com) | E — Property Programs |
|---|---|---|---|---|---|
| **Entry** | Google "deck repair" ad groups; Meta R1–R5, F2, F4 | Google Stain/Seal; Meta S1–S5 (seasonal weighting) | Meta F1, F3, R4; blog posts; organic AEO | Google Fence-Res / Fence-Com; Meta N1–N4; LSA Fencing | Google Property; Meta P1–P4, W2; LinkedIn; CAI/MassLandlords; direct outreach |
| **Landing page** | /services/deck-repair, /services/board-railing-stairs, town pages | /services/deck-staining-sealing | /repair-or-replace | /fencing/residential, /fencing/commercial | /property-programs, /hoa-condo, /landlords, /commercial, /portfolio-inspection-planner |
| **Form** | 4-step Photo Assessment (service preset) | Same, with staining preset; size field = sq ft | 7-question checker → Photo Assessment with result attached | Residential: Photo Assessment (fence preset); Commercial: Walkthrough | 5-step Walkthrough (type/count prefilled from planner) |
| **Qualifying fields** | town, services, material, size, timeline, photos | size (sq ft), material, last stained (in message), timeline | deck age, soft boards, rot at framing, posts, railings, stairs, surface, + dimensions & photos | length (LF), height/material (message/size), property type, photos | company, role, customer type, # properties/units/structures, fence LF, towns, needs, timeline, board date, approval process, frequency, files |
| **Tags** | funnel:A_deck_repair, svc:deck_repair… | funnel:B_staining, svc:staining | funnel:C_repair_or_replace, checker:{result} | funnel:D_fencing, svc:new_fence / fence_repair | funnel:E_property_programs, seg:{hoa_condo/landlord_pm/commercial} |
| **Pipeline** | Residential | Residential | Residential (Commercial if seg ≠ homeowner) | Residential / Property Accounts | Property Accounts |
| **Sales motion** | Photo review → range within SLA → 45-min estimate visit → written proposal | Photo review → range (often quotable from photos + sq ft) → short visit → book weather window | Review answers + photos → if "inspection recommended", prioritize visit and say so plainly | Photos + LF → range → site measure (Dig Safe + permit check) → proposal | Call within business hours → walkthrough → written findings + per-property pricing → board/owner approval → contract → schedule |
| **Follow-up** | Workflows 1, 2, 4–9 | + Seasonal maintenance (10) | Same as A, with checker result in the script | Same as A; property fencing uses E | Owner alert, day 2 / day 5, board-date aligned follow-up, renewal (11) |
| **Primary KPI** | cost per booked estimate | booked jobs per week in season | checker completion → lead rate | cost per booked measure | walkthroughs booked; proposal → contract rate |

## Funnel-specific landing copy (in code)
- A: `src/lib/services.ts` → `services/deck-repair`, `services/board-railing-stairs`
- B: `services/deck-staining-sealing` + seasonal announcement bar (`src/lib/seasonal.ts`)
- C: `src/app/repair-or-replace/page.tsx`, `src/lib/checker.ts`
- D: `fencing/residential`, `fencing/commercial`, `src/app/fencing/page.tsx`
- E: `src/app/{property-programs,hoa-condo,landlords,commercial,portfolio-inspection-planner,request-walkthrough}`

## Checker result handling (Funnel C)
| Result | What sales says | Priority |
|---|---|---|
| Potential Repair Candidate | "From your answers and photos this looks like a restore/repair. Here's a range." | Normal |
| Professional Inspection Recommended | "You mentioned [rot at framing / moving posts / loose railings]. Please keep people off that area until we look at it in person. Can we come by [date]?" | High: call same day |
| Replacement May Be Worth Evaluating | "We'll price repair and rebuild side by side so you can compare." | Normal; offer both |

Never tell a customer their deck is "safe" or "certified" based on the tool or photos.

**Phase 2:** new-deck builds (new_deck without repair work, a "New build" answer, or the /new-deck-estimate page) are tagged `funnel:F_new_deck`. `A_deck_repair` stays valid for repairs and for leads stored before the change.
