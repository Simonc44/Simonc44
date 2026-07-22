import { forwardRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import { useDeviceProfile } from "@/hooks/useDevicePerformance";
import { cn } from "@/lib/utils";

interface GlowCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onMouseMove" | "onMouseEnter" | "onMouseLeave"
  > {
  /**
   * Width of the painted border ring in pixels. The trick uses CSS
   * `padding: ringPx` on the glow overlay so the mask-composite keeps
   * exactly this much of the radial-gradient visible all around the
   * edge. Default 2px — visible without dominating the silhouette.
   */
  ringPx?: number;
  /**
   * Radius (in px) of the glowing radial gradient. Larger = softer / wider
   * halation. Default 320px.
   */
  radius?: number;
  /**
   * Glow color stop opacity (0..1). The gradient itself uses CSS variable
   * `--primary` (violet). Default 0.65 — bright enough to read on hover,
   * dim enough not to wash out the card.
   */
  strength?: number;
}

/**
 * `GlowCard` — a wrapper that paints a primary-coloured glow on the
 * outer border ring of its child, anchored to the cursor's local
 * position via framer-motion `useMotionValue` + `useMotionTemplate`.
 *
 * Implementation notes:
 *  - The glow layer is positioned absolute under `inset-0`, padded by
 *    `ringPx`, and masked with the `.glow-border-tracker` utility class
 *    so only the outer ring is painted (no light leaks into the card
 *    interior).
 *  - MotionValue writes are RAF-batched by framer-motion internally, so
 *    mousemove handlers do NOT need a manual rAF throttle.
 *  - Touch devices get NO glow tracking (no cursor) but the card still
 *    receives hover events on tap; the equestrian finger position will
 *    produce a brief flash which fades on `mouseleave`. Acceptable.
 *  - Reduced-motion: full glow is disabled, replaced by a tiny static
 *    border highlight on `:hover` (handled in CSS, not here).
 *  - Low-end devices (mobile / small RAM / weak GPU): glow tracking is
 *    skipped to keep the GPU free for the WebGL canvas + other FX.
 *
 * The wrapped child should still receive its own hover / motion
 * animations (e.g. `<motion.article layout …>` from `AnimatePresence`)
 * — `GlowCard` is purely presentational.
 */
const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  (
    { className, children, ringPx = 2, radius = 320, strength = 0.65, ...rest },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const profile = useDeviceProfile();
    const [hovering, setHovering] = useState(false);

    // Mouse local coords. Start off-grid so the radial-gradient won't
    // accidentally spike on mount.
    const mouseX = useMotionValue(-9999);
    const mouseY = useMotionValue(-9999);

    // Feature gate the glow tracking:
    //  - reduced-motion → OFF (no animation, no tracking)
    //  - touch / coarse pointer → OFF (no useful cursor)
    //  - very-low-end devices → OFF (GPU budget guard)
    const glowEnabled =
      !shouldReduceMotion &&
      profile.ready &&
      !profile.isTouch &&
      !profile.isLowEnd;

    const background = useMotionTemplate`
      radial-gradient(
        ${radius}px circle at ${mouseX}px ${mouseY}px,
        hsl(var(--primary) / ${strength}) 0%,
        transparent 80%
      )
    `;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!glowEnabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => {
      if (!glowEnabled) return;
      setHovering(true);
    };

    const handleMouseLeave = () => {
      setHovering(false);
      // Park the gradient off-grid so the unmount fade hides every trace.
      mouseX.set(-9999);
      mouseY.set(-9999);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("relative isolate", className)}
        {...rest}
      >
        {/* The glow layer is rendered ONLY while we have a valid cursor
            position. `AnimatePresence` (default `initial={true}`) runs
            the `initial → animate` opacity transition on every mount
            so the radial gradient never flashes in fully opaque on the
            first frame after a hover-enter. `exit` runs the inverse on
            mouseleave so the glow fades symmetrically. */}
        <AnimatePresence>
          {glowEnabled && hovering && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              aria-hidden="true"
              className="glow-border-tracker pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                background,
                padding: `${ringPx}px`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Content sits ABOVE the glow layer (z-10) so the card body
            never gets washed out by the glow even when the mask trick
            fails on an older browser. */}
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    );
  }
);

GlowCard.displayName = "GlowCard";

export default GlowCard;
