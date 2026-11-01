"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.75 origin-left bg-linear-to-r from-[#30BFBF] to-[#8FEFEF] shadow-[0_0_10px_rgba(48,191,191,0.6)]"
    />
  );
}
