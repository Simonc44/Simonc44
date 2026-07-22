"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — Thin animated progress bar fixed at the top of the page.
 * Uses framer-motion's useScroll + useSpring for smooth inertia.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.9) 100%)",
        boxShadow: "0 0 12px rgba(255,255,255,0.15)",
      }}
      aria-hidden="true"
    />
  );
}
