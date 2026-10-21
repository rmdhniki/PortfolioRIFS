-- Migration: add Hero/About "portrait" + Services "workspace" profile images,
-- and a dedicated storage bucket for them (separate from project screenshots).
-- Run this once in Supabase dashboard: SQL Editor → New query → paste → Run.

alter table site_settings add column if not exists portrait_image_url text;
alter table site_settings add column if not exists workspace_image_url text;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "site_assets_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site-assets');
create policy "site_assets_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets');
create policy "site_assets_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'site-assets');
create policy "site_assets_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets');
