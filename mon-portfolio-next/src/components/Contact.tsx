"use client";

import { motion } from "framer-motion";
import { useIntl } from "@/providers/intl-provider";

import { useReveal } from "@/hooks/useReveal";

/** Hardcoded inbox — change here to redirect to your own address. */
const EMAIL = "simon.chusseau@gmail.com";

/**
 * Contact — email copy + mailto open + 3 social cards. All copy is
 * translated via `useIntl()`. No cross-module UI deps.
 */
export function Contact() {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      ref={ref}
      className="relative pt-16 pb-24 md:pt-24 md:pb-32"
    >
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-8 text-center backdrop-blur-xl transition-colors duration-500 hover:border-emerald-500/30 md:p-14"
        >
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent"
            aria-hidden="true"
          />

          <div className="relative">
            <h2
              id="contact-title"
              className="bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
            >
              {t["contact.title"]}
            </h2>
            <p className="mx-auto mt-4 mb-8 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
              {t["contact.subtitle"]}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.a
                href={`mailto:${EMAIL}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center rounded-2xl bg-white px-6 py-3 font-medium text-black shadow-lg shadow-white/5"
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
