-- Notifications table for in-app delivery
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create index if not exists notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

-- Custom domain support for websites
alter table public.websites
  add column if not exists domain text;

create unique index if not exists websites_domain_unique_idx
  on public.websites (domain)
  where domain is not null;
