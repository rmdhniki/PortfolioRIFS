import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cookie-less Supabase client for public, read-only data (anon role; RLS
 * allows public reads). Unlike the cookie-based server client it doesn't make
 * the page dynamic, so public pages can be statically cached (ISR) — visitors
 * get the cached page instead of waiting on a round trip to the database.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );
}
