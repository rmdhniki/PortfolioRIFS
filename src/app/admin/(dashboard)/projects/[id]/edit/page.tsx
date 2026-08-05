import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "../../project-form";
import { updateProject } from "../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Projects
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">
        Edit {project.title}
      </h1>

      <div className="mt-6 max-w-3xl">
        <ProjectForm
          action={updateProject.bind(null, project.id)}
          project={project}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
