"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ComponentType } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  logGpuInfo,
  useContextLost,
  useImageProbe,
  useInView,
  useWebGL,
} from "@/components/motion/hooks";
import { PreloadHints } from "@/components/preload-hints";
import { optimizedImageUrl } from "@/lib/image-url";

/** Texture URL for a certificate: resized and same-origin (null without an image). */
function textureUrlOf(cert: CertificationItem): string | null {
  return cert.image_url ? optimizedImageUrl(cert.image_url, 1200) : null;
}

/** Map a certificate to the `items` shape the React Bits CircularGallery expects. */
function toGalleryItem(cert: CertificationItem) {
  return {
    image: textureUrlOf(cert) as string,
    text: cert.title,
    description: cert.description,
    alt: cert.title,
  };
}
import type { CertificationItem } from "@/lib/supabase/types";

const CircularGallery = dynamic(() => import("@/components/motion/circular-gallery"), {
  ssr: false,
  loading: () => <GalleryLoading />,
}) as unknown as ComponentType<Record<string, unknown>>;

function GalleryLoading() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Memuat galeri...
    </div>
  );
}

function CertificateImage({ cert }: { cert: CertificationItem }) {
  const [failed, setFailed] = useState(false);
  if (!cert.image_url || failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <ImageOff className="size-8" />
        <span className="text-xs">Gambar sertifikat tidak tersedia</span>
      </div>
    );
  }
  return (
    <Image
      src={cert.image_url}
      alt={cert.title}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-contain"
      onError={() => setFailed(true)}
    />
  );
}

/** Plain slideshow used without WebGL2 or when no image can be used as a texture. */
function FlatGallery({
  certs,
  active,
  onStep,
}: {
  certs: CertificationItem[];
  active: number;
  onStep: (delta: number) => void;
}) {
  const cert = certs[active];
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card">
        {cert && <CertificateImage key={cert.id} cert={cert} />}
      </div>
      {certs.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Sertifikat sebelumnya"
            className="rounded-full border border-border p-2 text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground">
            {active + 1} / {certs.length}
          </span>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Sertifikat berikutnya"
            className="rounded-full border border-border p-2 text-foreground hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function Certification({ certifications }: { certifications: CertificationItem[] }) {
  const [active, setActive] = useState(0);
  const webgl2 = useWebGL(2);
  // Mounted once on first approach and kept (the gallery pauses itself off-screen).
  const [galleryRef, galleryInView] = useInView<HTMLDivElement>();
  // Texture URLs: resized + same-origin via the Next image optimizer (see optimizedImageUrl).
  const textureUrls = useMemo(() => certifications.map(textureUrlOf), [certifications]);
  const probe = useImageProbe(galleryInView ? textureUrls : []);

  const ready = galleryInView && webgl2 !== null && probe.done;
  const textured = useMemo(
    () =>
      certifications.filter((cert) => {
        const url = textureUrlOf(cert);
        return url !== null && probe.ok.has(url);
      }),
    [certifications, probe.ok]
  );
  const galleryItems = useMemo(() => textured.map(toGalleryItem), [textured]);
  const canUseWebGL = ready && webgl2 === true && textured.length > 0;
  const lost = useContextLost(galleryRef, canUseWebGL);

  // Diagnostics for blank-gallery reports: GPU limits once, and a lost context.
  useEffect(() => {
    if (galleryInView && webgl2 !== null) logGpuInfo("gallery");
  }, [galleryInView, webgl2]);
  useEffect(() => {
    if (lost) console.warn("[gallery] Konteks WebGL hilang, beralih ke slideshow biasa.");
  }, [lost]);
  // A lost GPU context falls back to the plain slideshow instead of a blank box.
  const useWebGLGallery = canUseWebGL && !lost;
  // The WebGL gallery can only show certificates with a working image; the flat view shows all.
  const list = useWebGLGallery ? textured : certifications;
  const index = Math.min(active, Math.max(list.length - 1, 0));
  const current = list[index];
  const step = (delta: number) =>
    setActive((value) => (value + delta + list.length) % list.length);

  if (certifications.length === 0) {
    return (
      <section id="certification" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="eyebrow">
            Certification
          </p>
          <h2 className="mt-3 heading-section text-foreground">
            Certifications
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">Belum ada sertifikat.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certification" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center md:px-10">
        <Reveal className="order-2 md:order-1">
          <p className="eyebrow">
            Certification
          </p>
          <h2 className="mt-3 heading-section text-foreground">
            {current?.title}
          </h2>
          {current?.description && (
            <p className="mt-4 leading-relaxed text-muted-foreground">{current.description}</p>
          )}
          {current?.credential_id && (
            <p className="mt-4 text-sm text-muted-foreground">
              ID: <span className="text-foreground">{current.credential_id}</span>
            </p>
          )}
          {current?.verify_url && (
            <a
              href={current.verify_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-button text-primary transition-colors hover:bg-primary/20"
            >
              Verifikasi sertifikat
              <ExternalLink className="size-4" />
            </a>
          )}
        </Reveal>

        <PreloadHints urls={textureUrls} />
        <div ref={galleryRef} className="relative order-1 h-95 md:order-2 md:h-150">
          {!ready ? (
            <GalleryLoading />
          ) : useWebGLGallery ? (
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.05}
              // Titles already show large in the left column.
              showTitles={false}
              // Use the site font; the default would fetch Figtree from Google Fonts.
              font="bold 30px 'Space Grotesk', sans-serif"
              onActiveChange={setActive}
            />
          ) : (
            <FlatGallery certs={list} active={index} onStep={step} />
          )}
        </div>
      </div>
    </section>
  );
}
