import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "../experience-form";
import { saveExperience } from "../actions";

export default function NewExperiencePage() {
  return (
    <div>
      <Link
        href="/admin/experiences"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="size-4" />
        Back to Experience
      </Link>
      <h1 className="mt-3 text-xl font-medium text-zinc-100">New Experience</h1>
      <div className="mt-6 max-w-2xl">
        <ExperienceForm action={saveExperience.bind(null, null)} submitLabel="Create Experience" />
      </div>
    </div>
  );
}
