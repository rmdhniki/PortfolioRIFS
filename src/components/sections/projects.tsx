import { Reveal } from "@/components/motion/reveal";
import { Glow } from "@/components/motion/glow";
import type { ProjectRow } from "@/lib/supabase/types";
import { ProjectStackCard } from "./project-stack-card";

export function Projects({ projects }: { projects: ProjectRow[] }) {
  return (
    <section id="projects" className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Glow className="top-0 left-1/2 size-[32rem] -translate-x-1/2 bg-secondary/50" />
      </div>
      <Reveal className="relative mx-auto max-w-6xl px-6 pt-24 text-center md:px-10">
        <p className="eyebrow">
          Featured Projects
        </p>
        <h2 className="mt-3 heading-section text-foreground">
          Selected work I&apos;m proud of
        </h2>
      </Reveal>

      <div className="mt-8">
        {projects.map((project, index) => (
          <ProjectStackCard
            key={project.slug}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  );
}
