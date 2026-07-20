import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoBlurTextProps {
  /** Ordered list of phrases to cycle through. The first one is shown
   *  immediately on mount. Use at least 2 entries. */
  words: string[];
  /** Milliseconds each word stays visible. Default 2800. */
  intervalMs?: number;
  /** Optional className to merge onto the outer wrapper for layout */
  className?: string;
  /**
   * `wordClassName` is applied to the animated span — useful to inherit the
   * parent's font / size without two sources of truth.
   */
  wordClassName?: string;
  /**
   * Override the description announced by screen readers. Defaults to a
   * comma-joined listing of `words`.
   */
  ariaLabel?: string;
}

/**
 * Cycles through a small list of words in-place, cross-fading each entry
 * with an 8px→0px `filter: blur()` + y-shift. Inspired by Framer's
 * "LogoBlur" template — used to drive the Hero's high-impact title.
 *
 * Accessibility: cycles visually but a screen reader sees a single static
 * phrase. The animated span is `aria-hidden` and the wrapper carries an
 * explicit `aria-label` listing every word.
 *
 * Performance: pauses cycling under `prefers-reduced-motion: reduce`.
 */
const LogoBlurText = ({
  words,
  intervalMs = 2800,
  className,
  wordClassName,
  ariaLabel,
}: LogoBlurTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || words.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, words.length, intervalMs]);

  // Fall-back for reduced-motion: render the first word, no animation.
  if (shouldReduceMotion || words.length === 0) {
    return (
      <span
        className={cn("inline-block", className)}
        aria-label={ariaLabel ?? words.join(", ")}
      >
        <span className={wordClassName}>{words[0]}</span>
      </span>
    );
  }

  const fallbackWord = words[0] ?? "";
  const safeIndex = index % Math.max(words.length, 1);

  return (
    <span
      className={cn(
        "relative inline-block align-baseline min-w-[1ch]",
        className
      )}
      aria-label={ariaLabel ?? words.join(", ")}
    >
      {/* Width-keeping invisible copy of the longest word — prevents
          layout shift as the cycling span's visual width changes. */}
      <span
        aria-hidden="true"
        className={cn("invisible inline-block", wordClassName)}
      >
        {words.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`logo-blur-${safeIndex}`}
          initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          aria-hidden="true"
          className={cn("absolute left-0 top-0 inline-block", wordClassName)}
        >
          {words[safeIndex] ?? fallbackWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default LogoBlurText;
