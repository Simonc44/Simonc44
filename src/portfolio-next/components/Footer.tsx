"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIntl } from "@/providers/intl-provider";

/**
 * Page footer with the localised "built with" line. Tiny component —
 * intentionally left as a client component because `useIntl()` hooks
 * into context state.
 */
export function Footer() {
  const { t } = useIntl();
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={reduce ? undefined : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/[0.06] py-10"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-6 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground sm:flex-row">
        <p>
          © {year}{" "}
          <span className="text-foreground">Simon Chusseau</span>
          <span className="mx-2 opacity-40">·</span>
          <span className="opacity-60">{t["footer.built"]}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          v3.0
        </p>
      </div>
    </motion.footer>
  );
}
