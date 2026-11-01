"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { uploadFile } from "@/lib/supabase/storage";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export type PhotosFormState = { error: string; success?: boolean } | null;

const photoFields = [
  ["hero_image", "hero", "hero_image_url"],
  ["services_image", "services", "services_image_url"],
  ["about_front_image", "about-front", "about_front_image_url"],
  ["about_back_image", "about-back", "about_back_image_url"],
  ["lanyard_strap_image", "lanyard-strap", "lanyard_strap_image_url"],
] as const;

export async function updatePhotos(
  _prevState: PhotosFormState,
  formData: FormData
): Promise<PhotosFormState> {
  const { supabase } = await requireAdmin();
  const images: Partial<SiteSettingsRow> = {};

  try {
    for (const [field, prefix, column] of photoFields) {
      const file = formData.get(field);
      if (file instanceof File && file.size > 0) {
        images[column] = await uploadFile(supabase, "site-assets", file, prefix);
      }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  if (Object.keys(images).length === 0) {
    return { error: "Pilih minimal satu gambar untuk diunggah." };
  }

  const { error } = await supabase.from("site_settings").update(images).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/photos");
  revalidatePath("/");
  return { error: "", success: true };
}
