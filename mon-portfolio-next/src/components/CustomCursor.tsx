"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * CustomCursor — Premium ring-follower cursor.
 *
 * Renders a small dot + a larger ring that follows the mouse with spring
 * physics. Auto-hides on touch devices and when the pointer leaves the
 * window. The ring scales up and border brightens over clickable elements.
 */
export function CustomCursor() {
  const isTouchDevice = useRef(false);
  const isHovering = useRef(false); // track for scale changes (works with motion values)

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for smooth ring following
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const ringScale = useMotionValue(1);
  const ringBorderOpacity = useMotionValue(0.2);

  // Derived motion values for border color and box shadow
  const borderColorVal = useTransform(ringBorderOpacity, (v) => `rgba(255,255,255,${v})`);
  const boxShadowVal = useTransform(ringBorderOpacity, (v) => `0 0 20px rgba(255,255,255,${v * 0.15})`);

  const isHoveringInteractive = useCallback((el: Element | null) => {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (el.getAttribute("role") === "button") return true;
    if (el.closest("a, button, [role='button'], input, textarea, select")) return true;
    return false;
  }, []);

  useEffect(() => {
    // Detect touch device once
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over interactive element
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = isHoveringInteractive(target);

      if (interactive && !isHovering.current) {
        isHovering.current = true;
        ringScale.set(1.8);
        ringBorderOpacity.set(0.6);
      } else if (!interactive && isHovering.current) {
        isHovering.current = false;
        ringScale.set(1);
        ringBorderOpacity.set(0.2);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY, ringScale, ringBorderOpacity, isHoveringInteractive]);

  if (typeof document === "undefined") return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[99999] hidden lg:block"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ring */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: ringX,
          y: ringY,
          scale: ringScale,
        }}
      >
        <motion.div
          className="h-8 w-8 rounded-full border"
          style={{
            borderColor: borderColorVal,
            boxShadow: boxShadowVal,
          }}
        />
      </motion.div>

      {/* Dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          x: mouseX,
          y: mouseY,
          boxShadow: "0 0 12px rgba(255,255,255,0.5)",
        }}
      />
    </motion.div>
  );
}
