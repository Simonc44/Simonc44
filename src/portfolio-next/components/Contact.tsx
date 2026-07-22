"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowUpRight, Mail } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";

interface SocialDef {
  id: string;
  href: string;
  labelKey:
    | "contact.social.github"
    | "contact.social.linkedin"
    | "contact.social.instagram";
  hover: string;
  iconColor: string;
  glyph: string;
}

const SOCIALS: SocialDef[] = [
  {
    id: "github",
    href: "https://github.com/Simonc44",
    labelKey: "contact.social.github",
    hover: "hover:border-violet-400/40 hover:bg-violet-400/5",
    iconColor: "group-hover:text-violet-300",
    glyph: "GH",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
    labelKey: "contact.social.linkedin",
    hover: "hover:border-blue-400/40 hover:bg-blue-400/5",
    iconColor: "group-hover:text-blue-300",
    glyph: "IN",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/simonchusseau/",
    labelKey: "contact.social.instagram",
    hover: "hover:border-pink-400/40 hover:bg-pink-400/5",
    iconColor: "group-hover:text-pink-300",
    glyph: "IG",
  },
];

/** Hardcoded inbox — change here to redirect to your own address. */
const EMAIL = "simon.chusseau@gmail.com";

/** Auto-dismiss delay for the copy-success / copy-error notice. */
const NOTICE_DISMISS_MS = 2400;

/**
 * Standalone styled "toast" rendered inline inside the CTA card. Keeps
 * the module self-contained: no shadcn / `use-toast` dependency needed.
 * Purely presentational — animation lifecycle + auto-dismiss is owned
 * by the parent `Contact` component so timer resets never race with
 * the parent's re-renders.
 */
function InlineNotice({
  message,
  variant = "success",
}: {
  message: string;
  variant?: "success" | "error";
}) {
  const palette =
    variant === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : "border-rose-400/30 bg-rose-400/10 text-rose-200";

  return (
    <motion.div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }}
      className={`mx-auto max-w-md rounded-xl border px-4 py-2 text-xs font-mono ${palette}`}
    >
      {message}
    </motion.div>
  );
}

/**
 * Contact — email copy + mailto open + 3 social cards. All copy is
 * translated via `useIntl()`. No cross-module UI deps.
 */
export function Contact() {
  const { t } = useIntl();
  const [notice, setNotice] = useState<
    { variant: "success" | "error"; message: string } | null
  >(null);
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  // Auto-dismiss lifted to the parent. Depends only on the `notice`
  // identity — when a new notice appears, the previous timer is
  // cleared and a fresh 2.4 s window starts. No risk of reset on
  // unrelated re-renders (parent re-renders don't restart the timer).
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), NOTICE_DISMISS_MS);
    return () => clearTimeout(id);
  }, [notice]);

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setNotice({ variant: "success", message: `${t["contact.copied"]} · ${EMAIL}` });
    } catch {
      setNotice({ variant: "error", message: `${t["contact.copy"]} · ${EMAIL}` });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      ref={ref}
      className="relative py-24 md:py-32"
    >
      {/* Halo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 bg-gradient-radial from-primary/15 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-card/[0.05] p-10 text-center shadow-glow backdrop-blur-md md:p-16"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10"
            aria-hidden="true"
          />

          <div className="relative space-y-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
              {t["contact.eyebrow"]}
            </p>
            <h2
              id="contact-title"
              className="text-balance text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl"
            >
              {t["contact.title"]}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t["contact.subtitle"]}
            </p>

            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-card/[0.04] px-5 py-3 font-mono text-sm transition-colors hover:border-primary/40 hover:bg-card/[0.06]"
                aria-label={t["contact.copy"]}
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-foreground">{EMAIL}</span>
                {notice?.variant === "success" ? (
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {notice?.variant === "success"
                    ? t["contact.copied"]
                    : t["contact.copy"]}
                </span>
              </button>

              <Button
                size="lg"
                className="bg-gradient-primary px-5 shadow-glow hover:brightness-110"
                asChild
              >
                <a href={`mailto:${EMAIL}`}>
                  {t["contact.openMailto"]}
                  <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>

            <div className="min-h-[2.25rem]">
              {/* `mode="wait"` is forward-safe: if `setNotice` ever
                  becomes append-shaped, the next notice waits for the
                  previous one to exit rather than overlapping. */}
              <AnimatePresence mode="wait">
                {notice && (
                  <InlineNotice
                    message={notice.message}
                    variant={notice.variant}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Socials */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {SOCIALS.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-card/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] ${social.hover}`}
              aria-label={t[social.labelKey]}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-card/40 font-mono text-xs text-muted-foreground transition-colors duration-300 ${social.iconColor}`}
                  aria-hidden="true"
                >
                  {social.glyph}
                </div>
                <p className="text-sm font-medium">{t[social.labelKey]}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
