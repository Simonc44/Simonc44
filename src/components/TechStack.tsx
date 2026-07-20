import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
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

const TECHNOLOGIES = [
  { name: "React", icon: ReactIcon, color: "text-sky-400", bg: "bg-sky-400/10" },
  { name: "TypeScript", icon: TypeScriptIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Next.js", icon: NextJsIcon, color: "text-foreground", bg: "bg-foreground/10" },
  { name: "Tailwind CSS", icon: TailwindIcon, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { name: "Firebase", icon: FirebaseIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Node.js", icon: NodeJsIcon, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Vite", icon: ViteIcon, color: "text-violet-400", bg: "bg-violet-400/10" },
  { name: "TanStack", icon: TanStackIcon, color: "text-rose-400", bg: "bg-rose-400/10" },
  { name: "Turso / SQLite", icon: DatabaseIcon, color: "text-teal-400", bg: "bg-teal-400/10" },
  { name: "Vercel", icon: VercelIcon, color: "text-foreground", bg: "bg-foreground/10" },
  { name: "Google Gemini", icon: GeminiIcon, color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Groq", icon: GroqIcon, color: "text-orange-400", bg: "bg-orange-400/10" },
];

const TechStack = () => {
  return (
    <section id="tech" className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <FadeIn>
            <p className="text-sm font-mono tracking-widest uppercase text-primary/70">
              Tools of the trade
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-medium">
              My <span className="text-gradient">Tech Stack</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Technologies I reach for to bring ideas to production.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TECHNOLOGIES.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <FadeIn key={tech.name} delay={index * 0.05} direction="up">
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 flex flex-col items-center gap-4 hover:border-primary/30 hover:bg-card/80 transition-colors duration-300 h-full"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-xl ${tech.bg} ${tech.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                  <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
