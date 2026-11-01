# Alur Website Portfolio RIFS (Versi Baru)

Dokumen ini menjelaskan alur website dari halaman publik sampai dashboard admin pada versi baru: palet hitam + aksen teal `#30BFBF`, urutan section baru, komponen 3D (Lanyard, Circular Gallery), dan menu admin tambahan.

## 1. Ringkasan Teknologi

- Next.js 15 (App Router, Server Components, Server Actions)
- React 19 + Tailwind CSS v4
- Supabase: Auth, PostgreSQL, Row Level Security, Storage
- Resend: email notifikasi dari form contact
- Framer Motion + Lenis: animasi dan smooth scroll
- three + gsap: Lanyard (WebGL) dan FoldText (GSAP)

Dua area utama:

1. Halaman publik: portfolio, detail project, form contact.
2. Dashboard admin: kelola hero, foto, project, experience, certification, tech stack, pesan, dan pengaturan umum.

## 2. Peta Halaman

| Route | Akses | Fungsi |
| --- | --- | --- |
| `/` | Publik | Landing page portfolio |
| `/project/[slug]` | Publik | Detail satu project |
| `/api/contact` | Publik (POST) | Kirim form contact |
| `/admin/login` | Publik | Login admin |
| `/admin` | Admin | Ringkasan dashboard |
| `/admin/hero` | Admin | Nama, role (FoldText), unggah/hapus CV |
| `/admin/photos` | Admin | Hero, Services, About depan/belakang, tali Lanyard |
| `/admin/projects` | Admin | CRUD project |
| `/admin/experiences` | Admin | CRUD experience |
| `/admin/certifications` | Admin | CRUD certification |
| `/admin/tech-stack` | Admin | Dua baris tech stack untuk marquee |
| `/admin/messages` | Admin | Pesan masuk |
| `/admin/settings` | Admin | Profil, about, statistik, layanan, sosial |

## 3. Alur Halaman Publik

### 3.1 Urutan Section

```text
Navbar (fixed, scroll-spy)
1. Hero          (#home)
2. Services      (#services)
   marquee tech stack (kanan)
3. About         (#about)
   marquee tech stack (kanan)
4. Projects      (#projects)
5. Experience    (#experience)
6. Certification (#certification)
7. Contact       (#contact)
Footer
```

Data diambil server-side secara paralel di `src/app/(site)/page.tsx`:

```text
getSiteSettings()      -> site_settings (id = 1)
getProjects()          -> projects (order_index)
getExperiences()       -> experiences (order_index)
getCertifications()    -> certifications (order_index)
```

### 3.2 Hero + Services + About

File: `src/components/sections/hero-services-about.tsx`
- Hero: nama, judul FULLSTACK DEVELOPER, role berputar memakai `RotatingFoldText` (FoldText, `trigger="mount"`, ganti teks tiap 3,2 detik), tombol Explore My Work dan Download CV (muncul hanya jika `cv_url` terisi).
- Foto hero tampil pada kartu di tengah (desktop) atau di atas (mobile).
- Kartu foto bergerak: `MovingPhotoCard` mengikuti scroll dari Hero ke Services, lalu gambar berganti halus (cross-fade) ke foto Services dan kartu berhenti.
- Services: daftar layanan accordion dari `site_settings.services`.
- About: teks + statistik + kartu Lanyard (foto depan/belakang, tali opsional). Klik singkat membalik kartu; tarikan tidak membalik.

### 3.3 Tech Stack Marquee

File: `src/components/sections/tech-marquee.tsx`
- Satu baris ringkas, arah kanan, berulang.
- Dua instance: antara Services dan About (row 1) serta antara About dan Projects (row 2).
- Ikon dari `react-icons/si`; data dari `site_settings.tech_stack_row1/row2`.
- Berhenti saat hover dan saat `prefers-reduced-motion`.

### 3.4 Projects

File: `src/components/sections/projects.tsx`
- Kartu project dari tabel `projects`, mengarah ke `/project/[slug]`.

### 3.5 Experience

File: `src/components/sections/experience.tsx`
- Timeline sederhana: periode, role, perusahaan, deskripsi, logo opsional.
- Saat ini berisi data placeholder; ganti lewat `/admin/experiences`.

### 3.6 Certification

File: `src/components/sections/certification.tsx`
- Dua kolom: teks sertifikat di kiri, Circular Gallery di kanan.
- Sertifikat aktif di galeri menyinkronkan judul, deskripsi, ID, dan tautan verifikasi di kiri.
- Klik kartu membuka gambar penuh.
- Jika WebGL2 tidak tersedia, tampil carousel gambar biasa dengan tombol sebelumnya/berikutnya.

### 3.7 Contact

File: `src/components/sections/contact.tsx`, API `src/app/api/contact/route.ts`

```text
Form diisi
  -> POST /api/contact
  -> validasi field + email
  -> kirim email via Resend (replyTo = email pengirim)
  -> simpan ke contact_messages (jika Supabase aktif)
  -> respons sukses/gagal
```

