# 12 — Dashboards and KPI System

## Built now (`/admin`, basic auth)
- **Owner view:** leads (30d), photo submission rate, property leads, GHL sync failures, all-time leads; breakdowns by funnel, segment, town and source; integration status (keys present ≠ tested).
- **BDR view (`/admin?view=bdr`):** new leads sorted by `lead_score` with segment, funnel, town, phone, photo count, timeline and GHL sync status.

## Data needed for the full system
| Source | How it arrives | Table |
|---|---|---|
| Website leads | Live | `leads` |
| Ad spend (Google Ads, Meta, LSA) | Daily: Google Ads script / Meta API / manual CSV → upsert | `ad_spend_daily` |
| Opportunities, stages, values | GHL webhook (workflow 13) or nightly GHL API pull | `jobs` (link via `lead_id` / `ghl_opportunity_id`) |
| Costs (materials, labor, subs) | Ops portal entry / QuickBooks export | `jobs` internal cost columns |
| Payments | Stripe webhook or manual | `invoices` |

## KPI definitions (view `v_kpi_channel_month` computes most of these)
| KPI | Formula | Target to set after 60 days |
|---|---|---|
| Ad spend by channel | Σ spend | — |
| Cost per lead | spend ÷ leads (excluding newsletter) | |
| Cost per qualified lead | spend ÷ leads reaching Qualified | |
| Cost per booked estimate | spend ÷ estimates/walkthroughs booked | **primary optimization KPI** |
| Estimate show rate | showed ÷ booked | ≥ 80% |
| Estimate → contract | won ÷ estimates held | |
| Customer acquisition cost | spend ÷ won jobs | |
| Average contract value | revenue ÷ won jobs | |
| Gross margin | (contract − materials − labor − subs) ÷ contract | owner only |
| Revenue by service / by town | Σ contract_value grouped | |
| Commercial pipeline | Σ value of open Property Accounts opps by stage | |
| Repeat clients | clients with ≥2 jobs ÷ clients | |
| Seasonal campaign results | the above filtered by `utm_campaign` season tag | |

## Owner dashboard layout (next build step)
Row 1: Spend · Leads · Cost/booked estimate · Won jobs · Revenue · Gross margin % (month vs prior). Row 2: channel table from `v_kpi_channel_month`. Row 3: revenue by service (bar), revenue by town (bar), commercial pipeline by stage. Row 4: seasonal campaign comparison. Margin is visible to the owner role only.

## BDR dashboard
Today's call list (score-sorted, SLA timer since lead), photo-request queue, estimates booked this week, no-shows to rebook, proposals awaiting follow-up (day 2/5/10).

## Weekly report (Mondays by noon ET, first 90 days)
Spend, leads, booked assessments and walkthroughs, won jobs, cost per booked assessment by channel, top search terms added/negated, creative winners/losers, GBP actions, new reviews, rankings snapshot (monthly), next week's changes.
