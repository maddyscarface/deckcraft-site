# 15 — Launch Checklist

Legend: ✅ done and verified in sandbox · ⬜ owner/agency action · 🔒 blocked on owner info

## Website
- ✅ All required routes, 15 unique town pages, 3 launch posts (drafts), tools, forms
- ✅ Typecheck, unit tests (15), production build, browser E2E (6 scenarios) pass
- ✅ No mentions of sister brands or franchises; no invented reviews, ratings, counts, licenses or guarantees
- ✅ sitemap.xml, robots.txt, canonical, OG/Twitter, JSON-LD (no aggregateRating)
- ⬜ Mobile check at 375px on real devices (sandbox screenshots look right at 390px)
- ⬜ Lighthouse on production: Performance 85+, SEO 95+, Accessibility 90+
- 🔒 Replace every `[OWNER TO CONFIRM]`: phone, hours, response-time SLA, job durations, fence pricing, inspections/day, COI turnaround, storm response time
- 🔒 Credentials: HIC registration, CSL, insurance carrier. Only then set `licensedAndInsuredVerified = true` (this turns on "Licensed and Insured" in the trust bar)
- 🔒 Real before/after photos with written permission (target 12 pairs), founder/team photos
- 🔒 Owner review of the permit, Dig Safe, pool-fence and railing statements; legal review of Privacy and Terms/SMS terms
- ⬜ og.png (1200×630) with the wordmark in /public

## Accounts (all owned by DeckCraft)
- ⬜ Domain + DNS + SSL · Vercel · Supabase (schema run) · GHL sub-account · A2P 10DLC approved
- ⬜ GBP verified · GSC + Bing · Google Ads · LSA application · Meta Business Manager + ad account + Pixel · GA4 · GTM

## Integrations (mark live only after docs/08 checklist passes)
- ⬜ Lead → Supabase → GHL with all fields/tags/stage
- ⬜ SMS only with consent; STOP works
- ⬜ Property leads → Property Accounts + owner alert
- ⬜ Pixel Lead + CAPI Lead deduplicated
- ⬜ GA4 generate_lead / walkthrough_request as key events
- ⬜ Google Ads Lead conversion + enhanced conversions + offline import
- ⬜ GHL stage webhook → /api/crm-webhook 200, Schedule/Purchase visible in Meta
- ⬜ Retry cron running; failure alert email
- ⬜ Call tracking numbers per source

## Ads
- ⬜ Keyword validation table filled (docs/05) → budgets set
- ⬜ Meta campaigns created under the Housing Special Ad Category
- ⬜ Real creative shot for each theme; illustrations labelled
