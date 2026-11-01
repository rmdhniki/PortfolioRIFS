"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { isStorageUrl, pendingUploadError, readUploadedUrl } from "@/lib/supabase/storage";
import { projectSchema } from "@/lib/validations/project";

export type ProjectFormState = { error: string; fieldErrors?: Record<string, string> } | null;

/** Ordered gallery URLs from the hidden `gallery` field; anything that isn't our storage URL is dropped. */
function readGallery(formData: FormData): string[] {
  const raw = formData.get("gallery");
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string" && isStorageUrl(v, "project-images"));
  } catch {
    return [];
  }
}

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return projectSchema.safeParse(raw);
}

function invalidForm(parsed: ReturnType<typeof parseForm>): ProjectFormState {
  if (parsed.success) return null;
  return {
    error: "Periksa kembali isian form.",
    fieldErrors: Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
    ),
  };
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const pending = pendingUploadError(formData);
  if (pending) return { error: pending };

  const parsed = parseForm(formData);
  if (!parsed.success) return invalidForm(parsed);

  const image = readUploadedUrl(formData, "image_url", "project-images");
  if (typeof image === "object") return { error: image.error };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    github: parsed.data.github || null,
    demo: parsed.data.demo || null,
    image_url: image ?? null,
    gallery: readGallery(formData),
  });

  if (error) {
    return { error: error.message.includes("duplicate") ? "Slug sudah dipakai project lain." : error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const pending = pendingUploadError(formData);
  if (pending) return { error: pending };

  const parsed = parseForm(formData);
  if (!parsed.success) return invalidForm(parsed);

  const image = readUploadedUrl(formData, "image_url", "project-images");
  if (typeof image === "object") return { error: image.error };

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      github: parsed.data.github || null,
      demo: parsed.data.demo || null,
      gallery: readGallery(formData),
      ...(image !== undefined ? { image_url: image } : {}),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message.includes("duplicate") ? "Slug sudah dipakai project lain." : error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath(`/project/${parsed.data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
}
