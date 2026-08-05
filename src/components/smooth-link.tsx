"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type SmoothLinkProps = ComponentProps<typeof Link> & { offset?: number };

export function SmoothLink({
  href,
  offset = -96,
  onClick,
  children,
  ...props
}: SmoothLinkProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);

    const hrefStr = href.toString();
    const [path, hash] = hrefStr.split("#");
    if (!hash) return;

    const targetPath = path || "/";

    if (targetPath === pathname) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el && lenis) {
        lenis.scrollTo(el, { offset });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    e.preventDefault();
    router.push(hrefStr);
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
