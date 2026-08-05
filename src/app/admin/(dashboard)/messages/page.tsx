import { createClient } from "@/lib/supabase/server";
import { MessageActions } from "./message-actions";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-medium text-zinc-100">Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pesan yang masuk lewat form contact di halaman publik.
      </p>

      <div className="mt-6 space-y-3">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl border p-5 ${
              msg.is_read
                ? "border-zinc-800 bg-zinc-900/50"
                : "border-caramel/30 bg-zinc-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!msg.is_read && (
                    <span className="size-1.5 shrink-0 rounded-full bg-caramel" />
                  )}
                  <p className="truncate font-medium text-zinc-100">
                    {msg.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                    {msg.service}
                  </span>
                </div>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-sm text-zinc-500 hover:text-caramel hover:underline"
                >
                  {msg.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-zinc-500">
                  {formatDate(msg.created_at)}
                </span>
                <MessageActions id={msg.id} isRead={msg.is_read} />
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap text-zinc-300">
              {msg.message}
            </p>
          </div>
        ))}

        {messages?.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-12 text-center text-zinc-500">
            Belum ada pesan masuk.
          </div>
        )}
      </div>
    </div>
  );
}
