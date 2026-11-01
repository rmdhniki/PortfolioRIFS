"use client";

import Image from "next/image";
import { lazy, Suspense, useState, type ComponentType } from "react";
import { useContextLost, useDeviceProfile, useImageProbe, useInView, useWebGL } from "./hooks";

/** Card proportions used by the Lanyard component (portrait 1.6 × 2.25). */
const CARD_ASPECT = "aspect-[1.6/2.25]";

// Loaded only when the 3D card is actually shown (client-side, never on lite devices).
const Lanyard = lazy(() => import("./lanyard")) as unknown as ComponentType<Record<string, unknown>>;

function CardPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] border border-border bg-card">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/15 font-display text-2xl text-primary">
          MR
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/** Static still of the card, roughly where the 3D card comes to rest. */
function CardPoster({ src }: { src: string }) {
  return (
    <div className="flex h-full w-full items-end justify-center pb-[8%]">
      <div
        className={`relative ${CARD_ASPECT} h-[60%] overflow-hidden rounded-[1.25rem] border border-white/10 bg-card shadow-2xl shadow-black/50`}
      >
        <Image src={src} alt="" fill sizes="(max-width: 768px) 60vw, 25vw" className="object-cover" />
      </div>
    </div>
  );
}

/** Flat flip card: lite devices, no WebGL, a lost GPU context, or unusable textures. */
function FlatCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return <CardPlaceholder message="Foto About gagal dimuat." />;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-label={flipped ? "Tampilkan foto depan" : "Tampilkan foto belakang"}
        aria-pressed={flipped}
        className={`relative ${CARD_ASPECT} h-full max-h-120 max-w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-card shadow-2xl shadow-black/50 transition-transform duration-300 active:scale-[0.98]`}
      >
        <Image
          key={flipped ? back : front}
          src={flipped ? back : front}
          alt="Foto About"
          fill
          sizes="(max-width: 768px) 80vw, 40vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </button>
    </div>
  );
}

export function AboutLanyard({
  frontImage,
  backImage,
  strapImage,
}: {
  frontImage: string | null;
  backImage: string | null;
  strapImage: string | null;
}) {
  const webgl = useWebGL(1);
  const device = useDeviceProfile();
  // Mount the 3D card once, well before About scrolls into view (three.js is
  // already preloaded by the loading screen), and keep it: re-creating it on
  // every visit recompiled shaders and rebuilt the environment map each time.
  // The Lanyard pauses rendering by itself while off-screen or at rest.
  const [ref, inView] = useInView<HTMLDivElement>("600px");
  const lite = device?.lite ?? null;
  const wants3D = webgl === true && lite === false;
  const probe = useImageProbe(inView && wants3D ? [frontImage, backImage, strapImage] : []);

  const front = frontImage ?? backImage;
  const frontOk = front && probe.ok.has(front) ? front : backImage && probe.ok.has(backImage) ? backImage : null;
  const backOk = backImage && probe.ok.has(backImage) ? backImage : frontOk;
  const strapOk = strapImage && probe.ok.has(strapImage) ? strapImage : undefined;
  const show3D = wants3D && probe.done && Boolean(frontOk);
  const lost = useContextLost(ref, show3D);

  if (!front) {
    return <CardPlaceholder message="Unggah foto About di dashboard admin (menu Photos)." />;
  }

  let content: React.ReactNode;
  if (webgl === null || lite === null) {
    content = <CardPoster src={front} />;
  } else if (!wants3D || lost || (probe.done && !frontOk)) {
    content = <FlatCard front={front} back={backImage ?? front} />;
  } else if (!show3D) {
    content = <CardPoster src={front} />;
  } else {
    content = (
      // While three.js downloads, a still of the card keeps the space filled.
      <Suspense fallback={<CardPoster src={frontOk ?? front} />}>
      <Lanyard
        frontImage={frontOk}
        backImage={backOk}
        strapImage={strapOk}
        orientation="portrait"
        imageFit="cover"
        finish="glossy"
        cardColor="#0A0A0A"
        strapColor="#111111"
        metal="graphite"
        anchor="center"
        // No idle wind: the card settles and rendering stops until it's touched.
        breeze={0}
        // A little more damping so a thrown card settles sooner (default 0.5).
        damping={0.7}
      />
      </Suspense>
    );
  }

  return (
    <div ref={ref} className="relative h-full w-full">
      {content}
      <p className="sr-only">
        Kartu foto About. Tarik atau ayunkan kartu, klik untuk melihat sisi lainnya.
      </p>
    </div>
  );
}
