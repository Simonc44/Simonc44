import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface LiveCounterProps {
  /** Final value to animate to */
  value: number;
  /** Suffix shown after the number, e.g. "+" */
  suffix?: string;
  /** Number of decimals to show */
  decimals?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Optional small label below the number */
  label?: string;
  /** Render a "/yr" style denominator beside the number */
  unit?: string;
  className?: string;
}

/**
 * Counting tick-up animation used to surface meaningful metrics
 * (commit count, products shipped, years building…). Honors
 * prefers-reduced-motion by snapping directly to the final value.
 */
const LiveCounter = ({
  value,
  suffix = "",
  decimals = 0,
  duration = 1400,
  label,
  unit,
  className,
}: LiveCounterProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    startRef.current = null;
    let raf = 0;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, shouldReduceMotion]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div className={className}>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl md:text-6xl font-display font-semibold tracking-tight text-gradient">
          {formatted}
          {suffix}
        </span>
        {unit && (
          <span className="text-base font-mono text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {label && (
        <p className="mt-1 text-sm text-muted-foreground font-mono uppercase tracking-wider">
          {label}
        </p>
      )}
    </div>
  );
};

export default LiveCounter;
