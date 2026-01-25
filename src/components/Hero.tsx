import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Animated avatar placeholder */}
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-primary animate-glow mx-auto mb-6 flex items-center justify-center text-6xl font-bold">
              SC
            </div>
          </div>

          {/* Hero text */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hi there, I'm{" "}
            <span className="text-gradient animate-float inline-block">
              Simon
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm a passionate developer and the founder of{" "}
            <span className="text-primary font-semibold">CygnisAI</span>, an
            innovative platform designed to connect your data and unlock its
            potential with intelligent AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              asChild
            >
              <a
                href="https://cygnis-ai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore CygnisAI
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 transition-all duration-300"
              asChild
            >
              <a href="#projects">View Projects</a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center pt-8">
            <a
              href="https://www.linkedin.com/in/simon-chusseau-91541a378/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/simonchusseau/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/Simonc44"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
