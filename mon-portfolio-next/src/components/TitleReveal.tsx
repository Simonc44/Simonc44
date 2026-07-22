"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TitleRevealProps {
  /** The headline. Space chars are preserved with a non-breaking span. */
  text: string;
  /** Optional className applied to the wrapping h1 */
  className?: string;
  /** Per-character stagger in seconds */
  stagger?: number;
  /** Per-character duration in seconds */
  duration?: number;
}

/**
 * Letter-by-letter 3D reveal. Renders the entire string with fluid perspective,
 * blur-to-focus transition, and blinking terminal cursor.
 */
export function TitleReveal({
  text,
  className = "",
  stagger = 0.025,
  duration = 0.65,
}: TitleRevealProps) {
  const reduce = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (reduce || !isMounted) {
    return <h1 className={className}>{text}</h1>;
  }

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: 0.1 },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 28,
      rotateX: -45,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        duration,
      },

    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className={`${className} [perspective:1000px]`}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={child}
          className="inline-block whitespace-pre transform-gpu"
          aria-hidden={char === " " ? "true" : undefined}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}

      <motion.span
        key="cursor"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: text.length * stagger + duration, duration: 0.2 }}
        className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] bg-primary align-middle cursor-blink"
      />
    </motion.h1>
  );
}

