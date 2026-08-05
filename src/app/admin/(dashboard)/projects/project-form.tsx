"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { ProjectFormState } from "./actions";
import type { ProjectRow } from "@/lib/supabase/types";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="text-xs font-medium tracking-wide text-zinc-400 uppercase"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-caramel";

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  project?: ProjectRow;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    action,
    null
  );
  const fieldError = (name: string) => state?.fieldErrors?.[name];

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" name="slug" error={fieldError("slug")}>
          <input
            id="slug"
            name="slug"
            defaultValue={project?.slug}
            placeholder="commerce-nova"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Title" name="title" error={fieldError("title")}>
          <input
            id="title"
            name="title"
            defaultValue={project?.title}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Category" name="category" error={fieldError("category")}>
          <input
            id="category"
            name="category"
            defaultValue={project?.category}
            placeholder="Fullstack Development / Mobile Development / ..."
            required
            className={inputClass}
          />
        </Field>
        <Field label="Order" name="order_index">
          <input
            id="order_index"
            name="order_index"
            type="number"
            defaultValue={project?.order_index ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Short Description" name="description" error={fieldError("description")}>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={project?.description}
          required
          className={inputClass}
        />
      </Field>

      <Field
        label="Gradient (Tailwind class, contoh: from-[#hex] via-[#hex] to-[#hex])"
        name="gradient"
        error={fieldError("gradient")}
      >
        <input
          id="gradient"
          name="gradient"
          defaultValue={project?.gradient}
          required
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tech Stack (satu per baris)" name="tech" error={fieldError("tech")}>
          <textarea
            id="tech"
            name="tech"
            rows={4}
            defaultValue={project?.tech?.join("\n")}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Features (satu per baris)" name="features" error={fieldError("features")}>
          <textarea
            id="features"
            name="features"
            rows={4}
            defaultValue={project?.features?.join("\n")}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Year" name="year" error={fieldError("year")}>
          <input id="year" name="year" defaultValue={project?.year} required className={inputClass} />
        </Field>
        <Field label="Industry" name="industry" error={fieldError("industry")}>
          <input
            id="industry"
            name="industry"
            defaultValue={project?.industry}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Client" name="client" error={fieldError("client")}>
          <input id="client" name="client" defaultValue={project?.client} required className={inputClass} />
        </Field>
        <Field label="Duration" name="duration" error={fieldError("duration")}>
          <input
            id="duration"
            name="duration"
            defaultValue={project?.duration}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Overview" name="overview" error={fieldError("overview")}>
        <textarea
          id="overview"
          name="overview"
          rows={3}
          defaultValue={project?.overview}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Problem" name="problem" error={fieldError("problem")}>
        <textarea
          id="problem"
          name="problem"
          rows={3}
          defaultValue={project?.problem}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Solution" name="solution" error={fieldError("solution")}>
        <textarea
          id="solution"
          name="solution"
          rows={3}
          defaultValue={project?.solution}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Gallery gradients (satu per baris, opsional)" name="gallery">
        <textarea
          id="gallery"
          name="gallery"
          rows={2}
          defaultValue={project?.gallery?.join("\n")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GitHub URL (opsional)" name="github" error={fieldError("github")}>
          <input id="github" name="github" defaultValue={project?.github ?? ""} className={inputClass} />
        </Field>
        <Field label="Demo URL (opsional)" name="demo" error={fieldError("demo")}>
          <input id="demo" name="demo" defaultValue={project?.demo ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Project Image" name="image">
        <div className="flex items-center gap-4">
          {project?.image_url && (
            <Image
              src={project.image_url}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-lg object-cover"
            />
          )}
          <div>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3.5 file:py-2 file:text-sm file:text-zinc-200"
            />
            <p className="mt-1.5 text-xs text-zinc-600">Maks. 5MB.</p>
          </div>
        </div>
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
