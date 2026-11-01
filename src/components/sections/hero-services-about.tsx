"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ChevronDown, Download, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { Glow } from "@/components/motion/glow";
import { SmoothLink } from "@/components/smooth-link";
import { RotatingFoldText } from "@/components/motion/rotating-fold-text";
import { MovingPhotoCard, PhotoFlipCard } from "@/components/motion/moving-photo-card";
import { AboutLanyard } from "@/components/motion/about-lanyard";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { HeroGridBackground } from "@/components/motion/hero-grid-background";
import { useLoaderDone } from "@/lib/site-loader-state";
import { PreloadHints } from "@/components/preload-hints";
import type { StatItem, ServiceItem } from "@/lib/supabase/types";

/**
 * Hero name size. From md up each half sits in a column beside the 280px photo
 * card: column ≈ (viewport − 440px) / 2, capped by the 6xl container. "Muhammad"
 * is ≈ 5.3em wide in Space Grotesk Bold, so size ≈ column / 5.5, max 64px.
 */
const heroNameClass =
  "heading-display text-[2.75rem] sm:text-6xl md:text-[clamp(1.875rem,calc(9vw_-_2.5rem),4rem)]";

/** Entrance animation that waits for the loading screen, so it isn't played behind it. */
function entrance(revealed: boolean, delay: number, y = 32) {
  return {
    initial: { opacity: 0, y },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 0.8, delay: revealed ? delay : 0, ease: [0.16, 1, 0.3, 1] as const },
  };
}

export function HeroServicesAbout({
  roles,
  cvUrl,
  aboutTitle,
  aboutEducation,
  aboutDescription,
  stats,
  services,
  heroImageUrl,
  servicesImageUrl,
  aboutFrontImageUrl,
  aboutBackImageUrl,
  lanyardStrapImageUrl,
  techRow1,
  techRow2,
}: {
  roles: string[];
  cvUrl: string | null;
  aboutTitle: string;
  aboutEducation: string;
  aboutDescription: string;
  stats: StatItem[];
  services: ServiceItem[];
  heroImageUrl: string | null;
  servicesImageUrl: string | null;
  aboutFrontImageUrl: string | null;
  aboutBackImageUrl: string | null;
  lanyardStrapImageUrl: string | null;
  techRow1: string[];
  techRow2: string[];
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const servicesRef = useRef<HTMLElement>(null);
  const revealed = useLoaderDone();

  return (
    <div className="relative">
      <div className="relative">
        {/* Desktop: the card flips from the Hero into Services. */}
        <MovingPhotoCard
          frontUrl={heroImageUrl}
          backUrl={servicesImageUrl}
          servicesRef={servicesRef}
        />

        <section
          id="home"
          className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-x-clip pt-28 pb-16"
        >
          <HeroGridBackground />
          <Glow className="-top-24 -right-24 size-[28rem] bg-primary/10" />
          <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[minmax(0,1fr)_280px_minmax(0,1fr)] md:items-center md:gap-10 md:px-10">
            <div className="min-w-0 text-center md:text-right">
              <motion.p {...entrance(revealed, 0.1, 16)} className="eyebrow text-primary/90">
                Welcome to Website Portfolio
              </motion.p>
              <motion.h1
                {...entrance(revealed, 0.25)}
                className={`mt-3 text-foreground ${heroNameClass}`}
              >
                Muhammad Rifki
                <span className="sr-only"> Ramadhani</span>
              </motion.h1>
            </div>

            {/* Tablet & mobile: static card, tap to flip. On desktop this column stays
                empty and the moving card sits over it. */}
            <motion.div {...entrance(revealed, 0.45, 24)} className="mx-auto mb-6 md:mb-0 md:w-full">
              <PhotoFlipCard frontUrl={heroImageUrl} backUrl={servicesImageUrl} className="lg:hidden" />
            </motion.div>

            <div className="min-w-0 text-center md:text-left">
              {/* Second half of the name; the full name lives in the <h1> for screen readers. */}
              <motion.p
                {...entrance(revealed, 0.35)}
                aria-hidden
                className={`text-foreground ${heroNameClass}`}
              >
                Ramadhani
              </motion.p>
              <motion.div
                {...entrance(revealed, 0.6, 20)}
                className="mt-4 flex min-h-12 items-center justify-center font-display md:justify-start"
              >
                {revealed && <RotatingFoldText words={roles} />}
              </motion.div>
            </div>
          </div>

          <motion.div
            {...entrance(revealed, 1.0, 0)}
            className="relative z-10 mt-10 flex flex-col items-center gap-3 md:absolute md:bottom-8 md:left-1/2 md:mt-0 md:-translate-x-1/2"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <SmoothLink
                href="/#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-button text-primary-foreground transition-transform hover:scale-105"
              >
                Explore My Work
                <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
              </SmoothLink>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-button text-primary shadow-[0_0_20px_-6px_rgba(48,191,191,0.6)] transition-colors hover:bg-primary/20"
                >
                  Download CV
                  <Download className="size-4" />
                </a>
              )}
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground"
            >
              <ArrowDown className="size-4" />
            </motion.div>
          </motion.div>
        </section>

        <section
          ref={servicesRef}
          id="services"
          className="relative overflow-x-clip bg-card/40 py-24 md:py-32 lg:min-h-[100svh]"
        >
          <Glow className="top-1/4 -right-32 size-[26rem] bg-primary/10" />
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            {/* On desktop the text keeps to the left half; the card lands centre-right. */}
            <div className="max-w-xl lg:max-w-[min(36rem,50%)]">
              <Reveal>
                <p className="eyebrow">
                  What I Offer
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-3 heading-section text-foreground">
                  What Can I Do For You
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Sebagai fullstack developer, saya membantu mewujudkan ide jadi
                  produk digital yang utuh — dari sisi server sampai yang dilihat
                  pengguna.
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
                        aria-expanded={isOpen}
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
      </div>

      <TechMarquee items={techRow1} />

      <section
        id="about"
        className="relative overflow-x-clip py-24 md:min-h-[85vh] md:py-32"
      >
        <Glow className="-bottom-24 -left-32 size-[26rem] bg-primary/10" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:px-10">
          <div className="order-2 space-y-6 md:order-1">
            <Reveal>
              <p className="eyebrow">
                {aboutTitle}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="heading-section text-foreground">
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
                    <p className="font-display text-3xl font-semibold text-primary md:text-4xl">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-xs text-muted-foreground">
                Tarik, ayunkan, atau klik kartu untuk melihat sisi lainnya.
              </p>
            </Reveal>
          </div>

          <div className="order-1 h-105 md:order-2 md:h-150">
            <AboutLanyard
              frontImage={aboutFrontImageUrl}
              backImage={aboutBackImageUrl}
              strapImage={lanyardStrapImageUrl}
            />
            <PreloadHints urls={[aboutFrontImageUrl, aboutBackImageUrl, lanyardStrapImageUrl]} />
          </div>
        </div>
      </section>

      <TechMarquee items={techRow2} />
    </div>
  );
}
