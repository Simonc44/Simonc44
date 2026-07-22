"use client";

import { useId, type ReactNode } from "react";

interface LiquidGlassButtonProps {
  /** The button label (e.g. "Voir mes projets") */
  children: ReactNode;
  /** href for the anchor tag */
  href?: string;
  /** onClick handler */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

/** Check if a URL is external (starts with http) */
const isExternal = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://");

/**
 * LiquidGlassButton — Pure CSS/SVG refractive glass button.
 *
 * ── Layer stack (bottom → top) ──────────────────────────
 *  1. Star field      → Dots/grid background (distorted by SVG filter)
 *  2. SVG filter      → feTurbulence + feDisplacementMap (scale 50)
 *                       Creates organic wave/lens distortion on stars
 *  3. Glass body      → backdrop-blur(15px) + translucent bg
 *  4. Gradient border → 1px pill border (white top → transparent)
 *  5. Volume shadows  → inset box-shadows (white top, dark bottom)
 *  6. Chromatic fringe→ CSS filter: drop-shadow() cyan/magenta
 *  7. Highlight arc   → Subtle white glow arc at top
 *  8. Text            → White font-medium with text-shadow glow
 *
 * No WebGL, no Three.js — pure CSS + SVG filter magic.
 */
export function LiquidGlassButton({
  children,
  href,
  onClick,
  className = "",
}: LiquidGlassButtonProps) {
  const uid = useId();
  const filterId = `liquid-${uid.replace(/[^a-zA-Z0-9]/g, "")}`;
  const Tag = href ? "a" : "button";
  const linkProps =
    href && isExternal(href)
      ? { href, target: "_blank" as const, rel: "noopener noreferrer" as const }
      : href
        ? { href }
        : { onClick };

  return (
    <div className="relative inline-flex">
      {/* SVG filter — feTurbulence + feDisplacementMap for organic lens distortion */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            {/* Fractal noise — the 'liquid' texture */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005"
              numOctaves="3"
              seed="3"
              result="noise"
            />
            {/* Amplify noise for stronger displacement */}
            <feColorMatrix
              type="matrix"
              values="1.5 0 0 0 0  0 1.5 0 0 0  0 0 1.5 0 0  0 0 0 1 0"
              in="noise"
              result="ampedNoise"
            />
            {/* Displacement mapping — warps content beneath */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="ampedNoise"
              scale="50"
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Layer 1: Distorted star field (bottom) ──
           Visible everywhere — SVG filter warps stars
           across the entire surface.                      */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        {/* Bottom layer: distorted stars */}
        <div
          className="star-field absolute inset-0"
          style={{ filter: `url(#${filterId})` }}
        />
        {/* Top layer: clear stars masked at edges
           Opaque center covers the distortion, transparent
           edges reveal the distorted stars underneath.
           → Distortion increases toward the perimeter.   */}
        <div
          className="star-field absolute inset-0"
          style={{
            maskImage: "radial-gradient(70% 70% at 50% 50%, black 35%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black 35%, transparent 72%)",
          }}
        />
      </div>

      {/* ── Layer 2-8: Glass button ── */}
      <Tag
        {...linkProps}
        className={`
          glass-button glass-button-border
          group relative z-10 inline-flex items-center justify-center
          rounded-full px-10 py-4
          font-display text-base font-medium text-white
          select-none
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:scale-[1.02] active:scale-[0.97]
          ${className}
        `}
      >
        {/* Top highlight arc */}
        <span
          className="pointer-events-none absolute left-[15%] right-[15%] top-0 z-10 h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Text */}
        <span className="relative z-20 text-glow">{children}</span>
      </Tag>
    </div>
  );
}
