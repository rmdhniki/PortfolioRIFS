import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Returns the signed-in user only when they are on the admin allowlist
 * (`public.admins`, checked by the `is_admin()` SQL function). Being logged in
 * is not enough: anyone can create a Supabase account with the public anon key.
 *
 * Kept free of `next/headers` so it can run in middleware too.
 */
export async function getAdminUser(supabase: SupabaseClient<Database>): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true ? user : null;
}
