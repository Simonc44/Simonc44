"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  /** Optional variant: "orb" (default), "line", or "dots" */
  variant?: "orb" | "line" | "dots";
}

/**
 * SectionDivider — Decorative element between sections with a subtle
 * floating glowing orb, shimmering line, or animated dots.
 */
export function SectionDivider({ variant = "orb" }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  if (variant === "line") {
    return (
      <div ref={ref} className="relative flex items-center justify-center py-8" aria-hidden="true">
        <motion.div
          style={{ opacity, scaleX: scale }}
          className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div ref={ref} className="relative flex items-center justify-center py-8" aria-hidden="true">
        <motion.div style={{ opacity }} className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-1.5 w-1.5 rounded-full bg-white/20"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // orb variant (default)
  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center py-12 md:py-16"
      aria-hidden="true"
    >
      {/* Connecting lines */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Floating orb */}
      <motion.div
        style={{ opacity, scale }}
        className="relative"
      >
        <motion.div
          className="h-3 w-3 rounded-full bg-white/30"
          animate={{
            boxShadow: [
              "0 0 10px rgba(255,255,255,0.1)",
              "0 0 25px rgba(255,255,255,0.25)",
              "0 0 10px rgba(255,255,255,0.1)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-3 rounded-full border border-white/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
