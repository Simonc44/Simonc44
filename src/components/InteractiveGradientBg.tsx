import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * A fixed full-viewport mesh-gradient background whose blob positions and
 * hues track the page scroll + the cursor. Conceptually equivalent to
 * Framer's "Interactive Animated Gradient" template but built with pure
 * CSS `radial-gradient`s + `useMotionTemplate` so it costs nothing on the
 * GPU and stays iOS-Safari friendly.
 *
 * Performance:
 *  - Pure DOM (`position:fixed`, `pointer-events:none`, `z-index:-1`).
 *  - `useMotionTemplate` reads CSS vars at 60fps without re-rendering.
 *  - Mouse tracking is event-throttled to `requestAnimationFrame`.
 *
 * Layout: `pointer-events:none` so it never blocks scroll / hover
 * detection for the sections drawn above it.
 */
const InteractiveGradientBg = () => {
  const shouldReduceMotion = useReducedMotion();

  // Mouse position normalised to a 0..100 percentage for CSS vars.
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rafRef = useRef<number | null>(null);
  const latest = useRef({ x: 0, y: 0 });

  // Page scroll → morph the global hue & additional blob positions.
  const { scrollYProgress } = useScroll();
  const hue1 = useTransform(scrollYProgress, [0, 1], [263, 305]);
  const hue2 = useTransform(scrollYProgress, [0, 1], [340, 285]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, 18]);

  // Compose the radial-gradient template at runtime.
  const gradient = useMotionTemplate`
    radial-gradient(60rem 40rem at ${mouseX}% ${mouseY}%, hsl(${hue1} 75% 68% / 0.28) 0%, transparent 60%),
    radial-gradient(50rem 36rem at 80% 20%, hsl(${hue2} 80% 62% / 0.22) 0%, transparent 55%),
    radial-gradient(40rem 28rem at 20% 80%, hsl(220 50% 50% / 0.08) 0%, transparent 60%)
  `;

  useEffect(() => {
    if (shouldReduceMotion) return;
    const onMove = (e: MouseEvent) => {
      latest.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(latest.current.x);
        mouseY.set(latest.current.y);
        rafRef.current = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    // Touch devices — keep gradient at default position, no listener.
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion, mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        background: gradient,
        y: shouldReduceMotion ? 0 : driftY,
      }}
      className="fixed inset-0 z-[-1] pointer-events-none will-change-transform"
    />
  );
};

export default InteractiveGradientBg;
