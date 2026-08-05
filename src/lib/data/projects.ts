import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { projects as staticProjects } from "@/lib/projects";
import type { ProjectRow } from "@/lib/supabase/types";

const fallbackProjects: ProjectRow[] = staticProjects.map((p, i) => ({
  id: p.slug,
  slug: p.slug,
  title: p.title,
  category: p.category,
  description: p.description,
  gradient: p.gradient,
  tech: p.tech,
  year: p.year,
  industry: p.industry,
  client: p.client,
  duration: p.duration,
  overview: p.overview,
  problem: p.problem,
  solution: p.solution,
  features: p.features,
  gallery: p.gallery,
  github: p.github ?? null,
  demo: p.demo ?? null,
  image_url: null,
  order_index: i,
  created_at: "",
  updated_at: "",
}));

export const getProjects = cache(async (): Promise<ProjectRow[]> => {
  if (!isSupabaseConfigured) return fallbackProjects;

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  return data && data.length > 0 ? data : fallbackProjects;
});

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getAdjacentProject(slug: string): Promise<ProjectRow | null> {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return projects[0] ?? null;
  return projects[(index + 1) % projects.length];
}
