"use client";

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default: 8) */
  tiltDegree?: number;
  /** Perspective CSS value (default: 800) */
  perspective?: number;
  /** Scale on hover (default: 1.02) */
  scale?: number;
  /** Whether the glare effect is enabled (default: true) */
  glare?: boolean;
}

/**
 * TiltCard — 3D perspective tilt on hover.
 *
 * Tracks mouse position within the card and applies a CSS transform
 * using springs for smooth inertia. Includes an optional glare effect
 * that follows the cursor via direct CSS custom property mutation.
 */
export function TiltCard({
  children,
  className = "",
  tiltDegree = 8,
  perspective = 800,
  scale = 1.02,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const scaleVal = useMotionValue(1);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const smoothScale = useSpring(scaleVal, { damping: 15, stiffness: 250 });

  // Sync motion values to DOM custom properties for glare (avoids re-render)
  useEffect(() => {
    if (!glare) return;
    const el = glareRef.current;
    if (!el) return;

    const unsubX = glareX.on("change", (v) => {
      el.style.setProperty("--glare-x", `${v}%`);
    });
    const unsubY = glareY.on("change", (v) => {
      el.style.setProperty("--glare-y", `${v}%`);
    });
    const unsubO = glareOpacity.on("change", (v) => {
      el.style.opacity = String(v);
    });

    return () => {
      unsubX();
      unsubY();
      unsubO();
    };
  }, [glare, glareX, glareY, glareOpacity]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Invert Y for natural tilt
    rotateY.set(deltaX * tiltDegree);
    rotateX.set(-deltaY * tiltDegree);

    // Glare follows cursor
    if (glare) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      glareX.set(pctX);
      glareY.set(pctY);
      glareOpacity.set(1);
    }

    scaleVal.set(scale);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scaleVal.set(1);
    if (glare) glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative ${className}`}
      style={
        {
          perspective,
          transformStyle: "preserve-3d",
        } as CSSProperties
      }
    >
      <motion.div
        className="relative h-full w-full"
        style={
          {
            rotateX: smoothRotateX,
            rotateY: smoothRotateY,
            scale: smoothScale,
            transformStyle: "preserve-3d",
          } as any
        }

      >
        {children}

        {/* Glare overlay — DOM is always rendered so ref works */}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              opacity: 0,
              background:
                "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.15), transparent 60%)",
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
