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
  roles: z.preprocess(linesToArray, z.array(z.string()).min(1, "Minimal 1 role")),
  tagline: z.string().trim().min(1, "Tagline wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  location: z.string().trim().min(1, "Lokasi wajib diisi"),
  available_for_work: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  about_title: z.string().trim().min(1),
  about_education: z.string().trim().min(1),
  about_description: z.string().trim().min(1),
  stats: z.preprocess(parseJsonArray, z.array(statItemSchema)),
  services: z.preprocess(parseJsonArray, z.array(serviceItemSchema)),
  tech_stack_row1: z.preprocess(linesToArray, z.array(z.string())),
  tech_stack_row2: z.preprocess(linesToArray, z.array(z.string())),
  social_links: z.preprocess(parseJsonArray, z.array(socialLinkSchema)),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
