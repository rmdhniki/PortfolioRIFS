import Link from "next/link";
import { FolderKanban, Mail, MailOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: projectCount }, { count: unreadCount }, { count: totalMessages }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    {
      label: "Total Projects",
      value: projectCount ?? 0,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Unread Messages",
      value: unreadCount ?? 0,
      icon: Mail,
      href: "/admin/messages",
    },
    {
      label: "Total Messages",
      value: totalMessages ?? 0,
      icon: MailOpen,
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-medium text-zinc-100">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Ringkasan konten dan pesan masuk.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-caramel">
              <stat.icon className="size-4.5" />
            </div>
            <p className="mt-4 text-2xl font-medium text-zinc-100">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
