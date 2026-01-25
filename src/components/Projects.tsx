import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Homa RH",
      description:
        "Un site vitrine d'excellence pour un cabinet de conseil RH. Conception 'Mobile First' ultra-rapide, design premium et outils de conversion interactifs (Diagnostic RH).",
      features: [
        "⚡ Performance Maximale",
        "🎨 Design Glassmorphism & Luxe",
        "🔍 SEO Local & Données Structurées",
        "🛠️ Outils de Diagnostic Interactif",
      ],
      tech: ["Non Disponible"], // Ajouté ici pour éviter le crash
      links: {
        live: "https://homa-rh.vercel.app",
        // github: "..." // Ajoutez le lien si le repo est public
      },
      gradient: "from-emerald-700 to-amber-500",
    },
    {
      title: "CygnisAI",
      description:
        "An innovative AI platform designed to connect your data and unlock its potential. Features customizable AI agents, multi-modal content generation, and long-term memory for personalized experiences.",
      features: [
        "🤖 Customizable AI Agents",
        "🎨 Multi-modal Generation",
        "🔗 Data Connectors",
        "🧠 Long-term Memory",
      ],
      tech: ["Next.js", "React", "TypeScript", "Firebase", "Google Gemini"],
      links: {
        live: "https://cygnis-ai.vercel.app",
        github: "https://github.com/Simonc44/cygnis",
      },
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "Procivi",
      description:
        "L'IA la plus avancée de Google rencontre ton profil LinkedIn pour générer des CV, lettres de motivation et emails personnalisés en 30 secondes. Crée ton CV parfait en un clic.",
      features: [
        "🤖 IA Google Gemini",
        "💼 Import LinkedIn",
        "⚡ Génération en 30s",
        "📄 CV + Lettres",
      ],
      tech: ["Vite", "React", "TypeScript", "Tailwind CSS"],
      links: {
        live: "https://procivi-08704062.web.app/",
        github: "https://github.com/Simonc44/Procivi",
      },
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Building the future, one project at a time
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-glow"
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative p-8 space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {project.features.map((feature) => (
                    <div
                      key={feature}
                      className="text-sm text-muted-foreground"
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech && project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4">
                  {project.links.live && (
                    <Button
                      size="sm"
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      asChild
                    >
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.links.github && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
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
