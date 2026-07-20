"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";

/** ToneClass controls the colour of the dot next to each "Currently" item. */
type Tone = "live" | "primary" | "muted";

interface CurrentlyItem {
  labelKey: `about.currently.${"0" | "1" | "2" | "3"}`;
  tone: Tone;
}

const CURRENTLY: CurrentlyItem[] = [
  { labelKey: "about.currently.0", tone: "live" },
  { labelKey: "about.currently.1", tone: "primary" },
  { labelKey: "about.currently.2", tone: "primary" },
  { labelKey: "about.currently.3", tone: "primary" },
];

const TONE_DOT: Record<Tone, string> = {
  live: "bg-emerald-400",
  primary: "bg-primary",
  muted: "bg-muted-foreground/40",
};

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
 * The About section — currently list + process steps + quote.
 * Demonstrates a multi-key i18n lookup pattern with a small typed
 * registry for the dynamic "Currently" list (keys are constrained
 * to `about.currently.0`–`about.currently.3` via the `CurrentlyItem`
 * type).
 */
export function About() {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      ref={ref}
      className="relative py-24 md:py-32"
    >
      <div className="container mx-auto max-w-6xl px-6">
        {/* Eyebrow + title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {t["about.eyebrow"]}
          </p>
          <h2
            id="about-title"
            className="text-balance text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl"
          >
            {t["about.title"]}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t["about.subtitle"]}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Currently list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="rounded-2xl border border-white/[0.06] bg-card/[0.05] p-6 backdrop-blur-md md:p-8"
          >
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t["about.currently.intro"]}
            </p>
            <ul className="space-y-3 font-mono text-sm">
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
                    className={
                      item.tone === "live" ? "text-emerald-300" : undefined
                    }
                  >
                    {t[item.labelKey]}
                  </span>
                </li>
              ))}
            </ul>
            <blockquote className="mt-6 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
              {t["about.quote"]}
            </blockquote>
          </motion.div>

          {/* Process steps */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="rounded-2xl border border-white/[0.06] bg-card/[0.05] p-6 backdrop-blur-md md:p-8"
          >
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
              {t["about.process.title"]}
            </p>
            <div className="space-y-5">
              {STEPS.map((step) => (
                <div key={step.idKey} className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="bg-gradient-primary bg-clip-text font-mono text-2xl text-transparent">
                      {step.idKey}
                    </span>
                    <h3 className="text-base font-display font-semibold text-foreground">
                      {t[step.titleKey]}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t[step.bodyKey]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
