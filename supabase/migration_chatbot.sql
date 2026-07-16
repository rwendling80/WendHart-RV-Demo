-- AI salesperson chatbot: per-dealer config, conversation storage, and
-- loosening `leads` to allow anonymous chat sessions to log as leads.

alter table dealers add column owner_name text;
alter table dealers add column years_in_business integer;
alter table dealers add column vehicle_type text not null default 'RV';
alter table dealers add column hold_policy text;
alter table dealers add column trade_policy text;
alter table dealers add column delivery_policy text;
alter table dealers add column warranty_type text not null default 'as_is'
  check (warranty_type in ('as_is', 'warranty'));
alter table dealers add column warranty_details text;
alter table dealers add column discovery_notes text;
alter table dealers add column notification_email text;
alter table dealers add column is_demo boolean not null default false;

update dealers
set
  owner_name = 'Reid Wendling',
  years_in_business = 10,
  vehicle_type = 'RV',
  warranty_type = 'as_is',
  is_demo = true
where slug = 'wendhart-demo';

-- SECURITY FIX (found while extending this table, not introduced today):
-- `dealers` has had RLS "using (true)" for every column since the
-- multi-tenant migration, and getCurrentDealer() selects("*") with the
-- public anon key -- meaning admin_password has been readable by anyone
-- with the (client-bundled) public key via a plain REST call. Same failure
-- mode floor_price_cents had on `units`: RLS governs rows, not columns.
-- Fixed the same way -- revoke table-level SELECT, re-grant only the
-- columns the public site actually needs.
revoke select on dealers from anon, authenticated;
grant select (
  id, slug, domain, name, tagline, phone, address, hours,
  owner_name, years_in_business, vehicle_type, hold_policy, trade_policy,
  delivery_policy, warranty_type, warranty_details, discovery_notes, is_demo
) on dealers to anon, authenticated;

-- Chat conversations. Fully server-mediated (the browser only ever talks to
-- app/api/chat, never Supabase directly), so no public RLS policy is
-- needed -- RLS is enabled with zero policies, meaning the anon/authenticated
-- keys have no access at all. Only supabaseAdmin (secret key, server-only)
-- reads/writes this table.
create table chat_conversations (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references dealers(id),
  session_id text not null,
  messages jsonb not null default '[]'::jsonb,
  name text,
  phone text,
  unit_ids uuid[] not null default '{}',
  intent_level text not null default 'BROWSE'
    check (intent_level in ('HOT', 'WARM', 'BROWSE')),
  summary text,
  lead_id uuid references leads(id) on delete set null,
  hot_alert_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index chat_conversations_dealer_session_idx
  on chat_conversations(dealer_id, session_id);

alter table chat_conversations enable row level security;

-- leads: allow anonymous chatbot sessions to log before a name/phone is
-- captured, and add 'chatbot' as a valid source alongside the existing
-- 'inquiry' and 'financing'.
alter table leads alter column name drop not null;
alter table leads alter column phone drop not null;
alter table leads drop constraint leads_source_check;
alter table leads add constraint leads_source_check
  check (source in ('inquiry', 'financing', 'chatbot'));
alter table leads add column intent_level text
  check (intent_level in ('HOT', 'WARM', 'BROWSE'));
