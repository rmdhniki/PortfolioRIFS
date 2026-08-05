"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1500,
  className,
}: {
  words: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    if (!deleting && subIndex === currentWord.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className}>
      {words[index].substring(0, subIndex)}
      <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-1 animate-pulse bg-current align-middle" />
    </span>
  );
}
