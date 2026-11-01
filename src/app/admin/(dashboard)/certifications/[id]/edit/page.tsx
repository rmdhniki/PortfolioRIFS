import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CertificationForm } from "../../certification-form";
import { saveCertification } from "../../actions";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: certification } = await supabase
    .from("certifications")
    .select("*")
    .eq("id", id)
    .single();

  if (!certification) notFound();

  return (
    <div>
      <Link
        href="/admin/certifications"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Certifications
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">Edit {certification.title}</h1>
      <div className="mt-6 max-w-2xl">
        <CertificationForm
          action={saveCertification.bind(null, certification.id)}
          certification={certification}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
