"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

import { useIntl, type Dictionary } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";
import type { GithubProfile, GithubRepo } from "@/types/github";

interface AboutProps {
  profile: GithubProfile | null;
  repos: GithubRepo[] | null;
}

/** Animated number counter — counts up from 0 to `value` when in view. */
function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.2, 0.65, 0.3, 0.9],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

const STEPS = [
  {
    idKey: "01",
    titleKey: "about.process.ideate.title" as const,
    bodyKey: "about.process.ideate.body" as const,
  },
  {
    idKey: "02",
    titleKey: "about.process.build.title" as const,
    bodyKey: "about.process.build.body" as const,
  },
  {
    idKey: "03",
    titleKey: "about.process.ship.title" as const,
    bodyKey: "about.process.ship.body" as const,
  },
];

/**
 * About — identity section with real GitHub stats animated on enter.
 *
 * Stats card shows: public repos, active languages, total stars — all
 * derived from the `profile` + `repos` props (server-fetched).
 * If the API is unavailable, graceful fallback values are used.
 */
export function About({ profile, repos }: AboutProps) {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  const repoCount = profile?.public_repos ?? 11;

  const totalStars = repos
    ? repos.reduce((acc, r) => acc + r.stargazers_count, 0)
    : 7;
  const langCount = repos
    ? new Set(repos.map((r) => r.language).filter(Boolean)).size
    : 5;

  const STATS: { value: number; labelKey: keyof Dictionary; suffix: string }[] = [
    { value: repoCount, labelKey: "about.stats.repos", suffix: "" },
    { value: langCount, labelKey: "about.stats.langs", suffix: "" },
    { value: totalStars, labelKey: "about.stats.stars", suffix: "" },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      ref={ref}
      className="relative pb-0 pt-0"
    >
      <div className="container mx-auto max-w-6xl px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-12 max-w-3xl"
        >
          <h2
            id="about-title"
            className="text-balance text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl"
          >
            <span className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
              {t["about.title"]}
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {t["about.subtitle"]}
          </motion.p>
        </motion.div>



        {/* Process steps — Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.idKey}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.12,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-md p-6 transition-all duration-300 hover:border-white/20"
            >
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              {/* Step number */}
              <span className="bg-gradient-to-b from-white/30 to-white/5 bg-clip-text text-5xl font-mono font-bold text-transparent transition-all duration-500 group-hover:from-emerald-400/50 group-hover:to-teal-500/10">
                {step.idKey}
              </span>

              {/* Title */}
              <h3 className="mt-4 mb-2 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-emerald-400">
                {t[step.titleKey]}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-neutral-400">
                {t[step.bodyKey]}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mes chiffres — Gradient Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-amber-300"
        >
          <div className="px-6 py-10 md:px-10 md:py-12">
            <h3 className="mb-6 text-center font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
              {t["about.statsTitle"]}
            </h3>
            <div className="grid grid-cols-3 divide-x divide-neutral-900/20">
              {STATS.map(({ value, labelKey, suffix }, i) => (
                <div
                  key={labelKey}
                  className="flex flex-col items-center gap-1.5 px-4 py-4 text-center md:px-6"
                >
                  <span className="text-4xl font-display font-bold text-neutral-900 md:text-5xl">
                    {isInView ? (
                      <AnimatedCounter
                        value={value}
                        suffix={suffix}
                        duration={1.2 + i * 0.15}
                      />
                    ) : (
                      <span>0{suffix}</span>
                    )}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-800/80">
                    {t[labelKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

