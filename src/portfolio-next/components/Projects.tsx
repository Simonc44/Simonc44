"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import {
  useIntl,
  PROJECT_IDS,
  CATEGORY_IDS,
  type ProjectId,
  type CategoryId,
  type FilterId,
  type Dictionary,
} from "@/providers/intl-provider";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";

/** Static, language-agnostic project metadata. Strings come from i18n. */
interface ProjectMeta {
  id: ProjectId;
  liveUrl?: string;
  codeUrl?: string;
  previewUrl?: string;
}

const PROJECT_META: ProjectMeta[] = [
  {
    id: "mandat",
    liveUrl: "https://mandat-psi.vercel.app",
    codeUrl: "https://github.com/Simonc44/mandat",
  },
  {
    id: "cygnis",
    liveUrl: "https://cygnis-ai.vercel.app",
    codeUrl: "https://github.com/Simonc44/cygnis",
  },
  {
    id: "procivi",
    liveUrl: "https://procivi-08704062.web.app/",
    codeUrl: "https://github.com/Simonc44/Procivi",
  },
  {
    id: "omnimcp",
    codeUrl: "https://github.com/Simonc44/OmniMCP",
  },
  {
    id: "homa",
    liveUrl: "https://homa-rh.vercel.app",
  },
];

/**
 * Typed accessor. Each project.<id>.categoryId is one of the CATEGORY_IDS
 * literals. If a future translation drops a `categoryId`, we skip the
 * project in the grid and warn in dev — silent failures hide data
 * regressions and aren't worth the UX cost.
 */
function getCategoryId(t: Dictionary, id: ProjectId): CategoryId | undefined {
  const raw = t[`project.${id}.categoryId` as const];
  return (CATEGORY_IDS as readonly CategoryId[]).includes(raw)
    ? (raw as CategoryId)
    : undefined;
}

const missingWarned = new Set<string>();
function warnIfMissing(id: ProjectId, reason: string) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "production") return;
  const key = `${id}:${reason}`;
  if (missingWarned.has(key)) return;
  missingWarned.add(key);
  // eslint-disable-next-line no-console
  console.warn(`[portfolio-next/Projects] ${id} skipped — ${reason}.`);
}

/**
 * Filter registry derived from CATEGORY_IDS so the provider
 * is the single source of truth. The synthetic \"all\" filter is
 * prepended manually.
 */
const FILTERS: ReadonlyArray<{
  id: FilterId;
  labelKey: "projects.category.all" | `projects.category.${CategoryId}`;
}> = [
  { id: "all", labelKey: "projects.category.all" },
  ...CATEGORY_IDS.map((id) => ({
    id,
    labelKey: `projects.category.${id}` as const,
  })),
];

/** Safe tag splat — returns [] if a translation drops the key. */
function readTagList(t: Dictionary, id: ProjectId): string[] {
  const raw = t[`project.${id}.tags` as const];
  if (typeof raw !== "string" || raw.length === 0) return [];
  return raw.split(",").map((tag) => tag.trim()).filter(Boolean);
}

/**
 * Projects — filter pills + N cards. Every user-facing string is
 * rendered through `useIntl()`. Filtering compares against stable
 * `categoryId` enums (never the localised display string), so EN/FR/ES
 * users all see the same project set.
 */
export function Projects() {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  const [active, setActive] = useState<FilterId>("all");

  const projectsWithCategory = useMemo(
    () =>
      PROJECT_META.flatMap((meta) => {
        const catId = getCategoryId(t, meta.id);
        if (!catId) {
          warnIfMissing(meta.id, "missing project.<id>.categoryId");
          return [];
        }
        return [{ meta, categoryId: catId }];
      }),
    [t]
  );

  const filtered = useMemo(
    () =>
      active === "all"
        ? projectsWithCategory
        : projectsWithCategory.filter((p) => p.categoryId === active),
    [active, projectsWithCategory]
  );

  const counts = useMemo(() => {
    const map: Record<FilterId, number> = {
      all: projectsWithCategory.length,
      ai: 0,
      civictech: 0,
      devtools: 0,
      productivity: 0,
      design: 0,
    };
    for (const p of projectsWithCategory) {
      map[p.categoryId] += 1;
    }
    return map;
  }, [projectsWithCategory]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      ref={ref}
      className="relative py-24 md:py-32"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
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
        </motion.div>

        {/* Filter pills */}
        <div
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Project categories"
        >
          {FILTERS.map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                id={`projects-tab-${filter.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`projects-${filter.id}-panel`}
                onClick={() => setActive(filter.id)}
                className="relative rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeProjectFilter"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/15 border border-primary/30"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t[filter.labelKey]}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {counts[filter.id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          id={`projects-${active}-panel`}
          role="tabpanel"
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(({ meta }) => (
              <ProjectCard key={meta.id} meta={meta} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-12 text-center text-sm text-muted-foreground"
              role="status"
              aria-atomic="true"
            >
              {t["projects.empty"]}{" "}
              <Sparkles className="inline-block h-4 w-4" aria-hidden="true" />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────── Card ─────────── */

function ProjectCard({ meta }: { meta: ProjectMeta }) {
  const { t } = useIntl();
  const tags = readTagList(t, meta.id);

  // Dev-only warning: a missing tag list silently produces an empty
  // chip strip. Fire once per (id, reason) via the parent’s `useEffect`
  // — never inside render.
  useEffect(() => {
    if (tags.length === 0) {
      warnIfMissing(meta.id, "missing project.<id>.tags");
    }
  }, [tags.length, meta.id]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card/[0.04] backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]"
    >
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.04] px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {t[`project.${meta.id}.subtitle` as const]}
        </p>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {t[`project.${meta.id}.status` as const]}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-6 py-6">
        <h3 className="text-2xl font-display font-semibold tracking-tight">
          {t[`project.${meta.id}.title` as const]}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t[`project.${meta.id}.description` as const]}
        </p>

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag, i) => (
              // dual key index avoids collision when two
              // projects share tags across languages.
              <span
                key={`${meta.id}-${i}-${tag}`}
                className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-0.5 text-[11px] font-mono text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(meta.liveUrl || meta.codeUrl) && (
          <div className="flex gap-2 pt-2">
            {meta.liveUrl && (
              <Button
                size="sm"
                className="flex-1 bg-gradient-primary shadow-glow transition-all hover:brightness-110"
                asChild
              >
                <a
                  href={meta.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t[`project.${meta.id}.title` as const]}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {t["projects.cta.live"]}
                </a>
              </Button>
            )}
            {meta.codeUrl && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-primary/40 hover:bg-primary/10"
                asChild
              >
                <a
                  href={meta.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code — ${t[`project.${meta.id}.title` as const]}`}
                >
                  <Github className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {t["projects.cta.code"]}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
