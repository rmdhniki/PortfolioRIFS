"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ChevronDown, Code2, Sparkles } from "lucide-react";
import { Typewriter } from "@/components/motion/typewriter";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { Glow } from "@/components/motion/glow";
import { SmoothLink } from "@/components/smooth-link";
import type { StatItem, ServiceItem } from "@/lib/supabase/types";

function FlipPortrait() {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-secondary via-cream-soft to-caramel/60">
      <span className="font-display text-6xl font-medium text-primary">MR</span>
    </div>
  );
}

function FlipWorkspace() {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-primary via-[#4a3220] to-espresso">
      <Code2 className="size-16 text-cream/80" strokeWidth={1.25} />
    </div>
  );
}

const PHASE = {
  heroEnd: 0.22,
  flip1End: 0.28,
  servicesEnd: 0.68,
  flip2End: 0.74,
};

export function HeroServicesAbout({
  name,
  roles,
  aboutTitle,
  aboutEducation,
  aboutDescription,
  stats,
  services,
}: {
  name: string;
  roles: string[];
  aboutTitle: string;
  aboutEducation: string;
  aboutDescription: string;
  stats: StatItem[];
  services: ServiceItem[];
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: groupRef,
    offset: ["start start", "end end"],
  });

  const rotateY = useTransform(
    scrollYProgress,
    [0, PHASE.heroEnd, PHASE.flip1End, PHASE.servicesEnd, PHASE.flip2End, 1],
    [0, 0, 180, 180, 360, 360]
  );
  const marginLeft = useTransform(
    scrollYProgress,
    [0, PHASE.heroEnd, PHASE.flip1End, 1],
    ["38%", "38%", "60%", "60%"]
  );

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div ref={groupRef} className="relative">
      {/* Sticky flip image — shared across Hero + Services + About, desktop only */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
        <div className="sticky top-[16vh] mx-auto max-w-6xl px-6 md:px-10">
          <motion.div
            style={{ marginLeft, perspective: 1200 }}
            className="relative aspect-4/5 w-[280px]"
          >
            <motion.div
              style={{ rotateY, transformStyle: "preserve-3d" }}
              className="relative h-full w-full rounded-[1.75rem] shadow-2xl shadow-espresso/20"
            >
              <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0">
                <FlipPortrait />
              </div>
              <div
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0"
              >
                <FlipWorkspace />
              </div>
            </motion.div>

            <div className="absolute -bottom-6 -left-8 flex size-20 items-center justify-center rounded-full bg-caramel font-display text-xl text-espresso shadow-lg">
              Hi
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero chapter */}
      <section
        id="home"
        className="relative flex min-h-[100svh] items-center overflow-x-hidden pt-28 pb-16"
      >
        <Glow className="-top-24 -right-24 size-[28rem] bg-caramel/20" />
        <Glow className="-bottom-32 -left-24 size-96 bg-secondary/60" />
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[minmax(0,1fr)_280px_minmax(0,1fr)] md:px-10">
          <div className="min-w-0 text-center md:text-right">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm uppercase tracking-[0.3em] text-muted-foreground"
            >
              {name}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 font-condensed text-5xl leading-[0.95] font-semibold tracking-tight text-foreground uppercase md:text-6xl lg:text-7xl"
            >
              FULLSTACK
            </motion.h1>
          </div>

          <div className="mx-auto">
            <div className="relative aspect-4/5 w-[220px] overflow-hidden rounded-[1.75rem] shadow-xl shadow-espresso/20 md:hidden">
              <FlipPortrait />
            </div>
          </div>

          <div className="min-w-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-condensed text-5xl leading-[0.95] font-semibold tracking-tight text-foreground uppercase md:text-6xl lg:text-7xl"
            >
              DEVELOPER
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto mt-4 max-w-xs font-display text-xl text-caramel italic md:mx-0"
            >
              I am <Typewriter words={roles} />
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <SmoothLink
            href="/#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            Explore My Work
            <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
          </SmoothLink>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-muted-foreground"
          >
            <ArrowDown className="size-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Services chapter */}
      <section
        id="services"
        className="relative overflow-x-hidden bg-cream-soft/40 py-24 md:min-h-[85vh] md:py-32"
      >
        <Glow className="top-1/4 -right-32 size-[26rem] bg-primary/10" />
        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                What I Offer
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl">
                What Can I Do For You
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Sebagai fullstack developer, saya membantu mewujudkan ide
                jadi produk digital yang utuh — dari sisi server sampai
                yang dilihat pengguna.
              </p>
            </Reveal>

            <div className="mt-10 divide-y divide-border border-t border-border">
              {services.map((service, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={service.title}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-xl text-foreground md:text-2xl">
                        {i + 1}. {service.title}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 text-muted-foreground"
                      >
                        <ChevronDown className="size-5" />
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-muted-foreground md:text-base">
                        {service.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* About chapter */}
      <section
        id="about"
        className="relative overflow-x-hidden py-24 md:min-h-[85vh] md:py-32"
      >
        <Glow className="-bottom-24 -left-32 size-[26rem] bg-caramel/15" />
        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          <div className="max-w-xl space-y-6">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {aboutTitle}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
                {aboutEducation}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {aboutDescription}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="grid grid-cols-3 gap-6 border-t border-border pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-3xl font-medium text-primary md:text-4xl">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
