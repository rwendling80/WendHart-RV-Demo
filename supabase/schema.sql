-- WendHart Demo RV — Phase 1 schema
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run.
-- Safe to re-run: drops and recreates the three Phase 1 tables.

drop table if exists leads;
drop table if exists unit_photos;
drop table if exists units;

-- units: one row per inventory item. "category" is what makes this reusable
-- for a future cars/boats/powersports edition — RV-specific fields (length,
-- sleeps, slides, tanks, etc.) live in the flexible `specs` column instead of
-- being hard-coded columns, so a "cars" edition can store car-shaped specs in
-- the same column without a schema change.
create table units (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'rv',
  rv_type text, -- travel_trailer | fifth_wheel | motorhome | toy_hauler
  vin text,
  year int,
  make text,
  model text,
  price_cents integer not null,
  status text not null default 'available' check (status in ('available', 'sold')),
  sold_at timestamptz,
  condition_notes text,
  description text,
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table unit_photos (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);

-- leads: every inquiry from the public site. unit_id is nullable so a future
-- chatbot (Phase 2) can log general questions not tied to one unit.
create table leads (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete set null,
  name text not null,
  phone text not null,
  message text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Came in', 'Bought', 'Dead')),
  created_at timestamptz not null default now()
);

create index unit_photos_unit_id_idx on unit_photos(unit_id);
create index leads_unit_id_idx on leads(unit_id);
create index units_status_idx on units(status);

-- Row Level Security: the public "publishable" key (used in the browser)
-- may only read available inventory and submit new leads. All writes to
-- units/unit_photos and all reading/updating of leads requires the private
-- "secret" key, which only ever runs on the server behind the admin
-- password gate.
alter table units enable row level security;
alter table unit_photos enable row level security;
alter table leads enable row level security;

create policy "public can read units" on units
  for select using (true);

create policy "public can read unit_photos" on unit_photos
  for select using (true);

create policy "public can create leads" on leads
  for insert with check (true);
