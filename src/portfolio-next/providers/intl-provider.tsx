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
 * Flat i18n dictionaries covering every section of the portfolio.
 * Keys are dot-segregated (`section.element`).  Values are pure strings —
 * no React nodes, no markup — so they're safe to interpolate anywhere.
 *
 * Every filter id (`project.<id>.categoryId`) is a stable, language-
 * agnostic enum — never translated — so list filtering works in all
 * locales. The display string for the same id lives at
 * `projects.category.${categoryId}`.
 */
const DICTIONARIES = {
  fr: {
    /* ── nav ─────────────────────────── */
    "nav.about": "À propos",
    "nav.work": "Projets",
    "nav.contact": "Contact",

    /* ── hero ────────────────────────── */
    "hero.eyebrow": "Portfolio · 2026",
    "hero.title": "Architecte de solutions numériques",
    "hero.subtitle":
      "Je conçois et construis des produits full-stack, IA et creative coding — du prototype à la mise en production.",
    "hero.cta": "Voir mes projets",
    "hero.ctaCommand": "$ npx init-projet",
    "hero.scroll": "défiler",

    /* ── about ───────────────────────── */
    "about.eyebrow": "À propos",
    "about.title": "Du prototype à la production",
    "about.subtitle":
      "Architecte de solutions, self-taught, travaillant à l'intersection de l'IA, de la civic tech et du developer tooling.",
    "about.currently.intro": "En ce moment",
    "about.currently.0": "CygnisAI & Mandat en production",
    "about.currently.1": "Exploration d'idées SaaS via Reddit",
    "about.currently.2": "Apprentissage de l'orchestration LLM avancée",
    "about.currently.3": "Ouvert aux collaborations & freelance",
    "about.process.title": "Process",
    "about.process.ideate.title": "Idéation",
    "about.process.ideate.body":
      "Recherche Reddit, identification des pain-points utilisateurs, wireframes rapides — chaque idée passe par un « pourquoi maintenant ».",
    "about.process.build.title": "Construction",
    "about.process.build.body":
      "React, TypeScript et orchestration IA en qualité production. Design system cohérent, boucles de feedback courtes.",
    "about.process.ship.title": "Livraison",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics câblés dès le premier jour. Public by default.",
    "about.quote":
      "« La meilleure façon de prédire le futur est de le construire. »",

    /* ── tech ────────────────────────── */
    "tech.eyebrow": "Stack",
    "tech.title": "Les outils que je manie",
    "tech.subtitle":
      "Les technologies que j'utilise pour passer de l'idée au produit en production. La liste s'allonge à chaque sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · IA · Infra",

    /* ── projects ────────────────────── */
    "projects.eyebrow": "Projets",
    "projects.title": "Ce que j'ai livré",
    "projects.subtitle":
      "Produits en production, projets open-source et missions clients. Filtrez par catégorie.",
    "projects.category.all": "Tout",
    "projects.category.ai": "IA",
    "projects.category.civictech": "Civic Tech",
    "projects.category.devtools": "Devtools",
    "projects.category.productivity": "Productivité",
    "projects.category.design": "Design",
    "projects.cta.live": "Live",
    "projects.cta.code": "Code",
    "projects.empty": "Aucun projet dans cette catégorie — stay tuned !",

    /* projects — Mandat */
    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "Civic Tech française",
    "project.mandat.description":
      "Suivi des votes de l'Assemblée nationale (17ᵉ législature). API publique complète, chat IA, simulator hémicycle, analytics GDPR-friendly.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    /* projects — CygnisAI */
    "project.cygnis.title": "CygnisAI",
    "project.cygnis.subtitle": "Plateforme IA",
    "project.cygnis.description":
      "Agents IA personnalisables connectés à vos données — génération multi-modale, mémoire long terme et connecteurs.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "En production",
    "project.cygnis.categoryId": "ai",

    /* projects — Procivi */
    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "Générateur de CV IA",
    "project.procivi.description":
      "Gemini transforme votre profil LinkedIn en CV, lettres de motivation et e-mails ciblés en moins de 30 secondes.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    /* projects — OmniMCP Router */
    "project.omnimcp.title": "OmniMCP Router",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "Router MCP avec auto-healing, hot-reload, hooks et profiling. CI sur Ubuntu & Windows, Python 3.10–3.12.",
    "project.omnimcp.tags": "Python, MCP, CI/CD, GitHub Actions",
    "project.omnimcp.status": "Open source",
    "project.omnimcp.categoryId": "devtools",

    /* projects — Homa RH */
    "project.homa.title": "Homa RH",
    "project.homa.subtitle": "Site vitrine RH",
    "project.homa.description":
      "Site premium pour cabinet de conseil RH — mobile-first, glassmorphisme, diagnostic RH interactif, SEO local & structured data.",
    "project.homa.tags": "Vite, React, TypeScript, Tailwind CSS",
    "project.homa.status": "Mission client",
    "project.homa.categoryId": "design",

    /* ── contact ─────────────────────── */
    "contact.eyebrow": "Contact",
    "contact.title": "Construisons quelque chose",
    "contact.subtitle":
      "Disponible pour collaborations, missions freelance et produits ambitieux — IA, civic tech et full-stack. Sur site France ou remote.",
    "contact.emailLabel": "simon.chusseau@gmail.com",
    "contact.copy": "Copier l'email",
    "contact.copied": "Copié !",
    "contact.openMailto": "Ouvrir",
    "contact.social.github": "@Simonc44 sur GitHub",
    "contact.social.linkedin": "Simon Chusseau sur LinkedIn",
    "contact.social.instagram": "@simonchusseau sur Instagram",

    /* ── status / badges ────────────── */
    "status.available": "Disponible — Q4 2026",
    "status.live": "En production",
    "status.oss": "Open source",
    "status.featured": "Featured",
    "status.client": "Mission client",

    /* ── footer ──────────────────────── */
    "footer.built": "Conçu avec Three.js, R3F & beaucoup de café.",
  },

  en: {
    "nav.about": "About",
    "nav.work": "Work",
    "nav.contact": "Contact",

    "hero.eyebrow": "Portfolio · 2026",
    "hero.title": "Architect of digital solutions",
    "hero.subtitle":
      "I design and ship full-stack, AI and creative-coding products — from prototype to production.",
    "hero.cta": "View my work",
    "hero.ctaCommand": "$ npx init-project",
    "hero.scroll": "scroll",

    "about.eyebrow": "About",
    "about.title": "From prototype to production",
    "about.subtitle":
      "Self-taught architect of solutions, working at the intersection of AI, civic tech and developer tooling.",
    "about.currently.intro": "Currently",
    "about.currently.0": "CygnisAI & Mandat in production",
    "about.currently.1": "Exploring SaaS ideas via Reddit",
    "about.currently.2": "Learning advanced LLM orchestration",
    "about.currently.3": "Open to collaborations & freelance",
    "about.process.title": "Process",
    "about.process.ideate.title": "Ideate",
    "about.process.ideate.body":
      "Reddit research, user pain-point hunting, rapid wireframes — every idea clears a 'why now' gate.",
    "about.process.build.title": "Build",
    "about.process.build.body":
      "React, TypeScript and AI orchestration at production quality. Tight loops with the design system.",
    "about.process.ship.title": "Ship",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics wired from day one. Public by default.",
    "about.quote":
      "“The best way to predict the future is to build it.”",

    "tech.eyebrow": "Stack",
    "tech.title": "The tools I ship with",
    "tech.subtitle":
      "Technologies I reach for to bring ideas to production. The list grows every sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · AI · Infra",

    "projects.eyebrow": "Projects",
    "projects.title": "What I've shipped",
    "projects.subtitle":
      "Production products, open-source projects and client missions. Filter by category.",
    "projects.category.all": "All",
    "projects.category.ai": "AI",
    "projects.category.civictech": "Civic Tech",
    "projects.category.devtools": "DevTools",
    "projects.category.productivity": "Productivity",
    "projects.category.design": "Design",
    "projects.cta.live": "Live",
    "projects.cta.code": "Code",
    "projects.empty": "No projects in this category yet — stay tuned!",

    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "French Civic Tech",
    "project.mandat.description":
      "Tracking tool for the National Assembly (17th legislature). Full public API, AI chat, hemicycle simulator, GDPR-friendly analytics.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    "project.cygnis.title": "CygnisAI",
    "project.cygnis.subtitle": "AI Platform",
    "project.cygnis.description":
      "Customisable AI agents connected to your data — multi-modal generation, long-term memory, content connectors.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "In production",
    "project.cygnis.categoryId": "ai",

    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "AI CV Generator",
    "project.procivi.description":
      "Gemini turns your LinkedIn into CVs, cover letters and personalised emails in under 30 seconds.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    "project.omnimcp.title": "OmniMCP Router",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "MCP router with auto-healing, hot-reload, hooks and performance profiling. CI on Ubuntu & Windows, Python 3.10–3.12.",
    "project.omnimcp.tags": "Python, MCP, CI/CD, GitHub Actions",
    "project.omnimcp.status": "Open source",
    "project.omnimcp.categoryId": "devtools",

    "project.homa.title": "Homa RH",
    "project.homa.subtitle": "HR Showcase Site",
    "project.homa.description":
      "Premium showcase for an HR consulting firm — mobile-first, glassmorphism, interactive HR diagnostic, local SEO and structured data.",
    "project.homa.tags": "Vite, React, TypeScript, Tailwind CSS",
    "project.homa.status": "Client work",
    "project.homa.categoryId": "design",

    "contact.eyebrow": "Contact",
    "contact.title": "Let's build something",
    "contact.subtitle":
      "Available for collaborations, freelance missions and ambitious products — AI, civic tech and full-stack web. On-site France or remote.",
    "contact.emailLabel": "simon.chusseau@gmail.com",
    "contact.copy": "Copy email",
    "contact.copied": "Copied!",
    "contact.openMailto": "Open",
    "contact.social.github": "@Simonc44 on GitHub",
    "contact.social.linkedin": "Simon Chusseau on LinkedIn",
    "contact.social.instagram": "@simonchusseau on Instagram",

    "status.available": "Available — Q4 2026",
    "status.live": "In production",
    "status.oss": "Open source",
    "status.featured": "Featured",
    "status.client": "Client work",

    "footer.built": "Built with Three.js, R3F and way too much coffee.",
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

    "about.eyebrow": "Sobre mí",
    "about.title": "Del prototipo a producción",
    "about.subtitle":
      "Arquitecto de soluciones, autodidacta, en la intersección de la IA, civic tech y developer tooling.",
    "about.currently.intro": "Actualmente",
    "about.currently.0": "CygnisAI & Mandat en producción",
    "about.currently.1": "Explorando ideas SaaS vía Reddit",
    "about.currently.2": "Aprendiendo orquestación avanzada de LLMs",
    "about.currently.3": "Abierto a colaboraciones & freelance",
    "about.process.title": "Proceso",
    "about.process.ideate.title": "Idear",
    "about.process.ideate.body":
      "Investigación en Reddit, identificación de pain-points, wireframes rápidos — cada idea pasa por un 'por qué ahora'.",
    "about.process.build.title": "Construir",
    "about.process.build.body":
      "React, TypeScript y orquestación IA en calidad producción. Loops cortos con el design system.",
    "about.process.ship.title": "Lanzar",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics conectados desde el primer día. Public by default.",
    "about.quote":
      "« La mejor forma de predecir el futuro es construirlo. »",

    "tech.eyebrow": "Stack",
    "tech.title": "Las herramientas que manejo",
    "tech.subtitle":
      "Tecnologías que uso para llevar una idea a producción. La lista crece cada sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · IA · Infra",

    "projects.eyebrow": "Proyectos",
    "projects.title": "Lo que he enviado",
    "projects.subtitle":
      "Productos en producción, proyectos open-source y misiones cliente. Filtrá por categoría.",
    "projects.category.all": "Todo",
    "projects.category.ai": "IA",
    "projects.category.civictech": "Civic Tech",
    "projects.category.devtools": "DevTools",
    "projects.category.productivity": "Productividad",
    "projects.category.design": "Diseño",
    "projects.cta.live": "Live",
    "projects.cta.code": "Código",
    "projects.empty": "Aún no hay proyectos en esta categoría — stay tuned!",

    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "Civic Tech francesa",
    "project.mandat.description":
      "Seguimiento de votos de la Asamblea Nacional (17ª legislatura). API pública completa, chat IA, simulador hemiciclo, analytics GDPR-friendly.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    "project.cygnis.title": "CygnisAI",
    "project.cygnis.subtitle": "Plataforma IA",
    "project.cygnis.description":
      "Agentes IA personalizables conectados a tus datos — generación multi-modal, memoria de largo plazo y conectores.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "En producción",
    "project.cygnis.categoryId": "ai",

    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "Generador de CV IA",
    "project.procivi.description":
      "Gemini convierte tu LinkedIn en CV, cartas de presentación y correos personalizados en menos de 30 segundos.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    "project.omnimcp.title": "OmniMCP Router",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "Router MCP con auto-healing, hot-reload, hooks y profiling. CI en Ubuntu & Windows, Python 3.10–3.12.",
    "project.omnimcp.tags": "Python, MCP, CI/CD, GitHub Actions",
    "project.omnimcp.status": "Open source",
    "project.omnimcp.categoryId": "devtools",

    "project.homa.title": "Homa RH",
    "project.homa.subtitle": "Sitio de consultoría RH",
    "project.homa.description":
      "Sitio premium para consultora de RR.HH. — mobile-first, glassmorfismo, HR diagnostic interactivo, SEO local y datos estructurados.",
    "project.homa.tags": "Vite, React, TypeScript, Tailwind CSS",
    "project.homa.status": "Misión cliente",
    "project.homa.categoryId": "design",

    "contact.eyebrow": "Contacto",
    "contact.title": "Construyamos algo",
    "contact.subtitle":
      "Disponible para colaboraciones, misiones freelance y productos ambiciosos — IA, civic tech y full-stack. En sede Francia o remoto.",
    "contact.emailLabel": "simon.chusseau@gmail.com",
    "contact.copy": "Copiar email",
    "contact.copied": "¡Copiado!",
    "contact.openMailto": "Abrir",
    "contact.social.github": "@Simonc44 en GitHub",
    "contact.social.linkedin": "Simon Chusseau en LinkedIn",
    "contact.social.instagram": "@simonchusseau en Instagram",

    "status.available": "Disponible — Q4 2026",
    "status.live": "En producción",
    "status.oss": "Open source",
    "status.featured": "Featured",
    "status.client": "Misión cliente",

    "footer.built": "Construido con Three.js, R3F y mucho café.",
  },
} as const;

export type Dictionary = typeof DICTIONARIES.fr;

/**
 * Canonical list of project IDs in render order. Cards are looked up from
 * the dictionaries using these ids.
 */
export const PROJECT_IDS = [
  "mandat",
  "cygnis",
  "procivi",
  "omnimcp",
  "homa",
] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

/**
 * Stable, language-agnostic category ids. Filtering compares against
 * these — never the translated display string stored at
 * `projects.category.${categoryId}`.
 */
export const CATEGORY_IDS = [
  "ai",
  "civictech",
  "devtools",
  "productivity",
  "design",
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** "all" is the synthetic filter that suppresses the category predicate. */
export type FilterId = "all" | CategoryId;

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

/** Type-safe dictionary lookup helper. */
export function tr<K extends keyof Dictionary>(t: Dictionary, key: K): Dictionary[K] {
  return t[key];
}
