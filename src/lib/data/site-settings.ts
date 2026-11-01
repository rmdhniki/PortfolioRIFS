import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export const getSiteSettings = cache(async (): Promise<SiteSettingsRow | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data;
});
