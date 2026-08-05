import { AlertTriangle } from "lucide-react";

export function SupabaseSetupNotice() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertTriangle className="size-5" />
        </div>
        <h1 className="mt-4 text-lg font-medium text-zinc-100">
          Supabase belum dikonfigurasi
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Isi <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          dan{" "}
          <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          di <code className="text-zinc-300">.env.local</code>, lalu jalankan{" "}
          <code className="text-zinc-300">supabase/schema.sql</code> di SQL
          Editor Supabase, lalu restart server.
        </p>
      </div>
    </div>
  );
}
