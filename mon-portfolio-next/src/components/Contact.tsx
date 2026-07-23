"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIntl } from "@/providers/intl-provider";
import { useReveal } from "@/hooks/useReveal";
import {
  fadeUpLarge,
  hoverButton,
  reducedMotionVariants,
  SPRING_SMOOTH,
} from "@/lib/motion";

/** Hardcoded inbox — change here to redirect to your own address. */
const EMAIL = "simon.chusseau@gmail.com";

export function Contact() {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      ref={ref}
      className="relative pt-16 pb-24 md:pt-24 md:pb-32"
    >
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          variants={reduce ? reducedMotionVariants : fadeUpLarge}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-8 text-center backdrop-blur-xl transition-colors duration-500 hover:border-emerald-500/30 md:p-14"
        >
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent"
            aria-hidden="true"
          />

          <div className="relative">
            {/* Title */}
            <motion.h2
              id="contact-title"
              variants={reduce ? reducedMotionVariants : {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { ...SPRING_SMOOTH, delay: 0.1 } },
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
            >
              {t["contact.title"]}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={reduce ? reducedMotionVariants : {
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { ...SPRING_SMOOTH, delay: 0.22 } },
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mx-auto mt-4 mb-8 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg"
            >
              {t["contact.subtitle"]}
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={reduce ? reducedMotionVariants : {
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { ...SPRING_SMOOTH, delay: 0.38 } },
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.a
                href={`mailto:${EMAIL}`}
                whileHover={reduce ? undefined : hoverButton.whileHover}
                whileTap={reduce ? undefined : hoverButton.whileTap}
                transition={hoverButton.transition}
                className="inline-flex items-center rounded-2xl bg-white px-6 py-3 font-medium text-black shadow-lg shadow-white/5 transition-shadow duration-300 hover:shadow-white/15"
              >
                Commencer
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
