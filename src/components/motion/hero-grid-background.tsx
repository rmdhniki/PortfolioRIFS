"use client";

import dynamic from "next/dynamic";
import { useRef, type ComponentType } from "react";
import { useLoaderDone } from "@/lib/site-loader-state";
import { useContextLost, useDeviceProfile, useWebGL } from "./hooks";

const CursorGrid = dynamic(() => import("./cursor-grid"), {
  ssr: false,
  loading: () => <StaticGrid />,
}) as unknown as ComponentType<Record<string, unknown>>;

const ACCENT = "#30BFBF";

/** CSS-only grid: shown before the WebGL grid loads and as the fallback. */
function StaticGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)] opacity-[0.07]"
      style={{
        backgroundImage: `linear-gradient(${ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${ACCENT} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        backgroundPosition: "center center",
      }}
    />
  );
}

/**
 * Interactive grid behind the Hero: cells near the cursor light up in the
 * accent blue. Kept dim so the heading stays readable.
 *
 * Runs on every device. The static CSS grid is only a fallback, for browsers
 * without WebGL2 or when the GPU context is lost — never a blank area.
 * (The CursorGrid pauses itself while scrolled out of view.)
 */
export function HeroGridBackground() {
  const webgl2 = useWebGL(2);
  const device = useDeviceProfile();
  // Mount after the loading screen so the intro pulse is actually seen.
  const revealed = useLoaderDone();
  const ref = useRef<HTMLDivElement>(null);
  const live = Boolean(webgl2 && revealed && device);
  const lost = useContextLost(ref, live);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {live && !lost ? (
        <CursorGrid
          cellSize={64}
          color={ACCENT}
          gridColor={ACCENT}
          highlight="area"
          gridStyle="lines"
          radius={150}
          falloff="smooth"
          holdTime={350}
          fadeDuration={900}
          maxOpacity={0.75}
          fillOpacity={0.09}
          gridOpacity={0.07}
          spotlight={0.55}
          clickPulse
          pulseSpeed={700}
          // Touch screens have no hover: let a few cells glow softly on their own.
          ambient={device?.touch ? 0.22 : 0}
          edgeFade={0.25}
          intro
        />
      ) : (
        <StaticGrid />
      )}
    </div>
  );
}
