"use client";

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
import { useReveal } from "@/hooks/useReveal";

interface Tech {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FRONTEND: Tech[] = [
  { name: "React", icon: ReactIcon, color: "text-sky-300" },
  { name: "TypeScript", icon: TypeScriptIcon, color: "text-blue-400" },
  { name: "Next.js", icon: NextJsIcon, color: "text-foreground" },
  { name: "Tailwind CSS", icon: TailwindIcon, color: "text-cyan-300" },
  { name: "Vite", icon: ViteIcon, color: "text-violet-300" },
  { name: "TanStack", icon: TanStackIcon, color: "text-rose-300" },
];

const BACKEND_AI: Tech[] = [
  { name: "Node.js", icon: NodeJsIcon, color: "text-green-400" },
  { name: "Firebase", icon: FirebaseIcon, color: "text-amber-400" },
  { name: "Turso / SQLite", icon: DatabaseIcon, color: "text-teal-300" },
  { name: "Vercel", icon: VercelIcon, color: "text-foreground" },
  { name: "Google Gemini", icon: GeminiIcon, color: "text-blue-300" },
  { name: "Groq", icon: GroqIcon, color: "text-orange-300" },
];

const Chip = ({ tech }: { tech: Tech }) => {
  const Icon = tech.icon;
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-card/[0.04] py-2.5 pl-3 pr-5 whitespace-nowrap backdrop-blur-md transition-colors hover:border-primary/30">
      <Icon className={`h-5 w-5 ${tech.color}`} aria-hidden="true" />
      <span className="text-sm font-medium text-foreground/90">{tech.name}</span>
    </div>
  );
};

interface MarqueeRowProps {
  items: Tech[];
  reverse?: boolean;
  speed?: number;
  ariaLabel: string;
}

const MarqueeRow = ({ items, reverse = false, speed = 28, ariaLabel }: MarqueeRowProps) => {
  const shouldReduceMotion = useReducedMotion();
  const direction = reverse ? ["0%", "-50%"] : ["-50%", "0%"];

  if (shouldReduceMotion) {
    return (
      <div
        className="flex flex-wrap justify-center gap-3"
        role="list"
        aria-label={ariaLabel}
      >
        {items.map((tech) => (
          <Chip key={tech.name} tech={tech} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="mask-fade-x relative overflow-hidden"
      role="list"
      aria-label={ariaLabel}
    >
      <motion.div
        className="flex w-max gap-5"
        animate={{ x: direction }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((tech, i) => (
          <Chip key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </motion.div>
    </div>
  );
};

/**
 * TechStack — two infinite marquees. No SVG icons are localised,
 * but the row labels and section copy come from `useIntl()`.
 */
export function TechStack() {
  const { t } = useIntl();
  const { ref, isInView } = useReveal<HTMLDivElement>({ margin: "-100px" });

  return (
    <section
      id="tech"
      aria-labelledby="tech-title"
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
            {t["tech.eyebrow"]}
          </p>
          <h2
            id="tech-title"
            className="text-4xl font-display font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl"
          >
            {t["tech.title"]}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t["tech.subtitle"]}
          </p>
        </motion.div>

        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true">▸</span>
            {t["tech.row.frontend"]}
          </div>
          <MarqueeRow items={FRONTEND} ariaLabel={t["tech.row.frontend"]} />
          <div className="mt-6 mb-2 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true">▸</span>
            {t["tech.row.backend"]}
          </div>
          <MarqueeRow items={BACKEND_AI} reverse speed={36} ariaLabel={t["tech.row.backend"]} />
        </div>
      </div>
    </section>
  );
}
