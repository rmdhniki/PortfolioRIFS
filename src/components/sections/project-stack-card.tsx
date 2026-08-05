"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LaptopMockup, PhoneMockup } from "@/components/motion/device-mockup";
import type { ProjectRow } from "@/lib/supabase/types";

export function ProjectStackCard({
  project,
  index,
  total,
}: {
  project: ProjectRow;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.76]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : -90]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 6]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <div ref={ref} className={isLast ? "relative h-screen" : "relative h-[135vh]"}>
      <div
        className="sticky top-0 flex h-screen items-center justify-center px-4 py-24 md:px-10"
        style={{ zIndex: index + 1 }}
      >
        <motion.div
          style={{ scale, opacity, y, filter }}
          className="relative grid w-full max-w-6xl gap-8 overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-espresso/10 md:grid-cols-2 md:p-10"
        >
          <div className="flex flex-col justify-center gap-4">
            <span className="w-fit rounded-full border border-border px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase">
              {project.category}
            </span>
            <h3 className="font-display text-3xl font-medium text-foreground md:text-4xl">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground md:text-base">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              href={`/project/${project.slug}`}
              className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
            >
              View Project
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <Link
            href={`/project/${project.slug}`}
            className="group relative flex items-center justify-center"
          >
            {project.category === "Mobile Development" ? (
              <PhoneMockup gradient={project.gradient} imageUrl={project.image_url} />
            ) : (
              <LaptopMockup
                gradient={project.gradient}
                imageUrl={project.image_url}
                className="w-full"
              />
            )}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
