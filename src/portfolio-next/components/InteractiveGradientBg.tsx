"use client";

import { useCallback, useEffect } from "react";

/**
 * InteractiveGradientBg — zero-canvas mouse-reactive background.
 *
 * Updates CSS custom properties `--gx` and `--gy` on
 * `document.documentElement` on every `pointermove`. The gradient
 * itself lives in `globals.css` on the `<body>` via CSS `background-image`,
 * so there's absolutely no React re-render — just a direct DOM mutation.
 * 60fps at virtually zero CPU cost.
 *
 * Mount once at the root layout level. SSR-safe: all DOM access is
 * inside `useEffect`.
 */
export function InteractiveGradientBg() {
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const xPct = ((e.clientX / window.innerWidth) * 100).toFixed(2);
    const yPct = ((e.clientY / window.innerHeight) * 100).toFixed(2);
    document.documentElement.style.setProperty("--gx", `${xPct}%`);
    document.documentElement.style.setProperty("--gy", `${yPct}%`);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  // Renders nothing — purely a side-effect component.
  return null;
}
