import React, { useState } from "react";

const About = () => {
  const [showLinkedinCard, setShowLinkedinCard] = useState(true);

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-white flex items-center border-t border-[#ededed]">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* Left Side — iPhone loop GIF */}
        <div className="flex-1 max-w-sm flex justify-center">
          <img
            src="/instaLoop.gif"
            alt="Iphone Loop GIF"
            className="w-[80%] max-w-[280px] object-contain drop-shadow-xl rotate-[3deg] hover:rotate-[2deg] hover:scale-[1.025] transition-transform duration-500 cursor-pointer"
          />
        </div>

        {/* Right Side — Biography and social QR / profile window */}
        <div className="flex-1 flex flex-col items-start space-y-6">
          <h2 className="text-4xl font-bold font-garamond-bold text-black flex items-center">
            About Me <span className="text-[#f5576c] ml-1 font-bold font-garamond-bold">.</span>
          </h2>

          <div className="text-gray-500 font-garamond-regular text-lg leading-relaxed space-y-4">
            <p>
              I&#39;m a self-taught developer and entrepreneur obsessed with shipping things that matter. I build full-stack web products at the intersection of AI, civic tech, and developer tooling.
            </p>
            <p>
              Currently leading the development of CygnisAI — an intelligent platform connecting your data to advanced AI agents — and building open-source projects like Mandat (re-defining Civic Tech).
            </p>
            <p>
              I keeps a keen interest in modern user experiences, clean design, and the bleeding edge of AI technologies.
            </p>
          </div>

          <p className="font-cartoon text-2xl text-[#f5576c] rotate-[-2deg] mt-4 self-start pl-4">
            ~ Hey, That&#39;s me!
          </p>

          {/* LinkedIn QR / ID Card */}
          {showLinkedinCard ? (
            <div className="w-full max-w-md border-2 border-gray-200 rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.08)] bg-white hover:rotate-[-1deg] hover:scale-[1.015] transition-all duration-300 overflow-hidden font-mono mt-4">
              {/* Window controls header bar */}
              <div className="bg-[#ededed] px-4 py-2 border-b border-gray-200 flex items-center gap-1.5">
                <span onClick={() => setShowLinkedinCard(false)} className="w-3.5 h-3.5 rounded-full bg-[#FE5E58] flex items-center justify-center text-[8px] font-bold text-red-800 cursor-pointer select-none">×</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#FEBD2C]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#27C841]" />
              </div>

              {/* LinkedIn ID Info & Placeholder QR */}
              <a href="https://www.linkedin.com/in/simon-chusseau-91541a378/" target="_blank" rel="noopener noreferrer" className="block p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-6">
                  {/* Avatar / Photo */}
                  <img src="/profile.png" alt="Simon QR" className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-lg text-black font-garamond-bold">@simon-chusseau</h4>
                    <p className="text-gray-400 font-garamond-regular text-sm mt-0.5">Let&#39;s connect on LinkedIn!</p>
                  </div>
                </div>
              </a>
            </div>
          ) : (
            <div className="h-4" />
          )}

        </div>

      </div>
    </section>
  );
};

export default About;
