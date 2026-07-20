import { useState } from "react";
import { X, Menu } from "lucide-react";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#ededed] h-16 flex items-center justify-between px-6 md:px-12">
      {/* Logo */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="text-2xl font-bold font-garamond-bold text-black hover:opacity-80 transition-opacity"
      >
        Portfolio <span className="text-[#FE5E58]">.</span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { name: "About", id: "about" },
          { name: "Skills", id: "skills" },
          { name: "Projects", id: "projects" },
          { name: "Socials", id: "socials" },
        ].map((item) => (
          <a
            key={item.name}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black hover:bg-[#f2f2f2] rounded-lg transition-all duration-200"
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Mobile Burger Menu Icon */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-6 h-6 text-[#333333]" /> : <Menu className="w-6 h-6 text-[#333333]" />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden bg-white/95 backdrop-blur-md flex flex-col p-6 space-y-4 border-t border-[#ededed]">
          {/* Logo / Avatar top-side drawer components from the reference */}
          <div className="flex flex-col items-center pb-6 border-b border-[#ededed]/50">
            <img
              src="/profile.png"
              alt="Simon Chusseau"
              className="w-24 h-24 rounded-full object-cover border border-[#ededed] shadow-sm mb-3"
            />
            <span className="font-semibold text-sm text-gray-800 font-garamond-bold">Simon Chusseau</span>
          </div>

          {[
            { name: "About", id: "about" },
            { name: "Skills", id: "skills" },
            { name: "Projects", id: "projects" },
            { name: "Socials", id: "socials" },
          ].map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="block px-4 py-3 text-lg font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
