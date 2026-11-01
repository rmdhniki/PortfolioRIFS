import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CertificationForm } from "../certification-form";
import { saveCertification } from "../actions";

export default function NewCertificationPage() {
  return (
    <div>
      <Link
        href="/admin/certifications"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Certifications
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">New Certificate</h1>
      <div className="mt-6 max-w-2xl">
        <CertificationForm
          action={saveCertification.bind(null, null)}
          submitLabel="Create Certificate"
        />
      </div>
    </div>
  );
}
