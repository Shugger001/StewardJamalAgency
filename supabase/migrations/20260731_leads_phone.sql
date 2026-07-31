-- Add phone to public leads for contact follow-up.
-- Safe to run multiple times.

alter table public.leads
  add column if not exists phone text;
