"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { CertificationItem } from "@/lib/supabase/types";
import type { CertificationFormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel";

function Field({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export function CertificationForm({
  action,
  certification,
  submitLabel,
}: {
  action: (state: CertificationFormState, formData: FormData) => Promise<CertificationFormState>;
  certification?: CertificationItem;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<CertificationFormState, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Field label="Title" name="title">
        <input id="title" name="title" defaultValue={certification?.title} required className={inputClass} />
      </Field>

      <Field label="Short Description" name="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={certification?.description}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Credential ID" name="credential_id">
          <input
            id="credential_id"
            name="credential_id"
            defaultValue={certification?.credential_id}
            className={inputClass}
          />
        </Field>
        <Field label="Order" name="order_index">
          <input
            id="order_index"
            name="order_index"
            type="number"
            defaultValue={certification?.order_index ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <label
        htmlFor="is_visible"
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
      >
        <input
          id="is_visible"
          name="is_visible"
          type="checkbox"
          defaultChecked={certification?.is_visible ?? true}
          className="mt-0.5 size-4 accent-caramel"
        />
        <span>
          <span className="block text-sm text-zinc-200">Tampilkan di website (published)</span>
          <span className="block text-xs text-zinc-500">
            Matikan untuk menyembunyikan sertifikat tanpa menghapusnya.
          </span>
        </span>
      </label>

      <Field label="Verification URL (opsional)" name="verify_url">
        <input
          id="verify_url"
          name="verify_url"
          defaultValue={certification?.verify_url ?? ""}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      <Field label="Certificate Image" name="image">
        <ImageUploadField
          name="image"
          currentUrl={certification?.image_url}
          previewClassName="aspect-[1.414] w-full max-w-md"
          hint="JPG, PNG, atau WebP. Gambar besar otomatis dikompres sebelum diunggah."
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
