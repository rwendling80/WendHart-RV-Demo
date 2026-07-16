-- Phase 2 chatbot: the canonical prompt files (prompts/) reference dealer
-- policy answers via [CONFIG] markers that the first chatbot migration
-- didn't have columns for yet. Adds the remaining four.

alter table dealers add column financing_process text;
alter table dealers add column out_of_state_process text;
alter table dealers add column what_to_bring text;
alter table dealers add column paperwork_handled text;

-- Same column-level grant pattern as migration_chatbot.sql -- these are
-- public-safe (not secret like admin_password), so add them to the
-- allowed list rather than leaving them ungranted (ungranted would make
-- them silently disappear from getCurrentDealer()'s select rather than
-- erroring, which is a confusing failure mode to debug later).
grant select (financing_process, out_of_state_process, what_to_bring, paperwork_handled)
  on dealers to anon, authenticated;
