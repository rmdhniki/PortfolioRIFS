"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryCarousel({ slides }: { slides: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((gradient, i) => (
            <div key={i} className="min-w-0 flex-[0_0_85%] px-2 md:flex-[0_0_60%]">
              <div
                className={`aspect-video rounded-2xl border border-border bg-gradient-to-br ${gradient}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next slide"
          className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
