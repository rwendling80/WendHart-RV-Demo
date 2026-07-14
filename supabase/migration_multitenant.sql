create table dealers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  domain text unique,
  name text not null,
  tagline text,
  phone text,
  address text,
  hours jsonb not null default '[]'::jsonb,
  admin_password text not null,
  created_at timestamptz not null default now()
);

insert into dealers (slug, domain, name, tagline, phone, address, hours, admin_password)
values (
  'wendhart-demo',
  null,
  'WendHart Demo RV',
  'Quality Used RVs. Straight Talk. Fair Prices.',
  '(555) 019-2837',
  '3312 Nolensville Pike, Nashville, TN 37211',
  '[{"days":"Monday - Friday","time":"9:00 AM - 6:00 PM"},{"days":"Saturday","time":"9:00 AM - 4:00 PM"},{"days":"Sunday","time":"Closed"}]'::jsonb,
  'Hartwend-Lot-47'
)
on conflict (slug) do nothing;

alter table units add column dealer_id uuid references dealers(id);
alter table unit_photos add column dealer_id uuid references dealers(id);
alter table leads add column dealer_id uuid references dealers(id);

update units set dealer_id = (select id from dealers where slug = 'wendhart-demo') where dealer_id is null;
update unit_photos set dealer_id = (select id from dealers where slug = 'wendhart-demo') where dealer_id is null;
update leads set dealer_id = (select id from dealers where slug = 'wendhart-demo') where dealer_id is null;

alter table units alter column dealer_id set not null;
alter table unit_photos alter column dealer_id set not null;
alter table leads alter column dealer_id set not null;

create index units_dealer_id_idx on units(dealer_id);
create index unit_photos_dealer_id_idx on unit_photos(dealer_id);
create index leads_dealer_id_idx on leads(dealer_id);

alter table dealers enable row level security;

create policy "public can read dealers" on dealers
  for select using (true);
