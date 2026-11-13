# DeckCraft Phase 3 — SEO / GEO / AEO inventory

Content date: 2026-11-13. Query groups are planning labels, not claimed search volumes.

## Indexing and canonicals
- Canonicals, schema, robots and the sitemap always use the intended production origin (`https://deckcraftbuild.com` unless `NEXT_PUBLIC_SITE_URL` is a non-Vercel custom domain).
- Staging and preview stay `noindex` (`X-Robots-Tag` plus robots metadata). `/admin`, `/api/*`, `/thank-you` and `/photo-credits` are noindex even after launch.
- Production is indexed only when the owner sets `NEXT_PUBLIC_INDEXABLE_SITE=true` after confirming the custom domain. The domain itself remains owner-to-confirm.
- Optional `llms.txt` is a public facts index, not a Google ranking signal. It never links private routes.

## Keyword-to-URL map (primary intents)
| Path | Primary query | Stage | H1 (summary) |
|---|---|---|---|
| `/` | deck builder Boston | commercial | Deck Building and Repairs in Greater Boston |
| `/services/new-decks` | new deck construction Boston | commercial | A new deck, designed and built for New England. |
| `/new-deck-estimate` | new deck estimate Boston | transactional | Request a new deck estimate |
| `/services/deck-repair` | deck repair Boston MA | commercial | Deck repair that fixes the cause, not just the board. |
| `/free-assessment` | deck photo assessment Boston | transactional | Send photos for a deck or fence assessment |
| `/services/deck-rebuild-resurfacing` | deck replacement Greater Boston | commercial | Keep the sound framing. Replace everything you can see. |
| `/services/board-railing-stairs` | deck railing repair | commercial | Railings and stairs are safety, not style. |
| `/services/deck-staining-sealing` | deck staining and sealing Boston | commercial | Gray isn't old. It's unprotected. |
| `/fencing` | fence installation Greater Boston | commercial | Fences built for New England winters. |
| `/hoa-condo` | condo deck inspection Boston | commercial | Association-focused page |
| `/{town}` | deck and fence repair in {town}, MA | commercial | One page per configured town (15), unique housing-stock copy, no invented job stories |

Buyer guides (informational): `/blog/deck-repair-vs-replace`, `/blog/composite-vs-pressure-treated-deck-boards`, `/blog/when-should-a-railing-be-inspected`, `/blog/deck-maintenance-before-winter`, `/blog/how-a-written-deck-estimate-works`. Existing cost and sealing guides are retained.

The machine-readable inventory lives in `src/lib/seo-inventory.ts` and drives sitemap lastmod dates.

## Schema
- `HomeAndConstructionBusiness` + `WebSite` on the homepage. `areaServed` is the configured town list only. No address, reviews or aggregate ratings until verified.
- `Service` + `BreadcrumbList` + `WebPage` on service and town pages. `FAQPage` only where FAQs are visible.
- `Article` + `BreadcrumbList` on editorial guides. Gallery images are not marked up as customer projects.

## Trust limits
- Permits and inspections vary by municipality. Photo reviews are not structural certifications.
- Calculator and per-square-foot figures are dated planning assumptions, labelled owner-to-confirm.
- Licensed photos are captioned “Illustrative photo” and never given a town.
- No invented licences, warranties, reviews or project history.
