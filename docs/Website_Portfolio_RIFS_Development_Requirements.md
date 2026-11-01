# Website Portfolio RIFS — Development & Improvement Requirements

Dokumen ini berisi spesifikasi pengembangan dan perbaikan website portfolio RIFS. Gunakan dokumen ini sebagai acuan implementasi. Sebelum melakukan perubahan, periksa struktur project, teknologi yang digunakan, komponen yang sudah tersedia, serta alur data yang berjalan. Pertahankan pola arsitektur project yang ada dan hindari membuat implementasi duplikat.

## 1. Global Typography

Terapkan tipografi secara konsisten pada seluruh halaman website.

| Elemen | Font | Weight |
|---|---|---:|
| Heading | Space Grotesk | 600–700 |
| Body text | Inter | 400–500 |
| Button | Space Grotesk | 600 |
| Navigation | Inter | 500 |

**Ketentuan:**
- Pastikan font dimuat dengan benar dan digunakan melalui konfigurasi global.
- Gunakan hirarki ukuran teks yang konsisten.
- Pastikan keterbacaan tetap baik pada desktop, tablet, dan perangkat mobile.

## 2. Initial Loading Screen

Buat loading screen saat website pertama kali dibuka.

**Tampilan dan animasi:**
- Durasi pengalaman loading ditargetkan sekitar 3–5 detik, tetapi jangan menambahkan waktu tunggu buatan jika seluruh resource sudah siap lebih cepat.
- Tampilkan gambar `C:\laragon\www\Portfolio_RIFS\pict\madrid.png` di bagian atas progress bar.
- Gunakan opacity rendah pada gambar.
- Terapkan animasi fade-in dan fade-out secara halus, dengan efek flicker yang tidak berlebihan.
- Tampilkan progress bar dengan persentase dari 0% sampai 100%.

**Perilaku:**
- Progress harus merepresentasikan proses kesiapan resource atau tahapan loading yang benar, bukan sekadar angka animasi yang tidak berkaitan.
- Setelah resource penting siap dan progress mencapai 100%, tampilkan website dengan transisi yang halus.
- Hindari loading screen yang menghalangi pengguna terlalu lama.

## 3. Dynamic Island / Floating Pill Navbar

Perbarui navbar menjadi komponen berbentuk Dynamic Island atau floating pill.

**Kondisi navbar:**
- Saat halaman berada di posisi awal, tampilkan navbar dalam ukuran normal.
- Ketika pengguna melakukan scroll, navbar berubah menjadi compact floating pill.
- Pada tampilan compact, tampilkan identitas `RIFS` dengan warna biru dan status `Open to Work`.
- Tambahkan efek outer glow berwarna biru.
- Berikan warna biru pada teks menu yang sedang aktif berdasarkan section yang terlihat.

**Responsive:**
- Navbar harus menyesuaikan ukuran layar desktop, tablet, dan mobile.
- Pastikan menu tetap mudah digunakan pada layar kecil.
- Hindari elemen navbar bertumpuk atau keluar dari viewport.

**Language switcher:**
- Tambahkan pilihan bahasa Indonesia (`ID`) dan Inggris (`EN`).
- Seluruh konten website harus ikut berubah ketika bahasa diganti, termasuk navigasi, heading, deskripsi, tombol, label, dan konten dinamis dari database/API.
- Untuk konten yang dikelola melalui Admin Dashboard, sediakan data terjemahan ID dan EN jika kontennya memang perlu tampil dalam dua bahasa.
- Tentukan fallback yang konsisten apabila terjemahan suatu konten belum tersedia.

## 4. Hero Section Redesign

Perbarui teks utama dan background pada Hero Section.

### 4.1 Perubahan teks

Sesuaikan teks Hero Section sebagai berikut:

| Teks saat ini | Teks pengganti |
|---|---|
| `Fullstack` | `Muhammad Rifki` |
| `Developer` | `Ramadhani` |
| `Muhammad Rifki Ramadhani` | `Welcome to Website Portfolio` |

Pastikan ejaan menggunakan `Welcome`, bukan `Wellcome`.

### 4.2 Interactive Grid Background

- Gunakan prompt atau referensi yang tersedia pada:
  `C:\laragon\www\Portfolio_RIFS\docs\bghero.md`
- Buat background berbentuk grid interaktif.
- Ketika cursor mendekati suatu cell, cell tersebut menampilkan efek glow berwarna biru.
- Efek harus mengikuti pergerakan cursor dengan halus.
- Pada perangkat touchscreen, pastikan background tetap terlihat baik meskipun tidak ada interaksi hover.
- Batasi intensitas animasi agar tidak mengganggu teks utama dan performa website.

## 5. Services Section

Ubah tampilan Services Section agar hanya menggunakan satu foto.

**Ketentuan layout dan animasi:**
- Gunakan satu foto saja pada section ini.
- Posisikan foto di area tengah-kanan section.
- Foto harus memiliki tampilan seperti floating card.
- Saat transisi scroll dari Hero Section menuju Services Section, animasikan foto dengan efek seperti kartu yang berputar.
- Setelah animasi selesai, posisi akhir foto berada di area tengah-kanan.
- Pastikan transisi tetap halus dan tidak menyebabkan layout bergeser secara tiba-tiba.
- Pada layar kecil, sesuaikan ukuran dan posisi foto agar konten tetap terbaca.

