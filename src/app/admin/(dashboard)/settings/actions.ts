"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SettingsFormState = { error: string; success?: boolean } | null;

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue ? `${issue.path.join(".")}: ${issue.message}` : "Data tidak valid." };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update(parsed.data)
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { error: "", success: true };
}
