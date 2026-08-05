"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations/project";

export type ProjectFormState = { error: string; fieldErrors?: Record<string, string> } | null;

async function uploadImageIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  slug: string
): Promise<string | null | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return undefined;

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Upload gambar gagal: ${error.message}`);
  }

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return projectSchema.safeParse(raw);
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Periksa kembali isian form.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
      ),
    };
  }

  const supabase = await createClient();

  let imageUrl: string | null = null;
  try {
    imageUrl = (await uploadImageIfPresent(supabase, formData, parsed.data.slug)) ?? null;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    github: parsed.data.github || null,
    demo: parsed.data.demo || null,
    image_url: imageUrl,
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
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Periksa kembali isian form.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
      ),
    };
  }

  const supabase = await createClient();

  let imageUrl: string | null | undefined;
  try {
    imageUrl = await uploadImageIfPresent(supabase, formData, parsed.data.slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      github: parsed.data.github || null,
      demo: parsed.data.demo || null,
      ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
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
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
}
