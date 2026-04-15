-- Public leads capture table for proposal/booking requests.
-- Safe to run multiple times.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text not null,
  budget text,
  timeline text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
