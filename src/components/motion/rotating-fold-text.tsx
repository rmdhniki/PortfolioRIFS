"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import FoldTextRaw from "./fold-text";

const FoldText = FoldTextRaw as unknown as ComponentType<Record<string, unknown>>;

export function RotatingFoldText({
  words,
  interval = 3200,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      interval
    );
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <FoldText
      key={index}
      text={words[index] ?? ""}
      foldStyle="paper"
      splitBy="char"
      hinge="top"
      trigger="mount"
      foldAngle={92}
      duration={0.65}
      stagger={0.045}
      ease="power3.out"
      perspective={700}
      creaseShading={0.55}
      fontSize="clamp(1.25rem, 3vw, 2rem)"
      fontWeight={700}
      color="#30BFBF"
    />
  );
}
