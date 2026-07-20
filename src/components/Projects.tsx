import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      live: "https://mandat.vercel.app", // Fallback or active live preview link
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
    preview: "/cygnis-ai.png",
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
    preview: "https://homa-rh.vercel.app",
    links: {
      live: "https://homa-rh.vercel.app",
    },
    accent: "from-emerald-700 to-amber-500",
    badge: "🎨 Design",
  },
];

const Projects = () => {
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 bg-white border-t border-[#ededed]">
      <div className="container max-w-6xl mx-auto">

        {/* Section Heading */}
        <p className="text-sm font-mono text-gray-400 tracking-widest uppercase text-center mb-3">
          What I&#39;ve Shipped
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center font-garamond-bold text-black">
          Projects <span className="text-[#006AFF]">.</span>
        </h2>
        <p className="text-gray-500 text-center mb-14 text-lg font-garamond-regular">
          Building the future, one project at a time. Click a project card to preview inside macOS environment.
        </p>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              onClick={() => {
                setActiveProject(project);
                setIsFullscreen(false);
              }}
              className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#fff] hover:border-orange-500/50 hover:shadow-[0_3px_15px_rgba(255,165,0,0.3)] bg-white hover:scale-[1.035] transition-all duration-300 flex flex-col h-full"
            >
              {/* Preview image */}
              <div className="relative h-48 overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                {project.preview ? (
                  <img
                    src={project.preview}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="text-gray-400 font-mono text-sm">No Preview Available</div>
                )}
                {/* Accent overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                {/* Badge */}
                <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 border border-[#ededed] text-black rounded-full px-3 py-1">
                  {project.badge}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1 space-y-3">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{project.subtitle}</p>
                <h3 className="text-xl font-bold font-garamond-bold text-black group-hover:text-[#006AFF] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 font-garamond-regular leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Iframe/MacOS style Dialog */}
        <Dialog open={activeProject !== null} onOpenChange={(open) => !open && setActiveProject(null)}>
          <DialogContent className="max-w-4xl md:max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden bg-white border-2 border-gray-200 rounded-2xl flex flex-col">
            {/* Window bar */}
            <div className="bg-[#f0f0f0] border-b border-gray-200 px-4 py-3 flex items-center gap-1.5 select-none shrink-0">
              <span
                onClick={() => setActiveProject(null)}
                className="w-3.5 h-3.5 rounded-full bg-[#FE5E58] flex items-center justify-center text-[8px] font-bold text-red-800 cursor-pointer"
              >
                ×
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#FEBD2C]" />
              <span
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-[#27C841] flex items-center justify-center text-[8px] font-bold text-green-800 cursor-pointer"
              >
                +
              </span>
              <span className="ml-4 font-mono text-xs text-gray-400 truncate">
                {activeProject?.links.live || activeProject?.links.github || "simonchusseau.com"}
              </span>
            </div>

            {/* Iframe Frame / Preview body */}
            <div className="flex-1 w-full bg-white relative overflow-hidden flex flex-col">
              <div className="flex-1 w-full relative bg-gray-50">
                {activeProject?.links.live ? (
                  <iframe
                    src={activeProject.links.live}
                    className="absolute inset-0 w-full h-full border-none outline-none bg-white"
                    title={activeProject.title}
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center bg-gray-50">
                    <img
                      src={activeProject?.preview || "/placeholder.svg"}
                      alt={activeProject?.title}
                      className="max-h-[60%] w-auto object-contain rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <p className="text-gray-500 font-garamond-regular text-lg">
                      Live preview is not embeddable or code-only project. Check out on GitHub.
                    </p>
                  </div>
                )}
              </div>

              {/* Description and Action bar */}
              <div className="border-t border-gray-200 p-6 bg-white shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-black font-garamond-bold">{activeProject?.title}</h3>
                    <p className="text-gray-500 font-garamond-regular text-sm leading-relaxed max-w-2xl">
                      {activeProject?.description}
                    </p>
                  </div>

                  {/* External links */}
                  <div className="flex gap-2.5 shrink-0">
                    {activeProject?.links.live && (
                      <a
                        href={activeProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-orange-500/50 hover:bg-orange-50/20 text-gray-600 hover:text-orange-500 transition-all flex items-center gap-1.5 font-semibold text-sm"
                      >
                        <ExternalLink className="w-4 h-4" /> Open
                      </a>
                    )}
                    {activeProject?.links.github && (
                      <a
                        href={activeProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-orange-500/50 hover:bg-orange-50/20 text-gray-600 hover:text-orange-500 transition-all flex items-center gap-1.5 font-semibold text-sm"
                      >
                        <Github className="w-4 h-4" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
};

export default Projects;