## 6. About Me — Lanyard Card

Perbaiki masalah gambar pada komponen Lanyard Card di bagian About Me.

**Referensi implementasi:**
`C:\laragon\www\Portfolio_RIFS\docs\lanyard.md`

**Masalah saat ini:**
- Gambar yang dipilih atau diunggah melalui Admin Dashboard tidak tampil pada Lanyard Card.

**Hal yang perlu diperiksa:**
- Pastikan proses upload gambar dari Admin Dashboard berhasil.
- Pastikan path atau URL gambar disimpan dengan benar.
- Pastikan frontend menerima URL gambar yang valid.
- Periksa konfigurasi penyimpanan file dan akses publik.
- Periksa kemungkinan masalah pada format file, MIME type, CORS, atau konfigurasi asset.
- Tambahkan fallback apabila gambar belum tersedia atau gagal dimuat.

**Hasil yang diharapkan:**
- Gambar yang dikelola melalui Admin Dashboard dapat tampil pada Lanyard Card.
- Perubahan gambar dari Admin Dashboard tercermin pada website tanpa perlu mengubah kode secara manual.

## 7. Experiences — Animated Vertical Timeline

Ubah bagian Experiences menjadi timeline vertikal dengan animasi berdasarkan scroll.

### 7.1 Tampilan timeline

- Gunakan garis vertikal berwarna biru muda.
- Setiap pengalaman ditampilkan sebagai satu entry pada timeline.
- Setiap entry memuat:
  - Judul pengalaman atau posisi.
  - Deskripsi singkat.
  - Bulan dan tahun.
- Gunakan `madrid.png` sebagai gambar atau visual marker berbentuk lingkaran pada setiap titik timeline, sesuai desain yang ditentukan.

### 7.2 Animasi scroll

- Garis timeline memanjang ke bawah secara bertahap ketika pengguna melakukan scroll.
- Entry pengalaman muncul secara progresif ketika masuk ke area viewport.
- Gunakan animasi yang halus dan konsisten.
- Pastikan animasi tidak membuat konten sulit dibaca atau menghambat navigasi.

### 7.3 Empty state

Pada bagian akhir timeline, tampilkan teks:

- Bahasa Inggris: `Experience Coming Soon`
- Bahasa Indonesia: `Pengalaman Berikutnya Segera Hadir`

Teks harus mengikuti bahasa yang sedang dipilih pengguna.

### 7.4 Pengelolaan data

Jika Experiences sudah terhubung dengan Admin Dashboard, pastikan admin dapat mengelola data pengalaman yang ditampilkan. Minimal data yang diperlukan:
- Judul pengalaman.
- Deskripsi.
- Bulan dan tahun atau rentang tanggal.
- Urutan tampilan.
- Status tampil/sembunyi.

Jangan membuat sistem pengelolaan baru jika fitur serupa sudah tersedia.

## 8. Certifications — Image Rendering Fix

Perbaiki masalah gambar sertifikat yang saat ini hanya menampilkan area putih atau kosong.

**Hal yang perlu diperiksa:**
- URL atau path gambar sertifikat.
- Proses upload dan penyimpanan file.
- Konfigurasi akses publik pada storage.
- Format file dan MIME type.
- Komponen frontend yang menampilkan gambar.
- Penanganan loading dan error pada gambar.

**Hasil yang diharapkan:**
- Gambar sertifikat tampil dengan benar.
- Rasio gambar tetap proporsional dan tidak terdistorsi.
- Gambar tetap responsif pada berbagai ukuran layar.
- Tampilkan fallback yang layak apabila gambar tidak tersedia atau gagal dimuat.

Jika sertifikat dikelola melalui Admin Dashboard, pastikan admin dapat menambah, mengubah, dan menghapus data sertifikat beserta gambarnya sesuai kemampuan sistem yang sudah ada.

## 9. Admin Dashboard Requirements

Pastikan Admin Dashboard dapat mengelola konten yang dibutuhkan oleh perubahan website di atas.

### 9.1 General Settings
- Pengaturan konten atau konfigurasi global yang memang sudah didukung oleh sistem.
- Pengaturan bahasa default jika fitur tersebut tersedia.
- Pastikan perubahan konfigurasi tersimpan dan diterapkan pada frontend.

### 9.2 Hero Section
- Pengelolaan teks Hero Section yang memang bersifat dinamis.
- Jika teks mendukung dua bahasa, sediakan nilai ID dan EN.
- Jangan membuat field admin untuk teks yang seharusnya bersifat statis tanpa kebutuhan yang jelas.

### 9.3 About Me / Lanyard Card
- Admin dapat memilih atau mengunggah gambar untuk Lanyard Card.
- Admin dapat melihat preview gambar sebelum menyimpan perubahan.
- Pastikan gambar yang tersimpan dapat diakses oleh frontend.

