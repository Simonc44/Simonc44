import { Mail, Linkedin, Instagram, Github, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOCIALS = [
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
  return (
    <section id="contact" className="py-24 px-4">
      <div className="container max-w-4xl mx-auto">
        <p className="text-sm font-mono text-primary/70 tracking-widest uppercase text-center mb-3">
          Say hello
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Let's <span className="text-gradient">Connect</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-14 text-center max-w-xl mx-auto">
          Always open to new projects, creative ideas, or a good conversation about what we're building.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {SOCIALS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 p-5 rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${social.color}`}
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

        {/* Email CTA card */}
        <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-8 border border-primary/10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>France — working remotely worldwide</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">Prefer email?</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Send me a message directly or check out my work on GitHub.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              asChild
            >
              <a href="https://github.com/Simonc44" target="_blank" rel="noopener noreferrer">
                View GitHub Profile
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
              asChild
            >
              <a href="https://www.linkedin.com/in/simon-chusseau-91541a378/" target="_blank" rel="noopener noreferrer">
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
