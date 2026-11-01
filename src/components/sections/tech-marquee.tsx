"use client";

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

function Row({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="group relative flex overflow-hidden">
      <div className="animate-marquee-right flex shrink-0 items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">
        {loop.map((tech, i) => {
          const Icon = iconMap[tech];
          return (
            <div key={`${tech}-${i}`} className="flex items-center gap-2.5">
              {Icon && <Icon className="size-5 text-primary/80" />}
              <span className="text-xs font-medium whitespace-nowrap tracking-wide text-muted-foreground uppercase">
                {tech}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TechMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-border/70 bg-card/30 py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent md:w-28" />
      <Row items={items} />
    </div>
  );
}
