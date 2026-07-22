"use client";

import { useEffect } from "react";
import { useSpring, useMotionValue } from "framer-motion";

/**
 * InteractiveGradient — Elite Studio Chrome/Silver glowing mesh.
 * 
 * Uses framer-motion springs for fluid inertia (custom cubic-bezier feel).
 * Renders a subtle radial gradient that follows the mouse smoothly over an Obsidian background.
 */
export function InteractiveGradient() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Elite Studio physical inertia
  const springConfig = { damping: 40, stiffness: 150, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Start at center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    
    // Direct DOM mutation for 60fps performance without React re-renders
    const unsubscribeX = smoothX.on("change", (latest) => {
      document.documentElement.style.setProperty("--gx", `${latest}px`);
    });
    const unsubscribeY = smoothY.on("change", (latest) => {
      document.documentElement.style.setProperty("--gy", `${latest}px`);
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, smoothX, smoothY]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Background radial gradient interacting with --gx and --gy */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle 600px at var(--gx) var(--gy),
              rgba(255, 255, 255, 0.04),
              transparent 80%
            ),
            radial-gradient(
              circle 1000px at 50% 0%,
              rgba(255, 255, 255, 0.02),
              transparent 70%
            )
          `,
        }}
      />
    </div>
  );
}
