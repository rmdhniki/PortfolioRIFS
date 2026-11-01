"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { isLoaderSkipped, markLoaderDone } from "@/lib/site-loader-state";
import { detectDeviceProfile, hasWebGL } from "@/components/motion/hooks";

/** Intended length of the loading experience; used to warm up heavy sections too. */
const DURATION_MS = 10000;
/** Upper bound if resources are still not ready, so slow networks aren't blocked forever. */
const MAX_WAIT_MS = 15000;
/** Let the intro fade in smoothly before the heavy module downloads/parsing start. */
const WARMUP_DELAY_MS = 400;
/** Short hold on 100% before fading out. */
const HOLD_MS = 450;
const FADE_OUT_MS = 800;

/** Mostly linear (steady, readable count) with softened start and end. */
const easeProgress = (t: number) =>
  (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) * 0.3 + t * 0.7;

type Phase = "loading" | "leaving" | "done";

function waitForImage(img: HTMLImageElement) {
  if (img.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const settle = (promise: Promise<unknown>) => promise.then(
  () => undefined,
  () => undefined
);

/**
 * Fetch and decode an image the way the WebGL components will (CORS mode), so
 * their later request is served straight from the browser cache.
 */
function preloadImage(url: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = url;
  return settle(img.decode());
}

/**
 * Warm-up work done while the loading screen is up, so later sections don't
 * stall when scrolled to: download + evaluate the heavy WebGL modules
 * (three.js/Lanyard only where the 3D card will actually be used) and fetch +
 * decode the About and certificate images.
 */
function warmUpTasks(): Promise<void>[] {
  const device = detectDeviceProfile();
  const modules: (() => Promise<unknown>)[] = [];
  if (hasWebGL(2)) {
    modules.push(() => import("@/components/motion/cursor-grid"));
    modules.push(() => import("@/components/motion/circular-gallery"));
  }
  if (hasWebGL(1) && !device.lite) {
    modules.push(() => import("@/components/motion/lanyard"));
  }
  const moduleTasks = modules.map((load) => settle(delay(WARMUP_DELAY_MS).then(load)));

  const urls = new Set<string>();
  document.querySelectorAll<HTMLElement>("[data-preload-image]").forEach((el) => {
    const url = el.dataset.preloadImage;
    if (url) urls.add(url);
  });
  const imageTasks = [...urls].map(preloadImage);

  return [...moduleTasks, ...imageTasks];
}

/**
 * Loading stages: DOM parsed, web fonts ready, every visible critical image
 * (`data-critical`) loaded, the window `load` event, and the warm-up tasks.
 */
function collectTasks(): Promise<void>[] {
  const tasks: Promise<void>[] = [];

  tasks.push(
    document.readyState === "loading"
      ? new Promise((resolve) =>
          document.addEventListener("DOMContentLoaded", () => resolve(), { once: true })
        )
      : Promise.resolve()
  );

  tasks.push(document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve());

  document.querySelectorAll<HTMLImageElement>("img[data-critical]").forEach((img) => {
    // Skip images hidden at this breakpoint.
    if (img.getClientRects().length > 0) tasks.push(waitForImage(img));
  });

  tasks.push(
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", () => resolve(), { once: true }))
  );

  tasks.push(...warmUpTasks());
  return tasks;
}

export function SiteLoader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const barRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Lock scrolling (native + Lenis) while the overlay is up.
  useEffect(() => {
    if (phase === "done") {
      document.documentElement.style.removeProperty("overflow");
      lenis?.start();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
  }, [phase, lenis]);

  useEffect(() => {
    if (isLoaderSkipped()) {
      markLoaderDone();
      setPhase("done");
      // No loading screen this time: still warm up heavy sections, once the browser is idle.
      const idle =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      idle(() => void warmUpTasks());
      return;
    }

    const started = performance.now();
    let ready = 0;
    let raf = 0;
    let leaveTimer = 0;
    let finished = false;

    const tasks = collectTasks();
    let completed = 0;
    tasks.forEach((task) =>
      task.then(() => {
        completed += 1;
        ready = Math.max(ready, completed / tasks.length);
      })
    );
    const timeout = window.setTimeout(() => (ready = 1), MAX_WAIT_MS);

    // The bar runs 0 → 100% over DURATION_MS but never ahead of real readiness.
    // DOM is written directly every frame (fractional width, no React re-render),
    // which keeps the motion perfectly smooth.
    let value = 0;
    let lastPercent = -1;
    const tick = (now: number) => {
      const goal = Math.min(easeProgress(Math.min((now - started) / DURATION_MS, 1)), ready);
      value += Math.max(0, goal - value) * 0.12;
      if (goal - value < 0.0005) value = goal;

      if (barRef.current) barRef.current.style.transform = `scaleX(${value})`;
      if (headRef.current) headRef.current.style.left = `${value * 100}%`;
      const percent = Math.floor(value * 100);
      if (percent !== lastPercent) {
        lastPercent = percent;
        if (percentRef.current) percentRef.current.textContent = `${percent}%`;
        rootRef.current?.setAttribute("aria-valuenow", String(percent));
      }

      if (value >= 1 && !finished) {
        finished = true;
        leaveTimer = window.setTimeout(() => {
          setPhase("leaving");
          markLoaderDone();
          leaveTimer = window.setTimeout(() => setPhase("done"), FADE_OUT_MS);
        }, HOLD_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      window.clearTimeout(leaveTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      id="site-loader"
      role="progressbar"
      aria-label="Memuat website"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className={`fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <div className="flex w-full max-w-md flex-col items-center px-8">
        {/* Plain <img>: paints straight from the static file, before hydration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/madrid2.webp"
          alt=""
          width={480}
          height={720}
          fetchPriority="high"
          className="loader-flicker h-auto w-40 select-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)] sm:w-48"
          draggable={false}
        />

        <div className="mt-8 flex w-full items-end justify-between">
          <span className="text-xs tracking-[0.35em] text-muted-foreground uppercase">Memuat</span>
          <span
            ref={percentRef}
            className="font-display text-3xl leading-none font-bold text-[#8FEFEF] tabular-nums [text-shadow:0_0_18px_rgba(143,239,239,0.45)]"
          >
            0%
          </span>
        </div>

        {/* Track */}
        <div className="relative mt-4 h-1.5 w-full rounded-full bg-white/8 ring-1 ring-white/6">
          {/* Fill: scaled on the GPU for smooth motion */}
          <div
            ref={barRef}
            className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-[#1f9a9a] via-[#30BFBF] to-[#8FEFEF] shadow-[0_0_16px_rgba(143,239,239,0.7)] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
          {/* Glowing head */}
          <div
            ref={headRef}
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CFFAFA] shadow-[0_0_14px_4px_rgba(143,239,239,0.8)]"
            style={{ left: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
