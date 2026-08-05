-- PortfolioRIFS — Supabase schema, RLS policies, and seed data.
-- Run this once in the Supabase dashboard: Project → SQL Editor → New query → paste → Run.

-- ============================================================
-- Tables
-- ============================================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  gradient text not null,
  tech text[] not null default '{}',
  year text not null,
  industry text not null,
  client text not null,
  duration text not null,
  overview text not null,
  problem text not null,
  solution text not null,
  features text[] not null default '{}',
  gallery text[] not null default '{}',
  github text,
  demo text,
  image_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id integer primary key default 1,
  name text not null default '',
  brand text not null default '',
  role text not null default '',
  roles text[] not null default '{}',
  tagline text not null default '',
  email text not null default '',
  location text not null default '',
  available_for_work boolean not null default true,
  about_title text not null default '',
  about_education text not null default '',
  about_description text not null default '',
  stats jsonb not null default '[]',
  services jsonb not null default '[]',
  tech_stack_row1 text[] not null default '{}',
  tech_stack_row2 text[] not null default '{}',
  social_links jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ============================================================
-- Auto-update `updated_at` on row changes
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- Only one admin account ever authenticates against this project
-- (created manually, no public sign-up), so any `authenticated`
-- session is trusted with full write access.
-- ============================================================

alter table projects enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- projects: public can read, only the admin can write
create policy "projects_public_read" on projects
  for select to anon, authenticated using (true);
create policy "projects_admin_write" on projects
  for insert to authenticated with check (true);
create policy "projects_admin_update" on projects
  for update to authenticated using (true) with check (true);
create policy "projects_admin_delete" on projects
  for delete to authenticated using (true);

-- contact_messages: anyone can submit, only the admin can read/manage
create policy "messages_public_insert" on contact_messages
  for insert to anon, authenticated with check (true);
create policy "messages_admin_read" on contact_messages
  for select to authenticated using (true);
create policy "messages_admin_update" on contact_messages
  for update to authenticated using (true) with check (true);
create policy "messages_admin_delete" on contact_messages
  for delete to authenticated using (true);

-- site_settings: public can read, only the admin can update
create policy "settings_public_read" on site_settings
  for select to anon, authenticated using (true);
create policy "settings_admin_update" on site_settings
  for update to authenticated using (true) with check (true);

-- ============================================================
-- Seed data — migrated from src/lib/projects.ts and src/lib/site-config.ts
-- ============================================================

insert into projects (slug, title, category, description, gradient, tech, year, industry, client, duration, overview, problem, solution, features, gallery, github, demo, order_index)
values
(
  'commerce-nova', 'Commerce Nova', 'Fullstack Development',
  'Platform e-commerce dengan dashboard admin real-time, dibangun untuk performa cepat dan skalabilitas.',
  'from-[#d9b48a] via-[#eadfc8] to-[#6f4a2f]',
  array['Laravel','React','MySQL','Tailwind CSS'],
  '2025', 'E-commerce', 'Personal Project', '6 minggu',
  'Commerce Nova adalah platform belanja online full-stack yang mencakup katalog produk, keranjang, checkout, dan dashboard admin untuk manajemen pesanan.',
  'Toko kecil sering kesulitan mengelola stok dan pesanan lewat spreadsheet manual, menyebabkan kesalahan data dan lambatnya respon ke pelanggan.',
  'Dibangun sistem terintegrasi dengan dashboard real-time, notifikasi stok menipis, dan alur checkout yang disederhanakan menjadi tiga langkah.',
  array['Autentikasi & role admin','Dashboard analitik penjualan','Manajemen stok real-time','Integrasi payment gateway'],
  array['from-[#d9b48a] to-[#6f4a2f]','from-[#eadfc8] to-[#b4855a]'],
  'https://github.com/placeholder/commerce-nova', 'https://commerce-nova.vercel.app', 0
),
(
  'kasir-flow', 'KasirFlow POS', 'Mobile Development',
  'Aplikasi kasir mobile lintas platform untuk UMKM, mendukung mode offline dan sinkronisasi otomatis.',
  'from-[#8a6a4a] via-[#c9a876] to-[#3a2a1c]',
  array['Flutter','Dart','SQLite','Firebase'],
  '2024', 'Retail & F&B', 'UMKM Lokal', '8 minggu',
  'KasirFlow adalah aplikasi Point of Sale untuk pelaku UMKM yang berjalan di Android dan tetap dapat mencatat transaksi tanpa koneksi internet.',
  'Pemilik warung membutuhkan pencatatan transaksi yang cepat namun koneksi internet di lokasi sering tidak stabil.',
  'Menerapkan penyimpanan lokal dengan SQLite dan mekanisme sinkronisasi otomatis ke server saat koneksi tersedia kembali.',
  array['Mode offline penuh','Cetak struk via Bluetooth printer','Laporan penjualan harian','Manajemen multi-outlet'],
  array['from-[#8a6a4a] to-[#3a2a1c]','from-[#c9a876] to-[#8a6a4a]'],
  'https://github.com/placeholder/kasirflow', null, 1
),
(
  'dataviz-insight', 'DataViz Insight', 'Data Analysis',
  'Dashboard analitik data untuk memvisualisasikan tren penjualan dan perilaku pelanggan secara interaktif.',
  'from-[#b4855a] via-[#f3ead9] to-[#5b3a24]',
  array['Python','React','PostgreSQL','Chart.js'],
  '2024', 'Business Intelligence', 'Studi Kasus', '4 minggu',
  'DataViz Insight mengolah data transaksi mentah menjadi visualisasi interaktif yang membantu pengambilan keputusan bisnis.',
  'Data transaksi menumpuk di banyak file terpisah tanpa ada cara cepat untuk melihat tren dan pola pembelian.',
  'Membangun pipeline pembersihan data otomatis dan dashboard interaktif dengan filter multi-dimensi.',
  array['Filter data multi-dimensi','Ekspor laporan ke PDF/Excel','Prediksi tren sederhana','Visualisasi peta sebaran pelanggan'],
  array['from-[#b4855a] to-[#5b3a24]','from-[#f3ead9] to-[#b4855a]'],
  null, 'https://dataviz-insight.vercel.app', 2
),
(
  'studio-folio', 'Studio Folio CMS', 'UI/UX & Web Design',
  'Sistem manajemen konten ringan untuk agensi kreatif, dengan editor drag-and-drop dan tema yang bisa dikustomisasi.',
  'from-[#6f4a2f] via-[#d9b48a] to-[#2b1d13]',
  array['Next.js','PHP','MySQL','Framer Motion'],
  '2023', 'Creative Agency', 'Studi Kasus', '5 minggu',
  'Studio Folio CMS memudahkan tim kreatif mengelola portofolio klien tanpa perlu menyentuh kode.',
  'Update portofolio klien selalu bergantung pada developer, memperlambat proses publikasi konten baru.',
  'Merancang editor visual drag-and-drop dengan sistem tema yang bisa dikonfigurasi tanpa kode.',
  array['Editor drag-and-drop','Manajemen multi-tema','Preview real-time','Role-based access'],
  array['from-[#6f4a2f] to-[#2b1d13]','from-[#d9b48a] to-[#6f4a2f]'],
  'https://github.com/placeholder/studio-folio', 'https://studio-folio.vercel.app', 3
)
on conflict (slug) do nothing;

