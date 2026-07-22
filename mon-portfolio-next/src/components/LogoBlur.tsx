"use client";

import { type ReactNode } from "react";

interface LogoBlurProps {
  children: ReactNode;
  className?: string;
  /** If true, applies a tighter, more opaque blur for the navbar brand mark. */
  compact?: boolean;
}

/**
 * LogoBlur — premium frosted-glass container.
 *
 * Uses multi-layer `backdrop-filter` + SVG noise texture overlay to achieve
 * the "smoked glass" aesthetic. All CSS — zero canvas.
 *
 * The inner `::before` pseudo-element isn't available in React, so we layer
 * a sibling `<span>` for the noise grain instead.
 */
export function LogoBlur({ children, className = "", compact = false }: LogoBlurProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        borderRadius: compact ? "2rem" : "1rem",
        padding: compact ? "0.25rem 0.75rem" : "0.5rem 1rem",
        backdropFilter: "blur(24px) saturate(180%) brightness(0.75)",
        WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(0.75)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* SVG noise grain overlay — adds tactile depth to the glass surface */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />
      {children}
    </span>
  );
}
