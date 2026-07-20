import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, ArrowDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { href: "https://www.linkedin.com/in/simon-chusseau-91541a378/", Icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.instagram.com/simonchusseau/", Icon: Instagram, label: "Instagram" },
    { href: "https://github.com/Simonc44", Icon: Github, label: "GitHub" },
  ];

  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 25%, hsl(263 70% 66% / 0.1) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 75% 75%, hsl(340 75% 60% / 0.06) 0%, transparent 55%)",
        }}
      />

      <div className="container relative z-10 px-4 py-24 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            {/* ── LEFT ── */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <FadeIn delay={0}>
                <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
                  Hello, world! I&apos;m
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.1]">
                  Simon
                  <span className="text-gradient">.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="hero-role-wrapper text-muted-foreground">
                  <span
                    className="hero-role"
                    aria-label="Full-Stack Developer, Indie Maker, AI Builder, Open Source Contributor"
                    translate="no"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 text-muted-foreground">
                  Founder of{" "}
                  <a
                    href="https://cygnis-ai.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    CygnisAI
                  </a>{" "}
                  — building products that connect data and intelligence. Based in France, shipping worldwide.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={scrollTo("contact")}
                  >
                    Connect now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                    onClick={scrollTo("projects")}
                  >
                    My Projects
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex gap-3 justify-center lg:justify-start">
                  {socials.map(({ href, Icon, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl border border-border/60 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* ── RIGHT — Terminal card ── */}
            <FadeIn delay={0.3} direction="left" className="flex-shrink-0 w-full max-w-md">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm shadow-card"
              >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/60">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-auto text-xs font-mono text-muted-foreground">simon@portfolio:~</span>
                </div>
                {/* Body */}
                <div className="p-6 space-y-3 font-mono text-sm">
                  <p className="text-primary">$ whoami</p>
                  <p className="text-foreground/90">Simon Chusseau</p>
                  <p className="text-primary">$ cat about.txt</p>
                  <p className="text-foreground/70 leading-relaxed">
                    🚀 Indie Maker &amp; AI Builder<br />
                    📍 France — remote worldwide<br />
                    🛠 React · TypeScript · LLMs<br />
                    🌱 Building: CygnisAI · Mandat<br />
                    ✅ Open to collabs
                  </p>
                  <p className="text-primary">
                    $<span className="hero-cursor" translate="no" />
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={shouldReduceMotion ? false : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="opacity-60"
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
