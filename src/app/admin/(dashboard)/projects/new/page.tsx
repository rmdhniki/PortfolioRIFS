import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "../project-form";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Projects
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">New Project</h1>

      <div className="mt-6 max-w-3xl">
        <ProjectForm action={createProject} submitLabel="Create Project" />
      </div>
    </div>
  );
}
