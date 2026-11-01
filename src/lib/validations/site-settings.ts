import { z } from "zod";

function linesToArray(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseJsonArray(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

const statItemSchema = z.object({
  label: z.string().trim().min(1),
  value: z.coerce.number(),
  suffix: z.string().trim(),
});

const serviceItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const socialLinkSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().url("URL tidak valid"),
  icon: z.string().trim().min(1),
});

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  brand: z.string().trim().min(1, "Brand wajib diisi"),
  role: z.string().trim().min(1, "Role wajib diisi"),
  tagline: z.string().trim().min(1, "Tagline wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  location: z.string().trim().min(1, "Lokasi wajib diisi"),
  available_for_work: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  about_title: z.string().trim().min(1),
  about_education: z.string().trim().min(1),
  about_description: z.string().trim().min(1),
  stats: z.preprocess(parseJsonArray, z.array(statItemSchema)),
  services: z.preprocess(parseJsonArray, z.array(serviceItemSchema)),
  social_links: z.preprocess(parseJsonArray, z.array(socialLinkSchema)),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const heroSchema = z.object({
  roles: z.preprocess(linesToArray, z.array(z.string()).min(1, "Minimal 1 role")),
});

export const techStackSchema = z.object({
  row1: z.preprocess(linesToArray, z.array(z.string())),
  row2: z.preprocess(linesToArray, z.array(z.string())),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi"),
  description: z.string().trim().default(""),
  credential_id: z.string().trim().default(""),
  verify_url: z.string().trim().url("URL tidak valid").optional().or(z.literal("")),
  is_visible: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  order_index: z.coerce.number().int().default(0),
});

const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean());
const monthInput = z
  .string()
  .trim()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format bulan tidak valid");

/** Form fields use <input type="month"> (YYYY-MM); the DB stores the first day of that month. */
export const experienceSchema = z
  .object({
    role: z.string().trim().min(1, "Posisi wajib diisi"),
    company: z.string().trim().min(1, "Perusahaan wajib diisi"),
    description: z.string().trim().default(""),
    start_month: monthInput,
    end_month: monthInput.optional().or(z.literal("")),
    is_current: checkbox,
    is_visible: checkbox,
    order_index: z.coerce.number().int().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.is_current) return;
    if (!data.end_month) {
      ctx.addIssue({
        code: "custom",
        path: ["end_month"],
        message: "Isi bulan selesai atau centang \"Masih berjalan\"",
      });
    } else if (data.end_month < data.start_month) {
      ctx.addIssue({
        code: "custom",
        path: ["end_month"],
        message: "Bulan selesai tidak boleh sebelum bulan mulai",
      });
    }
  })
  .transform(({ start_month, end_month, ...rest }) => ({
    ...rest,
    start_date: `${start_month}-01`,
    end_date: rest.is_current || !end_month ? null : `${end_month}-01`,
  }));
