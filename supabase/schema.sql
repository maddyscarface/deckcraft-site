-- DeckCraft Boston — Supabase schema (run in SQL editor). All tables RLS-enabled; the site writes with the
-- service role from server routes only. Staff access goes through Supabase Auth with role claims.

create extension if not exists pgcrypto;

-- ============ LEADS (website intake) ============
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_id text not null unique,                 -- idempotency + Meta dedup key
  form_type text not null,                       -- assessment | walkthrough | short | newsletter | checker | planner
  first_name text, last_name text,
  email text not null, phone text,
  sms_consent boolean not null default false, sms_consent_at timestamptz, sms_consent_ip text,
  consent_marketing boolean,
  customer_type text,                            -- homeowner | hoa_condo | landlord_pm | commercial
  company_name text, role text,
  town text, towns text[],
  services text[], material text, size_estimate text,
  property_count int, unit_count int, structure_count int, fence_linear_ft int,
  timeline text, board_meeting_date date, budget_process text, maintenance_frequency text,
  message text, photo_urls text[], file_urls text[],
  checker_result text, checker_answers jsonb,
  source_page text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  gclid text, gbraid text, wbraid text, fbclid text, fbc text, fbp text,
  landing_page text, referrer text, first_touch_at text,
  funnel text, pipeline text, tags text[], lead_score int,
  ghl_sync_status text not null default 'pending', ghl_attempts int not null default 0, ghl_last_error text,
  ghl_contact_id text, ghl_opportunity_id text,
  status text not null default 'new'
);
create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_sync_idx on leads (ghl_sync_status) where ghl_sync_status = 'failed';
alter table leads enable row level security;

-- Private storage buckets (no public read). GHL users get 14-day signed URLs.
insert into storage.buckets (id, name, public) values ('assessment-photos','assessment-photos', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('property-files','property-files', false) on conflict do nothing;

-- ============ OPERATIONS PORTAL ============
create table if not exists clients (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  kind text not null,                            -- homeowner | hoa_condo | landlord_pm | commercial
  name text not null, primary_contact text, email text, phone text,
  ghl_contact_id text, billing_terms text, coi_on_file boolean default false, w9_on_file boolean default false,
  lead_id uuid references leads(id)
);
create table if not exists properties (
  id uuid primary key default gen_random_uuid(), client_id uuid references clients(id) on delete cascade,
  address text not null, town text not null, units int, structures int, fence_linear_ft int,
  access_notes text, resident_contact text
);
create table if not exists inspections (
  id uuid primary key default gen_random_uuid(), property_id uuid references properties(id) on delete cascade,
  scheduled_for date, completed_at timestamptz, inspector text,
  findings jsonb default '[]',                   -- [{structure, issue, priority: safety_now|this_year|monitor, photo_paths, est_low, est_high}]
  report_path text
);
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  client_id uuid references clients(id), property_id uuid references properties(id),
  lead_id uuid references leads(id), ghl_opportunity_id text,
  service text not null, town text,
  status text not null default 'estimate_scheduled', -- estimate_scheduled|estimate_sent|won|scheduled|in_progress|completed|invoiced|paid|lost
  estimate_at timestamptz, scheduled_start date, completed_at timestamptz,
  written_scope text, assigned_to text,          -- technician or subcontractor
  contract_value numeric(12,2),
  -- INTERNAL ONLY: never exposed to customer or subcontractor views
  est_material_cost numeric(12,2), est_labor_cost numeric(12,2), actual_material_cost numeric(12,2), actual_labor_cost numeric(12,2), sub_cost numeric(12,2)
);
create table if not exists job_materials (id uuid primary key default gen_random_uuid(), job_id uuid references jobs(id) on delete cascade, item text, qty numeric, unit text, ordered boolean default false);
create table if not exists job_photos (id uuid primary key default gen_random_uuid(), job_id uuid references jobs(id) on delete cascade, phase text check (phase in ('before','progress','after')), path text not null, taken_at timestamptz default now(), publish_permission boolean default false);
create table if not exists change_orders (id uuid primary key default gen_random_uuid(), job_id uuid references jobs(id) on delete cascade, description text, amount numeric(12,2), status text default 'pending', approved_by text, approved_at timestamptz);
create table if not exists invoices (id uuid primary key default gen_random_uuid(), job_id uuid references jobs(id), client_id uuid references clients(id), amount numeric(12,2), issued_at date, due_at date, stripe_invoice_id text, status text default 'draft', paid_at timestamptz);
create table if not exists ad_spend_daily (day date not null, channel text not null, campaign text not null, spend numeric(12,2) not null, clicks int, impressions int, primary key (day, channel, campaign));

