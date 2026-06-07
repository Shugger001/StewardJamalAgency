-- One-shot setup for Steward Jamal Agency (safe to re-run).
-- Run in Supabase → SQL Editor for project cpnrwrpdnbplccsqvahn.

-- Profiles + auth trigger
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_role text;
begin
  desired_role := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  if desired_role not in ('admin', 'staff', 'client') then
    desired_role := 'client';
  end if;
  insert into public.profiles (id, role)
  values (new.id, desired_role)
  on conflict (id) do update
    set role = coalesce(public.profiles.role, excluded.role);
  return new;
exception
  when others then
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Public leads
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

alter table public.leads enable row level security;

-- Core agency tables
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references public.clients(id) on delete set null,
  status text not null default 'draft',
  domain text,
  created_at timestamptz not null default now()
);

create unique index if not exists websites_domain_unique_idx
  on public.websites (domain)
  where domain is not null;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null default 'default',
  position integer not null default 0
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  type text not null default 'text',
  value text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  client_id uuid not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  amount numeric not null,
  status text not null,
  reference text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service text not null,
  notes text,
  scheduled_for timestamptz not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_scheduled_for_idx on public.bookings(scheduled_for);

-- RLS
alter table if exists public.notifications enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.payments enable row level security;
alter table if exists public.bookings enable row level security;

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications for select using (auth.uid() = user_id);

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists projects_select_client_own on public.projects;
create policy projects_select_client_own on public.projects for select using (
  auth.uid() = client_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
);

drop policy if exists projects_insert_client_or_staff on public.projects;
create policy projects_insert_client_or_staff on public.projects for insert with check (
  auth.uid() = client_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
);

drop policy if exists projects_update_staff_only on public.projects;
create policy projects_update_staff_only on public.projects for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
);

drop policy if exists payments_select_client_own on public.payments;
create policy payments_select_client_own on public.payments for select using (
  auth.uid() = client_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
);

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings for select using (auth.uid() = user_id);

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings for insert with check (auth.uid() = user_id);

drop policy if exists "bookings_update_admin_staff" on public.bookings;
create policy "bookings_update_admin_staff" on public.bookings for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
);

-- Demo portfolio seed (only when empty)
insert into public.clients (id, business_name, email)
select * from (values
  ('11111111-1111-1111-1111-111111111101'::uuid, 'Accra Retail Group', 'hello@accraretail.example'),
  ('11111111-1111-1111-1111-111111111102'::uuid, 'Kumasi Wellness Co.', 'team@kumasiwellness.example'),
  ('11111111-1111-1111-1111-111111111103'::uuid, 'Coastal Logistics GH', 'ops@coastallogistics.example')
) as seed(id, business_name, email)
where not exists (select 1 from public.clients limit 1);

insert into public.websites (id, name, client_id, status, domain)
select * from (values
  ('22222222-2222-2222-2222-222222222201'::uuid, 'Accra Retail Storefront', '11111111-1111-1111-1111-111111111101'::uuid, 'published', null),
  ('22222222-2222-2222-2222-222222222202'::uuid, 'Wellness Booking Portal', '11111111-1111-1111-1111-111111111102'::uuid, 'published', null),
  ('22222222-2222-2222-2222-222222222203'::uuid, 'Logistics Client Dashboard', '11111111-1111-1111-1111-111111111103'::uuid, 'published', null)
) as seed(id, name, client_id, status, domain)
where not exists (select 1 from public.websites limit 1);
