import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseSetupNotice } from "@/components/admin/setup-notice";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login — Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  const { redirectTo } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-900 font-display text-lg font-semibold text-caramel">
            RS
          </div>
          <h1 className="mt-4 text-xl font-medium text-zinc-100">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            PortfolioRIFS control panel
          </p>
        </div>

        <LoginForm redirectTo={redirectTo ?? "/admin"} />
      </div>
    </div>
  );
}
