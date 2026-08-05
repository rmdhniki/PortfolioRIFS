export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  gradient: string;
  tech: string[];
  year: string;
  industry: string;
  client: string;
  duration: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  gallery: string[];
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "commerce-nova",
    title: "Commerce Nova",
    category: "Fullstack Development",
    description:
      "Platform e-commerce dengan dashboard admin real-time, dibangun untuk performa cepat dan skalabilitas.",
    gradient: "from-[#d9b48a] via-[#eadfc8] to-[#6f4a2f]",
    tech: ["Laravel", "React", "MySQL", "Tailwind CSS"],
    year: "2025",
    industry: "E-commerce",
    client: "Personal Project",
    duration: "6 minggu",
    overview:
      "Commerce Nova adalah platform belanja online full-stack yang mencakup katalog produk, keranjang, checkout, dan dashboard admin untuk manajemen pesanan.",
    problem:
      "Toko kecil sering kesulitan mengelola stok dan pesanan lewat spreadsheet manual, menyebabkan kesalahan data dan lambatnya respon ke pelanggan.",
    solution:
      "Dibangun sistem terintegrasi dengan dashboard real-time, notifikasi stok menipis, dan alur checkout yang disederhanakan menjadi tiga langkah.",
    features: [
      "Autentikasi & role admin",
      "Dashboard analitik penjualan",
      "Manajemen stok real-time",
      "Integrasi payment gateway",
    ],
    gallery: ["from-[#d9b48a] to-[#6f4a2f]", "from-[#eadfc8] to-[#b4855a]"],
    github: "https://github.com/placeholder/commerce-nova",
    demo: "https://commerce-nova.vercel.app",
  },
  {
    slug: "kasir-flow",
    title: "KasirFlow POS",
    category: "Mobile Development",
    description:
      "Aplikasi kasir mobile lintas platform untuk UMKM, mendukung mode offline dan sinkronisasi otomatis.",
    gradient: "from-[#8a6a4a] via-[#c9a876] to-[#3a2a1c]",
    tech: ["Flutter", "Dart", "SQLite", "Firebase"],
    year: "2024",
    industry: "Retail & F&B",
    client: "UMKM Lokal",
    duration: "8 minggu",
    overview:
      "KasirFlow adalah aplikasi Point of Sale untuk pelaku UMKM yang berjalan di Android dan tetap dapat mencatat transaksi tanpa koneksi internet.",
    problem:
      "Pemilik warung membutuhkan pencatatan transaksi yang cepat namun koneksi internet di lokasi sering tidak stabil.",
    solution:
      "Menerapkan penyimpanan lokal dengan SQLite dan mekanisme sinkronisasi otomatis ke server saat koneksi tersedia kembali.",
    features: [
      "Mode offline penuh",
      "Cetak struk via Bluetooth printer",
      "Laporan penjualan harian",
      "Manajemen multi-outlet",
    ],
    gallery: ["from-[#8a6a4a] to-[#3a2a1c]", "from-[#c9a876] to-[#8a6a4a]"],
    github: "https://github.com/placeholder/kasirflow",
  },
  {
    slug: "dataviz-insight",
    title: "DataViz Insight",
    category: "Data Analysis",
    description:
      "Dashboard analitik data untuk memvisualisasikan tren penjualan dan perilaku pelanggan secara interaktif.",
    gradient: "from-[#b4855a] via-[#f3ead9] to-[#5b3a24]",
    tech: ["Python", "React", "PostgreSQL", "Chart.js"],
    year: "2024",
    industry: "Business Intelligence",
    client: "Studi Kasus",
    duration: "4 minggu",
    overview:
      "DataViz Insight mengolah data transaksi mentah menjadi visualisasi interaktif yang membantu pengambilan keputusan bisnis.",
    problem:
      "Data transaksi menumpuk di banyak file terpisah tanpa ada cara cepat untuk melihat tren dan pola pembelian.",
    solution:
      "Membangun pipeline pembersihan data otomatis dan dashboard interaktif dengan filter multi-dimensi.",
    features: [
      "Filter data multi-dimensi",
      "Ekspor laporan ke PDF/Excel",
      "Prediksi tren sederhana",
      "Visualisasi peta sebaran pelanggan",
    ],
    gallery: ["from-[#b4855a] to-[#5b3a24]", "from-[#f3ead9] to-[#b4855a]"],
    demo: "https://dataviz-insight.vercel.app",
  },
  {
    slug: "studio-folio",
    title: "Studio Folio CMS",
    category: "UI/UX & Web Design",
    description:
      "Sistem manajemen konten ringan untuk agensi kreatif, dengan editor drag-and-drop dan tema yang bisa dikustomisasi.",
    gradient: "from-[#6f4a2f] via-[#d9b48a] to-[#2b1d13]",
    tech: ["Next.js", "PHP", "MySQL", "Framer Motion"],
    year: "2023",
    industry: "Creative Agency",
    client: "Studi Kasus",
    duration: "5 minggu",
    overview:
      "Studio Folio CMS memudahkan tim kreatif mengelola portofolio klien tanpa perlu menyentuh kode.",
    problem:
      "Update portofolio klien selalu bergantung pada developer, memperlambat proses publikasi konten baru.",
    solution:
      "Merancang editor visual drag-and-drop dengan sistem tema yang bisa dikonfigurasi tanpa kode.",
    features: [
      "Editor drag-and-drop",
      "Manajemen multi-tema",
      "Preview real-time",
      "Role-based access",
    ],
    gallery: ["from-[#6f4a2f] to-[#2b1d13]", "from-[#d9b48a] to-[#6f4a2f]"],
    github: "https://github.com/placeholder/studio-folio",
    demo: "https://studio-folio.vercel.app",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return projects[0];
  return projects[(index + 1) % projects.length];
}
