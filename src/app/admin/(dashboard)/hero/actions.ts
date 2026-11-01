"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { pendingUploadError, readUploadedUrl } from "@/lib/supabase/storage";
import { heroSchema } from "@/lib/validations/site-settings";

export type HeroFormState = { error: string; success?: boolean } | null;

export async function updateHero(
  _prevState: HeroFormState,
  formData: FormData
): Promise<HeroFormState> {
  const parsed = heroSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const pending = pendingUploadError(formData);
  if (pending) return { error: pending };

  const uploaded = readUploadedUrl(formData, "cv_url", "site-assets", "pdf");
  if (typeof uploaded === "object") return { error: uploaded.error };
  let cvUrl: string | null | undefined = uploaded;

  if (formData.get("remove_cv") === "on") {
    cvUrl = null;
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("site_settings")
    .update({
      roles: parsed.data.roles,
      ...(cvUrl !== undefined ? { cv_url: cvUrl } : {}),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/hero");
  revalidatePath("/", "layout");
  return { error: "", success: true };
}
