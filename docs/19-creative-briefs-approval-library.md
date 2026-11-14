# 19 · Creative briefs and approval library (Phase 2 spec §5)

Status: working library. **Nothing in here is published automatically.** Every asset goes through the approval
checklist below and is posted by a person after the owner signs off.

## 1. Brand tokens

| Token | Hex | Use |
|---|---|---|
| Midnight navy | `#172637` | Primary surfaces, headers, hero panels, buttons on light |
| Cedar / copper | `#AD7047` | Accent rules, linework, icons, large display accents |
| Cedar (AA text fill) | `#9A5E37` | Buttons and filled chips with white text (white on #AD7047 is 4.05:1, below AA) |
| Cedar deep (AA small text) | `#8E5631` | Small copper text on warm white (5.3:1) |
| Warm white | `#F5F2EC` | Page background |
| Muted slate | `#617080` | Secondary text (4.5:1 on warm white) |
| Charcoal | `#24282D` | Body text |

- Type: editorial display serif-like headings (site `font-display`, slightly widened), clean sans body. Sentence case.
- Never use gradients, glow cards, emoji tiles, fake counters ("1,000+ decks built"), star ratings that aren't real, or stock "team" photos captioned as DeckCraft.
- Logo / wordmark: `src/components/ui/Wordmark.tsx`, `public/favicon.svg`.

## 2. Photo rights register

| Source | Allowed use | Label required |
|---|---|---|
| Owned DeckCraft job photos with signed customer permission | Gallery, ads, social, case studies, with town and service | None (may tag town) |
| Licensed stock (Pexels, see `src/lib/photos.ts` + /photo-credits) | Atmosphere, category illustration | "Illustrative" wherever it could be read as our work; never a town tag; never "our project" |
| AI or 3D illustration | Concept explainers only (e.g. joist cross-section) | "Illustration" visible on the asset |

Record for every owned photo: job ID, town, date, photographer, customer permission (date + method), any faces/addresses blurred.
Store the record alongside the file (e.g. `gallery/<job-id>/RIGHTS.md`) before it is added to `src/lib/gallery.ts`.

## 3. Claim verification

Before any asset ships, each claim must have a proof on file or be removed:

| Claim type | Proof needed | Current status |
|---|---|---|
| Licensed / insured / HIC number | Certificate + registration number | **Not verified** (site gates it behind `site.credentials.licensedAndInsuredVerified`) |
| Years in business, jobs completed | Owner records | Not supplied, do not use |
| Reviews / testimonials / star ratings | Link to the real review, reviewer consent for ads | None yet, do not use |
| Prices | **Phase 4: none in customer-facing creative, pages or notifications.** No per-sq-ft figures, bands, ranges or "from" prices. Internal planning numbers live server-side only (`src/config/estimate-internal.ts`, owner price book). Customers receive a written estimate only after owner approval. |
| Seasonal urgency ("book before…") | Real schedule constraint confirmed by owner | Avoid capacity claims like "slots are open" |
| Warranty | Written warranty terms | Not supplied, do not use |

## 4. Audience and UTM conventions

Audiences: `homeowner-repair`, `homeowner-newdeck`, `homeowner-stain`, `fence-res`, `hoa-condo`, `landlord-pm`, `commercial`.
Vendor pilots (DataMoon, AudienceLab) are alternative audience sources: tag them separately so they can be compared, and never upload customer lists without consent and the owner's approval.

```
utm_source   = google | meta | bing | openai | datamoon | audiencelab | email | gbp
utm_medium   = cpc | paid_social | display | email | organic_social | referral
utm_campaign = dc_<audience>_<offer>_<yyyymm>        e.g. dc_homeowner-newdeck_estimate_202703
utm_content  = <brief-id>_<variant>                    e.g. B5_upscale-deck_v2
utm_term     = keyword (search only)
```

Landing pages: new decks → `/new-deck-estimate` or `/project-calculator`; repair/stain → `/free-assessment`; HOA/commercial → `/request-walkthrough`.
The site captures UTMs, click IDs and first touch automatically (`src/lib/tracking.ts`).

## 5. Creative briefs

Each brief: objective, audience, landing page, format, shot list, copy direction, mandatory labels, proof needed.
Copy and scripts may be drafted with an AI assistant; visuals must be **owned work photography** or **clearly labelled illustration**.

### B1 · Rotten vs repaired joists
- Objective: show why structural repair matters; drive `/free-assessment`. Audience: homeowner-repair, hoa-condo.
- Shot list (owned job): probe test into a soft joist; rot at ledger/flashing; sistered or replaced joist with joist tape and proper hangers; same bay after.
- Accuracy: correct hanger type and fastener, ledger flashing visible, pressure-treated stamp legible where possible. If illustrated, label "Illustration", cross-section accurate.
- Copy direction: "It looked fine from above." / "We replace what failed and keep what's sound."

### B2 · Before/after sanding and sealing
- Objective: stain/seal demand in the spring/summer and fall windows. Audience: homeowner-stain.
- Shot list: same angle, same time of day, same lens; gray/UV-damaged boards → cleaned/brightened → sealed. Water-bead close-up.
- Rule: never pair two unrelated decks as before/after.

### B3 · Composite deck detail
- Objective: new-deck consideration. Audience: homeowner-newdeck. Landing: `/project-calculator`.
- Shot list: board grain and colour, hidden fasteners, picture-frame border, fascia, stair nosing. Brand of board named only if accurate.
- Pricing line: none (Phase 4). Use "Written estimate after we review your walkthrough" instead.

### B4 · New railing and stairs
- Objective: safety upgrades. Audience: homeowner-repair, landlord-pm.
- Shot list: wobbly post test (before), new post with proper blocking/hardware, graspable rail, consistent risers, lighting if installed.
- No code-compliance claims unless an inspection passed on that job.

### B5 · Upscale finished deck
- Objective: aspiration for `/new-deck-estimate`. Audience: homeowner-newdeck.
- Shot list: wide golden-hour hero on a Greater Boston home, lifestyle furniture, detail inserts. Owned job only; stock versions must say "Illustrative".

### B6 · Fence replacement
- Objective: residential + HOA fencing. Audience: fence-res, hoa-condo, commercial.
- Shot list: leaning/heaved posts, rot at grade, Dig Safe mark-out, new posts set, finished run and gate.

## 6. Approval checklist (every asset)

1. Visual is owned and has a rights record, or is visibly labelled Illustrative/Illustration.
2. Every claim passes §3; no fabricated testimonials, credentials, results or license numbers.
3. Brand tokens and typography per §1; no gradients/glow/emoji tiles/fake counters.
4. Correct UTM per §4; landing page live and matching the offer.
5. Phone number shown only if `NEXT_PUBLIC_PHONE` is set to the real line (never placeholders).
6. Owner sign-off recorded (name, date). A person publishes. **No automated publishing.**
