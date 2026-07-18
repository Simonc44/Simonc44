import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, ArrowDown } from "lucide-react";

const ROLES = [
  "Full-Stack Developer",
  "Indie Maker",
  "AI Builder",
  "Open Source Contributor",
];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      setDisplayed(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 60);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx >= 0) {
      setDisplayed(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 35);
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIndex]);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_60%_/_0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(260_80%_70%_/_0.10),_transparent_55%)]" />

      <div className="container relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">

            {/* LEFT — text */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <p className="text-sm font-mono text-primary/70 tracking-widest uppercase animate-fade-in">
                Hello, world! I'm
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in">
                Simon
                <br />
                <span className="text-gradient">Chusseau</span>
              </h1>

              {/* Typing role */}
              <div className="h-8 flex items-center justify-center md:justify-start">
                <span className="text-xl md:text-2xl text-muted-foreground font-mono">
                  {displayed}
                  <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
                </span>
              </div>

              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed mx-auto md:mx-0">
                Founder of{" "}
                <a
                  href="https://cygnis-ai.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  CygnisAI
                </a>{" "}
                — building products that connect data and intelligence. Based in France, shipping worldwide.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
                  onClick={scrollToContact}
                >
                  Connect now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10 transition-all duration-300"
                  onClick={scrollToProjects}
                >
                  My Projects
                </Button>
              </div>

              {/* Socials */}
              <div className="flex gap-3 pt-2 justify-center md:justify-start">
                {[
                  { href: "https://www.linkedin.com/in/simon-chusseau-91541a378/", icon: Linkedin, label: "LinkedIn" },
                  { href: "https://www.instagram.com/simonchusseau/", icon: Instagram, label: "Instagram" },
                  { href: "https://github.com/Simonc44", icon: Github, label: "GitHub" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2.5 rounded-xl bg-card/60 border border-primary/10 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT — profile card */}
            <div className="flex-shrink-0">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-primary opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500 shadow-card">
                  <img
                    src="/profile.png"
                    alt="Simon Chusseau"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-background/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-primary/20">
                    <p className="text-xs font-mono text-primary/80">🟢 Open to collabs</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
