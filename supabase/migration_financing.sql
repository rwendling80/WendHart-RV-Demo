alter table leads add column source text not null default 'inquiry' check (source in ('inquiry', 'financing'));

create table financing_applications (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references dealers(id),
  unit_id uuid references units(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  status text not null default 'New' check (status in ('New', 'Printed', 'Submitted to lender', 'Approved', 'Declined', 'Expired')),

  applicant_name text not null,
  applicant_address text not null,
  applicant_time_at_address text,
  applicant_housing_status text check (applicant_housing_status in ('own', 'rent', 'other')),
  applicant_housing_payment_cents integer,
  applicant_phone text not null,
  applicant_email text,
  applicant_dob_encrypted text not null,
  applicant_ssn_encrypted text not null,
  applicant_ssn_last4 text not null,
  applicant_dl_number text,
  applicant_dl_state text,
  applicant_employer text not null,
  applicant_position text,
  applicant_time_on_job text,
  applicant_work_phone text,
  applicant_gross_monthly_income_cents integer not null,
  applicant_other_income_cents integer,

  has_coapplicant boolean not null default false,
  co_name text,
  co_address text,
  co_time_at_address text,
  co_housing_status text check (co_housing_status in ('own', 'rent', 'other')),
  co_housing_payment_cents integer,
  co_phone text,
  co_email text,
  co_dob_encrypted text,
  co_ssn_encrypted text,
  co_ssn_last4 text,
  co_dl_number text,
  co_dl_state text,
  co_employer text,
  co_position text,
  co_time_on_job text,
  co_work_phone text,
  co_gross_monthly_income_cents integer,
  co_other_income_cents integer,

  trade_in_year integer,
  trade_in_make text,
  trade_in_model text,
  trade_in_payoff_cents integer,
  trade_in_lienholder text,

  down_payment_cents integer,

  signature_name text not null,
  signature_date date not null,

  created_at timestamptz not null default now()
);

create index financing_applications_dealer_id_idx on financing_applications(dealer_id);
create index financing_applications_created_at_idx on financing_applications(created_at);

alter table financing_applications enable row level security;

create policy "public can create financing applications" on financing_applications
  for insert with check (true);

create extension if not exists pg_cron;

select cron.schedule(
  'purge-financing-applications',
  '0 3 * * *',
  $$ delete from financing_applications where created_at < now() - interval '30 days' $$
);
