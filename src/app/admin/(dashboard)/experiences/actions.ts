"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { experienceSchema } from "@/lib/validations/site-settings";

export type ExperienceFormState = { error: string } | null;

export async function saveExperience(
  id: string | null,
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { supabase } = await requireAdmin();
  const { error } = id
    ? await supabase.from("experiences").update(parsed.data).eq("id", id)
    : await supabase
        .from("experiences")
        .insert({ ...parsed.data, period: "", image_url: null });

  if (error) return { error: error.message };

  revalidatePath("/admin/experiences");
  revalidatePath("/");
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiences");
  revalidatePath("/");
}
