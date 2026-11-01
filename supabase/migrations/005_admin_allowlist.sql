-- 005 — Admin allowlist.
--
-- Before this, every `authenticated` session had full write access. Because the
-- anon key is public and Supabase allows sign-ups by default, anyone could call
-- `auth.signUp()` and become "admin". Now only users listed in `public.admins`
-- pass the `is_admin()` check used by every write policy and by the app.
--
-- HOW TO RUN (Supabase → SQL Editor):
--   1. Replace the email in the INSERT at the bottom with your admin email.
--   2. Run the whole file.
--   3. Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".

-- ============================================================
-- Allowlist table (not reachable through the API at all)
-- ============================================================

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies on purpose: anon/authenticated can never read or edit this table.
revoke all on public.admins from anon, authenticated;

-- ============================================================
-- is_admin(): true only for the current user when they are on the allowlist.
-- SECURITY DEFINER so it can read `admins` despite the RLS above.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- Rewrite write policies: `true` → `is_admin()`
-- ============================================================

-- projects
drop policy if exists "projects_admin_write" on projects;
create policy "projects_admin_write" on projects
  for insert to authenticated with check (public.is_admin());
drop policy if exists "projects_admin_update" on projects;
create policy "projects_admin_update" on projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "projects_admin_delete" on projects;
create policy "projects_admin_delete" on projects
  for delete to authenticated using (public.is_admin());

-- certifications
drop policy if exists "certifications_admin_write" on certifications;
create policy "certifications_admin_write" on certifications
  for insert to authenticated with check (public.is_admin());
drop policy if exists "certifications_admin_update" on certifications;
create policy "certifications_admin_update" on certifications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "certifications_admin_delete" on certifications;
create policy "certifications_admin_delete" on certifications
  for delete to authenticated using (public.is_admin());

-- experiences
drop policy if exists "experiences_admin_write" on experiences;
create policy "experiences_admin_write" on experiences
  for insert to authenticated with check (public.is_admin());
drop policy if exists "experiences_admin_update" on experiences;
create policy "experiences_admin_update" on experiences
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "experiences_admin_delete" on experiences;
create policy "experiences_admin_delete" on experiences
  for delete to authenticated using (public.is_admin());

-- contact_messages (insert stays public for the contact form)
drop policy if exists "messages_admin_read" on contact_messages;
create policy "messages_admin_read" on contact_messages
  for select to authenticated using (public.is_admin());
drop policy if exists "messages_admin_update" on contact_messages;
create policy "messages_admin_update" on contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "messages_admin_delete" on contact_messages;
create policy "messages_admin_delete" on contact_messages
  for delete to authenticated using (public.is_admin());

-- site_settings
drop policy if exists "settings_admin_update" on site_settings;
create policy "settings_admin_update" on site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- storage: project-images
drop policy if exists "project_images_admin_write" on storage.objects;
create policy "project_images_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images' and public.is_admin());
drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());
drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images' and public.is_admin());

-- storage: site-assets
drop policy if exists "site_assets_admin_write" on storage.objects;
create policy "site_assets_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets' and public.is_admin());
drop policy if exists "site_assets_admin_update" on storage.objects;
create policy "site_assets_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());
drop policy if exists "site_assets_admin_delete" on storage.objects;
create policy "site_assets_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets' and public.is_admin());

-- ============================================================
-- Register the admin account. ⚠ Replace the email before running!
-- ============================================================

insert into public.admins (user_id)
select id from auth.users where email = 'GANTI_DENGAN_EMAIL_ADMIN@example.com'
on conflict (user_id) do nothing;

-- Sanity check: should return 1 row. If it returns 0, the email above is wrong
-- and nobody can write to the CMS until you insert the right user_id.
select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;
