"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const webglSupport: Partial<Record<1 | 2, boolean>> = {};

/**
 * Probe WebGL support once per page and release the probe context right away.
 * (Browsers cap live WebGL contexts at ~16 and drop the oldest when exceeded —
 * leaked probe contexts used to blank out the Hero grid and the gallery.)
 */
function probeWebGL(version: 1 | 2): boolean {
  const cached = webglSupport[version];
  if (cached !== undefined) return cached;
  let ok = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext(version === 2 ? "webgl2" : "webgl") as WebGLRenderingContext | null;
    ok = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    ok = false;
  }
  webglSupport[version] = ok;
  return ok;
}

export function useWebGL(version: 1 | 2 = 1) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(probeWebGL(version));
  }, [version]);

  return supported;
}

export type DeviceProfile = {
  /** Touch-first phone/tablet (no hover, coarse pointer). */
  touch: boolean;
  /** prefers-reduced-motion. */
  reduced: boolean;
  /** ≤4 CPU cores, ≤4 GB RAM, or Save-Data. */
  lowEnd: boolean;
  /** Any of the above: use flat fallbacks for heavy 3D (Lanyard). */
  lite: boolean;
};

/** Client-only: measure the device (shared by the hook and the loading screen). */
export function detectDeviceProfile(): DeviceProfile {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowEnd =
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4 ||
    Boolean(nav.connection?.saveData);
  return { touch, reduced, lowEnd, lite: touch || reduced || lowEnd };
}

/** Device capabilities, or null until measured on the client. */
export function useDeviceProfile() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);

  useEffect(() => {
    setProfile(detectDeviceProfile());
  }, []);

  return profile;
}

const loggedGpu = new Set<string>();

/**
 * Diagnostics: log the GPU / WebGL2 limits once per tag, using a throwaway
 * context that is released right away. Helps pin down blank WebGL canvases
 * on a visitor's machine (open DevTools → Console, filter by the tag).
 */
export function logGpuInfo(tag: string) {
  if (loggedGpu.has(tag)) return;
  loggedGpu.add(tag);
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) {
      console.warn(`[${tag}] WebGL2 tidak tersedia, memakai tampilan cadangan.`);
      return;
    }
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    console.info(`[${tag}] GPU:`, {
      renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    });
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch (error) {
    console.warn(`[${tag}] Gagal membaca info GPU:`, error);
  }
}

/** Whether WebGL (1 or 2) is available; probes once and caches. Client-only. */
export function hasWebGL(version: 1 | 2 = 1) {
  return probeWebGL(version);
}

/**
 * Listens (capture phase, since the event doesn't bubble) for a WebGL canvas
 * inside `ref` losing its context. `reset` clears the flag, e.g. when the
 * component is mounted again.
 */
export function useContextLost<T extends HTMLElement>(ref: RefObject<T | null>, active: boolean) {
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !active) return undefined;
    setLost(false);
    const onLost = () => setLost(true);
    node.addEventListener("webglcontextlost", onLost, true);
    return () => node.removeEventListener("webglcontextlost", onLost, true);
  }, [ref, active]);

  return lost;
}

export type ImageProbe = { done: boolean; ok: Set<string> };

/**
 * Preloads images the same way the WebGL components do (crossOrigin =
 * "anonymous") and reports which URLs actually decode. Lets a component
 * mount WebGL only with images that will render, and fall back otherwise
 * instead of drawing blank cards.
 */
export function useImageProbe(urls: (string | null | undefined)[]): ImageProbe {
  const key = urls.filter(Boolean).join("|");
  const [result, setResult] = useState<ImageProbe>({ done: false, ok: new Set() });

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (list.length === 0) {
      setResult({ done: true, ok: new Set() });
      return undefined;
    }
    let cancelled = false;
    setResult({ done: false, ok: new Set() });
    Promise.all(
      list.map(
        (url) =>
          new Promise<string | null>((resolve) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.decoding = "async";
            image.onload = () => resolve(image.naturalWidth > 0 ? url : null);
            image.onerror = () => resolve(null);
            image.src = url;
          })
      )
    ).then((loaded) => {
      if (cancelled) return;
      const ok = new Set(loaded.filter((url): url is string => url !== null));
      list.filter((url) => !ok.has(url)).forEach((url) => console.warn("[media] Gambar gagal dimuat:", url));
      setResult({ done: true, ok });
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return result;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = "400px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}
