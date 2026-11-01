# Dokumentasi Alur dan Desain Website Portofolio (Versi Baru)

Dokumen ini menjelaskan alur halaman, desain visual, perilaku komponen, dan perubahan dashboard admin pada versi baru website portofolio. Source lengkap tiga komponen React Bits (Lanyard, FoldText, dan Circular Gallery) dicantumkan pada bagian Lampiran.

## Daftar Isi

1. Ringkasan Perubahan
2. Identitas Visual
3. Urutan Section dan Alur Halaman
4. Navbar
5. Hero Section
6. Kartu Foto Bergerak (Hero → Services)
7. Baris Tech Stack Berjalan
8. About Section: Kartu Lanyard
9. Certification Section: Circular Gallery
10. Rekap Foto dan Data Gambar
11. Pembaruan Dashboard Admin
12. Dependensi dan Catatan Teknis
13. Hal yang Masih Perlu Ditetapkan
14. Lampiran A: Source Lanyard
15. Lampiran B: Source FoldText
16. Lampiran C: Source Circular Gallery

---

## 1. Ringkasan Perubahan

| Area | Perubahan |
|---|---|
| Warna | Hitam gelap sebagai warna dasar, `#30BFBF` sebagai aksen pendukung |
| Urutan section | Hero, Services, About, Projects, Experience, Certification, Contact |
| Tech Stack | Tidak lagi menjadi section tersendiri; menjadi baris berjalan (marquee) yang memisahkan Services dan About, serta About dan Projects |
| Navbar | Logo profil dihapus; menu aktif diberi latar `#30BFBF` transparan |
| Hero | Efek typewriter pada teks role diganti komponen FoldText; ditambah tombol Download CV |
| Kartu foto bergerak | Hanya berpindah dari Hero ke Services |
| About | Memakai kartu Lanyard dengan dua foto (foto pertama saat muncul, foto kedua setelah diklik) |
| Certification | Dua kolom: teks sertifikat di kiri, gambar sertifikat dalam Circular Gallery di kanan |
| Dashboard admin | Diperbarui agar seluruh data baru dapat diisi dan diubah |

---

## 2. Identitas Visual

| Elemen | Nilai |
|---|---|
| Warna dasar (latar) | Hitam gelap (usulan `#0A0A0A`, dapat disesuaikan) |
| Warna aksen | `#30BFBF` |
| Teks utama | Putih atau abu sangat terang |
| Teks sekunder | Abu sedang |
| Penanda menu aktif | `#30BFBF` dengan opasitas rendah (usulan 12–18%) |
| Cahaya tombol (glow) | `#30BFBF` dengan opasitas rendah pada sisi tombol |
| Warna pada komponen 3D/WebGL | Disesuaikan dengan palet (contoh: `strapColor` gelap, `textColor` pada galeri putih atau abu terang) |

Catatan: `#30BFBF` secara teknis berada di antara biru dan hijau (cyan-teal). Istilah "biru tipis" pada rancangan diterjemahkan sebagai versi transparan dari warna ini, sehingga seluruh website memakai satu keluarga warna.

---

## 3. Urutan Section dan Alur Halaman

```
Navbar (tetap di atas)
1. Hero
2. Services
   ── Baris Tech Stack berjalan (kiri → kanan) ──
3. About
   ── Baris Tech Stack berjalan (kiri → kanan) ──
4. Projects
5. Experience
6. Certification
7. Contact
```

Section Tech Stack sebagai blok tersendiri tidak ada lagi. Isi section Services, Projects, Experience, dan Contact belum mengalami perubahan konten; perubahan yang berlaku hanya penerapan palet warna baru.

### Alur pengunjung

1. Pengunjung membuka halaman dan melihat Hero: nama, teks role yang terlipat terbuka (FoldText), tombol Download CV, dan kartu foto.
2. Pengunjung dapat menekan Download CV untuk mengunduh file PDF.
3. Saat menggulir ke bawah, kartu foto berpindah dari Hero ke Services dan berhenti di Services.
4. Di antara Services dan About, pengunjung melihat baris Tech Stack yang bergerak dari kiri ke kanan.
5. Di About, pengunjung melihat kartu Lanyard yang menggantung dan dapat ditarik atau dilempar. Klik pada kartu membalik kartu sehingga foto kedua tampil.
6. Baris Tech Stack kedua memisahkan About dan Projects.
7. Pengunjung melanjutkan ke Projects dan Experience.
8. Di Certification, pengunjung menggeser Circular Gallery di sisi kanan; teks di sisi kiri mengikuti sertifikat yang sedang berada di tengah galeri. Klik pada kartu membuka gambar sertifikat dalam ukuran penuh.
9. Pengunjung menutup halaman di Contact.
10. Sepanjang halaman, menu navbar yang sesuai dengan section aktif menyala dengan warna `#30BFBF` transparan.

---

## 4. Navbar

- Logo profil dihapus. Navbar hanya berisi menu navigasi.
- Daftar menu mengikuti urutan section: Home (Hero), Services, About, Projects, Experience, Certification, Contact.
- Menu yang sedang aktif diberi latar `#30BFBF` transparan (biru tipis) dengan teks yang lebih terang.
- Status aktif ditentukan oleh posisi gulir (scroll-spy). Saat pengunjung memasuki suatu section, menu yang sesuai ikut menyala.
- Klik pada menu menggulir halaman ke section terkait.

---

## 5. Hero Section

### 5.1 Teks role dengan FoldText

Efek typewriter diganti dengan komponen **FoldText** dari React Bits (varian JavaScript + CSS, dependensi `gsap`). Setiap huruf (atau kata/baris, sesuai pengaturan `splitBy`) terlipat pada satu sisi engsel lalu terbuka satu per satu.

Penerapan:

- Teks role dikelola dari dashboard admin dalam bentuk daftar.
- FoldText menerima satu string pada prop `text`. Untuk menampilkan beberapa role secara bergantian, dibutuhkan komponen pembungkus yang mengganti nilai `text` secara berkala. Berdasarkan source komponen, ketika `text` berubah, potongan teks dibangun ulang dan animasi terbuka diputar dari awal.
- Pilihan perilaku pergantian (ditetapkan saat implementasi):
  - `trigger="mount"` dengan pergantian `text` oleh pembungkus: role baru langsung terbuka, role lama hilang seketika.
  - `trigger="loop"`: teks terbuka, bertahan selama `loopDelay`, terlipat kembali, lalu diputar ulang. Pergantian `text` perlu disinkronkan dengan siklus ini.
- Usulan konfigurasi awal (mengikuti contoh penggunaan komponen, dapat diubah):

```jsx
<FoldText
  text={currentRole}
  foldStyle="paper"
  splitBy="char"
  hinge="top"
  trigger="mount"
  foldAngle={92}
  duration={0.65}
  stagger={0.045}
  staggerFrom="start"
  ease="power3.out"
  perspective={700}
  creaseShading={0.55}
  fontSize="clamp(1.5rem, 4vw, 2.5rem)"
  fontWeight={700}
  color="#30BFBF"
/>
```

- Opsi `foldStyle` yang tersedia: `paper`, `blinds`, dan `flip`. Opsi `hoverRefold` membuat huruf di dekat kursor terlipat sebagian lalu kembali terbuka.
- Pengguna dengan pengaturan `prefers-reduced-motion` mendapat versi yang disederhanakan (tanpa lipatan 3D), sudah ditangani di dalam komponen.

### 5.2 Tombol Download CV

- Bentuk persegi panjang dengan sudut membulat (rounded).
- Sisi tombol memiliki cahaya tipis berwarna `#30BFBF` (glow, misalnya melalui `box-shadow` atau border bercahaya).
- Saat diklik, tombol mengunduh dokumen PDF yang diunggah melalui dashboard admin.
- Jika belum ada file CV yang diunggah, tombol disembunyikan atau dinonaktifkan.

### 5.3 Kartu foto

- Pada Hero, kartu foto tampil dengan foto Hero. Perilaku geraknya dijelaskan pada bagian 6.

---

## 6. Kartu Foto Bergerak (Hero → Services)

- Kartu foto berpindah mengikuti gulir halaman dari Hero menuju Services, lalu berhenti di Services.
- Foto yang dipakai: foto Hero dan foto Services (dua foto terpisah).
- Pergerakan kartu tidak berlanjut ke About. Section About memakai komponen Lanyard (bagian 8).
- Mekanisme gerak kartu mengikuti implementasi yang sudah ada pada website; perubahan terletak pada daftar foto dan titik berhenti.
- Keterangan pada menu Photos di dashboard admin diubah dari "Hero → Services → About Me" menjadi "Hero → Services".

---

## 7. Baris Tech Stack Berjalan

- Terdapat dua baris: satu di antara Services dan About, satu lagi di antara About dan Projects.
- Arah gerak lurus dari kiri ke kanan, terus-menerus (looping).
- Isi baris berupa ikon atau logo teknologi beserta namanya.
- Data teknologi tetap dikelola dari dashboard admin. Satu sumber data dipakai oleh kedua baris.
- Baris berfungsi sebagai pemisah visual. Tinggi baris dibuat ramping sehingga tidak menyerupai section penuh.
- Untuk pengguna dengan `prefers-reduced-motion`, pergerakan dihentikan atau diperlambat.

---

## 8. About Section: Kartu Lanyard

Komponen: **Lanyard** dari React Bits (varian JavaScript + CSS, dependensi `three`). Source lengkap ada pada Lampiran A.

### Perilaku

- Kartu menggantung pada tali dan bergerak dengan simulasi fisika: dapat ditarik, diayunkan, dan dilempar oleh pengunjung.
- Saat kartu pertama kali muncul, sisi depan menampilkan **foto About pertama**.
- Saat pengunjung mengklik kartu, kartu berputar setengah putaran dan menampilkan **foto About kedua** (sisi belakang). Klik berikutnya memutar kartu kembali ke foto pertama.
- Klik dikenali jika tekan dan lepas terjadi dalam waktu singkat dengan pergeseran pointer kecil; geseran yang lebih jauh dianggap tarikan dan tidak membalik kartu.
- Sisi belakang memakai `backImage`. Jika `backImage` kosong, sisi belakang memakai `frontImage`, sehingga klik tidak mengubah tampilan foto. Karena itu kedua foto About wajib diisi.

### Pemetaan data

| Prop Lanyard | Sumber data |
|---|---|
| `frontImage` | Foto About pertama (dashboard: Photos) |
| `backImage` | Foto About kedua (dashboard: Photos) |
| `strapImage` | Gambar pada tali (opsional, dashboard: Photos) |

### Usulan pengaturan awal (dapat diubah)

```jsx
<div style={{ width: '100%', height: '600px' }}>
  <Lanyard
    frontImage={aboutPhotoFront}
    backImage={aboutPhotoBack}
    strapImage={strapImage}
    orientation="portrait"
    imageFit="cover"
    finish="glossy"
    cardColor="#0A0A0A"
    strapColor="#111111"
    metal="graphite"
    anchor="center"
  />
</div>
```

### Tata letak

- Kartu Lanyard berada di satu sisi, teks About di sisi lain.
- Wadah komponen harus memiliki tinggi yang jelas (contoh: 600px), karena komponen mengisi 100% tinggi wadah.
- Pada layar sempit, wadah dapat ditumpuk di atas atau di bawah teks dengan tinggi yang tetap terdefinisi.

---

## 9. Certification Section: Circular Gallery

Komponen: **CircularGallery** dari React Bits (varian JavaScript + CSS, tanpa dependensi tambahan). Source lengkap ada pada Lampiran C.

### Tata letak dua kolom

**Kolom kiri (teks)**

- Judul sertifikat
- Deskripsi singkat
- ID sertifikat
- Tautan keaslian sertifikat (verifikasi)

**Kolom kanan (visual)**

- Gambar sertifikat dalam Circular Gallery: kartu tersusun melengkung dan dapat digeser.

### Perilaku

- Teks di kolom kiri mengikuti sertifikat yang berada di posisi tengah galeri, memakai callback `onActiveChange(index)`.
- Galeri dapat digeser dengan drag, roda mouse, dan keyboard (panah, Home, End).
- Klik pada kartu membuka gambar sertifikat dalam ukuran penuh. Klik lagi, klik di luar kartu, tombol tutup, atau tombol Escape menutupnya.
- Prop `items` menerima objek berisi `image`, `text` (judul), `description`, dan `alt`. Data dari dashboard dipetakan sebagai berikut:

| Properti `items` | Sumber data |
|---|---|
| `image` | Gambar sertifikat |
| `text` | Judul sertifikat |
| `description` | Deskripsi singkat |
| `alt` | Teks alternatif untuk pembaca layar (judul sertifikat) |

### Usulan penerapan (dapat diubah)

```jsx
const [active, setActive] = useState(0);

<div className="certification-grid">
  <div className="certification-text">
    <h3>{certs[active].title}</h3>
    <p>{certs[active].description}</p>
    <p>ID: {certs[active].credentialId}</p>
    <a href={certs[active].verifyUrl} target="_blank" rel="noreferrer">
      Verifikasi sertifikat
    </a>
  </div>

  <div style={{ height: '600px', position: 'relative' }}>
    <CircularGallery
      items={certs.map(c => ({ image: c.imageUrl, text: c.title, description: c.description, alt: c.title }))}
      bend={3}
      textColor="#ffffff"
      borderRadius={0.05}
      scrollEase={0.05}
      showTitles={false}
      onActiveChange={setActive}
    />
  </div>
</div>
```

- `showTitles={false}` dipakai agar judul tidak tampil dua kali (di galeri dan di kolom kiri). Opsi ini dapat dibiarkan menyala bila diinginkan.
- Wadah galeri harus memiliki tinggi yang jelas dan `position: relative`.

---

## 10. Rekap Foto dan Data Gambar

| No | Foto | Dipakai pada | Perilaku |
|---|---|---|---|
| 1 | Foto Hero | Kartu foto di Hero | Bergerak dari Hero ke Services |
| 2 | Foto Services | Kartu foto di Services | Titik berhenti kartu bergerak |
| 3 | Foto About (pertama) | Lanyard, sisi depan | Tampil saat kartu pertama kali muncul |
| 4 | Foto About (kedua) | Lanyard, sisi belakang | Tampil setelah kartu diklik |
| 5 | Gambar tali (opsional) | Lanyard, `strapImage` | Tercetak sepanjang tali |
| 6 | Gambar sertifikat | Circular Gallery | Satu gambar per sertifikat |

Total foto profil yang diperlukan: empat (Hero, Services, About pertama, About kedua).

---

## 11. Pembaruan Dashboard Admin

