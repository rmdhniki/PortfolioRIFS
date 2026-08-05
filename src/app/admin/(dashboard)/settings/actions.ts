"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SettingsFormState = { error: string; success?: boolean } | null;

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: "", success: true };
}
