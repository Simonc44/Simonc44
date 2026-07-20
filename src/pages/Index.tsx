import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GitHubTerminal from "@/components/GitHubTerminal";
import DraggableSkills from "@/components/DraggableSkills";
import Projects from "@/components/Projects";
import { Github, Linkedin, Instagram } from "lucide-react";

const Index = () => (
  <div className="min-h-screen bg-white">
    <Navigation />
    <main>
      <Hero />
      <About />
      <DraggableSkills />
      <GitHubTerminal />
      <Projects />
    </main>

    {/* Custom white footer matching AVIVASHISHTA29's Footer.js style, optimized for Simon Chusseau */}
    <footer id="socials" className="py-12 px-6 md:px-12 bg-white border-t border-[#ededed]">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold font-garamond-bold text-black flex items-center justify-center md:justify-start">
              Simon Chusseau <span className="text-red-500 ml-1 font-bold font-garamond-bold">.</span>
            </h2>
            <p className="font-cartoon text-2xl text-red-500 rotate-[-1deg] mt-1">
              Until Next Time :p
            </p>
          </div>

          <p className="text-gray-400 font-garamond-bold font-semibold text-sm">
            Designed and Developed by Me © {new Date().getFullYear()}
          </p>
        </div>

        {/* Social Links on separate row, aligned right */}
        <div className="flex items-center justify-center md:justify-end gap-6 pt-6 border-t border-[#ededed]/50">
          <a
            href="https://www.instagram.com/simonchusseau/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/simon-chusseau-91541a378/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/Simonc44"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default Index;
