-- Tahap 2: Experience menjadi timeline dengan tanggal terstruktur,
-- plus status tampil/sembunyi untuk sertifikat.
-- Jalankan sekali lewat Supabase SQL Editor (aman dijalankan ulang).

alter table experiences add column if not exists start_date date;
alter table experiences add column if not exists end_date date;
alter table experiences add column if not exists is_current boolean not null default false;
alter table experiences add column if not exists is_visible boolean not null default true;

-- Isi awal dari kolom lama `period` (contoh: "2022 - 2024", "2024 - Sekarang").
-- Hanya mengambil tahun; bulan diset Januari. Rapikan lagi lewat dashboard admin.
update experiences
set
  start_date = make_date((regexp_match(period, '(\d{4})'))[1]::int, 1, 1),
  is_current = period ~* '(sekarang|present|now|kini)',
  end_date = case
    when period ~* '(sekarang|present|now|kini)' then null
    when (regexp_match(period, '\d{4}\D+(\d{4})')) is not null
      then make_date((regexp_match(period, '\d{4}\D+(\d{4})'))[1]::int, 1, 1)
    else null
  end
where start_date is null and period ~ '\d{4}';

-- Kolom `period` tidak dipakai lagi oleh website, tetapi dibiarkan agar data lama tidak hilang.

-- Sertifikat: status tampil/sembunyi (published/unpublished) dari dashboard admin.
alter table certifications add column if not exists is_visible boolean not null default true;
