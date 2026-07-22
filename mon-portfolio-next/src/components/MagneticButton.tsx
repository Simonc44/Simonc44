"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * MagneticButton — A wrapper that moves its children toward the cursor
 * within a bounding radius, creating a magnetic pull effect.
 *
 * The motion.div applies translateX/Y transforms via springs for smooth
 * inertia. Children pass through unchanged — no extra <button>/<a> wrapper.
 * Falls back gracefully on touch devices (no magnetic effect).
 */
export function MagneticButton({
  children,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Magnetic radius
    const maxDist = 120;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist > maxDist) {
      x.set(0);
      y.set(0);
      return;
    }

    const strength = 0.3;
    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        x: springX,
        y: springY,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
