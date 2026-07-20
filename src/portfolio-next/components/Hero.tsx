"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Suspense } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";
import { TitleReveal } from "@/components/TitleReveal";
import Hero3D from "@/components/Hero3D";

/**
 * Fullscreen "Identité" Hero.
 *  - 100vh, dark cinematic background glow.
 *  - Centered, massive display headline via `<TitleReveal>`.
 *  - 3D scene (`<Hero3D>`) sits behind the content with `pointer-events-none`.
 *  - CTA + scroll cue below.
 *  - replaceable default model via the `modelUrl` prop.
 */
export function Hero({ modelUrl }: { modelUrl?: string } = {}) {
  const { t } = useIntl();
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      aria-label="Hero — Identity"
      className="relative isolate flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Background gradient halos */}
      <div className="absolute inset-0 -z-10 bg-gradient-hero" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(263 75% 68% / 0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 70% 80%, hsl(340 80% 62% / 0.12) 0%, transparent 55%)",
        }}
      />

      {/* 3D scene */}
      <Suspense fallback={null}>
        <Hero3D modelUrl={modelUrl} />
      </Suspense>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-card/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t["hero.eyebrow"]}
          </motion.div>

          {/* Title */}
          <TitleReveal
            text={t["hero.title"]}
            className="text-balance text-[clamp(2.5rem,7vw,6.5rem)] font-display font-semibold leading-[1.02] tracking-[-0.03em] text-foreground"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.8,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {t["hero.subtitle"]}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 1.05,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 font-mono text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t["hero.cta"]}
            </a>
            <code className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-card/[0.04] px-4 py-3 font-mono text-xs text-muted-foreground backdrop-blur-md sm:inline-flex">
              {t["hero.ctaCommand"]}
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
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          {t["hero.scroll"]}
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
      </motion.a>
      <ScrollCounter />
    </section>
  );
}

/** Tiny "scroll progress" micro-component — optional flair. */
function ScrollCounter() {
  const reduce = useReducedMotion();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-10%" });
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 right-6 z-10 hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 lg:block"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        § {reduce ? "00" : "01"} — Hero
      </motion.span>
    </div>
  );
}
