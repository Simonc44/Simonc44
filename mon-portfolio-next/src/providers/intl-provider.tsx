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
    "about.title": "Mon process",
    "about.subtitle":
      "De l'idée au produit en production — ma méthodologie en trois étapes.",
    "about.statsTitle": "Mes chiffres",
    "about.stats.repos": "Dépôts publics",
    "about.stats.langs": "Langages actifs",
    "about.stats.stars": "GitHub Stars",
    "about.process.ideate.title": "Idéation",
    "about.process.ideate.body":
      "Recherche Reddit, identification des pain-points utilisateurs, wireframes rapides — chaque idée passe par un « pourquoi maintenant ».",
    "about.process.build.title": "Construction",
    "about.process.build.body":
      "React, TypeScript et orchestration IA en qualité production. Design system cohérent, boucles de feedback courtes.",
    "about.process.ship.title": "Livraison",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics câblés dès le premier jour. Public by default.",


    /* ── tech ────────────────────────── */
    "tech.eyebrow": "Stack",
    "tech.title": "Les outils que je manie",
    "tech.subtitle":
      "Les technologies que j'utilise pour passer de l'idée au produit en production. La liste s'allonge à chaque sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · IA · Infra",

    /* ── projects ────────────────────── */
    "projects.eyebrow": "Projets",
    "projects.title": "Mes créations",
    "projects.subtitle":
      "Produits en production, projets open-source et missions clients.",
    "projects.category.design": "Design",
    "projects.cta.live": "Live",
    "projects.cta.code": "Code",
    "projects.empty": "Aucun projet dans cette catégorie — stay tuned !",

    /* projects — Mandat */
    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "Civic Tech française",
    "project.mandat.description":
      "Mandat est le seul hub qui centralise en temps réel les données brutes de l'Assemblée, les analyses contextuelles de CIVIX et les informations de présence pour offrir une lecture simplifiée et ultra-rapide de l'activité législative, le tout dans une interface conçue pour les usages mobiles actuels.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    /* projects — CygnisAI */
    "project.cygnis.title": "Cygnis AI Studio",
    "project.cygnis.subtitle": "Plateforme IA",
    "project.cygnis.description":
      "Cygnis AI Studio propose une API complète du modèle Cygnis A1, permettant aux développeurs d'intégrer facilement les capacités de CygnisAI dans leurs propres applications, sites web ou projets SaaS. Le dépôt contient la documentation et les outils nécessaires pour exploiter la puissance du modèle via des requêtes API.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "En production",
    "project.cygnis.categoryId": "ai",

    /* projects — Procivi */
    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "Générateur de CV IA",
    "project.procivi.description":
      "Procivi est une application de génération de CV et lettres de motivation intelligentes, grâce à l'IA. L'utilisateur peut créer son CV manuellement ou importer automatiquement ses données via LinkedIn. L'objectif : simplifier la création de documents professionnels personnalisés, clairs et percutants.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    /* projects — OmniMCP Router */
    "project.omnimcp.title": "OmniMCP",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "The Universal MCP Gateway — One Entry Point to Rule All Your AI Tools",
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

    /* projects — Cycode */
    "project.cycode.title": "Cycode",
    "project.cycode.subtitle": "Assistant IA",
    "project.cycode.description":
      "Assistant de codage IA avancé",
    "project.cycode.categoryId": "ai",

    /* projects — HumanizerAI */
    "project.humanizer.title": "HumanizerAI",
    "project.humanizer.subtitle": "Humanisation de texte IA",
    "project.humanizer.description":
      "HumanizerAI est un outil d'IA conçu pour humaniser les textes générés automatiquement. Il reformule, fluidifie et adapte le ton des écrits afin qu'ils paraissent naturels et authentiques, tout en conservant leur sens. L'IA peut aussi analyser la cohérence, la tonalité et le style d'un texte pour l'améliorer.",
    "project.humanizer.categoryId": "ai",

    /* projects — Portfolio */
    "project.portfolio.title": "Simonc44",
    "project.portfolio.subtitle": "Portfolio",
    "project.portfolio.description":
      "Portefeuille est le profil en ligne de Simon Chusseau, regroupant ses projets, compétences et réalisations dans le domaine de l'intelligence artificielle, du développement web et des applications intelligentes. Ce dépôt sert de vitrine interactive pour présenter son parcours et ses créations.",
    "project.portfolio.categoryId": "design",

    /* projects — Reddit MCP */
    "project.reddit-mcp.title": "Reddit MCP Server",
    "project.reddit-mcp.subtitle": "Developer Tooling",
    "project.reddit-mcp.description":
      "A Model Context Protocol (MCP) server that lets AI assistants like Claude search, browse, and analyze Reddit in real-time using Playwright web scraping.",
    "project.reddit-mcp.categoryId": "devtools",

    /* projects — Cygnis SDK */
    "project.cygnis-sdk.title": "CygnisAI SDK Python",
    "project.cygnis-sdk.subtitle": "SDK Python",
    "project.cygnis-sdk.description":
      "Official Python SDK for the CygnisAI API",
    "project.cygnis-sdk.categoryId": "devtools",

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
    "footer.copyright": "© {year} Simon Chusseau. All rights reserved.",
    "footer.description": "Creative Developer & AI Engineer. Building products at the intersection of design, code, and artificial intelligence.",
    "footer.navTitle": "Navigation",
    "footer.home": "Accueil",
    "footer.process": "Mon process",
    "footer.creations": "Mes créations",
    "footer.contact": "Contact",
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
    "about.title": "My process",
    "about.subtitle":
      "From idea to production — my three-step methodology.",
    "about.statsTitle": "My numbers",
    "about.stats.repos": "Public repos",
    "about.stats.langs": "Active languages",
    "about.stats.stars": "GitHub Stars",
    "about.process.ideate.title": "Ideate",
    "about.process.ideate.body":
      "Reddit research, user pain-point hunting, rapid wireframes — every idea clears a 'why now' gate.",
    "about.process.build.title": "Build",
    "about.process.build.body":
      "React, TypeScript and AI orchestration at production quality. Tight loops with the design system.",
    "about.process.ship.title": "Ship",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics wired from day one. Public by default.",


    "tech.eyebrow": "Stack",
    "tech.title": "The tools I ship with",
    "tech.subtitle":
      "Technologies I reach for to bring ideas to production. The list grows every sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · AI · Infra",

    "projects.eyebrow": "Projects",
    "projects.title": "My creations",
    "projects.subtitle":
      "Production products, open-source projects and client missions.",
    "projects.category.design": "Design",
    "projects.cta.live": "Live",
    "projects.cta.code": "Code",
    "projects.empty": "No projects in this category yet — stay tuned!",

    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "French Civic Tech",
    "project.mandat.description":
      "Mandat is the only hub that centralises in real-time the raw data from the National Assembly, contextual analysis from CIVIX, and attendance information to offer a simplified, ultra-fast reading of legislative activity — all in an interface designed for modern mobile usage.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    "project.cygnis.title": "Cygnis AI Studio",
    "project.cygnis.subtitle": "AI Platform",
    "project.cygnis.description":
      "Cygnis AI Studio offers a complete API for the Cygnis A1 model, allowing developers to easily integrate CygnisAI capabilities into their own applications, websites, or SaaS projects. The repository contains the documentation and tools needed to harness the model's power via API requests.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "In production",
    "project.cygnis.categoryId": "ai",

    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "AI CV Generator",
    "project.procivi.description":
      "Procivi is an intelligent CV and cover letter generation application powered by AI. Users can create their CV manually or automatically import their data via LinkedIn. The goal: simplify the creation of personalised, clear, and impactful professional documents.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    "project.omnimcp.title": "OmniMCP",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "The Universal MCP Gateway — One Entry Point to Rule All Your AI Tools",
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

    /* projects — Cycode */
    "project.cycode.title": "Cycode",
    "project.cycode.subtitle": "AI Assistant",
    "project.cycode.description":
      "Advanced AI coding assistant",
    "project.cycode.categoryId": "ai",

    /* projects — HumanizerAI */
    "project.humanizer.title": "HumanizerAI",
    "project.humanizer.subtitle": "AI Text Humanisation",
    "project.humanizer.description":
      "HumanizerAI is an AI tool designed to humanise automatically generated text. It rewrites, smoothes, and adapts the tone of writing to make it appear natural and authentic, while preserving its meaning. The AI can also analyse the coherence, tone, and style of a text to improve it.",
    "project.humanizer.categoryId": "ai",

    /* projects — Portfolio */
    "project.portfolio.title": "Simonc44",
    "project.portfolio.subtitle": "Portfolio",
    "project.portfolio.description":
      "Portfolio is the online profile of Simon Chusseau, bringing together his projects, skills, and achievements in the fields of artificial intelligence, web development, and smart applications. This repository serves as an interactive showcase for his work and creations.",
    "project.portfolio.categoryId": "design",

    /* projects — Reddit MCP */
    "project.reddit-mcp.title": "Reddit MCP Server",
    "project.reddit-mcp.subtitle": "Developer Tooling",
    "project.reddit-mcp.description":
      "A Model Context Protocol (MCP) server that lets AI assistants like Claude search, browse, and analyze Reddit in real-time using Playwright web scraping.",
    "project.reddit-mcp.categoryId": "devtools",

    /* projects — Cygnis SDK */
    "project.cygnis-sdk.title": "CygnisAI SDK Python",
    "project.cygnis-sdk.subtitle": "Python SDK",
    "project.cygnis-sdk.description":
      "Official Python SDK for the CygnisAI API",
    "project.cygnis-sdk.categoryId": "devtools",

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
    "footer.copyright": "© {year} Simon Chusseau. All rights reserved.",
    "footer.description": "Creative Developer & AI Engineer. Building products at the intersection of design, code, and artificial intelligence.",
    "footer.navTitle": "Navigation",
    "footer.home": "Home",
    "footer.process": "My process",
    "footer.creations": "My creations",
    "footer.contact": "Contact",
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
    "about.title": "Mi proceso",
    "about.subtitle":
      "De la idea a la producción — mi metodología en tres pasos.",
    "about.statsTitle": "Mis cifras",
    "about.stats.repos": "Repos públicos",
    "about.stats.langs": "Lenguajes activos",
    "about.stats.stars": "Estrellas GitHub",
    "about.process.ideate.title": "Idear",
    "about.process.ideate.body":
      "Investigación en Reddit, identificación de pain-points, wireframes rápidos — cada idea pasa por un 'por qué ahora'.",
    "about.process.build.title": "Construir",
    "about.process.build.body":
      "React, TypeScript y orquestación IA en calidad producción. Loops cortos con el design system.",
    "about.process.ship.title": "Lanzar",
    "about.process.ship.body":
      "Vercel previews, edge functions, analytics conectados desde el primer día. Public by default.",


    "tech.eyebrow": "Stack",
    "tech.title": "Las herramientas que manejo",
    "tech.subtitle":
      "Tecnologías que uso para llevar una idea a producción. La lista crece cada sprint.",
    "tech.row.frontend": "Frontend",
    "tech.row.backend": "Backend · IA · Infra",

    "projects.eyebrow": "Proyectos",
    "projects.title": "Mis creaciones",
    "projects.subtitle":
      "Productos en producción, proyectos open-source y misiones cliente.",
    "projects.category.design": "Diseño",
    "projects.cta.live": "Live",
    "projects.cta.code": "Código",
    "projects.empty": "Aún no hay proyectos en esta categoría — stay tuned!",

    "project.mandat.title": "Mandat",
    "project.mandat.subtitle": "Civic Tech francesa",
    "project.mandat.description":
      "Mandat es el único hub que centraliza en tiempo real los datos brutos de la Asamblea Nacional, los análisis contextuales de CIVIX y la información de asistencia para ofrecer una lectura simplificada y ultrarrápida de la actividad legislativa, todo en una interfaz diseñada para los usos móviles actuales.",
    "project.mandat.tags": "TanStack Start, React 19, Turso, Groq AI, Tailwind v4, Vercel",
    "project.mandat.status": "Featured",
    "project.mandat.categoryId": "civictech",

    "project.cygnis.title": "Cygnis AI Studio",
    "project.cygnis.subtitle": "Plataforma IA",
    "project.cygnis.description":
      "Cygnis AI Studio ofrece una API completa del modelo Cygnis A1, permitiendo a los desarrolladores integrar fácilmente las capacidades de CygnisAI en sus propias aplicaciones, sitios web o proyectos SaaS. El repositorio contiene la documentación y las herramientas necesarias para aprovechar el poder del modelo a través de solicitudes API.",
    "project.cygnis.tags": "Next.js, React, TypeScript, Firebase, Google Gemini",
    "project.cygnis.status": "En producción",
    "project.cygnis.categoryId": "ai",

    "project.procivi.title": "Procivi",
    "project.procivi.subtitle": "Generador de CV IA",
    "project.procivi.description":
      "Procivi es una aplicación de generación de CV y cartas de presentación inteligentes gracias a la IA. El usuario puede crear su CV manualmente o importar automáticamente sus datos a través de LinkedIn. El objetivo: simplificar la creación de documentos profesionales personalizados, claros e impactantes.",
    "project.procivi.tags": "Vite, React, TypeScript, Tailwind CSS, Gemini",
    "project.procivi.status": "Open source",
    "project.procivi.categoryId": "productivity",

    "project.omnimcp.title": "OmniMCP",
    "project.omnimcp.subtitle": "Developer Tooling",
    "project.omnimcp.description":
      "The Universal MCP Gateway — One Entry Point to Rule All Your AI Tools",
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

    /* projects — Cycode */
    "project.cycode.title": "Cycode",
    "project.cycode.subtitle": "Asistente IA",
    "project.cycode.description":
      "Asistente de codificación IA avanzado",
    "project.cycode.categoryId": "ai",

    /* projects — HumanizerAI */
    "project.humanizer.title": "HumanizerAI",
    "project.humanizer.subtitle": "Humanización de texto IA",
    "project.humanizer.description":
      "HumanizerAI es una herramienta de IA diseñada para humanizar textos generados automáticamente. Reformula, fluidifica y adapta el tono de los escritos para que parezcan naturales y auténticos, conservando su significado. La IA también puede analizar la coherencia, la tonalidad y el estilo de un texto para mejorarlo.",
    "project.humanizer.categoryId": "ai",

    /* projects — Portfolio */
    "project.portfolio.title": "Simonc44",
    "project.portfolio.subtitle": "Portafolio",
    "project.portfolio.description":
      "Portafolio es el perfil en línea de Simon Chusseau, que reúne sus proyectos, habilidades y logros en los campos de la inteligencia artificial, el desarrollo web y las aplicaciones inteligentes. Este repositorio sirve como una vitrina interactiva para presentar su trayectoria y creaciones.",
    "project.portfolio.categoryId": "design",

    /* projects — Reddit MCP */
    "project.reddit-mcp.title": "Reddit MCP Server",
    "project.reddit-mcp.subtitle": "Developer Tooling",
    "project.reddit-mcp.description":
      "A Model Context Protocol (MCP) server that lets AI assistants like Claude search, browse, and analyze Reddit in real-time using Playwright web scraping.",
    "project.reddit-mcp.categoryId": "devtools",

    /* projects — Cygnis SDK */
    "project.cygnis-sdk.title": "CygnisAI SDK Python",
    "project.cygnis-sdk.subtitle": "Python SDK",
    "project.cygnis-sdk.description":
      "Official Python SDK for the CygnisAI API",
    "project.cygnis-sdk.categoryId": "devtools",

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
    "footer.copyright": "© {year} Simon Chusseau. Todos los derechos reservados.",
    "footer.description": "Creative Developer & AI Engineer. Construyendo productos en la intersección del diseño, el código y la inteligencia artificial.",
    "footer.navTitle": "Navegación",
    "footer.home": "Inicio",
    "footer.process": "Mi proceso",
    "footer.creations": "Mis creaciones",
    "footer.contact": "Contacto",
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
