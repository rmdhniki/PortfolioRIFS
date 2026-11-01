"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SmoothLink } from "@/components/smooth-link";

const links = [
  { href: "/#home", label: "Home", id: "home" },
  { href: "/#services", label: "Services", id: "services" },
  { href: "/#about", label: "About", id: "about" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#experience", label: "Experience", id: "experience" },
  { href: "/#certification", label: "Certification", id: "certification" },
  { href: "/#contact", label: "Contact", id: "contact" },
] as const;

/** Scroll distance (px) after which the island collapses into the compact pill. */
const COMPACT_AFTER = 48;
const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } as const;

function useActiveSection() {
  const [active, setActive] = useState<string | null>("home");

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

function Brand() {
  return (
    <SmoothLink
      href="/#home"
      aria-label="RIFS, kembali ke atas"
      className="rounded-full px-3 py-1.5 font-display text-sm font-bold tracking-[0.18em] text-primary [text-shadow:0_0_14px_rgba(48,191,191,0.55)]"
    >
      RIFS
    </SmoothLink>
  );
}

function OpenToWork() {
  return (
    <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-emerald-300">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="hidden min-[380px]:inline">Open to Work</span>
    </span>
  );
}

function Divider() {
  return <span aria-hidden className="h-4 w-px shrink-0 bg-border" />;
}

export function Navbar({ availableForWork = true }: { availableForWork?: boolean }) {
  const active = useActiveSection();
  const scrolled = useScrolled(COMPACT_AFTER);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Desktop: full menu at the top, compact pill once scrolled (expands again on hover/focus).
  const compact = scrolled && !hovered;
  const activeLabel = links.find((link) => link.id === active)?.label;

  // Close the mobile menu on Escape or a click outside the island.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [mobileOpen]);

  const glow = compact || mobileOpen
    ? "border-primary/40 shadow-[0_0_32px_-6px_rgba(48,191,191,0.6),inset_0_0_12px_-6px_rgba(48,191,191,0.35)]"
    : "border-primary/20 shadow-[0_0_24px_-10px_rgba(48,191,191,0.45)]";

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] z-50 flex justify-center px-4 md:top-5"
    >
      <motion.nav
        layout
        transition={spring}
        aria-label="Navigasi utama"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setHovered(false);
        }}
        style={{ borderRadius: mobileOpen ? 24 : 999 }}
        className={`pointer-events-auto flex max-w-full flex-col overflow-hidden border bg-background/75 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ${glow}`}
      >
        <motion.div layout="position" className="flex items-center gap-1 p-1.5">
          <Brand />

          {/* Desktop links: shown at the top of the page or while hovering the island. */}
          <AnimatePresence initial={false} mode="popLayout">
            {!compact && (
              <motion.ul
                key="links"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
                className="hidden items-center gap-0.5 lg:flex"
              >
                {links.map((link) => {
                  const isActive = active === link.id;
                  return (
                    <li key={link.id} className="relative">
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          transition={spring}
                          className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/25"
                        />
                      )}
                      <SmoothLink
                        href={link.href}
                        aria-current={isActive ? "true" : undefined}
                        className={`relative block rounded-full px-3.5 py-1.5 font-sans text-sm font-medium transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </SmoothLink>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>

          {availableForWork && (
            <>
              <Divider />
              <OpenToWork />
            </>
          )}

          {/* Compact desktop: show the active section in blue. */}
          <AnimatePresence initial={false} mode="popLayout">
            {compact && activeLabel && (
              <motion.span
                key={activeLabel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="hidden items-center gap-1 lg:flex"
              >
                <Divider />
                <span className="px-3 py-1.5 font-sans text-sm font-medium text-primary">
                  {activeLabel}
                </span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tablet & mobile: menu toggle. */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="ml-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </motion.div>

        {/* Tablet & mobile menu: the island grows downward. */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.ul
              id="mobile-menu"
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-64 px-1.5 pb-1.5 lg:hidden"
            >
              {links.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <SmoothLink
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 font-sans text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {link.label}
                      {isActive && <span className="size-1.5 rounded-full bg-primary" />}
                    </SmoothLink>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
