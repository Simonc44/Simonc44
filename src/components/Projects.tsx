import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";

type Category = "All" | "AI" | "Civic Tech" | "DevTools" | "Design" | "Productivity";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  preview?: string;
  links: { live?: string; github?: string };
  accent: string;
  category: Exclude<Category, "All">;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "Mandat",
    subtitle: "French Civic Tech",
    description:
      "Webapp displaying National Assembly voting records (17th legislature). Full public API, AI-powered chat, deputy loyalty bars, hemicycle simulator, and GDPR-compliant analytics.",
    tags: ["TanStack Start", "React 19", "Turso", "Groq AI", "Tailwind v4", "Vercel"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/mandat",
    links: { github: "https://github.com/Simonc44/mandat", live: "https://mandat-psi.vercel.app" },
    accent: "from-blue-500 to-indigo-600",
    category: "Civic Tech",
    featured: true,
  },
  {
    title: "CygnisAI",
    subtitle: "AI Platform",
    description:
      "Innovative AI platform connecting your data to intelligent agents. Features customizable AI agents, multi-modal content generation, data connectors, and long-term memory.",
    tags: ["Next.js", "React", "TypeScript", "Firebase", "Google Gemini"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/cygnis",
    links: { live: "https://cygnis-ai.vercel.app", github: "https://github.com/Simonc44/cygnis" },
    accent: "from-violet-500 to-purple-700",
    category: "AI",
    featured: true,
  },
  {
    title: "Procivi",
    subtitle: "AI-Powered CV Generator",
    description:
      "Google Gemini meets your LinkedIn profile to generate CVs, cover letters and personalised emails in 30 seconds. Import your profile, click once, done.",
    tags: ["Vite", "React", "TypeScript", "Tailwind CSS", "Gemini"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/Procivi",
    links: { live: "https://procivi-08704062.web.app/", github: "https://github.com/Simonc44/Procivi" },
    accent: "from-emerald-500 to-teal-600",
    category: "Productivity",
  },
  {
    title: "OmniMCP Router",
    subtitle: "Developer Tooling",
    description:
      "MCP routing tool with auto-healing, hot-reload, hooks, and performance profiling. Professional open-source standards — CI on Ubuntu & Windows, Python 3.10–3.12.",
    tags: ["Python", "MCP", "CI/CD", "GitHub Actions"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/OmniMCP",
    links: { github: "https://github.com/Simonc44/OmniMCP" },
    accent: "from-orange-500 to-amber-600",
    category: "DevTools",
  },
  {
    title: "Homa RH",
    subtitle: "HR Consulting Website",
    description:
      "Premium showcase site for an HR consulting firm. Mobile-first, ultra-fast, glassmorphism design, interactive HR diagnostic tools, local SEO, and structured data.",
    tags: ["Vite", "React", "TypeScript", "Tailwind CSS"],
    links: { live: "https://homa-rh.vercel.app" },
    accent: "from-emerald-700 to-amber-500",
    category: "Design",
  },
];

const CATEGORIES: Category[] = ["All", "AI", "Civic Tech", "DevTools", "Productivity", "Design"];

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const Projects = () => {
  const [active, setActive] = useState<Category>("All");

  const filtered = useMemo(
    () => (active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active]
  );

  const counts = useMemo(() => {
    const map: Record<Category, number> = { All: PROJECTS.length, AI: 0, "Civic Tech": 0, DevTools: 0, Design: 0, Productivity: 0 };
    PROJECTS.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <section id="projects" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <FadeIn>
            <p className="text-sm font-mono text-primary/70 tracking-widest uppercase">
              What I've shipped
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-medium">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Building the future, one project at a time.
            </p>
          </FadeIn>
        </div>

        {/* Filter pills */}
        <FadeIn delay={0.25}>
          <div
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
            role="tablist"
            aria-label="Project categories"
          >
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              const tabId = `projects-tab-${slug(cat)}`;
              return (
                <button
                  key={cat}
                  id={tabId}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="projects-grid"
                  onClick={() => setActive(cat)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full bg-primary/15 border border-primary/30"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                    <span className="ml-1.5 text-xs opacity-60">{counts[cat]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Projects grid */}
        <motion.div
          id="projects-grid"
          role="tabpanel"
          aria-labelledby={`projects-tab-${slug(active)}`}
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.title}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-glow flex flex-col"
              >
                {/* Preview image */}
                <div className="relative h-44 overflow-hidden bg-card/60">
                  {project.preview ? (
                    <img
                      src={project.preview}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${project.accent} opacity-30`} />
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/20">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-xs font-medium bg-primary/90 text-primary-foreground rounded-full px-3 py-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{project.subtitle}</p>
                    <h3 className="text-xl font-bold group-hover:text-gradient transition-all">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {project.links.live && (
                      <Button
                        size="sm"
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex-1"
                        asChild
                      >
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 justify-center"
                          aria-label={`Open ${project.title} live demo`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/40 hover:bg-primary/10 flex-1"
                        asChild
                      >
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 justify-center"
                          aria-label={`Open ${project.title} source code`}
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              key="empty-state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-muted-foreground mt-12"
              role="status"
              aria-atomic="true"
            >
              No projects in this category yet — stay tuned!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
