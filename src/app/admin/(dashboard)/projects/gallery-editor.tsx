"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

function NewFilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg border border-caramel/40">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
        aria-label="Hapus"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export function GalleryEditor({ initial }: { initial: string[] }) {
  const [kept, setKept] = useState<string[]>(initial);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  function syncHiddenInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (hiddenInputRef.current) hiddenInputRef.current.files = dt.files;
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const merged = [...newFiles, ...picked];
    setNewFiles(merged);
    syncHiddenInput(merged);
    e.target.value = "";
  }

  function removeNew(index: number) {
    const merged = newFiles.filter((_, i) => i !== index);
    setNewFiles(merged);
    syncHiddenInput(merged);
  }

  function removeKept(index: number) {
    setKept((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="gallery_existing" value={JSON.stringify(kept)} />
      <input ref={hiddenInputRef} type="file" name="gallery_new" multiple className="hidden" />

      {(kept.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {kept.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-video overflow-hidden rounded-lg border border-zinc-800"
            >
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeKept(i)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                aria-label="Hapus"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <NewFilePreview key={i} file={file} onRemove={() => removeNew(i)} />
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
        type="file"
        accept="image/*"
        multiple
        onChange={handlePick}
        className="hidden"
      />
    </div>
  );
}
