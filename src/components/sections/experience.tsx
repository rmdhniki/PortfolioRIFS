"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { formatExperiencePeriod } from "@/lib/format-period";
import type { ExperienceItem } from "@/lib/supabase/types";

const AVATAR_SRC = "/images/madrid2-avatar.webp";
const ease = [0.16, 1, 0.3, 1] as const;

/** Where on screen the avatar rides while the timeline scrolls past (fraction of viewport height). */
const TRACK_AT = 0.55;

// Horizontal centre of the line (px from the list's left edge), per breakpoint.
const LINE_X = "left-5.5 md:left-6";

type Layout = { start: number; end: number; height: number; stops: number[] };

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Small waypoint on the line; lights up once the avatar has reached it. */
function Waypoint({
  lit,
  innerRef,
  className = "",
}: {
  lit: boolean;
  innerRef: (el: HTMLSpanElement | null) => void;
  className?: string;
}) {
  return (
    <span
      ref={innerRef}
      aria-hidden
      className={`absolute ${LINE_X} z-10 size-3 -translate-x-1/2 rounded-full border-2 transition-all duration-500 ${
        lit
          ? "border-[#8FEFEF] bg-[#8FEFEF] shadow-[0_0_12px_2px_rgba(143,239,239,0.6)]"
          : "border-white/20 bg-background"
      } ${className}`}
    />
  );
}

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout>({ start: 0, end: 0, height: 0, stops: [] });
  // Latest layout for motion-value transforms, plus a numeric version that
  // changes on every re-measure so those transforms recompute.
  const layoutRef = useRef<Layout>(layout);
  const layoutVersion = useMotionValue(0);
  // Index of the waypoint the avatar has reached (-1 = before the first entry).
  const [reached, setReached] = useState(-1);

  const stopCount = experiences.length + 1; // entries + the closing "coming soon" point

  // Measure waypoint centres relative to the list (scroll-independent).
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top;
    const stops = stopRefs.current
      .slice(0, stopCount)
      .map((el) => (el ? el.getBoundingClientRect().top - top + el.offsetHeight / 2 : 0));
    const next: Layout = {
      start: stops[0] ?? 0,
      end: stops[stops.length - 1] ?? 0,
      height: list.offsetHeight,
      stops,
    };
    layoutRef.current = next;
    setLayout(next);
    layoutVersion.set(layoutVersion.get() + 1);
  }, [layoutVersion, stopCount]);

  useIsomorphicLayoutEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  // 0 when the list's top passes TRACK_AT of the screen, 1 when its bottom does.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: [`start ${TRACK_AT * 100}%`, `end ${TRACK_AT * 100}%`],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5 });

  // Avatar position along the line, clamped between the first and the closing waypoint.
  const positionAt = useCallback(
    (value: number) => {
      const { start, end, height } = layoutRef.current;
      return reduce ? end : Math.min(end, Math.max(start, value * height));
    },
    [reduce]
  );
  const avatarY = useTransform([progress, layoutVersion], ([value]: number[]) => positionAt(value));
  const fillHeight = useTransform([avatarY, layoutVersion], ([y]: number[]) =>
    Math.max(0, y - layoutRef.current.start)
  );

  // Which waypoint has the avatar reached? Recomputed on scroll and on re-measure.
  const updateReached = useCallback(() => {
    const y = positionAt(progress.get());
    let index = -1;
    layoutRef.current.stops.forEach((stop, i) => {
      if (y >= stop - 2) index = i;
    });
    setReached((prev) => (prev === index ? prev : index));
  }, [positionAt, progress]);
  useMotionValueEvent(progress, "change", updateReached);
  useEffect(updateReached, [layout, updateReached]);

  // Reduced motion: everything is shown as reached.
  const current = reduce ? stopCount - 1 : reached;
  const listInView = useInView(listRef, { once: true, margin: "0px 0px -20% 0px" });
  const setStopRef = (index: number) => (el: HTMLSpanElement | null) => {
    stopRefs.current[index] = el;
  };

  return (
    // overflow-x-clip: hidden entries are shifted right before fading in; clip (unlike
    // hidden) doesn't create a scroll container, so scroll tracking stays intact.
    <section id="experience" className="relative overflow-x-clip py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="mt-3 heading-section text-foreground">Where I&apos;ve worked</h2>
        </Reveal>

        <div ref={listRef} className="relative mt-14 max-w-3xl">
          {/* Track between the first and the closing waypoint. */}
          <div
            aria-hidden
            className={`absolute ${LINE_X} w-0.5 -translate-x-1/2 rounded-full bg-white/[0.07]`}
            style={{ top: layout.start, height: Math.max(0, layout.end - layout.start) }}
          >
            {/* Light-blue line that grows with the avatar. */}
            <motion.div
              style={{ height: fillHeight }}
              className="w-full rounded-full bg-linear-to-b from-[#30BFBF] to-[#8FEFEF] shadow-[0_0_12px_rgba(143,239,239,0.6)]"
            />
          </div>

          {/* The single travelling avatar. */}
          {layout.end > 0 && (
            // Outer layer rides the line (y); inner layer centres the avatar on that point.
            <motion.div
              aria-hidden
              style={{ y: avatarY }}
              className={`pointer-events-none absolute top-0 ${LINE_X} z-20 size-0`}
            >
              <div className="absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-0.75 ring-2 ring-[#8FEFEF]/80 shadow-[0_0_24px_-2px_rgba(143,239,239,0.65)] md:size-12">
                <Image
                  src={AVATAR_SRC}
                  alt=""
                  width={96}
                  height={96}
                  className="size-full rounded-full object-cover"
                />
              </div>
            </motion.div>
          )}

          <ol className="relative">
            {experiences.map((item, index) => {
              const period = formatExperiencePeriod(item);
              const isActive = current === index;
              const isReached = current >= index;
              // The first entry shows as the timeline comes into view; every later one
              // fades in when the avatar touches its dot, and hides again on the way back up.
              const shown = reduce || (index === 0 ? listInView || isReached : isReached);
              return (
                <li key={item.id} className="relative pb-12 pl-16 md:pl-20">
                  <Waypoint lit={isReached} innerRef={setStopRef(index)} className="top-7" />
                  <motion.article
                    initial={false}
                    animate={shown ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 28, scale: 0.98 }}
                    transition={{ duration: shown ? 0.6 : 0.35, ease }}
                    style={{ pointerEvents: shown ? "auto" : "none" }}
                    className={`rounded-2xl border bg-card p-5 transition-[border-color,box-shadow] duration-500 md:p-6 ${
                      isActive
                        ? "border-[#8FEFEF]/40 shadow-[0_0_32px_-12px_rgba(143,239,239,0.55)]"
                        : "border-border"
                    }`}
                  >
                    {period && (
                      <p className="text-xs font-medium tracking-[0.2em] text-[#8FEFEF] uppercase">
                        <time dateTime={item.start_date ?? undefined}>{period}</time>
                      </p>
                    )}
                    <h3 className="mt-2 text-xl text-foreground md:text-2xl">{item.role}</h3>
                    {item.company && (
                      <p className="mt-1 text-sm font-medium text-primary">{item.company}</p>
                    )}
                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {item.description}
                      </p>
                    )}
                  </motion.article>
                </li>
              );
            })}

            {/* Closing point: the avatar comes to rest here. */}
            <li className="relative pl-16 md:pl-20">
              <Waypoint
                lit={current >= experiences.length}
                innerRef={setStopRef(experiences.length)}
                className="top-1/2 -translate-y-1/2"
              />
              <motion.p
                initial={false}
                animate={
                  reduce || current >= experiences.length
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: 28 }
                }
                transition={{ duration: 0.6, ease }}
                className="flex min-h-12 items-center font-display text-lg font-semibold text-foreground md:text-xl"
              >
                Pengalaman Berikutnya Segera Hadir
              </motion.p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
