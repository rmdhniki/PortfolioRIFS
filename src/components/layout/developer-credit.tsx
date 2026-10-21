"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export function DeveloperCredit({ name }: { name: string }) {
  const router = useRouter();
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    clicksRef.current += 1;
    if (clicksRef.current >= 5) {
      clicksRef.current = 0;
      router.push("/admin/login");
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, 1500);
  }

  return (
    <p>
      Designed &amp;{" "}
      <span onClick={handleClick} className="select-none">
        Developed
      </span>{" "}
      by {name}
    </p>
  );
}
