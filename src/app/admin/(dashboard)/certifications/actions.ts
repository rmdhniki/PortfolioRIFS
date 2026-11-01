"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { uploadFile } from "@/lib/supabase/storage";
import { certificationSchema } from "@/lib/validations/site-settings";

export type CertificationFormState = { error: string } | null;

export async function saveCertification(
  id: string | null,
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const parsed = certificationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue ? `${issue.path.join(".")}: ${issue.message}` : "Data tidak valid." };
  }

  const { supabase } = await requireAdmin();
  const file = formData.get("image");
  let imageUrl: string | undefined;

  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadFile(supabase, "site-assets", file, "certificate");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
    }
  }

  const values = { ...parsed.data, verify_url: parsed.data.verify_url || null };

  const { error } = id
    ? await supabase
        .from("certifications")
        .update({ ...values, ...(imageUrl !== undefined ? { image_url: imageUrl } : {}) })
        .eq("id", id)
    : await supabase.from("certifications").insert({ ...values, image_url: imageUrl ?? null });

  if (error) return { error: error.message };

  revalidatePath("/admin/certifications");
  revalidatePath("/");
  redirect("/admin/certifications");
}

export async function deleteCertification(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/");
}
