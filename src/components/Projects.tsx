import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const PROJECTS = [
  {
    title: "Mandat",
    subtitle: "French Civic Tech",
    description:
      "Webapp displaying National Assembly voting records (17th legislature). Full public API, AI-powered chat, deputy loyalty bars, hemicycle simulator, and GDPR-compliant analytics.",
    tags: ["TanStack Start", "React 19", "Turso", "Groq AI", "Tailwind v4", "Vercel"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/mandat",
    links: {
      github: "https://github.com/Simonc44/mandat",
    },
    accent: "from-blue-500 to-indigo-600",
    badge: "🏛️ Civic Tech",
  },
  {
    title: "CygnisAI",
    subtitle: "AI Platform",
    description:
      "Innovative AI platform connecting your data to intelligent agents. Features customizable AI agents, multi-modal content generation, data connectors, and long-term memory.",
    tags: ["Next.js", "React", "TypeScript", "Firebase", "Google Gemini"],
    preview: "https://raw.githubusercontent.com/Simonc44/Simonc44/main/cygnis-ai.png",
    links: {
      live: "https://cygnis-ai.vercel.app",
      github: "https://github.com/Simonc44/cygnis",
    },
    accent: "from-violet-500 to-purple-700",
    badge: "🤖 AI",
  },
  {
    title: "Procivi",
    subtitle: "AI-Powered CV Generator",
    description:
      "Google Gemini meets your LinkedIn profile to generate CVs, cover letters and personalised emails in 30 seconds. Import your profile, click once, done.",
    tags: ["Vite", "React", "TypeScript", "Tailwind CSS", "Gemini"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/Procivi",
    links: {
      live: "https://procivi-08704062.web.app/",
      github: "https://github.com/Simonc44/Procivi",
    },
    accent: "from-emerald-500 to-teal-600",
    badge: "📄 Productivity",
  },
  {
    title: "OmniMCP Router",
    subtitle: "Developer Tooling",
    description:
      "MCP routing tool with auto-healing, hot-reload, hooks, and performance profiling. Professional open-source standards — CI on Ubuntu & Windows, Python 3.10–3.12.",
    tags: ["Python", "MCP", "CI/CD", "GitHub Actions"],
    preview: "https://opengraph.githubassets.com/1/Simonc44/OmniMCP",
    links: {
      github: "https://github.com/Simonc44/OmniMCP",
    },
    accent: "from-orange-500 to-amber-600",
    badge: "🔧 DevTools",
  },
  {
    title: "Homa RH",
    subtitle: "HR Consulting Website",
    description:
      "Premium showcase site for an HR consulting firm. Mobile-first, ultra-fast, glassmorphism design, interactive HR diagnostic tools, local SEO, and structured data.",
    tags: ["Vite", "React", "TypeScript", "Tailwind CSS"],
    preview: "",
    links: {
      live: "https://homa-rh.vercel.app",
    },
    accent: "from-emerald-700 to-amber-500",
    badge: "🎨 Design",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-4 bg-card/20">
      <div className="container max-w-6xl mx-auto">
        <p className="text-sm font-mono text-primary/70 tracking-widest uppercase text-center mb-3">
          What I've shipped
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-muted-foreground text-center mb-14 text-lg">
          Building the future, one project at a time.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-glow hover:-translate-y-1 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Preview image */}
              <div className="relative h-44 overflow-hidden bg-card/60">
                {project.preview ? (
                  <img
                    src={project.preview}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                {/* Gradient overlay over image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                {/* Badge */}
                <span className="absolute top-3 left-3 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/20">
                  {project.badge}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1 space-y-4">
                {/* Title */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{project.subtitle}</p>
                  <h3 className="text-xl font-bold group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tags */}
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

                {/* Links */}
                <div className="flex gap-2 pt-2">
                  {project.links.live && (
                    <Button
                      size="sm"
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex-1"
                      asChild
                    >
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 justify-center">
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
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 justify-center">
                        <Github className="w-3.5 h-3.5" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
