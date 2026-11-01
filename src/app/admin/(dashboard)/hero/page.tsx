import { createClient } from "@/lib/supabase/server";
import { HeroForm } from "./hero-form";

export default async function AdminHeroPage() {
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
      <h1 className="text-xl font-medium text-zinc-100">Hero</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Teks role FoldText dan file CV untuk tombol Download CV.
      </p>
      <div className="mt-6 max-w-2xl">
        <HeroForm settings={settings} />
      </div>
    </div>
  );
}
