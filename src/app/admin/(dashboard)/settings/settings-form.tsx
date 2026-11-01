"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { updateSettings, type SettingsFormState } from "./actions";
import { StatsEditor } from "./stats-editor";
import { ServicesEditor } from "./services-editor";
import { SocialLinksEditor } from "./social-links-editor";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel";

function Field({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
      {children}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    updateSettings,
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

      <Section title="Profile">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name">
            <input id="name" name="name" defaultValue={settings.name} required className={inputClass} />
          </Field>
          <Field label="Brand" name="brand">
            <input id="brand" name="brand" defaultValue={settings.brand} required className={inputClass} />
          </Field>
          <Field label="Role" name="role">
            <input id="role" name="role" defaultValue={settings.role} required className={inputClass} />
          </Field>
          <Field label="Email" name="email">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Location" name="location">
            <input
              id="location"
              name="location"
              defaultValue={settings.location}
              required
              className={inputClass}
            />
          </Field>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="available_for_work"
              name="available_for_work"
              type="checkbox"
              defaultChecked={settings.available_for_work}
              className="size-4 rounded border-zinc-700 bg-zinc-950 accent-caramel"
            />
            <label htmlFor="available_for_work" className="text-sm text-zinc-300">
              Available for work (tampilkan status &quot;Open to Work&quot; di navbar)
            </label>
          </div>
        </div>
        <Field label="Tagline" name="tagline">
          <textarea
            id="tagline"
            name="tagline"
            rows={2}
            defaultValue={settings.tagline}
            required
            className={inputClass}
          />
        </Field>
        <p className="text-xs text-zinc-600">
          Atur teks role di menu Hero, foto di menu Photos, dan tech stack di menu
          Tech Stack.
        </p>
      </Section>

      <Section title="About">
        <Field label="Title" name="about_title">
          <input
            id="about_title"
            name="about_title"
            defaultValue={settings.about_title}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Education" name="about_education">
          <input
            id="about_education"
            name="about_education"
            defaultValue={settings.about_education}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Description" name="about_description">
          <textarea
            id="about_description"
            name="about_description"
            rows={4}
            defaultValue={settings.about_description}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Stats" name="stats">
          <StatsEditor initial={settings.stats} />
        </Field>
      </Section>

      <Section title="Services (What I Offer)">
        <ServicesEditor initial={settings.services} />
      </Section>

      <Section title="Social Links">
        <SocialLinksEditor initial={settings.social_links} />
      </Section>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Settings
      </button>
    </form>
  );
}
