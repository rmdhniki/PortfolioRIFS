"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

/**
 * Downscale and re-encode an image in the browser so uploads stay small
 * (well under the server action body limit) and WebGL textures stay light.
 * Small images that are already compact are returned untouched.
 */
async function compressImage(file: File, maxDimension: number): Promise<File> {
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

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86)
  );
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

export function ImageUploadField({
  name,
  label,
  hint,
  currentUrl,
  maxDimension = 2000,
  previewClassName = "h-40 w-full",
}: {
  name: string;
  label?: string;
  hint?: string;
  currentUrl?: string | null;
  maxDimension?: number;
  previewClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    setInfo(null);
    setError(message);
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    setError(null);
    setInfo(null);
    if (!file) {
      setPreview(null);
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      reset(
        `Format "${file.type || file.name.split(".").pop()}" tidak didukung. Gunakan JPG, PNG, atau WebP.`
      );
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reset(`File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 25MB.`);
      return;
    }

    setBusy(true);
    try {
      const output = await compressImage(file, maxDimension);
      const transfer = new DataTransfer();
      transfer.items.add(output);
      input.files = transfer.files;
      setPreview(URL.createObjectURL(output));
      if (output !== file) {
        setInfo(
          `Dikompres ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(output.size / 1024 / 1024).toFixed(1)}MB.`
        );
      }
    } catch {
      reset("Gambar tidak bisa dibaca. Coba simpan ulang sebagai JPG atau PNG.");
    } finally {
      setBusy(false);
    }
  };

  const shown = preview ?? (currentUrl && !currentFailed ? currentUrl : null);

  return (
    <div className="space-y-3">
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
        {preview && (
          <span className="absolute top-2 left-2 rounded-md bg-caramel px-2 py-0.5 text-[10px] font-medium text-zinc-950">
            Preview, belum disimpan
          </span>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70">
            <Loader2 className="size-5 animate-spin text-zinc-300" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onChange}
        className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-200"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {info && <p className="text-xs text-emerald-400">{info}</p>}
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}
