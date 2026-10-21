import type { createClient } from "./server";

export async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  file: File,
  pathPrefix: string
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Upload gambar gagal: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
