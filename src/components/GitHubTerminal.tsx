import { Terminal } from "lucide-react";

const GitHubTerminal = () => {
  return (
    <section id="terminal" className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            My GitHub <span className="text-gradient">Terminal</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A real-time, interactive dashboard showcasing my profile statistics, tech stack, and contribution history directly from GitHub.
          </p>
        </div>

        {/* Terminal Wrapper */}
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-primary/20 shadow-glow overflow-hidden max-w-5xl mx-auto transition-all duration-500 hover:border-primary/40">
          {/* Terminal Title Bar */}
          <div className="bg-card/80 border-b border-primary/10 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <Terminal className="w-4 h-4 text-primary" />
              simon@github: ~
            </div>
            <div className="w-14" /> {/* Spacer to center the title */}
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 space-y-8 font-mono">
            {/* Heatmap Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm md:text-base text-primary/80">
                <span className="text-green-400 font-bold">simon@github</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-blue-400 font-bold">~</span>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">./contributions.sh --graph</span>
              </div>
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <div className="min-w-[860px] mx-auto">
                  <img
                    src="/contrib-heatmap.svg"
                    alt="GitHub Contributions Heatmap"
                    className="w-full h-auto rounded-lg border border-primary/5 shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Profile & Info Card Section */}
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-2 text-sm md:text-base text-primary/80">
                <span className="text-green-400 font-bold">simon@github</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-blue-400 font-bold">~</span>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">whoami && neofetch</span>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-start justify-center">
                <div className="lg:col-span-5 flex justify-center">
                  <img
                    src="/profile-ascii.svg"
                    alt="Simon's Monochrome ASCII Portrait"
                    className="w-full max-w-[370px] h-auto rounded-lg border border-primary/5 shadow-md"
                  />
                </div>
                <div className="lg:col-span-7 flex justify-center">
                  <img
                    src="/info-card.svg"
                    alt="Simon's Terminal Info Card"
                    className="w-full max-w-[490px] h-auto rounded-lg border border-primary/5 shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubTerminal;
