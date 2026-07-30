-- CMS content block keys used by hero/features section components.
-- Safe to run multiple times.

alter table public.content_blocks
  add column if not exists key text;

create unique index if not exists content_blocks_section_id_key_uidx
  on public.content_blocks(section_id, key)
  where key is not null;
