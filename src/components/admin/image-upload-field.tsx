"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { UPLOADING_FIELD, type Bucket } from "@/lib/supabase/storage";
import { compressImage, uploadToStorage } from "@/lib/supabase/upload-client";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

/**
 * Image picker that compresses the image in the browser and uploads it
 * straight to Supabase Storage as soon as it is chosen. The form only submits
 * the resulting public URL (hidden input `name`), never the file itself.
 */
export function ImageUploadField({
  name,
  bucket,
  prefix,
  label,
  hint,
  currentUrl,
  maxDimension = 2000,
  previewClassName = "h-40 w-full",
}: {
  /** Form field that receives the uploaded file's public URL. */
  name: string;
  bucket: Bucket;
  /** File name prefix in storage, e.g. "hero" or the project slug. */
  prefix: string;
  label?: string;
  hint?: string;
  currentUrl?: string | null;
  maxDimension?: number;
  previewClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentFailed, setCurrentFailed] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const reset = (message: string) => {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setUploadedUrl("");
    setInfo(null);
    setError(message);
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    setError(null);
    setInfo(null);
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      reset(`Format "${file.type || file.name.split(".").pop()}" tidak didukung. Gunakan JPG, PNG, atau WebP.`);
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reset(`File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 25MB.`);
      return;
    }

    setBusy(true);
    setUploadedUrl("");
    try {
      const output = await compressImage(file, maxDimension);
      setPreview(URL.createObjectURL(output));
      const url = await uploadToStorage(output, bucket, prefix);
      setUploadedUrl(url);
      setInfo(
        output !== file
          ? `Terunggah (dikompres ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(output.size / 1024 / 1024).toFixed(1)}MB). Klik simpan untuk menerapkan.`
          : "Terunggah. Klik simpan untuk menerapkan."
      );
    } catch (err) {
      reset(err instanceof Error ? err.message : "Gambar tidak bisa diunggah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  const shown = preview ?? (currentUrl && !currentFailed ? currentUrl : null);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={uploadedUrl} />
      {busy && <input type="hidden" name={UPLOADING_FIELD} value="1" />}

      {label && <p className="text-sm font-medium text-zinc-200">{label}</p>}
      <div className={`relative overflow-hidden rounded-xl bg-zinc-950 ${previewClassName}`}>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: previews are not supported by next/image
          <img
            src={shown}
            alt=""
            onError={() => !preview && setCurrentFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-zinc-600">
            {currentUrl && currentFailed ? "Gambar tersimpan gagal dimuat" : "Belum ada gambar"}
          </div>
        )}
        {preview && !busy && (
          <span className="absolute top-2 left-2 rounded-md bg-caramel px-2 py-0.5 text-[10px] font-medium text-zinc-950">
            Baru, belum disimpan
          </span>
        )}
        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/70 text-xs text-zinc-300">
            <Loader2 className="size-5 animate-spin" />
            Mengunggah…
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        id={name}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onChange}
        disabled={busy}
        className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-200"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {info && <p className="text-xs text-emerald-400">{info}</p>}
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}
