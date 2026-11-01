import { createClient } from "./client";
import { objectPath, validateUpload, type Bucket, type UploadKind } from "./storage";

/**
 * Upload a file from the browser directly to Supabase Storage using the
 * admin's own session (Storage RLS checks `is_admin()`), and return its
 * public URL. Bypasses the Next.js server, so file size never hits Vercel's
 * 4.5MB request body limit.
 */
export async function uploadToStorage(
  file: File,
  bucket: Bucket,
  prefix: string,
  kind: UploadKind = "image"
): Promise<string> {
  const invalid = validateUpload(file, kind);
  if (invalid) throw new Error(invalid);

  const supabase = createClient();
  const path = objectPath(prefix, file, kind);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });

  if (error) {
    const denied = /row-level security|unauthorized|not allowed|403/i.test(error.message);
    throw new Error(
      denied
        ? "Upload ditolak: sesi admin berakhir atau akun bukan admin. Coba login ulang."
        : `Upload gagal: ${error.message}`
    );
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Downscale and re-encode an image in the browser so uploads stay small and
 * WebGL textures stay light. Small images that are already compact are
 * returned untouched.
 */
export async function compressImage(file: File, maxDimension: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
