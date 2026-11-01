import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getAdminUser } from "@/lib/supabase/is-admin";
import { Sidebar } from "@/components/admin/sidebar";
import { SupabaseSetupNotice } from "@/components/admin/setup-notice";

export const metadata = {
  title: "Admin — PortfolioRIFS",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  const supabase = await createClient();
  const user = await getAdminUser(supabase);

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-svh bg-zinc-950">
      <Sidebar email={user.email ?? ""} />
      <main className="flex-1 overflow-x-hidden px-8 py-8">{children}</main>
    </div>
  );
}
