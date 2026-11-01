"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { techStackSchema } from "@/lib/validations/site-settings";

export type TechStackFormState = { error: string; success?: boolean } | null;

export async function updateTechStack(
  _prevState: TechStackFormState,
  formData: FormData
): Promise<TechStackFormState> {
  const parsed = techStackSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      tech_stack_row1: parsed.data.row1,
      tech_stack_row2: parsed.data.row2,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/tech-stack");
  revalidatePath("/");
  return { error: "", success: true };
}
