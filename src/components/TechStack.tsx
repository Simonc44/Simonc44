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
import SectionHeader from "@/components/primitives/SectionHeader";
import InfiniteMarquee from "@/components/primitives/InfiniteMarquee";

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

const TechChip = ({ tech }: { tech: Tech }) => {
  const Icon = tech.icon;
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-card/[0.04] backdrop-blur-md pl-3 pr-5 py-2.5 whitespace-nowrap hover:border-primary/30 transition-colors">
      <Icon className={`w-5 h-5 ${tech.color}`} />
      <span className="text-sm font-medium text-foreground/90">
        {tech.name}
      </span>
    </div>
  );
};

const MarqueeRow = ({
  items,
  reverse = false,
  speed = 35,
}: {
  items: Tech[];
  reverse?: boolean;
  speed?: number;
}) => (
  <InfiniteMarquee speed={speed} reverse={reverse} gap={20} className="py-2">
    {items.map((tech) => (
      <TechChip key={`${tech.name}-${reverse ? "r" : "f"}`} tech={tech} />
    ))}
  </InfiniteMarquee>
);

const TechStack = () => {
  return (
    <section
      id="tech"
      className="py-24 px-4 relative overflow-hidden space-y-12"
    >
      <div className="absolute inset-0 bg-gradient-radial from-primary/[0.06] via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <SectionHeader
          index="02 / Stack"
          title="The stack I ship with."
          description="Tools I reach for to bring ideas to production. The list grows every sprint — try not to blink."
        />
      </div>

      {/* Two marquee rows */}
      <div className="relative space-y-3">
        <MarqueeRow items={FRONTEND} speed={32} />
        <MarqueeRow items={BACKEND_AI} reverse speed={42} />
      </div>

      {/* Subtle footer mark */}
      <FadeIn delay={0.2}>
        <div className="container max-w-6xl mx-auto pt-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-center">
            12+ technologies · always evolving
          </p>
        </div>
      </FadeIn>
    </section>
  );
};

// Local FadeIn shortcut to avoid an extra file import — Framer-powered
const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default TechStack;
