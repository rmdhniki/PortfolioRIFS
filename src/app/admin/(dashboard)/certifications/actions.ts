"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { pendingUploadError, readUploadedUrl } from "@/lib/supabase/storage";
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

  const pending = pendingUploadError(formData);
  if (pending) return { error: pending };

  const image = readUploadedUrl(formData, "image_url", "site-assets");
  if (typeof image === "object") return { error: image.error };
  const imageUrl = image;

  const { supabase } = await requireAdmin();

  const values = { ...parsed.data, verify_url: parsed.data.verify_url || null };

  const { error } = id
    ? await supabase
        .from("certifications")
        .update({ ...values, ...(imageUrl !== undefined ? { image_url: imageUrl } : {}) })
        .eq("id", id)
    : await supabase.from("certifications").insert({ ...values, image_url: imageUrl ?? null });

  if (error) return { error: error.message };

  revalidatePath("/admin/certifications");
  revalidatePath("/", "layout");
  redirect("/admin/certifications");
}

export async function deleteCertification(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/", "layout");
}
