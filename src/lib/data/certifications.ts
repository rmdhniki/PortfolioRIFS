import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { CertificationItem } from "@/lib/supabase/types";

export const getCertifications = cache(async (): Promise<CertificationItem[]> => {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[certifications] Gagal memuat data:", error.message);
    return [];
  }
  // Published only. Filtered here (not in SQL) so the site keeps working on a
  // database where migration 004 (is_visible) hasn't run yet.
  return (data ?? []).filter((cert) => cert.is_visible !== false);
});
