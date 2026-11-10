# 13 — Operations Portal and Property Programs Back Office

**Status:** the data model and access rules are built (`supabase/schema.sql`). The portal screens are specified here and are the next build phase. They are **not built yet**.

## Entities
clients → properties → inspections (findings JSON with priority + photos) → jobs → job_materials, job_photos (before/progress/after, `publish_permission`), change_orders, invoices. `ad_spend_daily` feeds KPIs.

## Screens
| Screen | Who | Contents |
|---|---|---|
| Jobs list | owner, pm | Filter by status/service/town/assignee; columns: client, property, service, status, start, assignee, value |
| Estimate appointments | owner, bdr, pm | Calendar synced from GHL; prep checklist; uploaded customer photos inline |
| Job detail | owner, pm (subs see the restricted view) | Written scope, materials list, assigned tech/sub, photo library (before/after), change orders (create → price → send for client approval → approved), invoices and payment status |
| Client approvals | client (magic link) | Proposal/change-order view with approve button; **no internal costs** |
| Profitability | owner only | Contract vs actual material/labor/sub cost per job and per service/month |
| Portfolio dashboard | owner, pm; client read-only link | Property list, inspection schedule, findings by priority, scope per address, progress photos, resident access notes |
| Board-ready proposal generator | owner, pm | Pulls inspection findings → per-property pricing → phasing options → PDF (template in docs/07) |
| Resident access coordination | pm | Per-property notice templates, work dates, access contact |

## Rules
- Internal margins and cost columns never render in client or subcontractor views. Subs read `jobs_for_subs` only.
- Every job requires a written scope before status can move to `scheduled`.
- Change orders must be approved before the work is done.
- `job_photos.publish_permission` must be true before any photo is used on the website or in ads.

## Suggested build order
1. Supabase Auth + roles. 2. Jobs list/detail with photos. 3. Change orders + client approval links. 4. Invoices (Stripe). 5. Portfolio dashboard + inspection findings. 6. Proposal PDF generator. 7. Profitability.
