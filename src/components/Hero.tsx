import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import CommandBlock from "@/components/primitives/CommandBlock";
import LiveCounter from "@/components/primitives/LiveCounter";
import GlowBadge from "@/components/primitives/GlowBadge";

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    {
      href: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
      Icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://www.instagram.com/simonchusseau/",
      Icon: Instagram,
      label: "Instagram",
    },
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
            "radial-gradient(ellipse at 25% 25%, hsl(263 75% 68% / 0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 75% 75%, hsl(340 80% 62% / 0.12) 0%, transparent 55%)",
        }}
      />

      <div className="container relative z-10 px-4 py-20 w-full">
        <div className="max-w-6xl mx-auto">
          {/* ── Eyebrow row (badges) ── */}
          <FadeIn delay={0}>
            <div className="flex flex-wrap items-center gap-2 mb-8 font-mono">
              <GlowBadge variant="live">Available — Q4 2026</GlowBadge>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Portfolio · v3.0
              </span>
            </div>
          </FadeIn>

          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            {/* ── LEFT ── */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <FadeIn delay={0.1}>
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-semibold tracking-[-0.03em] leading-[1.02]">
                  I build products
                  <br />
                  that{" "}
                  <span className="text-gradient">don't suck.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
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
                  &amp;{" "}
                  <a
                    href="https://mandat-psi.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    Mandat
                  </a>
                  . Shipping full-stack, AI-powered &amp; civic-tech tools from
                  France to the world.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="hero-role-wrapper text-muted-foreground">
                  <span
                    className="hero-role"
                    aria-label="Full-Stack Developer, Indie Maker, AI Builder, Open Source Contributor"
                    translate="no"
                  />
                </div>
              </FadeIn>

              {/* CLI command block */}
              <FadeIn delay={0.4}>
                <div className="flex justify-center lg:justify-start">
                  <CommandBlock
                    label="npx"
                    command="simon-connect --now"
                  />
                </div>
              </FadeIn>

              {/* Live counters */}
              <FadeIn delay={0.55}>
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0 pt-4">
                  <LiveCounter value={5} suffix="+" label="Products shipped" />
                  <LiveCounter
                    value={1800}
                    suffix="+"
                    label="Commits / 2026"
                  />
                  <LiveCounter value={3} label="OSS projects" />
                </div>
              </FadeIn>

              {/* Social buttons */}
              <FadeIn delay={0.7}>
                <div className="flex gap-3 justify-center lg:justify-start pt-2">
                  {socials.map(({ href, Icon, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      className="p-2.5 rounded-xl border border-white/[0.06] bg-card/[0.04] hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* ── RIGHT — Terminal card ── */}
            <FadeIn delay={0.4} direction="left" className="flex-shrink-0 w-full max-w-md">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border border-white/[0.06] bg-card/[0.05] backdrop-blur-md shadow-card"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary/40 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-auto text-xs font-mono text-muted-foreground">
                    simon@portfolio:~
                  </span>
                </div>
                <div className="p-6 space-y-3 font-mono text-sm">
                  <p className="text-primary">$ whoami</p>
                  <p className="text-foreground/90">Simon Chusseau</p>
                  <p className="text-primary">$ cat about.txt</p>
                  <p className="text-foreground/70 leading-relaxed">
                    🚀 Indie Maker &amp; AI Builder<br />
                    📍 France<br />
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

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          onClick={scrollTo("about")}
          animate={
            shouldReduceMotion
              ? undefined
              : { y: [0, 6, 0] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll to About section"
        >
          scroll
          <ArrowDown className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
