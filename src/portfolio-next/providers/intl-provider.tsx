"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** Supported languages. Add more here. */
export type Lang = "fr" | "en" | "es";

/**
 * Inline dictionaries — replace with a fetch to /dictionaries/[lang].json
 * when the project grows. Keys are flat for simplicity.
 */
const DICTIONARIES = {
  fr: {
    "nav.about": "À propos",
    "nav.work": "Projets",
    "nav.contact": "Contact",
    "hero.eyebrow": "Portfolio · 2026",
    "hero.title": "Architecte de solutions numériques",
    "hero.subtitle":
      "Je conçois et construis des produits full-stack, IA et creative coding — du prototype à la mise en production.",
    "hero.cta": "Voir mes projets",
    "hero.ctaCommand": "$ npx init-projet",
    "hero.scroll": "défiler",
    "footer.built": "Conçu avec Three.js, R3F & beaucoup de café.",
  },
  en: {
    "nav.about": "About",
    "nav.work": "Work",
    "nav.contact": "Contact",
    "hero.eyebrow": "Portfolio · 2026",
    "hero.title": "Architect of digital solutions",
    "hero.subtitle":
      "I design and ship full-stack, AI & creative-coding products — from prototype to production.",
    "hero.cta": "View my work",
    "hero.ctaCommand": "$ npx init-project",
    "hero.scroll": "scroll",
    "footer.built": "Built with Three.js, R3F & way too much coffee.",
  },
  es: {
    "nav.about": "Sobre mí",
    "nav.work": "Proyectos",
    "nav.contact": "Contacto",
    "hero.eyebrow": "Portafolio · 2026",
    "hero.title": "Arquitecto de soluciones digitales",
    "hero.subtitle":
      "Diseño y envío productos full-stack, IA y creative coding — del prototipo a producción.",
    "hero.cta": "Ver proyectos",
    "hero.ctaCommand": "$ npx init-proyecto",
    "hero.scroll": "desplazar",
    "footer.built": "Construido con Three.js, R3F y mucho café.",
  },
} as const;

export type Dictionary = typeof DICTIONARIES.fr;

interface IntlContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  available: Lang[];
}

const STORAGE_KEY = "portfolio.lang";

const IntlContext = createContext<IntlContextValue | null>(null);

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  // Read persisted preference on mount; default to "fr" until then.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && stored in DICTIONARIES) setLangState(stored);
    } catch {
      /* localStorage blocked, keep default */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* swallow */
    }
    // Reflect in <html lang> for SEO + a11y
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const value = useMemo<IntlContextValue>(
    () => ({
      lang,
      setLang,
      t: DICTIONARIES[lang],
      available: Object.keys(DICTIONARIES) as Lang[],
    }),
    [lang, setLang]
  );

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}

export function useIntl(): IntlContextValue {
  const ctx = useContext(IntlContext);
  if (!ctx) {
    throw new Error("useIntl must be used within <IntlProvider>");
  }
  return ctx;
}

/** Helper to fetch a single translation key with a typed fallback. */
export function useT() {
  const { t } = useIntl();
  return (key: keyof Dictionary, fallback?: string) => t[key] ?? fallback ?? key;
}
