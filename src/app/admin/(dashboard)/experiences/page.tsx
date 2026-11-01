import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatExperiencePeriod } from "@/lib/format-period";
import { deleteExperience } from "./actions";

export default async function AdminExperiencesPage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-100">Experience</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Entry timeline pada section Experience, diurutkan berdasarkan kolom Urutan.
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="flex items-center gap-2 rounded-lg bg-caramel px-4 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New Experience
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-xs text-zinc-500 uppercase">
              <th className="px-4 py-3 font-medium">Posisi</th>
              <th className="px-4 py-3 font-medium">Perusahaan</th>
              <th className="px-4 py-3 font-medium">Periode</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Urutan</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences?.map((exp) => (
              <tr key={exp.id} className="border-b border-zinc-800 last:border-none hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium text-zinc-100">{exp.role}</td>
                <td className="px-4 py-3 text-zinc-400">{exp.company}</td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                  {formatExperiencePeriod(exp) || "-"}
                  {!exp.start_date && (
                    <span className="ml-2 rounded bg-amber-950 px-1.5 py-0.5 text-[10px] text-amber-400">
                      isi tanggal
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {exp.is_visible ? (
                    <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs text-emerald-400">
                      Tampil
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                      Disembunyikan
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500">{exp.order_index}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/experiences/${exp.id}/edit`}
                      className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton
                      action={deleteExperience.bind(null, exp.id)}
                      confirmMessage={`Hapus pengalaman "${exp.role}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {experiences?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada pengalaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
