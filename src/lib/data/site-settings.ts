import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export const getSiteSettings = cache(async (): Promise<SiteSettingsRow | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data;
});
