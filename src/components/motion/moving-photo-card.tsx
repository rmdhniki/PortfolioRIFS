"use client";

import { useState, type RefObject } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const CARD_W = 280;
const CARD_H = 350; // 4:5

type Faces = { frontUrl: string | null; backUrl: string | null };

function Face({
  url,
  side,
  sizes,
  critical,
}: {
  url: string | null;
  side: "front" | "back";
  sizes: string;
  critical?: boolean;
}) {
  if (!url) {
    return (
      <div className="flex size-full items-center justify-center bg-linear-to-br from-secondary to-background font-display text-5xl font-bold text-primary">
        {side === "front" ? "MR" : "RIFS"}
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt=""
      fill
      sizes={sizes}
      // Deliberately lazy (no `priority`/eager): desktop and mobile cards both
      // exist with one hidden per breakpoint. Eager images get an automatic
      // <link rel=preload>, wasted on the hidden card; a lazy image that is on
      // screen still loads right away, and the loading screen waits for it.
      data-critical={critical ? "" : undefined}
      className="object-cover"
      draggable={false}
    />
  );
}

/** Shared card chrome: rounded, bordered, soft blue glow — the "floating card" look. */
const cardChrome =
  "absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-card shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85),0_0_40px_-12px_rgba(48,191,191,0.45)] backface-hidden";

/**
 * Desktop (lg+): one floating card that travels from the centre of the Hero to
 * the centre-right of Services while flipping over (rotateY 0° → 180°), ending
 * on the back photo. Progress is measured across the Hero → Services
 * transition itself, so it doesn't depend on section heights.
 */
export function MovingPhotoCard({
  frontUrl,
  backUrl,
  servicesRef,
}: Faces & { servicesRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: servicesRef,
    // 0 when Services' top enters at the bottom of the screen, 1 when it reaches the top.
    offset: ["start end", "start start"],
  });
  // A light spring smooths out wheel steps without lagging noticeably.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const left = useTransform(progress, [0.1, 0.85], ["50%", "73%"]);
  const rotateY = useTransform(progress, [0.15, 0.8], [0, reduce ? 0 : 180]);
  const rotateZ = useTransform(progress, [0.15, 0.5, 0.8], [0, reduce ? 0 : -5, 0]);
  const scale = useTransform(progress, [0.15, 0.5, 0.8], [1, reduce ? 1 : 0.92, 1]);
  const lift = useTransform(progress, [0.15, 0.5, 0.8], [0, reduce ? 0 : -24, 0]);
  // Reduced motion: no 3D flip, the photos crossfade instead.
  const frontOpacity = useTransform(progress, [0.4, 0.6], [1, reduce ? 0 : 1]);
  const backOpacity = useTransform(progress, [0.4, 0.6], [reduce ? 0 : 1, 1]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      <div
        className="sticky mx-auto max-w-6xl px-10"
        style={{ top: `calc(50svh - ${CARD_H / 2}px)`, height: CARD_H }}
      >
        <div className="relative size-full perspective-[1400px]">
          <motion.div
            style={{
              left,
              x: "-50%",
              y: lift,
              rotateY,
              rotateZ,
              scale,
              width: CARD_W,
              height: CARD_H,
              transformStyle: "preserve-3d",
            }}
            className="absolute top-0"
          >
            <div className="float-y size-full transform-3d">
              <motion.div style={{ opacity: frontOpacity }} className={cardChrome}>
                <Face url={frontUrl} side="front" sizes={`${CARD_W}px`} critical />
              </motion.div>
              <motion.div
                style={{ opacity: backOpacity, rotateY: reduce ? 0 : 180 }}
                className={cardChrome}
              >
                <Face url={backUrl ?? frontUrl} side="back" sizes={`${CARD_W}px`} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Tablet & mobile: a static card in the Hero; tap to flip between front and back. */
export function PhotoFlipCard({ frontUrl, backUrl, className = "" }: Faces & { className?: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-label={flipped ? "Tampilkan foto depan" : "Tampilkan foto belakang"}
      aria-pressed={flipped}
      className={`group relative block aspect-4/5 w-55 perspective-distant md:w-full ${className}`}
    >
      <motion.div
        animate={{ rotateY: flipped && !reduce ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="relative size-full transform-3d"
      >
        <motion.div
          animate={{ opacity: reduce && flipped ? 0 : 1 }}
          className={cardChrome}
        >
          <Face url={frontUrl} side="front" sizes="(max-width: 768px) 220px, 280px" critical />
        </motion.div>
        <motion.div
          animate={{ opacity: reduce && !flipped ? 0 : 1 }}
          style={{ rotateY: reduce ? 0 : 180 }}
          className={cardChrome}
        >
          <Face url={backUrl ?? frontUrl} side="back" sizes="(max-width: 768px) 220px, 280px" />
        </motion.div>
      </motion.div>
    </button>
  );
}
