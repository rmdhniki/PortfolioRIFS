import { createClient } from "@/lib/supabase/server";
import { TechStackForm } from "./tech-stack-form";

export default async function AdminTechStackPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/50 p-6 text-sm text-red-400">
        Baris site_settings (id=1) tidak ditemukan. Jalankan supabase/schema.sql.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-zinc-100">Tech Stack</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Isi dua baris marquee yang memisahkan Services, About, dan Projects.
      </p>
      <div className="mt-6 max-w-3xl">
        <TechStackForm settings={settings} />
      </div>
    </div>
  );
}
