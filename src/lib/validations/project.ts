import { z } from "zod";

function linesToArray(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip"),
  title: z.string().trim().min(1, "Judul wajib diisi"),
  category: z.string().trim().min(1, "Kategori wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi singkat wajib diisi"),
  gradient: z.string().trim().min(1, "Gradient wajib diisi"),
  tech: z.preprocess(linesToArray, z.array(z.string()).min(1, "Minimal 1 teknologi")),
  year: z.string().trim().min(1, "Tahun wajib diisi"),
  industry: z.string().trim().min(1, "Industri wajib diisi"),
  client: z.string().trim().min(1, "Klien wajib diisi"),
  duration: z.string().trim().min(1, "Durasi wajib diisi"),
  overview: z.string().trim().min(1, "Overview wajib diisi"),
  problem: z.string().trim().min(1, "Problem wajib diisi"),
  solution: z.string().trim().min(1, "Solution wajib diisi"),
  features: z.preprocess(linesToArray, z.array(z.string()).min(1, "Minimal 1 fitur")),
  github: z.string().trim().url("URL tidak valid").optional().or(z.literal("")),
  demo: z.string().trim().url("URL tidak valid").optional().or(z.literal("")),
  order_index: z.coerce.number().int().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
