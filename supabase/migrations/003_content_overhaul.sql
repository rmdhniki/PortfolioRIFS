-- Tahap 1: konten baru untuk versi website berikutnya.
-- Jalankan sekali lewat Supabase SQL Editor.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'portrait_image_url'
  ) then
    alter table site_settings rename column portrait_image_url to hero_image_url;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'workspace_image_url'
  ) then
    alter table site_settings rename column workspace_image_url to services_image_url;
  end if;
end $$;

alter table site_settings add column if not exists hero_image_url text;
alter table site_settings add column if not exists services_image_url text;
alter table site_settings add column if not exists about_front_image_url text;
alter table site_settings add column if not exists about_back_image_url text;
alter table site_settings add column if not exists lanyard_strap_image_url text;
alter table site_settings add column if not exists cv_url text;

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  credential_id text not null default '',
  verify_url text,
  image_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null default '',
  description text not null default '',
  image_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists certifications_set_updated_at on certifications;
create trigger certifications_set_updated_at
  before update on certifications
  for each row execute function set_updated_at();

drop trigger if exists experiences_set_updated_at on experiences;
create trigger experiences_set_updated_at
  before update on experiences
  for each row execute function set_updated_at();

alter table certifications enable row level security;
alter table experiences enable row level security;

drop policy if exists "certifications_public_read" on certifications;
create policy "certifications_public_read" on certifications
  for select to anon, authenticated using (true);
drop policy if exists "certifications_admin_write" on certifications;
create policy "certifications_admin_write" on certifications
  for insert to authenticated with check (true);
drop policy if exists "certifications_admin_update" on certifications;
create policy "certifications_admin_update" on certifications
  for update to authenticated using (true) with check (true);
drop policy if exists "certifications_admin_delete" on certifications;
create policy "certifications_admin_delete" on certifications
  for delete to authenticated using (true);

drop policy if exists "experiences_public_read" on experiences;
create policy "experiences_public_read" on experiences
  for select to anon, authenticated using (true);
drop policy if exists "experiences_admin_write" on experiences;
create policy "experiences_admin_write" on experiences
  for insert to authenticated with check (true);
drop policy if exists "experiences_admin_update" on experiences;
create policy "experiences_admin_update" on experiences
  for update to authenticated using (true) with check (true);
drop policy if exists "experiences_admin_delete" on experiences;
create policy "experiences_admin_delete" on experiences
  for delete to authenticated using (true);

insert into certifications (title, description, credential_id, order_index)
select * from (values
  ('Certification Placeholder 1', 'Ganti judul, deskripsi, ID, dan gambar lewat dashboard admin.', 'CERT-0001', 0),
  ('Certification Placeholder 2', 'Ganti judul, deskripsi, ID, dan gambar lewat dashboard admin.', 'CERT-0002', 1),
  ('Certification Placeholder 3', 'Ganti judul, deskripsi, ID, dan gambar lewat dashboard admin.', 'CERT-0003', 2)
) as seed(title, description, credential_id, order_index)
where not exists (select 1 from certifications);

insert into experiences (role, company, period, description, order_index)
select * from (values
  ('Fullstack Developer', 'Company Placeholder', '2024 - Sekarang', 'Ganti data pengalaman ini lewat dashboard admin.', 0),
  ('Web Developer', 'Company Placeholder', '2022 - 2024', 'Ganti data pengalaman ini lewat dashboard admin.', 1),
  ('Freelance Developer', 'Self-employed', '2021 - Sekarang', 'Ganti data pengalaman ini lewat dashboard admin.', 2)
) as seed(role, company, period, description, order_index)
where not exists (select 1 from experiences);
