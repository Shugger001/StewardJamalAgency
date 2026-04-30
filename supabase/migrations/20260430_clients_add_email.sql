-- Optional: store client contact email on the clients table (used by admin flows and notifications).
alter table public.clients
  add column if not exists email text;

comment on column public.clients.email is 'Optional contact email for the client business record.';
