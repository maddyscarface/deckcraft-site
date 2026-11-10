# 11 — Deployment

## Stack
Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · self-hosted Fraunces + Inter · Supabase (Postgres + private Storage) · GoHighLevel (CRM via inbound webhook) · GTM/GA4/Google Ads · Meta Pixel + CAPI · optional Resend · Vercel (recommended). Stripe is **not wired in** yet; add it later as Stripe Invoices referenced from `invoices.stripe_invoice_id`.

All accounts (domain registrar, Vercel, Supabase, GHL, Google, Meta, Resend, Stripe) are created **in DeckCraft Boston's name**. Contractors get member access only.

## Steps
1. **Supabase:** create a project (region us-east) and run `supabase/schema.sql`. Confirm the two private buckets exist. Copy the URL + service role key.
2. **Vercel:** import the repo, Framework = Next.js. Add every variable from `.env.example` (Production + Preview). Don't put the service role key in any `NEXT_PUBLIC_` variable.
3. **Domain:** add `deckcraftboston.com` + `www` in Vercel, set the DNS records at the registrar, redirect www → apex.
4. **Cron:** `vercel.json` (included) runs `/api/cron/retry-ghl` every 15 minutes. Set `CRON_SECRET`. Vercel sends it as a Bearer token.
5. **GHL:** build the sub-account per docs/06, paste the inbound webhook URL into `GHL_WEBHOOK_URL`, and set `GHL_WEBHOOK_SECRET` in both places.
6. **Tracking:** GTM container per docs/08; the Pixel ID and CAPI token from Events Manager; the GA4 API secret.
7. **Admin:** set `ADMIN_PASSWORD`, then visit `/admin` and `/admin?view=bdr`. Before giving staff access, replace basic auth with Supabase Auth + roles (owner, bdr, pm, sub). RLS policies in the schema already key off `app_metadata.role`.
8. Run the docs/08 verification checklist and the docs/15 launch checklist.

## Lovable path
If you prefer Lovable: the spec's Part 20 prompts still apply. Point Lovable at this repo's `src/lib/*` (copy, towns, services, routing, checker, schema) so the copy and logic stay identical. Implement `/api/leads` as a Supabase Edge Function using `src/lib/server/lead-service.ts` as the reference.

## Local development
```
npm install
cp .env.example .env.local   # leave integrations blank to use the local JSON store
ALLOW_LOCAL_STORE=1 npm run dev
npm test                     # unit tests
npm run build && ALLOW_LOCAL_STORE=1 GHL_WEBHOOK_URL=http://127.0.0.1:4555/hook npx next start -p 3100 &
node tests/e2e.mjs           # browser end-to-end against a mock GHL
```
Without Supabase, leads and uploads go to `.data/` (dev only). Production refuses to start the fallback unless `ALLOW_LOCAL_STORE` is set. Don't set it in production.

## Security notes
- Uploads: magic-byte sniffing (JPEG/PNG/WebP/HEIC, plus PDF for property files), 20MB cap, random keys, private buckets, 14-day signed URLs.
- Lead API: zod validation, honeypot, minimum fill time, per-IP rate limit (in-memory; on Vercel use Upstash Ratelimit or a Supabase table for a shared limit), idempotency on `event_id`.
- CRM webhook: shared secret with a timing-safe compare.
- Headers: nosniff, frame-options, referrer-policy, permissions-policy. Add a CSP once the GTM tag list is final.
- The retry job re-sends stored rows; photo links in retries are storage paths, not signed URLs. If retries are common, extend it to call `ghlPayload()` for fresh signed links.
