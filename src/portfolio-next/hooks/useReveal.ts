"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion, type MarginType } from "framer-motion";

interface RevealOptions {
  /** Trigger only once (defaults true) */
  once?: boolean;
  /** Margin passed to useInView (any valid CSS margin string) */
  margin?: MarginType;
  /** Wait this many ms before flipping to "in view" */
  delayMs?: number;
}

/**
 * Reusable scroll-reveal helper. Returns a ref to attach to a wrapping
 * element and an `isInView` boolean suitable for `animate={{ ... }}`.
 *
 * Honors prefers-reduced-motion: returns the final state immediately
 * so animations are skipped without leaving the user staring at hidden
 * content.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
): { ref: RefObject<T>; isInView: boolean } {
  const { once = true, margin = "-80px", delayMs = 0 } = options;
  const ref = useRef<T>(null);
  const isInViewRaw = useInView(ref, { once, margin });
  const shouldReduceMotion = useReducedMotion();
  const [delayedInView, setDelayedInView] = useState(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDelayedInView(true);
      return;
    }
    if (!isInViewRaw || delayMs === 0) {
      setDelayedInView(isInViewRaw);
      return;
    }
    const id = setTimeout(() => setDelayedInView(true), delayMs);
    return () => clearTimeout(id);
  }, [isInViewRaw, delayMs, shouldReduceMotion]);

  return { ref: ref as RefObject<T>, isInView: delayedInView };
}
