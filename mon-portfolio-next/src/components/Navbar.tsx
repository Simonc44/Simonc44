"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoBlur } from "@/components/LogoBlur";

const NAV_ITEMS = [
  { id: "about", key: "nav.about" as const },
  { id: "projects", key: "nav.work" as const },
  { id: "contact", key: "nav.contact" as const },
];

/**
 * Navbar — floating glassmorphism pill.
 *
 * Changes:
 * - Brand mark wrapped in `<LogoBlur>` for premium frosted-glass look.
 * - Active section tracked via IntersectionObserver (Lenis-compatible).
 * - No reference to 'simon-connect'.
 * - FR/EN/ES switcher preserved via `<LanguageSwitcher>`.
 * - Subtle scale-down on scroll via `useTransform`.
 */
export function Navbar() {
  const { t } = useIntl();
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);

  const scale = useTransform(scrollY, [0, 100], [1, 0.97]);

  // Enhance border visibility once user scrolls (matches scroll state)
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  // Track visible section via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = ["hero", ...NAV_ITEMS.map((i) => i.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
      style={{ scale }}
      className={[
        "fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(580px,92%)] items-center justify-between gap-2",
        "rounded-full border px-3 py-2 backdrop-blur-xl backdrop-saturate-150",
        "transition-all duration-500",
        scrolled
          ? "border-white/[0.1] bg-black/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
          : "border-white/[0.05] bg-white/[0.02] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      {/* Brand — wrapped in LogoBlur for premium glass effect */}
      <a
        href="#hero"
        aria-label="Simon Chusseau — Retour en haut"
        className="flex items-center rounded-full transition-opacity hover:opacity-80"
      >
        <LogoBlur compact>
          <span className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-foreground">
            {/* Live availability dot */}
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            S<span className="text-gradient">.</span>C
          </span>
        </LogoBlur>
      </a>

      {/* Center nav links */}
      <nav className="hidden items-center gap-0.5 sm:flex" aria-label="Navigation principale">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              aria-current={isActive ? "page" : undefined}
            >
              {t[item.key]}
              {isActive && (
                <motion.span
                  layoutId="navActiveIndicator"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/12 border border-primary/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-primary-foreground shadow-glow-sm transition-all duration-300 hover:brightness-110 hover:scale-[1.04]"
        >
          {t["nav.contact"]}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </motion.header>
  );
}
