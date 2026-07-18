const TECHNOLOGIES = [
  { name: "React", icon: "⚛️", color: "from-cyan-400/20 to-blue-500/20", border: "border-cyan-400/30" },
  { name: "TypeScript", icon: "🔷", color: "from-blue-500/20 to-blue-700/20", border: "border-blue-500/30" },
  { name: "Next.js", icon: "▲", color: "from-white/10 to-gray-300/10", border: "border-white/20", iconClass: "text-white font-bold" },
  { name: "Tailwind CSS", icon: "🌊", color: "from-cyan-400/20 to-teal-500/20", border: "border-cyan-400/30" },
  { name: "Firebase", icon: "🔥", color: "from-yellow-400/20 to-orange-500/20", border: "border-yellow-400/30" },
  { name: "Node.js", icon: "🟢", color: "from-green-500/20 to-green-700/20", border: "border-green-500/30" },
  { name: "Vite", icon: "⚡", color: "from-purple-400/20 to-yellow-400/20", border: "border-purple-400/30" },
  { name: "TanStack", icon: "🔗", color: "from-red-400/20 to-orange-400/20", border: "border-red-400/30" },
  { name: "Turso / SQLite", icon: "🗄️", color: "from-teal-400/20 to-cyan-600/20", border: "border-teal-400/30" },
  { name: "Vercel", icon: "▲", color: "from-white/10 to-gray-400/10", border: "border-white/20", iconClass: "text-white font-bold" },
  { name: "Google Gemini", icon: "✨", color: "from-blue-400/20 to-purple-500/20", border: "border-blue-400/30" },
  { name: "Groq", icon: "🤖", color: "from-orange-400/20 to-red-500/20", border: "border-orange-400/30" },
];

const TechStack = () => {
  return (
    <section id="tech" className="py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <p className="text-sm font-mono text-primary/70 tracking-widest uppercase text-center mb-3">
          Tools of the trade
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          My <span className="text-gradient">Tech Stack</span>
        </h2>
        <p className="text-muted-foreground text-center mb-14 text-lg max-w-xl mx-auto">
          Technologies I reach for to bring ideas to production.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {TECHNOLOGIES.map((tech, index) => (
            <div
              key={tech.name}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tech.color} border ${tech.border} p-4 flex flex-col items-center gap-2.5 hover:scale-105 hover:shadow-glow transition-all duration-300`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className={`text-3xl leading-none ${tech.iconClass ?? ""}`}>{tech.icon}</span>
              <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
