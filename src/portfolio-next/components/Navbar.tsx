"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useIntl } from "@/providers/intl-provider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const NAV_ITEMS = [
  { id: "about", key: "nav.about" as const },
  { id: "work", key: "nav.work" as const },
  { id: "contact", key: "nav.contact" as const },
];

/**
 * Floating glassmorphism navbar. Doesn't expand to a full bar — it lives
 * as a small pill in the top-center, gaining a subtle border + glow
 * once the user scrolls past 40px.
 */
export function Navbar() {
  const { t } = useIntl();
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Subtle scale-down on scroll for proportional feel
  const scale = useTransform(scrollY, [0, 120], [1, 0.97]);
  const opacity = useTransform(scrollY, [0, 120], [1, 0.92]);

  // Track the visible section via IntersectionObserver (works alongside Lenis)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = ["hero", ...NAV_ITEMS.map((i) => i.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
      style={{ scale, opacity }}
      className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(560px,92%)] items-center justify-between gap-2 rounded-full border border-white/[0.06] bg-background/40 px-3 py-2 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Brand mark — plain <a> so Lenis intercepts the anchor smoothly. */}
      <a
        href="#hero"
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-display font-medium tracking-tight text-foreground hover:text-primary transition-colors"
        aria-label="S.C — Home"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        S<span className="text-primary">.</span>C
      </a>

      {/* Center nav */}
      <nav className="hidden items-center gap-0.5 sm:flex" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-current={isActive ? "page" : undefined}
            >
              {t[item.key]}
              {isActive && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right cluster: switcher + portable contact link */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-primary-foreground shadow-glow transition-all hover:brightness-110"
        >
          {t["nav.contact"]}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </motion.header>
  );
}
