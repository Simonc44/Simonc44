import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, ArrowDown } from "lucide-react";

/**
 * Hero — typing animation done 100% in CSS (span::before + @keyframes animate)
 * so Google Translate never touches a React-managed text node and can't crash the tree.
 */
const Hero = () => {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden">
      {/* background glows */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 25%, hsl(217 91% 60% / 0.13) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 75% 75%, hsl(260 80% 70% / 0.10) 0%, transparent 55%)",
        }}
      />

      <div className="container relative z-10 px-4 py-24 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">

            {/* ── LEFT ── */}
            <div className="flex-1 space-y-7 text-center md:text-left">

              <p className="text-sm font-mono tracking-widest uppercase" style={{ color: "hsl(217 91% 60% / 0.7)" }}>
                Hello, world! I&#39;m
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Simon
                <strong style={{ color: "hsl(217 91% 60%)" }}>.</strong>
              </h1>

              {/*
                CSS-only typing animation.
                The <span> has no text children — content comes entirely from
                the ::before pseudo-element, so Google Translate can't touch it.
              */}
              <div className="hero-role-wrapper">
                <span className="hero-role" aria-label="Full-Stack Developer, Indie Maker, AI Builder, Open Source Contributor" translate="no" />
              </div>

              <p className="text-lg leading-relaxed max-w-lg mx-auto md:mx-0" style={{ color: "hsl(215 20% 58%)" }}>
                Founder of{" "}
                <a
                  href="https://cygnis-ai.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline underline-offset-4"
                  style={{ color: "hsl(217 91% 60%)" }}
                >
                  CygnisAI
                </a>
                {" "}— building products that connect data and intelligence.
                Based in France, shipping worldwide.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="font-semibold"
                  style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(260 80% 70%))" }}
                  onClick={scrollTo("contact")}
                >
                  Connect now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10"
                  onClick={scrollTo("projects")}
                >
                  My Projects
                </Button>
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                {[
                  { href: "https://www.linkedin.com/in/simon-chusseau-91541a378/", Icon: Linkedin, label: "LinkedIn" },
                  { href: "https://www.instagram.com/simonchusseau/", Icon: Instagram, label: "Instagram" },
                  { href: "https://github.com/Simonc44", Icon: Github, label: "GitHub" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2.5 rounded-xl border border-primary/10 bg-card/60 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── RIGHT — Mac-style card like reference site ── */}
            <div className="flex-shrink-0 w-full max-w-xs md:max-w-sm">
              <div className="hero-card rounded-2xl overflow-hidden border border-primary/20 shadow-card transition-all duration-500 hover:border-primary/40">
                {/* title bar */}
                <div className="hero-card-bar flex items-center gap-2 px-4 py-3" style={{ background: "hsl(222 47% 13%)", borderBottom: "1px solid hsl(217 32% 20%)" }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FE5E58" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FEBD2C" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#27C841" }} />
                  <span className="ml-auto text-xs font-mono" style={{ color: "hsl(215 20% 45%)" }}>simon@portfolio:~</span>
                </div>
                {/* body */}
                <div className="p-6 space-y-3 font-mono text-sm" style={{ background: "hsl(222 47% 11%)" }}>
                  <p style={{ color: "hsl(217 91% 60%)" }}>$ whoami</p>
                  <p style={{ color: "hsl(215 20% 75%)" }}>Simon Chusseau</p>
                  <p style={{ color: "hsl(217 91% 60%)" }}>$ cat about.txt</p>
                  <p style={{ color: "hsl(215 20% 65%)" }}>
                    🚀 Indie Maker &amp; AI Builder<br />
                    📍 France — remote worldwide<br />
                    🛠 React · TypeScript · LLMs<br />
                    🌱 Building: CygnisAI · Mandat<br />
                    ✅ Open to collabs
                  </p>
                  <p style={{ color: "hsl(217 91% 60%)" }}>$ _<span className="hero-cursor" translate="no" /></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
