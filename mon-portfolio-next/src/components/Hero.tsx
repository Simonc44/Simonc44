"use client";

import { Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useIntl } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";

import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";

/**
 * SSR false pour la 3D
 */
const SpaceScene = dynamic(() => import("@/components/3d/SpaceScene").then((m) => m.SpaceScene), {
  ssr: false,
  loading: () => null,
});

/**
 * ShaderGradient 3D background — chargé côté client uniquement.
 */
const ShaderBg = dynamic(
  () => import("@/components/3d/ShaderBg").then((m) => m.ShaderBg),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const { t } = useIntl();
  const reduce = useReducedMotion();
  const { ref } = useReveal<HTMLElement>({ margin: "-10%" });

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Hero — Identity"
      className="relative isolate flex h-[100svh] min-h-[680px] w-full items-center justify-center overflow-hidden bg-grid-subtle"
    >
      {/* ShaderGradient 3D background — bottom layer */}
      <Suspense fallback={null}>
        <ShaderBg />
      </Suspense>

      {/* Radial overlay to soften grid edges */}
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-80" aria-hidden="true" />


      {/* 3D Particle Scene */}
      <Suspense fallback={null}>
        <SpaceScene />
      </Suspense>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">

          {/* Main title */}
          <div className="relative mx-auto mb-2 max-w-5xl">
            {/* Subtle backdrop to separate title from 3D particles */}
            <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)]" aria-hidden="true" />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance text-[clamp(2.8rem,7.5vw,7rem)] font-bold leading-[1.2] tracking-[-0.04em] pb-4"
            >
              <span className="text-glow-foreground">Hello, world! I&apos;m </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent font-display italic">
                Simon
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 0.9,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-7 max-w-2xl text-base text-muted-foreground/90 sm:text-lg font-light leading-relaxed"
          >
            {t["hero.subtitle"]}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : 1.15,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <LiquidGlassButton href="#projects">
                {t["hero.cta"]}
              </LiquidGlassButton>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
