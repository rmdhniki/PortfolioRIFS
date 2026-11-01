/**
 * Shared (browser + server) storage rules.
 *
 * Files are uploaded straight from the admin's browser to Supabase Storage
 * (see `upload-client.ts`), so Server Actions only ever receive short public
 * URLs. This keeps every request far below Vercel's 4.5MB function body limit.
 * Storage RLS (`is_admin()`) still decides who may upload.
 */

const MB = 1024 * 1024;

export type Bucket = "project-images" | "site-assets";

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

/** Unique object path, e.g. `hero-1730000000000-k3j9x2.webp`. */
export function objectPath(prefix: string, file: File, kind: UploadKind = "image"): string {
  const ext = RULES[kind].types[file.type];
  const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 60) || "file";
  return `${safePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

function publicPrefix(bucket: Bucket): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${bucket}/`;
}

/**
 * Server-side check that a URL sent by a form really points at one of our own
 * storage objects, so a forged request can't store arbitrary URLs.
 */
export function isStorageUrl(url: string, bucket: Bucket, kind: UploadKind = "image"): boolean {
  const prefix = publicPrefix(bucket);
  if (!url.startsWith(prefix)) return false;
  const path = url.slice(prefix.length);
  const exts = Object.values(RULES[kind].types);
  return /^[a-z0-9-]+\.[a-z0-9]+$/.test(path) && exts.some((ext) => path.endsWith(`.${ext}`));
}

/**
 * Reads an uploaded-file URL field from a form.
 * - `undefined`: field empty → keep the current value.
 * - `string`: a valid storage URL to save.
 * - `{ error }`: something that isn't one of our storage URLs.
 */
export function readUploadedUrl(
  formData: FormData,
  field: string,
  bucket: Bucket,
  kind: UploadKind = "image"
): string | undefined | { error: string } {
  const raw = formData.get(field);
  if (typeof raw !== "string" || raw.trim() === "") return undefined;
  const url = raw.trim();
  return isStorageUrl(url, bucket, kind) ? url : { error: "URL file tidak valid. Unggah ulang filenya." };
}

/** Name of the hidden field an upload widget renders while its upload is still running. */
export const UPLOADING_FIELD = "__uploading";

export function pendingUploadError(formData: FormData): string | null {
  return formData.has(UPLOADING_FIELD)
    ? "Masih ada file yang sedang diunggah. Tunggu sampai selesai, lalu simpan lagi."
    : null;
}