### 9.4 Experiences
- Admin dapat menambah, mengubah, dan menghapus pengalaman jika CRUD belum tersedia.
- Admin dapat mengatur urutan pengalaman.
- Admin dapat mengatur status tampil/sembunyi.
- Sediakan field terjemahan ID dan EN untuk judul atau deskripsi apabila konten ditampilkan dalam dua bahasa.

### 9.5 Certifications
- Admin dapat menambah, mengubah, dan menghapus sertifikat jika fitur tersebut belum tersedia.
- Admin dapat mengunggah atau mengganti gambar sertifikat.
- Admin dapat melihat preview gambar.
- Admin dapat mengatur urutan tampilan jika diperlukan.

### 9.6 Media Handling
- Gunakan mekanisme upload dan storage yang konsisten dengan project saat ini.
- Validasi tipe file dan ukuran file.
- Tampilkan pesan error yang jelas jika upload gagal.
- Pastikan URL/path file yang disimpan dapat digunakan oleh frontend.
- Hindari menyimpan path lokal komputer developer sebagai URL asset website.

**Catatan:** Jangan menambahkan modul CRUD baru apabila fungsi yang sama sudah tersedia. Prioritaskan memperbaiki integrasi data dan tampilan yang sudah ada.

## 10. Technical & Quality Requirements

- Ikuti struktur folder dan arsitektur yang sudah digunakan project.
- Pisahkan komponen UI, logic, dan pengelolaan data sesuai pola project.
- Gunakan kembali komponen atau utility yang sudah tersedia.
- Hindari duplikasi kode dan konfigurasi.
- Pastikan seluruh section tetap responsif.
- Perhatikan performa animasi, terutama pada perangkat mobile.
- Sediakan loading state, error state, dan fallback untuk media yang gagal dimuat.
- Pastikan perubahan tidak merusak fitur website yang sudah berjalan.
- Uji pergantian bahasa pada seluruh section, termasuk konten dari database/API.
- Uji tampilan pada desktop, tablet, dan mobile.

## 11. Acceptance Criteria

Pekerjaan dapat dianggap selesai apabila:

- [ ] Font heading, body, button, dan navigation sudah sesuai spesifikasi.
- [ ] Loading screen menampilkan gambar dan progress bar dengan transisi yang halus.
- [ ] Loading screen tidak menambahkan waktu tunggu yang tidak diperlukan.
- [ ] Navbar berubah menjadi compact floating pill ketika halaman di-scroll.
- [ ] Status `RIFS` dan `Open to Work` tampil dengan benar pada navbar compact.
- [ ] Active navigation memiliki indikator warna biru.
- [ ] Language switcher ID/EN mengubah seluruh konten website.
- [ ] Teks Hero Section sudah diperbarui sesuai spesifikasi.
- [ ] Interactive grid memberikan efek blue glow saat cursor mendekati cell.
- [ ] Services Section hanya menggunakan satu foto dan memiliki animasi transisi kartu.
- [ ] Gambar Lanyard Card dapat ditampilkan dari data Admin Dashboard.
- [ ] Experiences tampil sebagai animated vertical timeline.
- [ ] Timeline menampilkan empty state sesuai bahasa yang dipilih.
- [ ] Gambar sertifikat tampil dengan benar dan responsif.
- [ ] Admin Dashboard dapat mengelola konten yang diperlukan tanpa membuat fitur duplikat.
- [ ] Seluruh perubahan telah diuji pada desktop, tablet, dan mobile.
- [ ] Fitur website yang sebelumnya berjalan tetap berfungsi.

## 12. Development Priority

Urutan pengerjaan yang disarankan:

1. **Audit project:** periksa struktur, stack, komponen, database, API, dan Admin Dashboard yang sudah ada.
2. **Fix media rendering:** perbaiki gambar Lanyard Card dan Certifications terlebih dahulu.
3. **Admin integration:** pastikan data dan media dari Admin Dashboard tersimpan serta terbaca dengan benar oleh frontend.
4. **Global UI:** terapkan typography dan language switcher.
5. **Navbar:** implementasikan Dynamic Island / Floating Pill dan active section state.
6. **Hero:** perbarui teks dan interactive grid background.
7. **Services:** implementasikan satu floating photo card dan scroll transition.
8. **Experiences:** implementasikan animated vertical timeline.
9. **QA:** lakukan pengujian responsivitas, bahasa, performa, dan regresi fitur.

---

## Developer Notes

- Jadikan dokumen ini sebagai spesifikasi, bukan alasan untuk mengganti keseluruhan arsitektur project.
- Audit implementasi saat ini sebelum mengubah atau menambahkan file.
- Jika fitur sudah tersedia, lakukan perbaikan pada fitur tersebut alih-alih membuat versi baru.
- Jangan mengasumsikan nama tabel, endpoint API, atau struktur folder sebelum memeriksa source code.
- Gunakan asset dan file referensi yang disebutkan di atas sesuai lokasi project.
- Jika ada detail yang belum jelas dari implementasi saat ini, dokumentasikan temuan dan pilih solusi yang paling konsisten dengan arsitektur yang sudah ada.