do $$ declare t text; begin
  foreach t in array array['clients','properties','inspections','jobs','job_materials','job_photos','change_orders','invoices','ad_spend_daily'] loop
    execute format('alter table %I enable row level security', t);
  end loop; end $$;

-- Role-based policies: JWT app_metadata.role in ('owner','bdr','pm','sub')
create or replace function app_role() returns text language sql stable as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') $$;
create policy owner_all_jobs on jobs for all using (app_role() = 'owner');
create policy pm_read_jobs on jobs for select using (app_role() in ('pm','bdr'));
-- Subcontractors read only their jobs, through a view without cost columns:
create or replace view jobs_for_subs with (security_invoker = true) as
  select id, service, town, status, scheduled_start, written_scope, assigned_to from jobs;

-- ============ KPI VIEWS ============
create or replace view v_kpi_channel_month as
with l as (
  select date_trunc('month', created_at) m,
    case when gclid is not null or gbraid is not null or wbraid is not null then 'google_ads'
         when fbclid is not null or utm_source ilike any (array['%facebook%','%instagram%','%meta%']) then 'meta'
         when utm_source ilike '%lsa%' then 'lsa' when utm_source is null then 'organic_direct' else utm_source end channel,
    id, funnel, pipeline
  from leads where form_type <> 'newsletter'
), s as (select date_trunc('month', day) m, channel, sum(spend) spend from ad_spend_daily group by 1,2),
j as (select date_trunc('month', jb.created_at) m, l2.channel, count(*) filter (where jb.estimate_at is not null) booked,
        count(*) filter (where jb.status in ('won','scheduled','in_progress','completed','invoiced','paid')) won,
        sum(jb.contract_value) filter (where jb.status in ('won','scheduled','in_progress','completed','invoiced','paid')) revenue,
        sum(jb.contract_value - coalesce(jb.actual_material_cost,0) - coalesce(jb.actual_labor_cost,0) - coalesce(jb.sub_cost,0)) filter (where jb.status in ('completed','invoiced','paid')) gross_margin
      from jobs jb join l l2 on l2.id = jb.lead_id group by 1,2)
select l.m month, l.channel, count(l.id) leads, coalesce(s.spend,0) spend,
  round(coalesce(s.spend,0) / nullif(count(l.id),0), 2) cpl,
  j.booked, round(coalesce(s.spend,0) / nullif(j.booked,0), 2) cost_per_booked,
  j.won, round(coalesce(s.spend,0) / nullif(j.won,0), 2) cac, j.revenue, round(j.revenue / nullif(j.won,0), 2) avg_contract, j.gross_margin
from l left join s on s.m = l.m and s.channel = l.channel left join j on j.m = l.m and j.channel = l.channel
group by l.m, l.channel, s.spend, j.booked, j.won, j.revenue, j.gross_margin;

-- 2026-11: pre-estimate qualifiers + OpenAI Ads references
alter table leads add column if not exists qualifiers jsonb;
alter table leads add column if not exists budget_fit text;
alter table leads add column if not exists openai_obref text;
alter table leads add column if not exists openai_oppref text;
