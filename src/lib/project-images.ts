import type { ProjectRow } from "@/lib/supabase/types";

/**
 * True for strings that are actual image URLs. Older/seed rows store Tailwind
 * gradient classes (e.g. "from-[#d9b48a] to-[#6f4a2f]") in `gallery`, which
 * would crash `next/image`.
 */
export function isImageUrl(value: string | null | undefined): value is string {
  return typeof value === "string" && /^(https?:\/\/|\/)/.test(value.trim());
}

/** Only the real image URLs from a project's gallery. */
export function galleryImages(gallery: readonly string[]): string[] {
  return gallery.filter(isImageUrl);
}

/** Cover image first, then the gallery — de-duplicated, image URLs only. */
export function projectSlides(project: Pick<ProjectRow, "image_url" | "gallery">): string[] {
  const all = [project.image_url, ...project.gallery].filter(isImageUrl);
  return [...new Set(all)];
}
