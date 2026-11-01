"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, X } from "lucide-react";
import { UPLOADING_FIELD } from "@/lib/supabase/storage";
import { compressImage, uploadToStorage } from "@/lib/supabase/upload-client";
import { isImageUrl } from "@/lib/project-images";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

type Pending = { key: string; preview: string };

/**
 * Gallery images upload straight to Supabase Storage as they are picked; the
 * form submits only the ordered list of URLs (`gallery` hidden input, JSON).
 */
export function GalleryEditor({ initial, prefix }: { initial: string[]; prefix: string }) {
  const [urls, setUrls] = useState<string[]>(() => initial.filter(isImageUrl));
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  // Revoke blob previews on unmount.
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  useEffect(() => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.preview)), []);

  async function uploadOne(file: File) {
    const key = `${Date.now()}-${Math.random()}`;
    const preview = URL.createObjectURL(file);
    setPending((prev) => [...prev, { key, preview }]);
    try {
      if (!ACCEPTED.includes(file.type)) {
        throw new Error(`"${file.name}": format tidak didukung. Gunakan JPG, PNG, atau WebP.`);
      }
      const output = await compressImage(file, 2400);
      const url = await uploadToStorage(output, "project-images", `${prefix}-gallery`);
      setUrls((prev) => [...prev, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : `"${file.name}" gagal diunggah.`);
    } finally {
      URL.revokeObjectURL(preview);
      setPending((prev) => prev.filter((p) => p.key !== key));
    }
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    setError(null);
    // Sequential keeps the gallery order identical to the picked order.
    void picked.reduce((chain, file) => chain.then(() => uploadOne(file)), Promise.resolve());
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="gallery" value={JSON.stringify(urls)} />
      {pending.length > 0 && <input type="hidden" name={UPLOADING_FIELD} value="1" />}

      {(urls.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-video overflow-hidden rounded-lg border border-zinc-800"
            >
              <Image src={url} alt="" fill sizes="200px" className="object-cover" />
              <span className="absolute bottom-1 left-1 rounded bg-zinc-950/80 px-1.5 text-[10px] text-zinc-300">
                {i + 1}
              </span>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="flex size-6 items-center justify-center rounded-full bg-zinc-950/80 text-xs text-zinc-300 hover:text-caramel"
                    aria-label="Geser ke kiri"
                  >
                    ‹
                  </button>
                )}
                {i < urls.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="flex size-6 items-center justify-center rounded-full bg-zinc-950/80 text-xs text-zinc-300 hover:text-caramel"
                    aria-label="Geser ke kanan"
                  >
                    ›
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setUrls((prev) => prev.filter((_, j) => j !== i))}
                  className="flex size-6 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-300 hover:text-red-400"
                  aria-label="Hapus"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          {pending.map((p) => (
            <div key={p.key} className="relative aspect-video overflow-hidden rounded-lg border border-caramel/40">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview */}
              <img src={p.preview} alt="" className="size-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-5 animate-spin text-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        className="flex items-center gap-1.5 text-sm text-caramel hover:underline"
      >
        <Plus className="size-3.5" />
        Add images
      </button>
      <input
        ref={pickerRef}
        id="gallery_new"
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        onChange={handlePick}
        className="hidden"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-zinc-600">
        Gambar langsung diunggah saat dipilih; urutan di sini = urutan slide setelah gambar utama. Klik
        simpan untuk menerapkan.
      </p>
    </div>
  );
}
