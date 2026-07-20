import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";

const STATS = [
  { value: "3+", label: "Years building" },
  { value: "5+", label: "Projects shipped" },
  { value: "2", label: "SaaS products" },
  { value: "OSS", label: "Contributor" },
];

const CURRENTLY = [
  "Building CygnisAI & Mandat (civic tech)",
  "Exploring SaaS ideas via Reddit research",
  "Learning advanced LLM orchestration",
  "Open to collabs & freelance",
];

const About = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className="space-y-8">
            <FadeIn>
              <p className="text-sm font-mono tracking-widest uppercase text-primary/70">
                Who am I
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                About <span className="text-gradient">Me</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I&apos;m a self-taught French developer obsessed with shipping things that matter. I build
                  full-stack web products at the intersection of{" "}
                  <span className="text-foreground font-medium">AI, civic tech, and developer tooling</span>.
                </p>
                <p>
                  Currently leading the development of{" "}
                  <a
                    href="https://cygnis-ai.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    CygnisAI
                  </a>{" "}
                  — a platform connecting your data with intelligent AI agents — and building
                  open-source tools like <span className="text-foreground font-medium">Mandat</span> and
                  OmniMCP Router.
                </p>
                <p>
                  I&apos;m exploring LLM orchestration, multi-modal generation and serverless scaling.
                  Always looking to collaborate on open-source projects that push human-computer
                  interaction forward.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <blockquote className="border-l-2 border-primary pl-5 italic text-foreground/70 text-lg">
                &ldquo;The best way to predict the future is to build it.&rdquo;
              </blockquote>
            </FadeIn>
          </div>

          {/* Right — stats + currently */}
          <div className="space-y-8">
            <FadeIn delay={0.2} direction="left">
              <div className="grid grid-cols-2 gap-4">
                {STATS.map(({ value, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-card backdrop-blur-sm border border-border/60 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors duration-300"
                  >
                    <p className="text-4xl md:text-5xl font-serif font-medium text-gradient mb-2">
                      {value}
                    </p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3} direction="left">
              <div className="bg-gradient-card backdrop-blur-sm border border-border/60 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-mono text-primary/70 tracking-widest uppercase">Currently</p>
                <ul className="space-y-3">
                  {CURRENTLY.map((item, index) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          index === CURRENTLY.length - 1 ? "bg-emerald-400" : "bg-primary"
                        }`}
                      />
                      <span className={index === CURRENTLY.length - 1 ? "text-emerald-400" : ""}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
