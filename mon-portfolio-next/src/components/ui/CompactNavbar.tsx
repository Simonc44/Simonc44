"use client";

import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { useIntl } from "@/providers/intl-provider";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * CompactNavbar — Liquid Glass style (same as LiquidGlassButton).
 *
 * Uses the exact same technique as the "Voir mes projets" button:
 * - SVG feTurbulence + feDisplacementMap for organic lens distortion
 * - Dual star-field layers (clear center → distorted perimeter)
 * - glass-button / glass-button-border CSS classes
 * - Chromatic aberration drop-shadows + volume box-shadows
 *
 * CTA uses the Simon gradient (purple → pink → amber) to match the hero title.
 * "Tech" link removed. Title blur removed from Hero.
 */
export function CompactNavbar({ onOpenChat }: { onOpenChat: () => void }) {
  const { lang, setLang, available } = useIntl();
  const [activeSection, setActiveSection] = useState<string>("");
  const [langOpen, setLangOpen] = useState(false);
  const uid = useId();
  const filterId = `nav-${uid.replace(/[^a-zA-Z0-9]/g, "")}`;

  // ── IntersectionObserver (scroll-spy) ──────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" }
    );

    const ids = ["about", "projects", "contact"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Close language dropdown on outside click ──────────
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = () => setLangOpen(false);
    window.addEventListener("click", handleClick, { once: true });
    return () => window.removeEventListener("click", handleClick);
  }, [langOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (id === "contact") {
      onOpenChat();
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-5 z-50 mx-auto w-[min(680px,94%)] -translate-x-1/2"
    >
      <div className="relative">
        {/* ── SVG filter — feTurbulence + feDisplacementMap ──
             Same as LiquidGlassButton for organic lens distortion. */}
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter
              id={filterId}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.005"
                numOctaves="3"
                seed="3"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="1.5 0 0 0 0  0 1.5 0 0 0  0 0 1.5 0 0  0 0 0 1 0"
                in="noise"
                result="ampedNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="ampedNoise"
                scale="50"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* ── Star field layers (same as LiquidGlassButton) ──
             Bottom: distorted stars across the whole area
             Top:    clear stars masked at center (distortion → perimeter) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          <div
            className="star-field absolute inset-0"
            style={{ filter: `url(#${filterId})` }}
          />
          <div
            className="star-field absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(70% 70% at 50% 50%, black 35%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(70% 70% at 50% 50%, black 35%, transparent 72%)",
            }}
          />
        </div>

        {/* ── Glass container (glass-button + glass-button-border) ── */}
        <div
          className="
            glass-button glass-button-border
            relative z-10
            flex items-center justify-between gap-6
            rounded-2xl px-5 py-2.5
            transition-all duration-500
          "
        >
          {/* Left: Navigation links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`
                    rounded-lg px-3 py-1.5
                    text-sm font-medium
                    transition-all duration-200
                    ${isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"}
                  `}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right: Language + CTA */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                className="
                  flex items-center gap-1
                  px-2 py-1
                  text-sm font-medium text-neutral-400
                  transition-colors duration-200
                  hover:text-neutral-200
                "
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                {lang.toUpperCase()}
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute right-0 top-full mt-2
                    min-w-[80px]
                    rounded-xl border border-white/[0.10]
                    bg-neutral-800/90 p-1
                    backdrop-blur-lg shadow-lg
                  "
                >
                  {available.map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLang(code);
                        setLangOpen(false);
                      }}
                      className={`
                        flex w-full items-center justify-center rounded-lg px-3 py-1.5
                        text-sm font-medium transition-colors duration-150
                        ${code === lang ? "text-white" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"}
                      `}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA — Simon gradient (purple → pink → amber) */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
              className="
                group relative inline-flex items-center gap-2
                rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300
                px-4 py-2
                text-sm font-medium text-white
                shadow-lg shadow-purple-500/10
                transition-all duration-300
                hover:shadow-xl hover:shadow-purple-500/25
                active:scale-[0.98]
              "
            >
              <span>Contact</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
