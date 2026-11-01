import { createClient } from "./server";
import { getAdminUser } from "./is-admin";

/**
 * Guard for admin Server Actions. Server Actions are plain POST endpoints that
 * can be called from anywhere, so each one checks for itself instead of relying
 * only on the middleware/layout. RLS (`is_admin()`) is the last line of defence.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const user = await getAdminUser(supabase);
  if (!user) {
    throw new Error("Akses ditolak: akun ini tidak memiliki akses admin.");
  }
  return { supabase, user };
}
