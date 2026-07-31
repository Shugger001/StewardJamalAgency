-- Marketing portfolio entries (live sites you have built / worked on).
-- Run in the active Supabase SQL editor if the table is missing.

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null,
  url text not null,
  summary text,
  outcome text,
  image_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_items_published_sort_idx
  on public.portfolio_items (is_published, sort_order asc, created_at desc);

alter table public.portfolio_items enable row level security;

drop policy if exists portfolio_items_public_read on public.portfolio_items;
create policy portfolio_items_public_read on public.portfolio_items
  for select
  using (is_published = true);

drop policy if exists portfolio_items_staff_all on public.portfolio_items;
create policy portfolio_items_staff_all on public.portfolio_items
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );
