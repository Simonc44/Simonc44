"use client";

import { Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useIntl } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";
import { TitleReveal } from "@/components/TitleReveal";
import { InteractiveGradientBg } from "@/components/InteractiveGradientBg";

/**
 * Hero3D is dynamically imported with SSR disabled:
 * - R3F Canvas requires `window` (WebGL context).
 * - ScrollControls uses DOM event listeners.
 * - Hydration would mismatch if rendered server-side.
 */
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero section — fullscreen identity.
 *
 * Layout: 100svh dark cinematic container.
 * Layers (back to front):
 *   -3 : radial halo gradients (CSS)
 *   -2 : animated gradient (InteractiveGradientBg, CSS vars)
 *   -1 : R3F 3D scene (scroll-driven, pointer-events-none)
 *    0 : text content + CTAs
 *   +1 : scroll cue
 */
export function Hero() {
  const { t } = useIntl();
  const reduce = useReducedMotion();
  const { ref } = useReveal<HTMLElement>({ margin: "-10%" });

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Hero — Identity"
      className="relative isolate flex h-[100svh] min-h-[680px] w-full items-center justify-center overflow-hidden"
      style={{ background: "#030303" }}
    >
      {/* Interactive mouse-tracking gradient (CSS custom properties, no re-render) */}
      <InteractiveGradientBg />

      {/* Static radial halos — deep violet/rose atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 15%, hsl(263 75% 68% / 0.22) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 80% 85%, hsl(340 80% 62% / 0.16) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3D Scene — pointer-events-none, behind content */}
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t["hero.eyebrow"]}
          </motion.div>

          {/* Main title — char-by-char reveal */}
          <TitleReveal
            text={t["hero.title"]}
            className="text-balance text-[clamp(2.8rem,7.5vw,7rem)] font-display font-semibold leading-[1.01] tracking-[-0.04em] text-foreground"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.9,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mx-auto mt-7 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {t["hero.subtitle"]}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 1.15,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-primary px-6 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:brightness-110 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t["hero.cta"]}
              {/* Shimmer */}
              <span
                className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden="true"
              />
            </a>

            <code className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 font-mono text-xs text-muted-foreground backdrop-blur-md sm:inline-flex">
              <span className="text-primary">$</span>
              {t["hero.ctaCommand"].replace("$ ", "")}
            </code>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label={t["hero.scroll"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          {t["hero.scroll"]}
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
      </motion.a>

      {/* Section counter — fixed, bottom-right, desktop only */}
      <SectionCounter />
    </section>
  );
}

function SectionCounter() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 right-6 z-10 hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 lg:block"
    >
      {!reduce && <span>§ 01 — Hero</span>}
    </div>
  );
}
