import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import InfiniteMarquee from "@/components/primitives/InfiniteMarquee";
import { cn } from "@/lib/utils";

interface WavyMarqueeProps {
  children: React.ReactNode;
  /** Seconds per full horizontal pass. Higher = slower. */
  speed?: number;
  /** Scroll multiplier for the sinusoid. Even integers read as one
   *  full up-down cycle per viewport-scroll. */
  freq?: number;
  /** Peak vertical travel in px. ± amplitude around the row's baseline. */
  amplitude?: number;
  /** Phase offset in radians — flips the second row to counter-phase. */
  phase?: number;
  /** Reverse the horizontal scroll direction */
  reverse?: boolean;
  gap?: number;
  className?: string;
}

/**
 * Wraps `InfiniteMarquee` and adds a sinusoidal Y-translate driven by
 * the component's own scroll progress — gives the row a wavy look as
 * the user scrolls past it. Conceptually identical to the public
 * "WavyTicker" Framer template.
 *
 * The wrapper attachs `ref={sectionRef}` to the host so `useScroll`
 * can derive a 0→1 progress across the section's visible range.
 *
 * Disabled under `prefers-reduced-motion` (the InfiniteMarquee itself
 * switches to a static row).
 */
const WavyMarquee = ({
  children,
  speed = 32,
  freq = Math.PI * 2 * 2, // 2 full sine cycles per viewport
  amplitude = 18,
  phase = 0,
  reverse = false,
  gap = 20,
  className,
}: WavyMarqueeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map progress → sine. The function-form of `useTransform` evaluates
  // the lambda at *every* progress tick — unlike the `[input],[output]`
  // form which only LIN-interpolates between two endpoint values (which
  // would clamp the wave to 0 when both endpoints coincide).
  const y = useTransform(
    scrollYProgress,
    (v) => Math.sin(v * freq + phase) * amplitude
  );

  if (shouldReduceMotion) {
    return (
      <div ref={sectionRef} className={cn(className)}>
        <InfiniteMarquee speed={speed} reverse={reverse} gap={gap}>
          {children}
        </InfiniteMarquee>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={cn(className)}>
      <motion.div style={{ y }}>
        <InfiniteMarquee speed={speed} reverse={reverse} gap={gap}>
          {children}
        </InfiniteMarquee>
      </motion.div>
    </div>
  );
};

export default WavyMarquee;
