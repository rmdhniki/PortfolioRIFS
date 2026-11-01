import type { createClient } from "./server";

const MB = 1024 * 1024;

const RULES = {
  image: {
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>,
    maxBytes: 8 * MB,
    label: "Gambar harus berformat JPG, PNG, atau WebP",
  },
  pdf: {
    types: { "application/pdf": "pdf" } as Record<string, string>,
    maxBytes: 5 * MB,
    label: "File harus berformat PDF",
  },
};

export type UploadKind = keyof typeof RULES;

export function validateUpload(file: File, kind: UploadKind = "image"): string | null {
  const rule = RULES[kind];
  if (!rule.types[file.type]) {
    return `${rule.label} (file "${file.name}" bertipe ${file.type || "tidak dikenal"}).`;
  }
  if (file.size > rule.maxBytes) {
    return `Ukuran file "${file.name}" ${(file.size / MB).toFixed(1)}MB, maksimal ${rule.maxBytes / MB}MB.`;
  }
  return null;
}

export async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  file: File,
  pathPrefix: string,
  kind: UploadKind = "image"
): Promise<string> {
  const invalid = validateUpload(file, kind);
  if (invalid) throw new Error(invalid);

  const ext = RULES[kind].types[file.type];
  const path = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Upload file gagal: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
