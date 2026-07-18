const STATS = [
  { value: "3+", label: "Years building" },
  { value: "5+", label: "Projects shipped" },
  { value: "2", label: "SaaS products" },
  { value: "∞", label: "Coffees brewed" },
];

const About = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">

        {/* Section label */}
        <p className="text-sm font-mono text-primary/70 tracking-widest uppercase text-center mb-3">
          Who am I
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-14 text-center">
          About <span className="text-gradient">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left — text */}
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              I'm a self-taught French developer obsessed with shipping things that matter. I build
              full-stack web products at the intersection of{" "}
              <span className="text-foreground font-medium">AI, civic tech, and developer tooling</span>.
            </p>
            <p>
              Currently leading the development of{" "}
              <a
                href="https://cygnis-ai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                CygnisAI
              </a>{" "}
              — a platform connecting your data with intelligent AI agents — and building
              open-source tools like{" "}
              <span className="text-foreground font-medium">Mandat</span> (French civic tech) and
              OmniMCP Router.
            </p>
            <p>
              I'm exploring LLM orchestration, multi-modal generation and serverless scaling.
              Always looking to collaborate on open-source projects that push human-computer
              interaction forward.
            </p>
            <blockquote className="border-l-2 border-primary pl-4 italic text-foreground/70 mt-6">
              "The best way to predict the future is to build it."
            </blockquote>
          </div>

          {/* Right — stats grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-gradient-card backdrop-blur-sm border border-primary/10 hover:border-primary/30 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-glow group"
                >
                  <p className="text-4xl font-bold text-gradient mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {value}
                  </p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Currently section */}
            <div className="bg-gradient-card backdrop-blur-sm border border-primary/10 rounded-2xl p-6 space-y-3">
              <p className="text-xs font-mono text-primary/70 tracking-widest uppercase">Currently</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Building CygnisAI & Mandat (civic tech)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Exploring SaaS ideas via Reddit research
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Learning advanced LLM orchestration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-green-400">Open to collabs & freelance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
