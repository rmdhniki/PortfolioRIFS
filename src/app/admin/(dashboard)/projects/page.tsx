import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-100">Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola project yang tampil di halaman publik.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-caramel px-4 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New Project
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-xs text-zinc-500 uppercase">
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr
                key={project.id}
                className="border-b border-zinc-800 last:border-none hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-9 rounded-lg bg-zinc-800" />
                    )}
                    <span className="font-medium text-zinc-100">
                      {project.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{project.category}</td>
                <td className="px-4 py-3 text-zinc-500">{project.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton
                      action={deleteProject.bind(null, project.id)}
                      confirmMessage={`Hapus project "${project.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {projects?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
