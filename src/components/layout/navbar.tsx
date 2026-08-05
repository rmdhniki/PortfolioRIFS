"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { SmoothLink } from "@/components/smooth-link";
import { navLinks } from "@/lib/site-config";

export function Navbar({
  brand,
  availableForWork,
}: {
  brand: string;
  availableForWork: boolean;
}) {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;

    if (y < 80) {
      setCompact(false);
    } else if (delta > 4) {
      setCompact(true);
      setMobileOpen(false);
    } else if (delta < -4) {
      setCompact(false);
    }

    lastY.current = y;
  });

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4 md:top-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="flex items-center overflow-hidden rounded-full border border-espresso/10 bg-espresso text-cream shadow-lg shadow-espresso/20"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {compact ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-caramel/70" />
                <span className="relative inline-flex size-2 rounded-full bg-caramel" />
              </span>
              <span className="whitespace-nowrap text-xs font-medium tracking-wide text-cream/90">
                {availableForWork ? "Available for work" : brand}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1 py-1.5 pr-2 pl-1.5"
            >
              <SmoothLink
                href="/#home"
                className="flex size-9 items-center justify-center rounded-full bg-cream font-display text-sm font-semibold text-espresso"
              >
                RS
              </SmoothLink>

              <nav className="hidden items-center gap-1 px-2 md:flex">
                {navLinks.map((link) => (
                  <SmoothLink
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-3 py-2 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-cream"
                  >
                    {link.label}
                  </SmoothLink>
                ))}
              </nav>

              <SmoothLink
                href="/#contact"
                className="ml-1 hidden rounded-full bg-cream px-4 py-2 text-sm font-medium text-espresso transition-transform hover:scale-105 md:inline-flex"
              >
                Contact
              </SmoothLink>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="ml-1 inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-cream/10 md:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && !compact && (
          <motion.nav
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 flex w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border border-espresso/10 bg-espresso text-cream shadow-lg shadow-espresso/20 md:hidden"
          >
            {navLinks.map((link) => (
              <SmoothLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-cream/10 px-5 py-3 text-sm last:border-none"
              >
                {link.label}
              </SmoothLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