| Menu dashboard | Perubahan |
|---|---|
| **Photos** | Keterangan diubah menjadi pergerakan Hero → Services. Isian foto: Hero, Services, About (pertama), About (kedua). Gambar tali Lanyard bersifat opsional. |
| **Hero** | Daftar teks role disesuaikan dengan FoldText. Ditambah unggah file CV (PDF) beserta fungsi ganti dan hapus file. |
| **Tech Stack** | Data tetap dipakai dan kini menjadi sumber baris berjalan. Tidak ada lagi tampilan section tersendiri. |
| **Certification** (baru atau diperbarui) | Isian: judul, deskripsi singkat, ID sertifikat, tautan keaslian, gambar sertifikat, urutan tampil. Mendukung tambah, ubah, dan hapus. |
| **Navbar / pengaturan umum** | Pengaturan logo profil dihapus bila ada. |
| **Urutan section** | Mengikuti urutan baru pada bagian 3. |

### Usulan struktur data

| Entitas | Field |
|---|---|
| Photos | `heroPhoto`, `servicesPhoto`, `aboutPhotoFront`, `aboutPhotoBack`, `lanyardStrapImage` (opsional) |
| Hero | `roles` (daftar teks), `cvFile` (PDF) |
| Certification | `title`, `description`, `credentialId`, `verifyUrl`, `imageUrl`, `order` |
| Tech Stack | Tetap seperti data yang sudah ada |

Nama field di atas berupa usulan dan dapat disesuaikan dengan skema database yang berjalan.

### Validasi unggahan

- CV: hanya tipe PDF, dengan batas ukuran file yang ditetapkan.
- Foto dan gambar sertifikat: tipe gambar (JPG, PNG, WebP), dengan batas ukuran file.

---

## 12. Dependensi dan Catatan Teknis

| Komponen | Dependensi | Keterangan |
|---|---|---|
| Lanyard | `three` | Menggunakan WebGL |
| FoldText | `gsap` | Plugin ScrollTrigger diimpor dari paket `gsap` |
| CircularGallery | Tidak ada | Menggunakan WebGL2 |

Perintah pemasangan:

```bash
npm install three gsap
```

Catatan teknis:

- **CORS gambar.** Lanyard dan Circular Gallery memuat gambar dengan `crossOrigin = 'anonymous'`. Jika gambar disimpan pada domain atau storage yang berbeda dari website, server penyimpanan harus mengizinkan akses lintas asal; jika tidak, gambar tidak tampil pada kartu.
- **WebGL.** Perangkat atau peramban yang tidak mendukung WebGL (Lanyard) atau WebGL2 (Circular Gallery) tidak menampilkan komponen. Perlu disiapkan tampilan cadangan berupa gambar statis.
- **Penangkapan gulir pada galeri.** Circular Gallery memanggil `preventDefault` pada kejadian roda mouse di dalam wadahnya. Selama kursor berada di atas galeri, roda mouse menggeser galeri, bukan menggulir halaman. Wadah galeri sebaiknya dibatasi pada kolom kanan sehingga pengunjung masih dapat menggulir halaman dari area lain.
- **Font galeri.** Nilai bawaan `font` memakai Figtree dan memuat stylesheet dari Google Fonts saat komponen dipasang. Font lain dapat diatur melalui `font` dan `fontUrl`.
- **Berhenti saat di luar layar.** Lanyard dan Circular Gallery menghentikan render ketika wadahnya berada di luar viewport.
- **Gerak berkurang.** Ketiga komponen membaca `prefers-reduced-motion` dan menyederhanakan animasi.
- **Direktif `'use client'`.** Baris ini berada di awal source ketiga komponen. Pada proyek tanpa Next.js, baris ini tidak berpengaruh.
- **Tinggi wadah.** Lanyard dan Circular Gallery mengisi 100% lebar dan tinggi wadah. Wadah tanpa tinggi yang jelas menghasilkan komponen yang tidak terlihat.

---

## 13. Hal yang Masih Perlu Ditetapkan

1. Nilai hex tepat untuk warna hitam gelap.
2. Cara pergantian role pada FoldText (bagian 5.1): `mount` dengan pergantian `text`, atau `loop`.
3. Nilai pengaturan akhir Lanyard (orientasi, finish, warna kartu, warna tali, logam).
4. Apakah `showTitles` pada Circular Gallery dimatikan.
5. Konten section Services, Projects, Experience, dan Contact: apakah ada perubahan selain warna.

---

# Lampiran

Lampiran berikut memuat usage, props, source komponen, dan CSS dari React Bits. Source disalin utuh dan tidak diubah.

---

## Lampiran A: Source Lanyard (React Bits)

- Komponen: Lanyard
- Varian: JavaScript + CSS
- Dependensi: `three`

### Contoh penggunaan

```jsx
import Lanyard from './Lanyard';

<div style={{ width: '100%', height: '600px' }}>
  <Lanyard frontImage="/card-front.png" backImage="/card-back.png" strapImage="/band.png" />
</div>
```

### Props

| Prop | Tipe | Nilai bawaan | Keterangan |
|---|---|---|---|
| frontImage | string | undefined | URL gambar pada sisi depan kartu. Ukuran dan rasio bebas. |
| backImage | string | undefined | URL gambar pada sisi belakang. Jika kosong memakai frontImage, lalu kartu kosong. |
| imageFit | 'cover' \| 'contain' | 'cover' | Cara gambar mengisi kartu. Cover mengisi penuh dan memotong; contain muat di dalam kartu pada warna kartu. |
| cardColor | string | '#ffffff' | Warna kartu, tampak saat tidak ada gambar dan di sekeliling gambar contain. |
| orientation | 'portrait' \| 'landscape' | 'portrait' | Kartu menggantung tegak atau melebar. |
| finish | 'glossy' \| 'matte' \| 'holographic' \| 'metallic' | 'glossy' | Permukaan kartu. Holographic menambah foil berkilau yang berubah warna saat kartu berputar; metallic memberi kilau sikat. |
| cornerRadius | number | 0.3 | Kebulatan sudut kartu, dari 0 (siku) sampai 1 (sangat bulat). |
| size | number | 0.6 | Tinggi kartu sebagai pecahan dari tinggi wadah. |
| anchor | 'left' \| 'center' \| 'right' | 'center' | Titik gantung tali pada tepi atas wadah. |
| strapLength | number | 0.5 | Jarak gantung kartu dari tepi atas, dari 0 (tali pendek) sampai 1 (tali panjang). |
| strapImage | string | undefined | URL gambar yang tercetak sepanjang tali. Gambar lebar diulang sepanjang tali, tingginya mengikuti lebar tali. |
| strapColor | string | '#111111' | Warna tali saat tidak ada gambar tali. |
| strapWidth | number | 0.65 | Lebar tali relatif terhadap bawaan, dari 0.4 sampai 2. |
| metal | 'graphite' \| 'silver' \| 'gold' | 'silver' | Finishing klip dan cincin penahan kartu. |
| gravity | number | 1 | Kekuatan tarik jatuh kartu. Nilai rendah membuat kartu melayang dan berayun pelan; 0 mematikan gravitasi. |
| damping | number | 0.5 | Kecepatan ayunan mereda, dari 0 (ayunan panjang) sampai 1 (cepat berhenti). |
| elasticity | number | 0.5 | Kekuatan tali menarik kartu kembali setelah ditarik dan dilepas. |
| breeze | number | 0.5 | Angin lembut yang berubah-ubah sehingga kartu tetap bergerak tanpa disentuh. |
| interactive | boolean | true | Mengizinkan pengunjung menarik, merentangkan, melempar, dan mengklik kartu untuk membaliknya. |
| intro | boolean | true | Saat dipasang, kartu jatuh dari samping dan berayun ke posisinya. |
| className | string | '' | Nama kelas tambahan untuk elemen akar. |
| style | CSSProperties | - | Gaya inline untuk elemen akar. |

### Source komponen (`Lanyard.jsx`)

```jsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import './Lanyard.css';

const CARD_SIZES = {
  portrait: [1.6, 2.25],
  landscape: [2.25, 1.6]
};
const ANCHORS = { left: 0.27, center: 0.5, right: 0.73 };
const THICKNESS = 0.018;
const BEVEL = 0.007;
const JOINTS = 4;
const NODE_WEIGHT = 1 / 0.05;
const MAX_STEP = 1 / 960;
const ITERATIONS = 2;
const SAMPLES = 72;
const FOV = 24;
const STRAP_WIDTH = 0.36;
const RING_RADIUS = 0.095;
const RING_TUBE = 0.0135;
const EYELET_RADIUS = 0.036;
const CLAMP_BODY = 0.15;
const FACE_WIDTH = 1024;

const FINISHES = {
  glossy: { roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, foil: 0, anisotropy: 0 },
  matte: { roughness: 0.85, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.6, foil: 0, anisotropy: 0 },
  holographic: { roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, foil: 1, anisotropy: 0 },
  metallic: { roughness: 0.36, metalness: 0.75, clearcoat: 0.5, clearcoatRoughness: 0.18, foil: 0, anisotropy: 0.7 }
};

const BAND_COLUMNS = [0, 0.07, 0.93, 1];
const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];
const FLIP_SPIN = 9;

const FOIL_VERTEX_HEAD = `
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;
`;

const FOIL_VERTEX_BODY = `
vFoilUv = uv;
vFoilX = normalize((modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
vFoilY = normalize((modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
`;

const FOIL_FRAGMENT_HEAD = `
uniform float foilStrength;
uniform float foilAspect;
uniform vec3 foilKey;
uniform vec3 foilFill;
uniform vec3 foilTop;
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;

float foilHash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float foilBump(float t, float center, float width) {
  float x = (t - center) / width;
  return max(0.0, 1.0 - x * x);
}

vec3 foilSpectrum(float t) {
  return vec3(
    foilBump(t, 0.82, 0.32) + 0.4 * foilBump(t, 0.02, 0.12),
    foilBump(t, 0.5, 0.26),
    foilBump(t, 0.18, 0.24)
  );
}

vec3 foilGrating(float u, float spacing) {
  vec3 color = vec3(0.0);
  for (int m = 1; m <= 2; m++) {
    float order = float(m);
    float t = (spacing * abs(u) / order - 0.38) / 0.32;
    color += foilSpectrum(t) / order;
  }
  return color;
}

vec3 foilShard(vec2 p) {
  vec2 base = floor(p);
  float best = 9.0;
  float edge = 9.0;
  vec2 id = base;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      vec2 site = cell + vec2(foilHash(cell), foilHash(cell + 7.31)) * 0.9 + 0.05;
      float d = length(site - p);
      if (d < best) {
        edge = best;
        best = d;
        id = cell;
      } else if (d < edge) {
        edge = d;
      }
    }
  }
  return vec3(foilHash(id + 3.17), foilHash(id + 11.73), edge - best);
}
`;

const FOIL_FRAGMENT_BODY = `
if (foilStrength > 0.0) {
  vec3 foilView = normalize(vViewPosition);
  vec3 foilNormal = normalize(normal);
  vec2 foilP = vec2(vFoilUv.x, vFoilUv.y * foilAspect);
  vec3 shard = foilShard(foilP * 26.0);
  vec2 ray = foilP - vec2(-1.6, 2.6 * foilAspect);
  float angle = atan(ray.y, ray.x) + (shard.x - 0.5) * 0.16;
  vec3 grating = normalize(vFoilX * cos(angle) + vFoilY * sin(angle));
  float spacing = 1.7 * (0.95 + shard.y * 0.1);
  vec3 rainbow = foilGrating(dot(foilKey + foilView, grating), spacing);
  rainbow += 0.6 * foilGrating(dot(foilTop + foilView, grating), spacing);
  rainbow *= 0.8 + 0.2 * smoothstep(0.0, 0.04, shard.z);
  rainbow = max(rainbow - 0.35 * min(rainbow.r, min(rainbow.g, rainbow.b)), 0.0);
  vec2 grid = foilP * 64.0;
  vec2 cell = floor(grid);
  vec2 jitter = vec2(foilHash(cell + 1.7), foilHash(cell + 9.2));
  float flake = smoothstep(0.32, 0.06, length(fract(grid) - jitter * 0.6 - 0.2)) * step(0.45, foilHash(cell + 4.4));
  vec3 facet = normalize(foilNormal + (vFoilX * (jitter.x - 0.5) + vFoilY * (jitter.y - 0.5)) * 0.8);
  float glint = pow(max(dot(reflect(-foilKey, facet), foilView), 0.0), 28.0);
  glint += 0.7 * pow(max(dot(reflect(-foilTop, facet), foilView), 0.0), 28.0);
  float fine = 1.0 - smoothstep(0.35, 0.9, max(fwidth(grid.x), fwidth(grid.y)));
  vec3 sparkle = flake * glint * fine * (vec3(0.7) + foilGrating(dot(foilKey + foilView, grating) + jitter.x * 0.4, spacing));
  float ink = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float foil = foilStrength * (0.08 + 0.92 * smoothstep(0.04, 0.7, ink));
  float facing = clamp(dot(foilNormal, foilView), 0.0, 1.0);
  float tint = clamp(dot(rainbow, vec3(0.4)), 0.0, 1.0);
  outgoingLight = outgoingLight * (1.0 - foil * (0.3 + 0.32 * tint)) + (rainbow * 0.62 * (0.4 + 0.6 * facing) + sparkle * 1.6) * foil;
}
`;

const METALS = {
  silver: { color: '#d9dce2', roughness: 0.16 },
  gold: { color: '#e4b965', roughness: 0.2 },
  graphite: { color: '#4d4f55', roughness: 0.28 }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a + (b - a) * t;

const parseColor = (value, fallback) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = value;
    const resolved = ctx.fillStyle;
    if (resolved.startsWith('#')) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
  } catch {
    return fallback;
  }
};

const luminance = rgb => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
const toCss = (rgb, alpha = 1) =>
  `rgba(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)}, ${alpha})`;

const seeded = start => {
  let state = start >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const traceRoundedRect = (path, x, y, width, height, radius) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const k = r * 0.4477;
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
  path.lineTo(x + width, y + height - r);
  path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
  path.lineTo(x + r, y + height);
  path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
  path.lineTo(x, y + r);
  path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
};

const loadImage = (cache, url) => {
  if (!url) return Promise.resolve(null);
  const cached = cache.get(url);
  if (cached) return cached;
  const promise = new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
  cache.set(url, promise);
  return promise;
};

const cardLayout = (orientation, cornerRadius) => {
  const [width, height] = CARD_SIZES[orientation] || CARD_SIZES.portrait;
  const radius = mix(0.03, Math.min(width, height) * 0.2, clamp(cornerRadius, 0, 1));
  const slot = { width: 0.34, height: 0.07, y: height / 2 - 0.13 };
  const ringY = height / 2 - 0.055;
  return { width, height, radius, slot, ringY, hangY: ringY + RING_RADIUS };
};

const buildCardGeometry = layout => {
  const { width, height, radius, slot } = layout;
  const outline = new THREE.Shape();
  traceRoundedRect(
    outline,
    -width / 2 + BEVEL,
    -height / 2 + BEVEL,
    width - BEVEL * 2,
    height - BEVEL * 2,
    Math.max(radius - BEVEL, 0.005)
  );
  const hole = new THREE.Path();
  traceRoundedRect(
    hole,
    -slot.width / 2 - BEVEL,
    slot.y - slot.height / 2 - BEVEL,
    slot.width + BEVEL * 2,
    slot.height + BEVEL * 2,
    slot.height / 2 + BEVEL
  );
  outline.holes.push(hole);
  const body = new THREE.ExtrudeGeometry(outline, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 5,
    curveSegments: 24
  });
  body.translate(0, 0, -THICKNESS / 2);
  const face = new THREE.ShapeGeometry(outline, 24);
  const position = face.getAttribute('position');
  const uv = face.getAttribute('uv');
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
  }
  uv.needsUpdate = true;
  return { body, face };
};

const buildClampGeometry = width => {
  const shape = new THREE.Shape();
  const w = width * 1.16;
  traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 6,
    curveSegments: 10
  });
  geometry.translate(0, 0, -0.01);
  return geometry;
};

const buildBandGeometry = count => {
  const columns = BAND_COLUMNS.length;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * columns * 2), 2));
  const index = [];
  for (let i = 0; i < count - 1; i++) {
    for (let c = 0; c < columns - 1; c++) {
      const a = i * columns + c;
      index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
    }
  }
  geometry.setIndex(index);
  return geometry;
};

const buildEnvironment = renderer => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0.035, 0.035, 0.04);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials = [];
  const panel = (intensity, position, scale, rotation = 0) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(intensity, intensity, intensity),
      side: THREE.DoubleSide
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(scale[0], scale[1], 1);
    mesh.lookAt(0, 0, 0);
    mesh.rotateZ(rotation);
    scene.add(mesh);
  };
  panel(2.6, [0, 4.5, 8], [9, 4]);
  panel(6, [-5.5, 0.5, 7], [0.9, 14]);
  panel(4, [5, -0.5, 8], [0.6, 14]);
  panel(3.5, [0, -1, 9], [24, 0.35], Math.PI / 3);
  panel(2.5, [1, 2.5, 9], [24, 0.2], Math.PI / 3);
  panel(1.4, [0, 6, -6], [12, 4]);
  panel(0.5, [0, -7, 1], [16, 6]);
  panel(0.9, [8, 0, -2], [4, 10]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  geometry.dispose();
  materials.forEach(material => material.dispose());
  return target;
};

const makeCanvasTexture = (canvas, anisotropy) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
};

const buildGrainTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const random = seeded(7);
  const field = Float32Array.from({ length: size * size }, () => random());
  const height = (x, y) => {
    let sum = 0;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) sum += field[((y + j + size) % size) * size + ((x + i + size) % size)];
    }
    return (sum / 9) * 1.6;
  };
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = height((x - 1 + size) % size, y) - height((x + 1) % size, y);
      const ny = height(x, (y - 1 + size) % size) - height(x, (y + 1) % size);
      const length = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      image.data[i] = ((nx / length) * 0.5 + 0.5) * 255;
      image.data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      image.data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 7);
  return texture;
};

const buildWeaveTexture = () => {
  const size = 128;
  const threads = 8;
  const random = seeded(19);
  const fiber = Float32Array.from({ length: size * size }, () => random());
  const profile = f => Math.sqrt(Math.max(0, 1 - 4 * f * f));
  const height = (x, y) => {
    const px = ((x % size) + size) % size;
    const py = ((y % size) + size) % size;
    const u = (px / size) * threads;
    const v = (py / size) * threads;
    const cu = Math.floor(u);
    const cv = Math.floor(v);
    const fu = u - cu - 0.5;
    const fv = v - cv - 0.5;
    const lift = (cu + cv) % 2 === 0;
    const warp = profile(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (lift ? 1 : 0.6)));
    const weft = profile(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (lift ? 0.6 : 1)));
    return (lift ? Math.max(warp, weft * 0.7) : Math.max(weft, warp * 0.7)) + fiber[py * size + px] * 0.08;
  };
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (height(x - 1, y) - height(x + 1, y)) * 1.6;
      const ny = (height(x, y - 1) - height(x, y + 1)) * 1.6;
      const length = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      data[i] = ((nx / length) * 0.5 + 0.5) * 255;
      data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
};

const drawFitted = (ctx, image, width, height, fit) => {
  const scale = (fit === 'contain' ? Math.min : Math.max)(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
};

const paintFace = (canvas, image, color, fit) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = toCss(color);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (image) drawFitted(ctx, image, canvas.width, canvas.height, fit);
};

const paintStrap = (canvas, image, color) => {
  const across = 192;
  const along = image ? Math.max(64, Math.round((image.width / image.height) * across)) : across * 2;
  canvas.width = across;
  canvas.height = along;
  const ctx = canvas.getContext('2d');
  if (!ctx) return along / across;
  ctx.fillStyle = toCss(color);
  ctx.fillRect(0, 0, across, along);
  if (image) {
    ctx.save();
    ctx.translate(across, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, 0, 0, along, across);
    ctx.restore();
    return along / across;
  }
  const ink = luminance(color) > 0.5 ? [0, 0, 0] : [1, 1, 1];
  ctx.fillStyle = toCss(ink, 0.05);
  for (let y = 0; y < along; y += 4) ctx.fillRect(0, y, across, 1);
  ctx.fillStyle = toCss(ink, 0.2);
  for (let y = 0; y < along; y += 14) {
    ctx.fillRect(across * 0.075, y, 2, 8);
    ctx.fillRect(across * 0.925 - 2, y, 2, 8);
  }
  return along / across;
};

const createSimulation = () => {
  const vectors = () => Array.from({ length: JOINTS + 1 }, () => new THREE.Vector3());
  return {
    nodes: vectors(),
    previous: vectors(),
    velocities: vectors(),
    lengths: new Float64Array(JOINTS),
    impulses: new Float64Array(JOINTS),
    rest: 1,
    anchor: new THREE.Vector3(),
    body: {
      position: new THREE.Vector3(),
      previous: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      previousQuaternion: new THREE.Quaternion(),
      angular: new THREE.Vector3(),
      mass: 1,
      inverseInertia: new THREE.Vector3(1, 1, 1),
      hang: new THREE.Vector3()
    },
    grab: null,
    turn: 0,
    twist: 0,
    twistRaw: 0,
    calm: 0
  };
};

const scratch = {
  a: new THREE.Vector3(),
  b: new THREE.Vector3(),
  c: new THREE.Vector3(),
  d: new THREE.Vector3(),
  e: new THREE.Vector3(),
  f: new THREE.Vector3(),
  g: new THREE.Vector3(),
  pin: new THREE.Vector3(),
  q: new THREE.Quaternion(),
  r: new THREE.Quaternion()
};

const applyInverseInertia = (body, vector, out) => {
  scratch.r.copy(body.quaternion).invert();
  out.copy(vector).applyQuaternion(scratch.r);
  out.set(out.x * body.inverseInertia.x, out.y * body.inverseInertia.y, out.z * body.inverseInertia.z);
  return out.applyQuaternion(body.quaternion);
};

const rotateBody = (q, w) => {
  const { x: qx, y: qy, z: qz, w: qw } = q;
  q.x += 0.5 * (w.x * qw + w.y * qz - w.z * qy);
  q.y += 0.5 * (w.y * qw + w.z * qx - w.x * qz);
  q.z += 0.5 * (w.z * qw + w.x * qy - w.y * qx);
  q.w += 0.5 * (-w.x * qx - w.y * qy - w.z * qz);
  q.normalize();
};

const bodyWeight = (body, r, normal) => {
  const rn = scratch.c.crossVectors(r, normal);
  return 1 / body.mass + rn.dot(applyInverseInertia(body, rn, scratch.d));
};

const pushBody = (body, r, impulse) => {
  body.position.addScaledVector(impulse, 1 / body.mass);
  rotateBody(body.quaternion, applyInverseInertia(body, scratch.e.crossVectors(r, impulse), scratch.f));
};

const solveSegment = (sim, i, h, physics) => {
  const { nodes, body } = sim;
  const a = nodes[i];
  const wa = i === 0 ? 0 : NODE_WEIGHT;
  const last = i === JOINTS - 1;
  const r = scratch.g;
  let b = nodes[i + 1];
  if (last) {
    r.copy(body.hang).applyQuaternion(body.quaternion);
    b = scratch.b.copy(body.position).add(r);
  }
  const delta = scratch.a.subVectors(b, a);
  const length = delta.length();
  const stretch = length - sim.rest;
  if (stretch <= 0 || length < 1e-9) return;
  const normal = delta.divideScalar(length);
  const wb = last ? bodyWeight(body, r, normal) : NODE_WEIGHT;
  const rate = (length - sim.lengths[i]) / h;
  const tension =
    physics.hold * Math.tanh((physics.stiffness * stretch) / physics.hold) +
    physics.spring * stretch +
    physics.bandDamping * Math.max(0, rate);
  const room = tension * h * h - sim.impulses[i];
  if (room <= 0) return;
  const lambda = Math.min(stretch / (wa + wb), room);
  sim.impulses[i] += lambda;
  if (wa) a.addScaledVector(normal, lambda * wa);
  if (last) pushBody(body, r, normal.multiplyScalar(-lambda));
  else b.addScaledVector(normal, -lambda * wb);
};

const solvePin = (body, grab, target) => {
  const r = scratch.g.copy(grab.local).applyQuaternion(body.quaternion);
  const delta = scratch.a.copy(target).sub(body.position).sub(r);
  const distance = delta.length();
  if (distance < 1e-9) return;
  const normal = delta.divideScalar(distance);
  const lambda = distance / bodyWeight(body, r, normal);
  pushBody(body, r, normal.multiplyScalar(lambda));
};

const placeHanging = (sim, layout, intro) => {
  const { nodes, previous, velocities, body, anchor } = sim;
  nodes[0].copy(anchor);
  for (let i = 1; i <= JOINTS; i++) {
    nodes[i].copy(nodes[i - 1]);
    if (intro) nodes[i].x += sim.rest;
    else nodes[i].y -= sim.rest;
  }
  body.quaternion.identity();
  if (intro) body.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  body.hang.set(0, layout.hangY, 0);
  const offset = scratch.a.copy(body.hang).applyQuaternion(body.quaternion);
  body.position.copy(nodes[JOINTS]).sub(offset);
  body.previous.copy(body.position);
  body.previousQuaternion.copy(body.quaternion);
  body.velocity.set(0, 0, 0);
  body.angular.set(0, 0, 0);
  for (let i = 0; i <= JOINTS; i++) {
    previous[i].copy(nodes[i]);
    velocities[i].set(0, 0, 0);
  }
  sim.lengths.fill(sim.rest);
  sim.turn = 0;
  sim.twist = 0;
  sim.twistRaw = 0;
  sim.calm = 0;
};

const configureSimulation = (sim, layout, length) => {
  sim.rest = length / JOINTS;
  const { width, height } = layout;
  const body = sim.body;
  const t = THICKNESS + BEVEL * 2;
  body.mass = 1;
  body.inverseInertia.set(
    12 / (height * height + t * t),
    12 / (width * width + t * t),
    12 / (width * width + height * height)
  );
  body.hang.set(0, layout.hangY, 0);
};

const stepSimulation = (sim, dt, physics, time) => {
  const steps = Math.max(1, Math.ceil(dt / MAX_STEP - 1e-6));
  const h = dt / steps;
  const { nodes, previous, velocities, body } = sim;
  const windX = physics.breeze * (Math.sin(time * 0.53) * 0.7 + Math.sin(time * 1.31 + 1.7) * 0.3) * 3;
  const windZ = physics.breeze * Math.sin(time * 0.37 + 0.6) * 2;
  const grab = sim.grab;
  const pin = scratch.pin;
  const nodeDrag = Math.exp(-physics.nodeDrag * h);
  const linearDrag = Math.exp(-physics.linearDrag * h);
  const angularDrag = Math.exp(-physics.angularDrag * h);

  for (let s = 0; s < steps; s++) {
    for (let i = 1; i < JOINTS; i++) {
      const v = velocities[i];
      v.y -= physics.gravity * h;
      v.x += windX * h;
      v.z += windZ * h;
      previous[i].copy(nodes[i]);
      nodes[i].addScaledVector(v, h);
    }

    body.previous.copy(body.position);
    body.previousQuaternion.copy(body.quaternion);
    const q = body.quaternion;
    if (grab) {
      const turn = scratch.q.copy(grab.rotation).multiply(scratch.r.copy(q).invert());
      if (turn.w < 0) turn.set(-turn.x, -turn.y, -turn.z, -turn.w);
      const torque = scratch.a.set(turn.x, turn.y, turn.z).multiplyScalar(2 * physics.grip);
      torque.addScaledVector(body.angular, -physics.gripDamping);
      body.angular.addScaledVector(applyInverseInertia(body, torque, scratch.b), h);
    }
    const up = scratch.a.set(0, 1, 0).applyQuaternion(q);
    const front = scratch.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z);
    if (front.lengthSq() > 1e-3) {
      const facing = scratch.d.set(0, 0, 1).applyQuaternion(q);
      const raw = Math.atan2(scratch.e.crossVectors(front, facing).dot(up), front.dot(facing));
      let turned = raw - sim.twistRaw;
      if (turned > Math.PI) turned -= Math.PI * 2;
      else if (turned < -Math.PI) turned += Math.PI * 2;
      sim.twist += turned;
      sim.twistRaw = raw;
    }
    if (!grab) {
      const spin = body.angular.dot(up);
      body.angular.addScaledVector(up, (physics.twist * (sim.turn - sim.twist) - physics.twistDamping * spin) * h);
    }
    body.velocity.y -= physics.gravity * h;
    body.velocity.x += windX * 0.35 * h;
    body.velocity.z += windZ * 0.35 * h;
    body.position.addScaledVector(body.velocity, h);
    rotateBody(body.quaternion, scratch.f.copy(body.angular).multiplyScalar(h));

    sim.impulses.fill(0);
    if (grab) pin.lerpVectors(grab.from, grab.target, (s + 1) / steps);
    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
      for (let i = 0; i < JOINTS; i++) solveSegment(sim, i, h, physics);
      if (grab) solvePin(body, grab, pin);
    }

    for (let i = 1; i < JOINTS; i++) {
      const v = velocities[i].subVectors(nodes[i], previous[i]).divideScalar(h).multiplyScalar(nodeDrag);
      v.multiplyScalar(1 / (1 + physics.nodeAir * v.length() * h));
    }
    body.velocity.subVectors(body.position, body.previous).divideScalar(h);
    const dq = scratch.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion);
    body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1));

    const normal = scratch.a.set(0, 0, 1).applyQuaternion(body.quaternion);
    const across = body.velocity.dot(normal);
    const along = scratch.b.copy(body.velocity).addScaledVector(normal, -across);
    along.multiplyScalar(1 / (1 + physics.air * along.length() * h));
    body.velocity
      .copy(along)
      .addScaledVector(normal, across / (1 + physics.broadside * Math.abs(across) * h))
      .multiplyScalar(linearDrag);
    body.angular.multiplyScalar(angularDrag / (1 + physics.spinAir * body.angular.length() * h));
    if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60);
    if (body.angular.lengthSq() > 1600) body.angular.setLength(40);

    nodes[JOINTS].copy(body.hang).applyQuaternion(body.quaternion).add(body.position);
    for (let i = 0; i < JOINTS; i++) sim.lengths[i] = nodes[i].distanceTo(nodes[i + 1]);
  }

  if (grab) grab.from.copy(grab.target);

  let energy = body.velocity.lengthSq() + body.angular.lengthSq() * 0.3;
  for (let i = 1; i < JOINTS; i++) energy += velocities[i].lengthSq() * 0.05;
  sim.calm = energy < 2e-4 ? sim.calm + dt : 0;
};

const Lanyard = ({
  frontImage,
  backImage,
  imageFit = 'cover',
  cardColor = '#ffffff',
  orientation = 'portrait',
  finish = 'glossy',
  cornerRadius = 0.3,
  size = 0.6,
  anchor = 'center',
  strapLength = 0.5,
  strapImage,
  strapColor = '#111111',
  strapWidth = 0.65,
  metal = 'silver',
  gravity = 1,
  damping = 0.5,
  elasticity = 0.5,
  breeze = 0.5,
  interactive = true,
  intro = true,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const applyRef = useRef(null);

  settingsRef.current = {
    frontImage,
    backImage,
    imageFit: imageFit === 'contain' ? 'contain' : 'cover',
    cardColor,
    orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
    finish,
    cornerRadius,
    size,
    anchor,
    strapLength,
    strapImage,
    strapColor,
    strapWidth,
    metal,
    gravity,
    damping,
    elasticity,
    breeze,
    interactive,
    intro
  };

  useEffect(() => {
    applyRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    const canvas = renderer.domElement;
    canvas.className = 'lanyard-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const scene = new THREE.Scene();
    const environment = buildEnvironment(renderer);
    scene.environment = environment.texture;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-2.5, 4, 6);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(3, -1, 4);
    scene.add(keyLight, fillLight);

    const imageCache = new Map();
    const images = { front: null, back: null, strap: null };
    const frontCanvas = document.createElement('canvas');
    const backCanvas = document.createElement('canvas');
    const strapCanvas = document.createElement('canvas');
    const frontTexture = makeCanvasTexture(frontCanvas, anisotropy);
    const backTexture = makeCanvasTexture(backCanvas, anisotropy);
    const strapTexture = makeCanvasTexture(strapCanvas, anisotropy);
    strapTexture.wrapS = THREE.ClampToEdgeWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    const grain = buildGrainTexture();
    const weave = buildWeaveTexture();
    const foilUniforms = {
      foilStrength: { value: 0 },
      foilAspect: { value: 1.4 },
      foilKey: { value: new THREE.Vector3() },
      foilFill: { value: new THREE.Vector3() },
      foilTop: { value: new THREE.Vector3() }
    };
    const injectFoil = shader => {
      Object.assign(shader.uniforms, foilUniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${FOIL_VERTEX_HEAD}`)
        .replace('#include <project_vertex>', `#include <project_vertex>\n${FOIL_VERTEX_BODY}`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${FOIL_FRAGMENT_HEAD}`)
        .replace('#include <opaque_fragment>', `${FOIL_FRAGMENT_BODY}\n#include <opaque_fragment>`);
    };

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.06, 0.06)
    });
    frontMaterial.onBeforeCompile = injectFoil;
    backMaterial.onBeforeCompile = injectFoil;
    const edgeMaterial = new THREE.MeshPhysicalMaterial();
    const metalMaterial = new THREE.MeshStandardMaterial({ metalness: 1 });
    const bandMaterial = new THREE.MeshPhysicalMaterial({
      map: strapTexture,
      normalMap: weave,
      normalScale: new THREE.Vector2(0.7, 0.7),
      roughness: 0.68,
      sheen: 1,
      sheenRoughness: 0.42,
      sheenColor: new THREE.Color(0.32, 0.32, 0.34),
      side: THREE.DoubleSide
    });

    const cardGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(undefined, edgeMaterial);
    const frontMesh = new THREE.Mesh(undefined, frontMaterial);
    const backMesh = new THREE.Mesh(undefined, backMaterial);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 18, 72), metalMaterial);
    ring.rotation.y = Math.PI / 2 - 0.7;
    cardGroup.add(bodyMesh, frontMesh, backMesh, ring);
    scene.add(cardGroup);

    const bandGeometry = buildBandGeometry(SAMPLES);
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.frustumCulled = false;
    scene.add(band);

    const clampGroup = new THREE.Group();
    const clampMesh = new THREE.Mesh(buildClampGeometry(STRAP_WIDTH), metalMaterial);
    clampMesh.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
    const eyelet = new THREE.Mesh(new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 14, 40), metalMaterial);
    clampGroup.add(clampMesh, eyelet);
    scene.add(clampGroup);

    const sim = createSimulation();
    const controls = [];
    const mouth = new THREE.Vector3();
    const tuck = new THREE.Vector3();
    const curve = new THREE.CatmullRomCurve3(controls, false, 'centripetal');
    const view = { width: 1, height: 1 };
    let layout = cardLayout('portrait', 0.3);
    let applied = {};
    let strapScale = STRAP_WIDTH;
    let tileRatio = 2;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let visible = true;
    let alive = true;
    let placed = false;
    let hovering = false;
    let press = null;
    let imageToken = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const paintFaces = () => {
      const s = settingsRef.current;
      const color = parseColor(s.cardColor, [1, 1, 1]);
      const width = FACE_WIDTH;
      const height = Math.round((FACE_WIDTH * layout.height) / layout.width);
      if (frontCanvas.width !== width || frontCanvas.height !== height) {
        frontCanvas.width = width;
        frontCanvas.height = height;
        backCanvas.width = width;
        backCanvas.height = height;
        frontTexture.dispose();
        backTexture.dispose();
      }
      paintFace(frontCanvas, images.front, color, s.imageFit);
      paintFace(backCanvas, images.back || images.front, color, s.imageFit);
      frontTexture.needsUpdate = true;
      backTexture.needsUpdate = true;
      start();
    };

    const repaintStrap = () => {
      const s = settingsRef.current;
      tileRatio = paintStrap(strapCanvas, images.strap, parseColor(s.strapColor, [0.07, 0.07, 0.07]));
      weave.repeat.set(2, 2 * tileRatio);
      strapTexture.dispose();
      strapTexture.needsUpdate = true;
      start();
    };

    const frameView = () => {
      const s = settingsRef.current;
      const aspect = view.width / view.height;
      let viewHeight = layout.height / clamp(s.size, 0.15, 0.9);
      const minimumWidth = layout.width / 0.72;
      if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
      const viewWidth = viewHeight * aspect;
      camera.aspect = aspect;
      camera.position.set(0, 0, viewHeight / 2 / Math.tan((FOV * Math.PI) / 360));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      foilUniforms.foilKey.value.set(-2.5, 4, 6).normalize().transformDirection(camera.matrixWorldInverse);
      foilUniforms.foilFill.value.set(3, -1, 4).normalize().transformDirection(camera.matrixWorldInverse);
      foilUniforms.foilTop.value.set(0.5, 4.5, 8).normalize().transformDirection(camera.matrixWorldInverse);
      const anchorX = ((ANCHORS[s.anchor] ?? 0.5) - 0.5) * viewWidth;
      const anchorY = viewHeight / 2 + 0.2;
      const cardTop = viewHeight / 2 - viewHeight * mix(0.12, 0.42, clamp(s.strapLength, 0, 1));
      const hangTop = cardTop + (layout.hangY - layout.height / 2);
      sim.anchor.set(anchorX, anchorY, 0);
      configureSimulation(sim, layout, anchorY - hangTop);
      sim.nodes[0].copy(sim.anchor);
      sim.previous[0].copy(sim.anchor);
    };

    const apply = () => {
      const s = settingsRef.current;
      const layoutKey = `${s.orientation}|${s.cornerRadius}`;
      if (layoutKey !== applied.layoutKey) {
        layout = cardLayout(s.orientation, s.cornerRadius);
        const geometry = buildCardGeometry(layout);
        bodyMesh.geometry.dispose();
        frontMesh.geometry.dispose();
        backMesh.geometry.dispose();
        bodyMesh.geometry = geometry.body;
        frontMesh.geometry = geometry.face;
        backMesh.geometry = geometry.face.clone();
        frontMesh.position.z = THICKNESS / 2 + BEVEL + 0.0006;
        backMesh.rotation.y = Math.PI;
        backMesh.position.z = -(THICKNESS / 2 + BEVEL + 0.0006);
        ring.position.set(0, layout.ringY, 0);
        applied.framingKey = '';
      }
      const framingKey = `${layoutKey}|${s.size}|${s.anchor}|${s.strapLength}|${view.width}|${view.height}`;
      if (framingKey !== applied.framingKey) {
        frameView();
        if (!placed) {
          placeHanging(sim, layout, s.intro && !reducedMotion);
          placed = true;
        } else if (layoutKey !== applied.layoutKey) {
          placeHanging(sim, layout, false);
        }
      }

      const imageKey = `${s.frontImage}|${s.backImage}|${s.strapImage}`;
      if (imageKey !== applied.imageKey) {
        const token = ++imageToken;
        Promise.all([
          loadImage(imageCache, s.frontImage),
          loadImage(imageCache, s.backImage),
          loadImage(imageCache, s.strapImage)
        ]).then(([front, back, strap]) => {
          if (!alive || token !== imageToken) return;
          images.front = front;
          images.back = back;
          images.strap = strap;
          paintFaces();
          repaintStrap();
        });
      }
      const faceKey = `${layoutKey}|${s.cardColor}|${s.imageFit}`;
      if (faceKey !== applied.faceKey) paintFaces();
      if (s.strapColor !== applied.strapColor) repaintStrap();

      const finish = FINISHES[s.finish] || FINISHES.glossy;
      const card = parseColor(s.cardColor, [1, 1, 1]);
      [frontMaterial, backMaterial].forEach(material => {
        material.roughness = finish.roughness;
        material.metalness = finish.metalness;
        material.clearcoat = finish.clearcoat;
        material.clearcoatRoughness = finish.clearcoatRoughness;
        material.anisotropy = finish.anisotropy;
      });
      foilUniforms.foilStrength.value = finish.foil;
      foilUniforms.foilAspect.value = layout.height / layout.width;
      edgeMaterial.color.setRGB(card[0] * 0.92, card[1] * 0.92, card[2] * 0.92, THREE.SRGBColorSpace);
      edgeMaterial.roughness = Math.min(finish.roughness, 0.35);
      edgeMaterial.metalness = finish.metalness;
      edgeMaterial.clearcoat = 1;
      edgeMaterial.clearcoatRoughness = 0.08;
      const metalLook = METALS[s.metal] || METALS.silver;
      metalMaterial.color.set(metalLook.color);
      metalMaterial.roughness = metalLook.roughness;
      strapScale = STRAP_WIDTH * clamp(s.strapWidth, 0.4, 2);
      if (strapScale !== applied.strapScale) {
        clampMesh.geometry.dispose();
        clampMesh.geometry = buildClampGeometry(strapScale);
      }
      canvas.style.touchAction = s.interactive ? 'pan-y' : 'auto';

      applied = { layoutKey, framingKey, imageKey, faceKey, strapColor: s.strapColor, strapScale };
      start();
    };

    const points = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
    const sides = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
    const bends = BAND_BEND.map(angle => [Math.cos(angle), Math.sin(angle)]);
    const work = {
      tangent: new THREE.Vector3(),
      toCamera: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      up: new THREE.Vector3(),
      across: new THREE.Vector3(),
      facing: new THREE.Vector3(),
      end: new THREE.Vector3()
    };

    const updateBand = () => {
      const hang = sim.nodes[JOINTS];
      const reach = EYELET_RADIUS + CLAMP_BODY + 0.05;
      let guide = JOINTS - 1;
      while (guide > 0 && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;
      const axis = work.up.subVectors(sim.nodes[guide], hang);
      if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
      axis.normalize();
      mouth.copy(hang).addScaledVector(axis, reach);
      tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
      controls.length = 0;
      for (let i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
      controls.push(mouth, tuck);
      curve.updateArcLengths();
      for (let i = 0; i < SAMPLES; i++) curve.getPointAt(i / (SAMPLES - 1), points[i]);
      const length = curve.getLength();
      const held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
      const position = bandGeometry.getAttribute('position');
      const normal = bandGeometry.getAttribute('normal');
      const uv = bandGeometry.getAttribute('uv');
      const columns = BAND_COLUMNS.length;
      const restLength = sim.rest * JOINTS;
      const repeats = restLength / (strapScale * tileRatio);
      const width = strapScale / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
      const { tangent, toCamera, across, facing } = work;
      for (let i = 0; i < SAMPLES; i++) {
        tangent.subVectors(points[Math.min(SAMPLES - 1, i + 1)], points[Math.max(0, i - 1)]);
        if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
        tangent.normalize();
        toCamera.subVectors(camera.position, points[i]).normalize();
        const side = sides[i].crossVectors(toCamera, tangent);
        if (side.lengthSq() < 1e-10) side.copy(i > 0 ? sides[i - 1] : scratch.a.set(1, 0, 0));
        side.normalize();
        if (i > 0 && side.dot(sides[i - 1]) < 0) side.negate();
        const angle = -sim.twist * Math.pow(Math.min(1, i / (SAMPLES - 1) / held), 1.3);
        facing.crossVectors(tangent, side);
        across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
        facing.crossVectors(tangent, across);
        const p = points[i];
        const v = (1 - i / (SAMPLES - 1)) * repeats;
        for (let c = 0; c < columns; c++) {
          const k = i * columns + c;
          const offset = (BAND_COLUMNS[c] - 0.5) * width;
          const [bendCos, bendSin] = bends[c];
          position.setXYZ(k, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
          normal.setXYZ(
            k,
            facing.x * bendCos + across.x * bendSin,
            facing.y * bendCos + across.y * bendSin,
            facing.z * bendCos + across.z * bendSin
          );
          uv.setXY(k, BAND_COLUMNS[c], v);
        }
      }
      work.end.copy(across);
      position.needsUpdate = true;
      normal.needsUpdate = true;
      uv.needsUpdate = true;

      across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
      facing.crossVectors(across, axis).normalize();
      work.basis.makeBasis(across, axis, facing);
      clampGroup.quaternion.setFromRotationMatrix(work.basis);
      clampGroup.position.copy(hang);
    };

    const render = () => {
      cardGroup.position.copy(sim.body.position);
      cardGroup.quaternion.copy(sim.body.quaternion);
      updateBand();
      renderer.render(scene, camera);
    };

    const physics = () => {
      const s = settingsRef.current;
      const gravity = 40 * clamp(s.gravity, 0, 3);
      const weight = Math.max(gravity, 20);
      const springy = clamp(s.elasticity, 0, 1);
      const settle = clamp(s.damping, 0, 1);
      return {
        gravity,
        hold: weight * mix(2.2, 5.5, springy),
        stiffness: weight * 10 * JOINTS,
        spring: weight * mix(0.1, 0.4, springy) * JOINTS,
        bandDamping: weight * mix(0.3, 0.08, springy) * JOINTS,
        linearDrag: 0.25 * Math.pow(16, settle),
        angularDrag: 0.5 * Math.pow(12, settle),
        air: 0.15,
        broadside: 0.5,
        spinAir: 0.03,
        nodeDrag: 2,
        nodeAir: 0.2,
        twist: 30,
        twistDamping: 3,
        grip: 40,
        gripDamping: 6,
        breeze: reducedMotion ? 0 : clamp(s.breeze, 0, 1)
      };
    };

    const tick = now => {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      time += dt;
      const current = physics();
      stepSimulation(sim, dt, current, time);
      const body = sim.body;
      if (!Number.isFinite(body.position.x + body.position.y + body.position.z + body.quaternion.w)) {
        sim.grab = null;
        placeHanging(sim, layout, false);
      }
      render();
      const resting = sim.calm > 1.2 && !sim.grab && current.breeze === 0;
      if (visible && !resting) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      sim.calm = 0;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const toPointer = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
    };

    const pickCard = () => {
      cardGroup.updateMatrixWorld();
      const hits = raycaster.intersectObjects([bodyMesh, frontMesh, backMesh], false);
      return hits[0] || null;
    };

    const setCursor = value => {
      if (canvas.style.cursor !== value) canvas.style.cursor = value;
    };

    const flip = point => {
      const body = sim.body;
      const up = scratch.a.set(0, 1, 0).applyQuaternion(body.quaternion);
      let direction = sim.turn > 0 ? -1 : 1;
      if (sim.turn === 0) {
        const away = scratch.c.subVectors(point, camera.position).normalize();
        direction = scratch.b.subVectors(point, body.position).cross(away).dot(up) < 0 ? -1 : 1;
      }
      sim.turn = sim.turn === 0 ? Math.PI * direction : 0;
      body.angular.addScaledVector(up, FLIP_SPIN * direction);
    };

    const onPointerDown = event => {
      if (!settingsRef.current.interactive || event.button > 0) return;
      toPointer(event);
      const hit = pickCard();
      if (!hit) return;
      sim.grab = {
        local: hit.point.clone().sub(sim.body.position).applyQuaternion(sim.body.quaternion.clone().invert()),
        rotation: sim.body.quaternion.clone(),
        reach: hit.distance,
        from: hit.point.clone(),
        target: hit.point.clone()
      };
      press = { x: event.clientX, y: event.clientY, time: performance.now(), point: hit.point.clone() };
      canvas.setPointerCapture?.(event.pointerId);
      setCursor('grabbing');
      event.preventDefault();
      start();
    };

    const onPointerMove = event => {
      if (!settingsRef.current.interactive) return;
      toPointer(event);
      if (sim.grab) {
        if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) press = null;
        raycaster.ray.at(sim.grab.reach, sim.grab.target);
        start();
        return;
      }
      if (event.pointerType === 'touch') return;
      hovering = !!pickCard();
      setCursor(hovering ? 'grab' : '');
    };

    const onPointerUp = event => {
      if (!sim.grab) return;
      sim.grab = null;
      if (press && event.type === 'pointerup' && performance.now() - press.time < 450) flip(press.point);
      press = null;
      canvas.releasePointerCapture?.(event.pointerId);
      setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '');
      start();
    };

    const onTouchStart = event => {
      if (!settingsRef.current.interactive || event.touches.length !== 1) return;
      toPointer(event.touches[0]);
      if (pickCard()) event.preventDefault();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('lostpointercapture', onPointerUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });

    const resize = () => {
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(view.width, view.height, false);
      apply();
      render();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersectionObserver.observe(container);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    applyRef.current = apply;
    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      applyRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('lostpointercapture', onPointerUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      [bodyMesh, frontMesh, backMesh, ring, clampMesh, eyelet, band].forEach(mesh => mesh.geometry?.dispose());
      [frontMaterial, backMaterial, edgeMaterial, metalMaterial, bandMaterial].forEach(material => material.dispose());
      [frontTexture, backTexture, strapTexture, grain, weave].forEach(texture => texture.dispose());
      environment.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`lanyard ${className}`.trim()} style={style} />;
};

export default Lanyard;
```

### CSS komponen (`Lanyard.css`)

```css
.lanyard {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lanyard-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

### Langkah integrasi

1. Pasang dependensi yang tercantum.
2. Salin source komponen ke direktori proyek yang sesuai.
3. Impor file CSS bersama komponen.
4. Impor dan render komponen berdasarkan contoh penggunaan.
5. Sesuaikan props dengan kebutuhan.

---

## Lampiran B: Source FoldText (React Bits)

- Komponen: FoldText
- Varian: JavaScript + CSS
- Dependensi: `gsap`

### Contoh penggunaan

```jsx
import FoldText from './FoldText';

<FoldText
  text="Launch with clarity"
  foldStyle="paper"
  splitBy="char"
  hinge="top"
  trigger="scroll"
  foldAngle={92}
  duration={0.65}
  stagger={0.045}
  staggerFrom="start"
  ease="power3.out"
  loopDelay={1.4}
  hoverRefold={true}
  refoldRadius={140}
  refoldAngle={45}
  perspective={700}
  creaseShading={0.55}
  fontSize="clamp(3rem, 10vw, 7rem)"
  fontWeight={800}
/>
```

### Props

| Prop | Tipe | Nilai bawaan | Keterangan |
|---|---|---|---|
| text | string | "Design unfolds" | Teks yang dipecah dan dilipat ke tempatnya. Baris baru dipertahankan. |
| foldStyle | "paper" \| "blinds" \| "flip" | "paper" | Cara tiap potongan terlipat. Paper berayun terbuka dari tepi engsel; blinds membelah potongan menjadi dua bilah yang terbuka bergantian; flip membalik potongan seperti kartu dan terangkat ke arah pengunjung di tengah putaran. |
| splitBy | "char" \| "word" \| "line" | "char" | Tiap huruf, kata, atau baris menjadi satu panel lipat. |
| hinge | "top" \| "bottom" \| "left" \| "right" | "top" | Tepi tempat panel melipat. Untuk blinds dan flip, nilai ini menentukan sumbu dan arah putaran. |
| foldAngle | number | 92 | Sudut awal panel terlipat menjauh, dalam derajat. Di atas 90 panel terbalik dari belakang. Flip selalu berputar setengah putaran penuh. |
| duration | number | 0.65 | Lama tiap panel terbuka, dalam detik. |
| stagger | number | 0.045 | Jeda antar panel, dalam detik. |
| staggerFrom | "start" \| "center" \| "end" \| "edges" \| "random" | "start" | Titik awal rambatan animasi. |
| ease | string | "power3.out" | Ease GSAP untuk proses membuka. |
| perspective | number | 700 | Jarak kamera untuk lipatan, dalam px. Nilai rendah memberi kesan lebih dalam. |
| creaseShading | number | 0.55 | Kegelapan bayangan lipatan saat panel terlipat, dari 0 sampai 1. |
| trigger | "mount" \| "hover" \| "scroll" \| "loop" | "mount" | Waktu teks terbuka. Loop menahan teks, melipatnya kembali, lalu memutar ulang. |
| loopDelay | number | 1.4 | Lama teks terbuka bertahan sebelum terlipat kembali, dalam detik. Hanya berlaku saat trigger bernilai 'loop'. |
| hoverRefold | boolean | false | Panel di dekat kursor terlipat sebagian dan terbuka kembali setelah kursor lewat. |
| refoldRadius | number | 140 | Jangkauan reaksi panel dari kursor pada hoverRefold, dalam px. Lipatan memudar menuju tepi. |
| refoldAngle | number | 45 | Sudut lipatan panel tepat di bawah kursor pada hoverRefold, dalam derajat. |
| fontSize | string \| number | 80 | Ukuran font. Angka dalam px. |
| fontWeight | string \| number | 800 | Ketebalan font. |
| color | string | "currentColor" | Warna teks. Mengikuti warna teks sekitarnya secara bawaan. |
| className | string | "" | Nama kelas tambahan untuk elemen akar. |
| style | CSSProperties | {} | Gaya inline untuk elemen akar. |

### Source komponen (`FoldText.jsx`)

```jsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FoldText.css';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const HINGES = {
  top: { origin: '50% 0%', axis: 'rotateX', sign: -1 },
  bottom: { origin: '50% 100%', axis: 'rotateX', sign: 1 },
  left: { origin: '0% 50%', axis: 'rotateY', sign: 1 },
  right: { origin: '100% 50%', axis: 'rotateY', sign: -1 }
};

const SLATS = {
  rotateX: {
    origins: ['50% 25%', '50% 75%'],
    clips: ['inset(-40% -20% 50% -20%)', 'inset(50% -20% -40% -20%)']
  },
  rotateY: {
    origins: ['25% 50%', '75% 50%'],
    clips: ['inset(-40% 50% -40% -20%)', 'inset(-40% -20% -40% 50%)']
  }
};

const FOLD_STYLES = ['paper', 'blinds', 'flip'];
const SLAT_DELAY = 0.24;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FoldText = ({
  text = 'Design unfolds',
  splitBy = 'char',
  hinge = 'top',
  foldStyle = 'paper',
  duration = 0.65,
  stagger = 0.045,
  staggerFrom = 'start',
  foldAngle = 92,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55,
  trigger = 'mount',
  loopDelay = 1.4,
  hoverRefold = false,
  refoldRadius = 140,
  refoldAngle = 45,
  fontSize = 80,
  fontWeight = 800,
  color = 'currentColor',
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const safeHinge = HINGES[hinge] ? hinge : 'top';
  const hingeConfig = HINGES[safeHinge];
  const safeStyle = FOLD_STYLES.includes(foldStyle) ? foldStyle : 'paper';
  const safeCrease = clamp(creaseShading, 0, 1);
  const safeAngle = clamp(foldAngle, 0, 180);
  const safeStagger = Math.max(0, stagger);
  const safeDelay = Math.max(0, loopDelay);
  const safeRadius = Math.max(1, refoldRadius);
  const safeRefold = clamp(refoldAngle, 0, 180);
  const startsFolded = trigger !== 'hover';

  const segments = useMemo(() => {
    const renderPiece = (content, key, isLine = false) => (
      <span className="fold-text-segment" data-fold-split={isLine ? 'line' : undefined} key={key}>
        {safeStyle === 'blinds' ? (
          <span
            className="fold-text-piece"
            data-fold-hinge={safeHinge}
            data-fold-style="blinds"
            style={startsFolded ? { opacity: 0 } : undefined}
          >
            <span className="fold-text-slat" data-fold-text={content}>
              {content}
            </span>
            <span className="fold-text-slat" data-fold-slat="b" data-fold-text={content}>
              {content}
            </span>
          </span>
        ) : (
          <span
            className="fold-text-piece"
            data-fold-hinge={safeHinge}
            data-fold-style={safeStyle}
            data-fold-text={content}
            style={startsFolded ? { opacity: 0 } : undefined}
          >
            {content}
          </span>
        )}
      </span>
    );

    if (splitBy === 'line') {
      return text.split('\n').map((line, index) => renderPiece(line || '\u00A0', `line-${index}`, true));
    }

    return text.split(/(\s+)/).flatMap((part, partIndex) => {
      if (!part) return [];

      if (/^\s+$/.test(part)) {
        return part
          .split('\n')
          .flatMap((spaces, lineIndex) => [lineIndex > 0 ? <br key={`br-${partIndex}-${lineIndex}`} /> : null, spaces])
          .filter(Boolean);
      }

      if (splitBy === 'word') return [renderPiece(part, `word-${partIndex}`)];

      return [
        <span className="fold-text-word" key={`word-${partIndex}`}>
          {Array.from(part).map((char, charIndex) => renderPiece(char, `char-${partIndex}-${charIndex}`))}
        </span>
      ];
    });
  }, [text, splitBy, safeHinge, safeStyle, startsFolded]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const elements = Array.from(root.querySelectorAll('.fold-text-piece'));
    if (!elements.length) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const { axis, sign, origin } = hingeConfig;
    const slats = SLATS[axis];
    const unfoldEase = gsap.parseEase(reduceMotion ? 'power1.out' : ease) || gsap.parseEase('power3.out');
    const foldEase = gsap.parseEase(reduceMotion ? 'power1.in' : 'power2.in');
    const angle = reduceMotion ? 0 : safeStyle === 'flip' ? 180 : safeAngle;
    const crease = reduceMotion ? 0 : safeCrease;
    const refold = hoverRefold && !reduceMotion ? safeRefold : 0;
    const lift = safeStyle === 'flip' && !reduceMotion ? 0.45 : 0;
    const unfoldDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
    const staggerVars = { each: reduceMotion ? Math.min(safeStagger, 0.02) : safeStagger, from: staggerFrom };

    const pieces = elements.map(element => {
      const parts = safeStyle === 'blinds' ? Array.from(element.children) : [element];
      if (safeStyle === 'blinds') {
        element.style.opacity = '1';
        parts.forEach((part, index) => {
          part.style.transformOrigin = slats.origins[index];
          if (index > 0) part.style.clipPath = slats.clips[index];
        });
      } else {
        element.style.transformOrigin = safeStyle === 'flip' ? '50% 50%' : origin;
        element.style.backfaceVisibility = safeStyle === 'flip' ? 'visible' : '';
      }
      return { element, parts, t: startsFolded ? 0 : 1, f: 0, r: 0, aim: 0 };
    });

    const shade = (progress, tilt) => String(crease * clamp(1 - progress + tilt / 90, 0, 1));

    const render = () => {
      pieces.forEach(piece => {
        const tilt = piece.r * refold;

        if (safeStyle === 'blinds') {
          let resting = tilt < 0.05;
          piece.parts.forEach((part, index) => {
            const offset = index * SLAT_DELAY;
            const open = unfoldEase(clamp((piece.t - offset) / (1 - SLAT_DELAY), 0, 1));
            const close = foldEase(clamp((piece.f - offset) / (1 - SLAT_DELAY), 0, 1));
            const progress = open * (1 - close);
            if (Math.abs(1 - progress) > 0.002) resting = false;
            part.style.transform = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
            part.style.opacity = String(clamp(progress, 0, 1));
            part.style.setProperty('--fold-crease', shade(progress, tilt));
          });
          piece.parts[0].style.clipPath = resting ? 'none' : slats.clips[0];
          piece.parts[1].style.visibility = resting ? 'hidden' : 'visible';
          return;
        }

        const progress = unfoldEase(piece.t) * (1 - foldEase(piece.f));
        const rise = lift * Math.sin(Math.PI * clamp(progress, 0, 1));
        const turn = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
        piece.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
        piece.element.style.opacity = String(clamp(progress, 0, 1));
        piece.element.style.setProperty('--fold-crease', shade(progress, tilt));
      });
    };

    let timeline = null;
    let scrollTrigger = null;

    const play = loop => {
      timeline?.kill();
      timeline = gsap.timeline({ onUpdate: render, ...(loop ? { repeat: -1, repeatDelay: 0.35 } : {}) });
      timeline.fromTo(pieces, { t: 0, f: 0 }, { t: 1, duration: unfoldDuration, ease: 'none', stagger: staggerVars });
      if (loop) {
        timeline.to(
          pieces,
          { f: 1, duration: unfoldDuration * 0.75, ease: 'none', stagger: staggerVars },
          `+=${safeDelay}`
        );
      }
      render();
    };

    const handleEnter = () => play(false);

    if (trigger === 'hover') {
      render();
      root.addEventListener('mouseenter', handleEnter);
    } else if (trigger === 'scroll') {
      render();
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: handleEnter
      });
    } else {
      play(trigger === 'loop');
    }

    let pointer = null;
    let centers = null;
    let measured = null;
    let relaxing = false;

    const measure = box => {
      centers = pieces.map(piece => {
        const rect = piece.element.parentElement.getBoundingClientRect();
        return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
      });
      measured = { width: box.width, height: box.height };
    };

    const relax = (time, deltaTime) => {
      const step = Math.min(deltaTime, 64) / 1000;
      let moving = false;
      pieces.forEach(piece => {
        const rate = piece.aim > piece.r ? 14 : 6;
        piece.r += (piece.aim - piece.r) * (1 - Math.exp(-rate * step));
        if (Math.abs(piece.aim - piece.r) > 0.001) moving = true;
        else piece.r = piece.aim;
      });
      render();
      if (!moving) {
        gsap.ticker.remove(relax);
        relaxing = false;
      }
    };

    const aim = () => {
      const box = root.getBoundingClientRect();
      const near =
        pointer &&
        pointer.x > box.left - safeRadius &&
        pointer.x < box.right + safeRadius &&
        pointer.y > box.top - safeRadius &&
        pointer.y < box.bottom + safeRadius;
      if (near && (!centers || Math.abs(box.width - measured.width) + Math.abs(box.height - measured.height) > 1)) {
        measure(box);
      }
      let changed = false;
      pieces.forEach((piece, index) => {
        let value = 0;
        if (near) {
          const center = centers[index];
          const distance = Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / safeRadius;
          if (distance < 1) value = 1 - distance * distance * (3 - 2 * distance);
        }
        if (value !== piece.aim) changed = true;
        piece.aim = value;
      });
      if (changed && !relaxing) {
        relaxing = true;
        gsap.ticker.add(relax);
      }
    };

    const handleMove = event => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    const handleLeave = () => {
      pointer = null;
      aim();
    };

    const handleScroll = () => {
      if (pointer) aim();
    };

    if (refold) {
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      document.documentElement.addEventListener('pointerleave', handleLeave);
    }

    return () => {
      root.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      gsap.ticker.remove(relax);
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(pieces);
    };
  }, [
    segments,
    hingeConfig,
    safeStyle,
    duration,
    safeStagger,
    staggerFrom,
    safeAngle,
    ease,
    safeCrease,
    trigger,
    safeDelay,
    hoverRefold,
    safeRadius,
    safeRefold,
    startsFolded
  ]);

  const rootStyle = {
    '--fold-text-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    '--fold-text-font-weight': fontWeight,
    '--fold-text-color': color,
    '--fold-perspective': `${Math.max(120, perspective)}px`,
    ...style
  };

  return (
    <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </span>
  );
};

export default FoldText;
```

### CSS komponen (`FoldText.css`)

```css
.fold-text {
  display: inline-block;
  color: var(--fold-text-color, currentColor);
  font-size: var(--fold-text-font-size, inherit);
  font-weight: var(--fold-text-font-weight, inherit);
  line-height: 0.95;
  letter-spacing: -0.04em;
  white-space: pre-wrap;
  user-select: text;
}

.fold-text-sr-only {
  position: absolute;
  user-select: none;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fold-text-visual {
  display: inline;
}

.fold-text-word {
  display: inline-block;
  white-space: nowrap;
}

.fold-text-segment {
  display: inline-block;
  perspective: var(--fold-perspective, 700px);
  vertical-align: baseline;
}

.fold-text-segment[data-fold-split='line'] {
  display: block;
}

.fold-text-piece {
  --fold-shade: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
  transform-origin: 50% 0%;
}

.fold-text-piece[data-fold-hinge='bottom'] {
  --fold-shade: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 50% 100%;
}

.fold-text-piece[data-fold-hinge='left'] {
  --fold-shade: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 0% 50%;
}

.fold-text-piece[data-fold-hinge='right'] {
  --fold-shade: linear-gradient(
    270deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  transform-origin: 100% 50%;
}

.fold-text-piece[data-fold-style='blinds'] {
  perspective: var(--fold-perspective, 700px);
}

.fold-text-slat {
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
}

.fold-text-slat[data-fold-slat='b'] {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.fold-text-piece::after,
.fold-text-slat::after {
  content: attr(data-fold-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: transparent;
  -webkit-text-fill-color: transparent;
  background-image: var(--fold-shade);
  -webkit-background-clip: text;
  background-clip: text;
  opacity: var(--fold-crease, 0);
}

@media (prefers-reduced-motion: reduce) {
  .fold-text-piece,
  .fold-text-slat {
    transform: none !important;
  }

  .fold-text-piece::after,
  .fold-text-slat::after {
    opacity: 0 !important;
  }
}
```

### Langkah integrasi

1. Pasang dependensi yang tercantum.
2. Salin source komponen ke direktori proyek yang sesuai.
3. Impor file CSS bersama komponen.
4. Impor dan render komponen berdasarkan contoh penggunaan.
5. Sesuaikan props dengan kebutuhan.

---

## Lampiran C: Source Circular Gallery (React Bits)

- Komponen: CircularGallery
- Varian: JavaScript + CSS
- Dependensi: tidak ada

### Contoh penggunaan

```jsx
import CircularGallery from './CircularGallery'

<div style={{ height: '600px', position: 'relative' }}>
  <CircularGallery
    bend={3}
    textColor="#ffffff"
    borderRadius={0.05}
    scrollEase={0.05}
    onItemClick={(item, index) => console.log(item.text, index)}
  />
</div>
```

### Props

| Prop | Tipe | Nilai bawaan | Keterangan |
|---|---|---|---|
| items | Array<{ image: string; text?: string; description?: string; alt?: string }> | 12 foto contoh | Gambar yang ditampilkan. `text` adalah judul di bawah kartu, `description` tampil di bawah judul saat kartu dibuka, dan `alt` menamai gambar untuk pembaca layar. |
| bend | number | 3 | Kelengkungan busur. Nilai positif melengkungkan kartu ke bawah di tepi, negatif mengangkatnya, 0 membuatnya rata. |
| itemSize | number | 1 | Tinggi kartu relatif terhadap wadah, dari 0.2 sampai 2. |
| itemAspect | number | 0.78 | Lebar kartu dibagi tinggi kartu. Gambar dipotong agar memenuhi kartu. |
| gap | number | 0.26 | Jarak antar kartu sebagai pecahan dari lebar kartu. |
| borderRadius | number | 0.05 | Radius sudut kartu sebagai pecahan dari ukuran kartu, dari 0 (siku) sampai 0.5 (bulat penuh). |
| wave | number | 1 | Besar riak kartu saat galeri bergerak. 0 menjaga kartu tetap rata. |
| fadeEdges | number | 0.12 | Memudarkan kartu di tepi kiri dan kanan, dari 0 sampai 0.5 lebar. |
| shadow | number | 0.25 | Kekuatan bayangan lembut di bawah tiap kartu. |
| textColor | string | '#ffffff' | Warna judul, cincin fokus keyboard, dan placeholder saat gambar dimuat. |
| font | string | 'bold 30px Figtree' | Singkatan font CSS untuk judul. Ukuran mengikuti skala kartu; 30px berarti ukuran bawaan. |
| fontUrl | string | undefined | Font yang dimuat untuk judul. Menerima URL stylesheet (misalnya tautan Google Fonts) atau file font (.woff2, .woff, .ttf, .otf). Keluarga font yang dimuat menggantikan keluarga pada `font`. |
| showTitles | boolean | true | Menampilkan judul tiap kartu di bawahnya. |
| scrollSpeed | number | 2 | Jarak tempuh galeri per gerakan drag atau roda mouse. |
| scrollEase | number | 0.05 | Kecepatan galeri menyusul masukan, dari 0.001 (mengambang) sampai 1 (seketika). |
| snap | boolean | true | Berhenti pada kartu terdekat setelah drag atau gulir. |
| autoScroll | number | 0 | Kecepatan hanyut otomatis; 1 berarti kira-kira satu kartu tiap empat detik, nilai negatif berarah sebaliknya. Berhenti saat kursor di atas galeri, saat drag, saat kartu terbuka, dan sebentar setelah masukan apa pun. |
| grayscale | boolean | false | Menampilkan gambar dalam skala abu-abu dan mengembalikan warna saat hover, fokus, atau kartu dibuka. |
| openOnClick | boolean | true | Klik pada kartu membukanya ke gambar penuh. Klik lagi, klik di luar kartu, tekan Escape, atau tombol tutup untuk kembali. Jika dimatikan, klik memusatkan kartu. |
| intro | boolean | true | Kartu meluncur masuk saat galeri dipasang. |
| onItemClick | (item, index) => void | - | Dipanggil saat kartu diklik. |
| onActiveChange | (index) => void | - | Dipanggil saat kartu lain menjadi kartu di tengah. |
| dpr | number | otomatis | Rasio piksel perangkat maksimum, dibatasi 2. |
| className | string | '' | Nama kelas tambahan untuk wadah. |
| style | CSSProperties | - | Gaya inline untuk wadah. |

### Source komponen (`CircularGallery.jsx`)

```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import './CircularGallery.css';

const DEFAULT_FONT = 'bold 30px Figtree';
const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap';
const SEGMENTS_X = 32;
const SEGMENTS_Y = 24;
const INTRO_SECONDS = 1.4;
const WORLD_HEIGHT = 16.57;
const CLASSES = {
  root: 'circular-gallery',
  canvas: 'circular-gallery-canvas',
  labels: 'circular-gallery-labels',
  label: 'circular-gallery-label',
  caption: 'circular-gallery-caption',
  captionText: 'circular-gallery-caption-text',
  close: 'circular-gallery-close',
  hidden: 'circular-gallery-hidden'
};
const STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/seed/1/800/600', text: 'Bridge' },
  { image: 'https://picsum.photos/seed/2/800/600', text: 'Desk Setup' },
  { image: 'https://picsum.photos/seed/3/800/600', text: 'Waterfall' },
  { image: 'https://picsum.photos/seed/4/800/600', text: 'Strawberries' },
  { image: 'https://picsum.photos/seed/5/800/600', text: 'Deep Diving' },
  { image: 'https://picsum.photos/seed/16/800/600', text: 'Train Track' },
  { image: 'https://picsum.photos/seed/17/800/600', text: 'Santorini' },
  { image: 'https://picsum.photos/seed/8/800/600', text: 'Blurry Lights' },
  { image: 'https://picsum.photos/seed/9/800/600', text: 'New York' },
  { image: 'https://picsum.photos/seed/10/800/600', text: 'Good Boy' },
  { image: 'https://picsum.photos/seed/21/800/600', text: 'Coastline' },
  { image: 'https://picsum.photos/seed/12/800/600', text: 'Palm Trees' }
];

const VERTEX = `#version 300 es
in vec2 aPosition;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform vec2 uSize;
uniform float uAngle;
uniform float uPad;
uniform float uWave;
uniform float uWaveTime;
uniform float uFocal;
out vec2 vLocal;
void main() {
  vec2 local = aPosition * (uSize + 2.0 * uPad);
  vec2 unit = local / max(uSize, vec2(1.0));
  float z = uWave * (sin(unit.x * 4.0 + uWaveTime) + cos(unit.y * 2.0 + uWaveTime)) * 0.5;
  float depth = uFocal / max(uFocal - z, 1.0);
  float c = cos(uAngle);
  float s = sin(uAngle);
  vec2 turned = vec2(c * local.x - s * local.y, s * local.x + c * local.y);
  vLocal = local;
  gl_Position = vec4((uCenter + turned * depth) / (uResolution * 0.5), 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform float uRadius;
uniform float uImageAspect;
uniform float uReady;
uniform vec3 uPlaceholder;
uniform float uGray;
uniform float uDim;
uniform float uAlpha;
uniform float uRing;
uniform vec3 uRingColor;
uniform float uRingWidth;
uniform float uRingGap;
uniform float uFade;
uniform float uShadow;
uniform float uBlur;
uniform vec2 uShadowOffset;
in vec2 vLocal;
out vec4 outColor;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float edgeFade() {
  if (uFade <= 0.0) return 1.0;
  float u = gl_FragCoord.x / uResolution.x;
  return smoother(u / uFade) * smoother((1.0 - u) / uFade);
}

void main() {
  vec2 extent = uSize * 0.5;
  if (uShadow > 0.0) {
    float d = roundBox(vLocal - uShadowOffset, extent, uRadius);
    float a = uShadow * (1.0 - smoothstep(-uBlur, uBlur, d)) * uAlpha * edgeFade();
    outColor = vec4(0.0, 0.0, 0.0, a);
    return;
  }
  float d = roundBox(vLocal, extent, uRadius);
  float pixel = max(length(vec2(dFdx(d), dFdy(d))), 1e-4);
  float cover = clamp(0.5 - d / pixel, 0.0, 1.0);
  vec2 uv = vLocal / uSize + 0.5;
  float aspect = uSize.x / uSize.y;
  vec2 crop = aspect > uImageAspect ? vec2(1.0, uImageAspect / aspect) : vec2(aspect / uImageAspect, 1.0);
  vec3 image = texture(uTexture, (uv - 0.5) * crop + 0.5).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(color, vec3(luma), uGray) * (1.0 - uDim);
  float body = cover * mix(0.08, 1.0, uReady);
  float band = abs(d - uRingGap - uRingWidth * 0.5) - uRingWidth * 0.5;
  float ring = clamp(0.5 - band / pixel, 0.0, 1.0) * uRing;
  vec4 card = vec4(color * body, body);
  vec4 outline = vec4(uRingColor * ring, ring);
  outColor = (card + outline * (1.0 - card.a)) * uAlpha * edgeFade();
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a + (b - a) * t;
const ease = value => value * value * (3 - 2 * value);
const wrap = (value, length) => ((value % length) + length) % length;

function deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

async function loadFontFromStylesheet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family = null;
  const fontFaces = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      document.fonts.add(face);
    })
  );
  return family;
}

async function loadFontFromFile(url) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function resolveFont(font, fontUrl) {
  const url = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);
  if (!url) return font;
  try {
    const isStylesheet = url.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(url);
    const family = isStylesheet ? await loadFontFromStylesheet(url) : await loadFontFromFile(url);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    return `${sizeMatch ? sizeMatch[1].trim() : 'bold 30px'} "${family}"`;
  } catch {
    return font;
  }
}