Catatan: pesan hanya tersimpan jika email berhasil dikirim.

### 3.8 Detail Project

File: `src/app/(site)/project/[slug]/page.tsx`
- Ambil project via `getProjectBySlug`; `notFound()` jika tidak ada.
- Render header, gambar utama (mockup untuk Mobile Development), story, features, technology, gallery, tombol repo/demo, dan Next Project.

## 4. Alur Dashboard Admin

### 4.1 Autentikasi

- Login: `/admin/login` memakai Supabase Auth (`signInWithPassword`).
- Session disimpan sebagai cookie oleh `@supabase/ssr`.
- `src/lib/supabase/middleware.ts` me-refresh session dan mengalihkan pengunjung tanpa session ke `/admin/login`.
- Logout lewat Server Action `logout` di `src/app/admin/actions.ts`.

### 4.2 Menu Dashboard

| Menu | Isi |
| --- | --- |
| Dashboard | Statistik jumlah project, pesan belum dibaca, total pesan |
| Hero | Nama, daftar role, unggah/ganti/hapus CV (PDF maks. 5 MB) |
| Photos | Foto Hero, Services, About depan, About belakang, tali Lanyard |
| Projects | CRUD project beserta galeri gambar |
| Experience | CRUD experience (placeholder, siap diganti) |
| Certifications | CRUD certification: judul, deskripsi, ID, tautan verifikasi, gambar, urutan |
| Tech Stack | Dua daftar teknologi (satu per baris) |
| Messages | Daftar pesan contact, tandai dibaca, hapus |
| Settings | Profil, about, statistik, layanan, sosial links |

### 4.3 Pola Server Action

- Form memakai `useActionState`; aksi mengembalikan `{ error }` atau `{ success }`.
- Upload memakai `uploadFile()` di `src/lib/supabase/storage.ts` (bucket publik `site-assets` dan `project-images`).
- Setiap aksi memvalidasi input dengan Zod (`src/lib/validations/`).
- Halaman publik memakai `React.cache` per request, jadi perubahan langsung terlihat setelah refresh.

## 5. Struktur Backend

### 5.1 Tabel

| Tabel | Kolom penting |
| --- | --- |
| `projects` | `slug`, `title`, `category`, `description`, `tech[]`, `features[]`, `gallery[]`, `overview`, `problem`, `solution`, `github`, `demo`, `image_url`, `order_index` |
| `contact_messages` | `name`, `email`, `service`, `message`, `is_read`, `created_at` |
| `site_settings` | `name`, `roles[]`, `about_*`, `stats`, `services`, `tech_stack_row1/2`, `social_links`, `hero_image_url`, `services_image_url`, `about_front_image_url`, `about_back_image_url`, `lanyard_strap_image_url`, `cv_url` |
| `certifications` | `title`, `description`, `credential_id`, `verify_url`, `image_url`, `order_index` |
| `experiences` | `role`, `company`, `period`, `description`, `image_url`, `order_index` |

Kolom lama `portrait_image_url` dan `workspace_image_url` di-rename lewat migrasi `supabase/migrations/003_content_overhaul.sql` (sudah dijalankan).

### 5.2 RLS

- `projects`, `certifications`, `experiences`: publik boleh `select`, hanya `authenticated` boleh tulis.
- `contact_messages`: publik boleh `insert`, hanya `authenticated` boleh baca/ubah/hapus.
- `site_settings`: publik boleh `select`, hanya `authenticated` boleh `update`.

### 5.3 Storage

- `project-images`: gambar project dan galeri.
- `site-assets`: foto hero/services/about, tali Lanyard, CV.
- Publik boleh membaca; upload/ubah/hapus hanya untuk user terautentikasi.

### 5.4 Fallback Tanpa Supabase

- Jika Supabase belum dikonfigurasi, halaman publik memakai data statis `src/lib/site-config.ts`.
- Dashboard menampilkan notice setup.
- Komponen 3D yang gagal dimuat (WebGL mati) diganti tampilan statis: foto About dengan tombol balik, serta carousel sertifikat.

## 6. Environment Variable

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

## 7. Menjalankan Project

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm run start
```

Jalankan sebagai server Node (bukan virtual host Laragon/Apache).

## 8. Catatan

- Hanya user yang terdaftar di tabel `public.admins` yang dianggap admin (dicek lewat fungsi SQL `is_admin()` di RLS, middleware, layout dashboard, login, dan `requireAdmin()` di setiap Server Action). Login saja tidak cukup. Tambah admin: `insert into public.admins (user_id) select id from auth.users where email = '...'`. Pendaftaran akun publik di Supabase Auth harus dimatikan.
- Form contact belum punya rate limit atau CAPTCHA.
- Gambar Lanyard/Gallery dimuat dengan `crossOrigin = 'anonymous'`; bucket Supabase publik sudah mengizinkan CORS.
- Lanyard dan Circular Gallery baru dimuat saat mendekati viewport (IntersectionObserver) agar halaman ringan.
