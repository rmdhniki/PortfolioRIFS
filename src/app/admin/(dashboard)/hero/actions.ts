"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { uploadFile } from "@/lib/supabase/storage";
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

  const { supabase } = await requireAdmin();
  const file = formData.get("cv");
  let cvUrl: string | null | undefined;

  if (file instanceof File && file.size > 0) {
    try {
      cvUrl = await uploadFile(supabase, "site-assets", file, "cv", "pdf");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Upload CV gagal." };
    }
  }

  if (formData.get("remove_cv") === "on") {
    cvUrl = null;
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      roles: parsed.data.roles,
      ...(cvUrl !== undefined ? { cv_url: cvUrl } : {}),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { error: "", success: true };
}
