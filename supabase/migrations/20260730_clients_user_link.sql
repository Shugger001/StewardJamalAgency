-- Align clients with auth users and store profile emails for notifications.
-- Safe to run multiple times.

alter table public.clients
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.clients
  add column if not exists email text;

create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists clients_email_idx on public.clients(email);

alter table public.profiles
  add column if not exists email text;

create index if not exists profiles_email_idx on public.profiles(email);

-- Keep profile email in sync on signup when available.
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

  insert into public.profiles (id, role, email)
  values (new.id, desired_role, new.email)
  on conflict (id) do update
    set role = coalesce(public.profiles.role, excluded.role),
        email = coalesce(excluded.email, public.profiles.email);

  return new;
exception
  when others then
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;
