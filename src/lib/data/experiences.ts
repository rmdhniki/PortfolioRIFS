import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { ExperienceItem } from "@/lib/supabase/types";

/** Visible experiences for the public timeline, in admin-defined order. */
export const getExperiences = cache(async (): Promise<ExperienceItem[]> => {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[experiences] Gagal memuat data:", error.message);
    return [];
  }
  // Sorted and filtered here rather than in SQL so the site keeps working on a
  // database where migration 004 (start_date / is_visible) hasn't run yet.
  return (data ?? [])
    .filter((item) => item.is_visible !== false)
    .sort(
      (a, b) =>
        a.order_index - b.order_index || (b.start_date ?? "").localeCompare(a.start_date ?? "")
    );
});
