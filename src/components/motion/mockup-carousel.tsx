"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  LAPTOP_MOCKUPS,
  LAPTOP_SCREEN,
  PHONE_MOCKUPS,
  PHONE_SCREEN,
  mockupFor,
  quadTransform,
  type DeviceMockup,
  type ScreenSpec,
} from "@/lib/mockups";

const AUTOPLAY_MS = 4000;
const SWIPE_MIN_PX = 40;

type Kind = "phone" | "laptop";

/**
 * Project screenshots shown inside device mockups, one mockup per slide
 * (1, 2, 3, 1, 2, 3, …). Phone or laptop mockups depending on `kind`.
 *
 * Scrolling safety: Embla only handles *mouse* drags. Touch swipes are read
 * from pointer events without ever calling preventDefault, and the viewport is
 * `touch-action: pan-y`, so a vertical swipe on the carousel always scrolls
 * the page (and the stacking-card effect around it).
 */
export function MockupCarousel({
  kind,
  images,
  gradient,
  title,
}: {
  kind: Kind;
  images: string[];
  gradient: string;
  title: string;
}) {
  const mockups = kind === "phone" ? PHONE_MOCKUPS : LAPTOP_MOCKUPS;
  const screen = kind === "phone" ? PHONE_SCREEN : LAPTOP_SCREEN;
  const slides: (string | null)[] = images.length > 0 ? images : [null];
  const multiple = slides.length > 1;

  const reduce = useReducedMotion();
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      active: multiple,
      // Mouse drag only; touch is handled below so it can never block page scroll.
      watchDrag: (_api, evt) => evt.type === "mousedown",
    },
    multiple ? [autoplay] : []
  );

  // Slide width drives the scale of the (fixed pixel size) mockup stage.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const setViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef]
  );
  const [slideWidth, setSlideWidth] = useState(0);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSlideWidth(el.clientWidth));
    ro.observe(el);
    setSlideWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.5 });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    // plugins() is undefined while the carousel is inactive (0–1 slides) — guard it,
    // otherwise the whole page crashes.
    const plugin = emblaApi?.plugins()?.autoplay;
    if (!plugin) return;
    if (inView && !reduce) plugin.play();
    else plugin.stop();
  }, [emblaApi, inView, reduce]);

  const go = useCallback(
    (dir: -1 | 1 | number, absolute = false) => {
      if (!emblaApi) return;
      if (absolute) emblaApi.scrollTo(dir);
      else if (dir < 0) emblaApi.scrollPrev();
      else emblaApi.scrollNext();
      emblaApi.plugins()?.autoplay?.reset();
    },
    [emblaApi]
  );

  // Touch swipe detection — passive, never prevents scrolling.
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || !multiple) return;
    touchStart.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    // Fired when the browser takes the gesture over for vertical page scrolling.
    touchStart.current = null;
  };

  const sizeClass =
    kind === "phone"
      ? "mx-auto aspect-2/3 h-[min(40vh,26rem)] md:h-[min(64vh,38rem)]"
      : "aspect-3/2 w-full";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Screenshot ${title}`}
      className="group/carousel relative w-full"
    >
      <div
        ref={setViewport}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={`relative touch-pan-y overflow-hidden select-none ${sizeClass}`}
      >
        <div className="flex h-full">
          {slides.map((src, i) => (
            <MockupSlide
              key={`${src ?? "empty"}-${i}`}
              mockup={mockupFor(mockups, i)}
              screen={screen}
              src={src}
              gradient={gradient}
              slideWidth={slideWidth}
              hidden={i !== selected}
              label={`${i + 1} dari ${slides.length}`}
            />
          ))}
        </div>
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Gambar sebelumnya"
            className="absolute top-1/2 left-0 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 hover:bg-black/80 focus-visible:opacity-100 md:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Gambar berikutnya"
            className="absolute top-1/2 right-0 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 hover:bg-black/80 focus-visible:opacity-100 md:flex"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="mt-3 flex justify-center gap-1.5">
            {slides.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => go(i, true)}
                aria-label={`Gambar ${i + 1}`}
                aria-current={i === selected}
                className={`h-1.5 rounded-full transition-all ${
                  i === selected ? "w-5 bg-[#8FEFEF]" : "w-1.5 bg-white/35 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MockupSlide({
  mockup,
  screen,
  src,
  gradient,
  slideWidth,
  hidden,
  label,
}: {
  mockup: DeviceMockup;
  screen: ScreenSpec;
  src: string | null;
  gradient: string;
  slideWidth: number;
  hidden: boolean;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={hidden}
      className="relative h-full min-w-0 flex-[0_0_100%]"
    >
      {/* Screenshot, warped onto the screen quad. Drawn first so the frame covers its edges. */}
      {slideWidth > 0 && (
        <div
          className="pointer-events-none absolute top-0 left-0 origin-top-left"
          style={{
            width: mockup.width,
            height: mockup.height,
            transform: `scale(${slideWidth / mockup.width})`,
          }}
        >
          <div
            className="absolute top-0 left-0 overflow-hidden bg-black"
            style={{
              width: screen.width,
              height: screen.height,
              borderRadius: screen.radius,
              transformOrigin: "0 0",
              transform: quadTransform(mockup.screen, screen.width, screen.height),
            }}
          >
            <div
              className="absolute overflow-hidden"
              style={{ inset: `${screen.insetY}px ${screen.insetX}px`, borderRadius: screen.innerRadius }}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="640px"
                  className="object-cover object-top"
                  draggable={false}
                />
              ) : (
                <div className={`size-full bg-linear-to-br ${gradient}`} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Device frame (transparent background + screen) on top. */}
      <Image
        src={mockup.src}
        alt=""
        fill
        sizes="(min-width: 768px) 560px, 90vw"
        className="pointer-events-none object-contain"
        draggable={false}
      />
    </div>
  );
}
