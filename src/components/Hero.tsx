import React, { useState } from "react";

const Hero = () => {
  const [showResults, setShowResults] = useState(true);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-12 px-6 md:px-12 bg-white flex items-center">
      <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Side — Intro text, dynamic switching header, CTA buttons, ID Card */}
        <div className="flex-1 w-full flex flex-col items-start space-y-6 relative">

          {/* Dynamic Cycling Header */}
          <div className="text-3xl md:text-4xl font-bold font-garamond-bold text-black h-12 flex items-center">
            <span className="hero-switching-text"></span>
            <span className="text-[#006AFF] ml-1 font-bold font-garamond-bold"> .</span>
          </div>

          {/* GIF Text Bubble that disappears after 2.5s */}
          <div className="text-bubble-container absolute -top-8 left-0 z-20 pointer-events-none">
            <img src="/textbubble.gif" alt="Welcome bubble" className="w-[300px] text-bubble-gif" />
          </div>

          {/* Self-taught Web Developer text (faded in after 2.5s) */}
          <div className="delayed-intro-text text-gray-500 font-garamond-regular text-lg max-w-lg leading-relaxed">
            <p>
              Hey There! I am Simon Chusseau - A Self Taught Developer, founder of Mandat and CygnisAI. Welcome to my Professional Portfolio.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href="#contact"
                onClick={scrollToSection("contact")}
                className="px-6 py-3 bg-[#006AFF] text-white font-semibold font-garamond-regular rounded-full hover:bg-white hover:text-black border border-[#006AFF] shadow-[0_3px_5px_rgba(0,106,255,0.4)] hover:shadow-[0_3px_10px_rgba(173,216,230,0.5)] transition-all duration-300"
              >
                Connect Now
              </a>
              <a
                href="#projects"
                onClick={scrollToSection("projects")}
                className="px-6 py-3 bg-white text-gray-800 font-semibold font-garamond-regular rounded-full hover:bg-[#006AFF] hover:text-white border border-[#ededed] hover:border-[#006AFF] shadow-[0_3px_10px_rgba(173,216,230,0.3)] hover:shadow-[0_3px_5px_rgba(0,106,255,0.4)] transition-all duration-300"
              >
                My Projects
              </a>
            </div>
          </div>

          {/* Profile ID Card with macOS controls */}
          {showResults ? (
            <div className="w-full max-w-sm mt-8 border-2 border-gray-200 rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.08)] bg-white hover:rotate-[-1deg] hover:scale-[1.015] transition-all duration-300 overflow-hidden font-mono">
              {/* Window controls header bar */}
              <div className="bg-[#ededed] px-4 py-2 border-b border-gray-200 flex items-center gap-1.5">
                <span onClick={() => setShowResults(false)} className="w-3.5 h-3.5 rounded-full bg-[#FE5E58] flex items-center justify-center text-[8px] font-bold text-red-800 cursor-pointer select-none">×</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#FEBD2C]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#27C841]" />
              </div>

              {/* ID Body */}
              <div className="p-5 flex items-center gap-4">
                <img src="/profile.png" alt="Simon Chusseau" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                <div>
                  <h3 className="font-bold text-xl text-black font-garamond-bold">Simon Chusseau</h3>
                  <p className="text-gray-400 font-garamond-regular text-sm mt-0.5">Founder @ Mandat & CygnisAI</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-4" />
          )}

        </div>

        {/* Right Side — Overlapping Premium CSS-based device mockups of Simon's real projects */}
        <div className="flex-1 w-full max-w-md md:max-w-xl relative flex justify-center py-12 select-none">
          {/* Overlapping CSS MacBook style frame */}
          <div className="relative w-full aspect-[16/10] max-w-[480px] bg-slate-900 rounded-2xl p-1.5 pb-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:rotate-[-1deg] hover:scale-[1.015] transition-transform duration-500">
            {/* Display screen */}
            <div className="w-full h-full bg-black rounded-lg overflow-hidden flex flex-col border border-slate-800">
              {/* Browser window top bar */}
              <div className="bg-[#121212] px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FE5E58]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBD2C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C841]" />
                </div>
                <div className="bg-[#1e1e1e] text-[9px] text-gray-400 px-4 py-0.5 rounded-md w-1/2 text-center truncate font-mono select-none">
                  cygnis-ai.fr
                </div>
                <div className="w-10" />
              </div>
              {/* Screenshot body */}
              <div className="flex-1 overflow-hidden relative bg-black">
                <img src="/cygnis-home.png" alt="CygnisAI" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            {/* Keyboard hinge aesthetic */}
            <div className="absolute -bottom-1 left-4 right-4 h-1.5 bg-slate-700 rounded-b" />

            {/* CSS-based iPhone Mockup overlapping */}
            <div className="absolute -left-12 -bottom-6 w-[42%] z-10 aspect-[9/19.5] bg-slate-950 rounded-[32px] p-1.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border-[3px] border-slate-800 hover:rotate-[2deg] hover:scale-[1.025] transition-transform duration-500">
              <div className="w-full h-full bg-[#050505] rounded-[26px] overflow-hidden flex flex-col relative border border-slate-900">
                {/* Dynamic Island Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/3 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#1a1a1a] rounded-full absolute right-2" />
                </div>
                {/* Status Bar */}
                <div className="h-5 bg-black px-3 pt-1 flex justify-between items-center text-[7px] text-white font-semibold select-none z-10">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>5G</span>
                  </div>
                </div>
                {/* App Screen Content */}
                <div className="flex-1 overflow-hidden relative bg-black">
                  <img src="/cygnis-chat.png" alt="Cygnis Chat" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* cartoon helper text above */}
            <span className="absolute -top-8 -right-4 font-cartoon text-orange-500 text-xl md:text-2xl rotate-[5deg] hidden md:inline-block z-20">
              More of such interesting projects ~
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
