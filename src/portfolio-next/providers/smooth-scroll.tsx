"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/**
 * Wraps the app in Lenis' ReactLenis component for buttery-smooth scroll.
 * Passes through unchanged when the user prefers reduced motion.
 *
 * Install: `npm i lenis`
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        // Subtle smoothness — readable, not floaty.
        lerp: 0.09,
        // Smooth on touch devices without blocking scroll gestures.
        syncTouch: true,
        // Don't fight native anchor scrolling for in-page links.
        anchors: { offset: -80 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
