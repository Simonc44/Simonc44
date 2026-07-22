"use client";

import { motion } from "framer-motion";
import { useIntl, type Lang } from "@/providers/intl-provider";

/**
 * Accessible language switcher. Uses a `layoutId` animated pill behind
 * the active language. Keys are localized (EN/FR/ES labels — not language
 * names) to remain culturally neutral.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, available } = useIntl();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`relative flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-black/30 backdrop-blur-md p-1 ${
        compact ? "" : "shadow-glow"
      }`}
    >
      {available.map((code) => {
        const isActive = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={isActive}
            aria-label={`Switch to ${labelFor(code)}`}
            onClick={() => setLang(code)}
            className={`relative px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] rounded-full transition-colors duration-200 ${
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="langSwitcherPill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

function labelFor(code: Lang): string {
  return { fr: "Français", en: "English", es: "Español" }[code];
}
