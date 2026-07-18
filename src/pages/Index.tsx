import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GitHubTerminal from "@/components/GitHubTerminal";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { Github, Linkedin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <GitHubTerminal />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <footer className="py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-mono">
            © {new Date().getFullYear()}{" "}
            <span className="text-foreground font-semibold">Simon Chusseau</span>
            {" "}&mdash; Built with passion &amp; ☕
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Simonc44"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/simon-chusseau-91541a378/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
