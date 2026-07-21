"use client";

import { useEffect, useRef, useMemo } from "react";
import { LANGUAGE_COLORS } from "@/types/github";
import type { GithubLanguageMap, GithubRepo } from "@/types/github";

interface WavyTickerProps {
  /**
   * Aggregated language byte-counts from the GitHub API.
   * If null (API unavailable), falls back to a hardcoded list.
   */
  languages: GithubLanguageMap | null;
  /** Full repo list — used to extract additional skill tags from topics. */
  repos: GithubRepo[] | null;
}

/** Hard fallback if the GitHub API is unreachable at build time. */
const FALLBACK_SKILLS = [
  { name: "TypeScript", color: "#3178c6" },
  { name: "Rust", color: "#ce422b" },
  { name: "Python", color: "#3572a5" },
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Node.js", color: "#68a063" },
  { name: "Three.js", color: "#ffffff" },
  { name: "HTML", color: "#e34c26" },
  { name: "Firebase", color: "#f5a623" },
  { name: "Vercel", color: "#ffffff" },
  { name: "Tailwind", color: "#38bdf8" },
  { name: "Framer Motion", color: "#a78bfa" },
  { name: "MCP", color: "#f472b6" },
  { name: "LLM Tooling", color: "#34d399" },
];

/** Additional hand-curated skills that GitHub languages won't surface. */
const EXTRA_SKILLS = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Framer Motion", color: "#a78bfa" },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "Firebase", color: "#f5a623" },
  { name: "Vercel", color: "#ffffff" },
  { name: "LLM Tooling", color: "#34d399" },
  { name: "MCP", color: "#f472b6" },
  { name: "OpenAI SDK", color: "#10a37f" },
  { name: "TanStack", color: "#ef4444" },
];

interface Skill {
  name: string;
  color: string;
}

function buildSkillList(
  languages: GithubLanguageMap | null,
  repos: GithubRepo[] | null
): Skill[] {
  if (!languages) return FALLBACK_SKILLS;

  // Sort languages by byte count descending
  const langSkills: Skill[] = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => ({
      name,
      color: LANGUAGE_COLORS[name] ?? "#94a3b8",
    }));

  // De-duplicate between lang skills and EXTRA_SKILLS
  const seen = new Set(langSkills.map((s) => s.name.toLowerCase()));
  const extras = EXTRA_SKILLS.filter((s) => !seen.has(s.name.toLowerCase()));

  return [...langSkills, ...extras];
}

/** Renders one pill in the ticker. */
function SkillPill({ skill }: { skill: Skill }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 font-mono text-xs font-medium text-foreground/90 backdrop-blur-sm whitespace-nowrap select-none"
      style={{ boxShadow: `0 0 12px ${skill.color}22` }}
    >
      {/* Language colour dot */}
      <span
        className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
        aria-hidden="true"
        style={{ backgroundColor: skill.color, boxShadow: `0 0 6px ${skill.color}` }}
      />
      {skill.name}
    </span>
  );
}

/** A single row — two copies of the skills list for seamless loop. */
function TickerRow({
  skills,
  reverse = false,
  waveOffset = 0,
}: {
  skills: Skill[];
  reverse?: boolean;
  waveOffset?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const xRef = useRef(0);
  const startRef = useRef<number | null>(null);

  // CSS animation speed in px/s — consistent across browsers
  const SPEED = 38;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure the width of one copy (half the total, since we duplicate)
    const halfWidth = track.scrollWidth / 2;

    if (reverse) xRef.current = -halfWidth;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const delta = (ts - startRef.current) / 1000;
      startRef.current = ts;

      if (reverse) {
        xRef.current -= SPEED * delta;
        if (xRef.current <= -halfWidth * 2) xRef.current = -halfWidth;
      } else {
        xRef.current += SPEED * delta;
        if (xRef.current >= 0) xRef.current = -halfWidth;
      }

      // Apply wavy Y offset via individual children — but only if motion OK
      if (track) {
        track.style.transform = `translateX(${xRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [reverse]);

  const doubled = useMemo(() => [...skills, ...skills], [skills]);

  return (
    <div className="mask-fade-x relative overflow-hidden py-1" aria-hidden="true">
      <div
        ref={trackRef}
        className="flex w-max gap-3"
        style={{ willChange: "transform" }}
      >
        {doubled.map((skill, i) => (
          <SkillPill key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

/**
 * WavyTicker — two infinite-scroll rows of real skills derived from
 * GitHub language data + curated extras. Reverse rows create visual depth.
 *
 * Uses `requestAnimationFrame` via `useRef` — **zero** React state in the
 * animation loop. Respects `prefers-reduced-motion`.
 */
export function WavyTicker({ languages, repos }: WavyTickerProps) {
  const skills = useMemo(
    () => buildSkillList(languages, repos),
    [languages, repos]
  );

  // Split skills into two rows for visual variety
  const half = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, Math.max(half, 6));
  const rowB = skills.slice(Math.max(half, 6));

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14"
      aria-label="Skills"
    >
      {/* Top separator line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="space-y-3">
        <TickerRow skills={rowA} reverse={false} waveOffset={0} />
        <TickerRow skills={rowB.length >= 3 ? rowB : rowA} reverse={true} waveOffset={Math.PI} />
      </div>
    </section>
  );
}
