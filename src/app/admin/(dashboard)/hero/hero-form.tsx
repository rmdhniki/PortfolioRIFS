"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { updateHero, type HeroFormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel";

export function HeroForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction, isPending] = useActionState<HeroFormState, FormData>(
    updateHero,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          Tersimpan.
        </p>
      )}

      <div className="space-y-1.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <label htmlFor="roles" className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
          Roles (satu per baris, tampil dengan FoldText)
        </label>
        <textarea
          id="roles"
          name="roles"
          rows={5}
          defaultValue={settings.roles.join("\n")}
          required
          className={inputClass}
        />
        <p className="text-xs text-zinc-600">
          Teks berganti otomatis tiap beberapa detik di Hero.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-medium text-zinc-200">CV</h2>
        {settings.cv_url ? (
          <a
            href={settings.cv_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-caramel hover:underline"
          >
            Lihat CV saat ini
          </a>
        ) : (
          <p className="text-sm text-zinc-600">Belum ada CV. Tombol Download CV disembunyikan.</p>
        )}
        <input
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf"
          className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3.5 file:py-2 file:text-sm file:text-zinc-200"
        />
        <p className="text-xs text-zinc-600">Hanya PDF, maksimal 5MB.</p>
        {settings.cv_url && (
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="remove_cv"
              className="size-4 rounded border-zinc-700 bg-zinc-950 accent-caramel"
            />
            Hapus CV
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Hero
      </button>
    </form>
  );
}
