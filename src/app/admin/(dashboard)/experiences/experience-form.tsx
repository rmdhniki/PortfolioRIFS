"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ExperienceItem } from "@/lib/supabase/types";
import { toMonthInput } from "@/lib/format-period";
import type { ExperienceFormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:dark]";

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

function Toggle({
  name,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={name}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-caramel"
      />
      <span>
        <span className="block text-sm text-zinc-200">{label}</span>
        <span className="block text-xs text-zinc-500">{hint}</span>
      </span>
    </label>
  );
}

export function ExperienceForm({
  action,
  experience,
  submitLabel,
}: {
  action: (state: ExperienceFormState, formData: FormData) => Promise<ExperienceFormState>;
  experience?: ExperienceItem;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<ExperienceFormState, FormData>(
    action,
    null
  );
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? false);
  const [isVisible, setIsVisible] = useState(experience?.is_visible ?? true);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Posisi / Judul" name="role">
          <input id="role" name="role" defaultValue={experience?.role} required className={inputClass} />
        </Field>
        <Field label="Perusahaan / Organisasi" name="company">
          <input
            id="company"
            name="company"
            defaultValue={experience?.company}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Bulan Mulai" name="start_month">
          <input
            id="start_month"
            name="start_month"
            type="month"
            required
            defaultValue={toMonthInput(experience?.start_date)}
            className={inputClass}
          />
        </Field>
        <Field label="Bulan Selesai" name="end_month">
          <input
            id="end_month"
            name="end_month"
            type="month"
            required={!isCurrent}
            disabled={isCurrent}
            defaultValue={toMonthInput(experience?.end_date)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          name="is_current"
          label="Masih berjalan"
          hint={'Periode ditampilkan sampai "Sekarang".'}
          checked={isCurrent}
          onChange={setIsCurrent}
        />
        <Toggle
          name="is_visible"
          label="Tampilkan di website"
          hint="Matikan untuk menyembunyikan tanpa menghapus."
          checked={isVisible}
          onChange={setIsVisible}
        />
      </div>

      <Field label="Deskripsi Singkat" name="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={experience?.description}
          className={inputClass}
        />
      </Field>

      <div className="max-w-[12rem]">
        <Field label="Urutan" name="order_index">
          <input
            id="order_index"
            name="order_index"
            type="number"
            defaultValue={experience?.order_index ?? 0}
            className={inputClass}
          />
        </Field>
        <p className="mt-1.5 text-xs text-zinc-600">Angka kecil tampil lebih dulu.</p>
      </div>

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
