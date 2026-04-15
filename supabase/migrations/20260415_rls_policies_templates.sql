-- RLS templates for production hardening.
-- Review and adjust before applying in production.

alter table if exists public.notifications enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.payments enable row level security;

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own
  on public.notifications
  for select
  using (auth.uid() = user_id);

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists projects_select_client_own on public.projects;
create policy projects_select_client_own
  on public.projects
  for select
  using (
    auth.uid() = client_id
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

drop policy if exists projects_insert_client_or_staff on public.projects;
create policy projects_insert_client_or_staff
  on public.projects
  for insert
  with check (
    auth.uid() = client_id
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

drop policy if exists projects_update_staff_only on public.projects;
create policy projects_update_staff_only
  on public.projects
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );

drop policy if exists payments_select_client_own on public.payments;
create policy payments_select_client_own
  on public.payments
  for select
  using (
    auth.uid() = client_id
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'staff')
    )
  );
