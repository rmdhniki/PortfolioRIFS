import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ExperienceForm } from "../../experience-form";
import { saveExperience } from "../../actions";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: experience } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!experience) notFound();

  return (
    <div>
      <Link
        href="/admin/experiences"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Experience
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">Edit {experience.role}</h1>
      <div className="mt-6 max-w-2xl">
        <ExperienceForm
          action={saveExperience.bind(null, experience.id)}
          experience={experience}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