const fontScale = font => {
  const match = String(font).match(/(\d+(?:\.\d+)?)px/);
  return match ? parseFloat(match[1]) / 30 : 1;
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = gl => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
};

const CircularGallery = ({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = DEFAULT_FONT,
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05,
  itemSize = 1,
  itemAspect = 0.78,
  gap = 0.26,
  wave = 1,
  fadeEdges = 0.12,
  shadow = 0.25,
  grayscale = false,
  showTitles = true,
  snap = true,
  autoScroll = 0,
  openOnClick = true,
  intro = true,
  onItemClick,
  onActiveChange,
  dpr,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const captionRef = useRef(null);
  const buttonsRef = useRef([]);
  const engineRef = useRef(null);
  const fontRef = useRef(font);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;
  const settings = {
    items: list,
    bend,
    textColor,
    borderRadius: clamp(borderRadius, 0, 0.5),
    scrollSpeed: Math.max(0, scrollSpeed),
    scrollEase: clamp(scrollEase, 0.001, 1),
    itemSize: clamp(itemSize, 0.2, 2),
    itemAspect: clamp(itemAspect, 0.2, 5),
    gap: Math.max(0, gap),
    wave: Math.max(0, wave),
    fadeEdges: clamp(fadeEdges, 0, 0.5),
    shadow: clamp(shadow, 0, 1),
    grayscale,
    showTitles,
    snap,
    autoScroll,
    openOnClick,
    intro,
    onItemClick,
    onActiveChange,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    let alive = true;
    fontRef.current = font;
    resolveFont(font, fontUrl).then(resolved => {
      if (!alive) return;
      fontRef.current = resolved;
      engineRef.current?.wake();
    });
    return () => {
      alive = false;
    };
  }, [font, fontUrl]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const labelLayer = labelsRef.current;
    const caption = captionRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !labelLayer || !caption || !gl) return undefined;

    const program = link(gl);
    if (!program) return undefined;
    const u = program.uniforms;

    const vertices = [];
    for (let y = 0; y <= SEGMENTS_Y; y++) {
      for (let x = 0; x <= SEGMENTS_X; x++) vertices.push(x / SEGMENTS_X - 0.5, y / SEGMENTS_Y - 0.5);
    }
    const indices = [];
    for (let y = 0; y < SEGMENTS_Y; y++) {
      for (let x = 0; x < SEGMENTS_X; x++) {
        const a = y * (SEGMENTS_X + 1) + x;
        const b = a + 1;
        const c = a + SEGMENTS_X + 1;
        const d = c + 1;
        indices.push(a, b, d, a, d, c);
      }
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
    const blank = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, blank);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colorCache = new Map();
    const parse = value => {
      const key = String(value);
      if (colorCache.has(key)) return colorCache.get(key);
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#ffffff';
        probe.fillStyle = key;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(key, rgb);
      return rgb;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const textures = new Map();
    const view = { width: 1, height: 1, ratio: 1 };
    const state = {
      scroll: 0,
      target: 0,
      velocity: 0,
      open: 0,
      openTarget: 0,
      intro: settingsRef.current.intro && !reduce ? 0 : 1,
      waveTime: 0,
      ring: 0,
      keyboard: false,
      hovered: null,
      hover: new Map(),
      focus: new Map(),
      drag: null,
      lastInput: 0,
      active: 0,
      spacing: 1
    };
    let cards = [];
    let pool = [];
    let raf = 0;
    let last = 0;
    let visible = true;
    let snapTimer = 0;
    let lastItems = null;
    let typing = false;

    const textureFor = url => {
      const existing = textures.get(url);
      if (existing) return existing;
      const entry = { texture: null, aspect: 1, ready: 0, loaded: false };
      textures.set(url, entry);
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';
      image.onload = () => {
        if (!textures.has(url)) return;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (anisotropy) {
          const max = gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
          gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
        }
        entry.texture = texture;
        entry.aspect = image.naturalWidth / Math.max(1, image.naturalHeight);
        entry.loaded = true;
        wake();
      };
      image.src = url;
      return entry;
    };

    const prune = list => {
      const keep = new Set(list.map(item => item.image));
      textures.forEach((entry, url) => {
        if (keep.has(url)) return;
        if (entry.texture) gl.deleteTexture(entry.texture);
        textures.delete(url);
      });
    };

    const measure = () => {
      const s = settingsRef.current;
      const height = 0.6 * view.height * s.itemSize;
      const width = height * s.itemAspect;
      const scale = Math.min(1, (view.width * 0.82) / width);
      return { w: width * scale, h: height * scale, spacing: width * scale * (1 + s.gap) };
    };

    const arcOf = x => {
      const s = settingsRef.current;
      if (!s.bend) return { y: 0, angle: 0 };
      const depth = (Math.abs(s.bend) * view.height) / WORLD_HEIGHT;
      const half = Math.max(view.width, view.height * 1.9) / 2;
      const radius = (half * half + depth * depth) / (2 * depth);
      const reach = Math.min(Math.abs(x), half, radius * 0.999);
      const arc = radius - Math.sqrt(radius * radius - reach * reach);
      const angle = Math.sign(x) * Math.asin(reach / radius);
      return s.bend > 0 ? { y: -arc, angle: -angle } : { y: arc, angle };
    };

    const captionSize = () => clamp(view.height * 0.045, 15, 22);

    const ensurePool = spacing => {
      const size = Math.ceil(view.width / Math.max(spacing, 1)) + 8;
      if (pool.length === size) return;
      labelLayer.replaceChildren();
      pool = Array.from({ length: size }, () => {
        const el = document.createElement('span');
        el.className = CLASSES.label;
        el.style.opacity = '0';
        labelLayer.appendChild(el);
        return { el, slot: null, font: '', text: '' };
      });
    };

    const layout = () => {
      const s = settingsRef.current;
      const list = s.items;
      const count = list.length;
      const { w, h, spacing } = measure();
      state.spacing = spacing;
      const introEase = 1 - Math.pow(1 - state.intro, 3);
      const scroll = state.scroll + (1 - introEase) * spacing * 1.6;
      const margin = Math.max(20, Math.min(view.width, view.height) * 0.06);
      const baseLabel = h * 0.072 * fontScale(fontRef.current);
      const openFrame = item => {
        const aspect = textureFor(item.image).aspect || w / h;
        const titleSpace = item.text && s.showTitles ? captionSize() * 2.4 : 0;
        const captionSpace = titleSpace + (item.description ? 52 : 0);
        const width = Math.min(view.width - margin * 2, (view.height - margin * 2 - captionSpace) * aspect);
        return { width, height: width / aspect, y: captionSpace / 2, titleSpace };
      };
      const activeFrame = openFrame(list[wrap(state.active, count)]);
      const spread = Math.max(0, activeFrame.width / 2 - w / 2);
      const activeX = state.active * spacing - scroll;
      const first = Math.floor((scroll - view.width / 2 - spacing * 2) / spacing);
      const lastSlot = Math.ceil((scroll + view.width / 2 + spacing * 2) / spacing);
      const next = [];
      let lead = null;
      for (let slot = first; slot <= lastSlot; slot++) {
        const index = wrap(slot, count);
        const item = list[index];
        const entry = textureFor(item.image);
        const focus = ease(state.focus.get(slot) || 0);
        let x = slot * spacing - scroll;
        x += Math.sign(x - activeX) * state.open * (1 - focus) * spread;
        const arc = arcOf(x);
        const frame = focus > 0 ? openFrame(item) : activeFrame;
        const order = Math.abs(slot * spacing - state.scroll) / spacing;
        const shown = ease(clamp(state.intro * 2.2 - order * 0.22, 0, 1));
        const hover = state.hover.get(slot) || 0;
        const lift = 1 + hover * 0.04 * (1 - focus);
        const card = {
          slot,
          index,
          item,
          entry,
          x: mix(x, 0, focus),
          y: mix(arc.y, frame.y, focus) - (1 - shown) * h * 0.18,
          angle: arc.angle * (1 - focus),
          w: mix(w, frame.width, focus) * lift,
          h: mix(h, frame.height, focus) * lift,
          radius: s.borderRadius * Math.min(w, h),
          alpha: shown * mix(1, 0.12, state.open * (1 - focus)),
          dim: state.open * (1 - focus) * 0.4,
          gray: s.grayscale ? 1 - Math.max(hover, focus, slot === state.active ? state.ring : 0) : 0,
          focus,
          labelAlpha: mix(1 - state.open, 1, focus),
          labelSize: mix(baseLabel, captionSize(), focus),
          frame
        };
        if (!lead || focus > lead.focus) lead = card;
        next.push(card);
      }
      next.sort((a, b) => a.focus - b.focus || Math.abs(b.x) - Math.abs(a.x));
      cards = next;
      const frame = lead && lead.focus > 0 ? lead.frame : activeFrame;
      return { w, h, spacing, openH: frame.height, openY: frame.y, titleSpace: frame.titleSpace };
    };

    const draw = metrics => {
      const s = settingsRef.current;
      const ratio = view.ratio;
      const speed = Math.min(Math.abs(state.velocity) / Math.max(metrics.spacing * 4, 1), 1);
      const wavePx = reduce ? 0 : s.wave * speed * view.height * 0.08 * ratio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uFocal, view.height * 1.207 * ratio);
      gl.uniform1f(u.uWaveTime, state.waveTime);
      gl.uniform1f(u.uFade, s.fadeEdges);
      gl.uniform3fv(u.uPlaceholder, parse(s.textColor));
      gl.uniform3fv(u.uRingColor, parse(s.textColor));
      gl.uniform1f(u.uRingWidth, 2 * ratio);
      gl.uniform1f(u.uRingGap, 5 * ratio);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(u.uTexture, 0);
      const count = SEGMENTS_X * SEGMENTS_Y * 6;
      const blur = Math.max(10, metrics.h * 0.09) * ratio;
      const place = card => {
        gl.uniform2f(u.uCenter, card.x * ratio, card.y * ratio);
        gl.uniform2f(u.uSize, card.w * ratio, card.h * ratio);
        gl.uniform1f(u.uAngle, card.angle);
        gl.uniform1f(u.uRadius, Math.min(card.radius, card.w / 2, card.h / 2) * ratio);
        gl.uniform1f(u.uWave, wavePx * (1 - card.focus));
        gl.uniform1f(u.uAlpha, card.alpha);
      };
      if (s.shadow > 0) {
        gl.uniform1f(u.uShadow, s.shadow);
        gl.uniform1f(u.uBlur, blur);
        gl.uniform2f(u.uShadowOffset, 0, -blur * 0.45);
        gl.uniform1f(u.uPad, blur * 1.6);
        gl.bindTexture(gl.TEXTURE_2D, blank);
        cards.forEach(card => {
          place(card);
          gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        });
      }
      gl.uniform1f(u.uShadow, 0);
      gl.uniform1f(u.uPad, 10 * ratio);
      cards.forEach(card => {
        place(card);
        const entry = card.entry;
        gl.bindTexture(gl.TEXTURE_2D, entry.texture || blank);
        gl.uniform1f(u.uImageAspect, entry.aspect);
        gl.uniform1f(u.uReady, entry.ready);
        gl.uniform1f(u.uGray, card.gray);
        gl.uniform1f(u.uDim, card.dim);
        gl.uniform1f(u.uRing, card.slot === state.active ? state.ring * (1 - card.focus) : 0);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
      });
    };

    const placeLabels = metrics => {
      const s = settingsRef.current;
      ensurePool(metrics.spacing);
      const used = new Set();
      const font = fontRef.current;
      const fade = value => {
        if (s.fadeEdges <= 0) return 1;
        const t = clamp(value / s.fadeEdges, 0, 1);
        return t * t * t * (t * (t * 6 - 15) + 10);
      };
      if (s.showTitles) {
        cards.forEach(card => {
          if (!card.item.text) return;
          const entry = pool[wrap(card.slot, pool.length)];
          used.add(entry);
          if (entry.slot !== card.slot || entry.text !== card.item.text) {
            entry.slot = card.slot;
            entry.text = card.item.text;
            entry.el.textContent = card.item.text;
          }
          if (entry.font !== font) {
            entry.font = font;
            entry.el.style.font = font;
          }
          const size = card.labelSize;
          const offset = card.h / 2 + size * 1.1;
          const x = card.x + Math.sin(card.angle) * offset;
          const y = card.y - Math.cos(card.angle) * offset;
          const cssX = view.width / 2 + x;
          const cssY = view.height / 2 - y;
          const edge = fade(cssX / view.width) * fade(1 - cssX / view.width);
          entry.el.style.fontSize = `${size}px`;
          entry.el.style.color = s.textColor;
          entry.el.style.transform = `translate(${cssX}px, ${cssY}px) translate(-50%, -50%) rotate(${-card.angle}rad)`;
          entry.el.style.opacity = String(card.alpha * card.labelAlpha * mix(edge, 1, card.focus));
        });
      }
      pool.forEach(entry => {
        if (used.has(entry)) return;
        if (entry.el.style.opacity !== '0') entry.el.style.opacity = '0';
      });
      const top = view.height / 2 - (metrics.openY - metrics.openH / 2) + metrics.titleSpace + 4;
      caption.style.transform = `translate(-50%, ${top}px)`;
      caption.style.opacity = String(ease(clamp((state.open - 0.5) / 0.5, 0, 1)));
      caption.style.color = s.textColor;
      if (caption.dataset.font !== font) {
        caption.dataset.font = font;
        caption.style.font = font;
        caption.style.fontWeight = '400';
      }
      caption.style.fontSize = `${captionSize() * 0.8}px`;
    };

    const nearest = () => Math.round(state.target / Math.max(state.spacing, 1));

    const setSlot = (slot, announce = true) => {
      const s = settingsRef.current;
      state.target = slot * state.spacing;
      if (slot !== state.active) {
        state.active = slot;
        const index = wrap(slot, s.items.length);
        if (announce) setActive(index);
        s.onActiveChange?.(index);
      }
      wake();
    };

    const openSlot = slot => {
      setSlot(slot);
      state.openTarget = 1;
      setOpen(true);
      wake();
    };

    const close = () => {
      state.openTarget = 0;
      setOpen(false);
      wake();
    };

    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
      last = now;
      if (s.items !== lastItems) {
        lastItems = s.items;
        prune(s.items);
        s.items.forEach(item => textureFor(item.image));
      }
      const idle = now - state.lastInput > 1800;
      const auto =
        s.autoScroll &&
        !reduce &&
        !state.drag &&
        state.open < 0.01 &&
        state.hovered === null &&
        !state.keyboard &&
        idle;
      if (auto) state.target += s.autoScroll * state.spacing * 0.25 * dt;
      const follow = reduce ? 1 : 1 - Math.pow(1 - s.scrollEase, dt * 60);
      const before = state.scroll;
      state.scroll += (state.target - state.scroll) * follow;
      if (Math.abs(state.target - state.scroll) < 0.05) state.scroll = state.target;
      const velocity = (state.scroll - before) / dt;
      state.velocity += (velocity - state.velocity) * (1 - Math.exp(-dt / 0.08));
      if (Math.abs(state.velocity) < 0.5) state.velocity = 0;
      state.waveTime += dt * 2.4;
      const openFollow = reduce ? 1 : 1 - Math.exp(-dt / 0.14);
      state.open += (state.openTarget - state.open) * openFollow;
      if (Math.abs(state.openTarget - state.open) < 0.001) state.open = state.openTarget;
      state.ring += ((state.keyboard ? 1 : 0) - state.ring) * (1 - Math.exp(-dt / 0.1));
      if (Math.abs((state.keyboard ? 1 : 0) - state.ring) < 0.002) state.ring = state.keyboard ? 1 : 0;
      if (state.intro < 1) state.intro = Math.min(1, state.intro + dt / INTRO_SECONDS);
      let settling = false;
      state.hover.forEach((value, slot) => {
        const goal = slot === state.hovered ? 1 : 0;
        const next = value + (goal - value) * (1 - Math.exp(-dt / 0.12));
        if (Math.abs(goal - next) < 0.002) {
          if (goal === 0) state.hover.delete(slot);
          else state.hover.set(slot, 1);
        } else {
          state.hover.set(slot, next);
          settling = true;
        }
      });
      if (state.openTarget > 0 && !state.focus.has(state.active)) state.focus.set(state.active, 0);
      state.focus.forEach((value, slot) => {
        const goal = state.openTarget > 0 && slot === state.active ? 1 : 0;
        const next = reduce ? goal : value + (goal - value) * (1 - Math.exp(-dt / 0.16));
        if (Math.abs(goal - next) < 0.001) {
          if (goal === 0) state.focus.delete(slot);
          else state.focus.set(slot, 1);
        } else {
          state.focus.set(slot, next);
          settling = true;
        }
      });
      textures.forEach(entry => {
        if (!entry.loaded || entry.ready >= 1) return;
        entry.ready = reduce ? 1 : Math.min(1, entry.ready + dt / 0.45);
        settling = true;
      });
      const slot = auto ? Math.round(state.scroll / Math.max(state.spacing, 1)) : nearest();
      if (slot !== state.active && !state.drag) {
        state.active = slot;
        const index = wrap(slot, s.items.length);
        setActive(index);
        s.onActiveChange?.(index);
      }
      const metrics = layout();
      draw(metrics);
      placeLabels(metrics);
      const moving =
        (s.autoScroll && !reduce) ||
        state.scroll !== state.target ||
        state.velocity !== 0 ||
        state.open !== state.openTarget ||
        state.intro < 1 ||
        (state.ring !== 0 && state.ring !== 1) ||
        settling;
      if (moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    const resize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      const before = state.spacing;
      const { spacing } = measure();
      if (before > 1 && spacing !== before) {
        state.scroll = (state.scroll / before) * spacing;
        state.target = (state.target / before) * spacing;
      }
      state.spacing = spacing;
      wake();
    };

    const point = event => {
      const rect = container.getBoundingClientRect();
      return { x: event.clientX - rect.left - rect.width / 2, y: rect.height / 2 - (event.clientY - rect.top) };
    };

    const hit = ({ x, y }) => {
      for (let i = cards.length - 1; i >= 0; i--) {
        const card = cards[i];
        if (card.alpha < 0.05) continue;
        const dx = x - card.x;
        const dy = y - card.y;
        const c = Math.cos(-card.angle);
        const s = Math.sin(-card.angle);
        const lx = c * dx - s * dy;
        const ly = s * dx + c * dy;
        if (Math.abs(lx) <= card.w / 2 && Math.abs(ly) <= card.h / 2) return card;
      }
      return null;
    };

    const setPointer = card => {
      const slot = card ? card.slot : null;
      if (slot !== state.hovered) {
        state.hovered = slot;
        if (slot !== null && !state.hover.has(slot)) state.hover.set(slot, 0);
        wake();
      }
      if (card) container.setAttribute('data-pointer', '');
      else container.removeAttribute('data-pointer');
    };

    const snapNow = () => {
      const s = settingsRef.current;
      if (!s.snap && state.open < 0.5) return;
      setSlot(nearest());
    };

    const onPointerDown = event => {
      if (event.button !== 0 || event.target.closest('[data-gallery-close]')) return;
      const p = point(event);
      state.drag = {
        id: event.pointerId,
        x0: event.clientX,
        y0: event.clientY,
        start: state.target,
        moved: false,
        samples: [],
        p
      };
      state.lastInput = performance.now();
      wake();
    };

    const onPointerMove = event => {
      const drag = state.drag;
      if (drag && drag.id === event.pointerId) {
        const dx = event.clientX - drag.x0;
        const dy = event.clientY - drag.y0;
        if (!drag.moved && Math.hypot(dx, dy) > 6) {
          if (Math.abs(dy) > Math.abs(dx) && event.pointerType !== 'mouse') {
            state.drag = null;
            return;
          }
          drag.moved = true;
          container.setPointerCapture?.(event.pointerId);
          container.setAttribute('data-dragging', '');
          setPointer(null);
        }
        if (drag.moved) {
          state.target = drag.start - dx * (settingsRef.current.scrollSpeed / 2);
          drag.samples.push({ x: event.clientX, t: performance.now() });
          if (drag.samples.length > 6) drag.samples.shift();
          state.lastInput = performance.now();
          wake();
        }
        return;
      }
      if (event.pointerType === 'mouse') setPointer(hit(point(event)));
    };

    const onPointerUp = event => {
      const drag = state.drag;
      if (!drag || drag.id !== event.pointerId) return;
      state.drag = null;
      container.removeAttribute('data-dragging');
      if (container.hasPointerCapture?.(event.pointerId)) container.releasePointerCapture(event.pointerId);
      if (drag.moved) {
        const samples = drag.samples;
        if (samples.length > 1) {
          const a = samples[0];
          const b = samples[samples.length - 1];
          const span = Math.max(b.t - a.t, 16);
          const speed = ((b.x - a.x) / span) * 1000;
          state.target -= speed * 0.18 * (settingsRef.current.scrollSpeed / 2);
        }
        snapNow();
        return;
      }
      const card = hit(drag.p);
      const s = settingsRef.current;
      if (!card) {
        if (state.open > 0.5) close();
        return;
      }
      s.onItemClick?.(card.item, card.index);
      if (!s.openOnClick) {
        setSlot(card.slot);
        return;
      }
      if (state.open > 0.5 && card.slot === state.active) close();
      else openSlot(card.slot);
    };

    const onPointerCancel = event => {
      if (state.drag && state.drag.id === event.pointerId) {
        state.drag = null;
        container.removeAttribute('data-dragging');
        snapNow();
      }
    };

    const onPointerLeave = () => {
      setPointer(null);
    };

    const onWheel = event => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.height : 1;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      state.target += delta * unit * (settingsRef.current.scrollSpeed / 2);
      state.lastInput = performance.now();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapNow, 140);
      wake();
    };

    const onKeyDown = event => {
      const s = settingsRef.current;
      const step = STEPS[event.key];
      state.lastInput = performance.now();
      if (step) {
        event.preventDefault();
        if (container.contains(document.activeElement) && document.activeElement !== container) state.keyboard = true;
        setSlot(nearest() + step);
        const index = wrap(state.active, s.items.length);
        if (container.contains(document.activeElement)) buttonsRef.current[index]?.focus({ preventScroll: true });
        return;
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const base = nearest() - wrap(nearest(), s.items.length);
        setSlot(event.key === 'Home' ? base : base + s.items.length - 1);
        return;
      }
      if (event.key === 'Escape' && state.openTarget > 0) {
        event.preventDefault();
        close();
      }
    };

    const onFocusIn = event => {
      if (!event.target.closest('[data-gallery-list]')) return;
      state.keyboard = typing || event.target.matches(':focus-visible');
      wake();
    };

    const onAnyKey = event => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) typing = true;
    };

    const onAnyPointer = () => {
      typing = false;
    };

    const onFocusOut = event => {
      if (container.contains(event.relatedTarget)) return;
      state.keyboard = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onAnyKey, true);
    document.addEventListener('pointerdown', onAnyPointer, true);
    lastItems = settingsRef.current.items;
    lastItems.forEach(item => textureFor(item.image));
    resize();

    const slotFor = index => {
      const count = settingsRef.current.items.length;
      const slot = nearest();
      const base = slot - wrap(slot, count) + index;
      return [base - count, base, base + count].reduce((best, value) =>
        Math.abs(value - slot) < Math.abs(best - slot) ? value : best
      );
    };

    engineRef.current = {
      wake,
      open: index => openSlot(slotFor(index)),
      focus: index => setSlot(slotFor(index), false),
      close
    };

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(snapTimer);
      engineRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onAnyKey, true);
      document.removeEventListener('pointerdown', onAnyPointer, true);
      labelLayer.replaceChildren();
      textures.forEach(entry => entry.texture && gl.deleteTexture(entry.texture));
      gl.deleteTexture(blank);
      gl.deleteProgram(program.program);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vao);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.wake();
  });

  const count = list.length;
  const current = list[active % count] || list[0];

  return (
    <div
      ref={containerRef}
      className={`${CLASSES.root}${className ? ` ${className}` : ''}`}
      style={{ color: textColor, ...style }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image gallery"
      {...rest}
    >
      <canvas ref={canvasRef} className={CLASSES.canvas} aria-hidden="true" />
      <div ref={labelsRef} className={CLASSES.labels} aria-hidden="true" />
      <div ref={captionRef} className={CLASSES.caption} aria-hidden={!open}>
        {current?.description && <p className={CLASSES.captionText}>{current.description}</p>}
      </div>
      <button
        type="button"
        className={CLASSES.close}
        data-gallery-close=""
        data-visible={open ? '' : undefined}
        tabIndex={open ? 0 : -1}
        aria-label="Close"
        onClick={() => engineRef.current?.close()}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <ul className={CLASSES.hidden} data-gallery-list="">
        {list.map((item, index) => (
          <li key={`${item.image}-${index}`}>
            <button
              type="button"
              ref={el => {
                buttonsRef.current[index] = el;
              }}
              tabIndex={index === active ? 0 : -1}
              aria-label={`${item.text || item.alt || 'Image'}, ${index + 1} of ${count}`}
              aria-current={index === active ? 'true' : undefined}
              onFocus={() => engineRef.current?.focus(index)}
              onClick={() => engineRef.current?.open(index)}
            >
              {item.text || item.alt || `Image ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
      <div className={CLASSES.hidden} aria-live="polite">
        {open && current ? `${current.text || current.alt || 'Image'} opened` : ''}
      </div>
    </div>
  );
};

export default CircularGallery;
```

### CSS komponen (`CircularGallery.css`)

```css
.circular-gallery {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
}

.circular-gallery[data-pointer] {
  cursor: pointer;
}

.circular-gallery[data-dragging] {
  cursor: grabbing;
}

.circular-gallery-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.circular-gallery-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circular-gallery-label {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 1.2;
  white-space: nowrap;
  will-change: transform, opacity;
}

.circular-gallery-caption {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(90%, 36rem);
  text-align: center;
  opacity: 0;
  pointer-events: none;
}

.circular-gallery-caption-text {
  margin: 0;
  line-height: 1.5;
  opacity: 0.65;
}

.circular-gallery-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.circular-gallery-close[data-visible] {
  opacity: 0.8;
  pointer-events: auto;
}

.circular-gallery-close:hover {
  opacity: 1;
}

.circular-gallery-close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.circular-gallery-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Langkah integrasi

1. Pasang dependensi yang tercantum (tidak ada untuk komponen ini).
2. Salin source komponen ke direktori proyek yang sesuai.
3. Impor file CSS bersama komponen.
4. Impor dan render komponen berdasarkan contoh penggunaan.
5. Sesuaikan props dengan kebutuhan.

### Referensi

Indeks lengkap pustaka React Bits tersedia di https://reactbits.dev/llms.txt.
