import type { ExperienceItem } from "@/lib/supabase/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "2024-03-01" → "Mar 2024". Parsed by hand to avoid timezone shifts. */
export function formatMonth(date: string | null): string | null {
  const match = date?.match(/^(\d{4})-(\d{2})/);
  if (!match) return null;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : match[1];
}

/** "2024-03-01" → "2024-03", the value format of <input type="month">. */
export function toMonthInput(date: string | null | undefined): string {
  return date?.slice(0, 7) ?? "";
}

/** "Mar 2024 – Sekarang", falling back to the legacy free-text period. */
export function formatExperiencePeriod(
  item: Pick<ExperienceItem, "start_date" | "end_date" | "is_current" | "period">
): string {
  const start = formatMonth(item.start_date);
  if (!start) return item.period;
  const end = item.is_current ? "Sekarang" : formatMonth(item.end_date);
  return end && end !== start ? `${start} – ${end}` : start;
}
