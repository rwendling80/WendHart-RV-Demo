alter table units add column if not exists floor_price_cents integer;

comment on column units.floor_price_cents is
  'Dealer''s bottom-dollar minimum acceptable price. ADMIN-ONLY, never public. Reserved for Phase 2 chatbot TRIAGE (flagging a hot offer to the dealer) -- the chatbot must never quote, negotiate toward, or accept this number.';

-- Belt-and-suspenders: RLS policies control which ROWS anon/authenticated can
-- see, but table-level grants control which COLUMNS. Revoke the blanket
-- grant and re-grant only the public-safe columns, so a direct REST call
-- with the publishable key asking for floor_price_cents by name gets a
-- permission error, not just an app-code omission. NOTE: if a new column is
-- ever added to `units` that's safe for the public site, it must be added
-- to this list too, or it won't be readable by the public key at all.
revoke select on units from anon, authenticated;

grant select (
  id, dealer_id, category, rv_type, vin, year, make, model, price_cents,
  status, sold_at, condition_notes, description, specs, created_at, updated_at
) on units to anon, authenticated;