insert into site_settings (id, name, brand, role, roles, tagline, email, location, available_for_work, about_title, about_education, about_description, stats, services, tech_stack_row1, tech_stack_row2, social_links)
values (
  1,
  'Muhammad Rifki Ramadhani',
  'RIFS.',
  'Fullstack Developer',
  array['Freelancer','Fullstack Developer','Software Engineer','Data Analyst'],
  'Membangun pengalaman digital yang rapi, cepat, dan elegan — dari backend sampai antarmuka.',
  'rmdhniki18@gmail.com',
  'Bandung, Indonesia',
  true,
  'About Me',
  'S1 Teknik Informatika, Universitas Pasundan',
  'Saya adalah seorang Fullstack Developer yang senang mengubah ide menjadi produk digital yang fungsional dan enak dipakai. Berpengalaman membangun aplikasi web dari sisi backend hingga antarmuka, dengan perhatian besar pada detail, performa, dan pengalaman pengguna.',
  '[{"label":"Years of Experience","value":2,"suffix":"+"},{"label":"Completed Projects","value":15,"suffix":"+"},{"label":"Technologies","value":12,"suffix":"+"}]',
  '[{"title":"Web Development","description":"Membangun aplikasi web full-stack yang cepat, aman, dan mudah dikembangkan — dari database sampai antarmuka."},{"title":"Mobile Development","description":"Membuat aplikasi mobile lintas platform dengan Flutter yang ringan, responsif, dan enak dipakai sehari-hari."},{"title":"Backend & API","description":"Merancang REST API dan arsitektur backend yang scalable menggunakan Laravel serta database relasional."},{"title":"UI/UX Design","description":"Mendesain antarmuka yang intuitif, menjembatani kebutuhan bisnis dengan pengalaman pengguna yang nyaman."}]',
  array['HTML','CSS','JavaScript','React','Next.js','Laravel','Flutter'],
  array['PHP','Dart','MySQL','SQLite','Git','Github'],
  '[{"label":"LinkedIn","href":"https://linkedin.com/in/placeholder","icon":"linkedin"},{"label":"Github","href":"https://github.com/placeholder","icon":"github"},{"label":"Gitlab","href":"https://gitlab.com/placeholder","icon":"gitlab"}]'
)
on conflict (id) do nothing;

-- ============================================================
-- Storage bucket for project images (public read, admin write)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "project_images_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-images');
create policy "project_images_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images');
create policy "project_images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'project-images');
create policy "project_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images');
