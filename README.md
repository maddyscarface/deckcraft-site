# DeckCraft Boston — Acquisition and Conversion Platform

A Next.js 15 + TypeScript + Tailwind site for deckcraftboston.com, built from the 54-page *Lovable Landing Page Build Spec* (Oct 22, 2026) and the master build brief. It includes the lead engine, CRM handoff, tracking and the full marketing operating docs.


## Preview and hosting package

- **Staging / review:** https://deckcraft-staging.vercel.app (noindex; production is unchanged at https://deckcraft-site.vercel.app)
- **Run locally:** `npm ci --include=dev && cp .env.example .env.local && npm run dev`
- **Quality check:** `npm run typecheck && npm test && npm run build`
- **Host this build:** see [HOSTING.md](HOSTING.md) for Vercel upload, Netlify, a generic Node/pm2 VPS, and cPanel. A static HTML export is not supported — the site has API routes.

## What's built
- **Website:** 24 core routes, 15 unique town pages, 3 AEO launch posts, a 16-section homepage, 6 service pages, 4 property-program pages, gallery, about, contact, legal drafts, sitemap/robots/schema.
- **Five funnels** with distinct pages, forms, tags and pipelines (docs/03).
- **Lead engine:** 4-step Photo Assessment, 5-step Property Walkthrough, condensed form, newsletter. Server API with zod validation, honeypot, fill-time check, rate limit, `event_id` idempotency. Supabase (private storage, signed URLs) with a dev JSON fallback. GHL inbound webhook with the full field/tag/pipeline map. Retry cron.
- **Tools:** Repair-or-Replace Checker (7 questions → 3 informational results, structural flags always → inspection) and Portfolio Inspection Planner (→ prefilled walkthrough).
- **Tracking:** Consent Mode v2 (+ GPC), GTM, Meta Pixel, Meta CAPI (hashed, deduplicated by event_id), 90-day first/last-touch attribution (UTMs, gclid/gbraid/wbraid/fbclid, fbc/fbp), the event set from master brief §13, the enhanced-conversions `user_data` push, and the GHL stage webhook → CAPI + GA4 MP for qualified/booked/won/paid.
- **Internal:** /admin owner and BDR dashboards (basic auth), Supabase schema for the ops portal (jobs, properties, inspections, change orders, invoices, spend) with role-based RLS and a KPI view.
- **Docs 01–15:** brand, sitemap, funnels, 25 Meta ads with 15s/30s scripts, Google Search + LSA, GHL, sales scripts + proposal workflow, tracking + verification checklist, SEO/AEO + GBP + 20 topics + 90-day calendar, intent audiences, deployment, KPIs, ops portal, budget + 30/60/90, launch checklist.

## Verified in the sandbox
`tsc` clean · 15 unit tests pass · production build OK (52 pages) · Playwright E2E, 6 scenarios: homeowner assessment with photos → /thank-you with exactly one `generate_lead`, the GHL payload carries the same event_id + gclid + UTM + landing page + photos, no duplicate on reload; idempotent replay; planner → walkthrough prefill → commercial pipeline; checker result + disclaimer; 422/honeypot/spoofed-upload/CRM-webhook-auth; screenshots.

## Not connected or verified (no credentials in the sandbox)
Supabase, GoHighLevel, Meta Pixel/CAPI, GA4, GTM, Google Ads, LSA, call tracking, GHL calendar, Resend, Stripe, domain, Vercel deploy. **None of these are live.** Follow docs/08's checklist before marking any as live.

## Owner launch gates
1. Phone number, hours and a response-time SLA you can keep (`.env` / `src/config/site.ts`).
2. Credentials: MA HIC registration, CSL, insurance. Until supplied, "Licensed and Insured" stays hidden.
3. Confirm job durations, fence pricing, inspections/day, COI turnaround and storm response (every `[OWNER TO CONFIRM]`).
4. Real before/after photos with written permission; team photos.
5. Review the permit, Dig Safe, pool-fence and railing statements and the 3 blog posts; legal review of Privacy/Terms/SMS.
6. Confirm crew coverage for all 15 towns (and whether to add Dedham/Natick/Framingham/South Shore).
7. Run Meta under the Housing Special Ad Category; validate keyword volumes before setting Google budgets.

## Run
See docs/11-deployment.md. Quick start: `npm i && ALLOW_LOCAL_STORE=1 npm run dev`.
