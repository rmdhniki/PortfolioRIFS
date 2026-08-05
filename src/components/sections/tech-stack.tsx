import type { IconType } from "react-icons";
import {
  SiCss,
  SiDart,
  SiFlutter,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiReact,
  SiSqlite,
} from "react-icons/si";
import { Reveal } from "@/components/motion/reveal";
import { Glow } from "@/components/motion/glow";

const iconMap: Record<string, IconType> = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Laravel: SiLaravel,
  Flutter: SiFlutter,
  PHP: SiPhp,
  Dart: SiDart,
  MySQL: SiMysql,
  SQLite: SiSqlite,
  Git: SiGit,
  Github: SiGithub,
};

function MarqueeRow({
  items,
  direction = "left",
}: {
  items: readonly string[];
  direction?: "left" | "right";
}) {
  const loop = [...items, ...items];

  return (
    <div className="group relative flex overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-32" />
      <div
        className={`flex shrink-0 gap-5 pr-5 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } group-hover:[animation-play-state:paused]`}
      >
        {loop.map((tech, i) => {
          const Icon = iconMap[tech];
          return (
            <div
              key={`${tech}-${i}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              {Icon && <Icon className="size-6 text-primary" />}
              <span className="text-sm font-medium whitespace-nowrap text-foreground">
                {tech}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TechStack({
  row1,
  row2,
}: {
  row1: string[];
  row2: string[];
}) {
  return (
    <section
      id="tech-stack"
      className="relative overflow-x-hidden bg-cream-soft/50 py-20 md:py-28"
    >
      <Glow className="top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 bg-caramel/15" />
      <Reveal className="relative mx-auto max-w-6xl px-6 text-center md:px-10">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Tech Stack
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium text-foreground md:text-4xl">
          Tools I work with everyday
        </h2>
      </Reveal>

      <div className="mt-12 space-y-5">
        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
}
