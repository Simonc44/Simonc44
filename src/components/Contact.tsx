import { useState } from "react";
import {
  Mail,
  Linkedin,
  Instagram,
  Github,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FadeIn } from "@/components/animations/FadeIn";

const CONTACT_EMAIL = "simon.chusseau@gmail.com";

const socials = [
  {
    name: "LinkedIn",
    handle: "simon-chusseau",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
    color: "hover:border-blue-500/40 hover:bg-blue-500/5",
    iconColor: "group-hover:text-blue-400",
  },
  {
    name: "GitHub",
    handle: "Simonc44",
    icon: Github,
    url: "https://github.com/Simonc44",
    color: "hover:border-purple-500/40 hover:bg-purple-500/5",
    iconColor: "group-hover:text-purple-400",
  },
  {
    name: "Instagram",
    handle: "simonchusseau",
    icon: Instagram,
    url: "https://www.instagram.com/simonchusseau/",
    color: "hover:border-pink-500/40 hover:bg-pink-500/5",
    iconColor: "group-hover:text-pink-400",
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
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <FadeIn>
            <p className="text-sm font-mono text-primary/70 tracking-widest uppercase">Say hello</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-medium">
              Let's <span className="text-gradient">Connect</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Always open to new projects, creative ideas, or a good conversation about what we're
              building.
            </p>
          </FadeIn>
        </div>

        {/* Socials */}
        <FadeIn delay={0.3}>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-5 rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${social.color}`}
                  aria-label={`${social.name} (@${social.handle})`}
                >
                  <div className="p-2.5 rounded-xl bg-card/60 border border-primary/10">
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${social.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{social.name}</p>
                    <p className="text-xs text-muted-foreground">@{social.handle}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </FadeIn>

        {/* Email card (form removed — click to copy / open) */}
        <FadeIn delay={0.35}>
          <div className="max-w-xl mx-auto bg-gradient-card backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-primary/10 shadow-glow text-center space-y-5">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>France</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="p-3 md:p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <Mail className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Prefer email?</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Click to copy or open your mail client.
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              <code className="font-mono text-sm bg-background/60 border border-border/60 rounded-lg px-3 py-2 select-all break-all">
                {CONTACT_EMAIL}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/40 hover:bg-primary/10"
                  onClick={onCopyEmail}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  asChild
                >
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail className="w-4 h-4" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Contact;
