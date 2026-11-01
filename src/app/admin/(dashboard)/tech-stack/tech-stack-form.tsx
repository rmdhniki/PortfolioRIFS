"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { updateTechStack, type TechStackFormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel";

export function TechStackForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction, isPending] = useActionState<TechStackFormState, FormData>(
    updateTechStack,
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

      <div className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="row1" className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Row 1 (satu per baris)
          </label>
          <textarea
            id="row1"
            name="row1"
            rows={6}
            defaultValue={settings.tech_stack_row1.join("\n")}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="row2" className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Row 2 (satu per baris)
          </label>
          <textarea
            id="row2"
            name="row2"
            rows={6}
            defaultValue={settings.tech_stack_row2.join("\n")}
            className={inputClass}
          />
        </div>
        <p className="text-xs text-zinc-600 sm:col-span-2">
          Row 1 tampil di antara Services dan About, Row 2 di antara About dan Projects.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Tech Stack
      </button>
    </form>
  );
}
