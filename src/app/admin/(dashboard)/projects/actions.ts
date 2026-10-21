"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/supabase/storage";
import { projectSchema } from "@/lib/validations/project";

export type ProjectFormState = { error: string; fieldErrors?: Record<string, string> } | null;

async function resolveImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  slug: string
): Promise<string | null | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return uploadFile(supabase, "project-images", file, slug);
}

async function resolveGallery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  slug: string
): Promise<string[]> {
  const existingRaw = formData.get("gallery_existing");
  let kept: string[] = [];
  if (typeof existingRaw === "string" && existingRaw.trim()) {
    try {
      const parsed = JSON.parse(existingRaw);
      if (Array.isArray(parsed)) kept = parsed.filter((v) => typeof v === "string");
    } catch {
      kept = [];
    }
  }

  const newFiles = formData
    .getAll("gallery_new")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const uploaded = await Promise.all(
    newFiles.map((file) => uploadFile(supabase, "project-images", file, `${slug}-gallery`))
  );

  return [...kept, ...uploaded];
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
  let gallery: string[] = [];
  try {
    imageUrl = (await resolveImage(supabase, formData, parsed.data.slug)) ?? null;
    gallery = await resolveGallery(supabase, formData, parsed.data.slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    github: parsed.data.github || null,
    demo: parsed.data.demo || null,
    image_url: imageUrl,
    gallery,
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
  let gallery: string[];
  try {
    imageUrl = await resolveImage(supabase, formData, parsed.data.slug);
    gallery = await resolveGallery(supabase, formData, parsed.data.slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gambar gagal." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      github: parsed.data.github || null,
      demo: parsed.data.demo || null,
      gallery,
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
