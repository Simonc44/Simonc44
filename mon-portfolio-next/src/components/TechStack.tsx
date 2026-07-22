"use client";

import { type ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ReactIcon,
  TypeScriptIcon,
  NextJsIcon,
  TailwindIcon,
  FirebaseIcon,
  NodeJsIcon,
  ViteIcon,
  DatabaseIcon,
  GeminiIcon,
  GroqIcon,
  TanStackIcon,
  VercelIcon,
} from "@/components/tech-stack-icons";
import { useIntl } from "@/providers/intl-provider";

interface Tech {
  name: string;
  icon: ComponentType<{ className?: string }>;
}

const TECHNOLOGIES: Tech[] = [
  { name: "React", icon: ReactIcon },
  { name: "TypeScript", icon: TypeScriptIcon },
  { name: "Next.js", icon: NextJsIcon },
  { name: "Tailwind CSS", icon: TailwindIcon },
  { name: "Vite", icon: ViteIcon },
  { name: "TanStack", icon: TanStackIcon },
  { name: "Node.js", icon: NodeJsIcon },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "Turso / SQLite", icon: DatabaseIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "Google Gemini", icon: GeminiIcon },
  { name: "Groq", icon: GroqIcon },
];

const TRIPLED = [...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES];

/* ──────────── Single monochrome logo element ──────────── */

const LogoElement = ({ tech }: { tech: Tech }) => {
  const Icon = tech.icon;

  return (
    <span className="flex items-center justify-center">
      <Icon className="h-12 w-auto opacity-80 transition-opacity duration-500 hover:opacity-100" />
      <span className="sr-only">{tech.name}</span>
    </span>
  );
};

/* ──────────── Infinite marquee ──────────── */

const Marquee = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-16 md:gap-24">
        {TECHNOLOGIES.map((tech) => (
          <LogoElement key={tech.name} tech={tech} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-16 md:gap-24"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {TRIPLED.map((tech, i) => (
          <LogoElement key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </motion.div>
    </div>
  );
};

/* ──────────── Section component ──────────── */

/**
 * TechStack — Minimalist monochrome logo marquee.
 *
 * Style inspired by Lovable / Vercel / Linear.
 * - No containers, badges, borders, or backgrounds
 * - Logos are monochrome (white/gray) with smooth hover transition
 * - Gradient fade mask on edges
 * - Centered title above
 */
export function TechStack() {
  const { t } = useIntl();

  return (
    <section className="relative pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-center text-lg font-medium text-neutral-200 md:text-xl">
          {t["tech.title"]}
        </h2>

        <div>
          <Marquee />
        </div>
      </div>
    </section>
  );
}
