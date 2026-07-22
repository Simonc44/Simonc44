"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  TypeScriptIcon,
  RustIcon,
  PythonIcon,
  ReactIcon,
  NextJsIcon,
  NodeJsIcon,
  ThreeJsIcon,
  TailwindIcon,
  FirebaseIcon,
  VercelIcon,
  FramerIcon,
  McpIcon,
  LlmIcon,
  OpenAiIcon,
  TanStackIcon,
} from "@/components/tech-stack-icons";
import type { GithubLanguageMap } from "@/types/github";

interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Hard fallback if the GitHub API is unreachable at build time. */
const FALLBACK_SKILLS: Skill[] = [
  { name: "TypeScript", icon: TypeScriptIcon },
  { name: "Rust", icon: RustIcon },
  { name: "Python", icon: PythonIcon },
  { name: "React", icon: ReactIcon },
  { name: "Next.js", icon: NextJsIcon },
  { name: "Node.js", icon: NodeJsIcon },
  { name: "Three.js", icon: ThreeJsIcon },
  { name: "Tailwind CSS", icon: TailwindIcon },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "Framer Motion", icon: FramerIcon },
  { name: "MCP", icon: McpIcon },
  { name: "LLM Tooling", icon: LlmIcon },
  { name: "OpenAI", icon: OpenAiIcon },
];

/** Additional hand-curated skills that GitHub languages won't surface. */
const EXTRA_SKILLS: Skill[] = [
  { name: "React", icon: ReactIcon },
  { name: "Next.js", icon: NextJsIcon },
  { name: "Three.js", icon: ThreeJsIcon },
  { name: "Framer Motion", icon: FramerIcon },
  { name: "Tailwind CSS", icon: TailwindIcon },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "LLM Tooling", icon: LlmIcon },
  { name: "MCP", icon: McpIcon },
  { name: "OpenAI", icon: OpenAiIcon },
  { name: "TanStack", icon: TanStackIcon },
];

// Language name → brand icon mapping for dynamic languages from GitHub
function getIconForLanguage(lang: string): React.ComponentType<{ className?: string }> {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    TypeScript: TypeScriptIcon,
    Rust: RustIcon,
    Python: PythonIcon,
    JavaScript: TypeScriptIcon, // fallback to TS style
  };
  return map[lang] ?? ReactIcon; // fallback
}

function buildSkillList(
  languages: GithubLanguageMap | null
): Skill[] {
  if (!languages) return FALLBACK_SKILLS;

  const langSkills: Skill[] = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => ({
      name,
      icon: getIconForLanguage(name),
    }));

  // De-duplicate
  const seen = new Set(langSkills.map((s) => s.name.toLowerCase()));
  const extras = EXTRA_SKILLS.filter((s) => !seen.has(s.name.toLowerCase()));

  return [...langSkills, ...extras];
}

/** Renders one pill in the ticker with brand icon. */
function SkillPill({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 font-mono text-xs font-medium text-foreground/80 backdrop-blur-sm whitespace-nowrap select-none transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.06] hover:text-white">
      <Icon className="h-4 w-4 flex-shrink-0" />
      {skill.name}
    </span>
  );
}

/** A single row — multiple copies of the skills list for seamless loop. */
function TickerRow({
  skills,
  reverse = false,
}: {
  skills: Skill[];
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const xRef = useRef(0);
  const startRef = useRef<number | null>(null);

  const SPEED = 35;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

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
    <div className="mask-fade-x relative overflow-hidden py-2" aria-hidden="true">
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
 * GitHub language data + curated extras. Uses official brand SVG icons.
 */
export function WavyTicker({ languages }: { languages: GithubLanguageMap | null }) {
  const skills = useMemo(
    () => buildSkillList(languages),
    [languages]
  );

  const half = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, Math.max(half, 6));
  const rowB = skills.slice(Math.max(half, 6));

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14"
      aria-label="Skills"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="space-y-3">
        <TickerRow skills={rowA} reverse={false} />
        <TickerRow skills={rowB.length >= 3 ? rowB : rowA} reverse={true} />
      </div>
    </section>
  );
}

/** @deprecated Use inline type instead. */
export type WavyTickerProps = {
  languages: GithubLanguageMap | null;
};
