"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { pendingUploadError, readUploadedUrl } from "@/lib/supabase/storage";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export type PhotosFormState = { error: string; success?: boolean } | null;

/** Form field (holding the uploaded URL) → site_settings column. */
const photoFields = [
  ["hero_image", "hero_image_url"],
  ["services_image", "services_image_url"],
  ["about_front_image", "about_front_image_url"],
  ["about_back_image", "about_back_image_url"],
  ["lanyard_strap_image", "lanyard_strap_image_url"],
] as const;

export async function updatePhotos(
  _prevState: PhotosFormState,
  formData: FormData
): Promise<PhotosFormState> {
  const pending = pendingUploadError(formData);
  if (pending) return { error: pending };

  const images: Partial<SiteSettingsRow> = {};
  for (const [field, column] of photoFields) {
    const url = readUploadedUrl(formData, field, "site-assets");
    if (typeof url === "object") return { error: url.error };
    if (url) images[column] = url;
  }

  if (Object.keys(images).length === 0) {
    return { error: "Pilih minimal satu gambar untuk diunggah." };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_settings").update(images).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/photos");
  revalidatePath("/", "layout");
  return { error: "", success: true };
}
