"use client";

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
 * Letter-by-letter reveal. Renders the entire string as inline-block
 * spans that fade + slide up. A blinking cursor is appended when motion
 * is allowed.
 *
 * Under prefers-reduced-motion, the title renders as plain text with
 * the cursor hidden — no stagger, no animation.
 */
export function TitleReveal({
  text,
  className = "",
  stagger = 0.03,
  duration = 0.7,
}: TitleRevealProps) {
  const reduce = useReducedMotion();

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: 0.05 },
    },
  };
  const child = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { ease: [0.2, 0.65, 0.3, 0.9], duration },
    },
  };

  if (reduce) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={child}
          className="inline-block whitespace-pre"
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
