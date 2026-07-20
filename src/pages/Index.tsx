import { Github, Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import GitHubTerminal from "@/components/GitHubTerminal";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main>
      <Hero />
      <About />
      <TechStack />
      <GitHubTerminal />
      <Projects />
      <Contact />
    </main>
    <footer className="py-10 border-t border-white/[0.06] bg-card/[0.04]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <FadeIn direction="none">
          <p className="font-mono">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-foreground font-semibold">Simon Chusseau</span>
            <span className="opacity-50"> · v3.0 </span>
            <span className="text-emerald-400">●</span>
          </p>
        </FadeIn>
        <FadeIn direction="none">
          <div className="flex items-center gap-4 font-mono">
            <a
              href="https://github.com/Simonc44"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/simon-chusseau-91541a378/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </FadeIn>
      </div>
    </footer>
  </div>
);

export default Index;
