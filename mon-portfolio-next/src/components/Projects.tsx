"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { useIntl, type Dictionary } from "@/providers/intl-provider";
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

/** Map repo name → image path in /public/ */
const REPO_IMAGES: Record<string, string> = {
  "mandat": "/mandat.png",
  "Cygnis-AI-studio": "/Cygnis-AI-studio.png",
  "Procivi": "/Procivi.png",
  "Simonc44": "/Simonc44.png",
};

/** Generate a gradient for repo preview image based on name */
function repoGradient(name: string): string {
  const colors = [
    "from-purple-600 via-pink-500 to-amber-400",
    "from-emerald-500 via-teal-500 to-cyan-400",
    "from-blue-600 via-indigo-500 to-violet-400",
    "from-rose-500 via-red-400 to-orange-300",
    "from-sky-500 via-blue-400 to-indigo-300",
    "from-teal-500 via-green-400 to-emerald-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Map repo name → translation key prefix for description lookup. */
const REPO_DESC_KEYS: Record<string, keyof Dictionary> = {
  "mandat": "project.mandat.description",
  "Cygnis-AI-studio": "project.cygnis.description",
  "cycode": "project.cycode.description",
  "OmniMCP": "project.omnimcp.description",
  "Procivi": "project.procivi.description",
  "HumanizerAI": "project.humanizer.description",
  "Homa-RH": "project.homa.description",
  "Simonc44": "project.portfolio.description",
  "Reddit-MCP-Server": "project.reddit-mcp.description",
  "cygnisai_sdk_python": "project.cygnis-sdk.description",
};

function RepoCard({ repo, t }: { repo: GithubRepo; t: Dictionary }) {
  const descKey = REPO_DESC_KEYS[repo.name];
  const description = descKey ? t[descKey] : repo.description;
  const [imgError, setImgError] = useState(false);
  const repoImage = REPO_IMAGES[repo.name];
  const hasImage = Boolean(repoImage) && !imgError;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8,
      }}
      className="group"
    >
      {/* ── Clickable image / preview ── */}      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block aspect-video overflow-hidden rounded-xl cursor-pointer ${repoGradient(repo.name)}`}
      >
        {hasImage ? (
          <img
            src={repoImage}
            alt={`${repo.name} preview`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          /* Gradient placeholder fallback */
          <div
            className={`relative h-full w-full bg-gradient-to-br ${repoGradient(repo.name)} transition-transform duration-300 ease-out group-hover:scale-[1.02]`}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            }} />

            {/* Repo name initial as large letter */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-white/10 select-none" aria-hidden="true">
              {repo.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </a>

      {/* ── Title & description below image ── */}
      <h3 className="mt-3 font-semibold text-lg text-white">
        {repo.name}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
          {description}
        </p>
      )}
    </motion.div>
  );
}


export function Projects({ repos }: ProjectsProps) {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  const displayRepos = useMemo(() => {
    if (!repos) return [];
    const own = repos.filter((r) => !r.fork && !r.archived);

    const featured = FEATURED_NAMES.flatMap((name) => {
      const r = own.find((r) => r.name === name);
      return r ? [r] : [];
    });
    const rest = own.filter((r) => !FEATURED_NAMES.includes(r.name));
    return [...featured, ...rest].slice(0, 9);
  }, [repos]);



  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      ref={ref}
      className="relative pt-16 pb-0 md:pt-24 md:pb-0"
    >
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-3xl"
        >
          <h2
            id="projects-title"
            className="text-5xl font-display font-bold leading-tight tracking-[-0.03em] md:text-7xl"
          >
            {t["projects.title"]}
          </h2>
          <p className="mt-6 text-xl text-muted-foreground font-light">
            {t["projects.subtitle"]}
          </p>
        </motion.div>

        {/* Projects Grid — 4 columns */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence mode="popLayout">
            {displayRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} t={t} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
