import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Github, Linkedin, Instagram, ArrowDown } from "lucide-react";
import ThreeScene from "@/components/ThreeScene";
import { FadeIn } from "@/components/animations/FadeIn";
import CommandBlock from "@/components/primitives/CommandBlock";
import LiveCounter from "@/components/primitives/LiveCounter";
import GlowBadge from "@/components/primitives/GlowBadge";
import LogoBlurText from "@/components/primitives/LogoBlurText";
import { useDeviceProfile } from "@/hooks/useDevicePerformance";

/* ── Glass card hover-tilt (unchanged) ── */
const MAX_TILT_DEG = 10;

const useGlassTilt = (enabled: boolean) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT_DEG, MAX_TILT_DEG]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT_DEG, -MAX_TILT_DEG]);

  const handlers = enabled
    ? {
        onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - rect.left) / rect.width - 0.5);
          y.set((e.clientY - rect.top) / rect.height - 0.5);
        },
        onMouseLeave: () => {
          x.set(0);
          y.set(0);
        },
      }
    : { onMouseMove: undefined, onMouseLeave: undefined };

  return { rotateX, rotateY, handlers };
};

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const profile = useDeviceProfile();

  const tiltEnabled =
    profile.ready && !shouldReduceMotion && !profile.isTouch;

  const { rotateX, rotateY, handlers } = useGlassTilt(tiltEnabled);

  // Page-level scroll progress (0..1 across the whole document).
  // Passed into ThreeScene so the 3D scene can doll-out / rotate as the
  // user scrolls away from the Hero.
  const { scrollYProgress } = useScroll();

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
  ] as const;

  const glassCardClass =
    "tilt-3d glass-card relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-card/[0.32] backdrop-blur-md shadow-card will-change-transform p-6 md:p-8 lg:p-10";

  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen flex items-center overflow-hidden pt-28"
    >
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
          <FadeIn delay={0}>
            <div className="flex flex-wrap items-center gap-2 mb-8 font-mono">
              <GlowBadge variant="live">Available — Q4 2026</GlowBadge>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Portfolio · v3.0
              </span>
            </div>
          </FadeIn>

          <div className="flex flex-col-reverse lg:flex-row items-stretch gap-6 lg:gap-8">
            {/* LEFT — Glassmorphism text card */}
            <motion.div
              {...handlers}
              style={{
                rotateX: tiltEnabled ? rotateX : 0,
                rotateY: tiltEnabled ? rotateY : 0,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
              }}
              className={glassCardClass}
              role="region"
              aria-label="Introduction"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(244,114,182,0.04) 60%, transparent 100%)",
                }}
              />

              <div className="relative space-y-7">
                <FadeIn delay={0.1}>
                  <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-display font-semibold tracking-[-0.03em] leading-[1.04]">
                    I build products
                    <br />
                    that{" "}
                    <span className="text-gradient">don't suck.</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="text-base md:text-lg leading-relaxed max-w-xl text-muted-foreground">
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
                    . Shipping full-stack, AI-powered &amp; civic-tech tools
                    from France to the world.
                  </p>
                </FadeIn>

                {/* LogoBlur cycling titles — replaces the old CSS keyframe */}
                <FadeIn delay={0.3}>
                  <div className="text-muted-foreground min-h-[2.4rem] flex items-center md:justify-start justify-center font-mono text-lg">
                    <LogoBlurText
                      words={[
                        "Full-Stack Developer",
                        "Indie Maker",
                        "AI Builder",
                        "Open Source Contributor",
                      ]}
                      intervalMs={3200}
                      ariaLabel="Full-Stack Developer, Indie Maker, AI Builder, Open Source Contributor"
                    />
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <CommandBlock label="npx" command="simon-connect --now" />
                </FadeIn>

                <FadeIn delay={0.55}>
                  <div className="grid grid-cols-3 gap-4 md:gap-6 pt-2">
                    <LiveCounter value={5} suffix="+" label="Products shipped" />
                    <LiveCounter
                      value={1800}
                      suffix="+"
                      label="Commits / 2026"
                    />
                    <LiveCounter value={3} label="OSS projects" />
                  </div>
                </FadeIn>

                <FadeIn delay={0.7}>
                  <div className="flex gap-3 pt-2">
                    {socials.map(({ href, Icon, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={
                          shouldReduceMotion ? undefined : { scale: 1.05 }
                        }
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.95 }
                        }
                        className="p-2.5 rounded-xl border border-white/[0.06] bg-card/[0.04] hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </motion.div>

            {/* RIGHT — Floating 3D scene, now scroll-reactive */}
            <FadeIn
              delay={0.4}
              direction="left"
              className="flex-shrink-0 w-full lg:w-[44%]"
            >
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.3 }}
                className="glass-card relative isolate h-[420px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-card/[0.20] shadow-card"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 60%, hsl(263 75% 68% / 0.18) 0%, transparent 60%), " +
                      "radial-gradient(ellipse at 50% 100%, hsl(340 80% 62% / 0.10) 0%, transparent 50%)",
                  }}
                />

                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    live render
                  </span>
                  <span>three.js · R3F</span>
                </div>

                <div className="absolute inset-0 z-0">
                  <ThreeScene pageScroll={scrollYProgress} />
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
          animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
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
