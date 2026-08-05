import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/50 p-6 text-sm text-red-400">
        Baris site_settings (id=1) tidak ditemukan. Pastikan sudah menjalankan
        supabase/schema.sql.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-zinc-100">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Konten yang tampil di halaman publik (Hero, About, Services, Tech
        Stack, Social Links).
      </p>

      <div className="mt-6 max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
