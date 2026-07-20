import { useState } from "react";
import {
  Mail,
  Linkedin,
  Instagram,
  Github,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GlowBadge from "@/components/primitives/GlowBadge";
import CommandBlock from "@/components/primitives/CommandBlock";

const CONTACT_EMAIL = "simon.chusseau@gmail.com";

const SOCIALS = [
  {
    name: "GitHub",
    handle: "Simonc44",
    icon: Github,
    url: "https://github.com/Simonc44",
    color: "hover:border-purple-400/40 hover:bg-purple-400/5",
    iconColor: "group-hover:text-purple-300",
  },
  {
    name: "LinkedIn",
    handle: "simon-chusseau",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
    color: "hover:border-blue-400/40 hover:bg-blue-400/5",
    iconColor: "group-hover:text-blue-300",
  },
  {
    name: "Instagram",
    handle: "simonchusseau",
    icon: Instagram,
    url: "https://www.instagram.com/simonchusseau/",
    color: "hover:border-pink-400/40 hover:bg-pink-400/5",
    iconColor: "group-hover:text-pink-300",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast({
        title: "Email copied",
        description: `${CONTACT_EMAIL} is on your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy",
        description: "Please copy manually: " + CONTACT_EMAIL,
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-hero pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Giant CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-card/[0.05] backdrop-blur-md p-10 md:p-16 text-center shadow-glow">
          {/* Halo gradient */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/15"
            aria-hidden="true"
          />

          <div className="relative space-y-8">
            <FadeIn>
              <div className="flex justify-center">
                <GlowBadge variant="live">Available — Q4 2026</GlowBadge>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary/80">
                05 / Initialize
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold tracking-[-0.03em] leading-[1.02]">
                Ship something <br />
                <span className="text-gradient">that matters.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Open to collaborations, freelance missions & ambitious product
                engagements — AI, civic tech & full-stack web. Based in France,
                shipping to the world.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CommandBlock label="npx" command="simon-connect --now" />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onCopyEmail}
                  className="border-white/[0.08] hover:bg-card/[0.06] hover:border-primary/30"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {CONTACT_EMAIL}
                    </>
                  )}
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Socials row */}
        <div className="grid md:grid-cols-3 gap-4">
          {SOCIALS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.06] bg-card/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] ${social.color}`}
                aria-label={`${social.name} (@${social.handle})`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-card/40 border border-white/[0.06]">
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${social.iconColor}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{social.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      @{social.handle}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default Contact;
