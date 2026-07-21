"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star, GitFork, Clock } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useIntl } from "@/providers/intl-provider";
import { LANGUAGE_COLORS } from "@/types/github";
import type { GithubRepo } from "@/types/github";

interface ProjectsProps {
  /** Live repo list from server-side GitHub fetch. Null = API unavailable. */
  repos: GithubRepo[] | null;
}

/** Repos to always highlight, in display order. */
const FEATURED_NAMES = [
  "mandat",
  "Cygnis-AI-studio",
  "cycode",
  "OmniMCP",
  "Procivi",
  "HumanizerAI",
];

type FilterId = "all" | "ai" | "civictech" | "devtools" | "productivity";

interface FilterDef {
  id: FilterId;
  labelKey:
    | "projects.category.all"
    | "projects.category.ai"
    | "projects.category.civictech"
    | "projects.category.devtools"
    | "projects.category.productivity";
  match: (repo: GithubRepo) => boolean;
}

const FILTERS: FilterDef[] = [
  { id: "all", labelKey: "projects.category.all", match: () => true },
  {
    id: "ai",
    labelKey: "projects.category.ai",
    match: (r) =>
      /cygnis|humanizer|ai|llm|gpt/i.test(r.name + " " + (r.description ?? "")),
  },
  {
    id: "civictech",
    labelKey: "projects.category.civictech",
    match: (r) => /mandat|civic|assembl/i.test(r.name + " " + (r.description ?? "")),
  },
  {
    id: "devtools",
    labelKey: "projects.category.devtools",
    match: (r) =>
      /mcp|sdk|cycode|omni|tool|ext/i.test(r.name + " " + (r.description ?? "")),
  },
  {
    id: "productivity",
    labelKey: "projects.category.productivity",
    match: (r) => /procivi|cv|resume/i.test(r.name + " " + (r.description ?? "")),
  },
];

/** Format a GitHub date as "Il y a N jours / mois". */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Aujourd'hui";
  if (days < 30) return `Il y a ${days}j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months}m`;
  return `Il y a ${Math.floor(months / 12)}a`;
}

/** Single repo card. */
function RepoCard({ repo }: { repo: GithubRepo }) {
  const langColor = repo.language
    ? (LANGUAGE_COLORS[repo.language] ?? "#94a3b8")
    : "#94a3b8";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.04] hover:shadow-[0_0_50px_-12px_hsl(263_75%_68%/0.5)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] px-5 py-3.5">
        <div className="flex items-center gap-2">
          {/* Language indicator */}
          {repo.language && (
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-white/20"
              aria-hidden="true"
              style={{
                backgroundColor: langColor,
                boxShadow: `0 0 8px ${langColor}88`,
              }}
            />
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {repo.language ?? "—"}
          </span>
        </div>

        {/* Stars */}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-300">
            <Star className="h-3 w-3" aria-hidden="true" />
            {repo.stargazers_count}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <h3 className="text-xl font-display font-semibold tracking-tight text-foreground group-hover:text-gradient transition-all duration-300">
          {repo.name}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {repo.description ?? "—"}
        </p>

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-3 text-[11px] font-mono text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" aria-hidden="true" />
            {repo.forks_count}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {timeAgo(repo.pushed_at)}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex gap-2 pt-1">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Voir ${repo.name} en live`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-mono font-semibold text-primary-foreground shadow-glow-sm transition-all duration-300 hover:brightness-110"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live
            </a>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Code source de ${repo.name}`}
            className={`flex items-center justify-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-mono text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground ${repo.homepage ? "" : "flex-1"}`}
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            Code
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Projects — Live GitHub repos with filter pills.
 *
 * Shows featured repos first, filtered by category. Falls back to
 * hardcoded static data if `repos` prop is null (API unavailable).
 */
export function Projects({ repos }: ProjectsProps) {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });
  const [active, setActive] = useState<FilterId>("all");

  // Build the display list: featured repos first, then rest, limited to 9
  const displayRepos = useMemo(() => {
    if (!repos) return [];
    const own = repos.filter((r) => !r.fork && !r.archived);

    // Put featured repos first
    const featured = FEATURED_NAMES.flatMap((name) => {
      const r = own.find((r) => r.name === name);
      return r ? [r] : [];
    });
    const rest = own.filter((r) => !FEATURED_NAMES.includes(r.name));
    return [...featured, ...rest].slice(0, 9);
  }, [repos]);

  const filtered = useMemo(() => {
    const filter = FILTERS.find((f) => f.id === active);
    if (!filter || active === "all") return displayRepos;
    return displayRepos.filter((r) => filter.match(r));
  }, [active, displayRepos]);

  const counts = useMemo(() => {
    const map = {} as Record<FilterId, number>;
    for (const f of FILTERS) {
      map[f.id] =
        f.id === "all"
          ? displayRepos.length
          : displayRepos.filter((r) => f.match(r)).length;
    }
    return map;
  }, [displayRepos]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      ref={ref}
      className="relative py-24 md:py-32"
    >
      {/* Section ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary/80">
            {t["projects.eyebrow"]}
          </p>
          <h2
            id="projects-title"
            className="text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl"
          >
            {t["projects.title"]}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t["projects.subtitle"]}
          </p>

          {/* Live indicator */}
          {repos && (
            <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground/60">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Données GitHub en direct · {repos.length} dépôts publics
            </p>
          )}
        </motion.div>

        {/* Filter pills */}
        <div
          className="mb-10 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Catégories de projets"
        >
          {FILTERS.filter((f) => counts[f.id] > 0 || f.id === "all").map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                id={`projects-tab-${filter.id}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter.id)}
                className="relative rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeProjectFilter"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/15 border border-primary/35"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {t[filter.labelKey]}
                  <span className="ml-1.5 text-[10px] opacity-55">
                    {counts[filter.id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          id={`projects-${active}-panel`}
          role="tabpanel"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center text-sm text-muted-foreground"
              role="status"
            >
              {t["projects.empty"]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/Simonc44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-6 py-3 font-mono text-sm text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:text-foreground hover:bg-white/[0.07]"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Voir tous mes projets sur GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
