"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Sparkles, Code2, GitBranch, Globe } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
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

/** Derives the dominant language from the repos list. */
function getTopLanguage(repos: GithubRepo[] | null): string {
  if (!repos) return "TypeScript";
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "TypeScript";
}

type Tone = "live" | "primary" | "muted";

const TONE_DOT: Record<Tone, string> = {
  live: "bg-emerald-400",
  primary: "bg-primary",
  muted: "bg-muted-foreground/40",
};

interface CurrentlyItem {
  labelKey: `about.currently.${string}`;
  tone: Tone;
}

const CURRENTLY: CurrentlyItem[] = [
  { labelKey: "about.currently.0", tone: "live" },
  { labelKey: "about.currently.1", tone: "primary" },
  { labelKey: "about.currently.2", tone: "primary" },
  { labelKey: "about.currently.3", tone: "primary" },
];

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
  const topLang = getTopLanguage(repos);
  const totalStars = repos
    ? repos.reduce((acc, r) => acc + r.stargazers_count, 0)
    : 7;
  const langCount = repos
    ? new Set(repos.map((r) => r.language).filter(Boolean)).size
    : 5;

  const STATS = [
    {
      icon: GitBranch,
      value: repoCount,
      label: "Dépôts publics",
      suffix: "",
    },
    {
      icon: Code2,
      value: langCount,
      label: "Langages actifs",
      suffix: "",
    },
    {
      icon: Globe,
      value: totalStars,
      label: "GitHub Stars",
      suffix: "",
    },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      ref={ref}
      className="relative py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl px-6">
        {/* Eyebrow + title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary/80">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {t["about.eyebrow"]}
          </p>
          <h2
            id="about-title"
            className="text-balance text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl"
          >
            {t["about.title"]}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t["about.subtitle"]}</p>
        </motion.div>

        {/* GitHub Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-8 grid grid-cols-3 divide-x divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-md"
        >
          {STATS.map(({ icon: Icon, value, label, suffix }, i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-4 py-5 text-center md:px-6"
            >
              <Icon className="mb-1 h-4 w-4 text-primary/70" aria-hidden="true" />
              <span className="text-2xl font-display font-bold text-foreground md:text-3xl">
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
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Two-column content */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Currently list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 backdrop-blur-md md:p-8"
          >
            <p className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary/80">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t["about.currently.intro"]}
            </p>

            <ul className="space-y-3.5 font-mono text-sm" role="list">
              {CURRENTLY.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex items-center gap-3 text-foreground/85"
                >
                  <span
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${TONE_DOT[item.tone]}`}
                    aria-hidden="true"
                  />
                  <span
                    className={item.tone === "live" ? "text-emerald-300" : undefined}
                  >
                    {t[item.labelKey as keyof typeof t] ?? item.labelKey}
                  </span>
                </li>
              ))}
            </ul>

            {/* Top language pill */}
            <div className="mt-6 flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground/60">
                Langage dominant :
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
                {topLang}
              </span>
            </div>

            <blockquote className="mt-5 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
              {t["about.quote"]}
            </blockquote>
          </motion.div>

          {/* Process steps */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 backdrop-blur-md md:p-8"
          >
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary/80">
              {t["about.process.title"]}
            </p>

            <div className="relative space-y-6 pl-4">
              {/* Vertical connector line */}
              <div
                className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
                aria-hidden="true"
              />

              {STEPS.map((step, i) => (
                <motion.div
                  key={step.idKey}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  className="relative space-y-1"
                >
                  {/* Step dot on the timeline */}
                  <span
                    className="absolute -left-[1.15rem] top-1 h-2 w-2 rounded-full bg-primary/60 ring-2 ring-primary/20"
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="bg-gradient-primary bg-clip-text font-mono text-2xl text-transparent">
                      {step.idKey}
                    </span>
                    <h3 className="text-base font-display font-semibold text-foreground">
                      {t[step.titleKey]}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{t[step.bodyKey]}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
