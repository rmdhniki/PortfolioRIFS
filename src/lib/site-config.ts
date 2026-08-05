export const siteConfig = {
  name: "Muhammad Rifki Ramadhani",
  brand: "RIFS.",
  role: "Fullstack Developer",
  roles: [
    "Freelancer",
    "Fullstack Developer",
    "Software Engineer",
    "Data Analyst",
  ],
  tagline:
    "Membangun pengalaman digital yang rapi, cepat, dan elegan — dari backend sampai antarmuka.",
  email: "rmdhniki18@gmail.com",
  location: "Bandung, Indonesia",
  availableForWork: true,
} as const;

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
] as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/placeholder", icon: "linkedin" },
  { label: "Github", href: "https://github.com/placeholder", icon: "github" },
  { label: "Gitlab", href: "https://gitlab.com/placeholder", icon: "gitlab" },
] as const;

export const aboutContent = {
  title: "About Me",
  education: "S1 Teknik Informatika, Universitas Pasundan",
  description:
    "Saya adalah seorang Fullstack Developer yang senang mengubah ide menjadi produk digital yang fungsional dan enak dipakai. Berpengalaman membangun aplikasi web dari sisi backend hingga antarmuka, dengan perhatian besar pada detail, performa, dan pengalaman pengguna.",
  stats: [
    { label: "Years of Experience", value: 2, suffix: "+" },
    { label: "Completed Projects", value: 15, suffix: "+" },
    { label: "Technologies", value: 12, suffix: "+" },
  ],
} as const;

export const techStack = {
  row1: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Laravel", "Flutter"],
  row2: ["PHP", "Dart", "MySQL", "SQLite", "Git", "Github"],
} as const;

export const serviceOptions = [
  "Buatin Web",
  "Buatin Mobile App",
  "Data Analyst",
  "Lainnya",
] as const;

export const services = [
  {
    title: "Web Development",
    description:
      "Membangun aplikasi web full-stack yang cepat, aman, dan mudah dikembangkan — dari database sampai antarmuka.",
  },
  {
    title: "Mobile Development",
    description:
      "Membuat aplikasi mobile lintas platform dengan Flutter yang ringan, responsif, dan enak dipakai sehari-hari.",
  },
  {
    title: "Backend & API",
    description:
      "Merancang REST API dan arsitektur backend yang scalable menggunakan Laravel serta database relasional.",
  },
  {
    title: "UI/UX Design",
    description:
      "Mendesain antarmuka yang intuitif, menjembatani kebutuhan bisnis dengan pengalaman pengguna yang nyaman.",
  },
] as const;
