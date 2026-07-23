/**
 * motion.ts — Centralized Framer Motion variant library.
 *
 * Single source of truth for all animation configs across the portfolio.
 * Import what you need — tree-shakeable, typed, and reduced-motion-aware.
 *
 * Usage:
 *   import { fadeUp, staggerContainer, hoverCard } from "@/lib/motion";
 *   <motion.div variants={fadeUp} initial="hidden" whileInView="visible" />
 */

import type { Variants, Transition } from "framer-motion";

// ─── Spring presets ────────────────────────────────────────────────────────

/** Snappy spring — great for interactive elements (hover, tap). */
export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.6,
};

/** Smooth spring — great for reveal animations and entrances. */
export const SPRING_SMOOTH: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

/** Gentle spring — for large layout shifts (sections, modals). */
export const SPRING_GENTLE: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 1,
};

/** Ease curve equivalent to Apple/Framer's easeOut expo */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// ─── Reveal variants ───────────────────────────────────────────────────────

/**
 * fadeUp — standard scroll-reveal: opacity 0→1 + y 20→0.
 * Pair with `viewport={{ once: true, margin: "-50px" }}`.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SMOOTH,
  },
};

/**
 * fadeUpLarge — same but 40px for hero-scale elements.
 */
export const fadeUpLarge: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SMOOTH,
  },
};

/**
 * fadeIn — pure opacity, no movement. For backgrounds, overlays.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * slideInLeft — slides in from left. For list items, nav links.
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_SMOOTH,
  },
};

// ─── Container variants (stagger orchestration) ────────────────────────────

/**
 * staggerContainer — parent wrapper that staggers children by 0.1s.
 * Children must use a variant with "hidden" / "visible" keys.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/**
 * staggerContainerFast — 0.07s stagger for dense grids.
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * staggerContainerSlow — 0.15s stagger for 2-3 column layouts.
 */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ─── Interactive variants (hover / tap) ────────────────────────────────────

/**
 * hoverCard — subtle lift on hover, slight squish on tap.
 * Apply as whileHover / whileTap props directly (not as variants).
 */
export const hoverCard = {
  whileHover: { y: -4, scale: 1.015 },
  whileTap: { scale: 0.97 },
  transition: SPRING_SNAPPY,
} as const;

/**
 * hoverButton — tighter scale for CTA buttons.
 */
export const hoverButton = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.96 },
  transition: SPRING_SNAPPY,
} as const;

/**
 * hoverGlow — no movement, just scale + brightness (for icon buttons).
 */
export const hoverGlow = {
  whileHover: { scale: 1.12 },
  whileTap: { scale: 0.92 },
  transition: SPRING_SNAPPY,
} as const;

// ─── Page / section orchestration ─────────────────────────────────────────

/**
 * sectionReveal — used on section wrappers.
 * Pairs with `whileInView` + `viewport={{ once: true, margin: "-80px" }}`.
 */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...SPRING_GENTLE,
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

/**
 * cardReveal — used on individual cards within a stagger container.
 */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SMOOTH,
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Menu / modal animations ───────────────────────────────────────────────

/**
 * mobileMenu — slide down + fade for mobile nav overlay.
 */
export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: SPRING_SNAPPY,
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.96,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/**
 * mobileMenuItem — staggered nav link entrance inside the mobile menu.
 */
export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_SMOOTH,
  },
  exit: { opacity: 0, x: -8, transition: { duration: 0.1 } },
};

// ─── Utility helpers ───────────────────────────────────────────────────────

/**
 * withDelay — wraps any Variants with a custom delay on the visible transition.
 *
 * @example
 * animate={isInView ? "visible" : "hidden"}
 * variants={withDelay(fadeUp, 0.3)}
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    visible: {
      ...(variants.visible as object),
      transition: {
        ...((variants.visible as { transition?: object })?.transition ?? {}),
        delay,
      },
    },
  };
}

/**
 * reducedMotionVariants — returns instant variants (no animation) for
 * accessibility. Use when `useReducedMotion()` returns true.
 *
 * @example
 * const reduce = useReducedMotion();
 * const vars = reduce ? reducedMotionVariants : fadeUp;
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1 },
};
