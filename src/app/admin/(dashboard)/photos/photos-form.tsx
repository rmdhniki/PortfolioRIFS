"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { updatePhotos, type PhotosFormState } from "./actions";

const fields = [
  {
    name: "hero_image",
    prefix: "hero",
    label: "Foto Hero (depan)",
    hint: "Tampil di kartu foto pada Hero Section.",
    column: "hero_image_url",
  },
  {
    name: "services_image",
    prefix: "services",
    label: "Foto Hero (belakang)",
    hint: "Sisi belakang kartu, tampil setelah kartu berputar ke Services Section.",
    column: "services_image_url",
  },
  {
    name: "about_front_image",
    prefix: "about-front",
    label: "About (depan)",
    hint: "Sisi depan kartu Lanyard.",
    column: "about_front_image_url",
  },
  {
    name: "about_back_image",
    prefix: "about-back",
    label: "About (belakang)",
    hint: "Sisi belakang setelah kartu Lanyard diklik. Jika kosong, memakai foto depan.",
    column: "about_back_image_url",
  },
  {
    name: "lanyard_strap_image",
    prefix: "lanyard-strap",
    label: "Gambar Tali Lanyard (opsional)",
    hint: "Gambar memanjang yang tercetak pada tali.",
    column: "lanyard_strap_image_url",
  },
] as const;

export function PhotosForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction, isPending] = useActionState<PhotosFormState, FormData>(
    updatePhotos,
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          Foto tersimpan.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <ImageUploadField
              name={field.name}
              bucket="site-assets"
              prefix={field.prefix}
              label={field.label}
              hint={field.hint}
              currentUrl={settings[field.column]}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Photos
      </button>
    </form>
  );
}
