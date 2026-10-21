"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/supabase/storage";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SettingsFormState = { error: string; success?: boolean } | null;

async function resolveImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  fieldName: string,
  pathPrefix: string
): Promise<string | undefined> {
  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) return undefined;
  return uploadFile(supabase, "site-assets", file, pathPrefix);
}

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

  let portraitUrl: string | undefined;
  let workspaceUrl: string | undefined;
  try {
    portraitUrl = await resolveImage(supabase, formData, "portrait_image", "portrait");
    workspaceUrl = await resolveImage(supabase, formData, "workspace_image", "workspace");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      ...parsed.data,
      ...(portraitUrl !== undefined ? { portrait_image_url: portraitUrl } : {}),
      ...(workspaceUrl !== undefined ? { workspace_image_url: workspaceUrl } : {}),
    })
    .eq("id", 1);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: "", success: true };
}
