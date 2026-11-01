import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCertification } from "./actions";

export default async function AdminCertificationsPage() {
  const supabase = await createClient();
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-100">Certifications</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sertifikat untuk Circular Gallery di halaman publik.
          </p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="flex items-center gap-2 rounded-lg bg-caramel px-4 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New Certificate
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-xs text-zinc-500 uppercase">
              <th className="px-4 py-3 font-medium">Certificate</th>
              <th className="px-4 py-3 font-medium">Credential ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications?.map((cert) => (
              <tr key={cert.id} className="border-b border-zinc-800 last:border-none hover:bg-zinc-900/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cert.image_url ? (
                      <Image
                        src={cert.image_url}
                        alt=""
                        width={64}
                        height={40}
                        className="h-10 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-16 rounded-lg bg-zinc-800" />
                    )}
                    <span className="font-medium text-zinc-100">{cert.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-500">{cert.credential_id || "-"}</td>
                <td className="px-4 py-3">
                  {cert.is_visible === false ? (
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                      Disembunyikan
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs text-emerald-400">
                      Published
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500">{cert.order_index}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/certifications/${cert.id}/edit`}
                      className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton
                      action={deleteCertification.bind(null, cert.id)}
                      confirmMessage={`Hapus sertifikat "${cert.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {certifications?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada sertifikat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
