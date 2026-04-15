-- Fix Supabase auth signup failures caused by brittle new-user triggers.
-- Safe to run multiple times.

-- 1) Ensure profiles table exists with expected minimum columns.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Make role permissive enough for app roles if a check constraint exists later.
-- (No-op unless your project has a restrictive check elsewhere.)

-- 3) Create/replace robust auth trigger function.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_role text;
begin
  -- Read role from user metadata, but always fall back safely.
  desired_role := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  if desired_role not in ('admin', 'staff', 'client') then
    desired_role := 'client';
  end if;

  -- Upsert profile without raising duplicate errors.
  insert into public.profiles (id, role)
  values (new.id, desired_role)
  on conflict (id) do update
    set role = coalesce(public.profiles.role, excluded.role);

  return new;
exception
  when others then
    -- Never block auth signup on profile-write issues.
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- 4) Ensure trigger exists exactly once.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
